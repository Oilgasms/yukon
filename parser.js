// Turns the rows of "Fit(ter) by 30" into a list of town-building events.
// Works on plain arrays of cell strings so it can run anywhere.
(function (root) {
  var DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  var GROUPS = [
    ['chest', /chest|\bpush\b|\btris\b|incline|bench/],
    ['back', /\bback\b|\bpull\b|\brows\b/],
    ['legs', /\blegs?\b|lower|quad|squat/],
    ['shoulders', /\bshou\w*|\barms\b|biceps|curls|show muscles/],
    ['post', /post[\s.\-/]*chain|posterior|hamstring/],
    ['core', /\bcore\b|\babs?\b/]
  ];
  var FULL = /full ?body|heavy|upper|volume|power|hiit|compound|workout/;

  var CARDIO = [
    ['run', /\brun\b|running|\bjog|sprint|\bloop\b|flush/],
    ['commute', /commute/],
    ['xcski', /cross.?country|\bxc\b|nordic|skate ski|classic ski/],
    ['swim', /\bswim/],
    ['mtb', /mountain bik|\bmtb\b|singletrack/],
    ['snowboard', /snowboard|\bboarding\b|\bski(ing|ed)?\b|\bsima\b|\bshred/],
    ['bike', /bike|biking|cycl|\bride\b|\bmtb\b|hotlap/],
    ['row', /rowing|paddle/],
    ['hike', /\bhik/],
    ['stairs', /stairs/],
    ['walk', /\bwalk/]
  ];

  var SPORTS = [
    ['Basketball', /basketball|bball/],
    ['Hockey', /hockey/],
    ['Futsal', /futsal|soccer/],
    ['Climbing', /climb/],
    ['Spikeball', /spikeball/],
    ['Disc golf', /disc golf/],
    ['Dance', /dance/],
    ['Table tennis', /table tennis|ping ?pong/],
    ['Tennis', /(?<!table )tennis/],
    ['Pickleball', /pickle ?ball/],
    ['Badminton', /badminton/],
    ['Squash', /\bsquash\b/],
    ['Volleyball', /volleyball|\bvball\b/],
    ['Golf', /(?<!disc )\bgolf\b/],
    ['Ultimate', /ultimate|frisbee/],
    ['Curling', /curling/],
    ['Skating', /\bskating\b|ice skate/],
    ['Boxing', /boxing|kickbox/],
    ['Martial arts', /jiu.?jitsu|\bbjj\b|karate|judo|taekwondo|muay thai/],
    ['Softball', /softball|baseball/],
    ['Rugby', /rugby/],
    ['Football', /football/],
    ['Lacrosse', /lacrosse/],
    ['Skateboarding', /skateboard/],
    ['Surfing', /\bsurf/]
  ];
  var MOBILITY = /pilates|stretch|mobility|yoga/;
  var SKIP = /rest from|missed|fill or rest/;

  // Default distances when a cell doesn't say how far.
  var DEFAULT_KM = { run: 4, bike: 12, row: 3, hike: 8, stairs: 1, walk: 2, commute: 10, snowboard: 0, swim: 1.5, xcski: 10, mtb: 15 };
  var COMMUTE_KM = 10;
  // Sheets left out of the town entirely.
  var EXCLUDE = /^phase\s*1\b/i;

  var NOT_NAMES = /^(kids|fam|family|friends|boys|the|my|everyone|everybody|people|bike|paddleboard|run|walk|and)$/i;
  // Dogs get their own pen rather than a house.
  var DOGS = { minto: 'Minto', blue: 'Blue', millie: 'Millie' };
  function dogsIn(text) {
    var out = [];
    (text.match(/\b(minto|blue|millie)\b/gi) || []).forEach(function (m) { var d = DOGS[m.toLowerCase()]; if (out.indexOf(d) < 0) out.push(d); });
    return out;
  }

  // Notes are one exercise per line: "1A. Barbell Bench Press: 4.6.175 (+10lb)".
  var EXERCISE = [
    ['shoulders', /ohp|shoulder|lateral|arnold|curl|tricep|dip|delt/],
    ['post', /deadlift|rdl|glute|hamstring|good morning|leg curl/],
    ['back', /row|pulldown|pull-?up|pull up|face pull|lat\b/],
    ['legs', /squat|lunge|leg|split|calf/],
    ['core', /knee raise|\bab\b|plank|wood|leg raise|rollout/],
    ['chest', /bench|press|fly|flye|push/]
  ];

  function cell(v) { return v == null ? '' : String(v).trim(); }

  // A week's header: "09.07.2026" (month.day.year), or a written date like "Week 1 Jan. 26",
  // "July 3rd" or ":August 12th" (the year worked out from today). Any day of the week will do:
  // it's moved back to that week's Monday.
  var MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'];
  function parseHeaderDate(s, today) {
    var d = null, m = s.match(/^(\d{1,2})\.(\d{1,2})\.+(\d{4})/);
    if (m) d = new Date(+m[3], +m[1] - 1, +m[2]);
    else {
      var w = s.match(/\b(jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec)[a-z]*\.?\s*(\d{1,2})(?:st|nd|rd|th)?\b/i);
      if (!w) return null;
      var now = today || new Date(), mo = MONTHS.indexOf(w[1].toLowerCase());
      d = new Date(now.getFullYear(), mo, +w[2]);
      if (d - now > 7 * 864e5) d = new Date(now.getFullYear() - 1, mo, +w[2]);
    }
    return new Date(d.getFullYear(), d.getMonth(), d.getDate() - (d.getDay() + 6) % 7);
  }
  function isoDay(d) { return d.getFullYear() + '-' + ('0' + (d.getMonth() + 1)).slice(-2) + '-' + ('0' + d.getDate()).slice(-2); }

  function friendsIn(text) {
    // "w/ Everyone - AlexHayli, Katie Joel": everyone is the whole crew, Jo included.
    text = text.replace(/\b(everyone|everybody)\s*[-\u2013\u2014:]\s*/i, '$1, ');
    var m = text.match(/(?:\bw\/|\bw\.|\bwith\b)\s*([^()\-:\d]+)/i);
    if (!m) return [];
    var chunk = m[1].split(/\b(?:in|to|at|for|from|on)\b/i)[0];
    var out = /\b(everyone|everybody)\b/i.test(chunk) ? ['Jo'] : [];
    // Couples written together, like "AlexHayli", are two people.
    chunk.replace(/\b([A-Z][a-z]+)(?=[A-Z][a-z])/g, function (w) { return /^(mc|mac|de|di|da|la|le|van|von|st)$/i.test(w) ? w : w + ' '; }).split(/[,&+\s]+/).forEach(function (tok) {
      tok = tok.replace(/[^A-Za-z']/g, '');
      if (!tok || NOT_NAMES.test(tok) || DOGS[tok.toLowerCase()]) return;
      if (!/^[A-Z]/.test(tok) && !/^(mom|dad)$/i.test(tok)) return;
      if (tok.length > 2 && tok === tok.toUpperCase()) return;
      tok = tok.charAt(0).toUpperCase() + tok.slice(1).toLowerCase();
      if (out.indexOf(tok) < 0) out.push(tok);
    });
    return out;
  }

  function kmIn(text) {
    var m = text.match(/(\d+(?:\.\d+)?)\s*k(?:m)?\b/i);
    return m ? parseFloat(m[1]) : null;
  }

  function exerciseGroup(line) {
    var l = line.toLowerCase();
    for (var i = 0; i < EXERCISE.length; i++) if (EXERCISE[i][1].test(l)) return EXERCISE[i][0];
    return null;
  }

  // The four big barbell lifts, for the plate secrets. Dumbbell and variation lines don't count.
  var BIG_LIFTS = [
    ['ohp', /overhead press|\bohp\b|military|shoulder press|push press/, /\bdb\b|dumbbell|machine|cable|tricep|landmine|arnold|\(each\)/],
    ['bench', /bench/, /\bdb\b|dumbbell|incline|decline|close|machine|smith/],
    ['squat', /squat/, /goblet|split|bulgarian|\bdb\b|dumbbell|front|hack|smith|jump|pistol|\bbox\b/],
    ['deadlift', /deadlift/, /romanian|rdl|\bdb\b|dumbbell|stiff|single/]
  ];
  // Heaviest weight on a line: the biggest plausible number once PR deltas (+10lb) are removed.
  function bestsIn(text) {
    var out = {};
    text.split(/\n|\s\|\s|;/).forEach(function (line) {
      var l = line.toLowerCase();
      BIG_LIFTS.forEach(function (bl) {
        if (!bl[1].test(l) || bl[2].test(l)) return;
        var w = 0;
        // "4.8.190" and "4.5-7.165" are sets.reps.weight, not decimals: split those dots.
        var flat = l.replace(/\+\s?\d+(?:\.\d+)?/g, ' ').replace(/\d+(?:\.\d+){2,}/g, function (m) { return m.replace(/\./g, ' '); }).replace(/(\d)\.(\d{3,})/g, '$1 $2');
        (flat.match(/\d+(?:\.\d+)?\s*(?:kg)?/g) || []).forEach(function (m) {
          var v = parseFloat(m) * (/kg/.test(m) ? 2.2046 : 1);
          if (v >= 45 && v <= 1000 && v > w) w = v;
        });
        if (w) out[bl[0]] = Math.max(out[bl[0]] || 0, Math.round(w));
      });
    });
    return out;
  }

  // Reads lift notes: PRs per muscle group and an estimate of pounds moved.
  function readNotes(notes, fallbackGroup) {
    var prs = {}, tonnage = 0, prCount = 0, lines = {};
    notes.split(/\n|\s\|\s/).forEach(function (line) {
      if (!line.trim()) return;
      var g = exerciseGroup(line) || fallbackGroup;
      // PRs come only from the town's own history check (markHistoryPRs), not "+" notes.
      var t = line.match(/:\s*(\d+)\.(\d+)(?:\s*-\s*(\d+))?\.(\d+(?:\.\d+)?)/);
      if (t) {
        var reps = t[3] ? (+t[2] + +t[3]) / 2 : +t[2];
        tonnage += +t[1] * reps * parseFloat(t[4]);
      }
    });
    return { prs: prs, prCount: prCount, tonnage: Math.round(tonnage), lines: lines };
  }

  // One cell (morning or evening) can hold several activities: "5k-10k run UPPER VOLUME".
  function classify(text) {
    var l = text.toLowerCase();
    if (!l || SKIP.test(l)) return [];
    var out = [];
    var groups = GROUPS.filter(function (g) { return g[1].test(l); }).map(function (g) { return g[0]; });
    var cardio = CARDIO.filter(function (c) { return c[1].test(l); }).map(function (c) { return c[0]; });
    // Cross-country skiing isn't a snowboard day, and a mountain bike ride isn't a farm ride.
    if (cardio.indexOf('xcski') >= 0) cardio = cardio.filter(function (c) { return c !== 'snowboard'; });
    if (cardio.indexOf('mtb') >= 0) cardio = cardio.filter(function (c) { return c !== 'bike'; });
    var sports = SPORTS.filter(function (s) { return s[1].test(l); }).map(function (s) { return s[0]; });
    if (!groups.length && FULL.test(l) && !(cardio.length && /hiit/.test(l))) groups = ['full'];
    if (groups.length) out.push({ kind: 'lift', groups: groups });
    cardio.forEach(function (c) { out.push({ kind: c }); });
    sports.forEach(function (s) { out.push({ kind: 'sport', sport: s }); });
    if (MOBILITY.test(l)) out.push({ kind: 'mobility' });
    return out;
  }

  // A filled cell counts as green when its green channel clearly leads.
  function isGreen(hex) {
    if (!hex || hex.length < 6) return false;
    hex = hex.slice(-6);
    var r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
    return g > r + 30 && g > b + 20;
  }

  // A workout cell's colour: green is done, yellow is a rest day, red is missed.
  function cellStatus(hex) {
    if (!hex || hex.length < 6) return '';
    hex = hex.slice(-6);
    var r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
    if (g > r + 30 && g > b + 20) return 'done';
    if (r > 180 && g > 130 && b < 120) return 'rest';
    if (r > g + 60 && r > b + 40) return 'missed';
    return r > 235 && g > 235 && b > 235 ? '' : 'other';
  }
  // Exercise lines in the notes, like "3B. Narrow Grip Lat Pulldown: 3.10.140": the exercise, its
  // weight and its top rep count, so each session can be checked against your best so far.
  function exercisesIn(notes) {
    var out = [];
    String(notes || '').split(/\n|\s\|\s/).forEach(function (line) {
      var t = line.match(/(\d+)\.(\d+)(?:\s*-\s*(\d+))?\.(\d+(?:\.\d+)?)/);
      if (!t) return;
      var name = line.slice(0, t.index).replace(/^\s*\d+[a-z]?\s*[.)]\s*/i, '').replace(/\(.*?\)/g, '').replace(/[:\-–]+\s*$/, '').toLowerCase().replace(/[^a-z0-9 ]+/g, ' ').replace(/\s+/g, ' ').trim();
      if (name.length < 3) return;
      out.push({ name: name, w: parseFloat(t[4]), reps: +(t[3] || t[2]), line: line.trim() });
    });
    return out;
  }
  function parseSheet(name, rows, fills, today, events, planned) {
    // This week (Monday to Sunday): uncoloured workouts here are still to do.
    var wk0 = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (today.getDay() + 6) % 7), wk1 = new Date(wk0.getFullYear(), wk0.getMonth(), wk0.getDate() + 7);
    var cols = null, weekDate = null, found = false;
    // Every week's Monday, worked out up front. A header that can't be read (or was copied from
    // an earlier week, so it goes backwards) is a week after the one before it, or a week before
    // the one after it.
    var weekAt = {}, heads = [];
    rows.forEach(function (r, ri) {
      var f = cell(r[0]);
      if (f && DAYS.indexOf(f.toLowerCase()) < 0 && rows[ri + 1] && DAYS.indexOf(cell(rows[ri + 1][0]).toLowerCase()) === 0) heads.push({ ri: ri, d: parseHeaderDate(f, today) });
    });
    heads.forEach(function (h, i) { var pv = heads[i - 1]; if (pv && pv.d && (!h.d || h.d <= pv.d)) h.d = new Date(pv.d.getFullYear(), pv.d.getMonth(), pv.d.getDate() + 7); });
    for (var hi = heads.length - 2; hi >= 0; hi--) if (!heads[hi].d && heads[hi + 1].d) { var nx = heads[hi + 1].d; heads[hi].d = new Date(nx.getFullYear(), nx.getMonth(), nx.getDate() - 7); }
    heads.forEach(function (h) { weekAt[h.ri] = h.d; });
    rows.forEach(function (r, ri) {
      r = r.map(cell);
      // A header row has a cell that is just "Morning" (not a workout like "Morning bike w/ Mark").
      var morningIdx = r.findIndex(function (c) { return /^morning\s*$/i.test(c); });
      if (morningIdx >= 0 && DAYS.indexOf((r[0] || '').toLowerCase()) < 0) {
        cols = {
          am: morningIdx,
          pm: r.findIndex(function (c) { return /^evening\s*$/i.test(c); }),
          notes: r.findIndex(function (c) { return /^notes/i.test(c); }),
          drinks: r.findIndex(function (c) { return /drinks|beers/i.test(c); }),
          commute: r.findIndex(function (c) { return /^(bike|commute)$/i.test(c); }),
          weight: r.findIndex(function (c) { return /^weight$/i.test(c); })
        };
        found = true;
      }
      var first = r[0] || '';
      var day = DAYS.indexOf(first.toLowerCase());
      if (day < 0) {
        if (first) weekDate = ri in weekAt ? weekAt[ri] : parseHeaderDate(first, today);
        return;
      }
      if (!cols) return;
      var date = weekDate ? new Date(weekDate.getFullYear(), weekDate.getMonth(), weekDate.getDate() + day) : null;
      var thisWeek = !!date && date >= wk0 && date < wk1, fillRow = fills && fills[ri];
      if (date && date > today && !thisWeek) return;
      var notes = cols.notes >= 0 ? r[cols.notes] || '' : '';
      var dayLabel = date
        ? date.toLocaleDateString('en-CA', { month: 'short', day: 'numeric' })
        : DAYS[day].charAt(0).toUpperCase() + DAYS[day].slice(1);
      var dayEvents = [];
      [['AM', cols.am], ['PM', cols.pm]].forEach(function (slot) {
        if (slot[1] < 0) return;
        var text = r[slot[1]] || '';
        // Green is done; yellow (rest) and red (missed) never count. This week, uncoloured workouts
        // are still planned until they turn green; in earlier weeks uncoloured extras count as done.
        var status = cellStatus(fillRow && fillRow[slot[1]]);
        if (status === 'rest' || status === 'missed') return;
        if (status !== 'done' && thisWeek) {
          if (text.trim() && planned) classify(text).forEach(function (ev) {
            ev.label = text; ev.slot = slot[0]; ev.day = dayLabel; ev.date = isoDay(date); ev.planned = true; planned.push(ev);
          });
          return;
        }
        var friends = friendsIn(text), dogs = dogsIn(text);
        // A friend gets one credit per cell, even when the cell holds several activities.
        classify(text).forEach(function (ev, k) {
          ev.label = text;
          ev.slot = slot[0];
          ev.friends = k === 0 ? friends : [];
          ev.dogs = k === 0 ? dogs : [];
          ev.phase = name;
          ev.day = dayLabel;
          ev.date = date ? isoDay(date) : null;
          dayEvents.push(ev);
        });
      });
      if (date && date > today) return; // later this week: planned only
      // A green cell in the "bike" column means a ride to work and back.
      if (cols.commute >= 0 && fillRow && isGreen(fillRow[cols.commute])) {
        var written = dayEvents.filter(function (e) { return e.kind === 'commute'; })[0];
        if (written) written.km = COMMUTE_KM;
        else dayEvents.push({
          kind: 'commute', km: COMMUTE_KM, label: r[cols.commute] ? 'Commute · ' + r[cols.commute] : 'Bike commute', slot: 'AM',
          friends: [], phase: name, day: dayLabel, date: date ? isoDay(date) : null
        });
      }
      var lifts = dayEvents.filter(function (e) { return e.kind === 'lift'; });
      if (lifts.length && notes) {
        var info = readNotes(notes, lifts[0].groups[0]);
        // PRs on exercises outside the day's towers count toward its first tower.
        var prs = {}, prLines = {};
        Object.keys(info.prs).forEach(function (g) {
          var k = lifts[0].groups.indexOf(g) >= 0 ? g : lifts[0].groups[0];
          prs[k] = (prs[k] || 0) + info.prs[g];
          prLines[k] = (prLines[k] || []).concat(info.lines[g] || []);
        });
        lifts[0].prs = prs;
        lifts[0].prLines = prLines;
        lifts[0].prCount = info.prCount;
        lifts[0].tonnage = info.tonnage;
      }
      if (lifts.length && notes) lifts[0].exercises = exercisesIn(notes).map(function (x) { x.group = exerciseGroup(x.line) || lifts[0].groups[0]; return x; });
      if (lifts.length) {
        var bests = bestsIn(lifts.map(function (e) { return e.label; }).join('\n') + '\n' + notes);
        if (Object.keys(bests).length) lifts[0].bests = bests;
      }
      var cardio = dayEvents.filter(function (e) { return DEFAULT_KM[e.kind] != null; });
      cardio.forEach(function (e) {
        var km = kmIn(e.label);
        if (km == null && cardio.length === 1 && !lifts.length) km = kmIn(notes);
        e.km = km != null && km < 300 ? km : DEFAULT_KM[e.kind];
        if (e.kind === 'stairs') e.km = 1;
        if (e.kind === 'commute') e.km = COMMUTE_KM;
      });
      // Snowboard days: "8 laps" or "8 runs" in the cell or notes counts laps.
      dayEvents.forEach(function (e) {
        if (e.kind !== 'snowboard') return;
        var m = (e.label + ' ' + notes).match(/(\d+)\s*(laps?|runs?)\b/i);
        e.laps = m ? +m[1] : null;
      });
      dayEvents.forEach(function (e) { events.push(e); });
      // Weigh-ins (pounds) shape the statue.
      var weight = cols.weight >= 0 ? parseFloat(r[cols.weight]) : NaN;
      if (weight > 80 && weight < 500) {
        events.push({ kind: 'weight', value: weight, phase: name, day: dayLabel, date: date ? isoDay(date) : null, label: weight + ' lb' });
      }
      var drinks = cols.drinks >= 0 ? parseFloat(r[cols.drinks]) : NaN;
      if (drinks > 0 && drinks < 50) {
        events.push({ kind: 'drink', count: drinks, phase: name, day: dayLabel, date: date ? isoDay(date) : null, label: drinks + ' drink' + (drinks > 1 ? 's' : '') });
      }
    });
    return found;
  }

  function parseWorkbook(sheets, today) {
    var events = [], phases = [], planned = [];
    today = today || new Date();
    sheets.forEach(function (s) {
      if (EXCLUDE.test(s.name)) return;
      var before = events.length;
      if (parseSheet(s.name, s.rows, s.fills, today, events, planned) && events.length > before) phases.push(s.name);
    });
    markHistoryPRs(events);
    events.forEach(function (e, i) { e.i = i; });
    return { events: events, phases: phases, planned: planned };
  }
  // PRs from history: an exercise beats your best so far with more weight, or the same weight for
  // more reps. (The first time an exercise shows up sets the bar.) These join the "+" PRs from notes.
  function markHistoryPRs(events) {
    var best = {};
    events.forEach(function (e) {
      if (e.kind !== 'lift' || !e.exercises) return;
      var key0 = e.groups[0], extra = {};
      e.exercises.forEach(function (x) {
        var b = best[x.name];
        if (b && (x.w > b.w || (x.w === b.w && x.reps > b.reps))) {
          var k = e.groups.indexOf(x.group) >= 0 ? x.group : key0;
          var lines = (e.prLines && e.prLines[k]) || [];
          var shown = x.line.replace(/\s*\([^)]*\+[^)]*\)\+?/g, '').replace(/\s+\+\s?\d+\S*/g, '').trim();
          if (lines.indexOf(x.line) < 0) { (extra[k] = extra[k] || []).push(shown + ' \u2014 beat your best of ' + b.w + ' \u00d7 ' + b.reps); }
        }
        if (!b || x.w > b.w || (x.w === b.w && x.reps > b.reps)) best[x.name] = { w: x.w, reps: x.reps };
      });
      Object.keys(extra).forEach(function (k) {
        e.prs = e.prs || {}; e.prLines = e.prLines || {};
        e.prs[k] = (e.prs[k] || 0) + extra[k].length;
        e.prLines[k] = (e.prLines[k] || []).concat(extra[k]);
        e.prCount = (e.prCount || 0) + extra[k].length;
      });
      delete e.exercises;
    });
  }

  // The Bible reading log: a tab with Date, Book and Chapter columns ("4-5", "1, 3" or "7").
  // Each row becomes one reading event; "Chapters Logged" covers rows without chapter numbers.
  function chaptersIn(text) {
    var out = [];
    String(text || '').split(/[,;&]|\band\b/).forEach(function (part) {
      var m = part.match(/(\d+)\s*(?:-|–|to)\s*(\d+)/);
      if (m) { for (var c = +m[1]; c <= +m[2] && c - +m[1] < 200; c++) out.push(c); return; }
      var n = part.match(/\d+/);
      if (n) out.push(+n[0]);
    });
    return out;
  }
  function parseBible(sheets) {
    var events = [];
    sheets.forEach(function (sh) {
      var rows = sh.rows, head = -1, cols = null;
      for (var r = 0; r < Math.min(rows.length, 15) && head < 0; r++) {
        var low = rows[r].map(function (c) { return String(c).trim().toLowerCase(); });
        var d = low.indexOf('date'), b = low.indexOf('book'), c = low.findIndex(function (x) { return /^chapters?$/.test(x); });
        if (d >= 0 && b >= 0 && c >= 0) { head = r; cols = { date: d, book: b, chapter: c, notes: low.indexOf('notes'), logged: low.findIndex(function (x) { return /chapters logged/.test(x); }) }; }
      }
      if (head < 0) return;
      for (var i = head + 1; i < rows.length; i++) {
        var row = rows[i], book = String(row[cols.book] || '').trim(), dateText = String(row[cols.date] || '').trim();
        if (!book) continue;
        var m = dateText.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/) || null, date = null;
        if (m) date = m[1] + '-' + ('0' + m[2]).slice(-2) + '-' + ('0' + m[3]).slice(-2);
        else { var dt = new Date(dateText); if (!isNaN(dt)) date = dt.toISOString().slice(0, 10); }
        var chText = String(row[cols.chapter] || '').trim(), chapters = chaptersIn(chText);
        var logged = cols.logged >= 0 ? parseFloat(row[cols.logged]) : NaN;
        events.push({ kind: 'bible', book: book, chapters: chapters, count: isNaN(logged) ? chapters.length : logged, date: date,
          day: date ? new Date(date + 'T12:00:00').toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }) : '', label: book + (chText ? ' ' + chText : ''),
          note: cols.notes >= 0 ? String(row[cols.notes] || '').trim() : '', phase: 'Bible', friends: [], dogs: [] });
      }
    });
    return events;
  }

  // A reading list: a header row with Title (or Book) and Pages, plus any of Author, Rating
  // (Stars / Review / Score, as a number or ★s) and Date (Finished / Read). One book per row.
  function parseReadingRows(rows) {
    var head = -1, cols = null;
    for (var r = 0; r < Math.min(rows.length, 15) && head < 0; r++) {
      var low = rows[r].map(function (c) { return String(c).trim().toLowerCase(); });
      var t = low.findIndex(function (x) { return /^(title|book|book title|name)$/.test(x); });
      if (t < 0) continue;
      head = r;
      cols = {
        title: t, author: low.findIndex(function (x) { return /author|writer|by$/.test(x); }),
        pages: low.findIndex(function (x) { return /pages?|page count|length/.test(x); }),
        stars: low.findIndex(function (x) { return /rating|stars?|review|score/.test(x); }),
        date: low.findIndex(function (x) { return /date|finished|completed|read on|when/.test(x); }),
        cover: low.findIndex(function (x) { return /cover|image|img|photo|url/.test(x); })
      };
      cols.review = low.findIndex(function (x, i) { return i !== cols.stars && /review|thoughts|notes?|comments?/.test(x); });
    }
    if (head < 0) return [];
    var out = [];
    for (var i = head + 1; i < rows.length; i++) {
      var row = rows[i], title = String(row[cols.title] || '').trim();
      if (!title || /^-+$/.test(title.replace(/[:\s]/g, ''))) continue;
      var pages = cols.pages >= 0 ? parseInt(String(row[cols.pages]).replace(/[^\d]/g, ''), 10) : NaN;
      var st = cols.stars >= 0 ? String(row[cols.stars] || '') : '', stars = null;
      if (/★|⭐/.test(st)) stars = (st.match(/★|⭐/g) || []).length;
      else if (/^\d{5}(\.\d+)?$/.test(st.trim())) {
        // Google Sheets turns a typed "4/5" into the date April 5 (a day number like 46117): read it back.
        var sd = new Date(Date.UTC(1899, 11, 30) + Math.floor(+st) * 864e5), smo = sd.getUTCMonth() + 1, sdy = sd.getUTCDate();
        if (sdy === 5) stars = smo; else if (sdy === 10) stars = smo / 2;
      }
      else { var sm = st.match(/(\d+(?:\.\d+)?)/); if (sm) stars = Math.min(5, parseFloat(sm[1])); }
      var dt = cols.date >= 0 ? String(row[cols.date] || '').trim() : '', date = null;
      var dm = dt.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
      if (dm) date = dm[1] + '-' + ('0' + dm[2]).slice(-2) + '-' + ('0' + dm[3]).slice(-2);
      else if (dt) {
        // "June 2026" (or "Auguest 2026"): the month by its first three letters, dated to the end of
        // that month (or today, if that's sooner).
        var my = dt.match(/^([a-z]{3})[a-z]*\.?\s*,?\s*(\d{4})$/i), mi = my ? 'janfebmaraprmayjunjulaugsepoctnovdec'.indexOf(my[1].toLowerCase()) / 3 : -1;
        if (mi >= 0 && mi % 1 === 0) {
          var end = new Date(+my[2], mi + 1, 0), now = new Date();
          if (end > now && now.getFullYear() === +my[2] && now.getMonth() === mi) end = now;
          date = end.getFullYear() + '-' + ('0' + (end.getMonth() + 1)).slice(-2) + '-' + ('0' + end.getDate()).slice(-2);
        } else { var d2 = new Date(dt); if (!isNaN(d2) && d2.getFullYear() > 1990) date = d2.getFullYear() + '-' + ('0' + (d2.getMonth() + 1)).slice(-2) + '-' + ('0' + d2.getDate()).slice(-2); }
      }
      var cover = cols.cover >= 0 ? String(row[cols.cover] || '').trim() : '', review = cols.review >= 0 ? String(row[cols.review] || '').trim() : '';
      out.push({ kind: 'book', title: title, author: cols.author >= 0 ? String(row[cols.author] || '').trim() : '', pages: isNaN(pages) ? 0 : pages, stars: stars, date: date,
        cover: /^https:\/\//.test(cover) ? cover : '', review: review, month: dt,
        day: date ? new Date(date + 'T12:00:00').toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }) : '', label: title, phase: 'Reading', friends: [], dogs: [] });
    }
    return out;
  }
  // Letterboxd's export (diary.csv, or watched.csv / ratings.csv): Date, Name, Year, Letterboxd URI,
  // Rating, Rewatch, Tags, Watched Date. One film event per row.
  function parseMovies(sheets) {
    var best = [];
    sheets.forEach(function (sh) {
      var rows = sh.rows, head = -1, c = null;
      for (var r = 0; r < Math.min(rows.length, 10) && head < 0; r++) {
        var low = rows[r].map(function (x) { return String(x).trim().toLowerCase(); });
        var name = low.findIndex(function (x) { return /^(name|title|film|movie)$/.test(x); });
        if (name < 0) continue;
        head = r;
        c = { name: name, year: low.indexOf('year'), rating: low.findIndex(function (x) { return /^rating|stars?$/.test(x); }), rewatch: low.indexOf('rewatch'),
          date: low.indexOf('watched date') >= 0 ? low.indexOf('watched date') : low.findIndex(function (x) { return /^date/.test(x); }) };
      }
      if (head < 0) return;
      var out = [];
      for (var i = head + 1; i < rows.length; i++) {
        var row = rows[i], title = String(row[c.name] || '').trim();
        if (!title) continue;
        var dt = c.date >= 0 ? String(row[c.date] || '').trim() : '', dm = dt.match(/(\d{4})-(\d{1,2})-(\d{1,2})/), date = null;
        if (dm) date = dm[1] + '-' + ('0' + dm[2]).slice(-2) + '-' + ('0' + dm[3]).slice(-2);
        else if (dt) { var d2 = new Date(dt); if (!isNaN(d2)) date = d2.toISOString().slice(0, 10); }
        var rt = c.rating >= 0 ? parseFloat(row[c.rating]) : NaN;
        out.push({ kind: 'movie', title: title, year: c.year >= 0 ? String(row[c.year] || '').trim() : '', stars: isNaN(rt) ? null : Math.min(5, rt), rewatch: c.rewatch >= 0 && /^y/i.test(String(row[c.rewatch] || '')),
          date: date, day: date ? new Date(date + 'T12:00:00').toLocaleDateString('en-CA', { month: 'short', day: 'numeric' }) : '', label: title, phase: 'Films', friends: [], dogs: [] });
      }
      if (out.length > best.length) best = out;
    });
    return best;
  }
  function parseReading(sheets) {
    var best = [];
    sheets.forEach(function (sh) { var b = parseReadingRows(sh.rows); if (b.length > best.length) best = b; });
    return best;
  }
  // Pasted text: a markdown table, tab-separated rows (copied from a sheet) or CSV.
  function parseReadingText(text) {
    var lines = String(text || '').split(/\r?\n/).filter(function (l) { return l.trim(); });
    var rows = lines.map(function (l) {
      if (/\|/.test(l)) return l.replace(/^\s*\|/, '').replace(/\|\s*$/, '').split('|').map(function (c) { return c.trim(); });
      if (/\t/.test(l)) return l.split('\t');
      var out = [], cur = '', q = false;
      for (var i = 0; i < l.length; i++) { var ch = l[i]; if (ch === '"') q = !q; else if (ch === ',' && !q) { out.push(cur.trim()); cur = ''; } else cur += ch; }
      out.push(cur.trim());
      return out;
    });
    return parseReadingRows(rows);
  }

  root.FitParser = { parseMovies: parseMovies, parseReading: parseReading, parseReadingText: parseReadingText, parseBible: parseBible, chaptersIn: chaptersIn, bestsIn: bestsIn, parseWorkbook: parseWorkbook, classify: classify, friendsIn: friendsIn, dogsIn: dogsIn };
})(typeof window !== 'undefined' ? window : globalThis);
