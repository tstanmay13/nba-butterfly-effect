import type { Archive } from './model';
import { eventAssets } from './history';
export interface WebState {
  at: string;
  node: string | null;
  focus: string | null;
  team: string;
  query: string;
  era: number | null;
}
function validDate(value: string | null): value is string {
  if (!value || !/^\d{4}-\d{2}-\d{2}$/.test(value)) return false;
  const date = new Date(value + 'T12:00:00Z');
  return (
    Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
}
export function readWebState(search: string, a: Archive): WebState {
  const p = new URLSearchParams(search),
    dates = a.transactions.map((t) => t.date).sort();
  const at = validDate(p.get('at')) ? p.get('at')! : dates.at(-1)!;
  const clamped =
    at < dates[0] ? dates[0] : at > dates.at(-1)! ? dates.at(-1)! : at;
  const visible = a.transactions.filter((t) => t.date <= clamped),
    available = new Set(visible.flatMap((t) => [t.id, ...eventAssets(t)]));
  const node = p.get('node');
  const focus = p.get('focus');
  return {
    at: clamped,
    node: node && available.has(node) ? node : null,
    focus: focus && visible.some((t) => t.id === focus) ? focus : null,
    team: a.teams[p.get('franchise') || ''] ? p.get('franchise')! : 'ALL',
    query: p.get('q') || '',
    era:
      p.get('era') &&
      /^\d{4}$/.test(p.get('era')!) &&
      visible.some(
        (t) =>
          Math.floor(Number(t.date.slice(0, 4)) / 10) * 10 ===
          Number(p.get('era')),
      )
        ? Number(p.get('era'))
        : null,
  };
}
export function webStateQuery(next: WebState) {
  const p = new URLSearchParams({ view: 'web', at: next.at });
  if (next.node) p.set('node', next.node);
  if (next.focus) p.set('focus', next.focus);
  else p.set('scope', 'all');
  if (next.team !== 'ALL') p.set('franchise', next.team);
  if (next.query) p.set('q', next.query);
  if (next.era !== null) p.set('era', String(next.era));
  return `?${p}`;
}
