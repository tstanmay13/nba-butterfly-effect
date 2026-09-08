'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, ArrowUpRight, GitBranch, Search, X } from 'lucide-react';
import type { Story } from '../../lib/model';
import { searchStories } from '../../lib/search';
import metadata from '../../data/metadata.json';
import { Overlay } from './Archive';

const features = [
  {
    id: 'luka',
    title: 'The night Dallas\nfound Luka.',
    label: 'Dallas → Atlanta → Los Angeles',
    text: 'Two draft picks. Two careers. An exchange that keeps moving.',
  },
  {
    id: 'brooklyn',
    title: 'Brooklyn went all in.\nBoston played the long game.',
    label: 'Boston ↔ Brooklyn',
    text: 'Follow the picks behind Brown, Tatum and the next exchange.',
  },
  {
    id: 'dirk',
    title: 'A draft-night deal.\nA Dallas lifetime.',
    label: 'Milwaukee ↔ Dallas',
    text: 'Dirk, Nash and the separate moves that brought them together.',
  },
];
const recentIds = ['fox-lavine', 'butler', 'towns', 'siakam'];
const recentTitles: Record<string, string> = {
  'fox-lavine': 'Fox to San Antonio. LaVine to Sacramento.',
  butler: 'Jimmy Butler to Golden State',
  towns: 'Karl-Anthony Towns to New York',
  siakam: 'Pascal Siakam to Indiana',
};

