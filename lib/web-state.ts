import type { Archive } from './model';
import { eventAssets } from './history';
export interface WebState {
  at: string;
  node: string | null;
  focus: string | null;
  team: string;
  query: string;
}
export function readWebState(search: string, a: Archive): WebState {
  const p = new URLSearchParams(search),
    dates = a.transactions.map((t) => t.date).sort();
  const at =
    p.get('at') && /^\d{4}-\d{2}-\d{2}$/.test(p.get('at')!)
      ? p.get('at')!
      : dates.at(-1)!;
  const clamped =
    at < dates[0] ? dates[0] : at > dates.at(-1)! ? dates.at(-1)! : at;
  const visible = a.transactions.filter((t) => t.date <= clamped),
    available = new Set(visible.flatMap((t) => [t.id, ...eventAssets(t)]));
  const node = p.get('node');
  const focus =
    p.get('focus') ||
    (p.get('scope') !== 'all' && !p.get('q') && !p.get('franchise')
      ? visible.find((t) => t.id === 'luka-draft-trade')?.id || visible[0]?.id
      : null);
  return {
    at: clamped,
    node: node && available.has(node) ? node : null,
    focus: focus && visible.some((t) => t.id === focus) ? focus : null,
    team: a.teams[p.get('franchise') || ''] ? p.get('franchise')! : 'ALL',
    query: p.get('q') || '',
  };
}
export function webStateQuery(next: WebState) {
  const p = new URLSearchParams({ view: 'web', at: next.at });
  if (next.node) p.set('node', next.node);
  if (next.focus) p.set('focus', next.focus);
  else p.set('scope', 'all');
  if (next.team !== 'ALL') p.set('franchise', next.team);
  if (next.query) p.set('q', next.query);
  return `?${p}`;
}
