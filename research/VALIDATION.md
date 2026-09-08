# Release validation

Reviewed September 8, 2026.

## Data and engineering

- 15 curated stories; 83 canonical events; 161 source records. Every published event has citations, an effective date, participating franchises, verification status and review date.
- `npm run prepare-data` validates references and strict ownership separately within every story. Shared transactions have one canonical identity.
- `npm test`: 26 passing tests. Coverage includes every story at every chronological prefix, invalid ownership transfers, three- and five-team trades, draft rights, distinct obligations and actual selections, protection boundaries, rollovers, swaps, returned obligations, same-day ordering, shared records, timeline filtering, outstanding assets, URL restoration and deterministic graph layout.
- The combined-archive audit found no duplicated player identities, duplicate source URLs, missing references, or reuse of consumed picks. Six cross-story ownership gaps are explicitly dashed: Humphries, Lamb, Irving, Richardson, Olynyk and Exum. These lines mean the same asset appears again, with intervening moves outside this archive.
- `npm run check` and the static production build pass. `npm audit` reports zero vulnerabilities after dependency updates.

## Browser verification

Actual Chrome interaction against the static production export, alongside desktop and 390-pixel responsive layout inspection. The phone-sized check used the app in a temporary 390×844 iframe when the browser viewport override did not apply; this verifies responsive layout and click controls, not physical-device touch behavior.

- Opened all 15 stories and exercised their trade details, source sections and timeline navigation. Checked long branches and final draft conversions, including Shaq/Gasol to Mogbo, Harden to Reed Sheppard, Towns to Beringer and Butler to Jakučionis.
- Inspected the Dallas opening composition, all three locally hosted licensed portraits, editorial typography, complete exchange hubs and mobile details sheet. Portraits loaded successfully. The opening phone document had no horizontal overflow (390-pixel body and scroll width).
- Inspected the expanded 83-event web at overview and focused zoom. Searched Vásquez, selected a result, followed its highlighted shared-pick connection and inspected the complete Toronto–Milwaukee exchange.
- Rewound the global timeline to its first date: one event remained. Restored the final date: 83 events returned. Used the readable list on the phone layout and inspected the entire five-team Butler package.
- Reloaded a shared web URL with date, search, focus and selected transaction; the selected trade and details restored.
- Checked native keyboard timeline controls (Home/End), archive navigation, readable labels, visible focus styling and reduced-motion/hidden-tab implementation. Mobile inspection revealed missing names on two icon-only navigation controls; explicit labels were added.
- Production browser error log was empty. Earlier development-only hydration warnings identified Grammarly-added body attributes; no application exception was observed.

This is not an exhaustive physical-device matrix or a claim of audited WCAG conformance. Reduced-motion behavior is implemented using the media preference and CSS; a device-wide accessibility setting was not changed during testing.

## Payload and scope

The built client JavaScript totals about 158 KB compressed across all chunks; CSS about 12.5 KB. The optional full-archive JSON is about 40 KB compressed. The three optimized WebP portraits total about 288 KB and have reserved dimensions. These are artifact sizes, not a network-throttled performance score.

Each story states its coverage limit. This release is a curated transaction history, not a current roster, complete NBA ledger, or live pick tracker. Unknown contract details and untraced branches remain labelled. Source links may change or become unavailable independently of the deployed dataset.
