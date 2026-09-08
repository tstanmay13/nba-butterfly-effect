# Modern expansion, wave 3

Reviewed 2026-09-08. Deliverable: `/tmp/butterfly-modern-wave3.py`.

Execute after the existing expansion files and before `curate.py` normalization. This script performs no network access or file writes. The only authored files for this assignment are the two requested `/tmp` deliverables. No checkout, Git, Site, hosting, credential, billing or subscription changes were made. Research used freely accessible announcements, indexed reporting and official media guides. No Basketball Reference or Pro Sports Transactions scraping, bulk extraction, access-control bypass or purchases were performed. Editorial text is original; citations support facts rather than copied article prose or licensed images.

## Scope and counts

Adds **21 canonical events: 18 trades and 3 draft/conveyance events**, **69 assets**, **41 source records**, and **5 Modern stories**. Against the existing 132-event/25-story archive alone, the result is **153 events and 30 stories**. Another agent's classic expansion is not included in these totals.

| Story ID | Root | Route events | Last included date | Bounded coverage |
| --- | --- | ---: | --- | --- |
| `harden-clippers` | `harden-clippers` | 5 | 2026-02-05 | Philadelphia 2022 arrival; final 2023 three-team Clippers exchange; the composite first's transfer to Washington and Dallas; Harden's separate Cleveland endpoint. |
| `mitchell` | `mitchell-cleveland` | 7 | 2025-06-29 | Mitchell's Denver–Utah draft rights; Markkanen's Chicago/Cleveland route; existing 2022 Cavs–Jazz package; Agbaji and Sexton follow-up packages. |
| `fox-lavine` | `fox-san-antonio` | 8 | 2025-07-13 | LaVine's Chicago arrival, Charlotte/Minnesota pick histories, complete 2025 three-team exchange, Raynaud conveyance, and two Valančiūnas packages. |
| `siakam` | `siakam-indiana` | 10 | 2026-02-05 | Separate Lewis precursor, Siakam return, Toronto–Utah reuse, Walter/Collier conveyances, Ingram, then selected Olynyk/McCollum/Branham continuations. |
| `butler-journey` | `butler-minnesota` | 7 | 2025-06-29 | Butler's complete 2017/2018/2019 packages; LaVine and Markkanen branches reaching the Fox and Mitchell trades. Butler's own path stops in Miami in 2019. |

## Canonical identity joins

- `ad26-first` is reused for Oklahoma City → Philadelphia in Harden 2023, Philadelphia → Washington in Jackson 2025, and the existing Washington → Dallas Davis 2026 exchange. Its existing conditions are refined to include Houston's top-four eligibility protection. It remains a composite right, with no predicted or pre-revealed draft selection.
- `cha22-reddish` connects existing Reddish 2022 → Murray 2022 → Fox 2025. The original 2022–25 protection schedule and second-round fallback remain the same obligation.
- `min31` connects Dillingham 2024 → Fox 2025; `mia23` connects Butler 2019 → existing George 2019; `sac29-cj-second` connects Valančiūnas February 2025 → existing McCollum July 2025.
- `w3-siakam24-composite` moves Indiana → Toronto → Utah, then is satisfied by Oklahoma City's No. 29, used on Collier. `w3-ind24-siakam` is separately satisfied by Indiana's No. 19, used on Walter.
- Brown, Olynyk and `w3-ind26-siakam` reconverge as parts of the **full** Ingram package. No player-alone causal return is drawn.
- Original `w2-gsw27-cp-second` / `w2-phx2027-beal-second` obligations are **not** incorrectly merged with the later Golden State/Phoenix most-favorable composite. The latter is one distinct contractual entitlement. Likewise for the Phoenix/Portland 2030 second.

## Material research decisions

