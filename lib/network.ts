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
/** Deterministic spring layout, calculated once after the optional archive loads. */
export function layoutNetwork(archive: Archive): NetworkLayout {
  const events = [...archive.transactions].sort(compareEvents),
    links = linksBetween(events),
    width = 2500,
    height = Math.max(1300, events.length * 22);
  const min = Number(events[0].date.slice(0, 4)),
    max = Number(events.at(-1)!.date.slice(0, 4));
  const hash = (id: string) =>
    id.split('').reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 2166136261);
  const nodes = events.map((event) => ({
    id: event.id,
    event,
    x:
      180 +
      ((Number(event.date.slice(0, 4)) - min) / (max - min || 1)) *
        (width - 360),
    y: 120 + (hash(event.id) % (height - 240)),
  }));
  const byId = new Map(nodes.map((n) => [n.id, n]));
  for (let iteration = 0; iteration < 380; iteration++) {
    const force = new Map(nodes.map((n) => [n.id, { x: 0, y: 0 }]));
    for (let i = 0; i < nodes.length; i++)
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i],
          b = nodes[j];
        let dx = b.x - a.x,
          dy = b.y - a.y;
        if (Math.abs(dx) + Math.abs(dy) < 0.1) {
          dx = 0.1;
          dy = 0.1;
        }
        const sq = Math.max(dx * dx + dy * dy, 100),
          distance = Math.sqrt(sq);
        const push = Math.min(14, 36000 / sq);
        const fx = (dx / distance) * push,
          fy = (dy / distance) * push;
        force.get(a.id)!.x -= fx;
        force.get(a.id)!.y -= fy;
        force.get(b.id)!.x += fx;
        force.get(b.id)!.y += fy;
        if (Math.abs(dx) < 230 && Math.abs(dy) < 112) {
          const pushY = (112 - Math.abs(dy)) * 0.22 * (dy >= 0 ? 1 : -1);
          force.get(a.id)!.y -= pushY;
          force.get(b.id)!.y += pushY;
        }
      }
    for (const link of links) {
      const a = byId.get(link.from)!,
        b = byId.get(link.to)!,
        dx = b.x - a.x,
        dy = b.y - a.y,
        dist = Math.max(1, Math.hypot(dx, dy)),
        strength = (dist - 310) * 0.012;
      force.get(a.id)!.x += (dx / dist) * strength;
      force.get(a.id)!.y += (dy / dist) * strength;
      force.get(b.id)!.x -= (dx / dist) * strength;
      force.get(b.id)!.y -= (dy / dist) * strength;
    }
    for (const n of nodes) {
      const target =
        180 +
        ((Number(n.event.date.slice(0, 4)) - min) / (max - min || 1)) *
          (width - 360);
      const f = force.get(n.id)!;
      n.x = Math.max(
        130,
        Math.min(
          width - 130,
          n.x + Math.max(-18, Math.min(18, f.x + (target - n.x) * 0.006)),
        ),
      );
      n.y = Math.max(
        80,
        Math.min(height - 80, n.y + Math.max(-18, Math.min(18, f.y))),
      );
    }
  }
  return { nodes, links, width, height };
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
    width: 1320,
    height,
    nodes: [
      ...wing(before, 150),
      { ...center, x: 660, y: height / 2 },
      ...wing(after, 1170),
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
