import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import type { Archive, StoryData } from '../lib/model';
import { compareEvents, eventAssets, ownership } from '../lib/history';
const a = JSON.parse(readFileSync('data/archive.json', 'utf8')) as Archive;
const assert = (ok: unknown, message: string) => {
  if (!ok) throw Error(message);
};
for (const [name, items] of [
  ['transactions', a.transactions],
  ['stories', a.stories],
] as const)
  assert(
    new Set(items.map((x) => x.id)).size === items.length,
    `Duplicate ${name}`,
  );
for (const t of a.transactions) {
  assert(
    /^\d{4}-\d{2}-\d{2}$/.test(t.date) && t.date <= a.reviewed,
    `Invalid effective date ${t.id}`,
  );
  assert(
    t.sources.length > 0 && t.verified === 'verified',
    `Unverified ${t.id}`,
  );
  for (const ref of t.sources) assert(a.sources[ref], `Unknown source ${ref}`);
  for (const id of eventAssets(t)) assert(a.assets[id], `Unknown asset ${id}`);
  for (const m of t.moves)
    assert(
      t.teams.includes(m.from) && t.teams.includes(m.to) && m.from !== m.to,
      `Invalid participant ${t.id}`,
    );
  for (const team of t.teams) assert(a.teams[team], `Unknown team ${team}`);
}
mkdirSync('public/data', { recursive: true });
for (const story of a.stories) {
  assert(story.transactions.includes(story.root), `Missing root ${story.id}`);
  const transactions = story.transactions
    .map((id) => {
      const t = a.transactions.find((x) => x.id === id);
      assert(t, `Missing event ${id}`);
      return t!;
    })
    .sort(compareEvents);
  assert(
    new Set(story.transactions).size === story.transactions.length,
    `Duplicate branch ${story.id}`,
  );
  ownership(transactions);
  const assetIds = new Set(transactions.flatMap((t) => [...eventAssets(t)]));
  const sourceIds = new Set(transactions.flatMap((t) => t.sources));
  const data: StoryData = {
    schemaVersion: 1,
    story,
    teams: a.teams,
    assets: Object.fromEntries([...assetIds].map((id) => [id, a.assets[id]])),
    sources: Object.fromEntries(
      [...sourceIds].map((id) => [id, a.sources[id]]),
    ),
    transactions,
  };
  const json = JSON.stringify(data);
  writeFileSync(`public/data/${story.id}.json`, json + '\n');
  if (story.id === 'luka') writeFileSync('data/initial.json', json + '\n');
}
writeFileSync('public/data/universe.json', JSON.stringify(a) + '\n');
writeFileSync(
  'data/metadata.json',
  JSON.stringify({
    events: a.transactions.length,
    stories: a.stories.length,
    sources: Object.keys(a.sources).length,
    reviewed: a.reviewed,
  }) + '\n',
);
const catalog = a.stories.map((story) => {
  const events = a.transactions.filter((t) =>
    story.transactions.includes(t.id),
  );
  const assets = new Set(events.flatMap((t) => [...eventAssets(t)]));
  const teams = new Set(events.flatMap((t) => t.teams));
  const searchText = [...assets]
    .map((id) => a.assets[id].name)
    .concat(
      [...teams].flatMap((id) => [
        id,
        a.teams[id].name,
        ...(a.teams[id].aliases || []).map((x) => x.name),
      ]),
      events.map((t) => t.date.slice(0, 4)),
    )
    .join(' ');
  return { ...story, searchText };
});
writeFileSync('data/catalog.json', JSON.stringify(catalog, null, 2) + '\n');
console.log(
  `Verified and published ${a.stories.length} story files / ${a.transactions.length} canonical events.`,
);
