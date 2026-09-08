# Add and verify a story

1. Choose a bounded question and a stopping date. Decide which specific asset branches will be followed; do not start with an ambition to reconstruct every consequence.
2. Check source accessibility and reuse conditions. Find completed primary announcements and independent checks for pick details. If access is blocked, use another appropriate source; never bypass it.
3. Add stable source records in `research/curate.py`: descriptive title, original URL, publisher, primary/reporting type and review date. Read the source; a plausible-looking URL is not verification.
4. Reuse existing franchises, people and transactions. Add a franchise alias only with explicit effective dates. A pick’s `origin` is its original franchise, not the team currently sending it. Use `candidates` for composite rights, and explicit undisclosed terms where needed.
5. Add the entire transaction with effective local date, same-day order, participating teams, all net movements, sources, verification/review status and explanatory notes. Keep reported-but-uncompleted deals outside published stories.
6. Preserve difficult mechanics. Set movement `form: rights` at a draft-rights exchange. Give obligations and actual selections different IDs. Convert obligation → actual pick → draft rights. Record swap allocations with both outgoing selections, then resolve the separate swap right. A returned own-pick claim is extinguished, not selected.
7. Do not encode a package as individual asset-to-asset causal edges. Traversal follows identical assets and explicit identity conversions through transaction hubs. Other assets added in later deals remain visible in that later package.
8. Add a story record with title, original short editorial writing, root, focus, explicit event IDs, category, color, coverage and takeaway. The root may have an earlier documented origin scene. Use only appropriately licensed portraits and add complete credits.
9. Run `npm run prepare-data`, `npm test`, `npm run check`, and `npm run build`. Add a meaningful regression for any newly introduced mechanic. Inspect every prefix for ownership and chronology; do not silence a validation error by changing a known owner.
10. Check the actual browser: switch perspectives, inspect full terms, trace both directions, use the timeline, restore an exact URL, use browser back, and inspect mobile layout. Verify that future events and their selections stay hidden before their date. Check sources, photo loading and errors.
11. Review each branch endpoint. A story cutoff is not proof an asset remained with its last known team. Update coverage language and the research review date before publishing.

The output is generated locally. Never put third-party scraping in the visitor experience. Shared records must be updated once in the canonical authoring source, then regenerated for every affected story.
