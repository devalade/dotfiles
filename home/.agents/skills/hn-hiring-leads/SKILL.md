---
name: hn-hiring-leads
description: Find contract/freelance/consulting leads from HN's monthly "Ask HN: Who is hiring?" thread.
---

# HN Hiring Leads

Source current Hacker News hiring posts only after understanding the candidate profiles. Optimize for specific, evidence-backed opportunities—not a long list of nominal job matches.

## Required sequence

1. **Read profiles first.** Use `readfile` on the user-provided profile file(s) before searching or fetching anything. Extract, per profile:
   - offered role, services, and strongest relevant experience;
   - preferred engagement (contract, freelance, fractional, etc.);
   - availability, geography/time-zone, rate or budget constraints, and exclusions.

   Ask for the path only if it is not available in the workspace or the request. Do not infer qualifications that are not in a profile.

2. **Find the current HN thread.** Use `websearch` for the current month's exact title, scoped to `news.ycombinator.com/item`, for example `site:news.ycombinator.com/item "Ask HN: Who is hiring?" "<current month> <current year>"`. Select the newest result whose title is the monthly hiring thread. If the current thread has not appeared, use the newest prior monthly thread and say so.

3. **Fetch the selected thread in Markdown.** Call `webfetch` with the numeric HN item URL and `format: "markdown"`.

   ```text
   webfetch({ url: "https://news.ycombinator.com/item?id=<thread-id>", format: "markdown" })
   ```

   Do not fetch a guessed HN slug or a truncated `.../wh...` URL: HN discussion pages require their numeric `item?id=` URL. On a 404, return to the search result, verify the item URL, and retry once with that URL. If the fetch is truncated, use the full-output path supplied by the tool before deciding that no leads exist.

## Select leads

Review every available post against the profiles. Prioritize explicit evidence of both need and an engagement that can be won by a contractor or consultant.

High-value signals include:

- an urgent or costly engineering problem: "broken build", failing/flaky CI, release-blocking issues, build or test failures;
- manual or fragile operations: "manual deployment", hand-run releases, no CI/CD, error-prone deploys, unreliable release process;
- a non-employee engagement: contractor, consultant, freelance, fractional, part-time, project-based, or staff augmentation;
- a direct contact route or an identifiable decision maker.

Treat signals as leads to investigate, not proof of fit. Reject posts that require a permanent full-time employee only, conflict with a profile's constraints, lack a plausible services match, or contain no actionable contact path. Never invent a company, budget, urgency, or contact detail.

## Score consistently

Score each viable lead for its best-matching profile out of 100:

| Criterion | Points | Evidence required |
| --- | ---: | --- |
| Service and technical match | 0–30 | The post's work maps to a stated profile capability. |
| Contractor-shaped engagement | 0–25 | The post explicitly welcomes contract, consulting, freelance, fractional, or project work. |
| Urgent, relevant pain | 0–20 | A stated build, release, deployment, operations, or comparable pain point. |
| Practical constraints | 0–15 | Location, time zone, availability, rate/budget, and exclusions are compatible. |
| Reachability and buyer proximity | 0–10 | Direct contact or a likely decision-maker is present. |

Shortlist only leads scoring **70+** with no hard conflict. A lower score may be reported as a near miss, but do not save it as a strong lead unless the user requests a broader list. State the arithmetic and any uncertainty.

## Save the shortlist

Use the workspace's file-writing tool to persist the result. Prefer the user's existing leads store. If none is specified, create or update `hn-hiring-leads-YYYY-MM.md` beside the profile file. Before appending, read the existing shortlist and de-duplicate by HN comment URL or company + contact.

For every strong lead, save this compact record:

```markdown
## <Company or post title> — <score>/100

- **Profile:** <best-matching profile>
- **HN source:** <canonical HN comment or thread URL>
- **Contact:** <email, application link, or "not supplied">
- **Engagement:** <contract/consulting signal>
- **Why it fits:** <one-sentence match>
- **Evidence:** "<short post excerpt>"
- **Score:** service <n>/30; engagement <n>/25; pain <n>/20; constraints <n>/15; reachability <n>/10
- **Next step:** <specific outreach or verification action>
```

Finish with the saved-file path, the number of strong leads, and a concise ranked summary. Keep source URLs and short evidence excerpts so the user can verify every score.
