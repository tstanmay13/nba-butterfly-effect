# Modern expansion, wave 2

Reviewed 2026-09-08. Authoring file: `research/expansions/modern_wave2.py`.

This adds **26 canonical events, 117 assets, 42 sources and five stories**. It is executed by the existing curator after the base archive. It makes no network requests and does not change the renderer or generated data itself.

## Published routes

| Story ID | Root | Bounded coverage |
| --- | --- | --- |
| `chris-paul` | Completed 2011 Clippers transaction | Paul's 2011, 2017, 2019, 2020 and two 2023 trades; Rivers, Topić and Peavy selections; existing Poole–McCollum, Trae and Davis packages through February 2026. |
| `lob-city` | 2017 Clippers–Houston trade | Same-day Hilliard/Liggins prerequisites, Houston first → Gallinari package → Spellman → Russell–Wiggins package; Beverley → Memphis → Minnesota → Gobert return, ending with the 2023 draft. |
| `westbrook` | 2019 Paul–Westbrook exchange | Westbrook to Washington in 2020; Paul-return and Houston-first branches through selected 2024–26 events. Westbrook's later Lakers arrival is outside this route. |
| `durant` | 2019 double sign-and-trade | Russell/Wiggins/Kuminga branch; completed 2023 four-team Phoenix transaction; Russell's 2023 Lakers package, existing Butler 2025 deal and Johnson–Porter 2025 exchange. Durant's own Houston move is excluded. |
| `gobert` | Completed July 2022 exchange | Beverley's 2021 route into Minnesota; Beverley and Beasley/Vanderbilt exits; Minnesota's 2023 first → Keyonte George. Stops at the 2023 draft, before later pick pooling and amendments. |

Each main route passes the repository's **actual `ownership()` implementation**. Several canonical events appear in more than one story; they are not duplicated in the archive.

## Research and reuse

Each trade was checked against publicly accessible official announcements, official draft results or team media guides, with contemporaneous final reporting for protection schedules and full multiteam allocations. Sources are linked on the events. Some NBA pages expose their announcement in search while returning little body text when opened; those are cross-checked with an accessible completed-trade report. No API or bulk-reuse license is assumed.

No Basketball Reference or Pro Sports Transactions pages were scraped, downloaded or used as a bulk dataset. Search sometimes surfaced those sites incidentally; the prepared facts rely on the attached official and reporting references. No access controls or paywalls were bypassed. No portraits, marks or article prose were copied. This is independently written factual curation, not a licensed redistribution of any source database.

## Material findings