export function Home({
  stories,
  onStory,
  onWeb,
  loading,
  error,
}: {
  stories: Story[];
  onStory: (id: string) => void;
  onWeb: () => void;
  loading: boolean;
  error: string;
}) {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [about, setAbout] = useState(false);
  const matches = searchStories(stories, query, category);
  const recent = recentIds
    .map((id) => stories.find((s) => s.id === id))
    .filter((s): s is Story => !!s)
    .slice(0, 4);
  return (
    <div className="archive-home" aria-busy={loading}>
      <a className="skip-link" href="#story-library">
        Skip to the stories
      </a>
      <header className="home-header">
        <Link
          className="home-brand"
          href="/"
          aria-label="NBA Butterfly Effect home"
        >
          <img src="/icon.svg" alt="" width="43" height="43" />
          <span>
            <small>NBA</small>
            <strong>Butterfly Effect</strong>
          </span>
        </Link>
        <nav aria-label="Main navigation">
          <a href="#story-library">
            The stories <span>{stories.length}</span>
          </a>
          <button onClick={onWeb}>
            <GitBranch size={17} />
            <span>Connection web</span>
          </button>
          <button onClick={() => setAbout(true)}>About</button>
        </nav>
      </header>
      <main>
        <section className="home-opening" aria-labelledby="home-title">
          <div className="home-intro">
            <h1 id="home-title">
              ONE TRADE.
              <br />A DIFFERENT LEAGUE.
            </h1>
            <div>
              <p>What did that trade eventually become?</p>
              <p>
                Follow the players. Follow the picks. Find the basketball
                history hiding between the headlines.
              </p>
              <a href="#story-library">
                Find your first thread <ArrowRight size={18} />
              </a>
            </div>
          </div>
          <div className="home-features">
            {features.map((feature) => {
              const s = stories.find((story) => story.id === feature.id)!;
              return (
                <button
                  className={`home-feature feature-${s.id}`}
                  key={s.id}
                  onClick={() => onStory(s.id)}
                  style={{ '--feature-color': s.color } as React.CSSProperties}
                >
                  <img
                    src={`/images/${s.image}.webp`}
                    alt={s.imageAlt || ''}
                    width="840"
                    height="1050"
                    fetchPriority={s.id === 'luka' ? 'high' : 'auto'}
                  />
                  <span className="feature-date">
                    {s.year}
                    <small>{s.category}</small>
                  </span>
                  <span className="feature-copy">
                    <small>{feature.label}</small>
                    <strong>{feature.title}</strong>
                    <span>{feature.text}</span>
                    <span className="feature-enter">
                      Explore this story <ArrowUpRight size={20} />
                    </span>
                  </span>
                </button>
              );
            })}
          </div>
        </section>
        <section className="home-recent" aria-labelledby="recent-title">
          <div>
            <span className="home-section-note">
              The league is still moving
            </span>
            <h2 id="recent-title">
              NEW TEAMS.
              <br />
              NEW THREADS.
            </h2>
            <p>Recent blockbusters with histories of their own.</p>
          </div>
          <div className="recent-rows">
            {recent.map((s) => (
              <button
                onClick={() => onStory(s.id)}
                key={s.id}
                style={{ '--feature-color': s.color } as React.CSSProperties}
              >
                <span>{s.year}</span>
                <strong>{recentTitles[s.id] || s.title}</strong>
                <small>{s.transactions.length} moments</small>
                <ArrowUpRight size={20} />
              </button>
            ))}
          </div>
        </section>
        <section
          className="home-web-invitation"
          aria-labelledby="home-web-title"
        >
          <div className="home-thread-art" aria-hidden="true">
            <span>
              <small>2017 / THE PAUL EXCHANGE</small>CLIPPERS RETURN
            </span>
            <i />
            <span>PATRICK BEVERLEY</span>
            <i />
            <span>
              <small>2022 / THE GOBERT EXCHANGE</small>UTAH RETURN
            </span>
          </div>
          <div>
            <h2 id="home-web-title">
              THERE’S ANOTHER
              <br />
              WAY INTO THE STORY.
            </h2>
            <p>
              Open a decade. Pick a trade. Follow its connections backward and
              forward through the league.
            </p>
            <button onClick={onWeb}>
              <GitBranch size={19} /> Explore the connection web{' '}
              <ArrowRight size={18} />
            </button>
          </div>
        </section>
        <section
          className="home-library"
          id="story-library"
          aria-labelledby="library-title"
        >
          <div className="home-library-heading">
            <h2 id="library-title">PICK A THREAD.</h2>
            <p>
              {stories.length} stories. {metadata.events} documented moments.
              <br />A whole league of starting points.
            </p>
          </div>
          <div className="home-library-controls">
            <div className="home-categories" aria-label="Story categories">
              {['All', 'Dallas', 'Classic', 'Modern'].map((c) => (
                <button
                  key={c}
                  onClick={() => setCategory(c)}
                  aria-pressed={category === c}
                >
                  {c}
                </button>
              ))}
            </div>
            <label className="home-search">
              <Search size={18} />
              <input
                placeholder="Player, team or year"
                aria-label="Search stories"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
              {query && (
                <button
                  aria-label="Clear story search"
                  onClick={() => setQuery('')}
                >
                  <X size={16} />
                </button>
              )}
            </label>
          </div>
          <p className="home-result-count" aria-live="polite">
            {matches.length} {matches.length === 1 ? 'story' : 'stories'}
            {query ? ` matching “${query}”` : ''}
          </p>
          <div className="home-story-index">
            {matches.map((s) => (
              <button
                key={s.id}
                onClick={() => onStory(s.id)}
                style={{ '--feature-color': s.color } as React.CSSProperties}
              >
                <span className="index-year">{s.year}</span>
                <span className="index-story">
                  <small>
                    {s.category} / {s.transactions.length} moments
                  </small>
                  <strong>{s.title}</strong>
                  <span>{s.subtitle}</span>
                </span>
                <ArrowUpRight size={20} />
              </button>
            ))}
          </div>
          {!matches.length && (
            <div className="home-no-results">
              <p>No threads found. Try a surname, team or another year.</p>
              <button
                onClick={() => {
                  setQuery('');
                  setCategory('All');
                }}
              >
                Show all stories
              </button>
            </div>
          )}
        </section>
        {error && (
          <p role="alert" className="home-error">
            {error}
          </p>
        )}
        {loading && (
          <output className="home-loading">Opening the story…</output>
        )}
      </main>
      <footer className="home-footer">
        <div>
          <strong>For the love of the game.</strong>
          <span>An independent basketball history project by Tanmay.</span>
        </div>
        <button onClick={() => setAbout(true)}>
          Sources, coverage & portrait credits <ArrowUpRight size={15} />
        </button>
      </footer>
      {about && (
        <Overlay
          kind="about"
          stories={stories}
          onClose={() => setAbout(false)}
          onStory={onStory}
        />
      )}
    </div>
  );
}
