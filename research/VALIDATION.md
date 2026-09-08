# Release validation

Reviewed September 8, 2026.

## Data and engineering

- 25 curated stories; 132 canonical events; 243 source records. Every published event has citations, an effective date, participating franchises, verification status and review date.
- `npm run prepare-data` validates references and strict ownership separately within every story. Shared transactions have one canonical identity.
- `npm test`: 32 passing tests. Coverage includes every story at every chronological prefix, invalid ownership transfers, three- and five-team trades, draft rights, distinct obligations and actual selections, protection boundaries, rollovers, swaps, returned obligations, same-day ordering, shared records, timeline filtering, outstanding assets, URL restoration and deterministic graph layout.
- The combined-archive audit found no duplicated player identities, duplicate source URLs, missing references, or reuse of consumed picks. The first checkpoint had six explicitly dashed cross-story ownership gaps. The expanded archive has 16: Humphries, Lamb, Irving, Richardson, Olynyk, Exum, Buckner, Türkoğlu, Rubio, Crowder, Westbrook, Damian Jones, Alexander-Walker, the Golden State 2026 second, Schröder and Russell. These lines mean the same asset appears again, with intervening moves outside this archive.
- `npm run check` and the static production build pass. `npm audit` reports zero vulnerabilities after dependency updates.

## Browser verification

Actual Chrome interaction against the static production export, alongside desktop and 390-pixel responsive layout inspection. The phone-sized check used the app in a temporary 390×844 iframe when the browser viewport override did not apply; this verifies responsive layout and click controls, not physical-device touch behavior.

- Opened all 15 original stories and exercised their trade details, source sections and timeline navigation. Checked long branches and final draft conversions, including Shaq/Gasol to Mogbo, Harden to Reed Sheppard, Towns to Beringer and Butler to Jakučionis.
- Inspected the Dallas opening composition, all three locally hosted licensed portraits, editorial typography, complete exchange hubs and mobile details sheet. Portraits loaded successfully. The opening phone document had no horizontal overflow (390-pixel body and scroll width).
- Inspected the expanded 83-event web at overview and focused zoom. Searched Vásquez, selected a result, followed its highlighted shared-pick connection and inspected the complete Toronto–Milwaukee exchange.
- Rewound the global timeline to its first date: one event remained. Restored the final date: 83 events returned. Used the readable list on the phone layout and inspected the entire five-team Butler package.
- Reloaded a shared web URL with date, search, focus and selected transaction; the selected trade and details restored.
- Checked native keyboard timeline controls (Home/End), archive navigation, readable labels, visible focus styling and reduced-motion/hidden-tab implementation. Mobile inspection revealed missing names on two icon-only navigation controls; explicit labels were added.
- Production browser error log was empty. Earlier development-only hydration warnings identified Grammarly-added body attributes; no application exception was observed.

This is not an exhaustive physical-device matrix or a claim of audited WCAG conformance. Reduced-motion behavior is implemented using the media preference and CSS; a device-wide accessibility setting was not changed during testing.

## Payload and scope

The built client JavaScript totals about 167 KB compressed across all chunks; CSS about 13 KB. The optional full-archive JSON is about 63 KB compressed. The three optimized WebP portraits total about 288 KB and have reserved dimensions. These are artifact sizes, not a network-throttled performance score.

Each story states its coverage limit. This release is a curated transaction history, not a current roster, complete NBA ledger, or live pick tracker. Unknown contract details and untraced branches remain labelled. Source links may change or become unavailable independently of the deployed dataset.

## Checkpoint 2: a quieter explorer

The default full-archive view now opens on Luka’s neighborhood. A selected trade removes unrelated nodes and arranges direct earlier/later packages into separate wings. A visible connection navigator provides a click path without dragging. The entire network remains available through an explicit control, with search and franchise filtering.

Added three regressions (29 total): exact one-hop membership and chronological wings, no future leakage into focus, and focused/entire-archive URL restoration. Visually checked desktop and 390-pixel layouts; confirmed the 83-node overview survives reload. Readable-list scrolling now permits vertical touch gestures.

