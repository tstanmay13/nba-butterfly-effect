'use client';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowLeftRight,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  Expand,
  GitBranch,
  List,
  Minus,
  Plus,
  Search,
  Share2,
  X,
} from 'lucide-react';
import type { Archive, StoryData, ViewState } from '../../lib/model';
import { compareEvents, eventAssets, shortDate } from '../../lib/history';
import {
  layoutNetwork,
  neighborhood,
  networkAt,
  searchNetwork,
} from '../../lib/network';
import { Inspector } from './Inspector';
let archiveCache: Archive | undefined;
interface WebState {
  at: string;
  node: string | null;
  focus: string | null;
  team: string;
  query: string;
}
function readState(a: Archive): WebState {
  const p = new URLSearchParams(location.search),
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
  const focus = p.get('focus');
  return {
    at: clamped,
    node: node && available.has(node) ? node : null,
    focus: focus && visible.some((t) => t.id === focus) ? focus : null,
    team: a.teams[p.get('franchise') || ''] ? p.get('franchise')! : 'ALL',
    query: p.get('q') || '',
  };
}
export default function Universe({
  onClose,
  onStory,
}: {
  onClose: () => void;
  onStory: (id: string) => void;
}) {
  const [archive, setArchive] = useState<Archive | undefined>(archiveCache),
    [state, setState] = useState<WebState | null>(
      archiveCache ? () => readState(archiveCache!) : null,
    ),
    [error, setError] = useState(''),
    [list, setList] = useState(false),
    [copied, setCopied] = useState(false),
    [fallback, setFallback] = useState('');
  const [zoom, setZoom] = useState(0.6);
  const canvas = useRef<HTMLDivElement>(null),
    world = useRef<HTMLDivElement>(null),
    transform = useRef({ x: 0, y: 0, scale: 0.6 }),
    drag = useRef<{ x: number; y: number; tx: number; ty: number } | null>(
      null,
    );
  useEffect(() => {
    const controller = new AbortController();
    if (!archiveCache)
      fetch('/data/universe.json', { signal: controller.signal })
        .then((r) => {
          if (!r.ok) throw Error('Archive unavailable');
          return r.json() as Promise<Archive>;
        })
        .then((a) => {
          archiveCache = a;
          setArchive(a);
          setState(readState(a));
        })
        .catch((e) => {
          if (e.name !== 'AbortError')
            setError(
              'The web could not load. Return to a story and try again.',
            );
        });
    return () => controller.abort();
  }, []);
  useEffect(() => {
    const onPop = () => {
      if (archiveCache) setState(readState(archiveCache));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const layout = useMemo(
    () => (archive ? layoutNetwork(archive) : null),
    [archive],
  );
  const draw = useCallback(() => {
    if (world.current) {
      const t = transform.current;
      world.current.style.transform = `translate(${t.x}px,${t.y}px) scale(${t.scale})`;
    }
  }, []);
  const centerOn = useCallback(
    (x: number, y: number, scale: number) => {
      const box = canvas.current?.getBoundingClientRect();
      if (!box) return;
      transform.current = {
        x: box.width / 2 - x * scale,
        y: box.height / 2 - y * scale,
        scale,
      };
      setZoom(scale);
      draw();
    },
    [draw],
  );
  const fit = useCallback(() => {
    if (!layout || !state) return;
    const nodes = layout.nodes.filter((n) => n.event.date <= state.at);
    if (!nodes.length) return;
    const minX = Math.min(...nodes.map((n) => n.x)) - 140,
      maxX = Math.max(...nodes.map((n) => n.x)) + 140,
      minY = Math.min(...nodes.map((n) => n.y)) - 90,
      maxY = Math.max(...nodes.map((n) => n.y)) + 90;
    const box = canvas.current?.getBoundingClientRect();
    if (box)
      centerOn(
        (minX + maxX) / 2,
        (minY + maxY) / 2,
        Math.max(
          0.2,
          Math.min(0.85, box.width / (maxX - minX), box.height / (maxY - minY)),
        ),
      );
  }, [layout, state, centerOn]);
  useEffect(() => {
    if (!layout || !state || !canvas.current) return;
    const resize = () => {
      const node = layout.nodes.find((n) => n.id === state.focus);
      if (node) centerOn(node.x, node.y, 0.95);
      else fit();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas.current);
    return () => observer.disconnect();
  }, [layout, state, centerOn, fit]);
  const update = (next: WebState, replace = false) => {
    setState(next);
    const p = new URLSearchParams({ view: 'web', at: next.at });
    if (next.node) p.set('node', next.node);
    if (next.focus) p.set('focus', next.focus);
    if (next.team !== 'ALL') p.set('franchise', next.team);
    if (next.query) p.set('q', next.query);
    history[replace ? 'replaceState' : 'pushState'](null, '', `?${p}`);
  };
  function select(id: string) {
    if (!state || !layout) return;
    const isEvent = layout.nodes.find((n) => n.id === id);
    update({
      ...state,
      node: id,
      focus: isEvent ? id : state.focus,
      query: '',
    });
    if (isEvent) centerOn(isEvent.x, isEvent.y, 0.95);
  }
  function changeZoom(delta: number) {
    const box = canvas.current?.getBoundingClientRect();
    if (!box) return;
    const tr = transform.current,
      s = Math.min(1.8, Math.max(0.18, tr.scale * delta));
    const x = (box.width / 2 - tr.x) / tr.scale,
      y = (box.height / 2 - tr.y) / tr.scale;
    centerOn(x, y, s);
  }
  async function share() {
    if (state) update(state, true);
    try {
      await navigator.clipboard.writeText(location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setFallback(location.href);
    }
  }
  if (!archive || !state || !layout)
    return (
      <div className="web-loading">
        <GitBranch size={30} />
        <p>{error || 'Unfolding the full archive…'}</p>
        <button onClick={onClose}>Return to the story</button>
      </div>
    );
  const visible = networkAt(layout, state.at),
    dates = [...new Set(archive.transactions.map((t) => t.date))].sort(),
    dateIndex = Math.max(
      0,
      dates.findLastIndex((d) => d <= state.at),
    );
  const search = searchNetwork(
      archive,
      visible.nodes.map((n) => n.event),
      state.query,
    ),
    near = neighborhood(visible, state.focus, 1);
  const matches = new Set(
    visible.nodes
      .filter(
        (n) =>
          search.has(n.id) &&
          (state.team === 'ALL' || n.event.teams.includes(state.team)),
      )
      .map((n) => n.id),
  );
  const relevant = visible.nodes.filter((n) => matches.has(n.id));
  const focused = archive.transactions.find((t) => t.id === state.focus),
    relatedStories = focused
      ? archive.stories.filter((s) => s.transactions.includes(focused.id))
      : [];
  const pseudo: StoryData = {
    schemaVersion: 1,
    teams: archive.teams,
    assets: archive.assets,
    sources: archive.sources,
    transactions: [...archive.transactions].sort(compareEvents),
    story: {
      ...archive.stories[0],
      id: 'web',
      title: 'All connections',
      cutoff: dates.at(-1)!,
      transactions: archive.transactions.map((t) => t.id),
    },
  };
  const inspectorState: ViewState = {
    story: 'web',
    at: state.at,
    step: visible.nodes.at(-1)!.id,
    node: state.node,
    team: focused?.teams[0] || 'DAL',
    mode: 'map',
  };
  return (
    <div className={`universe ${state.node ? 'has-web-inspector' : ''}`}>
      <header className="web-header">
        <button
          className="web-back"
          onClick={onClose}
          aria-label="Back to the story"
        >
          <ArrowLeft size={17} />
          <span>BACK TO THE STORY</span>
        </button>
        <div>
          <GitBranch size={21} />
          <h1>THE BUTTERFLY WEB</h1>
          <span>{archive.transactions.length} trades & moments</span>
        </div>
        <button
          className="icon-button"
          onClick={share}
          aria-label="Share the connection web"
        >
          {copied ? <Check size={18} /> : <Share2 size={18} />}
        </button>
      </header>
      <div className="web-toolbar">
        <label className="web-search">
          <Search size={17} />
          <input
            aria-label="Search all connections"
            placeholder="Find a player, team, or trade…"
            value={state.query}
            onChange={(e) =>
              update({ ...state, query: e.target.value, focus: null }, true)
            }
          />
          {state.query && (
            <button
              onClick={() => update({ ...state, query: '' })}
              aria-label="Clear connection search"
            >
              <X size={15} />
            </button>
          )}
        </label>
        <label className="web-team">
          <select
            aria-label="Filter web by franchise"
            value={state.team}
            onChange={(e) =>
              update({ ...state, team: e.target.value, focus: null }, true)
            }
          >
            <option value="ALL">Every franchise</option>
            {Object.values(archive.teams)
              .sort((a, b) => a.name.localeCompare(b.name))
              .map((t) => (
                <option value={t.id} key={t.id}>
                  {t.name}
                </option>
              ))}
          </select>
          <ChevronDown size={14} />
        </label>
        <button
          className={`web-list-toggle ${list ? 'active' : ''}`}
          onClick={() => setList(!list)}
          aria-pressed={list}
        >
          <List size={17} />
          <span>{list ? 'Show graph' : 'Readable list'}</span>
        </button>
      </div>
      <div className="web-main">
        <div className="web-canvas-area">
          <div
            className="web-canvas"
            ref={canvas}
            data-testid="connection-web"
            onPointerDown={(e) => {
              if ((e.target as HTMLElement).closest('button,a,input,select'))
                return;
              drag.current = {
                x: e.clientX,
                y: e.clientY,
                tx: transform.current.x,
                ty: transform.current.y,
              };
              e.currentTarget.setPointerCapture(e.pointerId);
              world.current?.classList.add('dragging');
            }}
            onPointerMove={(e) => {
              if (!drag.current) return;
              transform.current.x =
                drag.current.tx + e.clientX - drag.current.x;
              transform.current.y =
                drag.current.ty + e.clientY - drag.current.y;
              draw();
            }}
            onPointerUp={() => {
              drag.current = null;
              world.current?.classList.remove('dragging');
            }}
            onPointerCancel={() => {
              drag.current = null;
              world.current?.classList.remove('dragging');
            }}
          >
            {list ? (
              <div className="web-readable-list">
                <p>
                  {relevant.length} matching events through{' '}
                  {shortDate(state.at)}
                </p>
                {relevant.map((n) => (
                  <button key={n.id} onClick={() => select(n.id)}>
                    <span>{shortDate(n.event.date)}</span>
                    <strong>{n.event.shortTitle}</strong>
                    <small>{n.event.teams.join(' / ')}</small>
                    <ArrowUpRight size={17} />
                  </button>
                ))}
              </div>
            ) : (
              <>
                <div className="web-watermark" aria-hidden="true">
                  FOLLOW
                  <br />
                  THE THREADS.
                </div>
                <div
                  ref={world}
                  className="web-world"
                  style={{ width: layout.width, height: layout.height }}
                >
                  <svg
                    width={layout.width}
                    height={layout.height}
                    className="web-edges"
                    aria-hidden="true"
                  >
                    <defs>
                      <marker
                        id="web-arrow"
                        viewBox="0 0 10 10"
                        refX="9"
                        refY="5"
                        markerWidth="5"
                        markerHeight="5"
                        orient="auto-start-reverse"
                      >
                        <path
                          d="M0 1L9 5L0 9"
                          fill="none"
                          stroke="#91aacb"
                          strokeWidth="1.5"
                        />
                      </marker>
                    </defs>
                    {visible.links.map((l) => {
                      const a = layout.nodes.find((n) => n.id === l.from)!,
                        b = layout.nodes.find((n) => n.id === l.to)!;
                      const active =
                        state.focus &&
                        (l.from === state.focus || l.to === state.focus);
                      const dim =
                        (state.focus && !active) ||
                        (!matches.has(l.from) && !matches.has(l.to));
                      const bend = (a.x + b.x) / 2;
                      return (
                        <g
                          key={`${l.from}-${l.to}`}
                          opacity={dim ? 0.08 : active ? 1 : 0.65}
                        >
                          <path
                            d={`M ${a.x + 105} ${a.y} C ${bend} ${a.y}, ${bend} ${b.y}, ${b.x - 105} ${b.y}`}
                            stroke={active ? '#f59661' : '#587396'}
                            strokeWidth={active ? 2.3 : 1.6}
                            strokeDasharray={l.gaps.length ? '6 5' : undefined}
                            fill="none"
                            markerEnd="url(#web-arrow)"
                          />
                          {active && (
                            <g>
                              <rect
                                x={(a.x + b.x) / 2 - 93}
                                y={(a.y + b.y) / 2 - 12}
                                width="186"
                                height="24"
                                rx="4"
                                fill="#172333"
                                stroke="#9d704c"
                              />
                              <text
                                x={(a.x + b.x) / 2}
                                y={(a.y + b.y) / 2 + 3}
                                textAnchor="middle"
                                fill="#f8be99"
                                fontSize="10"
                              >
                                {l.gaps.length
                                  ? 'Shared asset · route has a gap'
                                  : l.assets.length === 1
                                    ? archive.assets[l.assets[0]].name
                                    : `${l.assets.length} shared assets`}
                              </text>
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </svg>
                  {visible.nodes.map((n) => {
                    const dim =
                      !matches.has(n.id) || (!!state.focus && !near.has(n.id));
                    const color =
                      archive.teams[
                        n.event.teams.includes('DAL') ? 'DAL' : n.event.teams[0]
                      ].color;
                    return (
                      <button
                        key={n.id}
                        className={`web-node ${n.id === state.focus ? 'focused' : ''} ${dim ? 'dim' : ''}`}
                        style={
                          {
                            left: n.x - 105,
                            top: n.y - 39,
                            '--node-color': color,
                          } as React.CSSProperties
                        }
                        onClick={() => select(n.id)}
                        aria-label={`Inspect ${n.event.shortTitle}, ${shortDate(n.event.date)}`}
                      >
                        <span className="web-node-year">
                          {n.event.date.slice(0, 4)}
                        </span>
                        <span className="web-node-kind">
                          <ArrowLeftRight size={11} />
                          {n.event.teams.join(' / ')}
                        </span>
                        <strong>{n.event.shortTitle}</strong>
                        <small>
                          {shortDate(n.event.date)} ·{' '}
                          {n.event.kind === 'trade'
                            ? `${n.event.moves.length} assets`
                            : 'Pick event'}
                        </small>
                      </button>
                    );
                  })}
                </div>
                <div className="web-zoom">
                  <button onClick={() => changeZoom(1.25)} aria-label="Zoom in">
                    <Plus size={18} />
                  </button>
                  <span>{Math.round(zoom * 100)}%</span>
                  <button onClick={() => changeZoom(0.8)} aria-label="Zoom out">
                    <Minus size={18} />
                  </button>
                  <button
                    onClick={fit}
                    aria-label="Fit all visible connections"
                  >
                    <Expand size={17} />
                  </button>
                </div>
              </>
            )}
            {!state.focus && !state.query && state.team === 'ALL' && (
              <div className="web-hint">
                <strong>A whole archive, one web.</strong>
                <span>
                  Tap a trade to light up its connections. Drag to roam, or
                  search for a player.
                </span>
                <small>
                  Every node is a complete package. Arrows follow shared assets
                  through time. Dashed edges mark untraced moves.
                </small>
                <button
                  className="web-start"
                  onClick={() => select('luka-draft-trade')}
                >
                  Start with Luka <ArrowRight size={14} />
                </button>
              </div>
            )}
            {(state.query || state.team !== 'ALL') && (
              <div className="web-results">
                <span>
                  {relevant.length} matches through {shortDate(state.at)}
                </span>
                {relevant.slice(0, 6).map((n) => (
                  <button
                    key={n.id}
                    onClick={() => {
                      centerOn(n.x, n.y, 1);
                      select(n.id);
                    }}
                  >
                    {n.event.shortTitle}
                    <ArrowUpRight size={13} />
                  </button>
                ))}
                {relevant.length > 6 && (
                  <button onClick={() => setList(true)}>
                    See all {relevant.length} results <ArrowRight size={13} />
                  </button>
                )}
                {!relevant.length && (
                  <p>Try another name or advance the date.</p>
                )}
              </div>
            )}
            {state.focus && (
              <div className="web-focus-label">
                <span>{focused?.shortTitle}</span>
                <button
                  onClick={() => {
                    update({ ...state, focus: null, node: null });
                    fit();
                  }}
                >
                  <X size={13} /> Clear focus
                </button>
              </div>
            )}
          </div>
          {!!relatedStories.length && (
            <div className="web-story-bridges">
              <span>EXPLORE THIS IN A STORY</span>
              {relatedStories.slice(0, 5).map((s) => (
                <button key={s.id} onClick={() => onStory(s.id)}>
                  {s.title}
                  <ArrowUpRight size={13} />
                </button>
              ))}
            </div>
          )}
        </div>
        {state.node && (
          <Inspector
            allowGaps
            data={pseudo}
            state={inspectorState}
            onClose={() => update({ ...state, node: null })}
            onSelect={select}
            onEvent={(id) => {
              const n = layout.nodes.find((n) => n.id === id)!;
              update({ ...state, at: n.event.date, node: id, focus: id });
              centerOn(n.x, n.y, 0.95);
            }}
          />
        )}
      </div>
      <section className="web-timeline" aria-label="Whole archive timeline">
        <div>
          <span className="micro">HISTORY REVEALED THROUGH</span>
          <strong>{shortDate(state.at)}</strong>
          <span>
            {visible.nodes.length} of {layout.nodes.length} events
          </span>
        </div>
        <button
          className="icon-button"
          aria-label="Earlier date"
          disabled={dateIndex === 0}
          onClick={() =>
            update(
              { ...state, at: dates[dateIndex - 1], node: null, focus: null },
              true,
            )
          }
        >
          <ArrowLeft size={17} />
        </button>
        <input
          aria-label="Whole archive date"
          aria-valuetext={shortDate(state.at)}
          type="range"
          min="0"
          max={dates.length - 1}
          value={dateIndex}
          onChange={(e) =>
            update(
              {
                ...state,
                at: dates[Number(e.target.value)],
                node: null,
                focus: null,
              },
              true,
            )
          }
        />
        <button
          className="icon-button"
          aria-label="Later date"
          disabled={dateIndex === dates.length - 1}
          onClick={() =>
            update(
              { ...state, at: dates[dateIndex + 1], node: null, focus: null },
              true,
            )
          }
        >
          <ArrowRight size={17} />
        </button>
      </section>
      {fallback && (
        <dialog open className="share-fallback">
          <button
            className="icon-button"
            onClick={() => setFallback('')}
            aria-label="Close web share link"
          >
            <X size={17} />
          </button>
          <label>
            Copy the connection web link
            <input
              readOnly
              value={fallback}
              onFocus={(e) => e.target.select()}
              autoFocus
            />
          </label>
        </dialog>
      )}
    </div>
  );
}
