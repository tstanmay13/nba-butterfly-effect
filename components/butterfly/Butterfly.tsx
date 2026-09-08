'use client';
import {
  lazy,
  Suspense,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronDown,
  GitBranch,
  Grid2X2,
  Pause,
  Play,
  RotateCcw,
  Share2,
  X,
} from 'lucide-react';
import type { Story, StoryData, ViewState } from '../../lib/model';
import {
  eventIndex,
  initialState,
  parseState,
  shortDate,
  stateQuery,
  teamName,
  visibleEvents,
  withEvent,
} from '../../lib/history';
import { HistoryMap, TradeScene } from './TradeScene';
import { Inspector } from './Inspector';
import { Overlay } from './Archive';
import initialJSON from '../../data/initial.json';
import catalogJSON from '../../data/catalog.json';
const initial = initialJSON as unknown as StoryData,
  catalog = catalogJSON as Story[];
const Universe = lazy(() => import('./Universe'));
const cache = new Map<string, StoryData>([['luka', initial]]);
function Emblem() {
  return (
    <svg viewBox="0 0 44 38" fill="none" aria-hidden="true">
      <path
        d="M22 19C15 5 3 2 4 14c1 10 12 9 18 5Zm0 0C29 5 41 2 40 14c-1 10-12 9-18 5ZM22 19C13 17 3 24 9 31c5 6 12-4 13-12Zm0 0c9-2 19 5 13 12-5 6-12-4-13-12Z"
        stroke="currentColor"
        strokeWidth="1.7"
      />
      <path
        d="M22 11v20M17 9l5 5 5-5"
        stroke="currentColor"
        strokeWidth="1.7"
      />
    </svg>
  );
}
export default function Butterfly() {
  const [web, setWeb] = useState(false);
  const [data, setData] = useState(initial),
    [state, setState] = useState<ViewState>(() => initialState(initial));
  const [playing, setPlaying] = useState(false),
    [hidden, setHidden] = useState(false),
    [reduced, setReduced] = useState(false),
    [overlay, setOverlay] = useState<'archive' | 'about' | null>(null),
    [copied, setCopied] = useState(false),
    [shareURL, setShareURL] = useState(''),
    [loading, setLoading] = useState(false),
    [error, setError] = useState('');
  const timelineStops = useRef<HTMLDivElement>(null);
  const request = useRef(0),
    lastFocus = useRef<HTMLElement | null>(null);
  const loadStory = useCallback(
    async (id: string, search?: string, push = true) => {
      if (!catalog.some((s) => s.id === id)) id = 'luka';
      const seq = ++request.current;
      setPlaying(false);
      setLoading(true);
      setError('');
      try {
        let next = cache.get(id);
        if (!next) {
          const res = await fetch(`/data/${id}.json`);
          if (!res.ok) throw Error('Unable to load this story.');
          next = (await res.json()) as StoryData;
          cache.set(id, next);
        }
        if (seq !== request.current) return;
        const view =
          search !== undefined ? parseState(search, next) : initialState(next);
        setData(next);
        setState(view);
        setOverlay(null);
        if (push) history.pushState(null, '', stateQuery(view));
      } catch {
        if (seq === request.current)
          setError('This story could not load. Please try it again.');
      } finally {
        if (seq === request.current) setLoading(false);
      }
    },
    [],
  );
  useEffect(() => {
    document.title = `${web ? 'The Butterfly Web' : data.story.title} — NBA Butterfly Effect`;
  }, [web, data.story.title]);
  useEffect(() => {
    const restore = () => {
      const search = location.search;
      if (new URLSearchParams(search).get('view') === 'web') {
        setWeb(true);
        return;
      }
      setWeb(false);
      void loadStory(
        new URLSearchParams(search).get('story') || 'luka',
        search,
        false,
      );
    };
    restore();
    window.addEventListener('popstate', restore);
    const onVisibility = () => {
      setHidden(document.hidden);
      if (document.hidden) setPlaying(false);
    };
    document.addEventListener('visibilitychange', onVisibility);
    const media = matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion = () => setReduced(media.matches);
    onMotion();
    media.addEventListener('change', onMotion);
    return () => {
      window.removeEventListener('popstate', restore);
      document.removeEventListener('visibilitychange', onVisibility);
      media.removeEventListener('change', onMotion);
    };
  }, [loadStory]);
  const index = eventIndex(data, state.step),
    t = data.transactions[index],
    events = visibleEvents(data, state.step),
    last = index === data.transactions.length - 1;
  useEffect(() => {
    const row = timelineStops.current,
      active = row?.querySelector<HTMLElement>('[aria-current=step]');
    if (row && active)
      row.scrollTo({
        left: Math.max(
          0,
          active.offsetLeft -
            row.offsetLeft -
            row.clientWidth / 2 +
            active.clientWidth / 2,
        ),
        behavior: reduced ? 'instant' : 'smooth',
      });
  }, [state.step, reduced]);
  const commit = useCallback((next: ViewState, replace = false) => {
    setState(next);
    history[replace ? 'replaceState' : 'pushState'](null, '', stateQuery(next));
  }, []);
  const go = (id: string, replace = false) => {
    setPlaying(false);
    commit(withEvent(state, data, id), replace);
  };
  useEffect(() => {
    if (!playing || hidden || reduced) return;
    const timer = window.setTimeout(() => {
      const i = eventIndex(data, state.step);
      if (i >= data.transactions.length - 1) {
        setPlaying(false);
        return;
      }
      commit(withEvent(state, data, data.transactions[i + 1].id), true);
      if (i + 1 === data.transactions.length - 1) setPlaying(false);
    }, 6500);
    return () => clearTimeout(timer);
  }, [playing, hidden, reduced, state, data, commit]);
  function select(id: string) {
    lastFocus.current = document.activeElement as HTMLElement;
    setPlaying(false);
    commit({ ...state, node: id });
    if (window.innerWidth < 760) {
      requestAnimationFrame(() => {
        const node = document.querySelector<HTMLElement>(
          `[data-asset="${id}"]`,
        );
        if (node) {
          const top = node.getBoundingClientRect().top + window.scrollY - 100;
          window.scrollTo({ top, behavior: reduced ? 'instant' : 'smooth' });
        }
      });
    }
  }
  function closeDetails() {
    commit({ ...state, node: null });
    lastFocus.current?.focus({ preventScroll: true });
  }
  async function share() {
    const url = new URL(stateQuery(state), location.origin + location.pathname)
      .href;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      setShareURL(url);
    }
  }
  function play() {
    if (playing) {
      setPlaying(false);
      return;
    }
    if (last) {
      commit(initialState(data));
    }
    if (reduced) {
      const next =
        data.transactions[Math.min(index + 1, data.transactions.length - 1)];
      go(next.id);
      return;
    }
    setPlaying(true);
  }
  if (web)
    return (
      <Suspense
        fallback={<div className="web-loading">Unfolding the archive…</div>}
      >
        <Universe
          onClose={() => {
            setWeb(false);
            history.pushState(null, '', stateQuery(state));
          }}
          onStory={(id) => {
            setWeb(false);
            void loadStory(id);
          }}
        />
      </Suspense>
    );
  const root = t.id === data.story.root;
  return (
    <div
      className={`butterfly-app ${state.node ? 'with-inspector' : ''} ${hidden ? 'is-hidden' : ''}`}
      style={{ '--story-color': data.story.color } as React.CSSProperties}
    >
      <a className="skip-link" href="#explore">
        Skip to the visualization
      </a>
      <header className="site-header">
        <button
          className="brand"
          onClick={() => void loadStory('luka')}
          aria-label="NBA Butterfly Effect home"
        >
          <Emblem />
          <span>
            <small>NBA</small>
            <strong>BUTTERFLY EFFECT</strong>
          </span>
        </button>
        <span className="header-tagline">EVERY TRADE HAS AN AFTERLIFE.</span>
        <nav aria-label="Main navigation">
          <button
            className="web-nav"
            aria-label="All connections"
            onClick={() => {
              setPlaying(false);
              history.pushState(null, '', '?view=web');
              setWeb(true);
            }}
          >
            <GitBranch size={15} />
            <span>ALL CONNECTIONS</span>
          </button>
          <button className="archive-nav" onClick={() => setOverlay('archive')}>
            <Grid2X2 size={15} />
            <span>THE ARCHIVE</span>
            <small>{catalog.length}</small>
          </button>
          <button className="about-nav" onClick={() => setOverlay('about')}>
            ABOUT
          </button>
          <button
            className="icon-button share-button"
            onClick={share}
            aria-label="Share this moment"
          >
            {copied ? <Check size={18} /> : <Share2 size={18} />}
          </button>
        </nav>
      </header>
      <main id="explore">
        <div className="breadcrumbs">
          <button onClick={() => setOverlay('archive')}>The archive</button>
          <span>/</span>
          <button
            onClick={() => {
              setPlaying(false);
              commit(initialState(data));
            }}
          >
            {data.story.title}
          </button>
          <span>/</span>
          <span>Moment {String(index + 1).padStart(2, '0')}</span>
          <div className="breadcrumb-end">
            <span className="live-dot" />
            {data.story.year}—{data.story.endYear} · DOCUMENTED HISTORY
          </div>
        </div>
        {error && (
          <div className="error-banner" role="alert">
            {error}
            <button onClick={() => setOverlay('archive')}>
              Choose a story
            </button>
          </div>
        )}
        <div className="experience">
          <div className="experience-main" aria-busy={loading}>
            <div className="story-stage">
              <section
                className={`editorial ${data.story.image ? 'with-portrait' : ''}`}
                aria-labelledby="story-title"
              >
                <div className="editorial-background">
                  {data.story.image ? (
                    <img
                      key={data.story.image}
                      src={`/images/${data.story.image}.webp`}
                      alt={data.story.imageAlt}
                      width="840"
                      height="1050"
                      fetchPriority={data.story.id === 'luka' ? 'high' : 'auto'}
                    />
                  ) : (
                    <div className="typographic-portrait" aria-hidden="true">
                      <span>{data.story.focus}</span>
                      <strong>{String(data.story.year).slice(2)}</strong>
                      <svg viewBox="0 0 350 350">
                        <circle cx="175" cy="175" r="163" />
                        <path d="M12 175h326M175 12v326M58 60c190 45 190 185 0 230M290 60C100 105 100 245 290 290" />
                      </svg>
                    </div>
                  )}
                </div>
                <div className="editorial-content">
                  <span className="eyebrow">
                    <i /> STORY{' '}
                    {String(
                      catalog.findIndex((s) => s.id === data.story.id) + 1,
                    ).padStart(2, '0')}{' '}
                    / {data.story.category.toUpperCase()}
                  </span>
                  <h1 id="story-title">
                    {(root ? data.story.headline : t.title.toUpperCase())
                      .split('\n')
                      .map((line, i) => (
                        <span key={i}>{line}</span>
                      ))}
                  </h1>
                  <p>{root ? data.story.subtitle : t.text}</p>
                  <button
                    className="play-story"
                    onClick={play}
                    aria-label={
                      playing
                        ? 'Pause guided story'
                        : reduced
                          ? 'Advance guided story'
                          : 'Play guided story'
                    }
                  >
                    {playing ? (
                      <Pause size={16} fill="currentColor" />
                    ) : reduced ? (
                      <ArrowRight size={17} />
                    ) : (
                      <Play size={15} fill="currentColor" />
                    )}
                    <span>
                      {playing
                        ? 'Pause story'
                        : reduced
                          ? 'Next moment'
                          : last
                            ? 'Replay the story'
                            : index === 0
                              ? 'Follow the butterfly'
                              : 'Play from here'}
                    </span>
                    <span className="play-count">
                      {data.transactions.length} moments
                    </span>
                  </button>
                  <div className="portrait-caption">
                    {data.story.image ? (
                      <button onClick={() => setOverlay('about')}>
                        {data.story.image === 'luka-doncic'
                          ? 'Luka in Dallas, 2021 · Erik Drost'
                          : data.story.image === 'dirk-nowitzki'
                            ? 'Dirk in Dallas, 2009 · Keith Allison'
                            : 'Garnett in Boston, 2008 · Keith Allison'}{' '}
                        <ArrowUpRight size={11} />
                      </button>
                    ) : (
                      <span>AN INDEPENDENT BASKETBALL ARCHIVE</span>
                    )}
                  </div>
                </div>
              </section>
              <section
                className="visualization"
                aria-label="Interactive transaction visualization"
              >
                <div className="scene-header">
                  <div>
                    <span className="micro">
                      {t.kind === 'trade'
                        ? 'TRADE AGREED'
                        : t.kind === 'draft'
                          ? 'DRAFT NIGHT'
                          : t.kind === 'swap'
                            ? 'SWAP ALLOCATION'
                            : 'PICK RESOLUTION'}
                    </span>
                    <h2>{shortDate(t.date)}</h2>
                  </div>
                  <span className="moment-count">
                    {String(index + 1).padStart(2, '0')}
                    <span>
                      {' '}
                      / {String(data.transactions.length).padStart(2, '0')}
                    </span>
                  </span>
                </div>
                <div className="scene-toolbar">
                  <label className="perspective">
                    <span>Through the eyes of</span>
                    <span
                      className="perspective-select"
                      style={{ color: data.teams[state.team]?.color }}
                    >
                      <select
                        aria-label="Team perspective"
                        value={state.team}
                        onChange={(e) =>
                          commit({ ...state, team: e.target.value })
                        }
                      >
                        {t.teams.map((team) => (
                          <option key={team} value={team}>
                            {teamName(data, team, t.date)}
                          </option>
                        ))}
                      </select>
                      <ChevronDown size={15} />
                    </span>
                  </label>
                  <div className="view-switch" aria-label="Visualization mode">
                    <button
                      aria-label="Trade scene"
                      aria-pressed={state.mode === 'trade'}
                      onClick={() => commit({ ...state, mode: 'trade' })}
                    >
                      <span className="trade-mode-icon">⇄</span>
                    </button>
                    <button
                      aria-label="Connection map"
                      aria-pressed={state.mode === 'map'}
                      onClick={() => commit({ ...state, mode: 'map' })}
                    >
                      <GitBranch size={17} />
                    </button>
                  </div>
                </div>
                <div
                  className="scene-body"
                  key={`${data.story.id}-${state.mode}`}
                >
                  {loading ? (
                    <output className="loading-scene">
                      <Emblem /> Opening the next story…
                    </output>
                  ) : state.mode === 'trade' ? (
                    <TradeScene
                      data={data}
                      transaction={t}
                      team={state.team}
                      selected={state.node}
                      onSelect={select}
                    />
                  ) : (
                    <HistoryMap
                      data={data}
                      events={events}
                      current={state.step}
                      onEvent={go}
                      onSelect={select}
                    />
                  )}
                </div>
                <div className="scene-context">
                  <p>{t.text}</p>
                  <button onClick={() => select(t.id)}>
                    <span>Terms & sources</span>
                    <ArrowUpRight size={15} />
                  </button>
                </div>
                <div className="legend" aria-label="Node legend">
                  <span>
                    <i className="legend-person" /> Player / rights
                  </span>
                  <span>
                    <i className="legend-pick" /> Pick
                  </span>
                  <span>
                    <i className="legend-future" /> Future right
                  </span>
                  <span>
                    Tap any asset to follow it <ArrowUpRight size={12} />
                  </span>
                </div>
              </section>
            </div>
            <section className="timeline" aria-label="Story timeline">
              <div className="timeline-top">
                <div>
                  <span className="micro">MOVE THROUGH TIME</span>
                  <span className="timeline-hint">
                    {playing
                      ? 'Playing · a new moment every 6.5 seconds'
                      : 'The future stays hidden until you get there.'}
                  </span>
                </div>
                <div className="timeline-actions">
                  <button
                    className="icon-button"
                    disabled={index === 0}
                    onClick={() => go(data.transactions[index - 1].id)}
                    aria-label="Previous moment"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <button
                    className="icon-button"
                    onClick={play}
                    aria-label={playing ? 'Pause timeline' : 'Play timeline'}
                  >
                    {playing ? <Pause size={16} /> : <Play size={16} />}
                  </button>
                  <button
                    className="icon-button"
                    disabled={last}
                    onClick={() => go(data.transactions[index + 1].id)}
                    aria-label="Next moment"
                  >
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
              <input
                className="timeline-range"
                aria-label="Timeline position"
                aria-valuetext={`${shortDate(t.date)}. ${t.shortTitle}. Moment ${index + 1} of ${data.transactions.length}`}
                type="range"
                min="0"
                max={data.transactions.length - 1}
                value={index}
                onChange={(e) =>
                  go(data.transactions[Number(e.target.value)].id, true)
                }
                style={
                  {
                    '--progress': `${(index / (data.transactions.length - 1)) * 100}%`,
                  } as React.CSSProperties
                }
              />
              <div className="timeline-stops" ref={timelineStops}>
                {data.transactions.map((event, i) => (
                  <button
                    key={event.id}
                    className={`${i === index ? 'active' : ''} ${i > index ? 'future' : ''}`}
                    aria-label={
                      i > index
                        ? `Reveal moment ${i + 1}, ${shortDate(event.date)}`
                        : `Go to ${event.shortTitle}, ${shortDate(event.date)}`
                    }
                    aria-current={i === index ? 'step' : undefined}
                    onClick={() => go(event.id)}
                  >
                    <span className="stop-year">
                      {event.date.slice(0, 4)}
                      {i > 0 &&
                        event.date === data.transactions[i - 1].date && (
                          <small> · {event.order + 1}</small>
                        )}
                    </span>
                    <span>
                      {i > index ? 'To be revealed' : event.shortTitle}
                    </span>
                  </button>
                ))}
              </div>
            </section>
          </div>
          {state.node && (
            <Inspector
              data={data}
              state={state}
              onClose={closeDetails}
              onSelect={select}
              onEvent={go}
            />
          )}
        </div>
        <section className="afterword">
          <div>
            <span className="micro">
              {last
                ? 'YOU HAVE REACHED THE END OF THIS BRANCH'
                : 'A NOTE ON THIS STORY'}
            </span>
            <p>
              {last
                ? data.story.takeaway
                : 'Every line is a documented connection. Every endpoint has a boundary.'}
            </p>
          </div>
          <details>
            <summary>
              What this story covers <ChevronDown size={15} />
            </summary>
            <p>{data.story.coverage}</p>
            <p>
              Coverage ends {shortDate(data.story.cutoff)}. Research reviewed
              September 8, 2026. Later events are not implied.
            </p>
          </details>
          <button
            className="text-button"
            onClick={() => {
              setPlaying(false);
              commit(initialState(data));
            }}
          >
            <RotateCcw size={14} /> Return to the opening
          </button>
        </section>
        <section className="more-stories">
          <div className="more-heading">
            <h2>
              THERE’S ALWAYS
              <br />
              ANOTHER THREAD.
            </h2>
            <button onClick={() => setOverlay('archive')}>
              Explore all {catalog.length} stories <ArrowUpRight size={17} />
            </button>
          </div>
          <div className="more-links">
            {catalog
              .filter((s) => s.id !== data.story.id)
              .filter((s) =>
                ['dirk', 'brooklyn', 'kawhi', 'luka'].includes(s.id),
              )
              .slice(0, 3)
              .map((s) => (
                <button
                  key={s.id}
                  onClick={() => {
                    void loadStory(s.id);
                    window.scrollTo({
                      top: 0,
                      behavior: reduced ? 'instant' : 'smooth',
                    });
                  }}
                  style={{ '--link-color': s.color } as React.CSSProperties}
                >
                  <span>{s.year}</span>
                  <div>
                    <strong>{s.title}</strong>
                    <small>
                      {s.transactions.length} moments · {s.category}
                    </small>
                  </div>
                  <ArrowUpRight size={21} />
                </button>
              ))}
          </div>
        </section>
      </main>
      <footer>
        <div className="footer-signature">
          <Emblem />
          <span>
            Made by Tanmay.
            <br />
            <strong>For the love of the game.</strong>
          </span>
        </div>
        <div>
          <button onClick={() => setOverlay('about')}>
            Sources, methodology & credits
          </button>
          <span>Independent. Curated. Always connected.</span>
        </div>
      </footer>
      <output className="toast" aria-live="polite">
        {copied && (
          <span>
            <Check size={15} /> Link copied to this exact moment.
          </span>
        )}
      </output>
      <span className="sr-only" aria-live="polite" aria-atomic="true">
        {t.shortTitle}. {shortDate(t.date)}.{' '}
        {t.teams.map((id) => teamName(data, id, t.date)).join(', ')}.
      </span>
      {overlay && (
        <Overlay
          kind={overlay}
          stories={catalog}
          onClose={() => setOverlay(null)}
          onStory={(id) => {
            void loadStory(id);
            window.scrollTo({ top: 0, behavior: 'instant' });
          }}
        />
      )}
      {shareURL && (
        <dialog
          open
          className="share-fallback"
          aria-label="Copy share link"
          onKeyDown={(e) => {
            if (e.key === 'Escape') setShareURL('');
          }}
        >
          <button
            className="icon-button"
            aria-label="Close share link"
            onClick={() => setShareURL('')}
          >
            <X size={18} />
          </button>
          <label>
            Copy this moment’s link
            <input
              readOnly
              value={shareURL}
              onFocus={(e) => e.target.select()}
              autoFocus
            />
          </label>
        </dialog>
      )}
    </div>
  );
}
