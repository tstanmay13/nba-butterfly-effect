# Modern connection expansion

Reviewed September 8, 2026. Adds **19 canonical events, 70 assets and 33 source records** to the base archive. All added writing is original; the dataset contains independently selected facts and source links. It performs no network requests. No Pro Sports Transactions or Basketball Reference records were scraped or used as the source of these additions. Public team releases, league draft records, media guides and independently published reporting were read for verification; their availability is not treated as a bulk-data or image license.

## Connections added

| Branch | Added events | Stopping point |
| --- | --- | --- |
| Brooklyn 2018 first | Boston–Cleveland Irving exchange → No. 8 Collin Sexton → Donovan Mitchell package | September 3, 2022 |
| Boston’s trade-down consideration | 2018 non-conveyance → No. 14 Romeo Langford → Derrick White package → No. 25 Blake Wesley | June 23, 2022 |
| Indiana’s Paul George return | Oladipo enters the four-team Harden exchange; Sabonis enters the separate Haliburton exchange | Sabonis branch February 8, 2022 |
| LeVert’s part of the Harden package | LeVert to Cleveland → Houston second becomes Nembhard; Cleveland first rolls then becomes Ben Sheppard | June 22, 2023 |
| Harden’s later exchanges | Finalized Brooklyn four-team deal → Philadelphia/Simmons deal → Brooklyn elects to defer the Philadelphia first | June 1, 2022; later Harden trades untraced |
| Brooklyn firsts sent for Harden | 2022 No. 17 Tari Eason; 2024 No. 3 Reed Sheppard | June 26, 2024 |
| Oladipo in Houston | Miami receives Oladipo; Houston gets Olynyk, Bradley and conditional 2022 swap | March 25, 2021; no swap exercise traced |
| Brogdon before Holiday | Indiana–Boston five-player/first package | July 9, 2022; links forward to existing Holiday exchange |

Existing routes updated: `brooklyn` (13 events), `garnett` (14), `george` (10), `harden` (15), `lillard` (4). Events are shared by ID; repeated inclusion in routes creates no duplicate transaction. The global web can connect the same assets to other routes, but intervening free agency or untraced moves must remain marked as gaps.

## Date and package decisions

- **Kyrie, August 30, 2017:** Use the completed amended deal, not the August 22 proposal. Boston added Miami’s 2020 second. [Contemporaneous final report](https://www.hoopsrumors.com/2017/08/celtics-cavs-complete-kyrie-irving-trade.html) and [NBA report of the joint announcement](https://www.nba.com/news/report-boston-celtics-include-second-round-pick-complete-trade-cleveland) support this. The midnight publication boundary does not move the US effective date to August 31.
- **Mitchell, September 3, 2022:** Cleveland announced completion September 3. Utah’s follow-up was published September 8. Sexton was signed and traded. All three outright Cleveland firsts and both swap years appear in the [NBA completion report](https://www.nba.com/news/donovan-mitchell-traded-to-cavs); the [Utah release](https://www.nba.com/jazz/news/utah-jazz-acquire-agbaji-markkanen-sexton-and-future-draft-assets) cross-checks the players. Later third-party swap amendments are not followed.
- **Harden, January 16, 2021:** Record one final four-team package. The January 14 three-team announcement originally sent LeVert to Houston and Cleveland’s second to Brooklyn. Physicals changed the closing structure. [Indiana explicitly records completion January 16](https://www.nba.com/pacers/news/pritchard-pacers-backing-caris-levert-unexpected-circumstances), and the [final-structure report](https://www.hoopsrumors.com/2021/01/oladipo-levert-deal-complete-pacers-get-additional-compensation.html) confirms that the deal was formally completed as four teams. Net transfers therefore send LeVert from Brooklyn to Indiana, Cleveland’s composite second to Indiana and Brooklyn cash to Indiana. Includes Vezenkov’s draft rights. The [season transaction recap](https://www.hoopsrumors.com/2021/01/202021-in-season-nba-trades.html) supplies full comparison conditions and reports $2.6 million cash, but its January 17 heading is superseded by the primary completion date.
- **LeVert, February 7, 2022:** February 6 was the agreement. The [official Cleveland release](https://www.nba.com/cavaliers/releases/levert-acquisition-220207) is February 7. It specifies Utah’s **2027** second; the NBA season tracker incorrectly displays 2022 in one summary. Use the team release.
- **Brogdon, July 9, 2022:** The deal was agreed July 1 but [became official July 9](https://www.hoopsrumors.com/2022/07/pacers-to-trade-malcolm-brogdon-to-celtics.html).
- Lottery resolution scenes use the date the draft position became known, and explicitly describe the resolution rather than presenting it as a new trade. Their original obligation ID survives the rollover.

## Conditions deliberately bounded

- The 2022 Boston first in the White exchange protects Nos. 1–4; it actually conveyed at No. 25. Its unused rollover fallback is not invented. White’s 2028 swap protects Boston’s No. 1 and has a conditional Boston second-round fallback at Nos. 31–45, recorded inside that right’s conditions. [Contemporaneous top-one reporting](https://www.hoopsrumors.com/2022/02/southwest-notes-white-hernangomez-mccollum-spurs.html) is cross-checked against the [detailed trade record](https://www.salaryswish.com/trades/players/derrick-white).
- Houston’s 2021/2025 Brooklyn swap rights interact with Oklahoma City’s pre-existing rights. The contract’s unprotected Brooklyn side is recorded, the dependency is stated, and no misleading simplified exercise is simulated. Later amendments are out of scope.
- The Harden package’s 2023 second is a **composite obligation**, not automatically Houston’s: Houston at No. 31–32; otherwise least favorable HOU/DAL/MIA. The 2024 second is least favorable CLE/UTA. Neither is collapsed into an origin-specific pick before its draft.
- The Sabonis package includes Indiana’s 2023 second at Nos. 31–55. San Antonio had a prior claim to positions 56–60. [The published comparison](https://www.hoopsrumors.com/2023/03/2023s-most-valuable-traded-second-round-picks.html) supports this limitation; the dataset does not call the entire second unprotected.
- Cleveland’s first for LeVert is lottery protected in 2022 and 2023, then falls back to two seconds. It conveyed in 2023, so the unused fallback years are explicitly unasserted. [Deadline report](https://bleacherreport.com/articles/2953323-grading-every-deal-at-the-2022-nba-trade-deadline) establishes the protected years; [Indiana draft inventory](https://www.si.com/nba/pacers/news/what-draft-picks-the-indiana-pacers-have-in-2023-nba-draft) and official media guide establish the eventual No. 26/Ben Sheppard outcome.
- Philadelphia’s 2022/23 first is one obligation with a deferral option. Brooklyn notified the league June 1, 2022 that it was deferring. The later 2027 first protects Nos. 1–8 in 2027/28, then falls back to two seconds and cash. Exact unused fallback second years are not asserted.
- Boston’s 2023 first for Brogdon protects Nos. 1–12. The announcement reports a second-round fallback, but its unused year is not filled from memory.

## Verification performed

Executed the base curator up to the normalization/write boundary and this expansion in memory, without modifying generated data. Verified:

- 19 new event IDs; no duplicate canonical IDs.
- Every movement refers to an existing asset and every cited source ID exists.
- Every route remains chronological and contains its root.
- Full ownership ledger traversal across every story, rejecting owner changes without a recorded transfer, reuse of consumed assets, duplicate transfers and duplicate converted assets.
- Obligation IDs remain separate from actual selection IDs and player identities throughout conveyance.

The parent application still needs its standard preparation checks, history tests and visual testing after integration. No app, engine, Git, hosting or deployment files were modified by this expansion.
