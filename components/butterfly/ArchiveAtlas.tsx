'use client';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, GitBranch } from 'lucide-react';
import type { Archive } from '../../lib/model';
import { shortDate, teamName } from '../../lib/history';
import { archiveEras, type NetworkLayout } from '../../lib/network';

export function ArchiveAtlas({
  archive,
  visible,
  matches,
  era,
  onEra,
  onSelect,
  filtered,
  at,
}: {
  archive: Archive;
  visible: NetworkLayout;
  matches: Set<string>;
  era: number | null;
  onEra: (era: number | null) => void;
  onSelect: (id: string) => void;
  filtered: boolean;
  at: string;
}) {
  const eras = useMemo(() => archiveEras(visible), [visible]);
  const map = useRef<HTMLDivElement>(null);
  const [paths, setPaths] = useState<string[]>([]);
  const browsing = era !== null || filtered;
  const rootIds = new Set(archive.stories.map((s) => s.root));
  const events = visible.nodes.filter(
    (n) =>
      matches.has(n.id) &&
      (era === null ||
        (Number(n.event.date.slice(0, 4)) >= era &&
          Number(n.event.date.slice(0, 4)) < era + 10)),
  );
  useEffect(() => {
    if (browsing || !map.current) return;
    const element = map.current;
    const resize = () => {
      const box = element.getBoundingClientRect();
      const buttons = [...element.querySelectorAll<HTMLElement>('[data-era]')];
      const positions = new Map(
        buttons.map((b) => {
          const r = b.getBoundingClientRect();
          return [
            Number(b.dataset.era),
            {
              x: r.left - box.left + r.width / 2,
              y: r.top - box.top + r.height / 2,
            },
          ];
        }),
      );
      const byId = new Map(
        visible.nodes.map((n) => [
          n.id,
          Math.floor(Number(n.event.date.slice(0, 4)) / 10) * 10,
        ]),
      );
      const pairs = new Set(
        visible.links
          .map((l) => `${byId.get(l.from)}:${byId.get(l.to)}`)
          .filter((p) => p.split(':')[0] !== p.split(':')[1]),
      );
      setPaths(
        [...pairs].flatMap((pair) => {
          const [from, to] = pair.split(':').map(Number);
          const a = positions.get(from),
            b = positions.get(to);
          return a && b
            ? [
                `M${a.x},${a.y} C${a.x},${(a.y + b.y) / 2 - 80} ${b.x},${(a.y + b.y) / 2 - 80} ${b.x},${b.y}`,
              ]
            : [];
        }),
      );
    };
    const observer = new ResizeObserver(resize);
    observer.observe(element);
    return () => observer.disconnect();
  }, [visible, browsing]);
  return (
    <section className="archive-atlas" aria-label="Archive map">
      <div className="atlas-heading">
        <div>
          {browsing && (
            <button className="atlas-return" onClick={() => onEra(null)}>
              <ArrowLeft size={15} /> All decades
            </button>
          )}
          <h2>
            {filtered
              ? 'FOLLOW A NAME.'
              : era !== null
                ? `${era}s`
                : 'FIND YOUR ERA.'}
          </h2>
          <p>
            {browsing
              ? 'Choose a complete trade to unfold its players, picks and next connections.'
              : 'A league of stories, opened one thread at a time. Choose a decade to explore.'}
          </p>
        </div>
        <span className="atlas-revealed">
          Through {shortDate(at)}
          <strong>
            {browsing ? events.length : visible.nodes.length} events
          </strong>
        </span>
      </div>
      {!browsing ? (
        <>
          <div className="atlas-era-map" ref={map}>
            <svg className="atlas-era-lines" aria-hidden="true">
              {paths.map((d, i) => (
                <path key={i} d={d} />
              ))}
            </svg>
            {eras.map(({ decade, nodes }) => {
              const featured = nodes.filter((n) => rootIds.has(n.id));
              return (
                <button
                  key={decade}
                  data-era={decade}
                  className="atlas-era"
                  onClick={() => onEra(decade)}
                  aria-label={`Explore ${decade}s, ${nodes.length} events`}
                >
                  <span className="atlas-decade">
                    {decade}
                    <small>s</small>
                  </span>
                  <span className="atlas-era-count">
                    {nodes.length} trade & draft moments
                  </span>
                  <span className="atlas-era-preview">
                    {(featured.length ? featured : nodes)
                      .slice(0, 2)
                      .map((n) => (
                        <span key={n.id}>{n.event.shortTitle}</span>
                      ))}
                  </span>
                  <span className="atlas-era-enter">
                    Open this decade <ArrowRight size={17} />
                  </span>
                </button>
              );
            })}
          </div>
          <p className="atlas-map-caption">
            <GitBranch size={16} /> Lines connect decades that share players or
            picks in this archive.
          </p>
        </>
      ) : (
        <>
          {!filtered && (
            <nav className="atlas-era-tabs" aria-label="Choose a decade">
              {eras.map((e) => (
                <button
                  key={e.decade}
                  onClick={() => onEra(e.decade)}
                  aria-pressed={era === e.decade}
                >
                  {e.decade}s <small>{e.nodes.length}</small>
                </button>
              ))}
            </nav>
          )}
          <div className="atlas-events">
            {events.map((n) => {
              const connected = visible.links.filter(
                (l) => l.from === n.id || l.to === n.id,
              ).length;
              return (
                <button
                  className="atlas-event"
                  key={n.id}
                  onClick={() => onSelect(n.id)}
                  style={
                    {
                      '--node-color': archive.teams[n.event.teams[0]].color,
                    } as React.CSSProperties
                  }
                  aria-label={`Explore ${n.event.shortTitle}, ${shortDate(n.event.date)}`}
                >
                  <span className="atlas-event-date">
                    {shortDate(n.event.date)}
                    <small>
                      {n.event.kind === 'trade'
                        ? 'Trade'
                        : 'Draft & pick event'}
                    </small>
                  </span>
                  <strong>{n.event.shortTitle}</strong>
                  <span className="atlas-event-teams">
                    {n.event.teams
                      .map((id) => teamName(archive, id, n.event.date))
                      .join(' / ')}
                  </span>
                  <span className="atlas-event-follow">
                    <GitBranch size={14} />
                    {connected
                      ? `${connected} ${connected === 1 ? 'connection' : 'connections'}`
                      : 'Open the package'}
                    <ArrowUpRight size={18} />
                  </span>
                </button>
              );
            })}
          </div>
          {!events.length && (
            <p className="atlas-empty">
              No events match this date and search. Try another player,
              franchise or date.
            </p>
          )}
        </>
      )}
    </section>
  );
}