- **Paul 2011:** December 14 is the completed date. New Orleans sends Paul **and two 2015 seconds**. The incoming 2012 obligation compares **the Clippers and Minnesota**, not simply a standalone Minnesota pick. It conveys as Minnesota's No. 10 for Rivers. The rejected Lakers proposal produces no transaction. [New Orleans announcement](https://www.nba.com/pelicans/news/hornets_clippers_trade_2011_12_14.html), [package cross-check](https://www.hoopsrumors.com/2014/10/notable-recent-preseason.html).
- **Paul 2017:** Hilliard and Liggins are acquired in independent cash trades before being included in Houston's seven-player return. Same-day order reflects these ownership prerequisites. The Houston first is top-three protected and goes to Atlanta in the completed July 6 three-team Gallinari deal. Atlanta selects Spellman at No. 30. [Completed 2017 trades](https://www.hoopsrumors.com/2017/06/2017-nba-offseason-trades.html), [protection and cash](https://www.hoopsrumors.com/2017/10/2017-offseason-in-review-los-angeles-clippers.html).
- **Durant 2019:** July 7 is the completed double sign-and-trade date. Napier, Graham and Golden State's protected first are included. That first's fallback is a 2025 Golden State second, not another future first. [Completed transaction and fallback](https://www.hoopsrumors.com/2019/07/nets-warriors-complete-durant-russell-sign-and-trade.html).
- **Paul–Westbrook 2019:** July 16 is completion. Both outright Houston firsts protect the top four; the 2021 swap protects the top four and the **2025 swap protects the top ten**, correcting preliminary top-20 reporting. The $1 million is conditional on the 2026 first not conveying, not cash already transferred. [Official announcement](https://www.nba.com/news/oklahoma-city-acquires-chris-paul-houston-rockets-official-release), [final conditions](https://www.hoopsrumors.com/2019/11/2019-offseason-in-review-houston-rockets.html).
- **Russell–Wiggins 2020:** Spellman and Evans move with Russell. Wiggins, Minnesota's protected first and Minnesota's second belong to that entire package. Minnesota's top-three-protected first becomes No. 7 for Kuminga. [Package and protections](https://abcnews.com/Sports/warriors-trade-dangelo-russell-wolves-andrew-wiggins/story?id=68810477).
- **Paul 2020:** Phoenix sends Rubio, Oubre, Jerome, Lecque and a first protected 12/10/8 in 2022/23/24, then unprotected in 2025. Nader accompanies Paul. [Final package](https://www.hoopsrumors.com/2020/11/suns-thunder-finalizing-chris-paul-trade.html).
- **Wall–Westbrook 2020:** Washington's first protects 14/12/10/8 in 2023/24/25/26; if no first conveys, the fallback is Washington's 2026 and 2027 seconds. Its onward trades are not silently inferred. [Full schedule](https://wtop.com/washington-wizards/2023/01/how-wizards-results-this-season-could-affect-their-draft-pick/).
- **Gobert 2022:** July 6 is completion. Kessler moves as draft rights, not a signed player. Four outright firsts and one swap remain distinct. The 2029 first protects the top five. [Official package](https://www.nba.com/news/jazz-wolves-rudy-gobert-trade), [protection cross-check](https://api-hub.nba.com/news/5-takeaways-on-rudy-gobert-trade-to-timberwolves).
- **Durant 2023:** The completed transaction has **four teams**. Crowder moves directly PHX → MIL; Nwora, Hill and Ibaka move MIL → IND. Of five Milwaukee-controlled seconds, Brooklyn receives two and Indiana receives three. Indiana's 2023 entitlement is a comparison of MIL and the less favorable CLE/GSW second; it is not three selections. Indiana sends Vaulet's rights to Brooklyn; Brooklyn sends cash to Indiana. [Final complete allocation](https://www.hoopsrumors.com/2023/02/kevin-durant-trade-officially-completed-as-four-team-deal.html).
- **Russell 2023:** The final eight-player, three-team transaction includes all three Minnesota-bound seconds. The 2024 second is the **less favorable of WAS/MEM**, coming from Los Angeles; 2025/26 seconds come from Utah. The Lakers' top-four-protected 2027 first falls back to their 2027 second. [Final package](https://www.hoopsrumors.com/2023/02/lakers-jazz-wolves-finalizing-three-way-trade.html), [fallback](https://www.hoopsrumors.com/2023/02/lakers-jazz-wolves-trade-notes-2027-pick-westbrook-conley-tpes.html).
- **Beal 2023:** The final June 24 trade includes Indiana. Five Phoenix seconds go to Washington; the sixth (2028) goes directly to Indiana. Washington adds its 2029 second and Walker's rights to Indiana, receiving Coulibaly's rights. Phoenix's 2028 swap is subordinate to Brooklyn's existing right. Washington must retain an eligible own pick to use its 2024/26 swaps. Final cash reporting is $4.6 million; the earlier estimate was lower. [Indiana announcement](https://www.nba.com/pacers/news/pacers-complete-three-team-trade-with-phoenix-and-washington), [final ledger](https://www.hoopsrumors.com/2023/06/2023-nba-offseason-trades.html).
- **Paul 2023:** July 6 is completion; cash is part of the Poole/Baldwin/Rollins return. The archive reuses `gsw30` for the same first later sent WAS → DAL, and `phx26-second` for the earlier PHX → WAS second later sent to Dallas. [Final announcement reporting](https://www.hoopsrumors.com/2023/07/warriors-wizards-officially-complete-chris-paul-jordan-poole-trade.html).
- **Johnson 2025:** July 8 is used, supported by Brooklyn's announcement and completed-trade reporting. Denver's publication timestamp is July 8 but its body has a conflicting July 6 dateline; that discrepancy is disclosed. The Denver 2032 first is unprotected. [Completion and terms](https://www.hoopsrumors.com/2025/06/nuggets-trading-michael-porter-first-round-pick-to-nets-for-cam-johnson.html).

## Bounded uncertainties

The 2011 Memphis second's exact cash-conversion trigger/date, unused 2018 Houston first fallback, unused 2024 Houston first fallback and 2029 Minnesota second fallback year are not invented. The source-supported headline conditions are retained, with unverified details explicitly marked. Main paths follow actual verified selections where available. Untraced historical obligations are not represented as today's holdings.

The 2025 Durant seven-team transaction is excluded. No partial two-team version appears. Later 2025–26 Utah pick pooling, swaps and Gobert-return trades are excluded. The 2019 Golden State first's fallback, Phoenix's 2022 first, and other untraced outcomes remain archive boundaries. Free-agent departures do not generate trade edges.

## Validation

Executed the curator prefix and all expansion files in memory, then piped the prospective archive directly to a TypeScript process importing `lib/history.ts`. No generated repository files were written. All **25 prospective stories / 132 prospective events** passed the existing `ownership()` function, event asset/source existence and participating-franchise checks.

The five new story roots also pass `initialState` → `stateQuery` → `parseState` round trips and cutoff-date checks. Protection boundary checks cover Minnesota 2021 at Nos. 3 and 7 and Washington 2026 at Nos. 8 and 9. Final package checks confirm 20 movements in Durant 2023 and 19 in Beal 2023, including all auxiliary teams and cash.

Cross-expansion audit found zero duplicate event IDs, normalized duplicate player identities, duplicate source URLs or overwrites of prior assets/sources. This wave adds 26 events, 117 assets and 42 source records. Existing source and asset IDs are reused where appropriate, including `gsw26-second`, `gsw30`, `phx26-second`, `russell`, `wiggins`, `poole`, `alexander-walker` and `peavy`.

Global identity connections can still include explicitly untraced intervals. For example, the Golden State 2026 second goes GSW → ATL in 2019 and appears NYK → CHA in 2024; those intervening transfers are outside the archive. Similarly, Damian Jones's ATL → LAL and Russell's later LAL → DAL histories are not implied as direct trades. The web must retain its existing gap treatment. Neither interval is placed into a story that would fail strict ownership.
