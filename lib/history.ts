import type { Asset, StoryData, Transaction, ViewState } from './model';
export const compareEvents = (a: Transaction, b: Transaction) =>
  a.date.localeCompare(b.date) || a.order - b.order || a.id.localeCompare(b.id);
export const eventAssets = (t: Transaction) =>
  new Set([
    ...t.moves.map((m) => m.asset),
    ...t.conversions.flatMap((c) => [c.from, c.to]),
    ...t.resolutions.map((r) => r.asset),
  ]);
export function visibleEvents(data: StoryData, step: string) {
  const i = data.transactions.findIndex((t) => t.id === step);
  return data.transactions.slice(0, Math.max(0, i) + 1);
}
export function eventIndex(data: StoryData, step: string) {
  return Math.max(
    0,
    data.transactions.findIndex((t) => t.id === step),
  );
}
export function initialState(data: StoryData): ViewState {
  const t = data.transactions.find((t) => t.id === data.story.root)!;
  return {
    story: data.story.id,
    at: t.date,
    step: t.id,
    node: null,
    team: t.teams.includes(data.story.focus) ? data.story.focus : t.teams[0],
    mode: 'trade',
  };
}
export function parseState(search: string, data: StoryData): ViewState {
  const p = new URLSearchParams(search),
    base = initialState(data);
  const date = p.get('at');
  let tx =
    date && /^\d{4}-\d{2}-\d{2}$/.test(date)
      ? data.transactions.filter((t) => t.date <= date).at(-1) ||
        data.transactions[0]
      : data.transactions.find((t) => t.id === base.step)!;
  const explicit = data.transactions.find((t) => t.id === p.get('step'));
  if (explicit && (!date || explicit.date <= date)) tx = explicit;
  const visible = visibleEvents(data, tx.id),
    node = p.get('node');
  const allowed = new Set(visible.flatMap((t) => [t.id, ...eventAssets(t)]));
  return {
    story: data.story.id,
    at: tx.date,
    step: tx.id,
    node: node && allowed.has(node) ? node : null,
    team: tx.teams.includes(p.get('team') || '')
      ? p.get('team')!
      : tx.teams.includes(data.story.focus)
        ? data.story.focus
        : tx.teams[0],
    mode: p.get('mode') === 'map' ? 'map' : 'trade',
  };
}
export function stateQuery(s: ViewState) {
  const p = new URLSearchParams({
    story: s.story,
    at: s.at,
    step: s.step,
    team: s.team,
    mode: s.mode,
  });
  if (s.node) p.set('node', s.node);
  return `?${p}`;
}
export function withEvent(
  state: ViewState,
  data: StoryData,
  id: string,
): ViewState {
  const t = data.transactions.find((t) => t.id === id);
  if (!t) return state;
  return {
    ...state,
    step: id,
    at: t.date,
    node: null,
    team: t.teams.includes(state.team)
      ? state.team
      : t.teams.includes(data.story.focus)
        ? data.story.focus
        : t.teams[0],
  };
}
export function isProtected(
  asset: Asset,
  year: number,
  position: number,
): boolean | null {
  const stage = asset.protection?.find((p) => p.year === year);
  return stage
    ? stage.protectedRanges.some(([lo, hi]) => position >= lo && position <= hi)
    : null;
}
export type Holding = {
  team: string;
  status:
    | 'held'
    | 'converted'
    | 'exercised'
    | 'not-exercised'
    | 'extinguished'
    | 'deferred';
  event: string;
  form?: string;
};
/** Unknown initial owners are explicit archive boundaries. Known owners may never teleport. */
export function ownership(events: Transaction[]) {
  const ledger = new Map<string, Holding>();
  for (const t of [...events].sort(compareEvents)) {
    const seen = new Set<string>();
    for (const m of t.moves) {
      if (seen.has(m.asset))
        throw Error(`${t.id}: duplicate transfer of ${m.asset}`);
      seen.add(m.asset);
      const prev = ledger.get(m.asset);
      if (prev && prev.team !== m.from)
        throw Error(`${t.id}: ${m.asset} held by ${prev.team}, not ${m.from}`);
      if (
        prev &&
        ['converted', 'extinguished', 'exercised'].includes(prev.status)
      )
        throw Error(`${t.id}: inactive asset ${m.asset}`);
      ledger.set(m.asset, {
        team: m.to,
        status: 'held',
        event: t.id,
        form: m.form || 'player',
      });
    }
    for (const c of t.conversions) {
      const prev = ledger.get(c.from);
      if (prev && prev.team !== c.team)
        throw Error(`${t.id}: conversion owner mismatch for ${c.from}`);
      if (prev?.status === 'converted' || prev?.status === 'extinguished')
        throw Error(`${t.id}: duplicate conversion ${c.from}`);
      ledger.set(c.from, { team: c.team, status: 'converted', event: t.id });
      if (ledger.has(c.to))
        throw Error(`${t.id}: duplicate created asset ${c.to}`);
      ledger.set(c.to, {
        team: c.team,
        status: 'held',
        event: t.id,
        form: c.kind === 'selection' ? 'rights' : undefined,
      });
    }
    for (const r of t.resolutions) {
      const prev = ledger.get(r.asset);
      ledger.set(r.asset, {
        team: prev?.team || t.teams[0],
        status: r.status,
        event: t.id,
      });
    }
  }
  return ledger;
}
/** Only identity-preserving transformations join asset history; trade packages never do. */
export function identityFamily(data: StoryData, id: string) {
  const set = new Set([id]);
  let changed = true;
  while (changed) {
    changed = false;
    for (const t of data.transactions)
      for (const c of t.conversions)
        if (set.has(c.from) || set.has(c.to)) {
          for (const x of [c.from, c.to])
            if (!set.has(x)) {
              set.add(x);
              changed = true;
            }
        }
  }
  return set;
}
export function assetJourney(data: StoryData, id: string) {
  const family = identityFamily(data, id);
  return data.transactions.filter((t) =>
    [...eventAssets(t)].some((a) => family.has(a)),
  );
}
export function latestRecordedHolding(
  events: Transaction[],
  id: string,
): Holding | undefined {
  let holding: Holding | undefined;
  for (const t of events) {
    for (const m of t.moves)
      if (m.asset === id)
        holding = {
          team: m.to,
          status: 'held',
          event: t.id,
          form: m.form || 'player',
        };
    for (const c of t.conversions) {
      if (c.from === id)
        holding = { team: c.team, status: 'converted', event: t.id };
      if (c.to === id)
        holding = {
          team: c.team,
          status: 'held',
          event: t.id,
          form: c.kind === 'selection' ? 'rights' : undefined,
        };
    }
    for (const r of t.resolutions)
      if (r.asset === id)
        holding = {
          team: holding?.team || t.teams[0],
          status: r.status,
          event: t.id,
        };
  }
  return holding;
}
export function linksBetween(events: Transaction[]) {
  const links: {
    from: string;
    to: string;
    assets: string[];
    gaps: string[];
  }[] = [];
  const last = new Map<string, { event: string; team?: string }>();
  for (const t of events) {
    const grouped = new Map<string, { assets: string[]; gaps: string[] }>();
    for (const a of eventAssets(t)) {
      const prior = last.get(a);
      if (prior) {
        const group = grouped.get(prior.event) || { assets: [], gaps: [] };
        group.assets.push(a);
        const move = t.moves.find((m) => m.asset === a);
        if (move && prior.team && move.from !== prior.team) group.gaps.push(a);
        grouped.set(prior.event, group);
      }
      const move = t.moves.find((m) => m.asset === a),
        conversion = t.conversions.find((c) => c.from === a || c.to === a);
      last.set(a, {
        event: t.id,
        team: move?.to || conversion?.team || prior?.team,
      });
    }
    for (const [from, group] of grouped)
      links.push({ from, to: t.id, ...group });
  }
  return links;
}
export function teamName(data: StoryData, id: string, date: string) {
  const team = data.teams[id];
  return (
    team?.aliases?.find((a) => a.from <= date && a.to >= date)?.name ||
    team?.name ||
    id
  );
}
export function assetLabel(asset: Asset, form?: string) {
  return asset.kind === 'player'
    ? form === 'rights'
      ? 'Draft rights'
      : 'Player'
    : {
        obligation: 'Future pick',
        pick: 'Draft selection',
        swap: 'Swap right',
        cash: 'Consideration',
        rights: 'Draft rights',
      }[asset.kind];
}
export function shortDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(date + 'T12:00:00Z'));
}
