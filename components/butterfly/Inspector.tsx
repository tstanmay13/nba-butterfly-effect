'use client';
import { useEffect, useRef } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  BookOpen,
  Check,
  X,
  Clock3,
} from 'lucide-react';
import type { StoryData, ViewState } from '../../lib/model';
import {
  latestRecordedHolding,
  assetJourney,
  eventAssets,
  eventIndex,
  ownership,
  shortDate,
  teamName,
  visibleEvents,
  assetLabel,
} from '../../lib/history';
export function Inspector({
  data,
  state,
  onClose,
  onSelect,
  onEvent,
  allowGaps = false,
}: {
  allowGaps?: boolean;
  data: StoryData;
  state: ViewState;
  onClose: () => void;
  onSelect: (id: string) => void;
  onEvent: (id: string) => void;
}) {
  const heading = useRef<HTMLHeadingElement>(null);
  useEffect(() => {
    heading.current?.focus({ preventScroll: true });
  }, [state.node]);
  const shown = visibleEvents(data, state.step);
  const transaction = shown.find((t) => t.id === state.node);
  const asset = state.node ? data.assets[state.node] : null;
  const holding = asset
    ? allowGaps
      ? latestRecordedHolding(shown, asset.id)
      : ownership(shown).get(asset.id)
    : null;
  if (!transaction && !asset) return null;
  const events = asset ? assetJourney(data, asset.id) : [];
  const index = eventIndex(data, state.step);
  const previous = events.filter((t) => eventIndex(data, t.id) < index).at(-1);
  const next = events.find((t) => eventIndex(data, t.id) > index);
  const refs = transaction
    ? transaction.sources
    : [
        ...new Set(
          shown
            .filter((t) => eventAssets(t).has(asset!.id))
            .flatMap((t) => t.sources),
        ),
      ];
  const knownConversions = asset
    ? shown.flatMap((t) =>
        t.conversions
          .filter((c) => c.from === asset.id || c.to === asset.id)
          .map((c) => ({ t, c })),
      )
    : [];
  return (
    <aside
      className="inspector"
      aria-label="Selected item details"
      data-testid="inspector"
    >
      <div className="inspector-top">
        <span className="micro">
          {transaction ? 'THE FULL EXCHANGE' : 'FOLLOW THE ASSET'}
        </span>
        <button
          className="icon-button"
          onClick={onClose}
          aria-label="Close details"
        >
          <X size={20} />
        </button>
      </div>
      <div className="inspector-scroll">
        <h2 tabIndex={-1} ref={heading}>
          {transaction?.shortTitle || asset!.name}
        </h2>
        {transaction ? (
          <>
            <p className="inspector-date">
              {shortDate(transaction.date)} · {transaction.teams.join(' / ')}
            </p>
            <p>{transaction.text}</p>
            <div className="exact-terms">
              <h3>Who received what</h3>
              {transaction.teams.map((team) => {
                const moves = transaction.moves.filter((m) => m.to === team);
                return moves.length ? (
                  <section key={team}>
                    <h4 style={{ color: data.teams[team].color }}>
                      {teamName(data, team, transaction.date)}
                    </h4>
                    <ul>
                      {moves.map((m) => (
                        <li key={m.asset}>
                          <button onClick={() => onSelect(m.asset)}>
                            {data.assets[m.asset].name}
                            <ArrowUpRight size={13} />
                          </button>
                          <small>
                            {assetLabel(data.assets[m.asset], m.form)} · from{' '}
                            {m.from}
                            {m.note ? ` · ${m.note}` : ''}
                          </small>
                        </li>
                      ))}
                    </ul>
                  </section>
                ) : null;
              })}
              {transaction.conversions.map((c) => (
                <p className="conversion-description" key={c.from}>
                  {data.assets[c.from].name} → {data.assets[c.to].name}
                  <small>
                    {c.kind === 'selection'
                      ? 'Draft rights selected'
                      : 'Obligation conveyed'}{' '}
                    · {c.team}
                  </small>
                </p>
              ))}
              {transaction.resolutions.map((r) => (
                <p key={r.asset}>{r.detail}</p>
              ))}
            </div>
            {transaction.notes.map((n) => (
              <p className="detail-note" key={n}>
                {n}
              </p>
            ))}
          </>
        ) : (
          <>
            <div className="asset-type-label">
              {assetLabel(asset!, holding?.form)}
              {asset!.round && ` · Round ${asset!.round}`}
            </div>
            {asset!.origin && (
              <p className="origin">
                <span>Original franchise</span>
                {data.teams[asset!.origin]?.name || asset!.origin}
              </p>
            )}
            {!!asset!.candidates?.length && (
              <p className="origin">
                <span>Original franchise determined from</span>
                {asset!.candidates.map((id) => data.teams[id].name).join(' / ')}
              </p>
            )}
            {asset!.conditions && (
              <div className="condition-block">
                <h3>Terms of the asset</h3>
                <p>{asset!.conditions}</p>
              </div>
            )}
            {asset!.detail && <p>{asset!.detail}</p>}
            {holding && (
              <p className="holding">
                <Clock3 size={16} />
                <span>
                  <strong>
                    {holding.status === 'held'
                      ? `With ${data.teams[holding.team]?.short || holding.team}`
                      : holding.status === 'converted'
                        ? 'Converted in this history'
                        : holding.status[0].toUpperCase() +
                          holding.status.slice(1)}
                  </strong>
                  <small>
                    As recorded by {shortDate(state.at)}. This is a curated
                    history, not a current roster.
                  </small>
                </span>
              </p>
            )}
            {knownConversions.map(({ t, c }) => (
              <button
                className="related-conversion"
                key={`${t.id}-${c.from}`}
                onClick={() => onSelect(c.from === asset!.id ? c.to : c.from)}
              >
                <span>
                  {c.from === asset!.id ? 'BECAME' : 'SETTLED FROM'}
                  <strong>
                    {data.assets[c.from === asset!.id ? c.to : c.from].name}
                  </strong>
                  <small>{shortDate(t.date)}</small>
                </span>
                <ArrowRight size={18} />
              </button>
            ))}
            <div className="trace-controls">
              <button
                disabled={!previous}
                onClick={() => previous && onEvent(previous.id)}
              >
                <ArrowLeft size={18} />
                <span>
                  Trace backward
                  <small>
                    {previous
                      ? shortDate(previous.date)
                      : 'Start of this branch'}
                  </small>
                </span>
              </button>
              <button disabled={!next} onClick={() => next && onEvent(next.id)}>
                <span>
                  Follow forward
                  <small>
                    {next
                      ? 'Reveal the next connection'
                      : 'End of curated branch'}
                  </small>
                </span>
                <ArrowRight size={18} />
              </button>
            </div>
            <p className="detail-note">
              {!next
                ? 'Later history is not traced here. An endpoint does not mean an asset expired or stayed with this team.'
                : 'Following forward advances the timeline. Other assets in that transaction will appear as part of the full package.'}
            </p>
          </>
        )}
        <div className="source-list">
          <h3>
            <BookOpen size={16} /> The record
          </h3>
          <div className="verification">
            <Check size={14} /> Transaction verified · reviewed{' '}
            {data.story.cutoff ? shortDate('2026-09-08') : ''}
          </div>
          {refs.map(
            (ref) =>
              data.sources[ref] && (
                <a
                  key={ref}
                  href={data.sources[ref].url}
                  target="_blank"
                  rel="noreferrer"
                >
                  <span>
                    <small>{data.sources[ref].publisher}</small>
                    {data.sources[ref].title}
                  </span>
                  <ArrowUpRight size={16} />
                </a>
              ),
          )}
        </div>
      </div>
    </aside>
  );
}
