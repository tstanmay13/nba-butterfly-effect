'use client';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, Search, X, BookOpen } from 'lucide-react';
import type { Story } from '../../lib/model';
import credits from '../../data/image-credits.json';
import metadata from '../../data/metadata.json';
import { searchStories } from '../../lib/search';
export function Overlay({
  kind,
  stories,
  onClose,
  onStory,
}: {
  kind: 'archive' | 'about';
  stories: Story[];
  onClose: () => void;
  onStory: (id: string) => void;
}) {
  const dialog = useRef<HTMLDialogElement>(null);
  const [filter, setFilter] = useState('All'),
    [query, setQuery] = useState('');
  useEffect(() => {
    dialog.current?.showModal();
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);
  const matches = searchStories(stories, query, filter);
  return (
    <dialog
      ref={dialog}
      className={`overlay ${kind}`}
      aria-labelledby="overlay-title"
      onCancel={onClose}
    >
      <div className="overlay-shell">
        <div className="overlay-top">
          <span className="micro">
            NBA BUTTERFLY EFFECT /{' '}
            {kind === 'archive' ? 'THE ARCHIVE' : 'THE FOOTNOTES'}
          </span>
          <button
            className="icon-button"
            aria-label="Close archive or about"
            onClick={onClose}
          >
            <X />
          </button>
        </div>
        {kind === 'archive' ? (
          <>
            <div className="archive-heading">
              <h2 id="overlay-title">
                EVERY TRADE
                <br />
                <span>HAS AN AFTERLIFE.</span>
              </h2>
              <p>
                {stories.length} doors into basketball history.
                <br />
                Pick a deal. Follow what moved.
              </p>
            </div>
            <div className="archive-controls">
              <div className="archive-filters" aria-label="Story categories">
                {['All', 'Dallas', 'Classic', 'Modern'].map((f) => (
                  <button
                    key={f}
                    aria-pressed={filter === f}
                    onClick={() => setFilter(f)}
                  >
                    {f}
                    {f === 'All' && <small>{stories.length}</small>}
                  </button>
                ))}
              </div>
              <label className="archive-search">
                <Search size={17} />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Player, team, or year"
                  aria-label="Search stories"
                />
              </label>
            </div>
            <div className="archive-grid">
              {matches.map((s) => (
                <button
                  key={s.id}
                  className={`story-tile ${s.image ? 'has-photo' : ''}`}
                  style={{ '--story-color': s.color } as React.CSSProperties}
                  onClick={() => onStory(s.id)}
                >
                  {s.image && (
                    <img
                      src={`/images/${s.image}.webp`}
                      alt=""
                      loading="lazy"
                      width="420"
                      height="520"
                    />
                  )}
                  <span className="tile-year" aria-hidden="true">
                    {String(s.year).slice(2)}
                  </span>
                  <span className="tile-top">
                    <span>{s.category}</span>
                    <span>
                      {s.year}—{s.endYear}
                    </span>
                  </span>
                  <span className="tile-bottom">
                    <span className="micro">
                      {s.transactions.length} MOMENTS
                    </span>
                    <strong>{s.title}</strong>
                    <span>{s.subtitle}</span>
                  </span>
                  <ArrowUpRight className="tile-arrow" size={22} />
                </button>
              ))}
            </div>
            {!matches.length && (
              <p className="search-empty">
                No stories match that search. Try a player’s surname or another
                year.
              </p>
            )}
          </>
        ) : (
          <div className="about-copy">
            <h2 id="overlay-title">
              THE STORY
              <br />
              BEHIND THE LINES.
            </h2>
            <p className="about-lead">
              Basketball remembers the headline. This is a place to explore
              everything attached to it.
            </p>
            <p>
              Made by Tanmay, a Mavericks fan with a soft spot for Dirk, Luka,
              and the long way around. NBA Butterfly Effect is an independent,
              curated basketball history project.
            </p>
            <h3>Read the connections</h3>
            <p>
              Every exchange has a transaction hub. When several players and
              picks were traded together, the entire package is shown. A line
              between two deals means an asset appears in both; it does not mean
              that asset alone purchased the next return.
            </p>
            <p>
              Solid player nodes can represent a signed player or draft rights,
              as labelled. Dashed nodes represent future pick obligations. A
              numbered selection is a separate asset that settles an obligation.
              Swap rights exchange selections; they are not extra picks.
            </p>
            <h3>A smaller, documented history</h3>
            <p>
              Each story names its coverage limit. Untraced assets are not
              claimed to have expired, stayed put, or reached a particular
              player. Future rights are described as of the scene’s date. Some
              minor terms are undisclosed in public announcements and are
              labelled accordingly. Championship and career outcomes are never
              proof that a trade caused them.
            </p>
            <p>
              The prepared dataset contains {metadata.events} unique events,
              independently written from public team announcements, media
              guides, draft records and reporting. Sources appear beside each
              event. It does not scrape websites when you visit. Last research
              review: September 8, 2026.
            </p>
            <h3>Portrait credits</h3>
            {credits.assets.map((c) => (
              <div className="photo-credit" key={c.id}>
                <img
                  src={`/images/${c.id}.webp`}
                  width="62"
                  height="76"
                  alt=""
                  loading="lazy"
                />
                <p>
                  <strong>{c.subject}</strong>
                  <a href={c.source_page_url} target="_blank" rel="noreferrer">
                    {c.author} / Wikimedia Commons <ArrowUpRight size={12} />
                  </a>
                  <a href={c.license_url} target="_blank" rel="noreferrer">
                    {c.license}
                  </a>
                  <small>
                    {c.date}. Resized, WebP encoded and cropped in the layout;
                    color treatment applied. Photo adaptations retain their
                    original license.
                  </small>
                </p>
              </div>
            ))}
            <p className="detail-note">
              Team names identify the participants. This project is not
              affiliated with or endorsed by the NBA or its teams. Team logos
              and unlicensed league photography are not used.
            </p>
            <a
              className="source-code-link"
              href="https://github.com/tstanmay13/nba-butterfly-effect"
              target="_blank"
              rel="noreferrer"
            >
              <BookOpen size={18} /> Research, methodology & source code{' '}
              <ArrowUpRight size={16} />
            </a>
          </div>
        )}
      </div>
    </dialog>
  );
}
