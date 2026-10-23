// Refreshes everything in data/ that the town reads: the three Google Sheets, Strava
// activities and the Letterboxd diary. Run by .github/workflows/update.yml twice a day.
// Each source is independent: if one fails, the others still update and the old file stays.
import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { createHash, createCipheriv, createDecipheriv, randomBytes } from 'node:crypto';

const DATA = new URL('../data/', import.meta.url);
const SHEETS = {
  'workouts.xlsx': '1ezfrNTfIvEWl_mphezu3zOHHLqCIJjRi4sE3gAHbHho',
  'bible.xlsx': '18H8UIzPnUcA-tuPPp8i17TbBM9CE_TSY3s4U0hl5XuA',
  'books.xlsx': '12y_x_81x0vXwEpqRJrU5eJaUcmWHCnVl7XMGSq_guTE',
};
const STRAVA_SINCE = '2026-06-22'; // the Monday Phase 2 began
const LETTERBOXD_USER = 'oilgasms';

let failed = 0;
async function step(name, fn) {
  try { console.log(`${name}: ${await fn()}`); }
  catch (e) { failed++; console.error(`${name}: FAILED - ${e.message}`); }
}

// Google Sheets: needs each sheet shared as "Anyone with the link can view".
async function sheets() {
  const done = [];
  for (const [out, id] of Object.entries(SHEETS)) {
    const res = await fetch(`https://docs.google.com/spreadsheets/d/${id}/export?format=xlsx`);
    const type = res.headers.get('content-type') || '';
    if (!res.ok || !/spreadsheet|octet-stream/.test(type)) throw new Error(`${out} (${res.status} ${type.split(';')[0]}) - is it shared as "Anyone with the link"?`);
    await writeFile(new URL(out, DATA), Buffer.from(await res.arrayBuffer()));
    done.push(out);
  }
  return done.join(', ');
}

// Strava: an API app's client ID and secret (repository secrets). The first run swaps the
// one-time STRAVA_CODE for a refresh token; after that the token lives in state/strava-token,
// encrypted with the client secret, and is replaced whenever Strava issues a new one.
const TOKEN_FILE = new URL('../state/strava-token', import.meta.url);
function tokenKey(secret) { return createHash('sha256').update('yukon-strava:' + secret).digest(); }
async function readToken(secret) {
  try {
    const [iv, tag, data] = (await readFile(TOKEN_FILE, 'utf8')).trim().split('.').map((x) => Buffer.from(x, 'base64'));
    const d = createDecipheriv('aes-256-gcm', tokenKey(secret), iv);
    d.setAuthTag(tag);
    return Buffer.concat([d.update(data), d.final()]).toString('utf8');
  } catch { return ''; }
}
async function saveToken(secret, token) {
  const iv = randomBytes(12), c = createCipheriv('aes-256-gcm', tokenKey(secret), iv);
  const data = Buffer.concat([c.update(token, 'utf8'), c.final()]);
  await mkdir(new URL('../state/', import.meta.url), { recursive: true });
  await writeFile(TOKEN_FILE, [iv, c.getAuthTag(), data].map((b) => b.toString('base64')).join('.') + '\n');
}
async function strava() {
  const { STRAVA_CLIENT_ID: id, STRAVA_CLIENT_SECRET: secret, STRAVA_CODE: code } = process.env;
  if (!id || !secret) return 'skipped (no Strava secrets set)';
  const refresh = process.env.STRAVA_REFRESH_TOKEN || await readToken(secret);
  if (!refresh && !code) return 'skipped (add the STRAVA_CODE secret to connect)';
  const grant = refresh ? { grant_type: 'refresh_token', refresh_token: refresh } : { grant_type: 'authorization_code', code: code.replace(/^.*[?&]code=([^&]+).*$/, '$1') };
  const tok = await fetch('https://www.strava.com/oauth/token', {
    method: 'POST', headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ client_id: id, client_secret: secret, ...grant }),
  }).then((r) => r.json());
  if (!tok.access_token) throw new Error((refresh ? 'token refresh' : 'connecting with STRAVA_CODE (codes expire fast: authorize again, update the secret, rerun)') + ' refused: ' + JSON.stringify(tok).slice(0, 200));
  if (tok.refresh_token && tok.refresh_token !== refresh) await saveToken(secret, tok.refresh_token);
  const after = Math.floor(new Date(STRAVA_SINCE + 'T00:00:00-07:00').getTime() / 1000);
  let acts = [];
  for (let page = 1; page <= 30; page++) {
    const res = await fetch(`https://www.strava.com/api/v3/athlete/activities?after=${after}&per_page=100&page=${page}`, { headers: { authorization: 'Bearer ' + tok.access_token } });
    if (!res.ok) throw new Error(`activities page ${page}: ${res.status}`);
    const batch = await res.json();
    acts = acts.concat(batch);
    if (batch.length < 100) break;
  }
  // Keep only what the town uses (no maps or GPS).
  const slim = acts
    .map((a) => ({ name: a.name, sport_type: a.sport_type || a.type, start_date_local: a.start_date_local, distance: a.distance, total_elevation_gain: a.total_elevation_gain, moving_time: a.moving_time, commute: !!a.commute }))
    .sort((a, b) => (a.start_date_local < b.start_date_local ? -1 : 1));
  await writeFile(new URL('strava.json', DATA), JSON.stringify(slim));
  return `${slim.length} activities`;
}

// Letterboxd: the public feed shows the last 50 diary entries, so new ones are added to
// films.js and old ones are kept.
async function letterboxd() {
  const xml = await fetch(`https://letterboxd.com/${LETTERBOXD_USER}/rss/`, { headers: { 'user-agent': 'Mozilla/5.0 (yukon-town updater)' } }).then((r) => {
    if (!r.ok) throw new Error('feed ' + r.status);
    return r.text();
  });
  const tag = (item, name) => {
    const m = item.match(new RegExp(`<letterboxd:${name}>([^<]*)</letterboxd:${name}>`));
    return m ? m[1].replace(/&amp;/g, '&').replace(/&#039;|&apos;/g, "'").replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>') : '';
  };
  const fresh = [];
  for (const item of xml.split('<item>').slice(1)) {
    const title = tag(item, 'filmTitle'), date = tag(item, 'watchedDate');
    if (!title || !date) continue; // lists and other non-diary posts
    const rating = parseFloat(tag(item, 'memberRating'));
    fresh.push([title, +tag(item, 'filmYear') || null, date, isNaN(rating) ? null : rating, tag(item, 'rewatch') === 'Yes' ? 1 : 0]);
  }
  const path = new URL('films.js', DATA);
  let films = [];
  try { films = JSON.parse((await readFile(path, 'utf8')).replace(/^[^[]*/, '').replace(/;\s*$/, '')); } catch {}
  const key = (f) => f[0].toLowerCase() + '|' + f[2];
  const known = new Map(films.map((f) => [key(f), f]));
  let added = 0;
  for (const f of fresh) { if (!known.has(key(f))) added++; known.set(key(f), f); } // a changed rating replaces the old one
  films = [...known.values()].sort((a, b) => (a[2] < b[2] ? -1 : 1));
  await writeFile(path, 'window.SITE_FILMS = ' + JSON.stringify(films) + ';\n');
  return `${films.length} films (${added} new)`;
}

await step('Google Sheets', sheets);
await step('Strava', strava);
await step('Letterboxd', letterboxd);
if (failed === 3) process.exit(1);
