# All BAA/NBA trades: coverage, licensing, and cost feasibility

Researched 8 September 2026. Scope: BAA/NBA transactions from 1946 through the archive's chosen cutoff; ABA is an optional, separately scoped extension. USD throughout. Research only: no purchases, vendor contact, bulk collection, access-control bypass, or website changes.

## Decision

**There is no defensible public price for a complete, reusable, verified all-history NBA trade graph.** The providers examined do not publicly establish the combination of 1946 coverage, every complete trade package, draft protections and swaps, later amendments and conveyance, and a license suitable for this public website. That is a finding about available documentation, not proof that no vendor could supply a custom dataset.

Pro Sports Transactions is the strongest historical research/licensing lead found. Sportradar offers useful modern transfer and draft-trade feeds; SportsDataIO documents modern player transactions. None eliminates the need to normalize identities and verify pick obligations. Sports Reference publishes a **$5,000 minimum for considering custom data requests**, which is neither a complete-archive quote nor a promise of suitable rights. [Sports Reference data policy](https://www.sports-reference.com/data_use.html)

**Budget decision: zero new purchases.** Continue free, manually verified expansion using the existing website and hosting. The vendor information below is background research only; no paid acquisition will be pursued.

## What the providers actually establish

### Sports Reference / Basketball-Reference / Stathead

- **Published price:** Stathead Basketball costs **$9/month or $80/year**. This buys research access, not a redistributable historical database. [Subscription plans](https://faq.sports-reference.com/portal/en/kb/articles/subscription-plans)
- **Reuse:** Sports Reference's policy requires permission for websites/tools based on scraped data, restricts competing or substitutable databases, and sets the $5,000 custom-request minimum. Deliverability and the exact rights would need confirmation. [Data use](https://www.sports-reference.com/data_use.html)
- **Access:** It does not offer a general data API; its explanation cites underlying supplier licenses and its business model. An accessible web table does not establish permission for a bulk website import. [Bot traffic and data access](https://www.sports-reference.com/bot-traffic.html)
- **Fit:** Useful as a research reference. The reviewed product/policy pages do not establish an off-the-shelf, 1946-to-present trade-package export with structured pick conditions and their resolution.

### Pro Sports Transactions (PST)

- **Historical depth:** The archive contains BAA-era examples, including a February 1948 Celtics–Bullets exchange. This demonstrates early coverage, not exhaustive completeness. [PST's Connie Simmons history](https://www.prosportstransactions.com/basketball/Search/SearchResults.php?BeginDate=&EndDate=&Player=Connie+Simmons&PlayerMovementChkBx=yes&Team=&submit=Search)
- **Package detail:** Its draft-history pages contain pick-trade chains, protections, swaps, and eventual selected players. This is substantially closer to the website's requirements than a roster-change feed. [2016 draft-pick trade history](https://www.prosportstransactions.com/basketball/DraftTrades/Years/2016.htm)
- **Completeness:** PST expressly acknowledges that historical transactions can be missing. Its advertised basketball entry count includes many transaction types; it is **not a count of distinct NBA trades**. Search results can also represent opposite sides of one trade as separate rows. [Archive description](https://www.prosportstransactions.com/), [example rows](https://www.prosportstransactions.com/basketball/Search/SearchResults.php?BeginDate=&EndDate=&Player=Connie+Simmons&PlayerMovementChkBx=yes&Team=&submit=Search)
- **Access and reuse:** Public pages are indexed, but direct requests returned HTTP 403 in this research session. The site displays an all-rights-reserved copyright notice. I found no published API, bulk-export license, or licensing price; that leaves negotiated access uncertain, not necessarily unavailable. [Future draft-pick index](https://www.prosportstransactions.com/basketball/DraftTrades/Future/index.htm)
- **Fit:** First candidate for a requested sample and explicit public-display/export agreement, if outreach is later authorized. No contact has been made.

### Sportradar

- **History:** The NBA-specific historical guide says data goes back to the **2013 season**, with official NBA data from 2017. It lists transfer and draft feeds among historical interfaces, but does not prove every endpoint/field has identical coverage. [NBA historical data](https://developer.sportradar.com/basketball/docs/nba-ig-historical-data)
- **Player movement:** Daily Transfers documents individual players moving between teams, with effective dates, types, and descriptions. Those records alone do not identify the entire exchange package. [Daily Transfers schema](https://developer.sportradar.com/basketball/reference/nba-daily-transfers)
- **Actual draft packages:** The separate **Trades** feed documents in-draft trades with trade IDs, sending/receiving teams, and items including players, money, current picks, and future picks. Its published future-pick fields include round/year. The documented schema does not establish structured protection schedules, swap priority, amendments, or final obligation conveyance. This limitation is an inference from the schema, not a claim about undisclosed custom products. [Trades schema](https://developer.sportradar.com/basketball/reference/nba-trades)
- **Timing:** Draft feeds reflect pre-draft changes after the lottery; draft order data becomes available after NBA finalization. This is not evidence of complete all-season trade-package history. [Draft integration guide](https://developer.sportradar.com/basketball/docs/nba-ig-draft)
- **Price and rights:** Fees and licensed products/properties are specified in an executed order form. No public base price for the required NBA history license was found. Generic terms distinguish Core, Expanded, and Complete History; “Complete” means available prior data, not an assurance of NBA coverage from 1946. The NBA-specific coverage and contract scope must be reconciled before purchase. [Terms, updated 5 August 2026](https://developer.sportradar.com/sportradar-updates/page/terms-and-conditions)

### SportsDataIO

- **History:** The NBA coverage page advertises season statistics and box scores from **2008–09**, and play-by-play from 2014–15. Those dates do not establish the start of complete transaction history. [NBA coverage](https://sportsdata.io/nba-confirmed-coverage)
- **Transaction detail:** The NBA dictionary describes a player-centered transaction record: player, former/new team, type, date, and a short note. It does not document a complete-package identifier or structured pick protections, swap obligations, and conveyance. That is a schema-based limitation. [NBA data dictionary](https://sportsdata.io/developers/data-dictionary/nba)
- **Backfill:** The historical guide says availability reflects its collection history; it does not retroactively reconstruct uncollected history. Historical access must be confirmed by league and dataset. [Historical integration guide](https://sportsdata.io/help/historical-data-integration-guide)
- **Published personal prices:** Discovery Lab Fantasy or Odds each costs **$99/month or $599/year**; the combination is **$149/month or $899/year**. A free tier offers last-season data. These are personal products, not verified all-trades licenses. The free integration trial uses scrambled data. [Access methods and pricing](https://sportsdata.io/developers)
- **Public website price:** **Quote-only.** Its dedicated licensing FAQ says public-facing products require a commercial license, including otherwise personal projects. Commercial agreements permit storage and in-product display within scope; standalone feed resale is restricted. Post-termination retention and attribution are contractual. [Data rights and licensing](https://sportsdata.io/help/data-rights-and-licensing-questions)

### Other leads

Spotrac publishes transaction records with some complete modern trade and pick descriptions, so it can help cross-check modern packages. I did not verify a public bulk-data license, historical start date, or priced API establishing this project's full scope. It should not be budgeted as a turnkey historical feed on that evidence. [Spotrac NBA transactions](https://www.spotrac.com/nba/transactions), [Brooklyn's 2025 offseason records](https://www.spotrac.com/nba/transactions/_/start/2025-06-16/end/2025-08-16/team/bkn)

NBA/team announcements, official draft results, and historical team publications remain useful primary corroboration. Finding a trade announcement does not by itself resolve every undisclosed cash amount or future-pick condition. The archive should preserve unknowns instead of manufacturing complete terms.

## Current decision: expand with zero new purchases

The owner explicitly instructed **never pay for anything** on 8 September 2026. The earlier commercial-price investigation answers a feasibility question; it does not authorize a purchase. The project will not buy a dataset, subscription, archive access, API credits, imagery or hosting upgrades.

Continue the independently curated archive from accessible NBA/team announcements, official draft records, historical team publications and corroborating reporting. Basketball Reference is not an unrestricted source database or bulk API for this project. If a source blocks access, use a legitimately accessible alternative or leave that branch unpublished.

Build toward broader coverage in measured batches, using the existing project and included hosting. Keep an inventory of verified packages, source gaps, unclear conditions and research cutoff dates. A complete historical index and a graph resolving every protected pick are different scopes. Neither should be labelled exhaustive until the underlying inventory has been reconciled.

No verified count of all distinct BAA/NBA trade packages was established in this research. Provider row counts can count each player's movement separately and include non-trades. The site therefore reports its own canonical trade and draft events, not a fabricated percentage of all NBA history.

## Research limits

Provider documentation and first-party pages were checked through public web access and, where direct pages failed, publicly indexed excerpts. No paid dataset was inspected, API account created, or vendor quote requested. No purchase or vendor outreach occurred. Historical completeness remains unverified; the public archive states each story's coverage boundary.
