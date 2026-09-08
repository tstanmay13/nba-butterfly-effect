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
import { compareEvents, shortDate } from '../../lib/history';
import {
  layoutNetwork,
  focusedNetwork,
  networkAt,
  searchNetwork,
} from '../../lib/network';
import { Inspector } from './Inspector';
import { ArchiveAtlas } from './ArchiveAtlas';
import {
  readWebState,
  webStateQuery,
  type WebState,
} from '../../lib/web-state';
let archiveCache: Archive | undefined;
export default function Universe({
  onClose,
  onStory,
  onHome,
  closeLabel,
}: {
  onClose: () => void;
  onHome: () => void;
  closeLabel: string;
  onStory: (id: string) => void;
}) {
  const [archive, setArchive] = useState<Archive | undefined>(archiveCache),
    [state, setState] = useState<WebState | null>(
      archiveCache ? () => readWebState(location.search, archiveCache!) : null,
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
          setState(readWebState(location.search, a));
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
      if (archiveCache) setState(readWebState(location.search, archiveCache));
    };
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);
  const layout = useMemo(
    () => (archive ? layoutNetwork(archive) : null),
    [archive],
  );
  const display = useMemo(() => {
    if (!archive || !layout || !state) return null;
    const visible = networkAt(layout, state.at);
    if (state.focus) return focusedNetwork(visible, state.focus);
    const matches = searchNetwork(
      archive,
      visible.nodes.map((n) => n.event),
      state.query,
    );
    const nodes = visible.nodes.filter(
      (n) =>
        matches.has(n.id) &&
        (state.team === 'ALL' || n.event.teams.includes(state.team)),
    );
    const ids = new Set(nodes.map((n) => n.id));
    return {
      ...visible,
      nodes,
      links: visible.links.filter((l) => ids.has(l.from) && ids.has(l.to)),
    };
  }, [archive, layout, state]);
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
  const fit = useCallback(
    (wholeNeighborhood = false) => {
      if (!display) return;
      const nodes = display.nodes;
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
            wholeNeighborhood ? 0.06 : 0.82,
            Math.min(
              0.85,
              box.width / (maxX - minX),
              box.height / (maxY - minY),
            ),
          ),
        );
    },
    [display, centerOn],
  );
  useEffect(() => {
    if (!display || !state?.focus || !canvas.current || list) return;
    const resize = () => {
      const node = display.nodes.find((n) => n.id === state.focus);
      if (node && canvas.current!.clientWidth < 600)
        centerOn(node.x, node.y, 0.85);
      else fit();
    };
    const observer = new ResizeObserver(resize);
    observer.observe(canvas.current);
    return () => observer.disconnect();
  }, [display, state, centerOn, fit, list]);
  const update = (next: WebState, replace = false) => {
    setState(next);
    history[replace ? 'replaceState' : 'pushState'](
      null,
      '',
      webStateQuery(next),
    );
  };
  function select(id: string) {
    if (!state || !layout) return;
    const isEvent = layout.nodes.find((n) => n.id === id);
    update({
      ...state,
      node: id,
      at:
        isEvent && isEvent.event.date > state.at
          ? isEvent.event.date
          : state.at,
      focus: isEvent ? id : state.focus,
      query: '',
      team: 'ALL',
      era: null,
    });
    setList(false);
    canvas.current?.scrollTo({ top: 0, left: 0 });
  }
  function changeZoom(delta: number) {
    const box = canvas.current?.getBoundingClientRect();
    if (!box) return;
    const tr = transform.current,
      s = Math.min(1.8, Math.max(0.2, tr.scale * delta));
    const x = (box.width / 2 - tr.x) / tr.scale,
      y = (box.height / 2 - tr.y) / tr.scale;
    centerOn(x, y, s);
  }
  function changeDate(at: string) {
    if (!state || !archive) return;
    const focus =
      state.focus &&
      archive.transactions.some((t) => t.id === state.focus && t.date <= at)
        ? state.focus
        : null;
    const era =
      state.era !== null &&
      archive.transactions.some(
        (t) =>
          t.date <= at &&
          Math.floor(Number(t.date.slice(0, 4)) / 10) * 10 === state.era,
      )
        ? state.era
        : null;
    update({ ...state, at, node: null, focus, era }, true);
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
  if (!archive || !state || !layout || !display)
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
  );
  const matches = new Set(
    visible.nodes
      .filter(
        (n) =>
          search.has(n.id) &&
          (state.team === 'ALL' || n.event.teams.includes(state.team)),
      )
      .map((n) => n.id),
  );
  const displayIds = new Set(display.nodes.map((n) => n.id));
  const relevant = visible.nodes.filter(
    (n) =>
      matches.has(n.id) &&
      (state.focus
        ? displayIds.has(n.id)
        : state.era === null ||
          Math.floor(Number(n.event.date.slice(0, 4)) / 10) * 10 === state.era),
  );
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
        <button className="web-back" onClick={onClose} aria-label={closeLabel}>
          <ArrowLeft size={17} />
          <span>{closeLabel}</span>
        </button>
        <div>
          <GitBranch size={21} />
          <h1>THE BUTTERFLY WEB</h1>
          <span>{archive.transactions.length} trades & moments</span>
        </div>
        <button className="web-home-link" onClick={onHome}>
          All stories
        </button>
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
              update(
                {
                  ...state,
                  query: e.target.value,
                  focus: null,
                  node: null,
                  era: null,
                },
                true,
              )
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
              update(
                {
                  ...state,
                  team: e.target.value,
                  focus: null,
                  node: null,
                  era: null,
                },
                true,
              )
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
          className="web-overview-toggle"
          aria-label="Entire archive"
          aria-pressed={!state.focus}
          onClick={() => {
            setList(false);
            canvas.current?.scrollTo({ top: 0, left: 0 });
            update({
              ...state,
              focus: null,
              node: null,
              query: '',
              team: 'ALL',
              era: null,
            });
          }}
        >
          <GitBranch size={15} />
          <span>Entire archive</span>
        </button>
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
            className={`web-canvas ${list ? 'is-list' : ''} ${!state.focus && !list ? 'is-atlas' : ''}`}
            ref={canvas}
            data-testid="connection-web"
            onPointerDown={(e) => {
              if (list || !state.focus) return;
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
            ) : !state.focus ? (
              <ArchiveAtlas
                archive={archive}
                visible={visible}
                matches={matches}
                era={state.era}
                filtered={!!state.query || state.team !== 'ALL'}
                at={state.at}
                onSelect={select}
                onEra={(era) => {
                  update({
                    ...state,
                    era,
                    focus: null,
                    node: null,
                    query: '',
                    team: 'ALL',
                  });
                  canvas.current?.scrollTo({ top: 0 });
                }}
              />
            ) : (
              <>
                <div
                  className="web-watermark"
                  aria-hidden="true"
                  hidden={!!state.focus}
                >
                  FOLLOW
                  <br />
                  THE THREADS.
                </div>
                <div
                  ref={world}
                  className={`web-world ${state.focus ? 'is-focused' : ''}`}
                  style={{ width: display.width, height: display.height }}
                >
                  <svg
                    width={display.width}
                    height={display.height}
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
                    {display.links.map((l) => {
                      const a = display.nodes.find((n) => n.id === l.from)!,
                        b = display.nodes.find((n) => n.id === l.to)!;
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
                          opacity={dim ? 0.08 : active ? 1 : 0.3}
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
                                fontSize="12"
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
                  {display.nodes.map((n) => {
                    const color =
                      archive.teams[
                        n.event.teams.includes('DAL') ? 'DAL' : n.event.teams[0]
                      ].color;
                    return (
                      <button
                        key={n.id}
                        className={`web-node ${n.id === state.focus ? 'focused' : ''}`}
                        style={
                          {
                            left: n.x - (state.focus ? 120 : 105),
                            top: n.y - (state.focus ? 48 : 39),
                            '--node-color': color,
                          } as React.CSSProperties
                        }
                        onClick={() => select(n.id)}
                        onFocus={(e) => {
                          if (e.currentTarget.matches(':focus-visible'))
                            centerOn(n.x, n.y, 0.95);
                        }}
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
                    onClick={() => fit(true)}
                    aria-label="Fit entire neighborhood"
                  >
                    <Expand size={17} />
                  </button>
                </div>
              </>
            )}
            {state.focus && (
              <div className="web-focus-label">
                <span>{focused?.shortTitle}</span>
                <button
                  onClick={() => {
                    select(focused!.id);
                  }}
                >
                  <ArrowUpRight size={13} /> Read deal
                </button>
              </div>
            )}
          </div>
          {focused && !list && (
            <nav
              className="web-neighbors"
              aria-label="Follow connected transactions"
            >
              {(['before', 'after'] as const).map((direction) => {
                const edges = display.links.filter((l) =>
                  direction === 'before'
                    ? l.to === focused.id
                    : l.from === focused.id,
                );
                return (
                  <div key={direction}>
                    <span className="micro">
                      {direction === 'before'
                        ? '← WHERE IT CAME FROM'
                        : 'WHAT HAPPENED NEXT →'}
                    </span>
                    <div className="web-neighbor-options">
                      {edges.map((l) => {
                        const id = direction === 'before' ? l.from : l.to;
                        const event = archive.transactions.find(
                          (t) => t.id === id,
                        )!;
                        return (
                          <button key={id} onClick={() => select(id)}>
                            <small>
                              {shortDate(event.date)} ·{' '}
                              {l.gaps.length
                                ? 'Intervening moves untraced'
                                : l.assets
                                    .slice(0, 2)
                                    .map((a) => archive.assets[a].name)
                                    .join(' + ')}
                              {l.assets.length > 2
                                ? ` + ${l.assets.length - 2} more`
                                : ''}
                            </small>
                            <strong>{event.shortTitle}</strong>
                            <ArrowUpRight size={14} />
                          </button>
                        );
                      })}
                      {!edges.length && (
                        <p>
                          {direction === 'before'
                            ? 'This branch begins here.'
                            : 'No later connection in the revealed history.'}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </nav>
          )}
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
          onClick={() => changeDate(dates[dateIndex - 1])}
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
          onChange={(e) => changeDate(dates[Number(e.target.value)])}
        />
        <button
          className="icon-button"
          aria-label="Later date"
          disabled={dateIndex === dates.length - 1}
          onClick={() => changeDate(dates[dateIndex + 1])}
        >
          <ArrowRight size={17} />
        </button>
      </section>
      {fallback && (
        <dialog
          open
          className="share-fallback"
          aria-label="Share this connection"
        >
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
