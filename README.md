# Yukon

A little pixel town that grows from workouts, Strava, Bible reading, books and films.

Twice a day (about 6:15 am and 6:15 pm Whitehorse time) `.github/workflows/update.yml` runs
`scripts/update.mjs`, which saves fresh copies of everything into `data/`, commits them, and
republishes the site on GitHub Pages. The **Run workflow** button on the Actions tab does an update right away.

| Source | Saved as | Needs |
| --- | --- | --- |
| Fit(ter) by 30 sheet | `data/workouts.xlsx` | Sheet shared as "Anyone with the link can view" |
| Bible sheet | `data/bible.xlsx` | Same |
| Whitehorse Book Tracker | `data/books.xlsx` | Same |
| Strava | `data/strava.json` | Repository secrets `STRAVA_CLIENT_ID`, `STRAVA_CLIENT_SECRET`, and `STRAVA_CODE` for the first run (the token is then kept, encrypted, in `state/`) |
| Letterboxd (`oilgasms`) | `data/films.js` | Nothing: the public feed. New films are added; old ones are kept. |

If one source fails, the others still update and the town keeps the last good copy.

`site.js` stands in for the claude.ai connectors: it answers the town's Google Drive and Strava
requests from `data/`, and hides the buttons for changing sources.
