'use client';
import { useLayoutEffect, useRef, useState } from 'react';
import {
  ArrowRight,
  ArrowLeftRight,
  UserRound,
  Ticket,
  Shuffle,
  Coins,
  ArrowUpRight,
  ChevronDown,
} from 'lucide-react';
import type { Asset, Movement, StoryData, Transaction } from '../../lib/model';
import { assetLabel, shortDate, linksBetween } from '../../lib/history';
const iconFor = {
  player: UserRound,
  rights: UserRound,
  obligation: Ticket,
  pick: Ticket,
  swap: Shuffle,
  cash: Coins,
};
export function AssetNode({
  asset,
  form,
  team,
  data,
  onSelect,
  selected,
  note,
  flow,
}: {
  asset: Asset;
  form?: string;
  team: string;
  data: StoryData;
  onSelect: (id: string) => void;
  selected?: boolean;
  note?: string;
  flow?: string;
}) {
  const Icon = iconFor[asset.kind];
  return (
    <button
      className={`asset-node ${asset.kind} ${selected ? 'selected' : ''}`}
      style={{ '--team-color': data.teams[team]?.color } as React.CSSProperties}
      onClick={() => onSelect(asset.id)}
      aria-label={`Inspect ${asset.name}${form === 'rights' ? ', draft rights' : form === 'player-rights' ? ', player rights' : ''}`}
      aria-pressed={!!selected}
      data-asset={asset.id}
    >
      <span
        className={`asset-mark ${asset.kind === 'player' ? 'person' : ''}`}
        aria-hidden="true"
      >
        {asset.kind === 'player' ? (
          asset.name
            .split(' ')
            .map((w) => w[0])
            .slice(0, 2)
            .join('')
        ) : asset.kind === 'pick' ? (
          String(asset.number).padStart(2, '0')
        ) : (
          <Icon size={18} />
        )}
      </span>
      <span className="asset-copy">
        <span className="asset-meta">
          {assetLabel(asset, form)}
          {flow && <span>{flow}</span>}
        </span>
        <strong>{asset.name}</strong>
        {note && <small>{note}</small>}
      </span>
      <ArrowUpRight className="node-arrow" size={16} />
    </button>
  );
}
function FlowLines({
  host,
  sceneKey,
}: {
  host: React.RefObject<HTMLDivElement | null>;
  sceneKey: string;
}) {
  const [geometry, setGeometry] = useState<{
    w: number;
    h: number;
    paths: { d: string; color: string }[];
  }>({ w: 1, h: 1, paths: [] });
  useLayoutEffect(() => {
    const el = host.current;
    if (!el) return;
    const measure = () => {
      const box = el.getBoundingClientRect(),
        hub = el.querySelector('[data-hub]')?.getBoundingClientRect();
      if (!hub) return;
      const center = {
        x: hub.left - box.left + hub.width / 2,
        y: hub.top - box.top + hub.height / 2,
      };
      const paths = [...el.querySelectorAll<HTMLElement>('[data-flow]')].map(
        (node) => {
          const b = node.getBoundingClientRect(),
            left = node.dataset.flow === 'out';
          const x = (left ? b.right : b.left) - box.left,
            y = b.top - box.top + b.height / 2;
          const cx = (x + center.x) / 2;
          return {
            d: left
              ? `M ${x} ${y} C ${cx} ${y} ${cx} ${center.y} ${center.x} ${center.y}`
              : `M ${center.x} ${center.y} C ${cx} ${center.y} ${cx} ${y} ${x} ${y}`,
            color:
              getComputedStyle(node).getPropertyValue('--line-color').trim() ||
              '#7194b9',
          };
        },
      );
      setGeometry({ w: box.width, h: box.height, paths });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(el);
    return () => observer.disconnect();
  }, [host, sceneKey]);
  return (
    <svg
      className="flow-lines"
      viewBox={`0 0 ${geometry.w} ${geometry.h}`}
      aria-hidden="true"
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3" />
        </filter>
      </defs>
      {geometry.paths.map((p, i) => (
        <g key={i}>
          <path
            d={p.d}
            stroke={p.color}
            strokeWidth="5"
            opacity=".1"
            filter="url(#glow)"
          />
          <path d={p.d} stroke={p.color} strokeWidth="1.25" opacity=".5" />
          <path
            className="flow-particle"
            d={p.d}
            stroke={p.color}
            strokeWidth="2"
            strokeDasharray="3 95"
          />
        </g>
      ))}
    </svg>
  );
}
export function TradeScene({
  data,
  transaction: t,
  team,
  selected,
  onSelect,
}: {
  data: StoryData;
  transaction: Transaction;
  team: string;
  selected: string | null;
  onSelect: (id: string) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const [expanded, setExpanded] = useState(false);
  const out = t.moves.filter((m) => m.from === team),
    incoming = t.moves.filter((m) => m.to === team),
    other = t.moves.filter((m) => m.from !== team && m.to !== team);
  function packageNodes(moves: Movement[], side: 'out' | 'in') {
    return (
      <div className={`package ${side}`}>
        <div className="package-label">
          <span className="direction-dot" />
          {side === 'out' ? 'SENT AWAY' : 'RECEIVED'}
          <span>
            {moves.length} {moves.length === 1 ? 'ASSET' : 'ASSETS'}
          </span>
        </div>
        {moves.map((m) => (
          <div
            key={m.asset}
            data-flow={side}
            style={
              {
                '--line-color': data.teams[side === 'in' ? team : m.to].color,
              } as React.CSSProperties
            }
          >
            <AssetNode
              asset={data.assets[m.asset]}
              form={m.form}
              team={side === 'in' ? team : m.to}
              data={data}
              onSelect={onSelect}
              selected={selected === m.asset}
              flow={`${side === 'out' ? 'To' : 'From'} ${side === 'out' ? m.to : m.from}`}
            />
          </div>
        ))}
        {!moves.length && (
          <p className="empty-package">No outgoing assets in this event.</p>
        )}
      </div>
    );
  }
  return (
    <div className="trade-scene" data-testid="trade-scene">
      {t.moves.length > 0 && (
        <>
          <div className="trade-court" key={`${t.id}-${team}`} ref={host}>
            <FlowLines host={host} sceneKey={`${t.id}-${team}`} />
            {packageNodes(out, 'out')}
            <div className="hub-column">
              <button
                data-hub
                className={`trade-hub ${selected === t.id ? 'active' : ''}`}
                aria-label="Inspect complete transaction"
                onClick={() => onSelect(t.id)}
              >
                <ArrowLeftRight size={22} />
              </button>
              <span className="hub-caption">
                {t.kind === 'swap' ? 'SWAP' : 'THE DEAL'}
              </span>
            </div>
            {packageNodes(incoming, 'in')}
          </div>
          {other.length > 0 && (
            <div className="other-package">
              <button
                aria-expanded={expanded}
                onClick={() => setExpanded(!expanded)}
              >
                <span>
                  <Shuffle size={16} /> Also in this {t.teams.length}-team deal
                </span>
                <span>
                  {other.length} more transfers{' '}
                  <ChevronDown className={expanded ? 'rotate' : ''} size={16} />
                </span>
              </button>
              {expanded && (
                <div className="other-transfers">
                  {other.map((m) => (
                    <div key={m.asset}>
                      <span className="micro">
                        {m.from} <ArrowRight size={12} /> {m.to}
                      </span>
                      <AssetNode
                        asset={data.assets[m.asset]}
                        form={m.form}
                        team={m.to}
                        data={data}
                        onSelect={onSelect}
                        selected={selected === m.asset}
                      />
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </>
      )}
      {t.conversions.length > 0 && (
        <div className="draft-scene">
          <div className="draft-heading">
            <Ticket size={18} />
            <span>
              {t.kind === 'draft'
                ? 'THE PROMISE BECOMES A SELECTION'
                : 'THE OBLIGATION SETTLES'}
            </span>
          </div>
          {t.conversions.map((c) => (
            <div className="conversion" key={`${c.from}-${c.to}`}>
              <AssetNode
                asset={data.assets[c.from]}
                data={data}
                team={c.team}
                onSelect={onSelect}
                selected={selected === c.from}
              />
              <div className="conversion-arrow">
                <ArrowRight size={22} />
                <small>
                  {c.kind === 'selection' ? 'SELECTED' : 'CONVEYED'}
                </small>
              </div>
              <AssetNode
                asset={data.assets[c.to]}
                form={c.kind === 'selection' ? 'rights' : undefined}
                data={data}
                team={c.team}
                onSelect={onSelect}
                selected={selected === c.to}
              />
            </div>
          ))}
          <button className="text-button" onClick={() => onSelect(t.id)}>
            Read the draft record <ArrowUpRight size={15} />
          </button>
        </div>
      )}
      {t.resolutions.length > 0 && (
        <div className="resolutions">
          {t.resolutions.map((r) => (
            <button key={r.asset} onClick={() => onSelect(r.asset)}>
              <Shuffle size={22} />
              <span>
                <span className="micro">
                  {r.status.replaceAll('-', ' ').toUpperCase()}
                </span>
                <strong>{data.assets[r.asset].name}</strong>
                <p>{r.detail}</p>
              </span>
              <ArrowUpRight size={16} />
            </button>
          ))}
        </div>
      )}
      <div className="scene-footnote">
        <span className="tiny-diamond" />{' '}
        {t.kind === 'trade'
          ? 'Lines meet at the deal. The entire package was exchanged.'
          : 'A selection settles an obligation. It does not create an extra pick.'}
      </div>
    </div>
  );
}
export function HistoryMap({
  data,
  events,
  current,
  onEvent,
  onSelect,
}: {
  data: StoryData;
  events: Transaction[];
  current: string;
  onEvent: (id: string) => void;
  onSelect: (id: string) => void;
}) {
  const links = linksBetween(events);
  return (
    <div className="history-map" data-testid="history-map">
      <div className="map-intro">
        <p className="micro">THE CONNECTIONS SO FAR</p>
        <p>
          Each stop is a whole transaction. Threads name the assets that appear
          again.
        </p>
      </div>
      <ol>
        {events.map((t, i) => (
          <li key={t.id} className={t.id === current ? 'current' : ''}>
            <div className="map-spine" aria-hidden="true">
              <span>{String(i + 1).padStart(2, '0')}</span>
            </div>
            <div className="map-event">
              {links
                .filter((l) => l.to === t.id)
                .map((l) => (
                  <div className="map-link" key={l.from}>
                    <span>
                      ↳ From{' '}
                      {shortDate(events.find((e) => e.id === l.from)!.date)}
                    </span>
                    {l.assets.slice(0, 4).map((a) => (
                      <button key={a} onClick={() => onSelect(a)}>
                        {data.assets[a].name}
                      </button>
                    ))}
                    {l.assets.length > 4 && (
                      <span>+ {l.assets.length - 4} shared assets</span>
                    )}
                  </div>
                ))}
              <button className="map-stop" onClick={() => onEvent(t.id)}>
                <span className="micro">
                  {shortDate(t.date)} · {t.teams.join(' / ')}
                </span>
                <strong>{t.shortTitle}</strong>
                <ArrowUpRight size={20} />
              </button>
              <button className="text-button" onClick={() => onSelect(t.id)}>
                Inspect package
              </button>
            </div>
          </li>
        ))}
      </ol>
      <p className="map-boundary">
        {events.length < data.transactions.length
          ? 'The future is hidden. Advance the timeline to reveal the next connection.'
          : 'You have reached the documented boundary of this story. Select any asset to retrace its path.'}
      </p>
    </div>
  );
}