1. **Harden 2023 is November 1 and three teams.** The [Clippers announcement](https://www.nba.com/clippers/news/clippers-acquire-10-time-nba-all-star-james-harden-and-p-j-tucker-in-three-team-deal) and [completed-trade report](https://www.hoopsrumors.com/2023/10/sixers-trading-james-harden-to-clippers.html) establish the final structure. Includes seven players, Philadelphia's two outright first-round entitlements, separate Philadelphia and Oklahoma City swaps, both seconds, and both cash payments. The 2024 second has an unusual most-favorable/second-most-favorable rule, recorded explicitly. The report's URL retains `/2023/10/` despite its November 1 completion update.
2. **Jackson 2025 is the final Butler-plus-four-seconds exchange.** The [Wizards release](https://www.nba.com/wizards/news/washington-acquires-first-round-pick-from-philadelphia) supplies the exact 2027 Golden State/Phoenix, 2028 Golden State, 2030 Phoenix/Portland and 2030 Washington terms. Early cash-only reports are not used.
3. **Siakam 2024 follows a separate Lewis acquisition.** The [Lewis report](https://www.hoopsrumors.com/2024/01/pelicans-trade-kira-lewis-jr-to-pacers.html) establishes New Orleans → Indiana; the [Siakam completion](https://www.hoopsrumors.com/2024/01/raptors-trade-pascal-siakam-to-pacers-waive-christian-koloko.html) establishes Indiana → Toronto. They share January 17, but Lewis's precursor is ordered first. The New Orleans/Chicago second stays in Indiana. [Local reporting](https://www.si.com/nba/pacers/news/sources-indiana-pacers-three-draft-picks-traded-to-toronto-raptors-are-protected) verifies the 2026 first's top-four protection through 2027 and 2027/2028 second-round fallback years. Fallback original franchises are not asserted.
4. **Sexton 2025 is June 29 locally.** [Charlotte's release](https://www.nba.com/hornets/news/charlotte-hornets-acquire-collin-sexton-from-utah) and [completed-trade report](https://www.hoopsrumors.com/2025/06/jazz-to-trade-collin-sexton-to-hornets-for-jusuf-nurkic.html) agree on June 29. Some NBA summary tables say June 30. The accompanying 2030 second is the **most favorable of Utah and the Clippers**, not an outright Utah second.
5. **Fox 2025 retains all three teams and all draft consideration.** The [final report](https://www.hoopsrumors.com/2025/02/spurs-finalizing-trade-for-kings-deaaron-fox-lavine-heading-to-sacramento.html) distinguishes the returned Chicago conditional first, returned Sacramento 2028 second, Charlotte conditional first, San Antonio 2027 first, Minnesota 2031 first, Chicago 2025 second and protected Denver 2028 second. Chicago's reacquired conditional claim is resolved as extinguished; it is not displayed as an extra outstanding pick. February 3 is completion, following February 2 reporting.
6. **Valančiūnas dates follow completion.** Sacramento's [media guide](https://cdn.nba.com/teams/uploads/sites/1610612758/2025/10/2025-26-Sacramento-Kings-Media-Guide-copy.pdf) supports February 5. Denver's subsequent deal is July 13 in the [official offseason tracker](https://cdn-uat.nba.com/news/2025-offseason-trade-tracker), rather than the July 1 agreement date. The Denver second from Fox is reused with Cissoko and Sacramento's 2029 second in the Washington package.
7. **Draft outcomes have origin support.** [2024 order](https://www.hoopsrumors.com/2024/05/full-2024-nba-draft-order.html) independently supports Indiana No. 19 and Oklahoma City No. 29. [NBA Communications' 2025 order](https://pr.nba.com/2025-nba-draft-lottery-results/) supports Sacramento No. 42 originating with Chicago via San Antonio. The second round was June 26; a Kings game-notes shorthand uses June 25 for both rounds, which is not used here.
8. **Butler 2019 uses the final four-team deal.** [Completed-trade reporting](https://www.hoopsrumors.com/2019/07/heat-acquire-jimmy-butler-in-sign-and-trade.html) and the already-registered offseason ledger support the four-team structure. Lessort's draft rights go Philadelphia → Clippers. No abandoned Dallas proposal is published as a transaction.

## Explicit limits

This is a historical archive with per-route boundaries, not a current roster or complete pick ledger. Later picks, subordinate swaps, waivers, free-agent moves and unresolved fallback origins are not silently invented. The Indiana first's later transfers and actual 2026 fulfillment are untraced. The original Portland first protection is recorded through 2028; its later fulfillment is not narrated here. No championship or individual award is claimed to have been caused by these transactions.

The global web will legitimately have untraced ownership gaps for some shared player identities, including Šarić between Minnesota and Denver, Covington between Minnesota and the Clippers, Richardson between Philadelphia and Miami, and Tucker between the Clippers and Utah. The existing `linksBetween` mismatch treatment must remain. These gaps are absent from the strict narrated routes: for example, Butler's 2025 Warriors event is not appended to the 2017–2019 Butler route because Richardson's intervening return to Miami is untraced.

## Validation performed without checkout writes

- Executed the base authoring helper section and all existing expansions in memory, then the temp expansion. No `curate.py` output-writing block was executed.
- Ran the real `lib/history.ts` `ownership` routine on all 30 stories: **passed**.
- Exercised **2,011 event/node URL round-trips**, plus timeline future filtering: **passed**.
- Verified every event's asset/source IDs, participating franchises, movement form, effective date and verification status: **passed**.
- Checked duplicate player names, source URLs and event IDs: **none**.
- Verified top-three Indiana 2024, top-four Indiana 2027 and 31–33 Denver 2028 protection boundaries with the actual `isProtected` function: **passed**.
- Generated the global links in memory successfully: **189 links** before the independent classic expansion.
- Browser visual QA, combined classic integration and deployment remain the parent's work. This subtask did not test the deployed UI or claim to deploy anything.