Checkpoint 1 was deployed successfully at https://butterfly.tanmay-singh.com with active HTTPS. Production loading, asset traversal, team perspective switching, browser back and the browser error log were checked on the live deployment. DNS comparison confirmed the three existing records were unchanged; only the Butterfly CNAME and its two specific verification TXT records were added.

## Expanded research review

The second research wave adds 49 canonical events and ten stories. Independent review found no duplicate normalized player names, duplicate events, same-day package collisions, consumed-pick reuse or story boundary mismatches. All 25 routes pass strict ownership. Complex 2023 Beal, Durant and Anthony’s 2011 package were cross-checked against primary team releases and completed-trade ledgers. A six-player Carter exchange incorrectly headlined “seven players”; the copy was corrected before publication.

Lee Shaffer’s retired-player rights are explicitly distinguished from draft rights and active players, with a dedicated regression. The 2025 Durant seven-team exchange remains outside the curated coverage; the verified Cameron Johnson branch continues instead. All 16 global ownership gaps remain dashed. See the two wave-2 research notes for protections, date discrepancies and intentional endpoints.

All ten added roots were opened at 390-pixel width, their complete packages inspected, and their timelines advanced to the documented endpoint. Verified Shaffer’s distinct rights label, historical San Francisco Warriors/New Orleans Hornets names, and the corrected six-player Carter headline. Testing found that searching “Carmelo” could miss its editorially titled story; the catalog now indexes actual asset names, franchises and years. Search also normalizes accents (e.g. Doncic and Vásquez), with two additional data-backed regressions.

Final browser checks confirmed “Carmelo Anthony” finds its story, “Doncic” finds the connected Dallas routes, Escape closes the archive, and 320-pixel layout has no horizontal overflow. The full-web date control retained focus at a valid earlier date, reduced the archive to one event in January 1965, and the explicit Luka jump advanced to June 21, 2018 before revealing its single visible node. No production-build browser errors were captured. The live share fallback exposed the complete copyable URL when clipboard access was denied by the browser.

## Collection home, readable archive and third expansion — September 8, 2026

The root now opens the collection, with Dallas, Brooklyn and Dirk features, recent trade entrances and an indexed story library. Direct story and web URLs remain separate entrances. The archive overview groups the revealed events by decade, then opens normal-size event tiles and a focused package graph. It no longer renders every event as a miniature card. Readable-list mode preserves the selected decade or neighborhood. Calendar-invalid URL dates are rejected; switching to the web invalidates an outstanding story load.

The third wave adds 46 canonical events and ten stories: Kareem, Pippen, Rodman, Iverson, McGrady, Harden Clippers, Mitchell, Fox/LaVine, Siakam and Butler's earlier journey. The combined archive contains 35 stories, 178 events (125 trades, 46 draft events and 7 resolutions), 748 assets and 318 source records. All story prefixes pass strict ownership. Canonical player-name checks found no duplicates. Untraced global ownership routes remain explicitly dashed in the detailed web; these are not fabricated direct trades.

All 41 automated checks pass, covering the new collection entrances, exact era partitions, nonoverlapping canonical layout, scoped URL restoration, invalid calendar dates, the two separate Siakam-day transactions, the Harden composite first reaching Dallas, the Odom/Hill/Harden obligation, historical Seattle and explicitly undisclosed Rodman consideration. TypeScript and authored lint pass.

Actual browser checks exercised collection→Boston→home→back, decade→trade→readable list→back→reload, player search, all seven era nodes and the absence of miniature trade cards in the overview. Both 320px and 390px responsive browser layouts have no horizontal page overflow. All ten new story journeys were opened at 390px, including source panels, timeline endpoints and return to home. The three licensed portraits loaded successfully. The static-build browser error log was empty. These are responsive browser checks, not a physical-device or formal accessibility certification.

Only this project's disposable build/cache files and old task archives were removed to resolve local disk pressure. No paid data, subscriptions, archival access, API credits, imagery or hosting upgrade was purchased. The owner’s zero-purchase constraint is recorded in AGENTS.md and the source-feasibility document.
