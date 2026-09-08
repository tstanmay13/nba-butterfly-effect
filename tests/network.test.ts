import { searchStories } from '../lib/search';
import { readWebState, webStateQuery } from '../lib/web-state';
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import type { Archive } from '../lib/model';
import {
  layoutNetwork,
  focusedNetwork,
  neighborhood,
  networkAt,
  searchNetwork,
} from '../lib/network';
import { linksBetween } from '../lib/history';
const archive = JSON.parse(
  readFileSync('data/archive.json', 'utf8'),
) as Archive;
const layout = layoutNetwork(archive);
void test('global web includes every canonical event exactly once with finite positions', () => {
  assert.equal(layout.nodes.length, archive.transactions.length);
  assert.equal(
    new Set(layout.nodes.map((n) => n.id)).size,
    layout.nodes.length,
  );
  for (const n of layout.nodes) {
    assert.ok(Number.isFinite(n.x) && Number.isFinite(n.y));
    assert.ok(n.x >= 0 && n.x <= layout.width);
    assert.ok(n.y >= 0 && n.y <= layout.height);
  }
});
void test('web layout is deterministic across shared links and reloads', () => {
  assert.deepEqual(
    layoutNetwork(archive).nodes.map((n) => [n.id, n.x, n.y]),
    layout.nodes.map((n) => [n.id, n.x, n.y]),
  );
});
void test('rewinding the entire web hides both future nodes and their connections', () => {
  const past = networkAt(layout, '2018-06-21'),
    ids = new Set(past.nodes.map((n) => n.id));
  assert.ok(past.nodes.every((n) => n.event.date <= '2018-06-21'));
  assert.ok(!ids.has('luka-lakers'));
  assert.ok(past.links.every((l) => ids.has(l.from) && ids.has(l.to)));
});
void test('one-hop focus includes genuine adjacent trades, never an unrelated story by city alone', () => {
  const near = neighborhood(layout, 'luka-draft-trade');
  assert.ok(near.has('luka-lakers'));
  assert.ok(near.has('reddish-draft'));
  assert.ok(!near.has('dirk-draft-trade'));
});
void test('all-archive search finds players inside packages and exact years', () => {
  const result = searchNetwork(
    archive,
    archive.transactions,
    'Markieff Morris',
  );
  assert.ok(result.has('irving-dallas'));
  assert.ok(result.has('luka-lakers'));
  assert.ok(!result.has('dirk-draft-trade'));
  assert.equal(
    searchNetwork(archive, archive.transactions, 'zxqvnoresult').size,
    0,
  );
});
void test('unknown intervening ownership is marked as a gap instead of a false direct transfer', () => {
  const first = structuredClone(
      archive.transactions.find((t) => t.id === 'luka-draft-trade')!,
    ),
    second = structuredClone(
      archive.transactions.find((t) => t.id === 'luka-lakers')!,
    );
  second.moves.find((m) => m.asset === 'luka')!.from = 'BOS';
  const link = linksBetween([first, second]).find((l) =>
    l.assets.includes('luka'),
  );
  assert.deepEqual(link?.gaps, ['luka']);
});
void test('focused butterfly shows only the selected package and directly connected neighbors', () => {
  const web = focusedNetwork(layout, 'luka-draft-trade');
  assert.deepEqual(
    new Set(web.nodes.map((n) => n.id)),
    neighborhood(layout, 'luka-draft-trade'),
  );
  assert.ok(
    web.links.every(
      (l) => l.from === 'luka-draft-trade' || l.to === 'luka-draft-trade',
    ),
  );
  const center = web.nodes.find((n) => n.id === 'luka-draft-trade')!;
  for (const l of web.links) {
    const before = web.nodes.find((n) => n.id === l.from)!;
    const after = web.nodes.find((n) => n.id === l.to)!;
    assert.ok(before.x < after.x);
    assert.ok(before.event.date <= after.event.date);
  }
  assert.ok(center);
  assert.equal(
    new Set(web.nodes.map((n) => `${n.x},${n.y}`)).size,
    web.nodes.length,
  );
});
void test('focused view cannot recover connections hidden by the archive date', () => {
  const web = focusedNetwork(
    networkAt(layout, '2018-06-21'),
    'luka-draft-trade',
  );
  assert.equal(web.nodes.length, 1);
  assert.equal(web.links.length, 0);
  assert.equal(
    focusedNetwork(networkAt(layout, '1996-01-01'), 'luka-draft-trade').nodes
      .length,
    0,
  );
});
void test('web URLs preserve focused and entire-archive modes on reload', () => {
  const initial = readWebState('?view=web', archive);
  assert.equal(initial.focus, 'luka-draft-trade');
  assert.equal(initial.node, null);
  const focused = {
    ...initial,
    focus: 'luka-lakers',
    node: 'luka',
    team: 'DAL',
    query: '',
  };
  assert.deepEqual(readWebState(webStateQuery(focused), archive), focused);
  const overview = { ...initial, focus: null, node: null, query: 'Morris' };
  assert.deepEqual(readWebState(webStateQuery(overview), archive), overview);
  assert.equal(readWebState('?view=web&scope=all', archive).focus, null);
  const past = readWebState(
    '?view=web&at=1996-06-26&focus=luka-lakers&node=luka',
    archive,
  );
  assert.equal(past.focus, null);
  assert.equal(past.node, null);
});
void test('player search accepts unaccented names and franchise abbreviations', () => {
  assert.ok(
    searchNetwork(archive, archive.transactions, 'Doncic').has('luka-lakers'),
  );
  assert.ok(
    searchNetwork(archive, archive.transactions, 'LAL').has('luka-lakers'),
  );
  assert.ok(
    searchNetwork(archive, archive.transactions, 'Vasquez').has(
      'vasquez-milwaukee',
    ),
  );
});
void test('archive discovery indexes actual players behind editorial titles', () => {
  const catalog = JSON.parse(readFileSync('data/catalog.json', 'utf8'));
  assert.ok(
    searchStories(catalog, 'Carmelo Anthony').some((s) => s.id === 'carmelo'),
  );
  assert.ok(
    searchStories(catalog, 'Doncic', 'Dallas').some((s) => s.id === 'luka'),
  );
  assert.ok(
    searchStories(catalog, 'New Jersey', 'Classic').some(
      (s) => s.id === 'carter',
    ),
  );
});
