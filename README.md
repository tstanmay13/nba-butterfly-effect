# NBA Butterfly Effect

**What did this trade eventually become?** An independent, curated NBA transaction documentary by Tanmay.

Production: https://butterfly.tanmay-singh.com  
Repository: https://github.com/tstanmay13/nba-butterfly-effect

15 stories, 83 unique events, prepared locally from cited records. No account, runtime scraping, analytics, external fonts, or paid data service. This repository and hosting project are separate from Tanmay’s personal site.

## Run and verify

Requires Node 22.13+ and Python 3.

```sh
npm ci
npm run dev
npm run prepare-data
npm test
npm run check
npm run build
```

The build is a static export in `dist/client`. `npm run prepare-data` regenerates canonical data, validates references and ownership, and writes one JSON file per story. Tests run against those published files. `npm run check` type-checks the project and lints authored code; untouched, unused scaffold UI components are excluded from lint. Photographs are pre-sized WebP files, so native `img` elements are intentional.

## The collection and its boundaries

| Story | Coverage |
| --- | --- |
| The Luka ripple | Traces Luka, Trae and the Dallas first through Reddish; the Reddish–Hart exchange joins the 2019 Davis branch. Follows New York’s first to Kris Murray and McCollum into Washington’s 2026 Trae exchange. Stops February 5, 2026. Other pick rights and secondary player branches are untraced. |
| The night Dallas changed | Follows the separate Dirk and Nash draft-night packages, Dallas’s 1999 first to Marion, and Marion through Miami and Toronto back to Dallas in July 2009. Shaq’s Miami, Phoenix and Cleveland exchanges are shared intersections. Conditional Toronto picks and other branches stop at their recorded transfers; Nash’s free agency is not a trade return. |
| Brooklyn buys the present | Follows the Brooklyn picks to Young, Brown, the Tatum trade-down, Sexton’s Donovan Mitchell package, and Langford’s Derrick White package through September 3, 2022. White’s 2022 first becomes Blake Wesley. Other player moves, later swap amendments and future picks are untraced. |
| Thirteen to Los Angeles | The June 26 selection and July 11, 1996 Bryant–Divac exchange only. This is a short origin story; later free agency is outside the trade graph. |
| The dynasty splits | Follows both Shaq pick returns, Marion’s Dallas route, Butler’s Dallas exchange, the Gasol packages, and the Lakers 2010 first through Vásquez to Powell rights, Anunoby and Mogbo. Stops June 27, 2024. Untraced obligations are labelled; no free agency or shared championship is treated as a trade connection. |
| The brothers in the fine print | Follows Marc to Toronto and the Lakers 2010 first to Vásquez, then his New Orleans, Sacramento, Toronto and Milwaukee exchanges. The Clippers first becomes Anunoby; the later Knicks package’s Detroit second becomes Mogbo. Stops June 27, 2024. The Lakers 2008 first and other side branches remain untraced. |
| Boston’s two big swings | Follows the Brooklyn picks to Young, Brown, the Tatum trade-down, Sexton’s Donovan Mitchell package, and Langford’s Derrick White package through September 3, 2022. White’s 2022 first becomes Blake Wesley. Other player moves, later swap amendments and future picks are untraced. |
| Houston finds its headliner | From Houston’s 2012 acquisition through the completed 2021 four-team exchange and 2022 Philadelphia deal. Selected pick branches become Adams, Abrines, McGary, Eason, Nembhard, Ben Sheppard and Reed Sheppard. Stops June 26, 2024; later player moves, swap amendments and unused fallback terms are untraced. |
| The return trip | Follows Keldon Johnson and Poeltl’s return, then Toronto’s No. 8 into the Dillingham rights trade. Stops June 26, 2024 with Minnesota’s future first and swap outstanding at that point. |
| The price of right now | Both sides of Indiana’s George return are followed: Sabonis into the Haliburton package; Oladipo through the four-team Harden deal, LeVert, Nembhard and Ben Sheppard. Includes the full Clippers package and Jalen Williams. Stops June 22, 2023; other picks and intervening free agency are untraced. |
| The Davis chain | The Davis route from 2019 through February 2026, plus Hart into the Reddish exchange and New York’s first into Kris Murray. McCollum’s New Orleans–Washington–Atlanta path is included, as is Chicago’s second through Washington to Dallas. Other rights are untraced beyond their displayed transactions. |
| Another Dallas crossroads | Follows Morris from the Kyrie package into the Luka deal, then Davis into Washington. This is not a claim that Kyrie was traded for any of those returns. Brooklyn’s picks are untraced. |
| Four days in Portland | Includes Brogdon’s 2022 Boston arrival as backward context for the 2023 Holiday package, then Lillard’s three-team trade, Holiday to Boston and the July 7, 2025 Simons exchange. Future draft rights and other player branches are untraced. |
| A new center of gravity | The complete October 2, 2024 three-team trade and Detroit’s first conveying to Minnesota as No. 17 in 2025. Other players and second-round outcomes are untraced. |
| Five teams, one headline | The final February 6 five-team package and the Golden State first becoming Miami’s No. 20. Some minor second-round terms were undisclosed; those assets are labelled and left untraced. |

