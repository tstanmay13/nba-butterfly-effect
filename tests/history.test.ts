import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { Archive, StoryData } from '../lib/model';
import {
  assetJourney,
  assetLabel,
  compareEvents,
  eventAssets,
  identityFamily,
  initialState,
  isProtected,
  linksBetween,
  ownership,
  parseState,
  stateQuery,
  teamName,
  visibleEvents,
  withEvent,
} from '../lib/history';
const archive = JSON.parse(
  readFileSync('data/archive.json', 'utf8'),
) as Archive;
const story = (id: string) =>
  JSON.parse(readFileSync(`public/data/${id}.json`, 'utf8')) as StoryData;
const event = (id: string) => archive.transactions.find((t) => t.id === id)!;
void test('all published stories pass ownership checks at every timeline prefix', () => {
  for (const s of archive.stories) {
    const d = story(s.id);
    for (const t of d.transactions)
      assert.doesNotThrow(
        () => ownership(visibleEvents(d, t.id)),
        `${s.id}/${t.id}`,
      );
  }
});
void test('known ownership cannot jump franchises', () => {
  const first = event('luka-draft-trade'),
    second = structuredClone(event('luka-lakers'));
  second.moves.find((m) => m.asset === 'luka')!.from = 'ATL';
  assert.throws(() => ownership([first, second]), /held by DAL/);
});
void test('the three-team Luka exchange includes Utah and both cash recipients', () => {
  const t = event('luka-lakers');
  assert.deepEqual(new Set(t.teams), new Set(['DAL', 'LAL', 'UTA']));
  assert.deepEqual(
    t.moves
      .filter((m) => m.to === 'UTA')
      .map((m) => m.asset)
      .sort(),
    ['dal25-second', 'hood-schifino', 'lac25-second'],
  );
  assert.deepEqual(
    t.moves
      .filter((m) => m.from === 'UTA')
      .map((m) => m.to)
      .sort(),
    ['DAL', 'LAL'],
  );
});
void test('the final Butler package retains all five participants', () => {
  const t = event('butler-warriors');
  assert.equal(t.teams.length, 5);
  for (const id of t.teams) assert.ok(t.moves.some((m) => m.to === id));
  assert.equal(
    t.moves.filter(
      (m) => m.to === 'GSW' && archive.assets[m.asset].kind === 'obligation',
    ).length,
    2,
  );
});
void test('draft rights change form without changing the player identity', () => {
  const luka = story('luka');
  assert.equal(
    ownership(visibleEvents(luka, 'luka-draft-trade')).get('luka')?.form,
    'rights',
  );
  assert.equal(
    ownership(visibleEvents(luka, 'luka-lakers')).get('luka')?.form,
    'player',
  );
});
void test('a protected obligation becomes a separate actual pick, then rights', () => {
  const d = story('luka'),
    before = ownership(visibleEvents(d, 'luka-draft-trade')),
    after = ownership(visibleEvents(d, 'reddish-draft'));
  assert.equal(before.get('dal19')?.status, 'held');
  assert.equal(before.has('reddish'), false);
  assert.equal(after.get('dal19')?.status, 'converted');
  assert.equal(after.get('pick-2019-DAL-1-10')?.status, 'converted');
  assert.equal(after.get('reddish')?.team, 'ATL');
  assert.equal(after.get('reddish')?.form, 'rights');
});
void test('protections check both sides of their boundary and unknown years stay unknown', () => {
  assert.equal(isProtected(archive.assets.dal19, 2019, 5), true);
  assert.equal(isProtected(archive.assets.dal19, 2019, 10), false);
  assert.equal(isProtected(archive.assets.dal19, 2023, 1), false);
  assert.equal(isProtected(archive.assets.dal19, 2024, 1), null);
  assert.equal(isProtected(archive.assets.lal21, 2021, 8), false);
  assert.equal(isProtected(archive.assets.lal21, 2021, 9), true);
});
void test('deferred first stays one obligation until conveyance', () => {
  const d = story('harden');
  const rolled = ownership(visibleEvents(d, 'dallas-pick-rolls'));
  assert.equal(rolled.get('dal13')?.status, 'deferred');
  assert.equal(rolled.get('dal13')?.team, 'OKC');
  const settled = ownership(d.transactions);
  assert.equal(settled.get('dal13')?.status, 'converted');
  assert.equal(settled.get('mcgary')?.team, 'OKC');
});
void test('swap exercises exchange both picks and keep the right distinct', () => {
  const t = event('boston-swap');
  assert.equal(t.moves.find((m) => m.asset === 'bkn17-pick')?.to, 'BOS');
  assert.equal(t.moves.find((m) => m.asset === 'bos17-pick')?.to, 'BKN');
  assert.equal(t.resolutions[0].asset, 'bkn17-swap');
  assert.equal(t.resolutions[0].status, 'exercised');
  assert.equal(
    ownership(story('brooklyn').transactions).get('bkn17-swap')?.status,
    'exercised',
  );
});
void test('returning Minnesota’s own obligation extinguishes Boston’s claim', () => {
  const t = event('garnett-boston');
  assert.equal(ownership([t]).get('min-return')?.status, 'extinguished');
  assert.equal(t.conversions.length, 0);
});
void test('same-day distinct deals remain in order', () => {
  const d = story('dirk');
  assert.deepEqual(
    d.transactions.slice(0, 2).map((t) => t.id),
    ['dirk-draft-trade', 'nash-dallas'],
  );
  assert.equal(compareEvents(d.transactions[0], d.transactions[1]), -1);
  assert.equal(ownership(d.transactions).get('garrity')?.team, 'PHX');
});
void test('an asset journey crosses conversions but never implies a whole package is its identity', () => {
  const d = story('luka');
  assert.deepEqual([...identityFamily(d, 'dal19')].sort(), [
    'dal19',
    'pick-2019-DAL-1-10',
    'reddish',
  ]);
  assert.deepEqual(
    assetJourney(d, 'dal19').map((t) => t.id),
    ['luka-draft-trade', 'reddish-draft', 'reddish-new-york', 'hart-new-york'],
  );
  assert.equal(identityFamily(d, 'luka').has('davis'), false);
});
void test('map links name actual shared assets, including separate converging branches', () => {
  const d = story('luka'),
    links = linksBetween(d.transactions);
  assert.deepEqual(links.find((l) => l.to === 'davis-wizards')?.assets, [
    'davis',
  ]);
  assert.equal(
    links.some((l) => l.from === 'trae-wizards' && l.to === 'davis-wizards'),
    false,
  );
  assert.equal(
    links.find((l) => l.to === 'trae-wizards')?.assets.includes('trae'),
    true,
  );
});
void test('shared stories reference the same canonical transaction; duplicate movements are rejected', () => {
  assert.deepEqual(
    story('luka').transactions.find((t) => t.id === 'luka-lakers'),
    story('davis').transactions.find((t) => t.id === 'luka-lakers'),
  );
  const t = structuredClone(event('luka-draft-trade'));
  t.moves.push(t.moves[0]);
  assert.throws(() => ownership([t]), /duplicate transfer/);
});
void test('timeline filtering excludes future transactions and their assets', () => {
  const d = story('luka');
  const v = visibleEvents(d, 'reddish-draft');
  assert.equal(v.length, 2);
  assert.ok(!v.flatMap((t) => [...eventAssets(t)]).includes('davis'));
  assert.ok(v.every((t) => t.date <= '2019-06-20'));
});
void test('outstanding obligations stay unresolved at the explicit coverage boundary', () => {
  const d = story('kawhi'),
    l = ownership(d.transactions);
  assert.equal(d.story.cutoff, '2024-06-26');
  assert.equal(l.get('min31')?.status, 'held');
  assert.equal(l.get('min30-swap')?.status, 'held');
  assert.equal(l.has('pick-2031-MIN-1-1'), false);
});
void test('shared URL restores story, date, same-day step, node, team and mode', () => {
  const d = story('dirk');
  const s = {
    ...withEvent(initialState(d), d, 'nash-dallas'),
    node: 'garrity',
    team: 'PHX',
    mode: 'map' as const,
  };
  assert.deepEqual(parseState(stateQuery(s), d), s);
  const early = { ...initialState(d), node: 'dirk' };
  assert.deepEqual(parseState(stateQuery(early), d), early);
});
void test('malformed URLs clamp to a published event and cannot expose future nodes', () => {
  const d = story('luka');
  assert.equal(
    parseState('?at=2018-06-21&node=davis&team=NOTREAL', d).node,
    null,
  );
  assert.equal(parseState('?at=1900-01-01', d).step, 'luka-draft-trade');
  assert.equal(
    parseState('?at=2099-01-01&step=missing', d).step,
    'davis-wizards',
  );
  assert.equal(parseState('?at=bad&mode=unknown', d).mode, 'trade');
  assert.equal(
    parseState('?at=2018-06-21&step=luka-lakers', d).step,
    'luka-draft-trade',
  );
});
void test('franchise names reflect the scene date', () => {
  const d = story('harden');
  assert.equal(teamName(d, 'CHA', '2013-06-27'), 'Charlotte Bobcats');
  assert.equal(teamName(d, 'CHA', '2025-01-01'), 'Charlotte Hornets');
});
void test('all facts in the public event graph have reviewed source references', () => {
  for (const t of archive.transactions) {
    assert.equal(t.verified, 'verified');
    assert.equal(t.reviewed, '2026-09-08');
    assert.ok(t.sources.length);
    for (const s of t.sources)
      assert.ok(archive.sources[s]?.url.startsWith('https://'));
  }
});

void test('retired player rights remain distinct from draft rights and active players', () => {
  const trade = event('wilt-philadelphia');
  const rights = trade.moves.find((m) => m.asset === 'shaffer')!;
  assert.equal(rights.form, 'player-rights');
  assert.equal(
    assetLabel(archive.assets.shaffer, rights.form),
    'Player rights',
  );
  assert.equal(ownership([trade]).get('shaffer')?.form, 'player-rights');
  assert.equal(
    teamName(story('wilt'), 'GSW', trade.date),
    'San Francisco Warriors',
  );
  assert.equal(
    teamName(story('wilt'), 'PHI', trade.date),
    'Philadelphia 76ers',
  );
});
