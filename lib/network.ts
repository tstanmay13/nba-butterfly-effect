import type { Archive, Transaction } from './model';
import { compareEvents, eventAssets, linksBetween } from './history';
import { normalizeSearch } from './search';
export interface NetworkNode {
  id: string;
  x: number;
  y: number;
  event: Transaction;
}
export interface NetworkLink {
  from: string;
  to: string;
  assets: string[];
  gaps: string[];
}
export interface NetworkLayout {
  nodes: NetworkNode[];
  links: NetworkLink[];
  width: number;
  height: number;
}
/** Stable, collision-free year columns. The overview groups these into eras;
 * the detailed butterfly lays out only the selected package and its neighbors. */
export function layoutNetwork(archive: Archive): NetworkLayout {
  const events = [...archive.transactions].sort(compareEvents);
  const years = [...new Set(events.map((t) => t.date.slice(0, 4)))];
  const rows = new Map<string, number>();
  const nodes = events.map((event) => {
    const year = event.date.slice(0, 4);
    const row = rows.get(year) || 0;
    rows.set(year, row + 1);
    return {
      id: event.id,
      event,
      x: 160 + years.indexOf(year) * 320,
      y: 110 + row * 130,
    };
  });
  return {
    nodes,
    links: linksBetween(events),
    width: Math.max(640, years.length * 320),
    height: Math.max(360, Math.max(...rows.values()) * 130 + 90),
  };
}
export function archiveEras(layout: NetworkLayout) {
  const groups = new Map<number, NetworkNode[]>();
  for (const node of layout.nodes) {
    const decade = Math.floor(Number(node.event.date.slice(0, 4)) / 10) * 10;
    groups.set(decade, [...(groups.get(decade) || []), node]);
  }
  return [...groups]
    .sort(([a], [b]) => a - b)
    .map(([decade, nodes]) => ({ decade, nodes }));
}
export function neighborhood(
  layout: NetworkLayout,
  selected: string | null,
  hops = 1,
) {
  if (!selected) return new Set(layout.nodes.map((n) => n.id));
  const reached = new Set([selected]);
  for (let i = 0; i < hops; i++) {
    const current = new Set(reached);
    for (const l of layout.links) {
      if (current.has(l.from)) reached.add(l.to);
      if (current.has(l.to)) reached.add(l.from);
    }
  }
  return reached;
}
export function networkAt(layout: NetworkLayout, date: string) {
  const nodes = layout.nodes.filter((n) => n.event.date <= date),
    ids = new Set(nodes.map((n) => n.id));
  return {
    ...layout,
    nodes,
    links: layout.links.filter((l) => ids.has(l.from) && ids.has(l.to)),
  };
}
/** A readable butterfly around one complete package: earlier left, later right.
 * Only direct shared-asset edges are drawn; neighbors are never connected by
 * proximity or by being in the same story.
 */
export function focusedNetwork(
  layout: NetworkLayout,
  focus: string,
): NetworkLayout {
  const center = layout.nodes.find((n) => n.id === focus);
  if (!center) return { ...layout, nodes: [], links: [] };
  const links = layout.links.filter((l) => l.from === focus || l.to === focus);
  const beforeIds = new Set(
    links.filter((l) => l.to === focus).map((l) => l.from),
  );
  const afterIds = new Set(
    links.filter((l) => l.from === focus).map((l) => l.to),
  );
  const before = layout.nodes
    .filter((n) => beforeIds.has(n.id))
    .sort((a, b) => compareEvents(a.event, b.event));
  const after = layout.nodes
    .filter((n) => afterIds.has(n.id))
    .sort((a, b) => compareEvents(a.event, b.event));
  const height = Math.max(
    360,
    Math.max(before.length, after.length) * 120 + 140,
  );
  const wing = (nodes: NetworkNode[], x: number) =>
    nodes.map((n, i) => ({
      ...n,
      x,
      y: height / 2 + (i - (nodes.length - 1) / 2) * 120,
    }));
  return {
    width: 1140,
    height,
    nodes: [
      ...wing(before, 150),
      { ...center, x: 570, y: height / 2 },
      ...wing(after, 990),
    ],
    links,
  };
}
export function searchNetwork(
  archive: Archive,
  events: Transaction[],
  query: string,
) {
  const needle = normalizeSearch(query);
  if (!needle) return new Set(events.map((t) => t.id));
  return new Set(
    events
      .filter((t) =>
        normalizeSearch(
          `${t.title} ${t.shortTitle} ${t.date} ${t.teams.join(' ')} ${t.teams.map((id) => archive.teams[id].name).join(' ')} ${[...eventAssets(t)].map((id) => archive.assets[id].name).join(' ')}`,
        ).includes(needle),
      )
      .map((t) => t.id),
  );
}