Every story also displays its boundary in the experience. Other outgoing assets stop at their last documented transfer. This does not mean they stayed put, expired, or have no subsequent history. The archive is not a current roster or a complete asset ledger. Minor publicly undisclosed terms are labelled; they have no invented downstream branches.

## Architecture

- `research/curate.py`: hand-authored facts, contract terms, original editorial copy and source catalog. No network requests.
- `data/archive.json`: canonical, stable asset and event identities shared across stories.
- `lib/model.ts`: players/rights, pick obligations, actual picks, swaps, cash, transactions and story model.
- `lib/history.ts`: ownership validation, temporal filtering, identity-preserving conversions, package connections and URL state.
- `scripts/prepare-data.ts`: validation and per-story publication to `public/data`.
- `components/butterfly`: SVG/HTML trade scene, accumulated connection map, inspector, timeline, archive, optional all-archive web and navigation.
- `tests/history.test.ts`: history correctness and state restoration regressions.

The initial Dallas story is embedded. Other stories load on demand and are cached for the session. Photos and fonts are local. SVG paths are measured on layout changes with `ResizeObserver`; CSS runs the short reveal/flow animation. There is no animation frame React loop. Hidden tabs stop playback and animation. Reduced motion disables animation and changes guided playback to manual advancement.

Shared URLs encode `story`, `at`, `step`, `node`, `team`, and `mode`. `step` distinguishes separate events on the same date. Invalid dates and unavailable nodes are clamped to published history. Browser back restores the complete state. Map connections name shared asset identities; they never equate all package inputs with all outputs.

See [adding a story](research/ADDING_A_STORY.md), [research and reuse](research/METHODOLOGY.md), and [validation](research/VALIDATION.md).

The **All connections** web loads the full canonical archive on demand. It supports pan/zoom, franchise filtering, player search, one-hop highlighting, a readable list, date filtering and shared URLs. Solid links track shared assets with continuous known ownership; dashed links explicitly mark intervening moves outside the curated record. See `lib/network.ts` and `tests/network.test.ts`.

## Deployment

This is a static Sites project; its non-secret project binding is in `.openai/hosting.json`. Build, commit, push the same source to GitHub and the Sites source remote, package `dist/client` with the Sites packaging helper, save that exact commit and deploy the saved version. Never store source credentials in files or remote URLs. DNS changes are limited to `butterfly.tanmay-singh.com` and its hostname-specific verification records.

## Credits and licensing

Original application code: MIT. Prepared facts have linked sources and original wording; source articles remain their publishers’ property. Photo adaptations retain their CC licenses. See [LICENSE](LICENSE), [image credits](data/image-credits.json), and the in-app methodology/credits view. NBA and team names identify historical participants; this is not an affiliated or endorsed product.
