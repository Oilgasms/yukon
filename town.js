// The town: a small floating island that grows one workout at a time.
// Every piece falls from the sky and lands where its workout type lives.
(function (root) {
  var T = root.THREE;
  var D2R = Math.PI / 180;

  // Warm, saturated farm-game colours. Day and dusk sets; seasons override a few keys.
  var PALETTES = {
    day: {
      grass: '#6fb34a', grassDeep: '#5c9e3d', dirt: '#a8713f', soil: '#8a5a33', stone: ['#e7e3da', '#d9d4c8', '#cac4b6'],
      stoneDark: '#9c8f7a', roof: ['#3f73b5', '#4f9a45', '#8a5cb0', '#2f8f8f', '#b5813f', '#5f6fbf'], roofJo: '#c8372d',
      plaster: ['#f4e6c8', '#ead6b0', '#f1dcc2'], wood: '#9a5f32', woodLight: '#e2c48e', path: '#d9b779', cobble: '#bdb3a2',
      water: '#4fa8dc', sand: '#ecd59a', leaf: ['#4f9e3a', '#68b544', '#3f8a32'], trunk: '#7a4a26',
      window: '#5b7fa8', windowGlow: '#000000', glasshouse: '#d4ece8', flag: ['#d8483a', '#f2c230', '#3f73b5', '#4f9e3a', '#e8823a'],
      court: '#d9824a', ice: '#e3f1f7', pitch: '#62ad48', line: '#ffffff', rock: '#9f9585', snow: '#f8fbfd', gold: '#e8b934',
      crop: ['#f08a2a', '#f4f0e0', '#c43a6a', '#e8d03a'], balloon: ['#d8483a', '#f2c230', '#3f73b5', '#8a5cb0', '#4f9e3a', '#e8823a'],
      roofTavern: '#5b4636', skigrass: '#7cba52', skirun: '#a8d877', birch: '#efebe2', birchleaf: '#a9d35a', redwood: '#a3472e', skisnow: '#f4f8fb', groomed: '#ffffff', run: ['#3f9a3a', '#2f6fc0', '#2a2a2a'], pine: ['#2f7a46', '#3b8a50'], hedge: '#3d7a33', hemiSky: '#fff4dc', hemiGround: '#8fa86a', sun: '#fff1d0', sunI: 0.72, hemiI: 0.7
    },
    dusk: {
      grass: '#3f6e3a', grassDeep: '#355f33', dirt: '#5e4130', soil: '#4a3426', stone: ['#b0aca4', '#a29e95', '#959087'],
      stoneDark: '#6f665a', roof: ['#2c4f80', '#356b33', '#5e3f7a', '#226363', '#7d5a2c', '#424d85'], roofJo: '#8f2a23',
      plaster: ['#bfb096', '#b3a284', '#bba891'], wood: '#6a4224', woodLight: '#a38c64', path: '#8e7a54', cobble: '#7f786c',
      water: '#2c5f86', sand: '#9c8c64', leaf: ['#2f5f2a', '#3c6e30', '#294f24'], trunk: '#4f301a',
      window: '#ffcf6a', windowGlow: '#ffb03a', glasshouse: '#8faaa6', flag: ['#a8382c', '#c49b26', '#2c4f80', '#3a7a2c', '#b8662c'],
      court: '#9a5a34', ice: '#a9bccb', pitch: '#3f7a32', line: '#d2ccc2', rock: '#6a6258', snow: '#c4cfe0', gold: '#c99a2a',
      crop: ['#b8661f', '#c9c4b2', '#8f2a4f', '#b8a02a'], balloon: ['#a8382c', '#c49b26', '#2c4f80', '#5e3f7a', '#3a7a2c', '#b8662c'],
      roofTavern: '#3a2c22', skigrass: '#406b34', skirun: '#5f8a44', birch: '#bdb8ad', birchleaf: '#5f8a34', redwood: '#6e2f1f', skisnow: '#c9d4e4', groomed: '#dde6f2', run: ['#2c6e2a', '#22508c', '#1a1a1a'], pine: ['#1f4f30', '#285c38'], hedge: '#24482a', hemiSky: '#6a74a8', hemiGround: '#253222', sun: '#ffb070', sunI: 0.55, hemiI: 0.75
    }
  };

  var SEASONS = {
    spring: {
      day: { grass: '#7cc251', grassDeep: '#66ab42', leaf: ['#7cc451', '#f3a9c4', '#5ea83f'], skigrass: '#86c45a', skirun: '#b7e08a' },
      dusk: { grass: '#457a3c', grassDeep: '#3a6834', leaf: ['#4a7d3a', '#a8738a', '#3a6a2c'] },
      snowLine: 0.62, weather: { color: '#f6bcd0', size: 5, count: 160, fall: 1.4, sway: 1.2 }
    },
    summer: { day: {}, dusk: {}, snowLine: 0.78, weather: null },
    fall: {
      day: { grass: '#86a043', grassDeep: '#738c38', leaf: ['#e8862a', '#d0482a', '#eab92c'], hedge: '#5f6e2c', birchleaf: '#f2c62e', skigrass: '#9f9c46', skirun: '#cbbf6a' },
      dusk: { grass: '#4f6430', grassDeep: '#435629', leaf: ['#a85e22', '#943426', '#a8862a'], hedge: '#3a4520', birchleaf: '#a88a22', skigrass: '#5d5d2c', skirun: '#7d7640' },
      snowLine: 0.66, weather: { color: '#e07a2a', size: 6, count: 90, fall: 1.8, sway: 1.6 }
    },
    winter: {
      day: { grass: '#eef3f6', grassDeep: '#dfe8ee', leaf: ['#e3ecf1', '#e3ecf1', '#d3dee6'], pine: ['#3d6b52', '#46785c'], birchleaf: '#e3ecf1', water: '#cfe6f1', path: '#d6cfc0', cobble: '#c2c6ca', pitch: '#e3ecf1', soil: '#dcd6cc', hedge: '#c9d6d2' },
      dusk: { grass: '#a7b2c6', grassDeep: '#96a2b8', leaf: ['#b2bdcf', '#b2bdcf', '#a3aec2'], pine: ['#2a4a3a', '#32563f'], birchleaf: '#b2bdcf', water: '#8ea4bd', path: '#8d8984', cobble: '#85878d', pitch: '#a7b2c6', soil: '#8f8a86', hedge: '#7f8b94' },
      snowLine: 0.32, weather: { color: '#ffffff', size: 4, count: 420, fall: 2.6, sway: 0.6 }
    }
  };

  // ---- layout (degrees; the camera looks from 315°, so 135° is the back) ----
  // Everything is spread out so each area has room for years of workouts.
  var TOWERS = [
    { key: 'chest', name: 'Chest tower', angle: 90 },
    { key: 'back', name: 'Back tower', angle: 150 },
    { key: 'shoulders', name: 'Shoulders & arms tower', angle: 210 },
    { key: 'legs', name: 'Leg tower', angle: 270 },
    { key: 'post', name: 'Posterior chain tower', angle: 330 },
    { key: 'core', name: 'Core tower', angle: 30 }
  ];
  var COURSE_H = 0.3;
  var TIER = 12;          // every 12 sessions a tower sprouts something new
  var TAPER = 24;         // and every 24 it steps in a little
  var GATE_ANGLE = 300;
  // Each outlying castle has its own look: stone, roofs, banners and an accent metal.
  var STYLE_COLORS = {
    citStone: ['#f6f4ee', '#ebe8e1', '#dfdbd2'], citDark: '#bdbab2', citRoof: ['#8ea8c4', '#a7bcd2'], citAccent: '#dfe6ee', citBanner: ['#f6f4ee', '#2b2e36'],
    holdStone: ['#cdb68e', '#bea67e', '#ad946c'], holdDark: '#7a5a3a', holdRoof: ['#dca848', '#cc9838'], holdAccent: '#e8b934', holdBanner: ['#3f7a3a', '#e8b934'],
    keepStone: ['#87837d', '#77736d', '#68645f'], keepDark: '#4d4a46', keepRoof: ['#575b62', '#4b4f56'], keepAccent: '#e6a93a', keepBanner: ['#7a2a24', '#2a4a7a'],
    elfStone: ['#f2e8d2', '#e8dbc0', '#dccdae'], elfDark: '#bcae90', elfRoof: ['#4fa08c', '#62b29c'], elfAccent: '#d5ece2', elfBanner: ['#4f8f7c', '#f2e8d2'],
    houseplant: ['#4f9e3a', '#3f8a32', '#68b544', '#5aa83e'],
    // White Pass & Yukon Route: green coaches with gold trim, a black engine, red roofs and cowcatcher.
    // Jo's Japanese garden house.
    jpTile: ['#4a5058', '#3c4148'], jpTimber: '#3b2c24', jpPlaster: '#f4f0e6', bamboo: ['#b9b45a', '#9d9a48'], maple: ['#c8402c', '#de5a2e'],
    sakura: ['#f4b6c8', '#f9d3de'], azalea: ['#e0609a', '#c84a86'], koi: ['#f07a2a', '#f4f0e6'], moss: '#5f8f3a', gravel: '#ece6d8',
    glacier: ['#d8eef6', '#aed8ea'],
    wpGreen: '#2f6b45', wpYellow: '#e6bf3c', wpBlack: '#26262b', wpRed: '#a8372b', wpCream: '#efe4c4',
    hare: ['#9b7f62', '#5a4636', '#e8dfd2'], deer: ['#a8754a', '#5a3c26', '#efe6d8'], moose: ['#5a3a24', '#2e1e14', '#d8c49a'], caribou: ['#8a7a66', '#4a3e32', '#eeeae2'],
    wolf: ['#8d8a86', '#4a4744', '#e2ded8'], lynx: ['#b9a688', '#3a3028', '#e8e0d0'], bear: ['#7a5232', '#3a2616', '#a87a50'], salmon: ['#d9604a', '#a8402c'],
    beaver: ['#7a4e2c', '#3a2a1e', '#a87a50'], duck: ['#8a6a4a', '#e8b934', '#2f7a46'], loon: ['#1e1e1e', '#2a2a2a', '#e8e8e8'], raven: ['#1c1c22', '#2a2a30', '#1c1c22'],
    eagle: ['#4a3420', '#e8b934', '#f4f2ec'], owl: ['#8a6e4e', '#e8b934', '#b89a72'],
    brick: ['#a8483a', '#b5553f', '#9a4034'], logwood: ['#8a5a34', '#74492a'], shingle: '#4e3d34', whitewood: '#f3efe6',
    fox: ['#d9682a', '#f4efe6', '#2a2420'], coon: ['#8d8883', '#2b2826', '#efece6'], glass: ['#c8372d', '#2f6fc0', '#e8b934', '#3f8a3f', '#7a4fb0', '#d9682a'],
    fire: '#ff8a2a', copper: '#c4713a', dragon: ['#6b2a2a', '#8f3a2a', '#d9a441'], fur: ['#eef2f4', '#a8c4d8'], hobbitDoor: '#3f7a3a', swan: ['#fbfbf8', '#e8823a', '#2a2a2a'], rainbow: ['#e8483a', '#f2903a', '#f2d23a', '#5fb04a', '#3f8ad0', '#7a5cc0'], canvas: ['#f4ead6', '#d8483a', '#3f73b5'], silver: '#e3e8ee', bin: ['#8a9a9c', '#5d6d70', '#b3c0c1'], otter: ['#6b4a2e', '#cdb08a', '#2e2219'], orca: ['#16161a', '#f2f2ef', '#9c9ca3'], mouse: ['#9c928a', '#8a6a4e', '#c8b49a', '#e8a3a3'], paper: ['#f2efe6', '#4a4a4a'], beer: ['#e3a02c', '#fbf6e8', '#d9e6e8'], smoke: '#d6d3cc', leafgold: '#d8b84a', horse: ['#7a5236', '#3a2a22', '#d8cfc2']
  };
  var CASTLE_MILESTONES = [
    [20, 'gatehouse', 'Gatehouse'], [40, 'banners', 'Wall banners'], [60, 'moat', 'Moat and drawbridge'],
    [90, 'outer', 'Outer curtain wall'], [130, 'spire', 'Golden spire on the keep'], [200, 'gold', 'Gilded tower roofs']
  ];
  var HOUSE_STAGES = [
    [1, 'Cottage'], [3, 'Window flower boxes'], [5, 'Second floor'], [8, 'Front porch'], [11, 'Fenced yard'],
    [14, 'Back wing'], [18, 'Vegetable patch'], [22, 'Side wing'], [26, 'Climbing roses'], [30, 'Stone well'],
    [36, 'Rose arbour over the gate'], [42, 'Stone garden wall'], [46, 'Third storey'], [50, 'Paved courtyard'], [58, 'Courtyard fountain'],
    [66, 'Clipped topiary'], [75, 'Garden statue'], [85, 'Fruit trees'], [96, 'Glass conservatory'], [108, 'Dovecote'],
    [120, 'Garden lanterns'], [135, 'Gilded weathervane']
  ];
  // Couples share one house.
  var HOUSEHOLDS = { katie: 'Katie & Joel', joel: 'Katie & Joel', rae: 'Rae & Shane', shane: 'Rae & Shane',
    reuben: 'Reuben & Kaitlyn', reuban: 'Reuben & Kaitlyn', kaitlyn: 'Reuben & Kaitlyn',
    alex: 'Alex & Hayli', hayli: 'Alex & Hayli', hayley: 'Alex & Hayli',
    rueben: 'Reuben & Kaitlyn', paul: 'Paul & Sam', sam: 'Paul & Sam', mark: 'Mark & Erin', erin: 'Mark & Erin' };
  var DOG_COLORS = { Minto: ['#ece6d8', '#3a3530'], Blue: ['#7f93a8', '#e8e4dc'], Millie: ['#c99552', '#f1e2c8'] };

  var RING_ROAD = 14.4;    // cobbled road around the castle grounds
  var SQUARE = polar(238, 24);
  var PUB = polar(250, 27.5);
  var DOG_PEN = { c: polar(281, 24.5), w: 7.5, d: 5.5 };
  var STATUE = polar(GATE_ANGLE, 16.2);
  var FARM = { angle: 328, r: 18, cols: 5, rows: 8 }; // the flower garden
  var POND = polar(200, 34);
  var OFFICE = polar(30, 55);
  // A river comes down from the back hills, bends around the right of town through the forest,
  // and runs out past the farmland.
  var RIVER_HALF = 1.7;
  var RIVER = bezierPath(polar(70, 100), polar(72, 64), polar(36, 34), polar(18, 38), 160).concat(bezierPath(polar(18, 38), polar(2, 44), polar(345, 58), polar(328, 104), 160));
  var RIVER_GRID = (function () { var g = {}; RIVER.forEach(function (p) { var k = Math.floor(p.x / 6) + ',' + Math.floor(p.z / 6); (g[k] = g[k] || []).push(p); }); return g; })();
  RIVER.forEach(function (p, i) { p.i = i; });
  var RIVER_NEAR = RIVER[0];
  function riverDist(x, z) {
    var best = 1e9, cx = Math.floor(x / 6), cz = Math.floor(z / 6);
    for (var i = -1; i <= 1; i++) for (var j = -1; j <= 1; j++) {
      var list = RIVER_GRID[(cx + i) + ',' + (cz + j)];
      if (list) for (var k = 0; k < list.length; k++) { var d = Math.hypot(list[k].x - x, list[k].z - z); if (d < best) { best = d; RIVER_NEAR = list[k]; } }
    }
    return best;
  }
  // The river's water level only ever falls on its way to the sea: where the land rises, the
  // river cuts a valley through it instead of climbing over. (Worked out on first use.)
  var RIVER_LEVELS = null;
  function riverLevel(i) {
    if (!RIVER_LEVELS) {
      RIVER_LEVELS = [];
      var lv = 1e9;
      RIVER.forEach(function (p) { lv = Math.min(lv, landY(p.x, p.z) - 0.9 - canyonDepth(p.x, p.z)); RIVER_LEVELS.push(Math.max(SEA_Y - 0.02, lv)); });
    }
    return RIVER_LEVELS[i];
  }
  // Extra castles start here once the first one's towers can't grow any taller: each sits on a raised hill.
  var CASTLE_SITES = [{ x: 0, z: 0, lift: 0 }, Object.assign(polar(42, 80), { lift: 4.5 }), Object.assign(polar(302, 84), { lift: 4 }), Object.assign(polar(135, 88), { lift: 4 }), Object.assign(polar(250, 86), { lift: 4.5 })];
  var MAX_LAYERS = 36;
  // How fast the castles rise. The first castle's towers may climb a layer every MAIN_CAP_EVERY
  // lifting sessions; each session builds CASTLE_PACE.mainBailey of its halls and turrets, and
  // CASTLE_PACE.steps pieces at the castles on the hills.
  var MAIN_CAP_EVERY = 6, CASTLE_PACE = { steps: 6, capEvery: 2, mainBailey: 2 };
  var LANE_STONES = 140;
  var BALLOON_KM = 30;
  var SPORT_SLOTS = [[66, 20], [90, 19.5], [78, 26], [54, 26.5], [104, 25], [118, 19.5], [94, 31.5], [64, 32]];
  // Hockey has its own rink, kept clear from the start: ice in winter, a paved rink the rest of the year.
  var HOCKEY = polar(132, 27);
  // The sheep pasture: one sheep for every 100 km ridden.
  var PASTURE = polar(282, 74), PASTURE_R = 6.3;
  // The church, built chapter by chapter as the Bible is read, on top of Church Hill past the end
  // of the south street, with a path winding up to it.
  // The glacier the river comes out of: a snow-capped mountain just past the river's head.
  var GLACIER = (function () {
    var S = RIVER[0], q = RIVER[8], l = Math.hypot(S.x - q.x, S.z - q.z), u = { x: (S.x - q.x) / l, z: (S.z - q.z) / l };
    return { S: S, u: u, x: S.x + u.x * 7, z: S.z + u.z * 7, R: 8, H: 15 };
  })();
  var CHURCH_AT = [256, 60], CHURCH = polar(CHURCH_AT[0], CHURCH_AT[1]), CHURCH_HILL = { r: 22, h: 3.4 };
  // Kept clear of fields below the hill.
  var CHAPEL_LANE = polar(254, 56);
  // The town square: a little Dawson City style square of packed earth and boardwalks in the low
  // ground west of the Slow Pour, joined to the old village square at its corner. The pub, the
  // library and the cinema front right onto it; the land rises gently all round.
  var TOWN_SQ = { x: -17, z: 26, hx: 5.5, hz: 4.5 };
  function inTownSquare(x, z, m) { return Math.abs(x - TOWN_SQ.x) < TOWN_SQ.hx + (m || 0) && Math.abs(z - TOWN_SQ.z) < TOWN_SQ.hz + (m || 0); }
  function facingSquare(p) { return Math.atan2(TOWN_SQ.x - p.x, TOWN_SQ.z - p.z); }
  function frontOf(p, d) { var a = facingSquare(p); return { x: p.x + Math.sin(a) * d, z: p.z + Math.cos(a) * d }; }
  var LIBRARY = { x: -27.3, z: 26 }, CINEMA = { x: -17, z: 33.6 };
  // The dragon's cave, out past the river.
  var HOARD = polar(18, 84);
  var SNOW = { c: polar(97, 58), R: 17, H: 19, runs: 42 };
  var RIDGE = { a: 176, r: 57 };
  var PEAK_START = 1.1;   // a fresh peak is a grassy hill this tall
  var FIELD_TILE = 0.9;
  var CROP_KINDS = ['wheat', 'pumpkin', 'cabbage', 'corn', 'sunflower'];

  function polar(deg, r) { return { x: Math.cos(deg * D2R) * r, z: -Math.sin(deg * D2R) * r }; }
  function rng(seed) {
    return function () {
      seed |= 0; seed = seed + 0x6D2B79F5 | 0;
      var t = Math.imul(seed ^ seed >>> 15, 1 | seed);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }
  function easeOutBounce(x) {
    var n = 7.5625, d = 2.75;
    if (x < 1 / d) return n * x * x;
    if (x < 2 / d) return n * (x -= 1.5 / d) * x + 0.75;
    if (x < 2.5 / d) return n * (x -= 2.25 / d) * x + 0.9375;
    return n * (x -= 2.625 / d) * x + 0.984375;
  }
  function angleDiff(a, b) { var d = Math.abs(a - b) % 360; return d > 180 ? 360 - d : d; }
  function angleOf(x, z) { return (-Math.atan2(z, x) / D2R + 360) % 360; }
  function inSector(x, z, from, to, rIn, rOut) {
    var a = angleOf(x, z), r = Math.hypot(x, z);
    var arc = from <= to ? (a >= from && a <= to) : (a >= from || a <= to);
    return arc && r >= rIn && r <= rOut;
  }
  function smooth(e0, e1, x) { var t = Math.max(0, Math.min(1, (x - e0) / (e1 - e0))); return t * t * (3 - 2 * t); }
  function noise2(x, z) { return Math.sin(x * 0.21 + 1.3) * Math.cos(z * 0.17 - 0.4) + 0.6 * Math.sin(x * 0.07 - z * 0.11 + 2.1) + 0.4 * Math.cos(x * 0.33 + z * 0.29); }
  // Spatial hash so scattering hundreds of spots stays quick.
  function Scatter(cell) { this.cell = cell; this.map = {}; }
  Scatter.prototype.near = function (x, z, dist) {
    var cx = Math.floor(x / this.cell), cz = Math.floor(z / this.cell), n = Math.max(1, Math.ceil(dist / this.cell));
    for (var i = -n; i <= n; i++) for (var j = -n; j <= n; j++) {
      var list = this.map[(cx + i) + ',' + (cz + j)];
      if (list) for (var k = 0; k < list.length; k++) if (Math.hypot(list[k].x - x, list[k].z - z) < dist) return true;
    }
    return false;
  };
  Scatter.prototype.add = function (p) { var key = Math.floor(p.x / this.cell) + ',' + Math.floor(p.z / this.cell); (this.map[key] = this.map[key] || []).push(p); };

  // Farmland: a connected patchwork in front of the town. Fields sit side by side in rows
  // (bands) at growing distances, separated by narrow tracks, with a drove road down the middle
  // (FARM_SPINE). Each band fills from the drove road outwards, alternating sides.
  var FARM_SPINE = 306, FIELD_BAND = 6.2, FIELD_ROWS = 5;
  var FIELDS = (function () {
    var out = [], r = rng(808), depth = FIELD_ROWS * FIELD_TILE + 0.5;
    function clear(p, size) {
      if (Math.hypot(p.x - POND.x, p.z - POND.z) < size + 6 || riverDist(p.x, p.z) < size + 3) return false;
      if (Math.hypot(p.x - DOG_PEN.c.x, p.z - DOG_PEN.c.z) < size + 5) return false;
      var fg = polar(FARM.angle, FARM.r + 3.2);
      if (Math.hypot(p.x - fg.x, p.z - fg.z) < size + 5) return false;
      if (Math.hypot(p.x - STATUE.x, p.z - STATUE.z) < size + 3) return false;
      if (Math.hypot(p.x - PASTURE.x, p.z - PASTURE.z) < size + PASTURE_R + 3 || Math.hypot(p.x - CHURCH.x, p.z - CHURCH.z) < size + 11 || Math.hypot(p.x - CHAPEL_LANE.x, p.z - CHAPEL_LANE.z) < size + 9) return false;
      if (inTownSquare(p.x, p.z, size + 4) || Math.hypot(p.x - LIBRARY.x, p.z - LIBRARY.z) < size + 12) return false;
      if (riverDist(p.x, p.z) < size + (canyonDepth(p.x, p.z) > 0.2 ? 13 : 3)) return false;
      if (Math.hypot(p.x, p.z) * Math.cos((angleOf(p.x, p.z) - 320) * D2R) > 80 - size) return false; // clear of the beach
      return !CASTLE_SITES.some(function (c, ci) { return ci && Math.hypot(c.x - p.x, c.z - p.z) < size + 21; });
    }
    // Ten bands of fields, the outer ones running out towards the coast and the sheep pasture.
    for (var band = 0; band < 10; band++) {
      var d = 30 + band * FIELD_BAND;
      [-1, 1].forEach(function (side) {
        // Start just clear of the drove road and walk outwards along the band.
        var arc = 3.4, k = 0;
        while (k++ < 20) {
          var cols = 5 + Math.floor(r() * 3), w = cols * FIELD_TILE + 0.5;
          var mid = arc + w / 2, a = FARM_SPINE + side * mid / d / D2R;
          arc += w + 0.7;
          if (a < (band >= 5 ? 238 : 266) || a > 350) break;
          var p = polar(a, d), size = Math.hypot(w, depth) / 2;
          if (!clear(p, size)) continue;
          out.push({ x: p.x, z: p.z, a: a, cols: cols, rows: FIELD_ROWS, size: size, tilt: 0, band: band, d: band * 1000 + mid });
        }
      });
    }
    return out.sort(function (a, b) { return a.d - b.d; });
  })();
  function inFarmland(x, z) { return inSector(x, z, 264, 350, 26, 90) || inSector(x, z, 236, 264, 58, 90); }

  // Village: a main street from the castle to the square, and two side streets beyond it.
  // Houses line both sides, facing each other across the street.
  var STREETS = [
    bezierPath(polar(262, RING_ROAD), polar(258, 18), polar(246, 21), SQUARE),
    bezierPath(SQUARE, polar(228, 28), polar(218, 31), polar(212, 36.5)),
    bezierPath(SQUARE, polar(248, 29), polar(255, 32), polar(257, 37)),
    // Lanes branching off the side streets as the village fills.
    bezierPath(polar(222, 29.6), polar(214, 27.5), polar(206, 26.5), polar(198, 25)),
    bezierPath(polar(254, 18.8), polar(260, 20.2), polar(266, 20.6), polar(271, 20.2)),
    bezierPath(polar(198, 25), polar(194, 22.5), polar(192, 20.5), polar(190, 18.2)),
    bezierPath(polar(212, 36.5), polar(206, 39), polar(200, 41.5), polar(193, 42.5)),
    // Chapel Lane, off the end of the south street past the church to where it first stood.
    // Market Lane, west from the end of the west street.
    bezierPath(polar(212, 36.5), { x: -40, z: 20.5 }, { x: -48, z: 19.5 }, { x: -55, z: 24 }),
    // Library Lane, south from the square's corner past the library, then round to Chapel Lane.
    bezierPath({ x: -22.6, z: 31.2 }, { x: -23.5, z: 38 }, { x: -30, z: 46 }, { x: -31, z: 56 }),
    bezierPath({ x: -31, z: 56 }, { x: -29, z: 59 }, { x: -27, z: 61 }, { x: -24, z: 62 })
  ];
  function FIELDS_NEAR(p) { return typeof FIELDS !== 'undefined' && FIELDS && FIELDS.some(function (f) { return Math.hypot(f.x - p.x, f.z - p.z) < f.size + 3.5; }); }
  var HOUSE_SLOTS = (function () {
    var pts = [], hash = new Scatter(6);
    STREETS.forEach(function (street, si) {
      // Front row along the street, then a second row behind it once the front fills.
      [[3.3, 0], [7.6, 1]].forEach(function (rowDef) {
      for (var i = (si === 0 ? 4 : 3) + rowDef[1] * 3; i < street.length; i += 6) {
        var a = street[Math.max(0, i - 1)], b = street[Math.min(street.length - 1, i + 1)];
        var dx = b.x - a.x, dz = b.z - a.z, l = Math.hypot(dx, dz) || 1, nx = -dz / l, nz = dx / l;
        [-1, 1].forEach(function (side) {
          var p = { x: street[i].x + nx * side * rowDef[0], z: street[i].z + nz * side * rowDef[0] };
          if (Math.hypot(p.x, p.z) < 17.5) return;
          if (Math.hypot(p.x - PUB.x, p.z - PUB.z) < 4.8 || Math.hypot(p.x - SQUARE.x, p.z - SQUARE.z) < 4.6) return;
          if (Math.hypot(p.x - CHURCH.x, p.z - CHURCH.z) < 13 || Math.hypot(p.x - LIBRARY.x, p.z - LIBRARY.z) < 11.5 || Math.hypot(p.x - CINEMA.x, p.z - CINEMA.z) < 7) return;
          if (inTownSquare(p.x, p.z, 2.6)) return;
          if (Math.hypot(p.x - DOG_PEN.c.x, p.z - DOG_PEN.c.z) < 7.5 || Math.hypot(p.x - POND.x, p.z - POND.z) < 7.5 || Math.hypot(p.x - OFFICE.x, p.z - OFFICE.z) < 5.5) return;
          if (STREETS.some(function (st) { return st.some(function (q) { return Math.hypot(q.x - p.x, q.z - p.z) < 2.3; }); })) return;
          if (hash.near(p.x, p.z, 3.9)) return;
          if (FIELDS_NEAR(p)) return;
          // Door faces the street.
          p.face = Math.atan2(-nx * side, -nz * side);
          p.si = si; p.ti = i;
          p.d = Math.hypot(p.x - SQUARE.x, p.z - SQUARE.z) + si * 0.5 + rowDef[1] * 30;
          pts.push(p); hash.add(p);
        });
      }
      });
    });
    return pts.sort(function (a, b) { return a.d - b.d; });
  })();


  // Running forest: clumps and clearings to the right, spreading outward from the edge of town.
  var FOREST_SEED = polar(15, 19.5);
  var FOREST = (function () {
    var r = rng(4242), pts = [], hash = new Scatter(3), fg = polar(FARM.angle, FARM.r + 3.2);
    // The woods spread out past the first forest (to the library, the canyon and the north castle)
    // so there's room for years of runs. Candidates come from a jittered grid, nearest-first later.
    for (var gx = -93; gx <= 93; gx += 0.85) for (var gz = -93; gz <= 93; gz += 0.85) {
      var p = { x: gx + (r() - 0.5) * 0.9, z: gz + (r() - 0.5) * 0.9 }, d = Math.hypot(p.x, p.z), a = angleOf(p.x, p.z), n = noise2(p.x, p.z);
      if (d < 19 || d > 92 || (a < 330 && a > 105) || n < -0.45) continue; // clearings
      if (d * Math.cos((a - 320) * D2R) > 84 || hash.near(p.x, p.z, d > 53 ? 1.4 : 1.55)) continue; // clear of the beach
      if (CASTLE_SITES.some(function (c, ci) { return ci && Math.hypot(c.x - p.x, c.z - p.z) < 22; })) continue;
      if (Math.hypot(p.x - HOARD.x, p.z - HOARD.z) < 9 || Math.hypot(p.x - LIBRARY.x, p.z - LIBRARY.z) < 12.5 || riverDist(p.x, p.z) < (canyonDepth(p.x, p.z) > 0.2 ? 14 : 3.4)) continue;
      if (Math.hypot(p.x - SNOW.c.x, p.z - SNOW.c.z) < SNOW.R + 2.5 || Math.hypot(p.x - OFFICE.x, p.z - OFFICE.z) < 7.5 || Math.hypot(p.x - fg.x, p.z - fg.z) < 7) continue;
      if (SPORT_SLOTS.some(function (sl) { var q = polar(sl[0], sl[1]); return Math.hypot(q.x - p.x, q.z - p.z) < 4.6; })) continue;
      if (FIELDS.some(function (f) { return Math.hypot(f.x - p.x, f.z - p.z) < f.size + 2; })) continue;
      p.order = Math.hypot(p.x - FOREST_SEED.x, p.z - FOREST_SEED.z) - n * 5 + r() * 4;
      pts.push(p); hash.add(p);
    }
    return pts.sort(function (a, b) { return a.order - b.order; });
  })();

  // Mountain range: peaks along a ridge far behind the town. It grows from the middle outward,
  // alternating sides, with smaller foothills stepping forward. Each peak has its own shape.
  var PEAKS = (function () {
    var r = rng(3131), out = [];
    for (var i = 0; i < 27; i++) {
      var side = i === 0 ? 0 : (i % 2 ? -1 : 1), step = Math.ceil(i / 2), foot = i % 3 === 2;
      var a = RIDGE.a + side * step * 4.4 + (r() - 0.5) * 2;
      var d = RIDGE.r + (foot ? -9 : 0) + (r() - 0.5) * 7;
      var h = foot ? 4 + r() * 3 : (i === 0 ? 18 : 10 + r() * 8);
      var p = polar(a, d);
      out.push({ x: p.x, z: p.z, a: a, h: h, sx: 0.85 + r() * 0.4, sz: 0.85 + r() * 0.4, rot: r() * 6.28 });
    }
    return out;
  })();
  function inRidge(x, z) { return inSector(x, z, 128, 224, 40, 76); }

  // Snowboard mountain: its own profile so runs can follow the slope.
  var SNOW_FACE = Math.atan2(-SNOW.c.z, -SNOW.c.x); // the side facing town
  // The snowboard mountain is jagged like the hiking peaks: one main peak, and two more that rise
  // behind it once the front runs are cut (sats[i] goes 0 -> 1 as each one grows).
  var SKI_SATS = [{ a: SNOW_FACE + 2.25, d: 14, R: 11, H: 13 }, { a: SNOW_FACE - 2.3, d: 15, R: 10, H: 11.5 }];
  SKI_SATS.forEach(function (sp) { sp.x = Math.cos(sp.a) * sp.d; sp.z = Math.sin(sp.a) * sp.d; });
  function skiProfile(d, R, H) { return d >= R ? 0 : H * Math.pow(1 - d / R, 1.25); }
  function skiNoise(x, z) {
    var r1 = 1 - Math.abs(Math.sin(x * 0.55 + 1.3) * Math.cos(z * 0.47 - 0.6)), r2 = 1 - Math.abs(Math.sin(x * 1.1 - z * 0.8 + 2.1));
    return r1 * r1 * 0.7 + r2 * 0.3;
  }
  // Mountain height above its base at a local point (relative to SNOW.c).
  function skiH(x, z, sats) {
    var h = skiProfile(Math.hypot(x, z), SNOW.R, SNOW.H);
    for (var i = 0; i < SKI_SATS.length; i++) if (sats[i] > 0) { var sp = SKI_SATS[i]; h = Math.max(h, skiProfile(Math.hypot(x - sp.x, z - sp.z), sp.R, sp.H * sats[i])); }
    return h > 0 ? h * (0.8 + 0.3 * skiNoise(x, z)) : 0;
  }

  // ---- terrain: rolling countryside, levelled where things are built ----
  function rawHeight(x, z) {
    var r = Math.hypot(x, z), amp = 1.1 + 3.6 * smooth(16, 50, r);
    return amp * (0.55 * Math.sin(0.11 * x + 0.7) * Math.cos(0.09 * z - 0.4) + 0.3 * Math.sin(0.21 * x + 0.16 * z + 1.9) + 0.18 * Math.cos(0.05 * x - 0.18 * z + 0.3));
  }
  // ---- water and landforms beyond the town ----
  // The coast: past the farmland the land drops to a beach and the sea. The shoreline runs
  // across the 320° direction about 104 out, with a gentle wobble; the river reaches it there.
  var COAST_N = { x: Math.cos(320 * D2R), z: -Math.sin(320 * D2R) }, COAST_T = { x: -COAST_N.z, z: COAST_N.x };
  function coastSd(x, z) {
    var tp = x * COAST_T.x + z * COAST_T.z;
    return x * COAST_N.x + z * COAST_N.z - (104 + 4 * Math.sin(tp * 0.06) + 2.5 * Math.sin(tp * 0.17 + 1));
  }
  var SEA_Y = -0.55;
  // The lighthouse headland: a point of high ground on the shore that ends in sheer cliffs.
  var HEAD = (function () { var p = shoreAt(338); return { x: p.x + COAST_N.x * 5, z: p.z + COAST_N.z * 5, top: 5.4 }; })();
  function headland(x, z) {
    var dx = x - HEAD.x, dz = z - HEAD.z, u = dx * COAST_N.x + dz * COAST_N.z, v = dx * COAST_T.x + dz * COAST_T.z;
    if (Math.abs(v) > 12 || u > 9 || u < -24) return -1e9;
    var e = Math.hypot(v / 5.5, u > 0 ? u / 5 : u / 13);
    if (e < 1) return HEAD.top * (1 - 0.1 * e * e);
    // Sheer to the sea and the sides, a long grassy slope back to the land.
    var land = 1 - smooth(-1, 1, u);
    return HEAD.top * 0.9 * (1 - smooth(1, 1.06 + land * 0.8, e)) + (land < 0.5 ? -4 * smooth(1.06, 1.3, e) : 0);
  }
  // A lake in the hills behind the mountains, with an irregular shore.
  var LAKE = { c: polar(213, 85), R: 8.5 };
  LAKE.y = rawHeight(LAKE.c.x, LAKE.c.z);
  function lakeEdge(a) { return LAKE.R * (1 + 0.18 * Math.sin(3 * a + 1) + 0.1 * Math.sin(5 * a)); }
  function lakeDist(x, z) { var dx = x - LAKE.c.x, dz = z - LAKE.c.z; return Math.hypot(dx, dz) - lakeEdge(Math.atan2(dz, dx)); }
  // The swimming spot on the lake's near shore (local +z runs out over the water).
  var SWIM = (function () {
    var a = Math.atan2(-LAKE.c.z, -LAKE.c.x) + 0.35, e = lakeEdge(a);
    return { x: LAKE.c.x + Math.cos(a) * (e + 1.2), z: LAKE.c.z + Math.sin(a) * (e + 1.2), rot: Math.atan2(-Math.cos(a), -Math.sin(a)) };
  })();
  function swimWorld(x, z) { var c = Math.cos(SWIM.rot), s = Math.sin(SWIM.rot); return { x: SWIM.x + x * c + z * s, z: SWIM.z - x * s + z * c }; }
  // A stream runs out of the lake and away into the hills.
  var STREAM_HALF = 0.8;
  var STREAM = (function () {
    var a = Math.atan2(polar(213, 1).z, polar(213, 1).x), e = lakeEdge(a);
    var p0 = { x: LAKE.c.x + Math.cos(a) * (e + 0.3), z: LAKE.c.z + Math.sin(a) * (e + 0.3) };
    return bezierPath(p0, polar(216, 100), polar(204, 112), polar(209, 134));
  })();
  // The waterfall sits on the lake's far shore; a ridge of high ground runs back from its cliff,
  // and a stream comes down that ridge to pour over the edge.
  var FALL = (function () {
    var a = Math.atan2(polar(135, 1).z, polar(135, 1).x), e = lakeEdge(a) + 1.6;
    return { a: a, x: LAKE.c.x + Math.cos(a) * e, z: LAKE.c.z + Math.sin(a) * e, ux: Math.cos(a), uz: Math.sin(a) };
  })();
  var FALL_STREAM = (function () {
    var pts = [], n = 60;
    for (var i = 0; i <= n; i++) {
      var t = 0.6 + i / n * 26, lat = Math.sin(t * 0.22) * 1.6 * Math.min(1, t / 6);
      pts.push({ x: FALL.x + FALL.ux * t - FALL.uz * lat, z: FALL.z + FALL.uz * t + FALL.ux * lat, t: t });
    }
    return pts;
  })();
  function fallRidge(x, z) {
    var dx = x - FALL.x, dz = z - FALL.z, t = dx * FALL.ux + dz * FALL.uz, lat = -dx * FALL.uz + dz * FALL.ux;
    if (t < -3 || t > 40 || Math.abs(lat) > 10) return null;
    return { t: t, w: (1 - smooth(3.5, 9, Math.abs(lat - Math.sin(Math.max(0, t) * 0.22) * 1.6))) * smooth(-2.5, 0.5, t) * (1 - smooth(31, 39, t)), target: LAKE.y + 5.3 + 0.1 * Math.min(29, Math.max(0, t)) };
  }
  var STREAM_GRID = (function () { var g = {}; STREAM.concat(FALL_STREAM).forEach(function (p) { var k = Math.floor(p.x / 6) + ',' + Math.floor(p.z / 6); (g[k] = g[k] || []).push(p); }); return g; })();
  // Little tarns: a reedy pond where the lake's stream ends, and a spring-fed pool among rocks at
  // the top of the waterfall's stream. landY scoops out their beds.
  var TARNS = [];
  (function () {
    function tarn(p, R, kind) { var t = { x: p.x, z: p.z, R: R, kind: kind }; t.y = landY(p.x, p.z) + (kind === 'spring' ? 0.15 : -0.15); TARNS.push(t); }
    var e = STREAM[STREAM.length - 1], e1 = STREAM[STREAM.length - 6], el = Math.hypot(e.x - e1.x, e.z - e1.z) || 1;
    tarn({ x: e.x + (e.x - e1.x) / el * 3.6, z: e.z + (e.z - e1.z) / el * 3.6 }, 4.2, 'reeds');
    var f = FALL_STREAM[FALL_STREAM.length - 1];
    tarn({ x: f.x + FALL.ux * 2.4, z: f.z + FALL.uz * 2.4 }, 2.6, 'spring');
  })();
  function streamDist(x, z) {
    var best = 1e9, cx = Math.floor(x / 6), cz = Math.floor(z / 6);
    for (var i = -1; i <= 1; i++) for (var j = -1; j <= 1; j++) {
      var list = STREAM_GRID[(cx + i) + ',' + (cz + j)];
      if (list) for (var k = 0; k < list.length; k++) { var d = Math.hypot(list[k].x - x, list[k].z - z); if (d < best) best = d; }
    }
    return best;
  }
  // The river's last stretch before the sea cuts a canyon between raised rims.
  function canyonDepth(x, z) { var r = Math.hypot(x, z); return 3.6 * smooth(70, 77, r) * (1 - smooth(95, 101, r)); }
  // The land before buildings: rolling hills, then the beach and sea, the lake basin and the stream bed.
  function landY(x, z) {
    var h = rawHeight(x, z), sd = coastSd(x, z);
    if (sd > -16) { h += (0.3 - h) * smooth(-16, -5, sd); h += (-3.2 - h) * smooth(-2, 7, sd); }
    var ld = lakeDist(x, z);
    if (ld < 7) h = ld > 0 ? h + (LAKE.y + 0.45 - h) * (1 - smooth(0, 7, ld)) : LAKE.y - 0.15 - 1.6 * smooth(0, 3, -ld);
    var fr = fallRidge(x, z);
    if (fr && fr.w > 0) h += (Math.max(h, fr.target) - h) * fr.w;
    if (Math.abs(x - STREAM[60].x) < 60 && Math.abs(z - STREAM[60].z) < 60) {
      var sdist = streamDist(x, z);
      if (sdist < 2.6) h -= 0.75 * (1 - smooth(STREAM_HALF - 0.3, 2.6, sdist));
    }
    var hl = headland(x, z);
    if (hl > h) h = hl;
    for (var ti = 0; TARNS && ti < TARNS.length; ti++) {
      var tn = TARNS[ti], td = Math.hypot(x - tn.x, z - tn.z);
      if (td < tn.R) h = tn.y - 0.15 - 0.6 * (1 - td / tn.R);
      else if (td < tn.R + 2.5) h += (tn.y + 0.25 - h) * (1 - smooth(tn.R, tn.R + 2.5, td));
    }
    // Church Hill.
    var chd = Math.hypot(x - CHURCH.x, z - CHURCH.z);
    if (chd < CHURCH_HILL.r) h += CHURCH_HILL.h * (0.5 + 0.5 * Math.cos(Math.PI * chd / CHURCH_HILL.r));
    // The mountain bike hill.
    if (MTB_HILL) {
      var md = Math.hypot(x - MTB_HILL.x, z - MTB_HILL.z);
      if (md < 20) {
        if (md < MTB_HILL.r) h += MTB_HILL.h * (0.5 + 0.5 * Math.cos(Math.PI * md / MTB_HILL.r));
        // The rounded hills round the shop; the shop's own spot stays level.
        var flat = smooth(3.2, 5.5, md);
        MTB_HILL.hills.forEach(function (hh) { var d2 = Math.hypot(x - hh.x, z - hh.z); if (d2 < hh.r) h += flat * hh.h * (0.5 + 0.5 * Math.cos(Math.PI * d2 / hh.r)); });
      }
    }
    return h;
  }

  // Flat plots for everything that gets built; each one is levelled to the ground height at its centre.
  var PADS = [{ x: 0, z: 0, rIn: 16, rOut: 19.5, h: 0 }];
  function pad(p, rIn, rOut) { PADS.push({ x: p.x, z: p.z, rIn: rIn, rOut: rOut, h: null }); }
  HOUSE_SLOTS.forEach(function (p) { pad(p, 2.4, 3.8); });
  SPORT_SLOTS.forEach(function (sl) { pad(polar(sl[0], sl[1]), 2.6, 3.9); });
  pad(HOCKEY, 3.0, 4.4);
  pad(PASTURE, PASTURE_R + 0.5, PASTURE_R + 3);
  pad(CHURCH, 11.8, 15.5);
  // The square sits at the lowest ground under it and the land eases up all round; it goes first
  // so the houses and the pub keep their own ground. The library and cinema are cut in at street level.
  var SQ_Y = (function () { var lo = 1e9; for (var x = -TOWN_SQ.hx; x <= TOWN_SQ.hx; x += 1) for (var z = -TOWN_SQ.hz; z <= TOWN_SQ.hz; z += 1) lo = Math.min(lo, landY(TOWN_SQ.x + x, TOWN_SQ.z + z)); return lo - 0.1; })();
  PADS.unshift({ x: TOWN_SQ.x, z: TOWN_SQ.z, rIn: 7.4, rOut: 19, h: SQ_Y });
  // The whole library footprint (wings, cloisters and courtyard behind) sits level with the square.
  [-4, 4].forEach(function (dz) { PADS.push({ x: LIBRARY.x - 3.45, z: LIBRARY.z + dz, rIn: 8.4, rOut: 11.5, h: SQ_Y + 0.05 }); });
  PADS.push({ x: CINEMA.x, z: CINEMA.z, rIn: 4.6, rOut: 7.5, h: SQ_Y + 0.05 });
  PADS.push({ x: TOWN_SQ.x, z: TOWN_SQ.z, rIn: 7.2, rOut: 8, h: SQ_Y }); // and the square itself stays dead level
  pad(PUB, 3, 4.4); pad(SQUARE, 3.6, 5.2); pad(STATUE, 1.5, 2.6); pad(POND, 7.6, 11); // Jo's whole garden, fence and all, sits level
  // Level spots for the sauna, the changing hut and the bathhouse down at the water's level, with the
  // shore easing up behind them.
  [[-4.2, -3.2, 2.0, 4.2], [-3.4, -7.6, 1.5, 3.8], [0, -4.6, 2.9, 5.4]].forEach(function (b) { var w = swimWorld(b[0], b[1]); PADS.push({ x: w.x, z: w.z, rIn: b[2], rOut: b[3], h: LAKE.y + 0.55 }); }); // at the lake's level, like the dock
  pad(OFFICE, 6.0, 9.0); // wide enough for the institute at full growth: wings, rear hall, lawns and railings
  pad(DOG_PEN.c, 4.3, 5.8);
  pad(polar(FARM.angle, FARM.r + 3.2), 4.8, 6.4);
  pad(SNOW.c, SNOW.R + 1, SNOW.R + 4);
  CASTLE_SITES.forEach(function (c, ci) { if (ci) PADS.push({ x: c.x, z: c.z, rIn: 14.2, rOut: 20, h: rawHeight(c.x, c.z) + c.lift }); });
  // The pub fronts the square at street level, and Jo's garden next to the library is level with it too.
  PADS.forEach(function (p) { if ((p.x === PUB.x && p.z === PUB.z) || (p.x === POND.x && p.z === POND.z)) p.h = SQ_Y + 0.05; });
  // Each level spot takes the ground as it already stands there (the land, shaped by the spots
  // levelled before it), so nothing ends up perched on a pillar or sunk in a pit.
  PADS.forEach(function (p, i) {
    if (p.h != null) return;
    var h = landY(p.x, p.z);
    for (var k = 0; k < i; k++) { var q = PADS[k], d = Math.hypot(p.x - q.x, p.z - q.z); if (d < q.rOut) h += (q.h - h) * (1 - smooth(q.rIn, q.rOut, d)); }
    p.h = h;
  });
  // Where roads and paths sit: on the ground, or on a bridge deck over the river.
  // Roads crossing the river ride up onto a deck just above the water, ramping down to the banks.
  function surfaceY(x, z) {
    var rd = riverDist(x, z);
    if (rd > RIVER_HALF + 6) return groundY(x, z);
    var lv = riverLevel(RIVER_NEAR.i);
    return Math.max(groundY(x, z), lv + 0.75);
  }
  // Ground height without the river channel: bridges sit at this level.
  function bankY(x, z) {
    var h = landY(x, z);
    for (var i = 0; i < PADS.length; i++) {
      var p = PADS[i], d = Math.hypot(x - p.x, z - p.z);
      if (d < p.rOut) h += (p.h - h) * (1 - smooth(p.rIn, p.rOut, d));
    }
    return h;
  }
  function groundY(x, z) {
    var h = landY(x, z), rd = riverDist(x, z);
    if (rd < RIVER_HALF + 30) {
      // Carve the bed below the water, with valley sides that widen the higher the land is.
      var lv = riverLevel(RIVER_NEAR.i), bed = lv - 0.55;
      if (h > bed) {
        var W = RIVER_HALF + 1.6 + Math.max(0, h - lv - 0.6) * 1.6;
        if (rd < W) h = bed + (h - bed) * smooth(RIVER_HALF - 0.4, W, rd);
      }
      var cd = rd < RIVER_HALF + 11 ? canyonDepth(x, z) : 0;
      if (cd > 0) h += cd * 0.7 * smooth(RIVER_HALF + 3.5, RIVER_HALF + 5.5, rd) * (1 - smooth(RIVER_HALF + 7.5, RIVER_HALF + 11, rd));
    }
    for (var i = 0; i < PADS.length; i++) {
      var p = PADS[i], d = Math.hypot(x - p.x, z - p.z);
      if (d < p.rOut) h += (p.h - h) * (1 - smooth(p.rIn, p.rOut, d));
    }
    if (LIB_GRADE && x > LIB_GRADE.box[0] && x < LIB_GRADE.box[1] && z > LIB_GRADE.box[2] && z < LIB_GRADE.box[3] && rd > RIVER_HALF + 0.6) {
      var G = LIB_GRADE, bd = 1e9, bi = 0;
      for (var gi = 0; gi < G.pts.length; gi++) { var gd = Math.hypot(G.pts[gi].x - x, G.pts[gi].z - z); if (gd < bd) { bd = gd; bi = gi; } }
      if (bd < 4.5) {
        var target = G.y0 + (G.y1 - G.y0) * (bi / (G.pts.length - 1));
        h += (target - h) * (1 - smooth(1.6, 4.5, bd)) * smooth(RIVER_HALF + 0.6, RIVER_HALF + 2, rd);
      }
    }
    return h;
  }

  function bezierPath(p0, p1, p2, p3, count) {
    var pts = [], n = 400, len = 0, prev = null;
    for (var i = 0; i <= n; i++) {
      var t = i / n, u = 1 - t;
      var x = u * u * u * p0.x + 3 * u * u * t * p1.x + 3 * u * t * t * p2.x + t * t * t * p3.x;
      var z = u * u * u * p0.z + 3 * u * u * t * p1.z + 3 * u * t * t * p2.z + t * t * t * p3.z;
      if (prev) len += Math.hypot(x - prev.x, z - prev.z);
      prev = { x: x, z: z, len: len };
      pts.push(prev);
    }
    count = count || Math.max(2, Math.round(len / 0.55));
    var out = [];
    for (var k = 0; k < count; k++) {
      var target = (k + 0.5) / count * len, j = 1;
      while (j < pts.length - 1 && pts[j].len < target) j++;
      var a = pts[j - 1], b = pts[j];
      out.push({ x: b.x, z: b.z, rot: -Math.atan2(b.z - a.z, b.x - a.x) });
    }
    out.spacing = len / count;
    return out;
  }
  // The commuter lane runs in a gentle S from the ring road, over the river, to the office
  // (clear of the library path, which leaves the ring road further round).
  var LANE = bezierPath(polar(28, RING_ROAD), polar(31, 27), polar(25, 39), polar(30, 55 - 3.4), LANE_STONES);
  // Paths: every destination gets its own path from the ring road; each field gate joins
  // the farm track at the nearest point already on it.
  var LODGE = (function () { var a = SNOW_FACE - 0.35, d = SNOW.R + 2.6; return { x: SNOW.c.x + Math.cos(a) * d, z: SNOW.c.z + Math.sin(a) * d }; })();
  function fieldGate(f) {
    var ang = f.a * D2R + f.tilt, vx = Math.cos(ang), vz = -Math.sin(ang), back = f.rows * FIELD_TILE / 2 + 0.6;
    return { x: f.x - vx * back, z: f.z - vz * back };
  }
  function trail(from, to, wiggle) {
    var dx = to.x - from.x, dz = to.z - from.z, l = Math.hypot(dx, dz) || 1, nx = -dz / l * wiggle, nz = dx / l * wiggle;
    return bezierPath(from, { x: from.x + dx * 0.33 + nx, z: from.z + dz * 0.33 + nz }, { x: from.x + dx * 0.66 - nx * 0.6, z: from.z + dz * 0.66 - nz * 0.6 }, to);
  }
  function fromRing(to, wiggle) { var a = angleOf(to.x, to.z); return trail(polar(a, RING_ROAD), to, wiggle == null ? 1.2 : wiggle); }
  var RING = (function () {
    var out = [], n = Math.round(2 * Math.PI * RING_ROAD / 0.55);
    for (var i = 0; i < n; i++) { var a = i / n * 360, p = polar(a, RING_ROAD); p.rot = (a + 90) * D2R; out.push(p); }
    return out;
  })();
  var PATHS = (function () {
    var out = [];
    out.push({ kind: 'road', pts: fromRing(STATUE, 0) });
    out.push({ kind: 'path', pts: fromRing(polar(FARM.angle, FARM.r - 0.8), 0.4) });
    out.push({ kind: 'path', pts: fromRing(polar(angleOf(DOG_PEN.c.x, DOG_PEN.c.z), Math.hypot(DOG_PEN.c.x, DOG_PEN.c.z) - DOG_PEN.d / 2 - 0.3), 0.6) });
    out.push({ kind: 'path', pts: fromRing(FOREST_SEED, 1.5) });
    out.push({ kind: 'road', pts: fromRing(LODGE, 2.5) });
    out.push({ kind: 'path', pts: fromRing(polar(RIDGE.a, RIDGE.r - 14), 2) });
    out.push({ kind: 'path', pts: trail(SQUARE, polar(angleOf(POND.x, POND.z) + 4, Math.hypot(POND.x, POND.z) - 5.5), 1) });
    SPORT_SLOTS.forEach(function (sl, i) { var p = polar(sl[0], sl[1] - 2.2); out.push({ kind: 'path', pts: fromRing(p, i % 2 ? 0.8 : -0.8), sport: i }); });
    out.push({ kind: 'path', pts: fromRing(polar(132, 27 - 2.6), 0.6) });
    out.push({ kind: 'path', pts: trail({ x: TOWN_SQ.x - TOWN_SQ.hx, z: LIBRARY.z }, frontOf(LIBRARY, 4.2), 0.2) });
    out.push({ kind: 'path', pts: trail({ x: CINEMA.x, z: TOWN_SQ.z + TOWN_SQ.hz }, frontOf(CINEMA, 2.4), 0.2) });
    out.push({ kind: 'path', pts: trail(polar(257, 37.5), polar(CHURCH_AT[0], CHURCH_AT[1] - 6.8), 1.6) });
    // Farm tracks: the drove road runs out from the ring road down the middle of the farmland,
    // reaching each band when its first field opens; each field's gate joins the track along
    // the inside of its band, at the nearest gate or the drove road.
    var spineAt = polar(FARM_SPINE, RING_ROAD), reached = -1, bandNodes = {};
    FIELDS.forEach(function (f, fi) {
      var g = fieldGate(f), pts = [];
      var sn = polar(FARM_SPINE, 30 + f.band * FIELD_BAND - (FIELD_ROWS * FIELD_TILE + 0.5) / 2 - 0.6);
      if (f.band > reached) {
        pts = pts.concat(trail(reached < 0 ? spineAt : polar(FARM_SPINE, 30 + reached * FIELD_BAND - (FIELD_ROWS * FIELD_TILE + 0.5) / 2 - 0.6), sn, 0.3));
        reached = f.band;
        bandNodes[f.band] = [sn];
      }
      var best = bandNodes[f.band][0], bd = 1e9;
      bandNodes[f.band].forEach(function (n) { var d = Math.hypot(n.x - g.x, n.z - g.z); if (d < bd) { bd = d; best = n; } });
      pts = pts.concat(trail(best, g, 0.2));
      out.push({ kind: 'track', pts: pts, field: true, fi: fi });
      bandNodes[f.band].push(g);
    });
    return out;
  })();
  // The library path climbs from its bridge up to the library: grade the ground along it into an
  // even ramp, so it doesn't break into steps over the ridge in between.
  var LIB_GRADE = (function () {
    var lib = frontOf(LIBRARY, 4.2), path = PATHS.filter(function (pa) { var e = pa.pts[pa.pts.length - 1]; return Math.hypot(e.x - lib.x, e.z - lib.z) < 0.5; })[0];
    if (!path) return null;
    var pts = path.pts, k = 0;
    while (k < pts.length && riverDist(pts[k].x, pts[k].z) > RIVER_HALF + 1.2) k++;   // up to the river
    while (k < pts.length && riverDist(pts[k].x, pts[k].z) <= RIVER_HALF + 1.2) k++;  // across it
    if (k >= pts.length - 2) return null;
    var seg = pts.slice(k);
    riverDist(seg[0].x, seg[0].z);
    var y0 = riverLevel(RIVER_NEAR.i) + 0.75, y1 = groundY(seg[seg.length - 1].x, seg[seg.length - 1].z);
    var xs = seg.map(function (p) { return p.x; }), zs = seg.map(function (p) { return p.z; });
    return { pts: seg, y0: y0, y1: y1, box: [Math.min.apply(null, xs) - 5, Math.max.apply(null, xs) + 5, Math.min.apply(null, zs) - 5, Math.max.apply(null, zs) + 5] };
  })();
  // Each extra castle's road home, from the ring road to its gate (laid when the castle starts).
  var CASTLE_ROADS = CASTLE_SITES.map(function (site, ci) {
    if (!ci) return null;
    var gp = polar(angleOf(-site.x, -site.z), 13.8);
    return trail(polar(angleOf(site.x, site.z), RING_ROAD), { x: site.x + gp.x, z: site.z + gp.z }, 3);
  });
  FOREST = FOREST.filter(function (p) { return !nearPath(p.x, p.z, 1.3); });
  FOREST = FOREST.filter(function (p) { return !LANE.some(function (q) { return Math.hypot(q.x - p.x, q.z - p.z) < 1.6; }); });
  FOREST.hash = new Scatter(4); FOREST.forEach(function (p) { FOREST.hash.add(p); });
  function nearPath(x, z, dist) {
    for (var i = 0; i < PATHS.length; i++) for (var k = 0; k < PATHS[i].pts.length; k += 2) if (Math.hypot(PATHS[i].pts[k].x - x, PATHS[i].pts[k].z - z) < dist) return true;
    for (i = 0; i < STREETS.length; i++) for (k = 0; k < STREETS[i].length; k += 2) if (Math.hypot(STREETS[i][k].x - x, STREETS[i][k].z - z) < dist) return true;
    for (i = 1; i < CASTLE_ROADS.length; i++) for (k = 0; k < CASTLE_ROADS[i].length; k += 2) if (Math.hypot(CASTLE_ROADS[i][k].x - x, CASTLE_ROADS[i][k].z - z) < dist + 0.4) return true;
    return false;
  }

  // Unit mountain (height 1, radius 1) with a rocky wobble; peaks scale it.
  function mountainGeometry(fromFrac, grow, wobble) {
    var pts = [], n = 16;
    for (var i = 0; i <= n; i++) {
      var y = fromFrac + (1 - fromFrac) * i / n;
      var d = 1 - Math.pow(y, 1 / 1.5);
      pts.push(new T.Vector2(Math.max(0.0005, d * grow + (i < n ? 0.006 : 0)), y));
    }
    var g = new T.LatheGeometry(pts, 11);
    var pos = g.attributes.position;
    for (i = 0; i < pos.count; i++) {
      var x = pos.getX(i), yy = pos.getY(i), z = pos.getZ(i);
      if (yy < 0.01 || yy > 0.99) continue;
      var a = Math.round(((Math.atan2(z, x) + Math.PI * 2) % (Math.PI * 2)) * 100) % 628;
      var h = Math.sin(a * 12.9898 + Math.round(yy * 1000) * 78.233) * 43758.5453;
      var j = 1 + ((h - Math.floor(h)) - 0.5) * (wobble == null ? 0.18 : wobble);
      pos.setX(i, x * j); pos.setZ(i, z * j);
    }
    g.computeVertexNormals();
    return g;
  }

  function SoftRenderer(canvas) {
    this.domElement = canvas;
    this.ctx = canvas.getContext('2d');
    if (!this.ctx) throw new Error('No 2D canvas available');
    this.pr = 1; this.w = 1; this.h = 1;
    this.shadowMap = { enabled: false };
    this.vp = new T.Matrix4(); this.full = new T.Matrix4(); this.nm = new T.Matrix3();
    this.v = new T.Vector3(); this.n = new T.Vector3(); this.a = new T.Vector3(); this.b = new T.Vector3(); this.c = new T.Vector3();
    this.view = new T.Vector3(); this.sunDir = new T.Vector3(); this.col = new T.Color(); this.tmp = new T.Color();
    this.tris = []; this.ground = [];
  }
  SoftRenderer.prototype.setPixelRatio = function (r) { this.pr = r; };
  SoftRenderer.prototype.setSize = function (w, h) {
    this.w = w; this.h = h;
    this.domElement.width = Math.round(w * this.pr); this.domElement.height = Math.round(h * this.pr);
  };
  SoftRenderer.prototype.render = function (scene, camera) {
    var ctx = this.ctx, W = this.w, H = this.h, self = this;
    scene.updateMatrixWorld();
    camera.updateMatrixWorld();
    this.vp.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    camera.getWorldDirection(this.view);
    var hemi = this.hemi, sun = this.sun;
    this.sunDir.copy(sun.position).normalize();
    var tris = this.tris, ground = this.ground;
    tris.length = 0; ground.length = 0;
    scene.traverseVisible(function (o) {
      if (!o.isMesh) return;
      var g = o.geometry, pos = g.attributes.position, idx = g.index;
      var mat = Array.isArray(o.material) ? o.material[0] : o.material;
      if (!mat.visible || mat.colorWrite === false) return;
      self.full.multiplyMatrices(self.vp, o.matrixWorld);
      self.nm.getNormalMatrix(o.matrixWorld);
      var n = pos.count, sx = new Float32Array(n), sy = new Float32Array(n), sz = new Float32Array(n);
      var e = self.full.elements;
      for (var i = 0; i < n; i++) {
        var x = pos.getX(i), y = pos.getY(i), z = pos.getZ(i);
        sx[i] = ((e[0] * x + e[4] * y + e[8] * z + e[12]) + 1) * 0.5 * W;
        sy[i] = (1 - (e[1] * x + e[5] * y + e[9] * z + e[13])) * 0.5 * H;
        sz[i] = e[2] * x + e[6] * y + e[10] * z + e[14];
      }
      var count = idx ? idx.count : n, double = mat.side === T.DoubleSide;
      var list = o.userData.ground ? ground : tris;
      for (var t = 0; t < count; t += 3) {
        var i0 = idx ? idx.getX(t) : t, i1 = idx ? idx.getX(t + 1) : t + 1, i2 = idx ? idx.getX(t + 2) : t + 2;
        var minX = Math.min(sx[i0], sx[i1], sx[i2]), maxX = Math.max(sx[i0], sx[i1], sx[i2]);
        var minY = Math.min(sy[i0], sy[i1], sy[i2]), maxY = Math.max(sy[i0], sy[i1], sy[i2]);
        if (maxX < 0 || minX > W || maxY < 0 || minY > H) continue;
        self.a.fromBufferAttribute(pos, i0); self.b.fromBufferAttribute(pos, i1); self.c.fromBufferAttribute(pos, i2);
        self.b.sub(self.a); self.c.sub(self.a);
        self.n.crossVectors(self.b, self.c).applyMatrix3(self.nm);
        if (self.n.lengthSq() < 1e-12) continue;
        self.n.normalize();
        var facing = self.n.dot(self.view);
        if (facing > 0) { if (!double) continue; self.n.negate(); }
        var nl = Math.max(0, self.n.dot(self.sunDir));
        var up = 0.5 * self.n.y + 0.5;
        self.col.copy(hemi.groundColor).lerp(self.tmp.copy(hemi.color), up).multiplyScalar(hemi.intensity);
        self.col.r += sun.color.r * sun.intensity * nl; self.col.g += sun.color.g * sun.intensity * nl; self.col.b += sun.color.b * sun.intensity * nl;
        self.col.multiply(mat.color);
        if (mat.emissive) self.col.add(mat.emissive);
        list.push({
          x0: sx[i0], y0: sy[i0], x1: sx[i1], y1: sy[i1], x2: sx[i2], y2: sy[i2],
          z: sz[i0] + sz[i1] + sz[i2],
          fill: 'rgb(' + Math.min(255, self.col.r * 255 | 0) + ',' + Math.min(255, self.col.g * 255 | 0) + ',' + Math.min(255, self.col.b * 255 | 0) + ')',
          alpha: mat.transparent ? mat.opacity : 1
        });
      }
    });
    var far = function (p, q) { return q.z - p.z; };
    ground.sort(far); tris.sort(far);
    ctx.setTransform(this.pr, 0, 0, this.pr, 0, 0);
    ctx.clearRect(0, 0, W, H);
    ctx.lineJoin = 'round';
    ctx.lineWidth = 0.6;
    [ground, tris].forEach(function (list) {
      for (var i = 0; i < list.length; i++) {
        var p = list[i];
        ctx.globalAlpha = p.alpha;
        ctx.beginPath(); ctx.moveTo(p.x0, p.y0); ctx.lineTo(p.x1, p.y1); ctx.lineTo(p.x2, p.y2); ctx.closePath();
        ctx.fillStyle = p.fill; ctx.fill();
        if (p.alpha === 1) { ctx.strokeStyle = p.fill; ctx.stroke(); }
      }
    });
    ctx.globalAlpha = 1;
  };

  function Town(canvas, opts) {
    this.canvas = canvas;
    opts = opts || {};
    this.reduced = !!opts.reducedMotion;
    this.anims = [];
    this.season = 'summer';
    this.dark = false;
    this.lite = !!opts.lite;
    this.soft = !!opts.software;
    this.pixel = opts.pixel !== false;
    if (this.soft) { this.lite = true; this.renderer = new SoftRenderer(canvas); }
    else {
      this.renderer = new T.WebGLRenderer({ canvas: canvas, antialias: false, alpha: true, powerPreference: this.lite ? 'low-power' : 'default', failIfMajorPerformanceCaveat: false });
      this.renderer.shadowMap.enabled = true;
      this.renderer.shadowMap.type = T.BasicShadowMap; // crisp, pixel-friendly shadows
    }
    this.applyPixelRatio();
    this.scene = new T.Scene();
    this.camera = new T.OrthographicCamera(-1, 1, 1, -1, -300, 500);
    this.camera.position.set(34, 30, 34);
    this.camera.lookAt(0, 0, 0);
    this.controls = new T.OrbitControls(this.camera, canvas);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.08;
    this.controls.minZoom = 0.3;
    this.controls.maxZoom = 4;
    this.controls.maxPolarAngle = 1.3;
    this.controls.minPolarAngle = 0.3;
    // Move like a map: drag to pan across the ground, right-drag to turn, scroll or pinch to zoom.
    this.controls.screenSpacePanning = false;
    this.controls.mouseButtons = { LEFT: T.MOUSE.PAN, MIDDLE: T.MOUSE.DOLLY, RIGHT: T.MOUSE.ROTATE };
    this.controls.touches = { ONE: T.TOUCH.PAN, TWO: T.TOUCH.DOLLY_ROTATE };
    this.keys = {};
    var keyOwner = this;
    root.addEventListener('keydown', function (e) {
      if (/input|textarea|select/i.test((e.target && e.target.tagName) || '')) return;
      var k = e.key.toLowerCase();
      if (keyOwner.explore && k === ' ') { if (!e.repeat) keyOwner.jump(); e.preventDefault(); return; }
      if (keyOwner.explore && (k === 'e' || k === 'enter')) { if (!e.repeat) keyOwner.interact(); e.preventDefault(); return; }
      if (['w', 'a', 's', 'd', 'q', 'e', 'arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'shift'].indexOf(k) >= 0) {
        keyOwner.keys[k] = true; keyOwner.controls.autoRotate = false; keyOwner.fit.auto = false; if (k !== 'shift') e.preventDefault();
      }
    });
    root.addEventListener('keyup', function (e) { keyOwner.keys[e.key.toLowerCase()] = false; });
    root.addEventListener('blur', function () { keyOwner.keys = {}; });
    this.controls.target.set(0, 1.5, 0);
    this.controls.autoRotate = !this.reduced && !this.soft;
    this.controls.autoRotateSpeed = 0.3;
    this.fit = { zoom: 1, y: 1.5, auto: true };
    var self = this;
    this.controls.addEventListener('start', function () { self.controls.autoRotate = false; self.fit.auto = false; });

    var steps = new T.DataTexture(new Uint8Array([90, 170, 255]), 3, 1, T.LuminanceFormat);
    steps.minFilter = steps.magFilter = T.NearestFilter;
    steps.generateMipmaps = false;
    steps.needsUpdate = true;
    this.toonSteps = steps;
    this.mats = {};
    this.geo = {
      box: new T.BoxGeometry(1, 1, 1),
      cyl: new T.CylinderGeometry(1, 1, 1, 12),
      cyl6: new T.CylinderGeometry(1, 1, 1, 6),
      cone: new T.ConeGeometry(1, 1, 12),
      cone4: new T.ConeGeometry(1, 1, 4),
      cone6: new T.ConeGeometry(1, 1, 6),
      blob: new T.IcosahedronGeometry(1, 1),
      ball: new T.SphereGeometry(1, 12, 8),
      torus: new T.TorusGeometry(1, 0.18, 6, 12),
      ring: new T.RingGeometry(6.0, 7.1, 48).rotateX(-Math.PI / 2),
      flag: (function () {
        var g = new T.BufferGeometry();
        g.setAttribute('position', new T.Float32BufferAttribute([0, 0, 0, 0, -0.32, 0, 0.5, -0.16, 0], 3));
        g.computeVertexNormals();
        return g;
      })(),
      gable: (function () {
        var s = new T.Shape();
        s.moveTo(-0.85, 0); s.lineTo(0.85, 0); s.lineTo(0, 0.75); s.lineTo(-0.85, 0);
        var g = new T.ExtrudeGeometry(s, { depth: 1.5, bevelEnabled: false });
        g.translate(0, 0, -0.75);
        return g;
      })(),
      mountain: mountainGeometry(0, 1),
      snow: {}
    };
    this.setupLights();
    if (this.soft) { this.renderer.hemi = this.hemi; this.renderer.sun = this.sun; }
    this.needsRender = true;
    this.applyPalette();
    this.scene.fog = new T.Fog('#d9f1fb', 120, 300);
    this.buildTerrain();
    this.buildWeather();
    this.reset();
    this.resize();
    this.raycaster = new T.Raycaster();
    this.lastNow = performance.now();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  Town.prototype.applyPixelRatio = function () {
    var dpr = root.devicePixelRatio || 1;
    // Pixel mode renders each "pixel" about 1.9 screen pixels wide and lets the browser scale it up crisply.
    var pr = this.pixel ? 0.53 : (this.lite ? 1 : Math.min(dpr, 1.75));
    if (this.soft) pr = this.pixel ? 0.6 : Math.min(dpr, 1.5);
    this.renderer.setPixelRatio(pr);
    this.canvas.style.imageRendering = this.pixel ? 'pixelated' : 'auto';
  };
  Town.prototype.setPixel = function (on) {
    this.pixel = on;
    this.applyPixelRatio();
    this.resize();
  };

  Town.prototype.mat = function (name, idx) {
    var key = idx == null ? name : name + idx;
    if (!this.mats[key]) {
      var m;
      if (name === 'peak') m = new T.MeshStandardMaterial({ roughness: 0.95, metalness: 0, flatShading: true, vertexColors: true });
      else if (name === 'rock' || name === 'snow' || name === 'hill') m = new T.MeshStandardMaterial({ roughness: 0.95, metalness: 0, flatShading: true });
      else m = new T.MeshToonMaterial({ gradientMap: this.toonSteps });
      if (name === 'fields') { m.vertexColors = true; }
      if (name === 'water') { m.transparent = true; m.opacity = 0.92; }
      // Water, paths and paving lie almost level with the ground: always draw them on top of it.
      if (name === 'water' || name === 'path' || name === 'cobble') { m.polygonOffset = true; m.polygonOffsetFactor = -2; m.polygonOffsetUnits = -4; }
      // See-through panes for the glasshouse, with a faint warm glow at night.
      if (name === 'glasshouse') { m.transparent = true; m.opacity = 0.45; m.depthWrite = false; }
      if (name === 'flag' || name === 'banner') m.side = T.DoubleSide;
      m.userData = { name: name, idx: idx };
      this.mats[key] = m;
      this.paint(m);
    }
    return this.mats[key];
  };
  Town.prototype.paint = function (m) {
    var p = this.palette, name = m.userData.name;
    if (name === 'peak') { m.color.set('#ffffff'); return; }
    if (name.indexOf('dog:') === 0) { var dc = DOG_COLORS[name.slice(4)] || ['#a0806a', '#e8dccb']; m.color.set(dc[m.userData.idx || 0]); return; }
    var v = STYLE_COLORS[name] || p[name === 'banner' ? 'flag' : name === 'hill' ? 'grassDeep' : name === 'fields' ? 'grass' : name];
    if (Array.isArray(v)) v = v[(m.userData.idx || 0) % v.length];
    m.color.set(v);
    if (STYLE_COLORS[name] && this.dark) m.color.multiplyScalar(0.6);
    // Outside winter the rink is paved for ball hockey.
    if (name === 'ice' && this.season !== 'winter') m.color.set(this.dark ? '#7d7f84' : '#c4c6c4');
    if (m.emissive) m.emissive.set(name === 'fire' ? '#ff6a1a' : '#000000');
    if (name === 'window') m.emissive.set(p.windowGlow);
    // Snowshoe hares go white for winter.
    if (name === 'hare' && this.season === 'winter') m.color.set(['#f4f6f8', '#d8dde2', '#ffffff'][m.userData.idx || 0]);
    if (name === 'glasshouse') m.emissive.set(this.dark ? '#33240a' : '#000000');
    if (name === 'lantern') { m.color.set(p.flag[1]); m.emissive.set(p.windowGlow); }
    if (name === 'water') m.opacity = this.season === 'winter' ? 1 : 0.92;
    // Snow covers the field patchwork.
    if (name === 'fields' && m.vertexColors !== (this.season !== 'winter')) { m.vertexColors = this.season !== 'winter'; m.needsUpdate = true; }
  };
  Town.prototype.applyPalette = function () {
    this.needsRender = true;
    var base = this.dark ? PALETTES.dusk : PALETTES.day;
    var over = SEASONS[this.season][this.dark ? 'dusk' : 'day'];
    var p = {};
    for (var k in base) p[k] = base[k];
    for (k in over) p[k] = over[k];
    this.palette = p;
    for (k in this.mats) this.paint(this.mats[k]);
    this.hemi.color.set(p.hemiSky); this.hemi.groundColor.set(p.hemiGround); this.hemi.intensity = p.hemiI;
    this.sun.color.set(p.sun); this.sun.intensity = p.sunI;
    this.sun.position.set(this.dark ? -60 : 52, this.dark ? 32 : 60, this.dark ? 36 : 20);
    // Distant fields fade into the horizon colour of the sky behind the page.
    var HAZE = { day: { spring: '#efeedb', summer: '#f1ead6', fall: '#f6d9ab', winter: '#f1efea' }, dusk: { spring: '#3f4a66', summer: '#4b3560', fall: '#5e3a48', winter: '#3a4466' } };
    var haze = HAZE[this.dark ? 'dusk' : 'day'][this.season];
    // The time of day shifts the light: low warm sun at golden hour, cool moonlight at night.
    var ph = this.phase || (this.dark ? 'dusk' : 'day');
    if (ph === 'golden') { this.sun.color.set('#ffc47e'); this.sun.intensity = p.sunI * 0.9; this.sun.position.set(62, 22, -14); this.hemi.intensity = p.hemiI * 0.92; haze = '#f6c99c'; }
    else if (ph === 'dawn') { this.sun.color.set('#ffb3a0'); this.sun.position.set(-58, 20, 30); haze = '#c99aa8'; }
    else if (ph === 'night') { this.sun.color.set('#9fb4ff'); this.sun.intensity = p.sunI * 0.4; this.hemi.intensity = p.hemiI * 0.62; this.hemi.color.set('#5a6aa8'); haze = '#1c2440'; }
    if (this.scene && this.scene.fog) this.scene.fog.color.set(haze);
    if (this.flowers) this.flowers.visible = this.season !== 'winter';
    this.sunBase = this.sun.position.clone();
    if (this.st && this.st.hike) this.updateSnow();
  };
  Town.prototype.setTheme = function (dark) { this.dark = dark; this.phase = dark ? 'dusk' : 'day'; this.applyPalette(); };
  // dawn, day, golden (the hour before sunset), dusk or night. The lamps, windows, smoke and the
  // lighthouse come on for dawn, dusk and night.
  Town.prototype.setTimeOfDay = function (phase) {
    if (phase === this.phase && this.dark === (phase !== 'day' && phase !== 'golden')) return;
    this.phase = phase; this.dark = phase !== 'day' && phase !== 'golden'; this.applyPalette();
  };
  Town.prototype.setSeason = function (season) {
    if (!SEASONS[season] || season === this.season) return;
    this.season = season;
    this.applyPalette();
    this.updateSnow();
    this.refreshSki();
    this.weatherClock = 0; // pick weather that suits the new season straight away
  };

  Town.prototype.setupLights = function () {
    this.hemi = new T.HemisphereLight('#fff', '#888', 0.6);
    this.scene.add(this.hemi);
    this.sun = new T.DirectionalLight('#fff', 1);
    this.sun.castShadow = true;
    var size = this.lite ? 2048 : 4096;
    this.sun.shadow.mapSize.set(size, size);
    var c = this.sun.shadow.camera;
    c.left = -75; c.right = 75; c.top = 75; c.bottom = -75; c.near = 1; c.far = 260;
    this.sun.shadow.bias = -0.0008;
    this.sun.shadow.normalBias = 0.03;
    this.scene.add(this.sun);
  };

  Town.prototype.mesh = function (geo, mat, parent) {
    var m = new T.Mesh(geo, mat);
    m.castShadow = true; m.receiveShadow = true;
    (parent || this.world).add(m);
    return m;
  };
  Town.prototype.part = function (parent, geo, mat, sx, sy, sz, x, y, z, pick) {
    var m = this.mesh(geo, mat, parent);
    m.scale.set(sx, sy, sz); m.position.set(x, y, z);
    if (pick) { m.userData.pick = pick; this.picks.push(m); }
    return m;
  };

  // Rolling countryside: a patchwork of fields split by hedgerows, with a few old oaks.
  Town.prototype.buildTerrain = function () {
    var base = new T.Group();
    this.scene.add(base);
    this.base = base;
    var size = 420, seg = this.soft ? 80 : 230;
    var g = new T.PlaneGeometry(size, size, seg, seg).rotateX(-Math.PI / 2);
    var pos = g.attributes.position, cols = new Float32Array(pos.count * 3);
    for (var i = 0; i < pos.count; i++) {
      var x = pos.getX(i), z = pos.getZ(i), r = Math.hypot(x, z);
      pos.setY(i, groundY(x, z));
      // Field patchwork: each field is a slightly different green; the town itself stays even.
      var u = Math.floor((x + 0.3 * z) / 9), v = Math.floor((z - 0.2 * x) / 8);
      var hsh = Math.sin(u * 127.1 + v * 311.7) * 43758.5453; hsh -= Math.floor(hsh);
      var edge = smooth(18, 26, r), f = 1 + (hsh - 0.5) * 0.26 * edge;
      // Some fields lean golden (hay), some deeper green (pasture).
      var tint = hsh < 0.3 ? [1.08, 1.04, 0.78] : hsh > 0.75 ? [0.88, 0.97, 0.9] : [1, 1, 1];
      cols[i * 3] = f * (1 + (tint[0] - 1) * edge); cols[i * 3 + 1] = f * (1 + (tint[1] - 1) * edge); cols[i * 3 + 2] = f * (1 + (tint[2] - 1) * edge);
    }
    g.setAttribute('color', new T.BufferAttribute(cols, 3));
    g.computeVertexNormals();
    var ground = new T.Mesh(g, this.mat('fields'));
    ground.receiveShadow = true; ground.userData.ground = true;
    base.add(ground);
    this.ground = ground;

    // Hedgerows along the field edges out in the countryside.
    var spots = [], rr = rng(11);
    function ok(x, z) {
      var r = Math.hypot(x, z);
      if (r < 31 || r > 100) return false;
      if (inFarmland(x, z) || inRidge(x, z) || inSector(x, z, 332, 82, 0, 55)) return false;
      if (Math.hypot(x - SNOW.c.x, z - SNOW.c.z) < SNOW.R + 3 || riverDist(x, z) < (canyonDepth(x, z) > 0 ? 12 : 3.2)) return false;
      if (coastSd(x, z) > -8 || lakeDist(x, z) < 3 || streamDist(x, z) < 2.2 || Math.hypot(x - PASTURE.x, z - PASTURE.z) < PASTURE_R + 2.5 || Math.hypot(x - CHURCH.x, z - CHURCH.z) < 10 || Math.hypot(x - LIBRARY.x, z - LIBRARY.z) < 13 || inTownSquare(x, z, 3)) return false;
      if (CASTLE_SITES.some(function (c, ci) { return ci && Math.hypot(c.x - x, c.z - z) < 20.5; })) return false;
      if (nearPath(x, z, 1.6)) return false;
      if (HOUSE_SLOTS.some(function (h) { return Math.hypot(h.x - x, h.z - z) < 3.2; })) return false;
      if (Math.hypot(x - HOCKEY.x, z - HOCKEY.z) < 6 || Math.hypot(x - OFFICE.x, z - OFFICE.z) < 7 || Math.hypot(x - POND.x, z - POND.z) < 8.5) return false;
      for (var k = 0; k < LANE.length; k += 4) if (Math.hypot(x - LANE[k].x, z - LANE[k].z) < 1.4) return false;
      if (MTB_HILL && Math.hypot(x - MTB_HILL.x, z - MTB_HILL.z) < MTB_HILL.r + 3) return false;
      if (MTB_LANE) for (var mk = 0; mk < MTB_LANE.pts.length; mk += 2) if (Math.hypot(MTB_LANE.pts[mk].x - x, MTB_LANE.pts[mk].z - z) < 1.4) return false;
      if (MTB_HILL && MTB_HILL.hills.some(function (hh) { return Math.hypot(hh.x - x, hh.z - z) < hh.r; })) return false;
      if (CINEMA && Math.hypot(x - CINEMA.x, z - CINEMA.z) < 5.5) return false;
      if (Math.hypot(x - LAKE.c.x, z - LAKE.c.z) < LAKE.R + 14) for (var nk = 0; nk < NORDIC.pts.length; nk += 2) if (Math.hypot(NORDIC.pts[nk].x - x, NORDIC.pts[nk].z - z) < 2.6) return false;
      if (Math.hypot(x - NORDIC.cabin.x, z - NORDIC.cabin.z) < 4.5) return false;
      if (Math.hypot(x - LAKE.c.x, z - LAKE.c.z) < LAKE.R + 14) for (var nk = 0; nk < NORDIC.pts.length; nk += 2) if (Math.hypot(NORDIC.pts[nk].x - x, NORDIC.pts[nk].z - z) < 2.6) return false;
      if (Math.hypot(x - NORDIC.cabin.x, z - NORDIC.cabin.z) < 4.5) return false;
      return true;
    }
    for (var uu = -12; uu <= 12; uu++) for (var t = -105; t <= 105; t += 1.25) {
      var zz = t, xx = uu * 9 - 0.3 * zz;
      if (rr() < 0.3 || !ok(xx, zz)) continue;
      spots.push([xx + (rr() - 0.5) * 0.4, zz]);
    }
    for (var vv = -13; vv <= 13; vv++) for (t = -105; t <= 105; t += 1.25) {
      xx = t; zz = vv * 8 + 0.2 * xx;
      if (rr() < 0.3 || !ok(xx, zz)) continue;
      spots.push([xx, zz + (rr() - 0.5) * 0.4]);
    }
    if (!this.soft) {
      var hedge = new T.InstancedMesh(new T.IcosahedronGeometry(1, 0), this.mat('hedge'), spots.length);
      var m = new T.Matrix4(), q = new T.Quaternion(), sc = new T.Vector3(), p = new T.Vector3();
      spots.forEach(function (s, i) {
        var k = 0.55 + rr() * 0.35;
        sc.set(k * 1.1, k * 0.8, k * 1.1);
        p.set(s[0], groundY(s[0], s[1]) + k * 0.5, s[1]);
        q.setFromAxisAngle(new T.Vector3(0, 1, 0), rr() * 6.28);
        hedge.setMatrixAt(i, m.compose(p, q, sc));
      });
      hedge.castShadow = true; hedge.receiveShadow = true;
      base.add(hedge);
      this.hedges = { mesh: hedge, spots: spots, saved: {} };
      spots.forEach(function (sp, i) { this.addBrush(hedge, i, sp[0], sp[1], 0.8); }, this);
    }
    // Lone oaks dotted over the fields.
    for (i = 0; i < 90; i++) {
      var a = rr() * Math.PI * 2, d = 31 + rr() * 60, ox = Math.cos(a) * d, oz = Math.sin(a) * d;
      if (!ok(ox, oz)) continue;
      var tree = new T.Group(), s2 = 0.9 + rr() * 0.5;
      tree.position.set(ox, groundY(ox, oz), oz);
      var trunk = new T.Mesh(this.geo.cyl6, this.mat('trunk')); trunk.scale.set(0.2 * s2, 1.2 * s2, 0.2 * s2); trunk.position.y = 0.6 * s2;
      var crown = new T.Mesh(this.geo.blob, this.mat('leaf', i)); crown.scale.set(1.2 * s2, 1.05 * s2, 1.2 * s2); crown.position.y = 1.75 * s2;
      [trunk, crown].forEach(function (o) { o.castShadow = o.receiveShadow = true; tree.add(o); });
      base.add(tree);
      (this.oaks = this.oaks || []).push(tree);
    }
    // The river: water sitting in its carved channel.
    var water = this.ribbon(RIVER.map(function (p) { return { x: p.x, z: p.z, y: riverLevel(p.i) }; }), RIVER_HALF * 2.1, this.mat('water'));
    water.receiveShadow = true; water.userData.pick = 'river';
    base.add(water);
    this.riverMesh = water;
    this.buildLandforms(base);

    // Roads and paths: cobbles for the ring road and the gate road, dirt for the rest. Village streets
    // and the paths to fields and pitches are laid later, as those get built.
    var cobbles = RING.slice(), dirt = [], self = this;
    PATHS.forEach(function (pa) { if (pa.field || pa.sport != null || pa.castle) return; pa.pts.forEach(function (p) { (pa.kind === 'road' ? cobbles : dirt).push(p); }); });
    this.layTiles(cobbles, 'cobble', 1.5, base);
    this.layTiles(dirt, 'path', 0.95, base);
    var lamps = [];
    function lampsAlong(pts, every, off) { lampPoints(pts, every, off, 0).forEach(function (l) { lamps.push(l); }); }
    lampsAlong(RING, 14, 1.2);
    PATHS.forEach(function (pa) { if (!pa.field && pa.sport == null && !pa.castle) lampsAlong(pa.pts, 13, 1.0); });
    lamps.forEach(function (l) { self.lamp(l.x, l.z, base); });

    // The village square: a cobbled circle with a well and an old oak.
    var sq = new T.Group(), sy = groundY(SQUARE.x, SQUARE.z);
    sq.position.set(SQUARE.x, sy, SQUARE.z);
    var plaza = new T.Mesh(this.geo.cyl, this.mat('cobble')); plaza.scale.set(3.4, 0.08, 3.4); plaza.position.y = 0.02; plaza.receiveShadow = true; sq.add(plaza);
    var well = new T.Mesh(this.geo.cyl, this.mat('stone', 1)); well.scale.set(0.45, 0.5, 0.45); well.position.set(1.2, 0.25, 0.6); sq.add(well);
    var wr = new T.Mesh(this.geo.cone4, this.mat('roofJo')); wr.scale.set(0.65, 0.45, 0.65); wr.position.set(1.2, 1.25, 0.6); wr.rotation.y = Math.PI / 4; sq.add(wr);
    [-0.4, 0.4].forEach(function (x) { var p = new T.Mesh(self.geo.box, self.mat('wood')); p.scale.set(0.06, 0.9, 0.06); p.position.set(1.2 + x, 0.75, 0.6); sq.add(p); });
    var oakT = new T.Mesh(this.geo.cyl6, this.mat('trunk')); oakT.scale.set(0.28, 1.4, 0.28); oakT.position.set(-1.1, 0.7, -0.6); sq.add(oakT);
    var oakC = new T.Mesh(this.geo.blob, this.mat('leaf', 0)); oakC.scale.set(1.6, 1.3, 1.6); oakC.position.set(-1.1, 2.2, -0.6); sq.add(oakC);
    [-1, 1].forEach(function (s2) { var b = new T.Mesh(self.geo.box, self.mat('wood')); b.scale.set(1.0, 0.12, 0.3); b.position.set(-1.1 + s2 * 1.7, 0.35, -0.6); b.rotation.y = Math.PI / 2; sq.add(b); });
    sq.traverse(function (m) { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
    base.add(sq);

    // The town square: packed earth ringed by a plank boardwalk, a little fountain, hitching rails,
    // a water trough, benches on the boardwalk and a lamp at each corner.
    var ts = new T.Group(), Q = TOWN_SQ, W = Q.hx * 2, D = Q.hz * 2, BW = 1.1;
    ts.position.set(Q.x, groundY(Q.x, Q.z), Q.z);
    function TS(geo, mat, sx, sy, sz, x, y, z) { var m = new T.Mesh(geo, mat); m.scale.set(sx, sy, sz); m.position.set(x, y, z); ts.add(m); return m; }
    TS(this.geo.box, this.mat('stone', 2), W + 0.3, 1.6, D + 0.3, 0, -0.75, 0); // footing, in case the ground dips at an edge
    TS(this.geo.box, this.mat('path'), W - 2 * BW, 0.14, D - 2 * BW, 0, 0.03, 0);
    this.squareY = ts.position.y;
    // Boardwalk: planks across each side, raised a step.
    [[0, -(Q.hz - BW / 2), W, BW], [0, Q.hz - BW / 2, W, BW], [-(Q.hx - BW / 2), 0, BW, D - 2 * BW], [Q.hx - BW / 2, 0, BW, D - 2 * BW]].forEach(function (k, ki) {
      TS(self.geo.box, self.mat('wood'), k[2], 0.22, k[3], k[0], 0.11, k[1]);
      var along = k[2] > k[3], len = along ? k[2] : k[3];
      for (var t = -len / 2 + 0.3; t < len / 2; t += 0.3) TS(self.geo.box, self.mat('woodLight'), along ? 0.02 : BW, 0.225, along ? BW : 0.02, k[0] + (along ? t : 0), 0.11, k[1] + (along ? 0 : t));
    });
    // A small fountain in the middle.
    TS(this.geo.cyl, this.mat('stone', 1), 1.05, 0.38, 1.05, 0, 0.19, 0);
    TS(this.geo.cyl, this.mat('water'), 0.9, 0.05, 0.9, 0, 0.37, 0);
    TS(this.geo.cyl6, this.mat('stone', 0), 0.14, 0.9, 0.14, 0, 0.7, 0);
    TS(this.geo.blob, this.mat('water'), 0.22, 0.3, 0.22, 0, 1.25, 0);
    // Hitching rails and a water trough along the north side, benches on the boardwalks.
    [-2.6, 2.6].forEach(function (x) {
      [-0.7, 0.7].forEach(function (dx) { TS(self.geo.box, self.mat('wood'), 0.1, 0.8, 0.1, x + dx, 0.4, -(Q.hz - BW - 0.5)); });
      TS(self.geo.box, self.mat('wood'), 1.6, 0.08, 0.08, x, 0.75, -(Q.hz - BW - 0.5));
    });
    TS(this.geo.box, this.mat('wood'), 1.0, 0.35, 0.4, 0, 0.18, -(Q.hz - BW - 0.5));
    TS(this.geo.box, this.mat('water'), 0.9, 0.02, 0.3, 0, 0.35, -(Q.hz - BW - 0.5));
    [[-(Q.hx - 0.4), 1.6, Math.PI / 2], [Q.hx - 0.4, -1.6, -Math.PI / 2], [-2.5, Q.hz - 0.4, Math.PI], [2.5, Q.hz - 0.4, Math.PI]].forEach(function (b) {
      var bench = new T.Group(); bench.position.set(b[0], 0.22, b[1]); bench.rotation.y = b[2]; ts.add(bench);
      (self.seats = self.seats || []).push({ x: Q.x + b[0], z: Q.z + b[1], y: ts.position.y + 0.64, rot: b[2] });
      var seat = new T.Mesh(self.geo.box, self.mat('wood')); seat.scale.set(1.2, 0.07, 0.32); seat.position.y = 0.38; bench.add(seat);
      var back = new T.Mesh(self.geo.box, self.mat('wood')); back.scale.set(1.2, 0.3, 0.06); back.position.set(0, 0.58, -0.15); bench.add(back);
      [-0.5, 0.5].forEach(function (x) { var leg = new T.Mesh(self.geo.box, self.mat('stoneDark')); leg.scale.set(0.06, 0.38, 0.28); leg.position.set(x, 0.19, 0); bench.add(leg); });
    });
    [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (c) { self.lamp(Q.x + c[0] * (Q.hx - 0.35), Q.z + c[1] * (Q.hz - 0.35), base); });
    ts.traverse(function (m) { if (m.isMesh) { m.castShadow = true; m.receiveShadow = true; } });
    base.add(ts);
    this.buildMeadows(base);
    this.buildSnowMountain(base);
  };

  // Meadows: clumps of grass tufts and patches of wildflowers across the open countryside, kept
  // off the paths, plots, fields and water. Instanced, so there can be thousands.
  Town.prototype.buildMeadows = function (base) {
    if (this.soft) return;
    var r = rng(9191), tufts = [], blooms = [[], [], [], []];
    function open(x, z) {
      var d = Math.hypot(x, z);
      if (d < 16 || d > 96) return false;
      if (coastSd(x, z) > -2 || lakeDist(x, z) < 1 || riverDist(x, z) < RIVER_HALF + 1.6 || streamDist(x, z) < 1.3) return false;
      if (nearPath(x, z, 1.4) || inTownSquare(x, z, 2)) return false;
      if (HOUSE_SLOTS.some(function (h) { return Math.abs(h.x - x) < 3 && Math.abs(h.z - z) < 3; })) return false;
      if (FIELDS.some(function (f) { return Math.hypot(f.x - x, f.z - z) < f.size + 1; })) return false;
      if (CASTLE_SITES.some(function (c, ci) { return Math.hypot(c.x - x, c.z - z) < (ci ? 20 : 15); })) return false;
      var spots = [[CHURCH, 12.5], [LIBRARY, 12], [CINEMA, 6], [JO_PLOT, 8], [PUB, 5], [SQUARE, 5], [OFFICE, 6], [SNOW.c, SNOW.R + 2], [GLACIER, GLACIER.R + 2]];
      return !spots.some(function (q) { return Math.hypot(q[0].x - x, q[0].z - z) < q[1]; });
    }
    for (var i = 0; i < 26000 && tufts.length < 7000; i++) {
      var x = (r() - 0.5) * 190, z = (r() - 0.5) * 190;
      if (!open(x, z)) continue;
      var n = noise2(x * 1.7, z * 1.7);
      if (n < -0.2) continue; // bare patches between the clumps
      var y = groundY(x, z);
      for (var c = 0; c < 3; c++) tufts.push([x + (r() - 0.5) * 0.6, y, z + (r() - 0.5) * 0.6, 0.6 + r() * 0.6, r() * 6.28]);
      if (n > 0.35) for (var f = 0; f < 5; f++) blooms[Math.floor(r() * 4)].push([x + (r() - 0.5) * 1.6, y, z + (r() - 0.5) * 1.6]);
    }
    var m4 = new T.Matrix4(), q = new T.Quaternion(), e = new T.Euler(), v = new T.Vector3(), sc = new T.Vector3();
    var tuftMesh = new T.InstancedMesh(this.geo.cone4, this.mat('grassDeep'), tufts.length);
    tufts.forEach(function (t, k) {
      q.setFromEuler(e.set((r() - 0.5) * 0.4, t[4], (r() - 0.5) * 0.4));
      tuftMesh.setMatrixAt(k, m4.compose(v.set(t[0], t[1] + 0.12 * t[3], t[2]), q, sc.set(0.09 * t[3], 0.26 * t[3], 0.09 * t[3])));
    });
    tuftMesh.receiveShadow = true;
    base.add(tuftMesh);
    var self = this;
    tufts.forEach(function (t, k) { self.addBrush(tuftMesh, k, t[0], t[2], 0.45); });
    var flowers = new T.Group(), mats = [this.mat('flag', 1), this.mat('balloon', 3), this.mat('plaster', 0), this.mat('flag', 0)];
    blooms.forEach(function (list, bi) {
      if (!list.length) return;
      var im = new T.InstancedMesh(this.geo.ball, mats[bi], list.length);
      list.forEach(function (b, k) { im.setMatrixAt(k, m4.compose(v.set(b[0], b[1] + 0.16, b[2]), q.identity(), sc.set(0.07, 0.06, 0.07))); this.addBrush(im, k, b[0], b[2], 0.45); }, this);
      flowers.add(im);
    }, this);
    base.add(flowers);
    this.flowers = flowers;
    flowers.visible = this.season !== 'winter';
  };

  // How far down the ski hill the snow reaches in each season (fraction of height left bare below it).
  var SKI_SNOWLINE = { winter: 0, spring: 0.42, fall: 0.55, summer: 0.84 };
  // Snow cap for the season: everything above the snow line, a hair outside the slope.
  Town.prototype.refreshSki = function () {
    if (!this.skiGroup) return;
    this.colorSki();
    if (this.st && this.st.snow) this.st.snow.runs.forEach(function (run) { this.layRun(run); }, this);
    this.needsRender = true;
  };
  // Lamp spots every few tiles along a path, alternating sides.
  function lampPoints(pts, every, off, from) {
    var out = [];
    for (var i = Math.floor(every / 2); i < pts.length; i += every) {
      if (i < (from || 0)) continue;
      var a = pts[Math.max(0, i - 1)], b = pts[Math.min(pts.length - 1, i + 1)];
      var dx = b.x - a.x, dz = b.z - a.z, l = Math.hypot(dx, dz) || 1, side = (i / every) % 2 ? 1 : -1;
      var x = pts[i].x - dz / l * off * side, z = pts[i].z + dx / l * off * side;
      if (riverDist(x, z) < RIVER_HALF + 0.8) continue;
      out.push({ x: x, z: z, i: i });
    }
    return out;
  }
  Town.prototype.lamp = function (x, z, parent) {
    var g = new T.Group();
    g.position.set(x, groundY(x, z), z);
    var post = new T.Mesh(this.geo.cyl6, this.mat('stoneDark')); post.scale.set(0.05, 1.5, 0.05); post.position.y = 0.75;
    var cap = new T.Mesh(this.geo.cone4, this.mat('stoneDark')); cap.scale.set(0.16, 0.12, 0.16); cap.position.y = 1.72;
    var glass = new T.Mesh(this.geo.box, this.mat('lantern')); glass.scale.set(0.16, 0.18, 0.16); glass.position.y = 1.57;
    [post, cap, glass].forEach(function (m) { m.castShadow = true; g.add(m); });
    parent.add(g);
    return g;
  };
  // Lays road tiles that follow the ground. Steep stretches become stone steps; over the river the
  // road becomes a stone bridge with railings.
  Town.prototype.layTiles = function (tiles, matName, w, parent) {
    if (!tiles.length) return null;
    var self = this, sets = {}, prevY = null, prev = null;
    function add(key, x, y, z, rot, sx, sy, sz) { (sets[key] = sets[key] || []).push([x, y, z, rot, sx, sy, sz]); }
    tiles.forEach(function (t, i) {
      var rd = riverDist(t.x, t.z), y = surfaceY(t.x, t.z), gap = prev ? Math.hypot(t.x - prev.x, t.z - prev.z) : 1;
      if (gap > 1.2) prevY = null;
      if (rd < RIVER_HALF + 1.1) {
        add('stone2', t.x, y - 0.12, t.z, t.rot, 0.62, 0.26, w + 0.5);
        if (i % 2 === 0) [-1, 1].forEach(function (sd) {
          add('stoneDark', t.x + Math.sin(t.rot) * sd * (w / 2 + 0.2), y + 0.22, t.z + Math.cos(t.rot) * sd * (w / 2 + 0.2), t.rot, 0.62, 0.42, 0.12);
        });
      } else if (prevY != null && Math.abs(y - prevY) / Math.max(0.3, gap) > 0.3) {
        var q = Math.round(y / 0.2) * 0.2;
        add('stone1', t.x, q - 0.12, t.z, t.rot, 0.6, 0.34, w);
      } else {
        add(matName, t.x, y + 0.03, t.z, t.rot, 0.62, 0.06, w + (i % 3) * 0.08);
      }
      prevY = y; prev = t;
    });
    var group = new T.Group(), up = new T.Vector3(0, 1, 0);
    Object.keys(sets).forEach(function (key) {
      var list = sets[key], mat = key === 'stone1' ? self.mat('stone', 1) : key === 'stone2' ? self.mat('stone', 2) : self.mat(key);
      if (self.soft) {
        list.forEach(function (v, i) { if (i % 2 && key === matName) return; var m = new T.Mesh(self.geo.box, mat); m.position.set(v[0], v[1], v[2]); m.rotation.y = v[3]; m.scale.set(key === matName ? 1.1 : v[4], v[5], v[6]); group.add(m); });
        return;
      }
      var mesh = new T.InstancedMesh(self.geo.box, mat, list.length), m4 = new T.Matrix4(), qq = new T.Quaternion(), sc = new T.Vector3(), pp = new T.Vector3();
      list.forEach(function (v, i) { pp.set(v[0], v[1], v[2]); qq.setFromAxisAngle(up, v[3]); sc.set(v[4], v[5], v[6]); mesh.setMatrixAt(i, m4.compose(pp, qq, sc)); });
      mesh.receiveShadow = true; mesh.castShadow = key !== matName;
      group.add(mesh);
    });
    parent.add(group);
    return group;
  };
  // Village streets grow as houses go up: a street reaches just past its furthest house, and a
  // side lane first needs its parent street to reach the junction.
  var STREET_PARENT = STREETS.map(function (st, si) {
    if (!si) return null;
    var best = null, bd = 1e9;
    for (var j = 0; j < si; j++) STREETS[j].forEach(function (q, k) { var d = Math.hypot(q.x - st[0].x, q.z - st[0].z); if (d < bd) { bd = d; best = { j: j, k: k }; } });
    return bd < 3 ? best : null;
  });
  Town.prototype.growStreet = function (si, upto, delay) {
    var S = this.st.streets, cur = S[si] || 0, st = STREETS[si];
    upto = Math.min(st.length, upto);
    if (upto <= cur) return;
    var par = STREET_PARENT[si];
    if (par && !cur) this.growStreet(par.j, par.k + 2, delay);
    var g = new T.Group();
    this.layTiles(st.slice(cur, upto), 'cobble', 1.4, g);
    lampPoints(st, 9, 1.3, cur).forEach(function (l, li) {
      if (l.i >= upto) return;
      this.lamp(l.x, l.z, g);
      // A garbage can out by every other lamp.
      if (li % 2 === 0) { var a = st[Math.min(st.length - 1, l.i + 1)], b = st[Math.max(0, l.i - 1)], tl = Math.hypot(a.x - b.x, a.z - b.z) || 1; this.addCan(l.x + (a.x - b.x) / tl * 0.45, l.z + (a.z - b.z) / tl * 0.45, l.i); }
    }, this);
    this.world.add(g);
    if (!this.instant) { g.position.y = 4; this.anims.push({ obj: g, start: performance.now() + (delay || 0), dur: 600, from: 4, to: 0, kind: 'slide' }); }
    S[si] = upto;
  };
  // A short path from a front door to the street.
  Town.prototype.driveway = function (p, delay) {
    var st = STREETS[p.si][p.ti], fx = Math.sin(p.face), fz = Math.cos(p.face);
    var door = { x: p.x + fx * 1.1, z: p.z + fz * 1.1 }, dx = st.x - door.x, dz = st.z - door.z, len = Math.hypot(dx, dz) - 0.7;
    var n = Math.max(1, Math.round(len / 0.5)), rot = -Math.atan2(dz, dx), tiles = [];
    for (var i = 0; i < n; i++) tiles.push({ x: door.x + dx * (i + 0.5) / (n + 1.4), z: door.z + dz * (i + 0.5) / (n + 1.4), rot: rot });
    var g = new T.Group();
    this.layTiles(tiles, 'path', 0.7, g);
    this.world.add(g);
    if (!this.instant) { g.position.y = 3; this.anims.push({ obj: g, start: performance.now() + (delay || 0), dur: 500, from: 3, to: 0, kind: 'slide' }); }
  };

  // The snowboard mountain: a jagged heightfield with spruce on its flanks; runs are carved in
  // by snowboard days. Its surface never dips below the surrounding ground.
  var SKI_SPAN = 28, SKI_N = 84;
  Town.prototype.skiBase = function () { return groundY(SNOW.c.x, SNOW.c.z) - 0.2; };
  Town.prototype.skiY = function (x, z) {
    var base = this.skiBase();
    return Math.max(skiH(x, z, this.skiSats || [0, 0]), groundY(SNOW.c.x + x, SNOW.c.z + z) - base - 0.08);
  };
  Town.prototype.buildSnowMountain = function (base) {
    var c = SNOW.c, g = new T.Group();
    g.position.set(c.x, this.skiBase(), c.z);
    this.skiSats = [0, 0];
    var geo = new T.PlaneGeometry(SKI_SPAN * 2, SKI_SPAN * 2, SKI_N, SKI_N).rotateX(-Math.PI / 2);
    geo.setAttribute('color', new T.BufferAttribute(new Float32Array(geo.attributes.position.count * 3), 3));
    var mtn = new T.Mesh(geo, this.mat('peak'));
    mtn.castShadow = mtn.receiveShadow = true; mtn.userData.pick = 'snow';
    g.add(mtn);
    this.snowMtn = mtn;
    this.skiGroup = g;
    this.skiTrees = new T.Group();
    g.add(this.skiTrees);
    base.add(g);
    this.snowGroup = g;
    this.shapeSki();
  };
  // Re-shapes the mountain for the current satellite peaks, replants its trees and re-lays runs.
  Town.prototype.shapeSki = function () {
    var geo = this.snowMtn.geometry, pos = geo.attributes.position, self = this;
    for (var i = 0; i < pos.count; i++) pos.setY(i, this.skiY(pos.getX(i), pos.getZ(i)));
    pos.needsUpdate = true;
    geo.computeVertexNormals();
    geo.computeBoundingSphere();
    // Trees on the lower flanks, kept off every run corridor.
    var tg = this.skiTrees;
    while (tg.children.length) tg.remove(tg.children[0]);
    var r = rng(616), sats = this.skiSats;
    function onRun(x, z) {
      var d = Math.hypot(x, z), a = Math.atan2(z, x), rel = Math.atan2(Math.sin(a - SNOW_FACE), Math.cos(a - SNOW_FACE));
      if (d < SNOW.R && (Math.abs(rel) < 0.95 || Math.abs(rel) > Math.PI - 0.75 || (d < SNOW.R * 0.62 && Math.abs(Math.abs(rel) - 1.35) < 0.35))) return true;
      return SKI_SATS.some(function (sp, k) {
        if (!sats[k]) return false;
        var dx = x - sp.x, dz = z - sp.z, a2 = Math.atan2(dz, dx);
        return Math.hypot(dx, dz) < sp.R && Math.abs(Math.atan2(Math.sin(a2 - sp.a), Math.cos(a2 - sp.a))) < 0.75;
      });
    }
    for (i = 0; i < 160; i++) {
      var a = r() * Math.PI * 2, d2 = r() * 25, tx = Math.cos(a) * d2, tz = Math.sin(a) * d2, k = 0.6 + r() * 0.5;
      var hh = skiH(tx, tz, sats);
      if (hh < 0.4 || hh > SNOW.H * 0.55 || onRun(tx, tz)) continue;
      var tree = new T.Mesh(this.geo.cone6, this.mat('pine', i));
      tree.scale.set(0.55 * k, 1.5 * k, 0.55 * k);
      tree.position.set(tx, this.skiY(tx, tz) + 0.6 * k, tz);
      tree.castShadow = true;
      tg.add(tree);
    }
    this.colorSki();
    if (this.st && this.st.snow) this.st.snow.runs.forEach(function (run) {
      run.pts.forEach(function (p) { p.y = self.skiY(p.x, p.z) + 0.12; });
      if (run.post) run.post.forEach(function (m) { m.position.y = run.pts[0].y + m.userData.dy; });
      self.layRun(run);
    });
    this.needsRender = true;
  };
  // Grass low down, rock on the steep and high faces, snow above the season's snow line.
  Town.prototype.colorSki = function () {
    if (!this.snowMtn) return;
    var geo = this.snowMtn.geometry, pos = geo.attributes.position, nrm = geo.attributes.normal, col = geo.attributes.color, p = this.palette;
    var grass = new T.Color(p.skigrass), rock = new T.Color(p.rock), snow = new T.Color(p.skisnow), c = new T.Color();
    var line = SKI_SNOWLINE[this.season] * SNOW.H, sats = this.skiSats || [0, 0];
    for (var i = 0; i < pos.count; i++) {
      var x = pos.getX(i), z = pos.getZ(i), y = pos.getY(i), hh = skiH(x, z, sats), slope = 1 - nrm.getY(i);
      if (hh <= 0.05) c.copy(grass);
      else if (y >= line) c.copy(snow).lerp(rock, slope > 0.55 ? 0.6 : 0);
      else c.copy(grass).lerp(rock, Math.min(1, Math.max(0, (y / SNOW.H - 0.25) * 1.6 + slope * 0.9)));
      col.setXYZ(i, c.r, c.g, c.b);
    }
    col.needsUpdate = true;
    this.needsRender = true;
  };
  Town.prototype.setSkiSats = function (a, b) {
    if (this.skiSats && this.skiSats[0] === a && this.skiSats[1] === b) return;
    this.skiSats = [a, b];
    this.shapeSki();
  };

  // Weather comes and goes: each spell lasts 25-50 seconds and is picked by season. Fall brings
  // falling leaves and the odd snow flurry, winter mostly snow, spring sometimes blossom.
  var WEATHER = {
    snow: { colors: ['#ffffff', '#eef4fb'], size: 4, count: 420, fall: 2.6, sway: 0.6, label: 'snowing' },
    leaves: { colors: ['#e07a2a', '#c8442a', '#e9b33a', '#9a5a22'], size: 6, count: 180, fall: 1.5, sway: 1.9, label: 'leaves falling' },
    petals: { colors: ['#f6bcd0', '#ffffff', '#f3a0bd'], size: 5, count: 150, fall: 1.3, sway: 1.4, label: 'blossom in the air' },
    rain: { colors: ['#9ab8d8', '#c4d8ec'], size: 3, count: 420, fall: 15, sway: 0.05, label: 'raining' }
  };
  // The page can pin the weather (to what Whitehorse has right now); null clears the sky,
  // undefined goes back to the seasonal mix.
  Town.prototype.lockWeather = function (kind, label) {
    this.weatherLock = kind;
    this.weatherLabel = label;
    if (kind !== undefined) { this.setWeather(kind); this.weatherClock = 1e9; }
    else this.weatherClock = 0;
  };
  var WEATHER_ODDS = {
    winter: [['snow', 0.7]], fall: [['leaves', 0.58], ['snow', 0.14]],
    spring: [['petals', 0.4]], summer: [['leaves', 0.06]]
  };
  Town.prototype.buildWeather = function () {
    var n = 420, pos = new Float32Array(n * 3), col = new Float32Array(n * 3), r = rng(3);
    this.flakes = [];
    for (var i = 0; i < n; i++) {
      var a = r() * Math.PI * 2, d = Math.sqrt(r()) * 70;
      this.flakes.push({ x: Math.cos(a) * d, z: Math.sin(a) * d, y: r() * 26, ph: r() * 6.28, sp: 0.6 + r() * 0.8, pick: r() });
    }
    var g = new T.BufferGeometry();
    g.setAttribute('position', new T.BufferAttribute(pos, 3));
    g.setAttribute('color', new T.BufferAttribute(col, 3));
    this.weatherMat = new T.PointsMaterial({ size: 4, sizeAttenuation: false, transparent: true, opacity: 0.92, depthWrite: false, vertexColors: true });
    this.weather = new T.Points(g, this.weatherMat);
    this.weather.frustumCulled = false;
    this.weather.visible = false;
    this.scene.add(this.weather);
    this.weatherNow = null; this.weatherShown = 0; this.weatherClock = 0;
  };
  Town.prototype.pickWeather = function () {
    var roll = Math.random(), acc = 0, next = null;
    (WEATHER_ODDS[this.season] || []).some(function (o) { acc += o[1]; if (roll < acc) { next = o[0]; return true; } return false; });
    // On first load, show the season's most likely weather.
    if (this.weatherNow === null && !this.weatherStarted && WEATHER_ODDS[this.season].length && WEATHER_ODDS[this.season][0][1] >= 0.4) next = WEATHER_ODDS[this.season][0][0];
    this.weatherStarted = true;
    this.setWeather(next);
    this.weatherClock = 25 + Math.random() * 25;
  };
  Town.prototype.setWeather = function (kind) {
    if (kind === undefined) return;
    this.weatherNow = kind;
    var w = WEATHER[kind];
    if (w) {
      var cols = this.weather.geometry.attributes.color, c = new T.Color();
      for (var i = 0; i < this.flakes.length; i++) { c.set(w.colors[Math.floor(this.flakes[i].pick * w.colors.length)]); cols.setXYZ(i, c.r, c.g, c.b); }
      cols.needsUpdate = true;
      this.weatherMat.size = w.size;
    }
    if (this.onWeather) this.onWeather(this.weatherLock !== undefined && this.weatherLabel ? this.weatherLabel : w ? w.label : 'clear');
    this.needsRender = true;
  };
  // Motion off freezes the ambient animation (walkers, weather, the slow spin); builds still play.
  Town.prototype.setMotion = function (on) {
    this.reduced = !on;
    this.controls.autoRotate = on && !this.soft;
    this.needsRender = true;
  };
  Town.prototype.stepWeather = function (dt, now) {
    if (this.reduced || this.soft) return;
    this.weatherClock -= dt;
    if (this.weatherClock <= 0) this.pickWeather();
    var w = WEATHER[this.weatherNow], target = w ? w.count : 0;
    // Ease in and out over a few seconds.
    this.weatherShown += (target - this.weatherShown) * Math.min(1, dt * 0.6);
    var shown = Math.round(this.weatherShown);
    this.weather.visible = shown > 2;
    if (!this.weather.visible) return;
    var spec = w || this.lastWeather || WEATHER.snow;
    if (w) this.lastWeather = w;
    this.weather.geometry.setDrawRange(0, shown);
    var pos = this.weather.geometry.attributes.position, sec = now / 1000;
    for (var i = 0; i < shown; i++) {
      var fl = this.flakes[i];
      var y = 26 - ((fl.y + sec * spec.fall * fl.sp) % 26);
      pos.setXYZ(i, fl.x + Math.sin(sec * 0.8 + fl.ph) * spec.sway, y, fl.z + Math.cos(sec * 0.6 + fl.ph) * spec.sway * 0.6);
    }
    pos.needsUpdate = true;
  };

  // Clears everything workouts built and lays out empty plots.
  Town.prototype.reset = function () {
    if (this.world) this.scene.remove(this.world);
    this.anims = [];
    this.world = new T.Group();
    this.scene.add(this.world);
    this.picks = [];
    this.st = {
      towers: {}, walls: null, lifts: 0, castle: {},
      forest: { trees: [], runs: 0, km: 0, kinds: {} },
      bike: { km: 0, sessions: 0, balloons: [], crops: [], fields: [], barns: [], longest: 0 }, sheep: { list: [], pen: null },
      dogs: { pen: null, list: {}, order: [], hurdle: false }, streets: {}, castles: [],
      snow: { days: 0, laps: 0, runs: [], lift: null, lodge: null, seasons: {}, best: 0, floors: 0 },
      row: { km: 0, sessions: 0, pond: null, boats: [], dock: false },
      swim: { km: 0, sessions: 0, n: 0, group: null }, nordic: { km: 0, sessions: 0, n: 0, group: null }, mtb: { km: 0, rides: 0, n: 0, group: null },
      hike: { units: 0, km: 0, sessions: 0, elev: 0, peaks: [] }, stairs: { n: 0 },
      walk: { stones: 0, km: 0, sessions: 0 },
      commute: { n: 0, km: 0, bikes: 0, floors: 0, office: null, roof: null }, social: 0,
      sports: {}, sportOrder: [], farm: { crops: [] }, friends: {}, friendOrder: [],
      pub: null, barrels: 0, drinks: 0, prs: 0, tonnage: 0, sessions: 0, last: {}, best: {}, bible: { read: {}, chapters: 0, books: [], group: null }, library: { books: [], pages: 0, group: null, sign: null }, cinema: { films: [], group: null }, critters: {}, secrets: {}, secretPos: {}, secretObjs: {}, streak: 0,
      weight: { first: null, latest: null, statue: null, count: 0 },
      wild: { list: [], have: {} }
    };
    var self = this;
    // The keep: one central tower plus six around it, each starting as a bare foundation.
    this.st.towers = this.makeTowers(this.world, '');
    if (this.skiSats && (this.skiSats[0] || this.skiSats[1])) this.setSkiSats(0, 0);
    // A signpost holds the hockey rink's spot until the first game.
    var sign = new T.Group(), hy = groundY(HOCKEY.x, HOCKEY.z);
    sign.position.set(HOCKEY.x, hy, HOCKEY.z);
    sign.rotation.y = -(132 - 90) * D2R;
    this.part(sign, this.geo.cyl6, this.mat('wood'), 0.06, 1.2, 0.06, 0, 0.6, -1.4, 'rink');
    this.part(sign, this.geo.box, this.mat('woodLight'), 0.9, 0.45, 0.06, 0, 1.1, -1.38, 'rink');
    [[0, 1.02, 3.4, 0.08], [0, -1.02, 3.4, 0.08], [1.72, 0, 0.08, 2.1], [-1.72, 0, 0.08, 2.1]].forEach(function (b, i) {
      for (var k = 0; k < 6; k++) { var t = (k + 0.5) / 6 - 0.5; this.part(sign, this.geo.box, this.mat('woodLight'), 0.08, 0.3, 0.08, b[2] > 1 ? b[0] + t * b[2] : b[0], 0.15, b[3] > 1 ? b[1] + t * b[3] : b[1], 'rink'); }
    }, this);
    this.world.add(sign);
    this.st.rinkSign = sign;
    this.st.library.sign = this.librarySign();
    this.decorDirty = true; this.decor = [];
    if (this.greenGazebo) this.greenGazebo.visible = true;
    this.restoreDecor();
    this.batchMeshes = []; this.batchDirty = false;
    this.wallsDirty = true;
  };
  // Material by role, so a castle's style can swap in its own stone, roofs and banners.
  Town.prototype.smat = function (style, role, i) {
    var name = style && style.mats[role];
    return this.mat(name || role, i);
  };
  // Tower caps for each style, built for a radius-1 tower and scaled with it.
  Town.prototype.styleCap = function (cap, style, r, ti, pick) {
    var self = this, g = new T.Group();
    function P(geo, mat, sx, sy, sz, x, y, z) { return self.part(g, geo, mat, sx, sy, sz, x, y, z, pick); }
    var roof = this.smat(style, 'roof', ti);
    if (style.cap === 'spire') {
      P(this.geo.cyl, this.smat(style, 'stoneDark'), 1.12, 0.12, 1.12, 0, 0.06, 0);
      P(this.geo.cone, roof, 1.1, 2.8, 1.1, 0, 1.5, 0);
      P(this.geo.ball, this.smat(style, 'accent'), 0.12, 0.12, 0.12, 0, 2.95, 0);
    } else if (style.cap === 'thatch') {
      P(this.geo.cyl6, this.smat(style, 'stoneDark'), 1.1, 0.25, 1.1, 0, 0.12, 0);
      P(this.geo.cone6, roof, 1.5, 1.3, 1.5, 0, 0.88, 0);
      P(this.geo.cyl6, this.mat('wood'), 0.06, 0.6, 0.06, 0, 1.7, 0);
    } else if (style.cap === 'crown') {
      P(this.geo.cyl, this.smat(style, 'stoneDark'), 1.18, 0.2, 1.18, 0, 0.1, 0);
      for (var i = 0; i < 8; i++) {
        var a = i / 8 * Math.PI * 2;
        P(this.geo.box, roof, 0.38, 0.42, 0.3, Math.cos(a) * 1.0, 0.4, Math.sin(a) * 1.0).rotation.y = -a;
      }
      P(this.geo.cyl, roof, 0.55, 0.5, 0.55, 0, 0.45, 0);
    } else {
      P(this.geo.cyl, this.smat(style, 'stoneDark'), 1.08, 0.12, 1.08, 0, 0.06, 0);
      P(this.geo.ball, roof, 1.05, 1.15, 1.05, 0, 0.75, 0);
      P(this.geo.cone, roof, 0.35, 1.1, 0.35, 0, 2.0, 0);
      P(this.geo.ball, this.smat(style, 'accent'), 0.1, 0.1, 0.1, 0, 2.6, 0);
    }
    g.scale.set(r, 1, r);
    return g;
  };
  Town.prototype.makeTowers = function (parent, tag, style) {
    var self = this, towers = {};
    TOWERS.concat([{ key: 'full', name: 'The Keep (full body)', angle: null }]).forEach(function (t, ti) {
      var p = t.angle == null ? { x: 0, z: 0 } : polar(t.angle, 3.6);
      var r = t.angle == null ? 1.45 : 1.0, pick = 'tower:' + t.key + tag;
      var g = new T.Group();
      g.position.set(p.x, 0, p.z);
      parent.add(g);
      self.part(g, self.geo.cyl, self.smat(style, 'stoneDark'), r * 1.18, 0.14, r * 1.18, 0, 0.07, 0, pick);
      var roof = new T.Group();
      g.add(roof);
      var cone = null, cap = null;
      if (style) { cap = self.styleCap(null, style, r, ti, pick); roof.add(cap); }
      else cone = self.part(roof, self.geo.cone, self.mat('roof', ti), r * 1.3, 1.5, r * 1.3, 0, 0.75, 0, pick);
      // One pennant on the spire, flown only when the latest session set a PR.
      var flag = new T.Group();
      // Hover the pennant to see which lifts set the PR.
      self.part(flag, self.geo.cyl, self.mat('wood'), 0.06, 1.3, 0.06, 0, 0.65, 0, 'prflag:' + t.key + tag);
      self.part(flag, self.geo.flag, self.mat('flag', 0), 2.2, 2.2, 2.2, 0, 1.3, 0, 'prflag:' + t.key + tag);
      var hitbox = new T.Mesh(self.geo.box, self.hitMat || (self.hitMat = new T.MeshBasicMaterial({ visible: false })));
      hitbox.scale.set(1.3, 1.0, 1.3); hitbox.position.set(0.4, 1.0, 0); hitbox.userData.pick = 'prflag:' + t.key + tag; flag.add(hitbox); self.picks.push(hitbox);
      flag.position.y = style ? style.flagY : 1.4; flag.visible = false;
      roof.add(flag);
      roof.position.y = 0.14; roof.visible = false;
      var out = t.angle == null ? GATE_ANGLE * D2R : t.angle * D2R;
      towers[t.key] = { def: t, group: g, r: r, n: 0, prs: 0, roof: roof, cone: cone, cap: cap, style: style, flag: flag, flying: false, p: p, out: { x: Math.cos(out), z: -Math.sin(out) }, features: [], pick: pick };
    });
    return towers;
  };
  // A new castle on its hill: the seven towers in that castle's style, and a road back home.
  // Its walls, gate and everything else are milestones of its own.
  var CASTLE_NAMES = ['', 'The Hill Citadel', 'The Western Hold', 'The Eastern Keep', 'The Southern Watch'];
  var CASTLE_STYLES = [null,
    { key: 'cit', cap: 'spire', flagY: 2.9, vibe: 'A white city of spires and terraces.',
      mats: { stone: 'citStone', stoneDark: 'citDark', roof: 'citRoof', accent: 'citAccent', banner: 'citBanner', plaster: 'citStone' },
      milestones: [[12, 'wall', 'White curtain wall'], [30, 'gate', 'Great silver gate'], [55, 'terrace', 'Tiered terraces'], [85, 'tree', 'The White Tree'],
        [120, 'beacon', 'Beacon tower'], [165, 'silver', 'Silver spires'], [220, 'banners', 'Banners of the Citadel']] },
    { key: 'hold', cap: 'thatch', flagY: 1.9, vibe: 'A horse-lords’ hold of timber and golden thatch.',
      mats: { stone: 'holdStone', stoneDark: 'holdDark', roof: 'holdRoof', accent: 'holdAccent', banner: 'holdBanner', plaster: 'holdStone' },
      milestones: [[12, 'wall', 'Timber palisade'], [30, 'gate', 'Carved oak gate'], [55, 'stables', 'Stables and paddock'], [85, 'hall', 'Golden mead hall'],
        [120, 'beacon', 'Hilltop beacon'], [165, 'banners', 'Green horse banners'], [220, 'gold', 'Gilded hall roof']] },
    { key: 'keep', cap: 'crown', flagY: 0.6, vibe: 'A dwarven stronghold of dark granite and gold.',
      mats: { stone: 'keepStone', stoneDark: 'keepDark', roof: 'keepRoof', accent: 'keepAccent', banner: 'keepBanner', plaster: 'keepStone' },
      milestones: [[12, 'wall', 'Granite rampart'], [30, 'gate', 'Great stone door'], [55, 'kings', 'Statues of the kings'], [85, 'forge', 'The forge'],
        [120, 'braziers', 'Rune braziers'], [165, 'mine', 'Mine entrance'], [220, 'gold', 'Gilded crowns']] },
    { key: 'elf', cap: 'onion', flagY: 2.7, vibe: 'An elven refuge of arches, water and lanterns.',
      mats: { stone: 'elfStone', stoneDark: 'elfDark', roof: 'elfRoof', accent: 'elfAccent', banner: 'elfBanner', plaster: 'elfStone' },
      milestones: [[12, 'wall', 'Elven wall'], [30, 'gate', 'Moon gate'], [55, 'falls', 'Waterfall pool'], [85, 'gardens', 'Hanging gardens'],
        [120, 'lanterns', 'Lantern trees'], [165, 'pavilion', 'Moonlit pavilion'], [220, 'leafgold', 'Golden-leaf domes']] }
  ];
  Town.prototype.ensureCastle = function (ci, delay) {
    var C = this.st.castles[ci];
    if (C) return C;
    var site = CASTLE_SITES[ci], g = new T.Group(), y = groundY(site.x, site.z), style = CASTLE_STYLES[ci];
    g.position.set(site.x, y, site.z);
    this.world.add(g);
    var gate = angleOf(-site.x, -site.z);
    C = this.st.castles[ci] = { ci: ci, site: site, group: g, style: style, gate: gate, lifts: 0, done: {}, towers: this.makeTowers(g, ':' + ci, style), name: CASTLE_NAMES[ci] };
    // The road home, from the ring road to this castle's gate.
    this.layPath({ kind: 'road', pts: CASTLE_ROADS[ci] }, delay);
    this.pop(g, delay);
    return C;
  };
  Town.prototype.animDrop = function (obj, toY, delay, dur) {
    if (this.instant) { obj.position.y = toY; obj.visible = true; return; }
    obj.visible = false;
    this.anims.push({ obj: obj, start: performance.now() + delay, dur: dur || 650, from: toY + 16, to: toY, kind: 'y' });
  };
  Town.prototype.animTo = function (obj, toY, delay) {
    if (this.instant) { obj.position.y = toY; return; }
    this.anims.push({ obj: obj, start: performance.now() + delay, dur: 380, from: null, to: toY, kind: 'slide' });
  };
  Town.prototype.animScale = function (obj, to, delay) {
    if (this.instant) { obj.scale.setScalar(to); return; }
    this.anims.push({ obj: obj, start: performance.now() + delay, dur: 700, from: null, to: to, kind: 'scale' });
  };
  Town.prototype.animScaleVec = function (obj, to, delay) {
    if (this.instant) { obj.scale.copy(to); return; }
    this.anims.push({ obj: obj, start: performance.now() + delay, dur: 900, from: null, to: to, kind: 'vec' });
  };
  Town.prototype.pop = function (obj, delay) {
    if (this.instant) return;
    obj.scale.setScalar(0.01);
    this.animScale(obj, 1, delay);
  };

  // ---- castle ---------------------------------------------------------

  Town.prototype.tierRadius = function (tw, n) { return tw.r * Math.max(0.5, 1 - 0.08 * Math.floor(n / TAPER)); };
  Town.prototype.towerTop = function (tw) { return 0.14 + tw.n * COURSE_H; };

  // A tower can only get so far ahead of the castle as a whole: the limit rises by one layer for
  // every MAIN_CAP_EVERY lifting sessions. Sessions past it build the outer bailey instead: halls and turrets on
  // either side of that tower, inner row first, then the outer row. When its bailey is complete,
  // the tower goes back to rising.
  Town.prototype.towerCap = function () { return 8 + Math.floor(this.st.lifts / MAIN_CAP_EVERY); };
  Town.prototype.liftSession = function (key, delay) {
    var tw = this.liftSessionInner(key, delay), site = tw.castle ? tw.castle.site : null;
    // The raccoon roams round whichever castle the latest session built on.
    if (site) this.placeCritter('raccoon', site.x, site.z, 14.2, 16.5);
    else this.placeCritter('raccoon', 0, 0, 15.2, 17.5);
    return tw;
  };
  // The first castle's halls and turrets go up CASTLE_PACE.mainBailey pieces per session.
  Town.prototype.mainBailey = function (key, delay) {
    var did = 0;
    while (did < CASTLE_PACE.mainBailey && this.baileyStep(key, delay + did * 250)) did++;
    return did > 0;
  };
  Town.prototype.liftSessionInner = function (key, delay) {
    var tw = this.st.towers[key];
    if (tw.n < MAX_LAYERS) {
      if (key !== 'full' && tw.n >= this.towerCap() && this.mainBailey(key, delay)) return tw;
      this.addCourse(key, delay);
      return tw;
    }
    // At full height: finish the bailey first, then build in the next castle with room.
    if (key !== 'full' && this.mainBailey(key, delay)) return tw;
    function open(tw) { return tw.n < MAX_LAYERS || !tw.bailey || tw.bailey.done < tw.bailey.plan.length; }
    for (var ci = 1; ci < CASTLE_SITES.length; ci++) {
      var C = this.ensureCastle(ci, delay), t2 = C.towers[key], k2 = key, did = 0;
      // The castles on the hills go up faster than the first: each session builds several pieces.
      for (var step = 0; step < CASTLE_PACE.steps; step++) {
        // A new castle rises evenly: the session's own tower first, unless another is lagging
        // well behind; later pieces go to whichever unfinished tower is lowest.
        var pickK = step || !open(C.towers[key]) ? null : key;
        for (var k in C.towers) {
          if (k === 'full' || !open(C.towers[k])) continue;
          if (!pickK || C.towers[k].n < C.towers[pickK].n - (step ? 0 : 4)) pickK = k;
        }
        if (!pickK) break;
        k2 = pickK; t2 = C.towers[k2];
        // Like the first castle, towers can't race ahead: past the limit, sessions build the bailey.
        var built = t2.n >= Math.min(MAX_LAYERS, 8 + Math.floor(C.lifts / CASTLE_PACE.capEvery)) && this.baileyStep(k2, delay + step * 250, C);
        if (!built && t2.n < MAX_LAYERS) { this.addCourse(k2, delay + step * 250, t2, C); built = true; }
        if (!built) break;
        did++; t2.castle = C;
      }
      if (did) { C.lifts++; this.styleMilestones(C, delay); return t2; }
    }
    // Every castle's tower is full: the session is still counted, but nothing grows taller.
    t2.over = (t2.over || 0) + 1;
    return t2;
  };
  function baileyPlan(def, gateAngle) {
    var steps = [];
    [0, 1].forEach(function (row) {
      var R = row ? 11.3 : 9.3, start = 7 + row * 2;
      [-1, 1].forEach(function (side) {
        var limit = 27;
        // Leave the gate road clear.
        var toGate = ((gateAngle - def.angle) * side % 360 + 540) % 360 - 180; // degrees to the gate, going this way
        if (toGate > 0 && toGate < limit + 10) limit = toGate - 10;
        var nb = Math.max(0, Math.floor((limit - start - 4) / 6.5));
        if (nb < 1) return;
        for (var i = 0; i < nb; i++) steps.push({ type: 'block', row: row, side: side, i: i, nb: nb, R: R, a: def.angle + side * (start + i * 6.5 + 3.25), mid: def.angle + side * (start + nb * 6.5 / 2) });
        var ta = def.angle + side * (start + nb * 6.5 + 2.4);
        for (var c = 0; c < 8; c++) steps.push({ type: 'turret', row: row, side: side, c: c, R: R, a: ta });
      });
    });
    // Then every hall gains an upper storey, block by block.
    steps.filter(function (st) { return st.type === 'block'; }).forEach(function (st) {
      steps.push({ type: 'upper', row: st.row, side: st.side, i: st.i, nb: st.nb, R: st.R, a: st.a, mid: st.mid });
    });
    return steps;
  }
  Town.prototype.baileyStep = function (key, delay, C) {
    var tw = C ? C.towers[key] : this.st.towers[key], parent = C ? C.group : this.world, S = C ? C.style : null;
    tw.bailey = tw.bailey || { plan: baileyPlan(tw.def, C ? C.gate : GATE_ANGLE), done: 0, turrets: {}, roofs: {} };
    var B = tw.bailey, st = B.plan[B.done];
    if (!st) return false;
    B.done++;
    var pick = tw.pick || 'tower:' + key, a = st.a * D2R, self = this;
    if (st.type === 'block') {
      var len = 2 * st.R * Math.sin(3.25 * D2R) * 1.04, p = polar(st.a, st.R);
      var g = new T.Group();
      g.position.set(p.x, 0, p.z);
      g.rotation.y = a + Math.PI / 2;
      this.part(g, this.geo.box, this.smat(S, 'stone', (st.i + st.row) % 3), len, 1.3, 1.6, 0, 0.65, 0, pick);
      this.part(g, this.geo.box, this.mat('window'), 0.28, 0.4, 0.05, 0, 0.75, -0.81, pick);
      // A flower box under every window, and a door into every other bay.
      this.part(g, this.geo.box, this.mat('wood'), 0.36, 0.08, 0.1, 0, 0.5, -0.86, pick);
      for (var fb = 0; fb < 3; fb++) this.part(g, this.geo.ball, this.mat('flag', fb + st.i), 0.08, 0.08, 0.08, -0.1 + fb * 0.1, 0.57, -0.87, pick);
      if (st.i % 2 === 0) { this.part(g, this.geo.box, this.mat('wood'), 0.26, 0.5, 0.04, len * 0.3, 0.25, -0.81, pick); this.part(g, this.geo.ball, this.mat('lantern'), 0.06, 0.06, 0.06, len * 0.3 + 0.2, 0.62, -0.85, pick); }
      this.part(g, this.geo.box, this.smat(S, 'stoneDark'), len * 1.02, 0.1, 1.66, 0, 1.3, 0, pick);
      parent.add(g);
      this.animDrop(g, 0, delay);
      if (st.i === st.nb - 1) {
        // The hall is complete: put a roof over it.
        var mp = polar(st.mid, st.R), chord = 2 * st.R * Math.sin(st.nb * 6.5 / 2 * D2R);
        var roof = this.part(parent, this.geo.gable, this.smat(S, 'roof', TOWERS.indexOf(tw.def) + st.row + 2), 1.12, S && S.cap === 'crown' ? 0.4 : 0.85, chord / 1.5 + 0.1, mp.x, 0, mp.z, pick);
        roof.rotation.y = st.mid * D2R + Math.PI;
        this.animDrop(roof, 1.35, delay + 400);
        B.roofs[st.row + ':' + st.side] = roof;
      }
    } else if (st.type === 'upper') {
      var up = polar(st.a, st.R), ug = new T.Group();
      ug.position.set(up.x, 0, up.z);
      ug.rotation.y = a + Math.PI / 2;
      var ulen = 2 * st.R * Math.sin(3.25 * D2R) * 1.04;
      this.part(ug, this.geo.box, this.smat(S, 'plaster', st.i), ulen, 1.0, 1.5, 0, 0.5, 0, pick);
      this.part(ug, this.geo.box, this.mat('trunk'), 0.08, 1.0, 1.52, -ulen / 2 + 0.05, 0.5, 0, pick);
      this.part(ug, this.geo.box, this.mat('window'), 0.26, 0.34, 0.05, 0, 0.55, -0.76, pick);
      parent.add(ug);
      this.animDrop(ug, 1.4, delay);
      var hr = B.roofs[st.row + ':' + st.side];
      if (hr && st.i === 0) this.animTo(hr, 2.4, delay + (this.instant ? 0 : 300));
    } else {
      var tkey = st.row + ':' + st.side, t = B.turrets[tkey];
      if (!t) {
        var tp = polar(st.a, st.R);
        t = B.turrets[tkey] = { group: new T.Group(), n: 0 };
        t.group.position.set(tp.x, 0, tp.z);
        t.roof = new T.Group();
        if (S) t.roof.add(this.styleCap(null, S, 0.66, TOWERS.indexOf(tw.def), pick));
        else this.part(t.roof, this.geo.cone, this.mat('roof', TOWERS.indexOf(tw.def)), 0.85, 1.3, 0.85, 0, 0.65, 0, pick);
        t.group.add(t.roof);
        parent.add(t.group);
      }
      var c = this.part(t.group, this.geo.cyl, this.smat(S, 'stone', t.n % 3), 0.66, COURSE_H * 0.94, 0.66, 0, 0, 0, pick);
      this.animDrop(c, t.n * COURSE_H * 1.6 + COURSE_H * 0.8, delay);
      c.scale.y = COURSE_H * 1.55;
      t.n++;
      this.animTo(t.roof, t.n * COURSE_H * 1.6, delay + (this.instant ? 0 : 450));
    }
    this.st.baileyPieces = (this.st.baileyPieces || 0) + 1;
    return true;
  };

  Town.prototype.addCourse = function (key, delay, tw, castle) {
    tw = tw || this.st.towers[key];
    var pickKey = tw.pick || 'tower:' + key;
    var y = this.towerTop(tw);
    var r = this.tierRadius(tw, tw.n);
    var c = this.part(tw.group, this.geo.cyl, this.smat(tw.style, 'stone', tw.n % 3), r * (1 + ((tw.n * 37) % 5) * 0.012), COURSE_H * 0.94, r * (1 + ((tw.n * 37) % 5) * 0.012), 0, 0, 0, pickKey);
    c.rotation.y = tw.n * 0.7;
    tw.n++;
    this.animDrop(c, y + COURSE_H / 2, delay);
    if (tw.n % TIER === 0) this.towerFeature(tw, key, tw.n / TIER, y, r, delay + 300);
    tw.roof.visible = true;
    if (tw.cap) tw.cap.scale.set(r, 1, r); else tw.cone.scale.set(r * 1.3, 1.5, r * 1.3);
    this.animTo(tw.roof, this.towerTop(tw), delay + (this.instant ? 0 : 520));
    this.wallsDirty = true;
    this.fitDirty = true;
  };

  // Every 12 sessions a tower gains something: a balcony, a corbelled turret, a band of windows, a hanging banner.
  var FEATURE_NAMES = ['balcony', 'turret', 'windows', 'banner'];
  Town.prototype.towerFeature = function (tw, key, k, y, r, delay) {
    var kind = FEATURE_NAMES[(k - 1) % 4], g = new T.Group(), pick = tw.pick || 'tower:' + key, self = this, S = tw.style;
    var ox = tw.out.x, oz = tw.out.z;
    g.position.set(0, y, 0);
    if (kind === 'balcony') {
      this.part(g, this.geo.cyl, this.smat(S, 'stoneDark'), r * 1.32, 0.12, r * 1.32, 0, 0, 0, pick);
      for (var i = 0; i < 10; i++) {
        var a = i / 10 * Math.PI * 2;
        this.part(g, this.geo.box, this.smat(S, 'stone', 2), 0.16, 0.22, 0.16, Math.cos(a) * r * 1.24, 0.16, Math.sin(a) * r * 1.24, pick);
      }
    } else if (kind === 'turret') {
      var side = k % 8 < 4 ? 1 : -1;
      var tx = (ox * 0.6 - oz * 0.8 * side) * r * 1.15, tz = (oz * 0.6 + ox * 0.8 * side) * r * 1.15;
      this.part(g, this.geo.cone, this.smat(S, 'stone', 1), 0.42, 0.7, 0.42, tx, -0.35, tz, pick).rotation.x = Math.PI;
      this.part(g, this.geo.cyl, this.smat(S, 'stone', 0), 0.4, 1.4, 0.4, tx, 0.7, tz, pick);
      if (S) { var tc = this.styleCap(null, S, 0.4, k, pick); tc.position.set(tx, 1.4, tz); g.add(tc); }
      else this.part(g, this.geo.cone, this.mat('roof', k), 0.52, 0.9, 0.52, tx, 1.85, tz, pick);
    } else if (kind === 'windows') {
      for (i = 0; i < 4; i++) {
        a = i / 4 * Math.PI * 2 + 0.4;
        var w = this.part(g, this.geo.box, this.mat('window'), 0.18, 0.32, 0.06, Math.cos(a) * r * 1.0, 0.2, Math.sin(a) * r * 1.0, pick);
        w.rotation.y = -a + Math.PI / 2;
      }
    } else {
      var ban = this.part(g, this.geo.box, this.smat(S, 'banner', k), 0.5, 1.3, 0.04, ox * r * 1.03, -0.5, oz * r * 1.03, pick);
      ban.rotation.y = Math.atan2(ox, oz);
      this.part(g, this.geo.box, this.smat(S, 'accent'), 0.62, 0.06, 0.06, ox * r * 1.05, 0.16, oz * r * 1.05, pick).rotation.y = Math.atan2(ox, oz);
    }
    tw.group.add(g);
    tw.features.push(kind);
    this.pop(g, delay);
  };

  Town.prototype.setPrFlag = function (key, flying, delay, tw) {
    tw = tw || this.st.towers[key];
    tw.flying = flying;
    tw.flag.visible = flying;
    if (flying && !this.instant) { tw.flag.scale.setScalar(0.01); this.animScale(tw.flag, 1, delay + 700); }
  };

  Town.prototype.rebuildWalls = function () {
    var self = this;
    this.st.castles.forEach(function (C) {
      if (!C) return;
      if (C.walls) C.group.remove(C.walls);
      C.walls = self.wallsFor(C.towers, C.done.banners, C.style);
      C.group.add(C.walls);
    });
    if (this.st.walls) this.world.remove(this.st.walls);
    this.st.walls = this.wallsFor(this.st.towers, this.st.castle.banners);
    this.world.add(this.st.walls);
    this.needsRender = true;
  };
  Town.prototype.wallsFor = function (towers, banners, S) {
    var g = new T.Group(), self = this;
    TOWERS.forEach(function (t, i) {
      var a = towers[t.key], b = towers[TOWERS[(i + 1) % TOWERS.length].key];
      var h = Math.min(a.n, b.n) * COURSE_H * 0.55;
      if (h < 0.3) return;
      h = Math.min(h, 2.6);
      var dx = b.p.x - a.p.x, dz = b.p.z - a.p.z, len = Math.hypot(dx, dz) - 1.7;
      var mx = (a.p.x + b.p.x) / 2, mz = (a.p.z + b.p.z) / 2;
      var w = self.part(g, self.geo.box, self.smat(S, 'stone', 1), len, h, 0.55, mx, h / 2, mz, 'castle');
      w.rotation.y = -Math.atan2(dz, dx);
      for (var k = 0; k < 4; k++) {
        var f = ((k + 0.5) / 4 - 0.5) * (len / (len + 1.7));
        self.part(g, self.geo.box, self.smat(S, 'stone', 2), 0.32, 0.26, 0.6, mx + dx * f, h + 0.13, mz + dz * f, 'castle').rotation.y = w.rotation.y;
      }
      if (banners && h > 0.9) {
        var out = Math.hypot(mx, mz), nx = mx / out, nz = mz / out;
        var ban = self.part(g, self.geo.box, self.smat(S, 'banner', i), 0.45, Math.min(1.1, h * 0.7), 0.03, mx + nx * 0.3, h - Math.min(1.1, h * 0.7) / 2 - 0.05, mz + nz * 0.3, 'castle');
        ban.rotation.y = Math.atan2(nx, nz);
      }
    });
    return g;
  };

  // Castle-wide upgrades unlock as total lifting sessions add up.
  Town.prototype.castleMilestones = function (delay) {
    var L = this.st.lifts, c = this.st.castle, self = this;
    CASTLE_MILESTONES.forEach(function (m) {
      if (L < m[0] || c[m[1]]) return;
      c[m[1]] = true;
      self.buildMilestone(m[1], delay + 600);
      if (CASTLE_MILESTONES.every(function (x) { return c[x[1]]; })) self.addStation(0);
    });
  };
  Town.prototype.buildMilestone = function (kind, delay) {
    var g = new T.Group(), self = this, a = GATE_ANGLE * D2R;
    var ox = Math.cos(a), oz = -Math.sin(a), rot = Math.atan2(ox, oz);
    if (kind === 'gatehouse') {
      g.position.set(ox * 3.5, 0, oz * 3.5);
      g.rotation.y = rot;
      [-1, 1].forEach(function (s) {
        self.part(g, self.geo.cyl, self.mat('stone', 0), 0.5, 2.6, 0.5, s * 1.0, 1.3, 0.2, 'castle');
        self.part(g, self.geo.cone, self.mat('roof', 0), 0.65, 0.9, 0.65, s * 1.0, 3.05, 0.2, 'castle');
      });
      self.part(g, self.geo.box, self.mat('stone', 1), 1.6, 0.8, 0.9, 0, 2.0, 0.2, 'castle');
      // The doors stand open, swung back against the passage walls.
      self.part(g, self.geo.box, self.mat('stoneDark'), 0.9, 1.6, 0.05, 0, 0.8, 0.12, 'castle');
      [-1, 1].forEach(function (s) {
        self.part(g, self.geo.box, self.mat('wood'), 0.08, 1.6, 0.45, s * 0.42, 0.8, 0.4, 'castle');
        for (var i = 0; i < 2; i++) self.part(g, self.geo.box, self.mat('stoneDark'), 0.1, 1.5, 0.04, s * 0.42, 0.85, 0.25 + i * 0.3, 'castle');
      });
    } else if (kind === 'banners') {
      this.wallsDirty = true;
      return;
    } else if (kind === 'moat') {
      var moat = this.mesh(this.geo.ring, this.mat('water'), g);
      moat.position.y = 0.05; moat.castShadow = false; moat.userData.pick = 'castle'; this.picks.push(moat);
      var br = this.part(g, this.geo.box, this.mat('wood'), 1.4, 0.12, 1.6, ox * 6.55, 0.14, oz * 6.55, 'castle');
      br.rotation.y = rot;
    } else if (kind === 'outer') {
      for (i = 0; i < 8; i++) {
        var a0 = (GATE_ANGLE + 22.5 + i * 45) * D2R, a1 = a0 + 45 * D2R, R = 13;
        var p0 = { x: Math.cos(a0) * R, z: -Math.sin(a0) * R }, p1 = { x: Math.cos(a1) * R, z: -Math.sin(a1) * R };
        this.part(g, this.geo.cyl, this.mat('stone', 0), 0.5, 2.2, 0.5, p0.x, 1.1, p0.z, 'castle');
        this.part(g, this.geo.cone, this.mat('roof', i), 0.62, 0.8, 0.62, p0.x, 2.6, p0.z, 'castle');
        if (i === 7) continue; // the gap in front, where the road comes in
        var dx = p1.x - p0.x, dz = p1.z - p0.z, len = Math.hypot(dx, dz) - 1;
        var w = this.part(g, this.geo.box, this.mat('stone', 1), len, 1.3, 0.45, (p0.x + p1.x) / 2, 0.65, (p0.z + p1.z) / 2, 'castle');
        w.rotation.y = -Math.atan2(dz, dx);
      }
      this.castleCozy(g, GATE_ANGLE, 7.8, null, 'castle', { x: 0, z: 0, y: 0 });
    } else if (kind === 'spire') {
      var keep = this.st.towers.full;
      var sp = this.part(keep.roof, this.geo.cone, this.mat('gold'), 0.35, 2.4, 0.35, 0, 2.6, 0, 'castle');
      this.pop(sp, delay);
      return;
    } else if (kind === 'gold') {
      for (var k in this.st.towers) this.st.towers[k].cone.material = this.mat('gold');
      this.needsRender = true;
      return;
    }
    this.world.add(g);
    this.pop(g, delay);
  };


  // ---- the outlying castles' own milestones ----------------------------

  Town.prototype.styleMilestones = function (C, delay) {
    var self = this;
    C.style.milestones.forEach(function (m) {
      if (C.lifts < m[0] || C.done[m[1]]) return;
      C.done[m[1]] = true;
      self.styleMilestone(C, m[1], delay + 600);
      if (C.style.milestones.every(function (x) { return C.done[x[1]]; })) self.addStation(C.ci);
    });
    if (C.recolor && C.lifts % 4 === 0) this.recolorCastle(C);
  };
  // Swaps one material for another across a castle (silver spires, gilded crowns and so on).
  Town.prototype.recolorCastle = function (C) {
    var from = C.recolor[0], to = this.mat(C.recolor[1]);
    C.group.traverse(function (o) { if (o.isMesh && o.material.userData && o.material.userData.name === from) o.material = to; });
    this.needsRender = true;
  };
  Town.prototype.styleMilestone = function (C, kind, delay) {
    var self = this, S = C.style, K = S.key, o = new T.Group(), pick = 'castle:' + C.ci, site = C.site, base = C.group.position.y;
    function P(geo, mat, sx, sy, sz, x, y, z, parent) { return self.part(parent || o, geo, mat, sx, sy, sz, x, y, z, pick); }
    function M(role, i) { return self.smat(S, role, i); }
    function at(off, r) { return polar(C.gate + off, r); }
    function face(off) { var a = (C.gate + off) * D2R; return Math.atan2(Math.cos(a), -Math.sin(a)); }
    function gy(p) { return groundY(site.x + p.x, site.z + p.z) - base; }
    // A group placed at an angle off the gate and a radius, turned so its +z faces outward.
    function spot(off, r, outside) { var g = new T.Group(), q = at(off, r); g.position.set(q.x, outside ? gy(q) : 0, q.z); g.rotation.y = face(off); o.add(g); return g; }
    function fire(parent, x, y, z, sz) {
      P(self.geo.cone, self.mat('fire'), 0.22 * sz, 0.55 * sz, 0.22 * sz, x, y + 0.27 * sz, z, parent);
      P(self.geo.cone, self.mat('lantern'), 0.12 * sz, 0.35 * sz, 0.12 * sz, x + 0.05, y + 0.2 * sz, z, parent);
    }
    if (kind === 'wall') {
      // Curtain wall at radius 13 with a gap at the gate; nine stretches between ten towers.
      var R = 13, posts = [];
      for (var i = 0; i < 10; i++) posts.push(C.gate + 8 + i * 344 / 9);
      posts.forEach(function (a, i) {
        var q = polar(a, R), pg = new T.Group();
        pg.position.set(q.x, 0, q.z); o.add(pg);
        if (K === 'hold') {
          [[-0.45, -0.45], [0.45, -0.45], [-0.45, 0.45], [0.45, 0.45]].forEach(function (l) { P(self.geo.cyl6, self.mat('wood'), 0.09, 2.6, 0.09, l[0], 1.3, l[1], pg); });
          P(self.geo.box, self.mat('wood'), 1.2, 0.12, 1.2, 0, 2.3, 0, pg);
          P(self.geo.cone4, M('roof', i), 1.0, 0.9, 1.0, 0, 2.85, 0, pg).rotation.y = Math.PI / 4;
        } else if (K === 'keep') {
          P(self.geo.box, M('stone', i % 3), 1.5, 3.2, 1.5, 0, 1.6, 0, pg).rotation.y = -a * D2R;
          pg.add(self.styleCap(null, S, 0.95, i, pick)); pg.children[pg.children.length - 1].position.y = 3.2;
        } else {
          var tr = K === 'elf' ? 0.42 : 0.62, th = K === 'elf' ? 2.6 : 3.0;
          P(self.geo.cyl, M('stone', i % 3), tr, th, tr, 0, th / 2, 0, pg);
          var cap = self.styleCap(null, S, tr, i, pick); cap.position.y = th; pg.add(cap);
        }
        if (i === 9) return;
        var q2 = polar(posts[i + 1], R), dx = q2.x - q.x, dz = q2.z - q.z, len = Math.hypot(dx, dz), rot = -Math.atan2(dz, dx);
        var mx = (q.x + q2.x) / 2, mz = (q.z + q2.z) / 2;
        if (K === 'hold') {
          var nLogs = Math.floor(len / 0.34);
          for (var l = 1; l < nLogs; l++) {
            var f = l / nLogs, lx = q.x + dx * f, lz = q.z + dz * f, h = 1.7 + ((l * 7) % 3) * 0.12;
            P(self.geo.cyl6, self.mat('wood'), 0.17, h, 0.17, lx, h / 2, lz);
            P(self.geo.cone6, self.mat('wood'), 0.17, 0.3, 0.17, lx, h + 0.15, lz);
          }
        } else {
          var wh = K === 'keep' ? 2.5 : K === 'elf' ? 1.2 : 1.9, wt = K === 'keep' ? 1.0 : K === 'elf' ? 0.4 : 0.6;
          P(self.geo.box, M('stone', 1), len - (K === 'keep' ? 1.4 : 0.9), wh, wt, mx, wh / 2, mz).rotation.y = rot;
          var nm = Math.floor(len / (K === 'elf' ? 1.2 : 0.8));
          for (var k = 1; k < nm; k++) {
            var t = k / nm, cr = P(K === 'elf' ? self.geo.ball : self.geo.box, M('stone', 2), K === 'elf' ? 0.14 : 0.3, K === 'elf' ? 0.14 : 0.3, K === 'elf' ? 0.14 : wt + 0.06, q.x + dx * t, wh + 0.12, q.z + dz * t);
            cr.rotation.y = rot;
          }
        }
      });
    } else if (kind === 'gate') {
      var g = spot(0, 13, false);
      if (K === 'cit') {
        [-1.5, 1.5].forEach(function (x) {
          P(self.geo.cyl, M('stone', 0), 0.8, 4.2, 0.8, x, 2.1, 0, g);
          var c = self.styleCap(null, S, 0.8, 0, pick); c.position.set(x, 4.2, 0); g.add(c);
        });
        P(self.geo.box, M('stone', 1), 2.4, 1.2, 1.2, 0, 3.4, 0, g);
        P(self.geo.box, M('stoneDark'), 2.5, 0.15, 1.3, 0, 4.05, 0, g);
        // The silver doors stand open, swung in against the gate towers.
        [-1, 1].forEach(function (sd) {
          P(self.geo.box, self.mat('silver'), 0.15, 2.7, 0.75, sd * 0.62, 1.35, -0.4, g);
          P(self.geo.box, M('accent'), 0.05, 2.5, 0.06, sd * 0.53, 1.3, -0.4, g);
        });
        P(self.geo.ball, M('accent'), 0.3, 0.3, 0.08, 0, 3.4, 0.62, g);
      } else if (K === 'hold') {
        [-1.3, 1.3].forEach(function (x) { P(self.geo.cyl6, self.mat('wood'), 0.28, 3.0, 0.28, x, 1.5, 0, g); });
        [-1, 1].forEach(function (sd) { P(self.geo.box, self.mat('wood'), 0.15, 2.2, 0.75, sd * 0.94, 1.1, -0.28, g); }); // swung open
        P(self.geo.gable, M('roof', 0), 1.8, 1.2, 0.9, 0, 3.0, 0, g);
        // Crossed gable boards with carved horse heads.
        [-1, 1].forEach(function (sd) {
          var b = P(self.geo.box, self.mat('wood'), 0.14, 1.6, 0.1, sd * 0.4, 3.8, 0.7, g); b.rotation.z = sd * 0.75;
          P(self.geo.box, M('accent'), 0.3, 0.18, 0.1, sd * 0.05, 4.4, 0.7, g);
        });
      } else if (K === 'keep') {
        // A gatehouse of granite with a passage through it; the stone doors stand open inside.
        [-1, 1].forEach(function (sd) {
          P(self.geo.box, M('stone', 0), 1.25, 4.2, 1.8, sd * 1.575, 2.1, 0, g);
          P(self.geo.box, M('stoneDark'), 0.18, 2.85, 0.9, sd * 0.86, 1.43, 0.45, g);
          P(self.geo.box, M('accent'), 0.04, 0.06, 0.7, sd * 0.76, 2.2, 0.45, g);
        });
        P(self.geo.box, M('stone', 0), 1.9, 1.3, 1.8, 0, 3.55, 0, g);
        P(self.geo.box, M('stoneDark'), 1.9, 0.05, 1.8, 0, 2.88, 0, g);
        P(self.geo.box, M('stone', 2), 2.5, 0.35, 0.2, 0, 3.1, 0.95, g);
        for (var r2 = 0; r2 < 5; r2++) P(self.geo.box, M('accent'), 0.06, 0.4, 0.04, -0.6 + r2 * 0.3, 3.1, 1.06, g);
        for (var m2 = 0; m2 < 6; m2++) P(self.geo.box, M('roof', 0), 0.45, 0.45, 1.9, -1.95 + m2 * 0.78, 4.4, 0, g);
      } else {
        var ring = P(self.geo.torus, M('stone', 0), 1.7, 1.7, 2.2, 0, 1.8, 0, g);
        ring.userData.passable = true; // you walk through the middle of the moon
        P(self.geo.box, M('stone', 1), 3.8, 0.15, 0.5, 0, 0.07, 0, g);
        for (var v = 0; v < 9; v++) { var va = v / 8 * Math.PI; P(self.geo.blob, self.mat('hedge'), 0.2, 0.2, 0.2, Math.cos(va) * 1.75, 1.8 + Math.sin(va) * 1.75, 0.2, g); }
        P(self.geo.ball, self.mat('lantern'), 0.16, 0.16, 0.16, 0, 3.75, 0.1, g);
        ring.rotation.y = 0;
      }
    } else if (kind === 'terrace') {
      [[6.0, 0.75], [7.4, 0.5]].forEach(function (tr) {
        for (var a = 14; a < 346; a += 10) {
          var q = at(a, tr[0]), q2 = at(a + 10, tr[0]);
          var w = P(self.geo.box, M('stone', 1), Math.hypot(q2.x - q.x, q2.z - q.z) + 0.05, tr[1], 0.4, (q.x + q2.x) / 2, tr[1] / 2, (q.z + q2.z) / 2);
          w.rotation.y = -Math.atan2(q2.z - q.z, q2.x - q.x);
          if ((a / 10) % 2 < 1) P(self.geo.box, M('stone', 2), 0.3, 0.2, 0.46, q.x, tr[1] + 0.1, q.z).rotation.y = w.rotation.y;
        }
      });
    } else if (kind === 'tree') {
      var tg = spot(0, 9.6, false);
      P(self.geo.cyl, M('stone', 2), 1.0, 0.4, 1.0, 0, 0.2, 0, tg);
      P(self.geo.cyl, self.mat('pitch'), 0.9, 0.05, 0.9, 0, 0.42, 0, tg);
      P(self.geo.cyl6, self.mat('birch'), 0.14, 1.9, 0.14, 0, 1.3, 0, tg);
      [[0.5, 2.1, 0.6], [-0.5, 2.2, 0.55], [0, 2.6, 0.7], [0.3, 2.9, 0.45], [-0.3, 2.85, 0.45]].forEach(function (b) {
        P(self.geo.blob, self.mat('silver'), b[2], b[2] * 0.8, b[2], b[0], b[1], 0, tg);
      });
      [-0.4, 0.4].forEach(function (x) { var br = P(self.geo.cyl6, self.mat('birch'), 0.06, 0.8, 0.06, x * 0.6, 2.0, 0, tg); br.rotation.z = -x * 1.6; });
      for (var st = 0; st < 7; st++) P(self.geo.ball, self.mat('silver'), 0.06, 0.06, 0.06, Math.cos(st) * 0.7, 2.4 + (st % 3) * 0.2, Math.sin(st) * 0.4, tg);
    } else if (kind === 'beacon') {
      if (K === 'cit') {
        var bg = spot(180, 6.4, false);
        P(self.geo.cyl, M('stone', 0), 0.55, 4.6, 0.55, 0, 2.3, 0, bg);
        P(self.geo.cyl, M('stoneDark'), 0.75, 0.25, 0.75, 0, 4.7, 0, bg);
        for (var lg = 0; lg < 5; lg++) P(self.geo.box, self.mat('wood'), 0.9, 0.12, 0.12, 0, 4.9 + lg * 0.1, 0, bg).rotation.y = lg * 0.6;
        fire(bg, 0, 5.2, 0, 2.2);
      } else {
        var hb = spot(180, 16.5, true);
        P(self.geo.cyl6, M('stone', 1), 1.1, 0.5, 1.1, 0, 0.25, 0, hb);
        for (var lg2 = 0; lg2 < 6; lg2++) { var lb = P(self.geo.cyl6, self.mat('wood'), 0.1, 1.6, 0.1, Math.cos(lg2) * 0.35, 1.1, Math.sin(lg2) * 0.35, hb); lb.rotation.set(Math.sin(lg2) * 0.35, 0, -Math.cos(lg2) * 0.35); }
        fire(hb, 0, 1.6, 0, 2.6);
      }
    } else if (kind === 'stables') {
      var sg = spot(70, 6.6, false);
      P(self.geo.box, self.mat('wood'), 3.2, 1.0, 1.4, 0, 0.5, 0, sg);
      P(self.geo.gable, M('roof', 1), 2.1, 0.8, 1.0, 0, 1.0, 0, sg).rotation.y = Math.PI / 2;
      for (var d = 0; d < 4; d++) P(self.geo.box, M('stoneDark'), 0.5, 0.6, 0.05, -1.15 + d * 0.77, 0.4, 0.71, sg);
      // Paddock outside the walls with horses.
      var pd = spot(42, 16.8, true);
      for (var fp = 0; fp < 16; fp++) {
        var fa = fp / 16 * Math.PI * 2;
        P(self.geo.box, self.mat('woodLight'), 0.08, 0.6, 0.08, Math.cos(fa) * 2.6, 0.3, Math.sin(fa) * 2.0, pd);
        var rail = P(self.geo.box, self.mat('woodLight'), 1.05, 0.06, 0.06, Math.cos(fa + 0.2) * 2.6, 0.45, Math.sin(fa + 0.2) * 2.0, pd);
        rail.rotation.y = -Math.atan2(Math.cos(fa + 0.2) * 2.0, -Math.sin(fa + 0.2) * 2.6);
      }
      [[-0.9, 0.2, 0.4, 0], [0.8, -0.5, -1.2, 1], [0.2, 0.9, 2.2, 2]].forEach(function (h) {
        var hg = new T.Group(); hg.position.set(h[0], 0, h[1]); hg.rotation.y = h[2]; pd.add(hg);
        P(self.geo.box, self.mat('horse', h[3]), 0.9, 0.4, 0.32, 0, 0.62, 0, hg);
        [[-0.35, -0.1], [0.35, -0.1], [-0.35, 0.1], [0.35, 0.1]].forEach(function (l) { P(self.geo.box, self.mat('horse', h[3]), 0.08, 0.45, 0.08, l[0], 0.22, l[1], hg); });
        var nk = P(self.geo.box, self.mat('horse', h[3]), 0.2, 0.5, 0.2, 0.5, 0.95, 0, hg); nk.rotation.z = -0.5;
        P(self.geo.box, self.mat('horse', h[3]), 0.36, 0.16, 0.16, 0.72, 1.15, 0, hg);
        P(self.geo.box, self.mat('horse', 1), 0.1, 0.35, 0.05, -0.5, 0.6, 0, hg).rotation.z = 0.4;
      });
    } else if (kind === 'hall') {
      var hg2 = spot(-70, 6.6, false);
      P(self.geo.box, M('stone', 0), 3.6, 0.35, 1.9, 0, 0.17, 0, hg2);
      P(self.geo.box, self.mat('wood'), 3.4, 1.4, 1.6, 0, 1.05, 0, hg2);
      C.hallRoof = P(self.geo.gable, M('roof', 0), 1.25, 1.6, 2.4, 0, 1.75, 0, hg2);
      C.hallRoof.rotation.y = Math.PI / 2;
      [-1.75, 1.75].forEach(function (x) { [-1, 1].forEach(function (sd) {
        var b = P(self.geo.box, self.mat('wood'), 0.12, 1.3, 0.1, x, 2.6, sd * 0.3, hg2); b.rotation.x = sd * 0.7;
      }); });
      P(self.geo.box, M('accent'), 0.7, 1.0, 0.05, 0, 0.85, 0.82, hg2);
      for (var cp = 0; cp < 4; cp++) P(self.geo.cyl6, self.mat('wood'), 0.08, 1.4, 0.08, -1.2 + cp * 0.8, 1.05, 0.9, hg2);
    } else if (kind === 'banners') {
      this.wallsDirty = true;
      return;
    } else if (kind === 'gold') {
      if (K === 'hold' && C.hallRoof) C.hallRoof.material = this.mat('gold');
      C.recolor = [K === 'hold' ? 'holdAccent' : 'keepRoof', 'gold'];
      if (K === 'keep') this.recolorCastle(C);
      return;
    } else if (kind === 'leafgold') {
      C.recolor = ['elfRoof', 'leafgold'];
      this.recolorCastle(C);
      return;
    } else if (kind === 'silver') {
      C.recolor = [K === 'cit' ? 'citRoof' : 'elfRoof', 'silver'];
      this.recolorCastle(C);
      return;
    } else if (kind === 'kings') {
      [-11, 11].forEach(function (off) {
        var kg = spot(off, 10.6, false);
        P(self.geo.box, M('stone', 2), 1.0, 0.6, 1.0, 0, 0.3, 0, kg);
        P(self.geo.cyl6, M('stone', 0), 0.45, 2.0, 0.4, 0, 1.6, 0, kg);
        P(self.geo.box, M('stone', 1), 1.2, 0.35, 0.5, 0, 2.5, 0, kg);
        P(self.geo.ball, M('stone', 0), 0.3, 0.3, 0.3, 0, 2.95, 0, kg);
        var beard = P(self.geo.cone, M('stone', 1), 0.24, 0.7, 0.18, 0, 2.55, 0.22, kg); beard.rotation.x = Math.PI;
        P(self.geo.cyl6, M('accent'), 0.27, 0.16, 0.27, 0, 3.25, 0, kg);
        P(self.geo.box, M('stoneDark'), 0.1, 2.4, 0.1, 0.65, 1.8, 0.2, kg);
        P(self.geo.box, M('accent'), 0.5, 0.4, 0.06, 0.65, 2.9, 0.2, kg);
      });
    } else if (kind === 'forge') {
      var fg = spot(70, 6.6, false);
      P(self.geo.box, M('stone', 1), 2.4, 1.3, 1.7, 0, 0.65, 0, fg);
      P(self.geo.box, M('stoneDark'), 2.6, 0.2, 1.9, 0, 1.4, 0, fg);
      P(self.geo.box, M('stone', 2), 0.6, 2.4, 0.6, 0.7, 1.9, -0.3, fg);
      P(self.geo.box, self.mat('fire'), 0.9, 0.6, 0.06, -0.3, 0.55, 0.86, fg);
      P(self.geo.box, M('stoneDark'), 0.5, 0.3, 0.25, -0.6, 0.35, 1.3, fg);
      P(self.geo.box, M('stoneDark'), 0.25, 0.3, 0.2, -0.6, 0.15, 1.3, fg);
      fire(fg, 0.7, 3.1, -0.3, 1.0);
    } else if (kind === 'braziers') {
      for (var bz = 0; bz < 6; bz++) {
        var q = at(30 + bz * 60, 7.6), zg = new T.Group(); zg.position.set(q.x, 0, q.z); o.add(zg);
        P(self.geo.cyl6, M('stoneDark'), 0.12, 1.0, 0.12, 0, 0.5, 0, zg);
        P(self.geo.cyl, M('accent'), 0.35, 0.2, 0.35, 0, 1.05, 0, zg);
        fire(zg, 0, 1.12, 0, 1.4);
      }
    } else if (kind === 'mine') {
      var mg = spot(-70, 6.4, false);
      P(self.geo.box, M('stone', 0), 2.6, 2.2, 1.2, 0, 1.1, -0.3, mg);
      P(self.geo.box, M('stoneDark'), 1.2, 1.5, 0.1, 0, 0.75, 0.31, mg);
      P(self.geo.box, self.mat('wood'), 1.5, 0.2, 0.2, 0, 1.6, 0.35, mg);
      [-0.65, 0.65].forEach(function (x) { P(self.geo.box, self.mat('wood'), 0.2, 1.6, 0.2, x, 0.8, 0.35, mg); });
      [-0.3, 0.3].forEach(function (x) { P(self.geo.box, M('stoneDark'), 0.06, 0.05, 2.4, x, 0.03, 1.5, mg); });
      for (var sl = 0; sl < 6; sl++) P(self.geo.box, self.mat('wood'), 0.8, 0.04, 0.12, 0, 0.02, 0.5 + sl * 0.38, mg);
      P(self.geo.box, M('stoneDark'), 0.55, 0.35, 0.8, 0, 0.32, 1.9, mg);
      for (var gn = 0; gn < 5; gn++) P(self.geo.ball, M('accent'), 0.12, 0.1, 0.12, -0.15 + (gn % 3) * 0.15, 0.55 + Math.floor(gn / 3) * 0.08, 1.75 + (gn % 2) * 0.25, mg);
      [-0.3, 0.3].forEach(function (x) { [1.65, 2.15].forEach(function (z) { P(self.geo.cyl, M('stoneDark'), 0.1, 0.06, 0.1, x, 0.12, z, mg).rotation.z = Math.PI / 2; }); });
    } else if (kind === 'falls') {
      var wf = spot(70, 6.5, false);
      [[0, 1.6, 1.3], [0.55, 1.05, 1.0], [1.05, 0.55, 0.75]].forEach(function (t, i) {
        P(self.geo.box, M('stone', i), 1.6, t[1], t[2], 0, t[1] / 2, -t[0], wf);
        P(self.geo.box, self.mat('water'), 0.7, 0.04, t[2] - 0.15, 0, t[1] + 0.02, -t[0], wf);
        P(self.geo.box, self.mat('water'), 0.7, t[1] - 0.5 > 0 ? 0.55 : 0.5, 0.06, 0, t[1] - 0.25, -t[0] + t[2] / 2 + 0.02, wf);
      });
      P(self.geo.cyl, M('stone', 2), 1.2, 0.25, 0.9, 0, 0.12, 0.9, wf);
      P(self.geo.cyl, self.mat('water'), 1.05, 0.04, 0.78, 0, 0.26, 0.9, wf);
      for (var lp = 0; lp < 4; lp++) P(self.geo.cyl, self.mat('hedge'), 0.14, 0.03, 0.14, -0.6 + lp * 0.4, 0.29, 0.9 + (lp % 2) * 0.3, wf);
    } else if (kind === 'gardens') {
      // Trailing greenery and flowers on every tower, and planters ringing the keep.
      for (var key in C.towers) {
        var tw = C.towers[key];
        for (var vb = 0; vb < 6; vb++) {
          var va2 = vb / 6 * Math.PI * 2 + 0.3, vy = 0.6 + (vb % 3) * 0.7;
          P(self.geo.blob, self.mat(vb % 2 ? 'hedge' : 'flag', vb), 0.22, 0.32, 0.22, Math.cos(va2) * tw.r * 1.02, vy, Math.sin(va2) * tw.r * 1.02, tw.group);
        }
      }
      for (var pl = 0; pl < 10; pl++) {
        var pq = at(20 + pl * 32, 5.5);
        P(self.geo.box, M('stone', 2), 0.7, 0.3, 0.5, pq.x, 0.15, pq.z);
        P(self.geo.blob, self.mat('hedge'), 0.3, 0.25, 0.25, pq.x, 0.38, pq.z);
        P(self.geo.ball, self.mat('flag', pl), 0.08, 0.08, 0.08, pq.x + 0.12, 0.55, pq.z);
      }
    } else if (kind === 'lanterns') {
      for (var lt = 0; lt < 5; lt++) {
        var lq = at(40 + lt * 70, 7.5), lg3 = new T.Group(); lg3.position.set(lq.x, 0, lq.z); o.add(lg3);
        P(self.geo.cyl6, self.mat('birch'), 0.07, 2.0, 0.07, 0, 1.0, 0, lg3);
        P(self.geo.blob, M('accent'), 0.6, 0.5, 0.6, 0, 2.2, 0, lg3);
        P(self.geo.blob, M('accent'), 0.4, 0.35, 0.4, 0.3, 2.6, 0.1, lg3);
        for (var lb2 = 0; lb2 < 4; lb2++) P(self.geo.ball, self.mat('lantern'), 0.08, 0.1, 0.08, Math.cos(lb2 * 1.6) * 0.55, 1.75, Math.sin(lb2 * 1.6) * 0.55, lg3);
      }
    } else if (kind === 'pavilion') {
      var pv = spot(-70, 6.6, false);
      P(self.geo.cyl, M('stone', 1), 1.3, 0.25, 1.3, 0, 0.12, 0, pv);
      for (var cl = 0; cl < 6; cl++) { var ca = cl / 6 * Math.PI * 2; P(self.geo.cyl6, M('stone', 0), 0.08, 1.8, 0.08, Math.cos(ca) * 1.05, 1.15, Math.sin(ca) * 1.05, pv); }
      P(self.geo.cyl, M('stone', 2), 1.25, 0.15, 1.25, 0, 2.1, 0, pv);
      var dome = P(self.geo.ball, M('roof', 1), 1.15, 0.8, 1.15, 0, 2.15, 0, pv);
      P(self.geo.cone, M('accent'), 0.1, 0.6, 0.1, 0, 3.1, 0, pv);
      P(self.geo.ball, self.mat('lantern'), 0.15, 0.15, 0.15, 0, 1.4, 0, pv);
    }
    if (kind === 'gate') this.castleCozy(o, C.gate, 6.4, S, pick, { x: site.x, z: site.z, y: base });
    C.group.add(o);
    this.pop(o, delay);
  };
  // Life inside the walls, once a castle has its gate: a cobbled lane in from the gate under
  // lanterns and bunting, a well, a market stall, benches and a pair of courtyard trees.
  // R is the radius of the open ring between the keep and the halls.
  Town.prototype.castleCozy = function (o, gate, R, S, pick, base) {
    var self = this;
    function P(geo, mat, sx, sy, sz, x, y, z, parent) { return self.part(parent || o, geo, mat, sx, sy, sz, x, y, z, pick); }
    // A group at an angle off the gate and a radius, turned so its +z faces the keep.
    function spot(off, r) { var g = new T.Group(), q = polar(gate + off, r), a = (gate + off) * D2R; g.position.set(q.x, 0, q.z); g.rotation.y = Math.atan2(-Math.cos(a), Math.sin(a)); o.add(g); return g; }
    // The lane: local z runs from the gate (z = 0) in toward the keep.
    var lane = spot(0, 12.9), len = 12.9 - (R - 1.2);
    P(self.geo.box, self.smat(S, 'stone', 2), 1.7, 0.05, len, 0, 0.03, len / 2, lane);
    for (var c = 0; c < 18; c++) P(self.geo.box, self.smat(S, 'stoneDark'), 0.3, 0.06, 0.26, ((c * 7) % 5 - 2) * 0.32, 0.04, 0.3 + c * len / 18, lane).rotation.y = c * 0.7;
    [1.6, 5.0].forEach(function (z, zi) {
      [-1.25, 1.25].forEach(function (x) {
        P(self.geo.cyl6, self.mat('wood'), 0.09, 1.5, 0.09, x, 0.75, z, lane);
        P(self.geo.box, self.mat('wood'), 0.32, 0.05, 0.05, x * 0.9, 1.45, z, lane);
        P(self.geo.box, self.mat('lantern'), 0.16, 0.2, 0.16, x * 0.8, 1.3, z, lane);
        P(self.geo.cyl, self.mat('brick', 1), 0.16, 0.22, 0.16, x, 0.11, z + 0.3, lane);
        for (var f = 0; f < 3; f++) P(self.geo.ball, self.mat('flag', f + zi + (x > 0 ? 2 : 0)), 0.12, 0.12, 0.12, x + (f - 1) * 0.09, 0.28, z + 0.3 + (f % 2) * 0.06, lane);
      });
      // Bunting strung across the lane between the lantern posts.
      for (var b = 0; b < 9; b++) {
        var bx = -1.15 + b * 0.2875, sag = 1.45 - Math.sin(b / 8 * Math.PI) * 0.22;
        P(self.geo.cone4, self.mat('flag', b), 0.12, 0.18, 0.03, bx, sag - 0.1, z, lane).rotation.x = Math.PI;
      }
    });
    // The well.
    var w = spot(125, R + 0.2);
    P(self.geo.cyl, self.smat(S, 'stone', 1), 0.45, 0.55, 0.45, 0, 0.28, 0, w);
    P(self.geo.cyl, self.mat('water'), 0.36, 0.04, 0.36, 0, 0.56, 0, w);
    [-0.4, 0.4].forEach(function (x) { P(self.geo.box, self.mat('wood'), 0.08, 1.2, 0.08, x, 0.9, 0, w); });
    P(self.geo.gable, self.smat(S, 'roof', 1), 1.1, 0.45, 0.7, 0, 1.45, 0, w);
    P(self.geo.cyl6, self.mat('wood'), 0.06, 0.8, 0.06, 0, 1.25, 0, w).rotation.z = Math.PI / 2;
    P(self.geo.cyl, self.mat('wood'), 0.08, 0.18, 0.08, 0, 0.95, 0, w);
    // A market stall under a striped awning, with crates of produce and barrels.
    var m = spot(-125, R + 0.3);
    P(self.geo.box, self.mat('wood'), 1.3, 0.08, 0.55, 0, 0.6, 0, m);
    [[-0.6, -0.22], [0.6, -0.22], [-0.6, 0.22], [0.6, 0.22]].forEach(function (l) { P(self.geo.box, self.mat('wood'), 0.06, 0.6, 0.06, l[0], 0.3, l[1], m); });
    [-0.62, 0.62].forEach(function (x) { P(self.geo.box, self.mat('wood'), 0.06, 1.5, 0.06, x, 0.75, -0.3, m); });
    for (var sp = 0; sp < 5; sp++) P(self.geo.box, self.mat('canvas', sp % 2), 0.27, 0.04, 0.8, -0.54 + sp * 0.27, 1.4, 0.05, m).rotation.x = -0.3;
    for (var cr = 0; cr < 3; cr++) {
      P(self.geo.box, self.mat('woodLight'), 0.34, 0.14, 0.3, -0.4 + cr * 0.4, 0.71, 0, m);
      for (var fr = 0; fr < 4; fr++) P(self.geo.ball, self.mat('flag', cr === 1 ? 4 : cr * 3), 0.09, 0.09, 0.09, -0.48 + cr * 0.4 + (fr % 2) * 0.14, 0.8, -0.06 + Math.floor(fr / 2) * 0.12, m);
    }
    [-1.0, 1.0].forEach(function (x) { P(self.geo.cyl, self.mat('wood'), 0.17, 0.45, 0.17, x, 0.22, 0.05, m); });
    if (base) { var sf = m.rotation.y; (this.st.stashes = this.st.stashes || []).push({ x: base.x + m.position.x, z: base.z + m.position.z, mx: base.x + m.position.x + Math.sin(sf) * 0.65, mz: base.z + m.position.z + Math.cos(sf) * 0.65, y: base.y, finds: 3 }); }
    if (base && !this.soft) { var cq = polar(gate - 125 - 12, R + 0.5); this.addCan(base.x + cq.x, base.z + cq.z, 0); this.st.cans[this.st.cans.length - 1].y = base.y; this.st.cans[this.st.cans.length - 1].g.position.y = base.y; }
    // Benches facing the keep, and two courtyard trees.
    [-40, 40].forEach(function (off) {
      var bg = spot(off, R - 0.3);
      if (base) (self.st.seats = self.st.seats || []).push({ x: base.x + bg.position.x, z: base.z + bg.position.z, y: base.y + 0.36, rot: bg.rotation.y });
      P(self.geo.box, self.mat('wood'), 0.9, 0.06, 0.3, 0, 0.32, 0, bg);
      P(self.geo.box, self.mat('wood'), 0.9, 0.3, 0.05, 0, 0.55, -0.15, bg);
      [-0.38, 0.38].forEach(function (x) { P(self.geo.box, self.mat('wood'), 0.06, 0.32, 0.26, x, 0.16, 0, bg); });
    });
    [-160, 160].forEach(function (off, ti) {
      var tg = spot(off, R);
      P(self.geo.cyl, self.smat(S, 'stone', 2), 0.45, 0.25, 0.45, 0, 0.12, 0, tg);
      P(self.geo.cyl6, self.mat('trunk'), 0.16, 1.0, 0.16, 0, 0.7, 0, tg);
      P(self.geo.blob, self.mat('hedge'), 0.75, 0.65, 0.75, 0, 1.45, 0, tg);
      P(self.geo.blob, self.mat('hedge', 1), 0.5, 0.45, 0.5, 0.25, 1.85, 0.1, tg);
      for (var bl = 0; bl < 5; bl++) P(self.geo.ball, self.mat('flag', ti ? 0 : 1), 0.08, 0.08, 0.08, Math.cos(bl * 1.3) * 0.62, 1.35 + (bl % 3) * 0.2, Math.sin(bl * 1.3) * 0.62, tg);
    });
  };



  // ---- the sea, the lake, the stream, the waterfall and the canyon -------

  // A point on the shoreline in a given direction from the town centre.
  function shoreAt(deg) {
    var lo = 60, hi = 160, d = polar(deg, 1);
    for (var i = 0; i < 30; i++) { var m = (lo + hi) / 2; if (coastSd(d.x * m, d.z * m) > 0) hi = m; else lo = m; }
    return { x: d.x * lo, z: d.z * lo, r: lo };
  }
  // Jagged rock faces round the seaward side of the headland, with sea stacks and boulders below.
  Town.prototype.buildCliffs = function (base) {
    var self = this, r = rng(338), N = COAST_N, Tg = COAST_T;
    function at(u, v) { return { x: HEAD.x + N.x * u + Tg.x * v, z: HEAD.z + N.z * u + Tg.z * v }; }
    function crag(p, bottom, top, w, d, mat, spiky) {
      var m = self.mesh(spiky && r() < spiky ? self.geo.cone4 : r() < 0.5 ? self.geo.box : self.geo.cyl6, self.mat(mat), base);
      var h = top - bottom;
      if (m.geometry === self.geo.cone4) { m.scale.set(w * 1.3, h * 1.1, d * 1.3); m.position.set(p.x, bottom + h * 0.55, p.z); }
      else { m.scale.set(w, h, d); m.position.set(p.x, bottom + h / 2, p.z); }
      m.rotation.set((r() - 0.5) * 0.18, r() * 6.28, (r() - 0.5) * 0.18);
      m.castShadow = m.receiveShadow = true;
      return m;
    }
    for (var i = 0; i <= 26; i++) {
      var phi = (-112 + i / 26 * 224) * D2R, e = 1.02 + r() * 0.1;
      var p = at(Math.cos(phi) * 5 * e, Math.sin(phi) * 5.5 * e), top = groundY(p.x, p.z);
      var ridgeTop = HEAD.top * (0.86 + r() * 0.16) * (Math.abs(phi) > 1.6 ? 0.8 : 1);
      crag(p, SEA_Y - 1.2, Math.max(top, ridgeTop), 1.2 + r() * 0.9, 1.1 + r() * 0.7, i % 3 ? 'rock' : 'stoneDark');
      // A second, lower row of broken rock at the foot of the cliff.
      if (r() < 0.7) { var q = at(Math.cos(phi) * 5 * 1.18, Math.sin(phi) * 5.5 * 1.18); crag(q, SEA_Y - 0.8, SEA_Y + 0.8 + r() * 2.2, 0.7 + r() * 0.7, 0.7 + r() * 0.5, 'rock', 0.3); }
    }
    // Sea stacks out in the surf.
    [[9.5, -3.5, 5.2], [11.5, 2.5, 3.6], [8, 5.5, 2.4], [13.5, -1, 1.6]].forEach(function (s) { var p = at(s[0], s[1]); crag(p, SEA_Y - 1, SEA_Y + s[2], 0.9 + s[2] * 0.12, 0.8 + s[2] * 0.1, 'rock', 0.5); });
    for (var b = 0; b < 12; b++) {
      var bp = at(6.5 + r() * 3, (r() - 0.5) * 13), bm = self.mesh(self.geo.blob, self.mat('rock'), base);
      bm.scale.set(0.5 + r() * 0.6, 0.4 + r() * 0.4, 0.5 + r() * 0.6); bm.position.set(bp.x, SEA_Y, bp.z); bm.castShadow = true;
    }
    // Surf breaking white round the foot of the cliffs.
    var foam = [];
    for (var f = 0; f <= 40; f++) { var fa = (-118 + f / 40 * 236) * D2R, fp = at(Math.cos(fa) * 5 * 1.32, Math.sin(fa) * 5.5 * 1.3); foam.push({ x: fp.x, z: fp.z, y: SEA_Y + 0.06 }); }
    base.add(this.ribbon(foam, 1.1, new T.MeshBasicMaterial({ color: '#ffffff', transparent: true, opacity: 0.55, depthWrite: false })));
  };
  Town.prototype.buildLandforms = function (base) {
    var self = this;
    function P(parent, geo, mat, sx, sy, sz, x, y, z) { var m = self.mesh(geo, mat, parent); m.scale.set(sx, sy, sz); m.position.set(x, y, z); m.castShadow = m.receiveShadow = true; return m; }
    // The sea: one big sheet past the shoreline.
    var sea = new T.Mesh(new T.PlaneGeometry(640, 300).rotateX(-Math.PI / 2), this.mat('water'));
    var th = Math.atan2(-COAST_T.z, COAST_T.x);
    sea.rotation.y = th;
    sea.position.set(COAST_N.x * 246, SEA_Y, COAST_N.z * 246);
    sea.receiveShadow = true;
    base.add(sea);
    // A sandy beach along the shore.
    var beach = [], beaches = [beach];
    for (var a = 250; a <= 30 + 360; a += 1.5) {
      var sp = shoreAt(a % 360), back = 4.5;
      var bx = sp.x - COAST_N.x * back, bz = sp.z - COAST_N.z * back;
      if (riverDist(bx, bz) < RIVER_HALF + 5 || Math.hypot(bx - HEAD.x, bz - HEAD.z) < 11) { if (beach.length) beaches.push(beach = []); continue; }
      beach.push({ x: bx, z: bz, y: Math.max(SEA_Y + 0.05, groundY(bx, bz) + 0.04) });
    }
    beaches.forEach(function (b) { if (b.length > 1) base.add(self.ribbon(b, 9, self.mat('sand'))); });
    // A lighthouse on top of the headland's cliffs (the harbour along the shore is built by rowing and paddling).
    var light = new T.Group(), ly = groundY(HEAD.x, HEAD.z);
    light.position.set(HEAD.x, ly - 0.6, HEAD.z);
    P(light, this.geo.cyl6, this.mat('stone', 1), 1.2, 0.4, 1.2, 0, 0.7, 0);
    this.buildCliffs(base);
    for (var b = 0; b < 5; b++) P(light, this.geo.cyl, this.mat(b % 2 ? 'roofJo' : 'plaster', 0), 0.6 - b * 0.04, 1.0, 0.6 - b * 0.04, 0, 1.2 + b, 0);
    P(light, this.geo.cyl, this.mat('stoneDark'), 0.55, 0.1, 0.55, 0, 5.75, 0);
    P(light, this.geo.cyl, this.mat('lantern'), 0.36, 0.6, 0.36, 0, 6.1, 0);
    P(light, this.geo.cone, this.mat('roofJo'), 0.48, 0.6, 0.48, 0, 6.7, 0);
    base.add(light);
    this.buildBeam(light);
    // Where the rowing pond used to be: a village green with a gazebo.
    var gz = new T.Group(); gz.position.set(POND.x, groundY(POND.x, POND.z), POND.z); base.add(gz);
    this.greenGazebo = gz; // until Jo's cottage takes over the green
    P(gz, this.geo.cyl6, this.mat('stone', 2), 1.8, 0.2, 1.8, 0, 0.1, 0);
    for (var gp = 0; gp < 6; gp++) { var ga = gp / 6 * Math.PI * 2; P(gz, this.geo.cyl6, this.mat('plaster', 0), 0.07, 1.8, 0.07, Math.cos(ga) * 1.55, 1.1, Math.sin(ga) * 1.55); }
    P(gz, this.geo.cone6, this.mat('roof', 3), 2.1, 1.0, 2.1, 0, 2.5, 0);
    P(gz, this.geo.ball, this.mat('gold'), 0.12, 0.12, 0.12, 0, 3.05, 0);
    [[3.2, 0.6], [-3.0, 1.2], [0.4, -3.2]].forEach(function (bb, i) {
      P(gz, self.geo.box, self.mat('wood'), 1.1, 0.08, 0.35, bb[0], 0.42, bb[1]).rotation.y = i;
      P(gz, self.geo.blob, self.mat('hedge'), 0.5, 0.35, 0.5, bb[0] * 1.35, 0.25, bb[1] * 1.35 + 0.6);
      P(gz, self.geo.ball, self.mat('flag', i), 0.12, 0.1, 0.12, bb[0] * 1.35, 0.55, bb[1] * 1.35 + 0.6);
    });

    // The lake: water just below its shore.
    var shape = new T.Shape();
    for (var i = 0; i <= 64; i++) {
      var aa = i / 64 * Math.PI * 2, e = lakeEdge(aa) + 0.6, x = Math.cos(aa) * e, z = Math.sin(aa) * e;
      if (i) shape.lineTo(x, -z); else shape.moveTo(x, -z);
    }
    var lake = new T.Mesh(new T.ShapeGeometry(shape).rotateX(-Math.PI / 2), this.mat('water'));
    lake.position.set(LAKE.c.x, LAKE.y + 0.12, LAKE.c.z);
    lake.receiveShadow = true;
    base.add(lake);
    // A waterfall drops off a rocky cliff on the far shore into the lake.
    var wa = FALL.a;
    var fall = new T.Group();
    fall.position.set(FALL.x, LAKE.y, FALL.z);
    fall.rotation.y = Math.atan2(-Math.cos(wa), -Math.sin(wa));
    [[-2.2, 0, 3.4, 5.2], [2.2, 0.2, 3.2, 4.6], [0, -1.6, 4.5, 6.4], [-3.8, -0.6, 2.4, 3.2], [3.8, -0.4, 2.4, 3.0]].forEach(function (c) {
      P(fall, self.geo.blob, self.mat('rock'), c[2] * 0.6, c[3] / 2, c[2] * 0.55, c[0], c[3] / 2 - 0.4, c[1]);
    });
    P(fall, this.geo.box, this.mat('water'), 1.3, 5.6, 0.25, 0, 2.6, 0.95);
    P(fall, this.geo.box, this.mat('water'), 1.0, 0.25, 2.6, 0, 5.55, -0.2);
    for (var f = 0; f < 7; f++) P(fall, this.geo.blob, this.mat('swan', 0), 0.35, 0.2, 0.3, -0.7 + f * 0.24, 0.2, 1.3 + (f % 2) * 0.25);
    base.add(fall);
    this.waterfall = fall;
    // The stream: water in its bed, from the lake to the edge of the hills.
    var sw = this.ribbon(STREAM.map(function (q) { return { x: q.x, z: q.z, y: groundY(q.x, q.z) + 0.3 }; }), STREAM_HALF * 2.1, this.mat('water'));
    base.add(sw);
    // The stream that feeds the waterfall, running down the ridge to the cliff edge.
    var fs = this.ribbon(FALL_STREAM.map(function (q) { return { x: q.x, z: q.z, y: Math.max(groundY(q.x, q.z) + 0.3, q.t < 2.5 ? LAKE.y + 5.65 : -99) }; }), STREAM_HALF * 1.8, this.mat('water'));
    base.add(fs);
    // A few stones along its banks.
    var fr2 = rng(5151);
    for (var st = 4; st < FALL_STREAM.length; st += 5) {
      var q = FALL_STREAM[st], sd = st % 10 ? 1 : -1, bx2 = q.x - FALL.uz * sd * 1.4, bz2 = q.z + FALL.ux * sd * 1.4;
      P(base, this.geo.blob, this.mat('rock'), 0.4 + fr2() * 0.4, 0.3, 0.4 + fr2() * 0.3, bx2, groundY(bx2, bz2) + 0.1, bz2);
    }

    // The tarns: still water in a scooped bed, reeds and cattails round the pond, rocks round the spring.
    TARNS.forEach(function (t, k) {
      P(base, self.geo.cyl, self.mat('water'), t.R + 0.2, 0.06, t.R + 0.2, t.x, t.y, t.z);
      var n = t.kind === 'reeds' ? 22 : 9, tr = rng(700 + k);
      for (var i = 0; i < n; i++) {
        var a = i / n * Math.PI * 2 + tr() * 0.3, d = t.R + 0.1 + tr() * 0.6, x = t.x + Math.cos(a) * d, z = t.z + Math.sin(a) * d, y = groundY(x, z);
        if (t.kind === 'reeds') {
          P(base, self.geo.cyl6, self.mat('houseplant', i % 3), 0.03, 0.9 + tr() * 0.5, 0.03, x, y + 0.5, z);
          if (i % 3 === 0) P(base, self.geo.cyl6, self.mat('trunk'), 0.06, 0.22, 0.06, x, y + 1.0, z);
        } else P(base, self.geo.blob, self.mat('rock'), 0.4 + tr() * 0.4, 0.3 + tr() * 0.3, 0.4 + tr() * 0.3, x, y + 0.15, z);
      }
      if (t.kind === 'reeds') [[0.4, -0.6], [-1.2, 0.9], [1.5, 1.1]].forEach(function (l) { P(base, self.geo.cyl, self.mat('houseplant', 3), 0.35, 0.02, 0.35, t.x + l[0], t.y + 0.04, t.z + l[1]); });
    });

    // The glacier: a snow-capped mountain with a tongue of ice coming down to the river's head.
    var G = GLACIER, gy = groundY(G.x, G.z), capGeo = this.geo.mtnCap || (this.geo.mtnCap = mountainGeometry(0.55, 1));
    var mtn = new T.Mesh(this.geo.mountain, this.mat('rock')); mtn.scale.set(G.R, G.H, G.R); mtn.position.set(G.x, gy - 0.5, G.z); base.add(mtn);
    var cap = new T.Mesh(capGeo, this.mat('snow')); cap.scale.set(G.R * 1.02, G.H * 1.01, G.R * 1.02); cap.position.set(G.x, gy - 0.5, G.z); base.add(cap);
    var wy = riverLevel(0), rot = Math.atan2(G.u.x, G.u.z);
    for (var gi = 0; gi < 6; gi++) {
      var t = gi / 5, gx = G.S.x + (G.x - G.S.x) * t * 0.85, gz = G.S.z + (G.z - G.S.z) * t * 0.85;
      var tongue = P(base, this.geo.blob, this.mat('glacier', gi % 2), 2.6 - t * 0.6, 0.9 + t * 0.6, 2.4, gx, wy + 0.2 + t * 6.5, gz);
      tongue.rotation.y = rot;
    }
    for (var ci = 0; ci < 6; ci++) {
      var cx = G.S.x + (ci % 3 - 1) * 1.2 - G.u.x * (0.5 + ci * 0.4), cz = G.S.z - G.u.z * (0.5 + ci * 0.4) + (ci % 2 - 0.5) * 1.1;
      P(base, this.geo.box, this.mat('glacier', ci % 2), 0.4, 0.3, 0.35, cx, wy + 0.12, cz).rotation.y = ci;
    }
    [[-2.6, 1.5], [2.4, 2.2], [-1.4, 3.6], [1.6, 4.2]].forEach(function (sr) {
      var sx = G.S.x + G.u.x * sr[1] - G.u.z * sr[0], sz = G.S.z + G.u.z * sr[1] + G.u.x * sr[0];
      P(base, self.geo.cone4, self.mat('glacier', 1), 0.6, 1.4 + sr[1] * 0.4, 0.6, sx, wy + 1.2 + sr[1] * 0.9, sz);
    });

    // The canyon: boulders along its walls, and a rope bridge across.
    var rocks = [], rr = rng(4141);
    RIVER.forEach(function (q, i) {
      var cd = canyonDepth(q.x, q.z);
      if (cd < 1.2 || i % 2) return;
      var q1 = RIVER[Math.min(RIVER.length - 1, i + 1)], dx = q1.x - q.x, dz = q1.z - q.z, l = Math.hypot(dx, dz) || 1;
      [-1, 1].forEach(function (sd) {
        for (var j = 0; j < 2; j++) {
          var off = RIVER_HALF + 1.6 + j * 1.6 + rr() * 0.8, x = q.x - dz / l * off * sd, z = q.z + dx / l * off * sd;
          rocks.push({ x: x, z: z, y: groundY(x, z), s: 0.7 + rr() * 0.9 * (cd / 3.6) });
        }
      });
    });
    if (!this.soft && rocks.length) {
      var im = new T.InstancedMesh(new T.IcosahedronGeometry(1, 0), this.mat('rock'), rocks.length), m4 = new T.Matrix4(), qn = new T.Quaternion();
      rocks.forEach(function (r, i) {
        qn.setFromEuler(new T.Euler(rr(), rr() * 6, rr()));
        im.setMatrixAt(i, m4.compose(new T.Vector3(r.x, r.y + r.s * 0.3, r.z), qn, new T.Vector3(r.s, r.s * 0.8, r.s)));
      });
      im.castShadow = im.receiveShadow = true;
      base.add(im);
    }
    var bi = 0, bd = 1e9;
    RIVER.forEach(function (q, i) { var d = Math.abs(Math.hypot(q.x, q.z) - 86); if (d < bd && i > 0 && i < RIVER.length - 1) { bd = d; bi = i; } });
    var bq = RIVER[bi], bq1 = RIVER[bi + 1], bdx = bq1.x - bq.x, bdz = bq1.z - bq.z, bl = Math.hypot(bdx, bdz) || 1, nx = -bdz / bl, nz = bdx / bl;
    var span = RIVER_HALF + 6.2, bridge = new T.Group();
    var ya = groundY(bq.x + nx * span, bq.z + nz * span), yb = groundY(bq.x - nx * span, bq.z - nz * span);
    for (var pl = 0; pl <= 20; pl++) {
      var t = pl / 20, x = bq.x + nx * span * (1 - 2 * t), z = bq.z + nz * span * (1 - 2 * t), y = ya + (yb - ya) * t - Math.sin(t * Math.PI) * 0.9 + 0.2;
      var plank = P(bridge, this.geo.box, this.mat('wood'), 0.32, 0.06, 1.1, x, y, z);
      plank.rotation.y = Math.atan2(nx, nz) + Math.PI / 2;
      if (pl % 4 === 0) [-0.55, 0.55].forEach(function (o) { P(bridge, self.geo.cyl6, self.mat('trunk'), 0.03, 0.7, 0.03, x + bdx / bl * o, y + 0.35, z + bdz / bl * o); });
    }
    base.add(bridge);
  };


  // ---- the church: built as the Bible is read ---------------------------
  // Every chapter read adds to it; each finished book lights one of 66 stained-glass windows
  // (the Old Testament's 39 along the nave, the New Testament's 27 in the chancel and tower).
  var BIBLE = [['Genesis', 50], ['Exodus', 40], ['Leviticus', 27], ['Numbers', 36], ['Deuteronomy', 34], ['Joshua', 24], ['Judges', 21], ['Ruth', 4],
    ['1 Samuel', 31], ['2 Samuel', 24], ['1 Kings', 22], ['2 Kings', 25], ['1 Chronicles', 29], ['2 Chronicles', 36], ['Ezra', 10], ['Nehemiah', 13],
    ['Esther', 10], ['Job', 42], ['Psalms', 150], ['Proverbs', 31], ['Ecclesiastes', 12], ['Song of Solomon', 8], ['Isaiah', 66], ['Jeremiah', 52],
    ['Lamentations', 5], ['Ezekiel', 48], ['Daniel', 12], ['Hosea', 14], ['Joel', 3], ['Amos', 9], ['Obadiah', 1], ['Jonah', 4], ['Micah', 7],
    ['Nahum', 3], ['Habakkuk', 3], ['Zephaniah', 3], ['Haggai', 2], ['Zechariah', 14], ['Malachi', 4], ['Matthew', 28], ['Mark', 16], ['Luke', 24],
    ['John', 21], ['Acts', 28], ['Romans', 16], ['1 Corinthians', 16], ['2 Corinthians', 13], ['Galatians', 6], ['Ephesians', 6], ['Philippians', 4],
    ['Colossians', 4], ['1 Thessalonians', 5], ['2 Thessalonians', 3], ['1 Timothy', 6], ['2 Timothy', 4], ['Titus', 3], ['Philemon', 1], ['Hebrews', 13],
    ['James', 5], ['1 Peter', 5], ['2 Peter', 3], ['1 John', 5], ['2 John', 1], ['3 John', 1], ['Jude', 1], ['Revelation', 22]];
  var BIBLE_TOTAL = 1189;
  var CHURCH_STAGES = [[1, 'A log chapel'], [40, 'Chapel roof and cross'], [70, 'Bell frame'], [100, 'A brick church'], [180, 'Brick church roof'], [250, 'White steeple'],
    [330, 'Picket-fenced yard'], [400, 'The stone church'], [450, 'Chancel'], [560, 'Bell tower'], [780, 'Belfry and bell'], [860, 'Spire'], [940, 'Porch and lychgate'],
    [1020, 'Churchyard'], [1110, 'Rose window'], [1189, 'Golden cross']];
  function bookIndex(name) {
    var n = String(name || '').toLowerCase().replace(/\s+/g, ' ').trim()
      .replace(/^(i{1,3})\s/, function (m, r) { return r.length + ' '; }).replace(/^psalm\b.*/, 'psalms').replace(/^song of songs/, 'song of solomon');
    for (var i = 0; i < BIBLE.length; i++) if (BIBLE[i][0].toLowerCase() === n) return i;
    return -1;
  }
  Town.prototype.addBible = function (ev, delay) {
    var B = this.st.bible, bi = bookIndex(ev.book);
    if (bi < 0) return;
    var total = BIBLE[bi][1], set = B.read[bi] = B.read[bi] || {}, before = B.chapters;
    var list = (ev.chapters || []).filter(function (c) { return c >= 1 && c <= total; });
    // No chapter numbers: count the next unread chapters of that book.
    for (var c = 1; list.length < (ev.count || 0) && c <= total; c++) if (!set[c] && list.indexOf(c) < 0) list.push(c);
    list.forEach(function (c) { if (!set[c]) { set[c] = true; B.chapters++; } });
    if (Object.keys(set).length >= total && B.books.indexOf(bi) < 0) B.books.push(bi);
    if (B.chapters !== before) { this.churchDirty = true; this.churchPop = !this.instant; }
    if (before < BIBLE_TOTAL && B.chapters >= BIBLE_TOTAL) {
      this.fireworks(60);
      if (this.onSecret) this.onSecret({ id: 'bible-complete', title: 'The whole Bible', big: true, text: 'Every chapter of every book, all 1,189. The church is finished, its golden cross is up, and the bells are ringing over Yukon.' }, ev);
    }
  };
  // Rebuilds the church from what's been read (cheap enough to redo whenever it changes).
  Town.prototype.buildChurch = function () {
    var B = this.st.bible, C = B.chapters, self = this, pick = 'church';
    this.churchDirty = false;
    if (B.group) { this.world.remove(B.group); this.picks = this.picks.filter(function (m) { return m.userData.pick !== pick; }); }
    if (!C) { B.group = null; return; }
    var g = new T.Group();
    g.position.set(CHURCH.x, groundY(CHURCH.x, CHURCH.z), CHURCH.z);
    g.rotation.y = Math.atan2(-CHURCH.x, -CHURCH.z); // the tower end faces town
    B.group = g;
    this.world.add(g);
    function P(geo, mat, sx, sy, sz, x, y, z) { return self.part(g, geo, mat, sx, sy, sz, x, y, z, pick); }
    var stone = function (i) { return self.mat('stone', i); }, slate = this.mat('keepRoof', 0), done = {};
    B.books.forEach(function (bi) { done[bi] = true; });
    function glass(bi) { return done[bi] ? self.mat('glass', bi) : self.mat('stoneDark'); }
    // A log chapel, then a brick church, before the stone church takes over at 400 chapters.
    if (C < 400) { this.smallChurch(P, C, B.books.length); return this.finishGrowth(g, 'churchPop'); }
    C = churchEff(C);
    // Foundations: the whole footprint, laid with the first chapter, and a gold cornerstone.
    P(this.geo.box, stone(2), 3.9, 0.25, 7.4, 0, 0.12, 0.3);
    P(this.geo.box, stone(2), 2.9, 0.25, 2.6, 0, 0.12, -4.6);
    P(this.geo.box, stone(2), 2.0, 0.25, 2.0, 0, 0.12, 4.9);
    P(this.geo.box, this.mat('gold'), 0.4, 0.3, 0.05, 1.3, 0.3, 4.0);
    // Nave walls rise a course every 25 chapters (full height at 200), with 20 lancets a side.
    var nh = Math.min(3, Math.ceil(C / 25) * 0.375);
    [-1, 1].forEach(function (sd) { P(self.geo.box, stone(0), 0.35, nh, 7.2, sd * 1.8, 0.25 + nh / 2, 0.3); });
    P(this.geo.box, stone(1), 3.6, nh, 0.35, 0, 0.25 + nh / 2, -3.15);
    P(this.geo.box, stone(1), 3.6, nh, 0.35, 0, 0.25 + nh / 2, 3.75);
    if (nh >= 2.3) for (var w = 0; w < 39; w++) {
      var sd = w < 20 ? -1 : 1, k = w < 20 ? w : w - 20, z = 3.35 - k * 0.34 - (sd > 0 ? 0.17 : 0);
      P(this.geo.box, glass(w), 0.06, 1.1, 0.2, sd * 1.99, 1.55, z);
    }
    if (C >= 200) P(this.geo.gable, slate, 2.45, 2.6, 4.95, 0, 3.25, 0.3);
    // Chancel at the east end: walls from 260, roof at 340, 15 New Testament windows.
    if (C >= 260) {
      var ch = Math.min(2.4, (C - 259) / 80 * 2.4);
      [-1, 1].forEach(function (sd) { P(self.geo.box, stone(0), 0.3, ch, 2.4, sd * 1.3, 0.25 + ch / 2, -4.6); });
      P(this.geo.box, stone(1), 2.9, ch, 0.3, 0, 0.25 + ch / 2, -5.75);
      if (ch >= 2.2) {
        for (var n = 0; n < 12; n++) { var s2 = n < 6 ? -1 : 1, k2 = n % 6; P(this.geo.box, glass(39 + n), 0.06, 0.9, 0.2, s2 * 1.47, 1.3, -3.7 - k2 * 0.36); }
        for (var e = 0; e < 3; e++) P(this.geo.box, glass(51 + e), 0.28, 1.3 - Math.abs(e - 1) * 0.3, 0.06, (e - 1) * 0.42, 1.45, -5.92);
      }
      if (C >= 340) P(this.geo.gable, slate, 1.85, 2.0, 1.75, 0, 2.65, -4.6);
    }
    // The tower at the west end, a stage every 60 chapters from 400, with 12 windows and a door.
    var top = 0.25;
    if (C >= 400) {
      var stages = Math.min(4, 1 + Math.floor((C - 400) / 60));
      for (var t = 0; t < stages; t++) {
        P(this.geo.box, stone(t % 3), 1.9, 1.3, 1.9, 0, 0.25 + 0.65 + t * 1.3, 4.9);
        P(this.geo.box, stone(2), 2.0, 0.1, 2.0, 0, 0.25 + 1.3 + t * 1.3, 4.9);
        if (t >= 1) [[0, 0.97, 0], [0.97, 0, Math.PI / 2], [0, -0.97, 0], [-0.97, 0, Math.PI / 2]].forEach(function (f, fi) {
          P(self.geo.box, glass(54 + (t - 1) * 4 + fi), 0.24, 0.6, 0.06, f[0], 0.25 + 0.7 + t * 1.3, 4.9 + f[1]).rotation.y = f[2];
        });
      }
      top = 0.25 + stages * 1.3;
      P(this.geo.box, this.mat('wood'), 0.6, 1.0, 0.06, 0, 0.75, 5.86);
    }
    if (C >= 700) {
      [[-0.85, -0.85], [0.85, -0.85], [-0.85, 0.85], [0.85, 0.85]].forEach(function (c2) { P(self.geo.box, stone(0), 0.3, 1.1, 0.3, c2[0], top + 0.55, 4.9 + c2[1]); });
      P(this.geo.box, stone(1), 2.0, 0.2, 2.0, 0, top + 1.2, 4.9);
      P(this.geo.cone, this.mat('gold'), 0.35, 0.55, 0.35, 0, top + 0.6, 4.9);
      top += 1.3;
      for (var bt = 0; bt < 8; bt++) { var ba = bt / 8 * Math.PI * 2; P(this.geo.box, stone(2), 0.22, 0.3, 0.22, Math.cos(ba) * 0.9, top + 0.1, 4.9 + Math.sin(ba) * 0.9); }
    }
    if (C >= 800) {
      P(this.geo.cone4, slate, 1.25, 4.8, 1.25, 0, top + 2.4, 4.9).rotation.y = Math.PI / 4;
      top += 4.8;
    }
    if (C >= 1189) {
      P(this.geo.box, this.mat('gold'), 0.1, 1.0, 0.1, 0, top + 0.5, 4.9);
      P(this.geo.box, this.mat('gold'), 0.55, 0.1, 0.1, 0, top + 0.7, 4.9);
    }
    // Porch and lychgate at 900, churchyard at 1000, rose window at 1100.
    if (C >= 900) {
      P(this.geo.box, stone(1), 1.2, 1.1, 0.9, 1.6, 0.8, 2.2);
      P(this.geo.gable, slate, 0.8, 0.7, 0.65, 1.6, 1.35, 2.2).rotation.y = Math.PI / 2;
      [-0.8, 0.8].forEach(function (x) { P(self.geo.box, self.mat('wood'), 0.14, 1.4, 0.14, x, 0.95, 8.6); });
      P(this.geo.gable, this.mat('roofTavern'), 1.1, 0.7, 0.55, 0, 1.65, 8.6).rotation.y = Math.PI / 2;
    }
    if (C >= 1000) {
      [[0, -7.4, 9.6, true], [-4.8, 0.6, 16, false], [4.8, 0.6, 16, false], [-2.9, 8.6, 3.6, true], [2.9, 8.6, 3.6, true]].forEach(function (wl) {
        P(self.geo.box, stone(wl[3] ? 1 : 0), wl[3] ? wl[2] : 0.3, 0.55, wl[3] ? 0.3 : wl[2], wl[0], 0.27, wl[1]);
      });
      [[-3.6, -6], [3.6, -6.2], [-3.8, 6.6], [3.7, 6.8]].forEach(function (y2) { P(self.geo.cone6, self.mat('pine', 1), 0.9, 2.4, 0.9, y2[0], 1.4, y2[1]); P(self.geo.cyl6, self.mat('trunk'), 0.12, 0.4, 0.12, y2[0], 0.2, y2[1]); });
      for (var gs = 0; gs < 10; gs++) { var gx = (gs % 2 ? 1 : -1) * (2.8 + (gs % 3) * 0.5), gz = -2.5 + Math.floor(gs / 2) * 1.6; P(this.geo.box, stone(gs % 3), 0.35, 0.5 + (gs % 3) * 0.1, 0.1, gx, 0.3, gz); }
    }
    if (C >= 1100) {
      P(this.geo.cyl, this.mat('stone', 2), 0.55, 0.08, 0.55, 0, 2.85, 5.88).rotation.x = Math.PI / 2;
      for (var rw = 0; rw < 8; rw++) { var ra = rw / 8 * Math.PI * 2; P(this.geo.box, this.mat('glass', rw), 0.16, 0.16, 0.05, Math.cos(ra) * 0.32, 2.85 + Math.sin(ra) * 0.32, 5.93); }
      P(this.geo.ball, this.mat('glass', 2), 0.13, 0.13, 0.05, 0, 2.85, 5.94);
    }
    this.finishGrowth(g, 'churchPop');
  };
  // A little settle-in bounce when the church or library grows (not during a full rebuild).
  Town.prototype.finishGrowth = function (g, flag) {
    if (this[flag]) { this[flag] = false; g.scale.set(1, 0.96, 1); this.animScaleVec(g, new T.Vector3(1, 1, 1), 0); }
    this.needsRender = true;
  };


  // ---- the library: built from the books you read ------------------------
  // Pages read raise it (walls, roof, portico, courtyard, cloisters, garden, dome, wings); every book
  // lights a window, and every five-star book plants a rose in the courtyard garden.
  var LIBRARY_STAGES = [[1, 'A log reading cabin'], [800, 'Cabin roof'], [1200, 'Porch and rocking chair'], [1500, 'A brick library'], [3000, 'Brick library roof'],
    [4000, 'Columned entrance'], [5000, 'Garden'], [6000, 'The grand library'], [9000, 'Columned portico'], [12000, 'Courtyard and fountain'], [16000, 'Cloisters'],
    [20000, 'Reading garden'], [26000, 'Copper dome'], [32000, 'East wing'], [40000, 'West wing'], [50000, 'The golden owl: the library is complete']];
  Town.prototype.addBook = function (ev, delay) {
    var L = this.st.library;
    L.books.push({ title: ev.title || 'Untitled', author: ev.author || '', pages: ev.pages || 0, stars: ev.stars, date: ev.date, month: ev.month || '', cover: ev.cover || '', review: ev.review || '', projected: !!ev.projected });
    var before = L.pages;
    L.pages += ev.pages || 0;
    this.libraryDirty = true;
    if (before < 50000 && L.pages >= 50000) {
      this.fireworks(60);
      if (this.onSecret) this.onSecret({ id: 'library-complete', title: 'The library is complete', big: true, text: '50,000 pages! The golden owl has landed on the courtyard fountain, and the library is finished.' }, ev);
    }
    this.libraryPop = !this.instant;
  };
  // A signpost holds the plot until the first book.
  Town.prototype.librarySign = function () {
    var g = new T.Group(), pick = 'library';
    g.position.set(LIBRARY.x, groundY(LIBRARY.x, LIBRARY.z), LIBRARY.z);
    g.rotation.y = facingSquare(LIBRARY);
    this.part(g, this.geo.cyl6, this.mat('wood'), 0.06, 1.3, 0.06, 0, 0.65, 4.5, pick);
    this.part(g, this.geo.box, this.mat('woodLight'), 1.0, 0.5, 0.06, 0, 1.2, 4.52, pick);
    this.part(g, this.geo.box, this.mat('stone', 2), 8.4, 0.12, 5.4, 0, 0.06, -0.5, pick);
    this.world.add(g);
    return g;
  };
  // Book colours by rating (used for the dragon's hoard).
  function spineColour(stars, i) {
    if (stars == null) return ['#8a7a66', '#6e6052', '#9a8c78'][i % 3];
    if (stars >= 5) return '#d9a62e';
    if (stars >= 4.5) return ['#9e2f2a', '#b5402e', '#8a2a3a'][i % 3];
    if (stars >= 4) return ['#2f6a4a', '#3a7a5a', '#295e52'][i % 3];
    if (stars >= 3.5) return ['#2f4f8a', '#3a5ea0', '#344a7a'][i % 3];
    return ['#6e5a7a', '#7a6a5a', '#5a5a6e'][i % 3];
  }
  Town.prototype.spineMat = function (hex) {
    this.spineMats = this.spineMats || {};
    if (!this.spineMats[hex]) { var m = new T.MeshToonMaterial({ gradientMap: this.toonSteps, color: hex }); m.userData = { name: 'spine', idx: 0, fixed: hex }; this.spineMats[hex] = m; }
    return this.spineMats[hex];
  };

  // ---- the cinema: films from your Letterboxd diary ----------------------------------
  // It starts as an outdoor movie night (a sheet screen, a projector and benches), then becomes a
  // little single-screen picture house that gains marquee lights, a popcorn cart, a neon sign, a
  // second screen and finally searchlights and a red carpet.
  var CINEMA_STEPS = [[1, 'An outdoor movie night'], [10, 'A little picture house'], [25, 'Marquee lights'], [50, 'A popcorn cart'], [100, 'A neon sign'], [200, 'A second screen'], [365, 'Searchlights and a red carpet']];
  Town.prototype.addMovie = function (ev) {
    var C = this.st.cinema;
    C.films.push({ title: ev.title, year: ev.year, stars: ev.stars, date: ev.date, rewatch: !!ev.rewatch, projected: !!ev.projected });
    this.cinemaDirty = true;
  };
  Town.prototype.buildCinema = function () {
    var C = this.st.cinema, self = this, pick = 'cinema', n = C.films.length;
    this.cinemaDirty = false;
    if (C.group) { if (C.group.parent) C.group.parent.remove(C.group); this.picks = this.picks.filter(function (m) { return m.userData.pick !== pick; }); C.group = null; }
    if (!n || !CINEMA) return;
    var g = C.group = new T.Group();
    g.position.set(CINEMA.x, groundY(CINEMA.x, CINEMA.z), CINEMA.z);
    g.rotation.y = facingSquare(CINEMA); // the doors face the town square
    this.world.add(g);
    function P(geo, mat, sx, sy, sz, x, y, z) { return self.part(g, geo, mat, sx, sy, sz, x, y, z, pick); }
    var glow = this.mat('lantern'), screen = this.screenMat || (this.screenMat = new T.MeshBasicMaterial({ color: '#f4f1e6' }));
    if (n < 10) {
      // Movie night: a white sheet between two poles, a projector on a crate, benches and string lights.
      [-1.5, 1.5].forEach(function (x) { P(self.geo.cyl6, self.mat('wood'), 0.06, 2.4, 0.06, x, 1.2, -1.2); });
      var sh = P(this.geo.box, screen, 2.9, 1.6, 0.04, 0, 1.45, -1.2); sh.material = screen;
      P(this.geo.box, this.mat('wood'), 0.5, 0.5, 0.5, 0, 0.25, 2.9);
      P(this.geo.box, this.mat('stoneDark'), 0.36, 0.26, 0.45, 0, 0.63, 2.9);
      P(this.geo.cyl, this.mat('stoneDark'), 0.1, 0.12, 0.1, 0, 0.66, 2.62).rotation.x = Math.PI / 2;
      for (var b = 0; b < Math.min(3, Math.ceil(n / 3)); b++) { P(this.geo.box, this.mat('wood'), 2.0, 0.08, 0.35, 0, 0.36, 0.6 + b * 0.75); [-0.85, 0.85].forEach(function (x) { P(self.geo.box, self.mat('trunk'), 0.08, 0.36, 0.3, x, 0.18, 0.6 + b * 0.75); }); }
      for (var l = 0; l < 9; l++) P(this.geo.ball, glow, 0.06, 0.06, 0.06, -1.5 + l * 0.375, 2.35 - Math.sin(l / 8 * Math.PI) * 0.2, -1.15);
      return;
    }
    // The picture house: a brick front with a canopy over the doors, posters either side.
    P(this.geo.box, this.mat('stone', 2), 4.0, 0.2, 3.4, 0, 0.1, 0);
    P(this.geo.box, this.mat('brick', 0), 3.6, 2.6, 3.0, 0, 1.4, -0.1);
    P(this.geo.box, this.mat('brick', 2), 3.8, 0.3, 3.2, 0, 2.85, -0.1);
    P(this.geo.box, this.mat('whitewood'), 1.8, 0.7, 0.1, 0, 3.3, 1.35);
    for (var lt = 0; lt < 5; lt++) P(this.geo.box, this.mat('stoneDark'), 0.18, 0.28, 0.04, -0.6 + lt * 0.3, 3.3, 1.42);
    P(this.geo.box, this.mat('roofJo'), 2.6, 0.22, 1.0, 0, 2.15, 1.75);
    P(this.geo.box, this.mat('trunk'), 1.1, 1.5, 0.06, 0, 0.95, 1.41);
    P(this.geo.box, this.mat('gold'), 0.04, 1.4, 0.07, 0, 0.95, 1.43);
    [-1.25, 1.25].forEach(function (x, i) {
      P(self.geo.box, self.mat('gold'), 0.62, 0.92, 0.05, x, 1.2, 1.41);
      P(self.geo.box, self.mat('flag', i ? 2 : 0), 0.52, 0.8, 0.06, x, 1.2, 1.42);
    });
    if (n >= 25) {
      for (var m = 0; m < 12; m++) P(this.geo.ball, glow, 0.06, 0.06, 0.06, -1.25 + m * (2.5 / 11), 2.03, 2.26);
      [-1.3, 1.3].forEach(function (x) { for (var mm = 0; mm < 3; mm++) P(self.geo.ball, glow, 0.06, 0.06, 0.06, x, 2.03, 1.3 + mm * 0.45); });
    }
    if (n >= 50) {
      var cart = new T.Group(); cart.position.set(2.6, 0, 2.2); cart.rotation.y = -0.5; g.add(cart);
      self.part(cart, self.geo.box, self.mat('roofJo'), 0.8, 0.6, 0.5, 0, 0.5, 0, pick);
      for (var cs = 0; cs < 4; cs++) self.part(cart, self.geo.box, self.mat('whitewood'), 0.1, 0.62, 0.52, -0.3 + cs * 0.2, 0.5, 0, pick);
      self.part(cart, self.geo.box, self.mat('glasshouse'), 0.7, 0.4, 0.45, 0, 1.0, 0, pick);
      for (var pc = 0; pc < 8; pc++) self.part(cart, self.geo.ball, self.mat('plaster', 0), 0.07, 0.07, 0.07, -0.25 + (pc % 4) * 0.16, 0.88 + Math.floor(pc / 4) * 0.08, (pc % 2) * 0.1 - 0.05, pick);
      [-0.3, 0.3].forEach(function (x) { self.part(cart, self.geo.torus, self.mat('stoneDark'), 0.14, 0.14, 0.14, x, 0.18, 0.28, pick); });
    }
    if (n >= 100) {
      P(this.geo.box, this.mat('stoneDark'), 0.3, 2.4, 0.3, 1.95, 3.0, 1.0);
      for (var ns = 0; ns < 6; ns++) P(this.geo.box, ns % 2 ? this.mat('flag', 2) : glow, 0.06, 0.28, 0.32, 2.12, 2.1 + ns * 0.36, 1.0);
    }
    if (n >= 200) {
      P(this.geo.box, this.mat('brick', 1), 2.4, 2.0, 2.6, -2.9, 1.1, -0.3);
      P(this.geo.box, this.mat('brick', 2), 2.6, 0.25, 2.8, -2.9, 2.2, -0.3);
      P(this.geo.box, this.mat('trunk'), 0.8, 1.2, 0.06, -2.9, 0.7, 1.01);
    }
    if (n >= 365) {
      P(this.geo.box, this.mat('roofJo'), 1.1, 0.03, 3.0, 0, 0.12, 3.2);
      [-1.4, 1.4].forEach(function (x) { var sl = P(self.geo.cyl, self.mat('stoneDark'), 0.25, 0.5, 0.25, x, 0.4, 4.4); sl.rotation.x = -0.4; P(self.geo.cyl, glow, 0.22, 0.05, 0.22, x, 0.62, 4.5).rotation.x = -0.4; });
      C.beams = true;
    }
  };

  Town.prototype.buildLibrary = function () {
    var L = this.st.library, P0 = L.pages, n = L.books.length, self = this, pick = 'library';
    this.libraryDirty = false;
    if (L.group) { this.world.remove(L.group); this.picks = this.picks.filter(function (m) { return m.userData.pick !== pick || m.userData.keep; }); }
    if (!n) { L.group = null; return; }
    if (L.sign) { this.retire(L.sign); L.sign.visible = false; }
    var g = new T.Group();
    g.position.set(LIBRARY.x, groundY(LIBRARY.x, LIBRARY.z), LIBRARY.z);
    g.rotation.y = facingSquare(LIBRARY); // the front faces the town square
    L.group = g;
    this.world.add(g);
    function P(geo, mat, sx, sy, sz, x, y, z) { return self.part(g, geo, mat, sx, sy, sz, x, y, z, pick); }
    var warm = function (i) { return self.mat('holdStone', i); }, tile = this.mat('shingle'), five = L.books.filter(function (b) { return b.stars >= 4.5; }).length; // 4.5 stars and up plant roses
    // A log reading cabin, then a brick library, before the grand library takes over at 6,000 pages.
    if (P0 < 6000) { this.smallLibrary(P, P0, n, five); return this.finishGrowth(g, 'libraryPop'); }
    P0 = libEff(P0);
    // A reading nook from the very first book: a bench under a lamp, a stack of books.
    P(this.geo.box, this.mat('stone', 2), 8.4, 0.25, 5.4, 0, 0.12, -0.5);
    P(this.geo.box, this.mat('wood'), 1.4, 0.1, 0.45, 2.8, 0.45, 3.4);
    [-0.55, 0.55].forEach(function (x) { P(self.geo.box, self.mat('wood'), 0.1, 0.45, 0.4, 2.8 + x, 0.22, 3.4); });
    P(this.geo.cyl6, this.mat('stoneDark'), 0.04, 1.6, 0.04, 3.8, 0.8, 3.4);
    P(this.geo.box, this.mat('lantern'), 0.18, 0.22, 0.18, 3.8, 1.65, 3.4);
    for (var bs = 0; bs < Math.min(6, n); bs++) P(this.geo.box, this.mat('glass', bs), 0.42, 0.09, 0.3, 2.3, 0.55 + bs * 0.09, 3.4).rotation.y = bs * 0.3;
    // Walls rise every 500 pages, full height (3.4) at 3,000, with 16 tall windows lit one per book.
    var wh = Math.min(3.4, Math.ceil(P0 / 500) * 0.567);
    [-1, 1].forEach(function (sd) { P(self.geo.box, warm(0), 0.4, wh, 5.0, sd * 4.0, 0.25 + wh / 2, -0.5); });
    P(this.geo.box, warm(1), 8.4, wh, 0.4, 0, 0.25 + wh / 2, 1.8);
    P(this.geo.box, warm(1), 8.4, wh, 0.4, 0, 0.25 + wh / 2, -2.8);
    if (wh >= 2.8) {
      var slots = [];
      for (var i = 0; i < 6; i++) slots.push([-3.2 + i * 1.28, 2.01, 0]);
      for (i = 0; i < 6; i++) slots.push([-3.2 + i * 1.28, -3.01, 0]);
      for (i = 0; i < 2; i++) { slots.push([4.21, -1.6 + i * 2.0, Math.PI / 2]); slots.push([-4.21, -1.6 + i * 2.0, Math.PI / 2]); }
      slots.forEach(function (sl, k) {
        if (Math.abs(sl[0]) < 0.8 && sl[1] > 0) return; // leave the door clear
        var lit = k < n, w = P(self.geo.box, lit ? self.mat('window') : self.mat('stoneDark'), 0.55, 1.5, 0.06, sl[0], 1.55, sl[1]); w.rotation.y = sl[2];
        var arch = P(self.geo.cyl, lit ? self.mat('window') : self.mat('stoneDark'), 0.28, 0.06, 0.28, sl[0], 2.3, sl[1]); arch.rotation.set(Math.PI / 2, sl[2], 0, 'YXZ');
      });
      P(this.geo.box, this.mat('wood'), 1.1, 1.8, 0.08, 0, 1.15, 2.02);
      P(this.geo.cyl, this.mat('wood'), 0.55, 0.08, 0.55, 0, 2.05, 2.02).rotation.x = Math.PI / 2;
    }
    var top = 0.25 + wh;
    if (P0 >= 3000) {
      P(this.geo.box, warm(2), 8.8, 0.2, 5.4, 0, top + 0.1, -0.5);
      P(this.geo.gable, tile, 5.4, 2.2, 3.5, 0, top + 0.2, -0.5).rotation.y = 0;
      // Two brick chimneys, smoking gently; dormer windows along the roof.
      L.chimneys = [];
      [[2.6, -1.6], [-2.6, 0.6]].forEach(function (cp) {
        P(self.geo.box, self.mat('brick', 0), 0.45, 1.4, 0.45, cp[0], top + 1.5, cp[1]);
        P(self.geo.box, self.mat('stone', 2), 0.55, 0.12, 0.55, cp[0], top + 2.24, cp[1]);
        var cm = new T.Object3D(); cm.position.set(cp[0], top + 2.35, cp[1]); g.add(cm); L.chimneys.push(cm);
      });
      [-1.6, 1.6].forEach(function (x) {
        P(self.geo.box, warm(1), 0.7, 0.55, 0.5, x, top + 0.8, 1.05);
        P(self.geo.gable, tile, 0.5, 0.35, 0.4, x, top + 1.07, 1.05);
        P(self.geo.box, self.mat('window'), 0.36, 0.3, 0.04, x, top + 0.78, 1.31);
      });
    }
    if (P0 >= 4500) {
      // Columned portico and steps at the front.
      P(this.geo.box, this.mat('stone', 2), 4.6, 0.15, 1.6, 0, 0.08, 2.9);
      P(this.geo.box, this.mat('stone', 1), 4.2, 0.15, 1.3, 0, 0.22, 2.8);
      for (var c = 0; c < 4; c++) P(this.geo.cyl, this.mat('plaster', 0), 0.16, 2.8, 0.16, -1.65 + c * 1.1, 1.7, 3.2);
      P(this.geo.box, warm(2), 4.4, 0.3, 1.4, 0, 3.2, 2.8);
      P(this.geo.gable, warm(1), 2.65, 0.9, 0.95, 0, 3.35, 2.8);
      // Lanterns either side of the door, and flower boxes under the front windows.
      [-0.95, 0.95].forEach(function (x) { P(self.geo.cyl6, self.mat('stoneDark'), 0.03, 0.4, 0.03, x, 2.35, 2.12); P(self.geo.box, self.mat('lantern'), 0.16, 0.22, 0.16, x, 2.05, 2.16); });
      [-3.2, -1.92, 1.92, 3.2].forEach(function (x, i) {
        P(self.geo.box, self.mat('wood'), 0.7, 0.14, 0.18, x, 0.72, 2.12);
        for (var fl = 0; fl < 4; fl++) P(self.geo.ball, self.mat('flag', (fl + i) % 5), 0.07, 0.07, 0.07, x - 0.24 + fl * 0.16, 0.83, 2.13);
        P(self.geo.blob, self.mat('hedge'), 0.3, 0.1, 0.1, x, 0.68, 2.2);
      });
    }
    if (P0 >= 6000) {
      // A paved courtyard behind, with a fountain.
      P(this.geo.box, this.mat('cobble'), 8.4, 0.05, 7.0, 0, 0.03, -6.4);
      P(this.geo.cyl, this.mat('stone', 0), 0.9, 0.35, 0.9, 0, 0.2, -6.4);
      P(this.geo.cyl, this.mat('water'), 0.8, 0.05, 0.8, 0, 0.38, -6.4);
      P(this.geo.cyl, this.mat('stone', 1), 0.12, 0.9, 0.12, 0, 0.75, -6.4);
      P(this.geo.ball, this.mat('water'), 0.18, 0.28, 0.18, 0, 1.25, -6.4);
    }
    if (P0 >= 8000) {
      // Cloister arcades round three sides of the courtyard.
      [[-4.0, -6.4, 7.0, true], [4.0, -6.4, 7.0, true], [0, -9.9, 8.4, false]].forEach(function (cl) {
        var along = cl[2], vert = cl[3];
        P(self.geo.box, tile, vert ? 1.3 : along, 0.07, vert ? along : 1.3, cl[0] + (vert ? (cl[0] > 0 ? 0 : 0) : 0), 2.2, cl[1]).rotation[vert ? 'z' : 'x'] = (vert ? (cl[0] > 0 ? 0.25 : -0.25) : 0.25);
        for (var a2 = 0; a2 < Math.round(along / 1.1); a2++) {
          var t = -along / 2 + 0.55 + a2 * 1.1;
          P(self.geo.cyl, self.mat('plaster', 0), 0.09, 1.9, 0.09, vert ? cl[0] - Math.sign(cl[0]) * 0.55 : t, 1.0, vert ? cl[1] + t : cl[1] + 0.55);
        }
        P(self.geo.box, warm(0), vert ? 0.25 : along, 2.0, vert ? along : 0.25, vert ? cl[0] + Math.sign(cl[0]) * 0.55 : 0, 1.05, vert ? cl[1] : cl[1] - 0.55);
      });
    }
    // Roses for every five-star book: by the door at first, in the courtyard garden once it exists.
    var roses = Math.min(P0 >= 6000 ? 24 : 6, five);
    for (var r = 0; r < roses; r++) {
      var rx, rz;
      if (P0 >= 6000) { var ra = r / 24 * Math.PI * 2; rx = Math.cos(ra) * (1.6 + (r % 2) * 0.5); rz = -6.4 + Math.sin(ra) * (1.6 + (r % 2) * 0.5); }
      else { rx = (r % 2 ? 1 : -1) * (1.0 + Math.floor(r / 2) * 0.45); rz = 2.4; }
      P(this.geo.blob, this.mat('hedge'), 0.22, 0.2, 0.22, rx, 0.2, rz);
      P(this.geo.ball, this.mat('flag', r % 3 ? 0 : 4), 0.08, 0.08, 0.08, rx + 0.06, 0.38, rz);
    }
    if (P0 >= 10000) {
      // The reading garden: a big old oak, benches and lanterns.
      // A modest old apple tree in the corner, with fruit.
      P(this.geo.cyl6, this.mat('trunk'), 0.18, 1.3, 0.18, 2.6, 0.65, -8.2);
      P(this.geo.blob, this.mat('hedge'), 0.75, 0.62, 0.75, 2.6, 1.75, -8.2);
      for (var ap = 0; ap < 6; ap++) P(this.geo.ball, this.mat('flag', 0), 0.07, 0.07, 0.07, 2.6 + Math.cos(ap) * 0.6, 1.6 + (ap % 3) * 0.2, -8.2 + Math.sin(ap) * 0.6);
      [[-2.4, -5.0], [-2.4, -7.8], [1.2, -4.2]].forEach(function (b2) {
        P(self.geo.box, self.mat('wood'), 1.0, 0.08, 0.35, b2[0], 0.4, b2[1]);
        P(self.geo.cyl6, self.mat('stoneDark'), 0.03, 1.2, 0.03, b2[0] + 0.7, 0.6, b2[1]);
        P(self.geo.box, self.mat('lantern'), 0.14, 0.16, 0.14, b2[0] + 0.7, 1.25, b2[1]);
      });
    }
    if (P0 >= 13000) {
      // A little reading-room cupola on the ridge: lit windows, a copper cap, a weathervane.
      P(this.geo.cyl6, warm(2), 0.75, 0.9, 0.75, 0, top + 2.35, -0.5);
      for (var dw = 0; dw < 6; dw++) { var da = dw / 6 * Math.PI * 2 + Math.PI / 6; P(this.geo.box, this.mat('window'), 0.26, 0.42, 0.05, Math.cos(da) * 0.66, top + 2.38, -0.5 + Math.sin(da) * 0.66).rotation.y = -da + Math.PI / 2; }
      P(this.geo.cone6, this.mat('copper'), 0.95, 0.8, 0.95, 0, top + 3.2, -0.5);
      P(this.geo.cyl6, this.mat('stoneDark'), 0.02, 0.5, 0.02, 0, top + 3.8, -0.5);
      P(this.geo.box, this.mat('stoneDark'), 0.3, 0.08, 0.02, 0.06, top + 3.95, -0.5);
    }
    [[17000, 1], [22000, -1]].forEach(function (wg) {
      if (P0 < wg[0]) return;
      var x = wg[1] * 6.0;
      P(self.geo.box, warm(1), 3.4, 2.6, 4.0, x, 1.55, -0.3);
      P(self.geo.gable, tile, 2.3, 1.4, 2.75, x, 2.85, -0.3);
      for (var ww = 0; ww < 3; ww++) {
        P(self.geo.box, self.mat('window'), 0.45, 1.2, 0.06, x - 1.0 + ww, 1.5, 1.72);
        P(self.geo.box, self.mat('wood'), 0.55, 0.1, 0.15, x - 1.0 + ww, 0.86, 1.78);
        for (var fl2 = 0; fl2 < 3; fl2++) P(self.geo.ball, self.mat('flag', (fl2 + ww) % 5), 0.06, 0.06, 0.06, x - 1.15 + ww + fl2 * 0.15, 0.95, 1.79);
      }
      // Ivy climbing the corner.
      for (var iv = 0; iv < 5; iv++) P(self.geo.blob, self.mat('hedge'), 0.32, 0.38, 0.18, x + wg[1] * 1.55, 0.4 + iv * 0.48, 1.62 - (iv % 2) * 0.2);
    });
    if (P0 >= 30000) {
      // A stone sundial out in the garden, and ivy all over the front.
      P(this.geo.cyl6, this.mat('stone', 1), 0.22, 0.75, 0.22, -2.4, 0.4, -9.0);
      P(this.geo.cyl, this.mat('stone', 2), 0.42, 0.06, 0.42, -2.4, 0.8, -9.0);
      P(this.geo.box, this.mat('copper'), 0.03, 0.22, 0.28, -2.4, 0.92, -9.0).rotation.x = 0.5;
      [-3.9, -3.3, 3.3, 3.9].forEach(function (x, i) { for (var iv2 = 0; iv2 < 4; iv2++) P(self.geo.blob, self.mat('hedge'), 0.3, 0.36, 0.15, x, 0.5 + iv2 * 0.55, 2.02 + (iv2 % 2) * 0.05); });
    }
    this.finishGrowth(g, 'libraryPop');
  };


  // ---- small-town beginnings for the church and library -----------------
  // Both start small and grow up: a log building first, then brick, then the grand stone ones.
  // The grand builders work in their own scale, so later progress maps onto it.
  function piecewise(x, from, to) {
    if (x <= from[0]) return to[0];
    for (var i = 1; i < from.length; i++) if (x <= from[i]) return to[i - 1] + (to[i] - to[i - 1]) * (x - from[i - 1]) / (from[i] - from[i - 1]);
    return to[to.length - 1];
  }
  function churchEff(C) { return piecewise(C, [400, 450, 500, 560, 700, 780, 860, 940, 1020, 1110, 1189], [200, 260, 340, 400, 580, 700, 800, 900, 1000, 1100, 1189]); }
  function libEff(P) { return piecewise(P, [6000, 9000, 12000, 16000, 20000, 26000, 32000, 40000, 50000], [3000, 4500, 6000, 8000, 10000, 13000, 17000, 22000, 30000]); }
  // Interlocking log walls: rows alternate front/back and sides, like a cabin.
  Town.prototype.logWalls = function (P, w, d, rows) {
    for (var r = 0; r < rows; r++) {
      var y = 0.34 + r * 0.28, m = this.mat('logwood', r % 2);
      [-1, 1].forEach(function (sd) {
        P(this.geo.cyl6, m, 0.15, w + 0.5, 0.15, 0, y, sd * d / 2).rotation.z = Math.PI / 2;
        P(this.geo.cyl6, this.mat('logwood', (r + 1) % 2), 0.15, d + 0.5, 0.15, sd * w / 2, y + 0.14, 0).rotation.x = Math.PI / 2;
      }, this);
    }
    return 0.34 + rows * 0.28;
  };
  Town.prototype.smallChurch = function (P, C, books) {
    var self = this, stone = function (i) { return self.mat('stone', i); };
    if (C < 100) {
      // A log chapel: walls rise a log every few chapters, then a plank roof and cross, then a bell.
      P(this.geo.box, stone(2), 3.8, 0.2, 5.0, 0, 0.1, 0);
      var top = this.logWalls(P, 3.2, 4.4, Math.min(10, Math.ceil(C / 4)));
      if (top > 2) P(this.geo.box, this.mat('trunk'), 0.7, 1.4, 0.08, 0, 0.9, 2.25);
      if (top > 2.6) [-1, 1].forEach(function (sd) { [-0.9, 0.9].forEach(function (z, k) { P(self.geo.box, k < books ? self.mat('window') : self.mat('stoneDark'), 0.06, 0.45, 0.45, sd * 1.72, 1.7, z); }); });
      if (C >= 40) {
        P(this.geo.gable, this.mat('wood'), 2.25, 1.7, 3.4, 0, top, 0);
        P(this.geo.box, this.mat('woodLight'), 0.1, 0.9, 0.1, 0, top + 1.6, 2.3);
        P(this.geo.box, this.mat('woodLight'), 0.45, 0.1, 0.1, 0, top + 1.8, 2.3);
      }
      if (C >= 70) {
        [-0.5, 0.5].forEach(function (x) { P(self.geo.box, self.mat('logwood', 0), 0.14, 2.2, 0.14, 2.7 + x, 1.1, 1.6); });
        P(this.geo.box, this.mat('logwood', 1), 1.3, 0.14, 0.14, 2.7, 2.2, 1.6);
        P(this.geo.cone, this.mat('gold'), 0.22, 0.35, 0.22, 2.7, 1.9, 1.6);
      }
      return;
    }
    // A red-brick church with white trim; a white steeple at 250, a picket-fenced yard at 330.
    var wh = Math.min(3.2, 1.6 + (C - 100) / 80 * 1.6);
    P(this.geo.box, stone(2), 4.6, 0.2, 7.2, 0, 0.1, 0);
    [-1, 1].forEach(function (sd) { P(self.geo.box, self.mat('brick', 0), 0.35, wh, 6.6, sd * 2.0, 0.2 + wh / 2, 0); });
    P(this.geo.box, this.mat('brick', 1), 4.35, wh, 0.35, 0, 0.2 + wh / 2, 3.3);
    P(this.geo.box, this.mat('brick', 2), 4.35, wh, 0.35, 0, 0.2 + wh / 2, -3.3);
    P(this.geo.box, this.mat('plaster', 0), 1.1, 1.8, 0.06, 0, 1.1, 3.5);
    P(this.geo.box, this.mat('wood'), 0.9, 1.6, 0.08, 0, 1.0, 3.52);
    P(this.geo.box, stone(1), 1.6, 0.2, 0.8, 0, 0.1, 3.9);
    if (wh >= 2.6) for (var k = 0; k < 8; k++) {
      var sd = k < 4 ? -1 : 1, z = -2.2 + (k % 4) * 1.45;
      P(this.geo.box, this.mat('plaster', 0), 0.08, 1.6, 0.6, sd * 2.19, 1.75, z);
      P(this.geo.box, k < books ? this.mat('glass', k) : this.mat('stoneDark'), 0.07, 1.35, 0.42, sd * 2.22, 1.75, z);
    }
    var ridge = 0.2 + wh;
    if (C >= 180) P(this.geo.gable, this.mat('shingle'), 2.75, 2.4, 4.6, 0, ridge, 0);
    if (C >= 250) {
      P(this.geo.box, this.mat('whitewood'), 1.3, 2.0, 1.3, 0, ridge + 1.0, 2.5);
      [[0, 0.66, 0], [0.66, 0, Math.PI / 2], [0, -0.66, 0], [-0.66, 0, Math.PI / 2]].forEach(function (f) { P(self.geo.box, self.mat('shingle'), 0.5, 0.7, 0.04, f[0], ridge + 1.4, 2.5 + f[1]).rotation.y = f[2]; });
      P(this.geo.cone4, this.mat('shingle'), 0.95, 2.6, 0.95, 0, ridge + 3.3, 2.5).rotation.y = Math.PI / 4;
      P(this.geo.box, this.mat('gold'), 0.08, 0.7, 0.08, 0, ridge + 4.9, 2.5);
      P(this.geo.box, this.mat('gold'), 0.36, 0.08, 0.08, 0, ridge + 5.0, 2.5);
    }
    if (C >= 330) {
      [[0, -4.6, 7.6, true], [-3.8, 0.4, 10, false], [3.8, 0.4, 10, false], [-2.4, 5.4, 2.8, true], [2.4, 5.4, 2.8, true]].forEach(function (f) {
        var len = f[2], n = Math.round(len / 0.4);
        for (var i = 0; i <= n; i++) { var t = i / n - 0.5; P(self.geo.box, self.mat('whitewood'), 0.07, 0.55, 0.07, f[3] ? f[0] + t * len : f[0], 0.28, f[3] ? f[1] : f[1] + t * len); }
        P(self.geo.box, self.mat('whitewood'), f[3] ? len : 0.05, 0.05, f[3] ? 0.05 : len, f[0], 0.42, f[1]);
      });
      P(this.geo.cyl6, this.mat('trunk'), 0.15, 1.2, 0.15, -2.9, 0.6, -3.4);
      P(this.geo.blob, this.mat('leaf', 0), 0.9, 0.8, 0.9, -2.9, 1.7, -3.4);
    }
  };
  Town.prototype.smallLibrary = function (P, P0, n, five) {
    var self = this;
    // The reading nook comes with the first book either way.
    P(this.geo.box, this.mat('wood'), 1.4, 0.1, 0.45, 2.8, 0.45, 3.4);
    [-0.55, 0.55].forEach(function (x) { P(self.geo.box, self.mat('wood'), 0.1, 0.45, 0.4, 2.8 + x, 0.22, 3.4); });
    P(this.geo.cyl6, this.mat('stoneDark'), 0.04, 1.6, 0.04, 3.8, 0.8, 3.4);
    P(this.geo.box, this.mat('lantern'), 0.18, 0.22, 0.18, 3.8, 1.65, 3.4);
    for (var bs = 0; bs < Math.min(6, n); bs++) P(this.geo.box, this.mat('glass', bs), 0.42, 0.09, 0.3, 2.3, 0.55 + bs * 0.09, 3.4).rotation.y = bs * 0.3;
    if (P0 < 1500) {
      // A log reading cabin: roof at 800 pages, a porch with a rocking chair at 1,200.
      P(this.geo.box, this.mat('stone', 2), 3.8, 0.2, 3.4, 0, 0.1, 0);
      var top = this.logWalls(P, 3.2, 2.8, Math.min(9, Math.ceil(P0 / 90)));
      if (top > 2) P(this.geo.box, this.mat('trunk'), 0.7, 1.4, 0.08, 0.6, 0.9, 1.45);
      if (top > 2.3) [[-0.7, 1.46, 0], [1.66, 0, Math.PI / 2], [-1.66, 0, Math.PI / 2], [0.4, -1.46, 0]].forEach(function (w, k) {
        P(self.geo.box, k < n ? self.mat('window') : self.mat('stoneDark'), 0.5, 0.45, 0.06, w[0], 1.6, w[1]).rotation.y = w[2];
      });
      if (P0 >= 800) {
        P(this.geo.gable, this.mat('wood'), 2.25, 1.6, 2.2, 0, top, 0).rotation.y = Math.PI / 2;
        P(this.geo.box, this.mat('stone', 1), 0.5, 1.6, 0.5, -1.2, top + 0.6, -0.6);
      }
      if (P0 >= 1200) {
        P(this.geo.box, this.mat('wood'), 3.4, 0.12, 1.2, 0, 0.3, 2.1);
        [-1.5, 1.5].forEach(function (x) { P(self.geo.box, self.mat('logwood', 0), 0.12, 1.9, 0.12, x, 1.2, 2.6); });
        P(this.geo.box, this.mat('wood'), 3.6, 0.1, 1.4, 0, 2.15, 2.2).rotation.x = 0.25;
        P(this.geo.box, this.mat('wood'), 0.5, 0.06, 0.5, -0.9, 0.62, 2.2);
        P(this.geo.box, this.mat('wood'), 0.5, 0.6, 0.06, -0.9, 0.95, 1.98);
        P(this.geo.torus, this.mat('wood'), 0.28, 0.28, 0.28, -0.9, 0.4, 2.2).rotation.y = Math.PI / 2;
        P(this.geo.box, this.mat('lantern'), 0.16, 0.2, 0.16, 1.3, 1.7, 2.6);
      }
      return;
    }
    // A small brick library: walls up by 3,000 pages, a hipped roof, a columned entrance at 4,000,
    // a garden at 5,000.
    var wh = Math.min(3.0, 1.8 + (P0 - 1500) / 1500 * 1.2);
    P(this.geo.box, this.mat('stone', 2), 6.2, 0.2, 5.0, 0, 0.1, 0);
    [-1, 1].forEach(function (sd) { P(self.geo.box, self.mat('brick', 0), 0.35, wh, 4.4, sd * 2.8, 0.2 + wh / 2, 0); });
    P(this.geo.box, this.mat('brick', 1), 5.95, wh, 0.35, 0, 0.2 + wh / 2, 2.05);
    P(this.geo.box, this.mat('brick', 2), 5.95, wh, 0.35, 0, 0.2 + wh / 2, -2.05);
    P(this.geo.box, this.mat('wood'), 1.0, 1.7, 0.08, 0, 1.05, 2.25);
    [[-1.9, 2.24, 0], [-0.95, 2.24, 0], [0.95, 2.24, 0], [1.9, 2.24, 0], [-1.6, -2.24, 0], [0, -2.24, 0], [1.6, -2.24, 0], [2.99, 0, Math.PI / 2], [-2.99, 0, Math.PI / 2]].forEach(function (w, k) {
      if (wh < 2.4) return;
      P(self.geo.box, self.mat('plaster', 0), 0.62, 1.5, 0.05, w[0], 1.55, w[1]).rotation.y = w[2];
      P(self.geo.box, k < n ? self.mat('window') : self.mat('stoneDark'), 0.5, 1.35, 0.07, w[0], 1.55, w[1]).rotation.y = w[2];
    });
    var top = 0.2 + wh;
    if (P0 >= 3000) {
      P(this.geo.box, this.mat('plaster', 0), 6.3, 0.25, 4.8, 0, top + 0.12, 0);
      var hip = P(this.geo.cone4, this.mat('shingle'), 4.5, 1.6, 3.6, 0, top + 1.05, 0); hip.rotation.y = Math.PI / 4;
    }
    if (P0 >= 4000) {
      P(this.geo.box, this.mat('stone', 1), 2.6, 0.18, 1.2, 0, 0.09, 2.8);
      [-0.8, 0.8].forEach(function (x) { P(self.geo.cyl, self.mat('plaster', 0), 0.14, 2.4, 0.14, x, 1.4, 3.1); });
      P(this.geo.box, this.mat('plaster', 0), 2.2, 0.25, 1.0, 0, 2.7, 2.75);
      P(this.geo.gable, this.mat('plaster', 1), 1.35, 0.8, 0.7, 0, 2.82, 2.75);
    }
    if (P0 >= 5000) {
      [[-3.8, 2.6], [3.8, 2.6]].forEach(function (h) { P(self.geo.box, self.mat('hedge'), 1.4, 0.45, 0.6, h[0], 0.22, h[1]); });
      P(this.geo.cyl6, this.mat('trunk'), 0.15, 1.2, 0.15, -3.6, 0.6, -1.8);
      P(this.geo.blob, this.mat('leaf', 2), 0.9, 0.8, 0.9, -3.6, 1.7, -1.8);
      for (var r = 0; r < Math.min(6, five); r++) { P(this.geo.blob, this.mat('hedge'), 0.2, 0.18, 0.2, -1.6 + r * 0.32 + (r > 2 ? 1.9 : 0), 0.18, 2.7); P(this.geo.ball, this.mat('flag', 0), 0.07, 0.07, 0.07, -1.6 + r * 0.32 + (r > 2 ? 1.9 : 0), 0.34, 2.75); }
    }
  };

  // ---- Jo the fox and the raccoon -----------------------------------------
  // Little animals that roam a ring of ground: the fox around Jo's house, the raccoon around
  // whichever castle is being built right now.
  Town.prototype.critter = function (kind) {
    var g = new T.Group(), self = this, fox = kind === 'fox', pick = fox ? 'fox' : 'raccoon', name = fox ? 'fox' : 'coon', m = this.mat(name, 0);
    function P(geo, mat, sx, sy, sz, x, y, z, par) { return self.part(par || g, geo, mat, sx, sy, sz, x, y, z, pick); }
    var dark = this.mat(name, fox ? 2 : 1), light = this.mat(name, fox ? 1 : 2);
    if (fox) return this.foxCritter(g, P, m, dark, light);
    var body = new T.Group(); body.position.y = 0.3; g.add(body);
    P(this.geo.box, m, 0.26, 0.24, 0.55, 0, 0, 0, body);
    var head = new T.Group(); head.position.set(0, 0.12, 0.34); body.add(head);
    P(this.geo.box, m, 0.24, 0.2, 0.2, 0, 0, 0, head);
    P(this.geo.box, fox ? light : m, 0.12, 0.1, 0.16, 0, -0.04, 0.15, head);
    P(this.geo.box, dark, 0.05, 0.05, 0.05, 0, -0.02, 0.24, head);
    [-0.08, 0.08].forEach(function (x) { P(self.geo.cone4, fox ? m : dark, 0.05, 0.12, 0.04, x, 0.15, -0.02, head); });
    if (!fox) { P(this.geo.box, dark, 0.26, 0.06, 0.05, 0, 0.02, 0.1, head); P(this.geo.box, light, 0.1, 0.05, 0.05, 0, 0.08, 0.1, head); }
    if (!fox) {
      // Scruff: white brows, puffed-out cheek ruffs, a tuft on top, ragged fur down the back and sides.
      [-1, 1].forEach(function (sd) {
        P(self.geo.box, light, 0.07, 0.025, 0.03, sd * 0.07, 0.065, 0.1, head).rotation.z = sd * -0.25;
        var ruff = P(self.geo.box, light, 0.07, 0.09, 0.09, sd * 0.135, -0.04, 0.02, head); ruff.rotation.z = sd * 0.5; ruff.rotation.y = sd * 0.3;
        P(self.geo.box, m, 0.05, 0.06, 0.06, sd * 0.15, 0.0, -0.05, head).rotation.z = sd * 0.7;
        [-0.15, 0.02, 0.17].forEach(function (z, i) { var tf = P(self.geo.box, i % 2 ? dark : m, 0.05, 0.07, 0.08, sd * 0.13, -0.06 + i * 0.02, z, body); tf.rotation.z = sd * (0.5 + i * 0.15); tf.rotation.x = i * 0.3; });
      });
      [[-0.02, 0.11, 0.0, 0.3], [0.03, 0.12, -0.12, -0.4], [-0.03, 0.12, -0.22, 0.5], [0.02, 0.11, 0.12, -0.2]].forEach(function (t, i) {
        var tf = P(self.geo.box, i % 2 ? dark : m, 0.08, 0.06, 0.07, t[0], t[1], t[2], body); tf.rotation.z = t[3]; tf.rotation.x = t[3] * 0.6;
      });
      var tuft = P(this.geo.cone4, m, 0.05, 0.08, 0.04, 0.02, 0.13, -0.02, head); tuft.rotation.z = -0.4;
      P(this.geo.box, light, 0.2, 0.06, 0.32, 0, -0.12, 0.02, body); // pale belly
    }
    var tail = new T.Group(); tail.position.set(0, 0.05, -0.28); body.add(tail);
    if (fox) { P(this.geo.box, m, 0.13, 0.13, 0.4, 0, 0.03, -0.2, tail); P(this.geo.box, light, 0.12, 0.12, 0.1, 0, 0.03, -0.42, tail); }
    else for (var r = 0; r < 6; r++) { var ts = 0.15 - Math.abs(r - 2) * 0.012; P(this.geo.box, r % 2 ? dark : m, ts, ts, 0.09, 0, 0.02 + r * 0.004, -0.05 - r * 0.085, tail).rotation.z = r * 0.35; }
    tail.rotation.x = 0.4;
    var legs = [[-0.09, 0.18], [0.09, 0.18], [-0.09, -0.18], [0.09, -0.18]].map(function (l) {
      var hip = new T.Group(); hip.position.set(l[0], 0.2, l[1]); g.add(hip);
      P(self.geo.box, dark, 0.06, 0.2, 0.06, 0, -0.1, 0, hip);
      return hip;
    });
    g.scale.setScalar(fox ? 1.4 : 1.3);
    this.world.add(g);
    return { g: g, body: body, head: head, legs: legs, tail: tail, kind: kind, cx: null, cz: null, rIn: 2, rOut: 4, tx: 0, tz: 0, wait: 0, phase: 0, seed: fox ? 3 : 7, speed: fox ? 1.1 : 0.75 };
  };
  // Jo the fox: slim and long-legged, a fine pointed snout, tall ears, lashes, a daisy tucked
  // behind one ear and a big plume of a tail.
  Town.prototype.foxCritter = function (g, P, m, dark, light) {
    var self = this, body = new T.Group(); body.position.y = 0.37; g.add(body);
    P(this.geo.box, m, 0.17, 0.17, 0.48, 0, 0, 0, body);
    P(this.geo.box, light, 0.12, 0.1, 0.16, 0, -0.06, 0.17, body);            // cream chest
    var head = new T.Group(); head.position.set(0, 0.13, 0.29); body.add(head);
    P(this.geo.box, m, 0.17, 0.15, 0.16, 0, 0, 0, head);
    [-1, 1].forEach(function (sd) { P(self.geo.box, light, 0.05, 0.07, 0.1, sd * 0.065, -0.04, 0.04, head); }); // cheeks
    P(this.geo.box, light, 0.07, 0.06, 0.17, 0, -0.035, 0.14, head);          // long slim snout
    P(this.geo.box, dark, 0.035, 0.035, 0.03, 0, -0.025, 0.23, head);          // nose
    [-1, 1].forEach(function (sd) {
      P(self.geo.cone4, m, 0.045, 0.17, 0.035, sd * 0.055, 0.15, -0.02, head);   // tall ears
      P(self.geo.cone4, dark, 0.025, 0.1, 0.02, sd * 0.055, 0.14, 0.0, head);
      P(self.geo.box, self.mat('swan', 2), 0.03, 0.028, 0.02, sd * 0.048, 0.03, 0.085, head); // eyes
      var lash = P(self.geo.box, self.mat('swan', 2), 0.04, 0.008, 0.012, sd * 0.06, 0.05, 0.09, head); lash.rotation.z = sd * 0.5;
    });
    // A daisy behind her ear.
    var fl = new T.Group(); fl.position.set(0.085, 0.13, -0.01); head.add(fl);
    for (var pe = 0; pe < 5; pe++) { var a = pe / 5 * Math.PI * 2; P(self.geo.ball, self.mat('swan', 0), 0.022, 0.022, 0.014, Math.cos(a) * 0.026, Math.sin(a) * 0.026, 0, fl); }
    P(this.geo.ball, this.mat('flag', 1), 0.017, 0.017, 0.016, 0, 0, 0.006, fl);
    fl.rotation.y = Math.PI / 2;
    // The tail: a big soft plume, fuller in the middle, with a white tip.
    var tail = new T.Group(); tail.position.set(0, 0.03, -0.24); body.add(tail);
    [[0.08, -0.06], [0.12, -0.16], [0.15, -0.27], [0.14, -0.38], [0.1, -0.47]].forEach(function (seg, i) { P(self.geo.box, i === 4 ? light : m, seg[0], seg[0], 0.12, 0, 0.02 + i * 0.012, seg[1], tail); });
    tail.rotation.x = 0.55;
    var legs = [[-0.055, 0.17], [0.055, 0.17], [-0.055, -0.17], [0.055, -0.17]].map(function (l) {
      var hip = new T.Group(); hip.position.set(l[0], 0.3, l[1]); g.add(hip);
      P(self.geo.box, m, 0.042, 0.18, 0.042, 0, -0.09, 0, hip);
      P(self.geo.box, dark, 0.045, 0.13, 0.045, 0, -0.235, 0, hip);         // dark stockings
      return hip;
    });
    g.scale.setScalar(1.35);
    this.world.add(g);
    return { g: g, body: body, head: head, legs: legs, tail: tail, kind: 'fox', cx: null, cz: null, rIn: 2, rOut: 4, tx: 0, tz: 0, wait: 0, phase: 0, seed: 3, speed: 1.1 };
  };
  Town.prototype.placeCritter = function (key, cx, cz, rIn, rOut) {
    var c = this.st.critters[key] || (this.st.critters[key] = this.critter(key === 'fox' ? 'fox' : 'raccoon'));
    if (c.cx === cx && c.cz === cz) return c;
    c.cx = cx; c.cz = cz; c.rIn = rIn; c.rOut = rOut;
    var a = c.seed, rr = (rIn + rOut) / 2;
    c.g.position.set(cx + Math.cos(a) * rr, 0, cz + Math.sin(a) * rr);
    c.g.position.y = groundY(c.g.position.x, c.g.position.z);
    c.tx = c.g.position.x; c.tz = c.g.position.z;
    if (!this.instant) this.pop(c.g, 400);
    return c;
  };
  Town.prototype.stepCritters = function (dt, now) {
    var C = this.st.critters;
    for (var k in C) {
      var c = C[k], g = c.g;
      // Jo the fox: walk up to her and she trots along beside you for a while, then heads home.
      if (c.kind === 'fox' && this.explore && this.player && this.player.g.visible) {
        var pp = this.player.g.position, pd = Math.hypot(pp.x - g.position.x, pp.z - g.position.z);
        if (!c.follow && pd < 2.4 && now > (c.followCool || 0)) { c.follow = now + 30000 + Math.random() * 15000; c.wait = 0; this.hearts(); }
        if (c.follow && (now > c.follow || pd > 30)) { c.follow = 0; c.followCool = now + 40000; c.tx = c.cx; c.tz = c.cz; c.away = true; }
        if (c.follow) {
          // A little behind and to the side, wherever you're facing.
          var ry = this.player.g.rotation.y, side = c.side || (c.side = 1);
          c.tx = pp.x - Math.sin(ry) * 0.7 + Math.cos(ry) * 0.9 * side; c.tz = pp.z - Math.cos(ry) * 0.7 - Math.sin(ry) * 0.9 * side;
          c.wait = 0; c.away = true;
          var fdx = c.tx - g.position.x, fdz = c.tz - g.position.z, fd = Math.hypot(fdx, fdz);
          if (fd > 0.12) {
            var fs = Math.min(fd, dt * Math.min(7, 1.2 + fd * 2.5));
            g.position.x += fdx / fd * fs; g.position.z += fdz / fd * fs;
            g.rotation.y = Math.atan2(fdx, fdz);
            c.phase += dt * Math.min(22, 6 + fd * 9);
            c.legs.forEach(function (l, i) { l.rotation.x = Math.sin(c.phase + (i === 0 || i === 3 ? 0 : Math.PI)) * 0.6; });
          } else {
            c.legs.forEach(function (l) { l.rotation.x *= 0.8; });
            var face = ry - g.rotation.y; while (face > Math.PI) face -= Math.PI * 2; while (face < -Math.PI) face += Math.PI * 2;
            g.rotation.y += face * Math.min(1, dt * 3);
          }
          g.position.y = groundY(g.position.x, g.position.z);
          c.tail.rotation.y = Math.sin(now / 160) * 0.5;
          this.needsRender = true;
          continue;
        }
      }
      var dx = c.tx - g.position.x, dz = c.tz - g.position.z, d = Math.hypot(dx, dz);
      if (c.wait > 0) {
        c.wait -= dt;
        c.legs.forEach(function (l) { l.rotation.x *= 0.8; });
        c.tail.rotation.y = Math.sin(now / 300) * 0.3;
        continue;
      }
      if (d < 0.05) {
        var r = rng(c.seed * 13 + Math.floor(now / 1009)), here = Math.atan2(g.position.z - c.cz, g.position.x - c.cx);
        var a = here + (r() - 0.5) * 1.6, rr = c.rIn + r() * (c.rOut - c.rIn);
        // Jo mostly stays round her house, but now and then she trots off exploring, then comes home.
        if (c.kind === 'fox' && !c.away && r() < 0.18) { a = r() * Math.PI * 2; rr = 7 + r() * 16; c.away = true; }
        else c.away = false;
        c.tx = c.cx + Math.cos(a) * rr; c.tz = c.cz + Math.sin(a) * rr; c.wait = c.away ? 0.5 + r() * 2 : 0.8 + r() * 4;
        continue;
      }
      var step = Math.min(d, dt * c.speed * (c.away || Math.hypot(g.position.x - c.cx, g.position.z - c.cz) > c.rOut + 1 ? 1.7 : 1));
      g.position.x += dx / d * step; g.position.z += dz / d * step;
      g.position.y = groundY(g.position.x, g.position.z);
      g.rotation.y = Math.atan2(dx, dz);
      c.phase += dt * c.speed * 9;
      c.legs.forEach(function (l, i) { l.rotation.x = Math.sin(c.phase + (i === 0 || i === 3 ? 0 : Math.PI)) * 0.6; });
      c.tail.rotation.y = Math.sin(c.phase * 0.5) * 0.25;
    }
  };


  // ---- wildlife: the wilderness fills up as the town grows -------------------
  // Each species arrives at a milestone (with a card the first time), then lives its own little
  // life: grazing, wandering, circling, swimming or fishing. Some only come out in one season,
  // or at night.
  // Each species has its own kind of goal, so different habits bring different animals.
  function dogWalks(s) { var n = 0; for (var k in s.dogs.list) n += s.dogs.list[k].n; return n; }
  var WILDLIFE = [
    { key: 'ravens', title: 'Ravens', goal: 15, unit: 'commutes', metric: function (s) { return s.commute.n; }, text: 'A family of ravens has followed you home from work. They circle over the town now, keeping an eye on things.' },
    { key: 'hares', title: 'Snowshoe hares', goal: 10, unit: 'runs', metric: function (s) { return s.forest.runs; }, text: 'Snowshoe hares have moved in by the flower garden. Their coats turn white in winter.' },
    { key: 'moose', title: 'A moose', goal: 10, unit: 'hikes', metric: function (s) { return s.hike.sessions; }, text: 'A moose wades along the lake shore.' },
    { key: 'butterflies', title: 'Butterflies', goal: 10, unit: 'mobility sessions', metric: function (s) { return s.farm.crops.length; }, text: 'Butterflies flit over the flower garden on summer days.' },
    { key: 'fireflies', title: 'Fireflies', goal: 21, unit: 'days in a row (best streak)', metric: function (s) { return s.bestStreak || 0; }, text: 'Three weeks without a day off! Fireflies glow over the meadows on summer nights.' },
    { key: 'beaver', title: 'A beaver', goal: 30, unit: 'trees in the forest', metric: function (s) { return s.forest.trees.length; }, text: 'A beaver has built a dam on the stream below the lake.' },
    { key: 'ducks', title: 'Ducks and a loon', goal: 5, unit: 'swims, rows or paddles', metric: function (s) { return s.swim.sessions + s.row.sessions; }, text: 'Ducks and a loon have settled on the lake.' },
    { key: 'deer', title: 'Deer', goal: 100, unit: 'km run', metric: function (s) { return Math.floor(s.forest.km); }, text: 'Deer browse in the clearings between the trees.' },
    { key: 'eagle', title: 'A bald eagle', goal: 3, unit: 'mountain peaks', metric: function (s) { return s.hike.peaks.filter(Boolean).length; }, text: 'A bald eagle soars over the mountain range.' },
    { key: 'owl', title: 'A great horned owl', goal: 10000, unit: 'pages read', metric: function (s) { return s.library.pages; }, text: 'Ten thousand pages! A wise old owl now hunts over the town on clear nights.' },
    { key: 'sled', title: 'A dog sled', goal: 25, unit: 'dog walks', metric: dogWalks, text: 'Minto, Blue and Millie pull a dog sled across the frozen lake in winter, with a raccoon at the back.' },
    { key: 'lynx', title: 'A lynx', goal: 30, unit: 'snow days (snowboard or ski)', metric: function (s) { return s.snow.days + s.nordic.sessions; }, text: 'A lynx slips through the winter woods. You have to look closely.' },
    { key: 'caribou', title: 'A caribou herd', goal: 1000, unit: 'km ridden (not commutes)', metric: function (s) { return Math.floor(s.bike.km); }, text: 'A small caribou herd wanders the far meadows.' },
    { key: 'bear', title: 'A grizzly bear', goal: 300, unit: 'lifting sessions', metric: function (s) { return s.lifts; }, text: 'Strong as a bear: a grizzly fishes for salmon in the river all summer and sleeps through the winter.' },
    { key: 'wolves', title: 'A wolf pack', goal: 150, unit: 'runs', metric: function (s) { return s.forest.runs; }, text: 'A wolf pack roams the edge of the wilderness at night.' },
    { key: 'hoard', title: 'A dragon on its hoard', goal: 50000, unit: 'pages read', metric: function (s) { return s.library.pages; }, text: 'Fifty thousand pages! In a cave out past the river, a great old dragon sleeps on a hoard of books and gold. Mind the smoke.' },
    { key: 'otters', title: 'River otters', goal: 50, unit: 'workouts with Jo', metric: function (s) { return s.friends.Jo ? s.friends.Jo.n : 0; }, text: 'A pair of river otters has moved onto the lake. They float on their backs holding paws so they don\u2019t drift apart, just like you two.' },
    { key: 'orcas', title: 'A killer whale pod', goal: 150, unit: 'workouts with friends (not counting Jo)', metric: function (s) { var n = 0; for (var k in s.friends) if (k !== 'Jo') n += s.friends[k].n; return n; }, text: 'A hundred and fifty workouts with the crew! A pod of killer whales now cruises off the coast. Keep watching: every so often one breaches.' },
    { key: 'ent', title: 'An Ent', goal: 1, unit: 'half marathon (a sequoia)', metric: function (s) { return s.forest.kinds.sequoia || 0; }, text: 'One of the old sequoias has woken up! Now and then it goes for a slow walk round the forest.' }
  ];
  WILDLIFE.forEach(function (w) { w.need = function (s) { return w.metric(s) >= w.goal; }; w.how = w.goal + ' ' + w.unit; });
  Town.wildlife = WILDLIFE;
  // Somewhere on dry, open ground near a point.
  // Animals keep to clearings, so they aren't hidden under the forest canopy.
  function wildGround(cx, cz, rad, r) {
    for (var i = 0; i < 40; i++) {
      var a = r() * Math.PI * 2, d = r() * rad * (1 + i / 20), x = cx + Math.cos(a) * d, z = cz + Math.sin(a) * d;
      if (FOREST.hash.near(x, z, 1.8) || WILD.hash.near(x, z, 1.6)) continue;
      if (lakeDist(x, z) > 1.5 && riverDist(x, z) > RIVER_HALF + 1.5 && coastSd(x, z) < -4 && streamDist(x, z) > 1.5 && !PEAKS.some(function (k) { return Math.hypot(k.x - x, k.z - z) < k.h * 0.6; })) return { x: x, z: z };
    }
    return { x: cx, z: cz };
  }
  // A four-legged animal from boxes: body, neck and head, legs on hips, tail, and extras.
  Town.prototype.quadruped = function (o) {
    var g = new T.Group(), self = this, pick = 'wild:' + o.key, m = this.mat(o.mat, 0), dark = this.mat(o.mat, 1), light = this.mat(o.mat, 2);
    function P(geo, mat, sx, sy, sz, x, y, z, par) { return self.part(par || g, geo, mat, sx, sy, sz, x, y, z, pick); }
    var L = o.leg, W = o.w, H = o.h, Lg = o.len;
    var body = new T.Group(); body.position.y = L + H / 2; g.add(body);
    P(this.geo.box, m, W, H, Lg, 0, 0, 0, body);
    if (o.belly) P(this.geo.box, light, W * 0.9, H * 0.3, Lg * 0.8, 0, -H * 0.4, 0, body);
    var head = new T.Group(); head.position.set(0, H * (o.neckUp || 0.5), Lg / 2 + (o.neck || 0.1)); body.add(head);
    P(this.geo.box, o.headMat ? this.mat(o.mat, o.headMat) : m, W * 0.75, H * 0.65, H * 0.7, 0, 0, 0, head);
    P(this.geo.box, light, W * 0.4, H * 0.3, H * 0.4, 0, -H * 0.12, H * 0.45, head);
    P(this.geo.box, dark, W * 0.16, W * 0.16, 0.04, 0, -H * 0.05, H * 0.66, head);
    // Eyes, ears, a heavier set of shoulders, a ruff at the chest and a few tufts down the back.
    var eye = this.mat('swan', 2), hw = W * 0.375;
    [-1, 1].forEach(function (sd) {
      P(self.geo.box, eye, 0.035, 0.035, 0.03, sd * hw * 0.85, H * 0.1, H * 0.28, head);
      P(self.geo.box, self.mat('swan', 0), 0.012, 0.012, 0.01, sd * hw * 0.85 + sd * 0.005, H * 0.12, H * 0.3, head);
      if (!o.noEars) { var ear = P(self.geo.cone4, m, W * 0.13, H * 0.32, W * 0.08, sd * hw * 0.75, H * 0.38, -H * 0.15, head); ear.rotation.z = sd * -0.35; }
    });
    P(this.geo.box, m, W * 1.08, H * 1.08, Lg * 0.42, 0, H * 0.04, Lg * 0.22, body);
    P(this.geo.box, light, W * 0.6, H * 0.4, 0.08, 0, -H * 0.25, Lg / 2 + 0.02, body);
    for (var tf = 0; tf < 4; tf++) { var tb = P(this.geo.box, tf % 2 ? m : dark, W * 0.22, H * 0.16, Lg * 0.12, (tf % 2 - 0.5) * W * 0.2, H * 0.52, Lg * (0.25 - tf * 0.17), body); tb.rotation.z = (tf % 2 ? 0.4 : -0.4); }
    if (o.extra) o.extra(P, head, body, dark, light, m);
    var tail = new T.Group(); tail.position.set(0, H * 0.2, -Lg / 2); body.add(tail);
    P(this.geo.box, o.tailMat != null ? this.mat(o.mat, o.tailMat) : m, W * 0.2, W * 0.2, o.tail || 0.15, 0, 0, -(o.tail || 0.15) / 2, tail);
    P(this.geo.box, o.tailMat != null ? this.mat(o.mat, o.tailMat) : m, W * 0.28, W * 0.28, (o.tail || 0.15) * 0.35, 0, 0, -(o.tail || 0.15) * 0.85, tail); // a tuft at the tip
    tail.rotation.x = o.tailUp || 0.3;
    var legs = [[-1, 1], [1, 1], [-1, -1], [1, -1]].map(function (l) {
      var hip = new T.Group(); hip.position.set(l[0] * W * 0.32, L, l[1] * Lg * 0.36); g.add(hip);
      P(self.geo.box, dark, W * 0.2, L, W * 0.2, 0, -L / 2, 0, hip);
      P(self.geo.box, self.mat('swan', 2), W * 0.23, L * 0.12, W * 0.23, 0, -L + L * 0.06, 0, hip); // hooves and paws
      return hip;
    });
    g.scale.setScalar(o.scale || 1);
    return { g: g, legs: legs, tail: tail, head: head };
  };
  // A bird: body, head and two wings that flap.
  Town.prototype.bird = function (key, mat, span, opts) {
    var g = new T.Group(), self = this, pick = 'wild:' + key, m = this.mat(mat, 0), m2 = this.mat(mat, 1), m3 = this.mat(mat, 2);
    function P(geo, mt, sx, sy, sz, x, y, z, par) { return self.part(par || g, geo, mt, sx, sy, sz, x, y, z, pick); }
    P(this.geo.box, m, span * 0.18, span * 0.16, span * 0.55, 0, 0, 0);
    P(this.geo.box, opts && opts.head ? m3 : m, span * 0.16, span * 0.15, span * 0.16, 0, span * 0.05, span * 0.3);
    P(this.geo.cone4, m2, span * 0.05, span * 0.12, span * 0.05, 0, span * 0.04, span * 0.42).rotation.x = Math.PI / 2;
    P(this.geo.box, m, span * 0.2, span * 0.03, span * 0.18, 0, 0, -span * 0.32);
    var wings = [-1, 1].map(function (sd) {
      var w = new T.Group(); w.position.set(sd * span * 0.08, span * 0.04, 0); g.add(w);
      P(self.geo.box, m, span * 0.48, span * 0.03, span * 0.26, sd * span * 0.24, 0, 0, w);
      w.userData.sd = sd;
      return w;
    });
    return { g: g, wings: wings };
  };
  Town.prototype.spawnWild = function (key, delay) {
    var self = this, W = this.st.wild, r = rng(key.length * 97 + 11), list = W.list;
    function add(a) { a.key = key; a.r = r; self.world.add(a.g); list.push(a); if (!self.instant) self.pop(a.g, delay + 400); return a; }
    function walker(q, home, rad, speed, extra) {
      var p = wildGround(home.x, home.z, rad, r);
      q.g.position.set(p.x, groundY(p.x, p.z), p.z);
      return add(Object.assign({ type: 'walk', home: home, rad: rad, speed: speed, tx: p.x, tz: p.z, wait: r() * 3, phase: r() * 6 }, q, extra || {}));
    }
    switch (key) {
      case 'hares':
        [0, 1].forEach(function (i) {
          walker(self.quadruped({ key: 'hares', mat: 'hare', w: 0.2, h: 0.18, len: 0.3, leg: 0.08, tail: 0.06, tailUp: 1.2, scale: 1.1,
            extra: function (P, head) { [-0.04, 0.04].forEach(function (x) { P(self.geo.box, self.mat('hare', 0), 0.04, 0.22, 0.04, x, 0.16, -0.02, head); }); } }),
            polar(325 + i * 20, 23), 6, 1.6, { hop: true });
        });
        break;
      case 'deer':
        [0, 1].forEach(function (i) {
          walker(self.quadruped({ key: 'deer', mat: 'deer', w: 0.3, h: 0.32, len: 0.7, leg: 0.5, neck: 0.12, neckUp: 0.9, belly: true, tail: 0.1, tailMat: 2, scale: 1.1,
            extra: i ? null : function (P, head, body, dark) { [-1, 1].forEach(function (sd) { P(self.geo.box, dark, 0.03, 0.28, 0.03, sd * 0.08, 0.26, -0.02, head).rotation.z = sd * 0.3; P(self.geo.box, dark, 0.12, 0.03, 0.03, sd * 0.13, 0.32, -0.02, head); }); } }),
            polar(40, 44), 14, 0.9);
        });
        break;
      case 'moose':
        walker(self.quadruped({ key: 'moose', mat: 'moose', w: 0.55, h: 0.6, len: 1.25, leg: 0.85, neck: 0.15, neckUp: 0.55, tail: 0.1, scale: 1.15,
          extra: function (P, head, body, dark, light) {
            P(self.geo.box, self.mat('moose', 0), 0.5, 0.25, 0.4, 0, 0.42, -0.45, body); // the shoulder hump
            P(self.geo.box, dark, 0.08, 0.25, 0.06, 0, -0.32, 0.12, head); // the bell
            [-1, 1].forEach(function (sd) { var an = P(self.geo.box, light, 0.55, 0.05, 0.3, sd * 0.42, 0.3, -0.05, head); an.rotation.z = sd * 0.35; for (var t = 0; t < 3; t++) P(self.geo.box, light, 0.05, 0.14, 0.05, sd * (0.3 + t * 0.14), 0.42 + t * 0.04, -0.12, head); });
          } }), (function () { var a = Math.atan2(LAKE.c.z, LAKE.c.x) + 0.6, e = LAKE.R + 4; return { x: LAKE.c.x + Math.cos(a) * e, z: LAKE.c.z + Math.sin(a) * e }; })(), 7, 0.7);
        break;
      case 'caribou':
        for (var c = 0; c < 5; c++) walker(self.quadruped({ key: 'caribou', mat: 'caribou', w: 0.32, h: 0.35, len: 0.75, leg: 0.55, neck: 0.12, neckUp: 0.7, belly: true, tail: 0.08, tailMat: 2, scale: 1,
          extra: function (P, head, body, dark, light) { P(self.geo.box, light, 0.36, 0.3, 0.3, 0, 0.0, 0.32, body); [-1, 1].forEach(function (sd) { P(self.geo.box, dark, 0.04, 0.42, 0.04, sd * 0.1, 0.32, -0.08, head).rotation.z = sd * 0.25; P(self.geo.box, dark, 0.04, 0.04, 0.28, sd * 0.18, 0.5, 0.04, head); }); } }),
          polar(75, 92), 9, 1.0, { herd: true });
        break;
      case 'wolves':
        for (var w = 0; w < 3; w++) walker(self.quadruped({ key: 'wolves', mat: 'wolf', w: 0.26, h: 0.26, len: 0.65, leg: 0.36, neck: 0.08, neckUp: 0.6, belly: true, tail: 0.32, tailUp: -0.4, scale: 1.05,
          extra: function (P, head, body, dark) { [-0.07, 0.07].forEach(function (x) { P(self.geo.cone4, dark, 0.05, 0.12, 0.04, x, 0.14, -0.04, head); }); } }),
          polar(120, 92), 11, 1.8, { night: true, herd: true });
        break;
      case 'lynx':
        walker(self.quadruped({ key: 'lynx', mat: 'lynx', w: 0.26, h: 0.25, len: 0.5, leg: 0.34, neck: 0.04, neckUp: 0.5, tail: 0.08, tailMat: 1, scale: 1.1,
          extra: function (P, head, body, dark) { [-0.08, 0.08].forEach(function (x) { P(self.geo.cone4, dark, 0.04, 0.16, 0.03, x, 0.17, -0.02, head); }); P(self.geo.box, self.mat('lynx', 2), 0.28, 0.12, 0.1, 0, -0.08, 0.02, head); } }),
          polar(55, 62), 10, 1.0, { winter: true });
        break;
      case 'bear': {
        var spot = RIVER[Math.floor(RIVER.length * 0.38)];
        var b = walker(self.quadruped({ key: 'bear', mat: 'bear', w: 0.55, h: 0.55, len: 1.0, leg: 0.42, neck: 0.05, neckUp: 0.35, tail: 0.06, scale: 1.15,
          extra: function (P, head, body, dark) { P(self.geo.box, self.mat('bear', 2), 0.45, 0.3, 0.4, 0, 0.28, 0.3, body); [-0.12, 0.12].forEach(function (x) { P(self.geo.box, dark, 0.08, 0.08, 0.06, x, 0.22, -0.05, head); }); } }),
          spot, 4, 0.6, { summer: true, river: spot });
        // A salmon that leaps from the river beside the bear.
        var fish = new T.Group(); self.part(fish, self.geo.box, self.mat('salmon', 0), 0.08, 0.12, 0.36, 0, 0, 0, 'wild:bear'); self.part(fish, self.geo.cone4, self.mat('salmon', 1), 0.08, 0.14, 0.06, 0, 0, -0.2, 'wild:bear').rotation.x = -Math.PI / 2;
        b.fish = fish; self.world.add(fish);
        break;
      }
      case 'beaver': {
        // A stick dam across the stream and a beaver paddling the pond behind it.
        var si = 26, sp = STREAM[si], sq = STREAM[si + 1], ang = Math.atan2(sq.x - sp.x, sq.z - sp.z), dam = new T.Group();
        dam.position.set(sp.x, groundY(sp.x, sp.z) + 0.15, sp.z); dam.rotation.y = ang;
        // Logs laid across the stream in a low, rounded heap, packed with mud.
        self.part(dam, self.geo.blob, self.mat('soil'), 1.3, 0.3, 0.45, 0, 0.05, 0, 'wild:beaver');
        for (var st = 0; st < 9; st++) {
          var lg = self.part(dam, self.geo.cyl6, self.mat('logwood', st % 2), 0.07, 1.6 + (st % 3) * 0.35, 0.07, ((st % 3) - 1) * 0.12, 0.12 + Math.floor(st / 3) * 0.12, ((st % 3) - 1) * 0.14, 'wild:beaver');
          lg.rotation.set(0, (st % 2 ? 0.12 : -0.1), Math.PI / 2);
        }
        self.world.add(dam); if (!self.instant) self.pop(dam, delay + 300);
        var bv = self.quadruped({ key: 'beaver', mat: 'beaver', w: 0.26, h: 0.18, len: 0.4, leg: 0.04, neck: 0.02, neckUp: 0.3, tail: 0.24, tailUp: 0, tailMat: 1, scale: 1.1 });
        var back = STREAM[si - 3];
        bv.g.position.set(back.x, groundY(back.x, back.z) + 0.22, back.z);
        add(Object.assign({ type: 'swimline', a: STREAM[si - 6], b: STREAM[si - 1], ph: 0, dam: dam }, bv));
        break;
      }
      case 'otters': {
        // Two otters floating belly-up, paws joined, near the lake shore.
        var oa = Math.atan2(LAKE.c.z, LAKE.c.x) + 2.2, oc = { x: LAKE.c.x + Math.cos(oa) * LAKE.R * 0.55, z: LAKE.c.z + Math.sin(oa) * LAKE.R * 0.55 };
        var pair = new T.Group(), pk = 'wild:otters', ot = [];
        [-1, 1].forEach(function (sd, i) {
          var o = new T.Group(); o.position.set(sd * 0.17, 0, 0); pair.add(o);
          var P = function (geo, mat, sx, sy, sz, x, y, z, par) { return self.part(par || o, geo, mat, sx, sy, sz, x, y, z, pk); };
          var fur = self.mat('otter', 0), pale = self.mat('otter', 1), dk = self.mat('otter', 2);
          P(self.geo.box, fur, 0.15, 0.1, 0.44, 0, 0, 0);
          P(self.geo.box, pale, 0.11, 0.02, 0.3, 0, 0.055, 0.05);                       // pale belly, facing the sky
          var hd = new T.Group(); hd.position.set(0, 0.04, 0.27); o.add(hd);
          P(self.geo.box, fur, 0.13, 0.1, 0.12, 0, 0, 0, hd);
          P(self.geo.box, pale, 0.09, 0.05, 0.06, 0, 0.03, 0.06, hd);                   // whiskery muzzle
          P(self.geo.box, dk, 0.035, 0.025, 0.02, 0, 0.05, 0.09, hd);
          [-1, 1].forEach(function (e) { P(self.geo.box, dk, 0.02, 0.02, 0.02, e * 0.04, 0.055, 0.03, hd); P(self.geo.box, fur, 0.03, 0.03, 0.02, e * 0.06, 0.04, -0.04, hd); });
          // Paws on the chest, and the inside paw reaching across to hold the other's.
          P(self.geo.box, dk, 0.03, 0.03, 0.05, -sd * 0.04, 0.07, 0.15);
          var hold = P(self.geo.box, dk, 0.1, 0.025, 0.035, -sd * 0.11, 0.05, 0.12); hold.rotation.y = sd * 0.2;
          P(self.geo.box, dk, 0.04, 0.03, 0.06, sd * 0.05, 0.03, -0.22); P(self.geo.box, dk, 0.04, 0.03, 0.06, -sd * 0.05, 0.03, -0.22);
          var tl = P(self.geo.box, fur, 0.07, 0.05, 0.22, 0, 0, -0.32); tl.scale.x = 0.06;
          var shell = P(self.geo.ball, self.mat('stone', 2), 0.035, 0.02, 0.035, 0, 0.08, 0.06); shell.visible = false;
          ot.push({ g: o, head: hd, shell: shell });
        });
        pair.scale.setScalar(1.3);
        add({ type: 'otters', g: pair, otters: ot, c: oc, y: LAKE.y + 0.1, summer: true, ph: 0 });
        break;
      }
      case 'orcas': {
        // Out past the coast: a big bull with a tall fin, a cow and a calf.
        var sea = { x: COAST_N.x * 119 + COAST_T.x * 6, z: COAST_N.z * 119 + COAST_T.z * 6 };
        var pod = [];
        [[1.25, 1.0, 0], [1.0, 0.55, 2.6], [0.62, 0.4, 1.3]].forEach(function (o, i) {
          var g = new T.Group(), pk2 = 'wild:orcas';
          var P = function (geo, mat, sx, sy, sz, x, y, z, par) { return self.part(par || g, geo, mat, sx, sy, sz, x, y, z, pk2); };
          var blk = self.mat('orca', 0), wht = self.mat('orca', 1), gry = self.mat('orca', 2);
          P(self.geo.box, blk, 0.5, 0.48, 1.3, 0, 0, 0);
          P(self.geo.box, blk, 0.42, 0.4, 0.4, 0, -0.02, 0.8);                           // the head
          P(self.geo.box, blk, 0.3, 0.3, 0.5, 0, 0.0, -0.85);                            // tail stock
          P(self.geo.box, wht, 0.36, 0.06, 1.0, 0, -0.24, 0.25);                         // white belly
          [-1, 1].forEach(function (sd) {
            P(self.geo.box, wht, 0.02, 0.1, 0.22, sd * 0.215, 0.1, 0.78);                 // eye patches
            P(self.geo.box, gry, 0.02, 0.08, 0.3, sd * 0.255, 0.18, -0.35);               // the grey saddle
            var fin = P(self.geo.box, blk, 0.4, 0.04, 0.2, sd * 0.38, -0.18, 0.45); fin.rotation.z = sd * -0.4; fin.rotation.y = sd * 0.3;
            var fl = P(self.geo.box, blk, 0.42, 0.04, 0.2, sd * 0.2, 0, -1.15); fl.rotation.y = sd * 0.5;  // flukes
          });
          var dorsal = P(self.geo.cone4, blk, 0.13, o[1], 0.28, 0, 0.24 + o[1] / 2, -0.05); dorsal.rotation.x = i === 0 ? 0 : -0.25;
          g.scale.setScalar(o[0]);
          self.world.add(g);
          pod.push({ g: g, off: o[2], big: o[0] });
        });
        var host = new T.Group();
        add({ type: 'orcas', g: host, pod: pod, c: sea, R: 5, sp: 1 / 14000, breachAt: 0 });
        break;
      }
      case 'ducks':
        for (var d = 0; d < 5; d++) {
          var loon = d === 4, bd = self.bird('ducks', loon ? 'loon' : 'duck', loon ? 1.2 : 0.85, { head: true });
          bd.wings.forEach(function (wg) { wg.rotation.z = wg.userData.sd * -0.2; wg.scale.set(0.5, 1, 1); });
          add(Object.assign({ type: 'float', ang: d * 1.3, rr: 0.35 + (d % 3) * 0.17, sp: (d % 2 ? 1 : -1) * (0.02 + d * 0.006) }, bd));
        }
        break;
      case 'ravens':
        for (var rv = 0; rv < 3; rv++) add(Object.assign({ type: 'circle', c: { x: 0, z: 0 }, R: 7 + rv * 2.5, y: 13 + rv * 1.5, sp: 1 / (6500 + rv * 900), ph: rv * 2.1, flap: 220 }, self.bird('ravens', 'raven', 0.9)));
        break;
      case 'eagle': {
        var pk = PEAKS[0];
        add(Object.assign({ type: 'circle', c: { x: pk.x, z: pk.z }, R: 11, y: 24, sp: 1 / 9000, ph: 0, flap: 900, soar: true }, self.bird('eagle', 'eagle', 1.6, { head: true })));
        break;
      }
      case 'owl': {
        var ow = self.bird('owl', 'owl', 0.9, { head: true });
        [-0.06, 0.06].forEach(function (x) { self.part(ow.g, self.geo.box, self.mat('lantern'), 0.04, 0.04, 0.02, x, 0.1, 0.24, 'wild:owl'); });
        add(Object.assign({ type: 'circle', c: polar(20, 30), R: 14, y: 10, sp: 1 / 7000, ph: 1, flap: 400, night: true }, ow));
        break;
      }
      case 'butterflies': {
        var bf = new T.Group(), bfs = [];
        for (var k = 0; k < 7; k++) { var one = new T.Group(); [-1, 1].forEach(function (sd) { var wg = self.part(one, self.geo.box, self.mat('flag', k % 5), 0.12, 0.01, 0.1, sd * 0.06, 0, 0, 'wild:butterflies'); wg.userData.sd = sd; }); bf.add(one); bfs.push(one); }
        var fc = polar(FARM.angle, FARM.r);
        add({ type: 'flutter', g: bf, kids: bfs, c: fc, y: groundY(fc.x, fc.z) + 0.6, summer: true, day: true });
        break;
      }
      case 'fireflies': {
        var n = 60, geo = new T.BufferGeometry(), pos = new Float32Array(n * 3), seeds = [];
        for (var f = 0; f < n; f++) { var fp = wildGround(10, -40, 26, r); seeds.push({ x: fp.x, z: fp.z, y: groundY(fp.x, fp.z) + 0.4 + r() * 1.2, ph: r() * 6.28 }); }
        geo.setAttribute('position', new T.BufferAttribute(pos, 3));
        var pts = new T.Points(geo, new T.PointsMaterial({ color: '#f6ff8a', size: 0.3, transparent: true, opacity: 0.9, blending: T.AdditiveBlending, depthWrite: false }));
        add({ type: 'fireflies', g: pts, seeds: seeds, summer: true, night: true });
        break;
      }
      case 'ent': {
        var e = new T.Group(), pickE = 'wild:ent';
        function E(geo, mat, sx, sy, sz, x, y, z, par) { return self.part(par || e, geo, mat, sx, sy, sz, x, y, z, pickE); }
        E(self.geo.cyl6, self.mat('redwood'), 0.38, 2.6, 0.38, 0, 2.6, 0);
        [3.6, 4.4, 5.1].forEach(function (y, i) { E(self.geo.cone6, self.mat('pine', 1), 1.15 - i * 0.25, 1.1, 1.15 - i * 0.25, 0, y, 0); });
        [-0.13, 0.13].forEach(function (x) { E(self.geo.box, self.mat('lantern'), 0.08, 0.06, 0.04, x, 3.0, 0.36); });
        E(self.geo.blob, self.mat('hedge'), 0.22, 0.4, 0.12, 0, 2.55, 0.34);
        var arms = [-1, 1].map(function (sd) { var a2 = new T.Group(); a2.position.set(sd * 0.36, 3.0, 0); e.add(a2); E(self.geo.cyl6, self.mat('redwood'), 0.09, 1.3, 0.09, 0, -0.6, 0, a2); E(self.geo.blob, self.mat('pine', 0), 0.25, 0.22, 0.25, 0, -1.25, 0, a2); a2.rotation.z = sd * 0.35; return a2; });
        var elegs = [-1, 1].map(function (sd) { var h2 = new T.Group(); h2.position.set(sd * 0.2, 1.35, 0); e.add(h2); E(self.geo.cyl6, self.mat('redwood'), 0.13, 1.35, 0.13, 0, -0.67, 0, h2); E(self.geo.box, self.mat('redwood'), 0.3, 0.1, 0.4, 0, -1.3, 0.08, h2); return h2; });
        var gs = GROVES.sequoia.seed;
        e.position.set(gs.x + 3, groundY(gs.x + 3, gs.z), gs.z);
        add({ type: 'ent', g: e, arms: arms, legs: elegs, home: { x: gs.x + 3, z: gs.z }, rad: 18, speed: 0.45, tx: e.position.x, tz: e.position.z, wait: 20, phase: 0, ent: true });
        break;
      }
      case 'hoard': {
        // A rocky hill with a cave mouth, and inside it a great old dragon curled asleep on a heap
        // of books and gold. Smoke drifts from its nose; now and then it opens one eye.
        var hp = HOARD, hg = new T.Group(), pkH = 'wild:hoard';
        hg.position.set(hp.x, groundY(hp.x, hp.z), hp.z); hg.rotation.y = Math.atan2(-hp.x, -hp.z);
        self.clearDecor(hp.x, hp.z, 9);
        function H(geo, mat, sx, sy, sz, x, y, z, par) { return self.part(par || hg, geo, mat, sx, sy, sz, x, y, z, pkH); }
        H(self.geo.ball, self.mat('rock'), 5.2, 3.6, 4.4, 0, -0.4, -1.6);
        H(self.geo.blob, self.mat('stoneDark'), 2.4, 2.0, 2.2, 3.4, 0.2, -1.2);
        H(self.geo.blob, self.mat('rock'), 2.0, 1.6, 2.0, -3.6, 0.0, -0.8);
        [[-1.6, 2.6, -2.6], [1.2, 2.9, -2.2], [0.1, 3.1, -3.4]].forEach(function (t) { H(self.geo.cyl6, self.mat('trunk'), 0.12, 0.7, 0.12, t[0], t[1], t[2]); H(self.geo.cone6, self.mat('pine', 1), 0.7, 1.6, 0.7, t[0], t[1] + 1.0, t[2]); });
        var dark = new T.MeshBasicMaterial({ color: '#0c0a0e' });
        var mouth = new T.Mesh(new T.CircleGeometry(2.2, 20, 0, Math.PI), dark); mouth.position.set(0, 0.02, 2.66); hg.add(mouth);
        var mouthIn = new T.Mesh(new T.BoxGeometry(4.2, 2.1, 1.6), dark); mouthIn.position.set(0, 1.05, 0.9); hg.add(mouthIn);
        [-2.2, 2.2].forEach(function (x) { H(self.geo.blob, self.mat('stoneDark'), 0.7, 1.4, 0.7, x, 0.8, 2.7); });
        // The hoard: a spill of books and gold coins out of the cave mouth.
        for (var hb = 0; hb < 40; hb++) {
          var ha = (hb * 2.4) % 6.28, hr = 0.3 + (hb % 7) * 0.28, bx = Math.cos(ha) * hr * 1.6, bz = 3.2 + Math.sin(ha) * hr * 0.8;
          var bk = H(self.geo.box, self.spineMat(spineColour([3.5, 4, 4.5, 5, null][hb % 5], hb)), 0.42, 0.1, 0.3, bx, 0.05 + (hb % 4) * 0.1, bz); bk.rotation.y = hb;
          if (hb % 2) H(self.geo.cyl, self.mat('gold'), 0.1, 0.03, 0.1, bx + 0.2, 0.12 + (hb % 3) * 0.08, bz + 0.1);
        }
        // The dragon, curled round on the hoard with its head on its forepaws at the mouth.
        var dr = new T.Group(); dr.position.set(0, 0.3, 3.0); dr.scale.setScalar(1.25); hg.add(dr);
        H(self.geo.ball, self.mat('dragon', 0), 1.3, 0.75, 1.0, -0.3, 0.45, -0.4, dr);
        H(self.geo.ball, self.mat('dragon', 2), 1.0, 0.4, 0.8, -0.3, 0.2, -0.3, dr);
        for (var tl = 0; tl < 7; tl++) { var ta = 2.6 + tl * 0.45; H(self.geo.ball, self.mat('dragon', 0), 0.32 - tl * 0.03, 0.28 - tl * 0.03, 0.32 - tl * 0.03, -0.3 + Math.cos(ta) * 1.4, 0.2, -0.4 + Math.sin(ta) * 1.0, dr); }
        [-1, 1].forEach(function (sd) { var wg = H(self.geo.cone4, self.mat('dragon', 1), 0.9, 1.4, 0.15, -0.3 + sd * 0.4, 1.05, -0.6, dr); wg.rotation.set(0.3, 0, sd * 1.25); });
        for (var sp2 = 0; sp2 < 5; sp2++) H(self.geo.cone4, self.mat('dragon', 1), 0.1, 0.25, 0.1, -0.9 + sp2 * 0.32, 1.15, -0.5, dr);
        var head = new T.Group(); head.position.set(0.9, 0.35, 0.3); head.rotation.y = 0.5; dr.add(head);
        H(self.geo.box, self.mat('dragon', 0), 0.5, 0.36, 0.7, 0, 0, 0, head);
        H(self.geo.box, self.mat('dragon', 0), 0.38, 0.24, 0.45, 0, -0.04, 0.5, head);
        [-1, 1].forEach(function (sd) { H(self.geo.cone4, self.mat('dragon', 2), 0.05, 0.3, 0.05, sd * 0.18, 0.3, -0.25, head).rotation.x = -0.6; });
        var eye = H(self.geo.box, self.mat('lantern'), 0.09, 0.06, 0.04, 0.22, 0.08, 0.15, head); eye.rotation.y = Math.PI / 2;
        [-0.3, 0.3].forEach(function (x) { H(self.geo.box, self.mat('dragon', 0), 0.22, 0.2, 0.4, x + 0.6, 0.0, 0.55, dr); });
        var puff = new T.Mesh(self.geo.ball, new T.MeshBasicMaterial({ color: '#cfcac4', transparent: true, opacity: 0, depthWrite: false })); puff.scale.setScalar(0.12); dr.add(puff);
        if (!self.instant) self.pop(hg, delay + 400);
        self.world.add(hg);
        add({ type: 'hoard', g: hg, eye: eye, head: head, puff: puff, nose: new T.Vector3(0.9 + Math.sin(0.5) * 0.75, 0.35, 0.3 + Math.cos(0.5) * 0.75) });
        break;
      }
      case 'sled': {
        var sg = new T.Group(), pk2 = 'wild:sled';
        self.part(sg, self.geo.box, self.mat('wood'), 0.5, 0.12, 1.0, 0, 0.18, -1.6, pk2);
        [-0.22, 0.22].forEach(function (x) { self.part(sg, self.geo.box, self.mat('stoneDark'), 0.04, 0.04, 1.2, x, 0.06, -1.55, pk2); });
        self.part(sg, self.geo.box, self.mat('wood'), 0.5, 0.4, 0.06, 0, 0.42, -2.08, pk2);
        // The raccoon musher.
        self.part(sg, self.geo.box, self.mat('coon', 0), 0.26, 0.4, 0.22, 0, 0.6, -1.95, pk2);
        self.part(sg, self.geo.box, self.mat('coon', 0), 0.24, 0.2, 0.2, 0, 0.9, -1.92, pk2);
        self.part(sg, self.geo.box, self.mat('coon', 1), 0.26, 0.06, 0.05, 0, 0.92, -1.82, pk2);
        self.part(sg, self.geo.box, self.mat('stoneDark'), 0.02, 0.02, 1.1, 0, 0.2, -0.75, pk2);
        var sdogs = ['Minto', 'Blue', 'Millie'].map(function (nm, i) {
          var dg = new T.Group(), m0 = self.mat('dog:' + nm, 0), m1 = self.mat('dog:' + nm, 1);
          self.part(dg, self.geo.box, m0, 0.18, 0.18, 0.42, 0, 0.3, 0, pk2); self.part(dg, self.geo.box, m1, 0.15, 0.14, 0.16, 0, 0.38, 0.27, pk2);
          var lg = [[-0.06, 0.13], [0.06, 0.13], [-0.06, -0.13], [0.06, -0.13]].map(function (l) { var hp = new T.Group(); hp.position.set(l[0], 0.22, l[1]); dg.add(hp); self.part(hp, self.geo.box, m0, 0.04, 0.2, 0.04, 0, -0.1, 0, pk2); return hp; });
          dg.position.set(i === 2 ? 0 : (i ? 0.16 : -0.16), 0, i === 2 ? 0.9 : 0.25); sg.add(dg);
          return lg;
        });
        add({ type: 'sled', g: sg, legs: [].concat.apply([], sdogs), t: 0, winter: true });
        break;
      }
    }
  };
  // The not-yet-arrived species you're closest to.
  Town.prototype.nextWildlife = function () {
    var s = this.st, best = null;
    WILDLIFE.forEach(function (w) {
      if (s.wild.have[w.key]) return;
      var have = Math.min(w.metric(s), w.goal), f = have / w.goal;
      if (!best || f > best.f) best = { key: w.key, title: w.title, have: have, goal: w.goal, how: w.how, f: f };
    });
    return best;
  };
  Town.prototype.updateWildlife = function (delay, ev) {
    var s = this.st, W = s.wild || (s.wild = { list: [], have: {} }), self = this;
    WILDLIFE.forEach(function (sp) {
      if (W.have[sp.key] || !sp.need(s)) return;
      W.have[sp.key] = true;
      self.spawnWild(sp.key, delay || 0);
      if (self.onSecret) self.onSecret({ id: 'wildlife#' + sp.key, title: 'Wildlife: ' + sp.title, text: sp.text }, ev);
    });
  };
  Town.prototype.stepWildlife = function (dt, now) {
    var W = this.st.wild;
    if (!W || !W.list.length) return;
    var season = this.season, night = this.dark, self = this;
    W.list.forEach(function (a) {
      var show = !(a.winter && season !== 'winter') && !(a.summer && season === 'winter') && !(a.night && !night) && !(a.day && night);
      a.g.visible = show;
      if (a.fish) a.fish.visible = false;
      if (!show) return;
      var g = a.g;
      if (a.type === 'walk' || a.type === 'ent') {
        var dx = a.tx - g.position.x, dz = a.tz - g.position.z, d = Math.hypot(dx, dz);
        if (a.wait > 0 || d < 0.05) {
          if (a.wait > 0) a.wait -= dt;
          else {
            var p = a.ent ? (function () { var tr = self.st.forest.trees; var t = tr[Math.floor(a.r() * tr.length)]; return t ? { x: t.position.x + 1.2, z: t.position.z + 1.2 } : a.home; })() : wildGround(a.home.x, a.home.z, a.rad, a.r);
            if (a.ent && Math.hypot(p.x - a.home.x, p.z - a.home.z) > a.rad) p = a.home;
            a.tx = p.x; a.tz = p.z; a.wait = a.ent ? 25 + a.r() * 50 : 1 + a.r() * (a.herd ? 3 : 6);
          }
          (a.legs || []).forEach(function (l) { l.rotation.x *= 0.85; });
          if (a.head && !a.ent) a.head.rotation.x = 0.5 + Math.sin(now / 900 + a.phase) * 0.1; // grazing
          if (a.arms) a.arms.forEach(function (ar, i) { ar.rotation.x = Math.sin(now / 2000 + i) * 0.05; });
          if (a.river && a.fish) {
            // Salmon leap past the fishing bear now and then.
            var cyc = (now / 4200 + a.phase) % 1;
            if (cyc < 0.25) {
              var t = cyc / 0.25, rp = a.river; a.fish.visible = true;
              a.fish.position.set(rp.x + (t - 0.5) * 1.6, riverLevel(rp.i) + Math.sin(t * Math.PI) * 1.1, rp.z + 0.4);
              a.fish.rotation.set(-Math.cos(t * Math.PI) * 0.9, Math.PI / 2, 0);
            }
          }
          return;
        }
        if (a.head) a.head.rotation.x = 0;
        var step = Math.min(d, dt * a.speed);
        g.position.x += dx / d * step; g.position.z += dz / d * step;
        g.position.y = groundY(g.position.x, g.position.z) + (a.hop ? Math.abs(Math.sin(now / 120)) * 0.15 : 0);
        g.rotation.y = Math.atan2(dx, dz);
        a.phase += dt * a.speed * (a.ent ? 3 : 8);
        (a.legs || []).forEach(function (l, i) { l.rotation.x = Math.sin(a.phase + (a.ent ? i * Math.PI : (i === 0 || i === 3 ? 0 : Math.PI))) * (a.ent ? 0.4 : 0.6); });
        if (a.arms) a.arms.forEach(function (ar, i) { ar.rotation.x = Math.sin(a.phase + (i ? 0 : Math.PI)) * 0.3; });
      } else if (a.type === 'circle') {
        var an = now * a.sp + a.ph;
        g.position.set(a.c.x + Math.cos(an) * a.R, a.y + Math.sin(now / 2100 + a.ph) * 0.6, a.c.z + Math.sin(an) * a.R);
        g.rotation.y = -an; g.rotation.z = a.soar ? 0.25 : 0.12;
        a.wings.forEach(function (w) { w.rotation.z = w.userData.sd * Math.sin(now / a.flap + a.ph) * (a.soar ? 0.15 : 0.6); });
      } else if (a.type === 'otters') {
        // Drifting in a slow circle, bobbing; now and then one rolls under and comes up with a snack.
        var oan = now / 26000;
        g.position.set(a.c.x + Math.cos(oan) * 1.6, a.y + Math.sin(now / 700) * 0.03, a.c.z + Math.sin(oan) * 1.6);
        g.rotation.y = -oan + Math.sin(now / 5000) * 0.4;
        var cyc2 = (now / 1000) % 30;
        a.otters.forEach(function (o, i) {
          o.g.rotation.z = 0; o.g.position.y = 0; o.g.visible = true;
          if (i === 1 && cyc2 > 20 && cyc2 < 23) {
            // Dive: roll over and vanish, then bob back up.
            var u = (cyc2 - 20) / 3;
            o.g.rotation.z = Math.min(1, u * 3) * Math.PI; o.g.position.y = -Math.sin(u * Math.PI) * 0.4; o.g.visible = u < 0.2 || u > 0.8;
            o.shell.visible = false;
          } else if (i === 1 && cyc2 >= 23 && cyc2 < 29) {
            // Cracking the shellfish on its belly.
            o.shell.visible = true; o.head.rotation.x = -0.3 + Math.sin(now / 110) * 0.15;
          } else { o.shell.visible = false; o.head.rotation.x = Math.sin(now / 1500 + i) * 0.12; }
        });
      } else if (a.type === 'orcas') {
        // Cruising in a loop: backs and fins breaking the surface, blowing as they come up.
        var pan = now * a.sp;
        a.pod.forEach(function (o, i) {
          var ang = pan - i * 0.22, lx = a.c.x + Math.cos(ang) * (a.R + i * 0.6), lz = a.c.z + Math.sin(ang) * (a.R + i * 0.6);
          var bob = Math.sin(now / 2400 + o.off), og = o.g;
          og.visible = true;
          og.position.set(lx, SEA_Y - 0.36 * o.big + bob * 0.3 * o.big, lz);
          og.rotation.set(-Math.cos(now / 2400 + o.off) * 0.18, -ang, 0);
          if (bob > 0.95 && now > (o.blowAt || 0)) { o.blowAt = now + 2000; self.puff(lx + Math.sin(-ang) * 0.6 * o.big, SEA_Y + 0.3, lz + Math.cos(-ang) * 0.6 * o.big, 10, 'steam', 0.12); }
        });
        // A breach: the big one launches clean out of the water and crashes back.
        if (!a.breach && now > a.breachAt) { a.breachAt = now + 22000 + Math.random() * 20000; if (a.breachAt - now > 0) a.breach = { t: 0, who: a.pod[Math.floor(Math.random() * 2)] }; }
        if (a.breach) {
          var B = a.breach, bo = B.who.g;
          B.t += dt;
          var bu = B.t / 1.6;
          if (bu === bu && bu <= 1) {
            if (!B.x) { B.x = bo.position.x; B.z = bo.position.z; B.ry = bo.rotation.y; self.puff(B.x, SEA_Y + 0.1, B.z, 14, 'splash', 0.6); }
            bo.position.set(B.x + Math.sin(B.ry) * bu * 2.4, SEA_Y - 0.4 + Math.sin(bu * Math.PI) * 3.2, B.z + Math.cos(B.ry) * bu * 2.4);
            bo.rotation.set(-1.2 + bu * 2.0, B.ry, bu * 1.4);
          } else { self.puff(bo.position.x, SEA_Y + 0.1, bo.position.z, 22, 'splash', 0.9); a.breach = null; }
        }
      } else if (a.type === 'float') {
        a.ang += a.sp * dt * 6;
        var lr = LAKE.R * a.rr;
        g.position.set(LAKE.c.x + Math.cos(a.ang) * lr, LAKE.y + 0.18 + Math.sin(now / 700 + a.ang) * 0.02, LAKE.c.z + Math.sin(a.ang) * lr);
        g.rotation.y = -a.ang + (a.sp > 0 ? Math.PI : 0);
        g.visible = season !== 'winter';
      } else if (a.type === 'swimline') {
        var tt = (Math.sin(now / 5000) + 1) / 2, x = a.a.x + (a.b.x - a.a.x) * tt, z = a.a.z + (a.b.z - a.a.z) * tt;
        g.position.set(x, groundY(x, z) + 0.22, z);
        g.rotation.y = Math.atan2(a.b.x - a.a.x, a.b.z - a.a.z) + (Math.cos(now / 5000) < 0 ? Math.PI : 0);
        a.tail.rotation.x = Math.sin(now / 300) * 0.3;
        g.visible = season !== 'winter';
      } else if (a.type === 'flutter') {
        a.kids.forEach(function (k, i) {
          k.position.set(a.c.x + Math.sin(now / 1700 + i * 1.7) * 2.5, a.y + Math.sin(now / 600 + i) * 0.4, a.c.z + Math.cos(now / 1900 + i * 2.3) * 2.5);
          k.children.forEach(function (w) { w.rotation.z = w.userData.sd * Math.abs(Math.sin(now / 90 + i)) * 1.1; });
        });
      } else if (a.type === 'fireflies') {
        var P = g.geometry.attributes.position;
        a.seeds.forEach(function (sd, i) { P.setXYZ(i, sd.x + Math.sin(now / 1500 + sd.ph) * 0.8, sd.y + Math.sin(now / 900 + sd.ph) * 0.3, sd.z + Math.cos(now / 1700 + sd.ph) * 0.8); });
        P.needsUpdate = true;
        g.material.opacity = 0.5 + 0.4 * Math.sin(now / 300);
      } else if (a.type === 'hoard') {
        // Slow breathing, a curl of smoke from the nose, and one eye that opens now and then.
        var br = Math.sin(now / 1800);
        a.head.position.y = 0.35 + br * 0.02;
        var open = (now / 9000) % 1 < 0.12;
        a.eye.scale.y = open ? 0.06 : 0.012;
        var pt = (now / 2600) % 1;
        a.puff.position.set(a.nose.x + pt * 0.3, a.nose.y + 0.1 + pt * 1.2, a.nose.z + pt * 0.2);
        a.puff.scale.setScalar(0.08 + pt * 0.3);
        a.puff.material.opacity = 0.5 * Math.sin(pt * Math.PI);
      } else if (a.type === 'sled') {
        // Back and forth across the frozen lake.
        a.t += dt / 14;
        var u = (Math.sin(a.t) + 1) / 2, ax = LAKE.c.x - LAKE.R * 0.75, bx = LAKE.c.x + LAKE.R * 0.75;
        g.position.set(ax + (bx - ax) * u, LAKE.y + 0.12, LAKE.c.z + Math.sin(a.t * 2) * 1.2);
        g.rotation.y = Math.cos(a.t) > 0 ? Math.PI / 2 : -Math.PI / 2;
        a.legs.forEach(function (l, i) { l.rotation.x = Math.sin(now / 90 + i * 1.3) * 0.7; });
      }
    });
    this.needsRender = true;
  };

  // ---- the harbour: rowing and paddling build it ---------------------------
  // It grows on the coast where the dock used to be: a jetty and rowboat first, then
  // paddleboards, a longer pier, a boathouse, a fish market, a sailboat, a breakwater,
  // a second pier and finally a tall ship at anchor.
  var HARBOUR_STEPS = [[0.01, 'A jetty and a rowboat'], [20, 'Paddleboards'], [50, 'A longer pier'], [100, 'A boathouse'], [150, 'A fish market'],
    [250, 'A sailboat'], [400, 'A breakwater and harbour light'], [600, 'A second pier'], [900, 'A tall ship at anchor']];
  var HARBOUR = (function () { var p = shoreAt(312); return { x: p.x - COAST_N.x * 3, z: p.z - COAST_N.z * 3 }; })();
  Town.prototype.growHarbour = function (delay) {
    var R = this.st.row, self = this, pick = 'harbour';
    if (!R.harbour) {
      var g = new T.Group();
      g.position.set(HARBOUR.x, 0, HARBOUR.z);
      g.rotation.y = Math.atan2(COAST_N.x, COAST_N.z); // +z runs out to sea
      this.world.add(g);
      R.harbour = { group: g, n: 0, bobbers: [] };
    }
    var H = R.harbour;
    while (H.n < HARBOUR_STEPS.length && R.km >= HARBOUR_STEPS[H.n][0]) {
      var step = H.n++, o = new T.Group();
      H.group.add(o);
      var P = function (geo, mat, sx, sy, sz, x, y, z, par) { return self.part(par || o, geo, mat, sx, sy, sz, x, y, z, pick); };
      var boat = function (x, z, color, len) {
        var b = new T.Group(); b.position.set(x, SEA_Y + 0.12, z); o.add(b);
        P(self.geo.box, color, 0.8, 0.3, len, 0, 0, 0, b);
        P(self.geo.box, self.mat('woodLight'), 0.7, 0.05, len - 0.2, 0, 0.16, 0, b);
        H.bobbers.push({ g: b, base: SEA_Y + 0.12, ph: x + z });
        return b;
      };
      var deck = function (x, z0, z1) {
        for (var z = z0; z <= z1; z += 1) {
          P(self.geo.box, self.mat('wood'), 1.6, 0.1, 0.95, x, 0.45, z);
          if (Math.round(z) % 2 === 0) [-0.72, 0.72].forEach(function (dx) { P(self.geo.cyl6, self.mat('trunk'), 0.08, 2.4, 0.08, x + dx, -0.7, z); });
        }
      };
      switch (step) {
        case 0: deck(0, 2, 6); boat(1.3, 5, this.mat('roofJo'), 2.2); break;
        case 1:
          P(this.geo.box, this.mat('wood'), 0.1, 1.0, 1.4, -2.6, 0.8, 0.6);
          [0.55, 0.85].forEach(function (y, i) { P(self.geo.box, self.mat('glass', i + 1), 0.6, 0.06, 1.3, -2.6, y + 0.3, 0.6); });
          [[ -2.5, 10], [2.6, 13]].forEach(function (pb, i) {
            var b = new T.Group(); b.position.set(pb[0], SEA_Y + 0.06, pb[1]); o.add(b);
            P(self.geo.box, self.mat('glass', i ? 1 : 2), 0.45, 0.06, 1.6, 0, 0, 0, b);
            P(self.geo.box, self.mat('fox', i ? 0 : 1), 0.18, 0.5, 0.14, 0, 0.32, 0, b);
            P(self.geo.ball, self.mat('fur', 0), 0.1, 0.1, 0.1, 0, 0.66, 0, b);
            P(self.geo.box, self.mat('wood'), 0.03, 0.03, 1.1, 0.18, 0.4, 0.1, b).rotation.x = 0.6;
            H.bobbers.push({ g: b, base: SEA_Y + 0.06, ph: i * 2, drift: i ? -1 : 1, x0: pb[0], z0: pb[1] });
          });
          break;
        case 2: deck(0, 7, 12); P(this.geo.box, this.mat('wood'), 3.6, 0.1, 1.8, 0, 0.45, 13.2); boat(-1.3, 9.5, this.mat('roof', 0), 2.0); break;
        case 3:
          P(this.geo.box, this.mat('wood'), 2.6, 1.7, 3.0, 4.6, 0.85 + 0.25, 1.4);
          P(this.geo.gable, this.mat('roof', 0), 1.7, 1.2, 2.1, 4.6, 1.95 + 0.25, 1.4).rotation.y = 0;
          P(this.geo.box, this.mat('trunk'), 1.6, 1.3, 0.06, 4.6, 0.85, 2.92);
          P(this.geo.box, this.mat('wood'), 1.4, 0.08, 3.0, 4.6, 0.2, 4.2).rotation.x = 0.18;
          break;
        case 4:
          P(this.geo.box, this.mat('wood'), 2.4, 0.9, 0.9, -4.2, 0.7, 0.8);
          for (var f = 0; f < 6; f++) P(this.geo.ball, this.mat('silver'), 0.18, 0.08, 0.32, -5.0 + f * 0.32, 1.2, 0.8);
          [-5.3, -3.1].forEach(function (x) { P(self.geo.cyl6, self.mat('wood'), 0.05, 2.0, 0.05, x, 1.2, 1.2); });
          for (var st = 0; st < 5; st++) P(this.geo.box, this.mat('canvas', st % 2 ? 0 : 1), 0.46, 0.06, 1.2, -5.2 + st * 0.46, 2.15, 1.0).rotation.x = -0.25;
          [[-2.6, 1.6], [-2.6, 0.6], [-5.8, 1.9]].forEach(function (c) { P(self.geo.box, self.mat('woodLight'), 0.6, 0.45, 0.5, c[0], 0.5, c[1]); });
          break;
        case 5: {
          var sb = boat(3.6, 11, this.mat('plaster', 0), 2.8);
          P(this.geo.cyl6, this.mat('wood'), 0.05, 3.6, 0.05, 0, 1.9, 0.2, sb);
          P(this.geo.cone4, this.mat('plaster', 1), 0.06, 2.8, 1.0, 0, 2.0, 0.75, sb);
          P(this.geo.flag, this.mat('flag', 0), 1.0, 1.0, 1.0, 0, 3.7, 0.2, sb);
          break;
        }
        case 6: {
          var rr = rng(77);
          for (var k = 0; k < 16; k++) { var t = k / 15; P(this.geo.blob, this.mat('rock'), 0.9 + rr() * 0.6, 0.9, 0.9 + rr() * 0.5, -8 + Math.sin(t * 1.4) * 2.5, SEA_Y + 0.1, 3 + t * 13); }
          P(this.geo.cyl, this.mat('roofJo'), 0.3, 1.8, 0.3, -6.2, 1.2, 16.2);
          P(this.geo.cyl, this.mat('plaster', 0), 0.31, 0.4, 0.31, -6.2, 1.5, 16.2);
          P(this.geo.box, this.mat('lantern'), 0.26, 0.3, 0.26, -6.2, 2.3, 16.2);
          break;
        }
        case 7: deck(7.5, 2, 10); boat(9, 7, this.mat('roof', 3), 2.2); boat(6, 9, this.mat('glass', 4), 1.8); break;
        case 8: {
          var ship = new T.Group(); ship.position.set(-14, SEA_Y + 0.2, 30); ship.rotation.y = 0.5; o.add(ship);
          P(this.geo.box, this.mat('wood'), 2.2, 1.2, 8.0, 0, 0.2, 0, ship);
          P(this.geo.box, this.mat('trunk'), 2.3, 0.2, 8.1, 0, 0.85, 0, ship);
          P(this.geo.box, this.mat('wood'), 2.0, 0.9, 1.8, 0, 1.3, -3.2, ship);
          [-2.2, 0.2, 2.6].forEach(function (z, i) {
            var hgt = [6.5, 7.5, 5.5][i];
            P(self.geo.cyl6, self.mat('trunk'), 0.08, hgt, 0.08, 0, 0.9 + hgt / 2, z, ship);
            [0.45, 0.7].forEach(function (f2) { P(self.geo.box, self.mat('plaster', 0), 2.2 - f2, hgt * 0.22, 0.06, 0, 0.9 + hgt * f2, z, ship); });
            P(self.geo.flag, self.mat('flag', i), 1.4, 1.4, 1.4, 0, 0.9 + hgt, z, ship);
          });
          H.bobbers.push({ g: ship, base: SEA_Y + 0.2, ph: 3, slow: true });
          break;
        }
      }
      if (!this.instant) this.pop(o, delay + 300);
    }
  };
  Town.prototype.stepHarbour = function (now) {
    var H = this.st.row.harbour;
    if (!H) return;
    var winter = this.season === 'winter';
    H.bobbers.forEach(function (b) {
      var t = now / (b.slow ? 2600 : 1300) + b.ph;
      b.g.position.y = b.base + Math.sin(t) * (b.slow ? 0.12 : 0.06);
      b.g.rotation.z = Math.sin(t * 0.8) * (b.slow ? 0.03 : 0.06);
      if (b.drift) { b.g.position.x = b.x0 + Math.sin(now / 9000 + b.ph) * 3 * b.drift; b.g.position.z = b.z0 + Math.cos(now / 11000 + b.ph) * 2; b.g.visible = !winter; }
    });
  };

  // ---- the island in the bay: a little more for every full year of logging --
  var ISLAND = (function () { var p = shoreAt(325); return { x: p.x + COAST_N.x * 15, z: p.z + COAST_N.z * 15 }; })();
  var ISLAND_STEPS = [null, 'a log cabin', 'a dock', 'a bonfire', 'pine trees', 'a rowboat at the dock', 'a lookout tower', 'a hammock', 'a flag on the lookout'];
  Town.prototype.growIsland = function (years, delay, ev) {
    var s = this.st, self = this, pick = 'island';
    if (!s.island) {
      var g = new T.Group(); g.position.set(ISLAND.x, SEA_Y, ISLAND.z); this.world.add(g);
      this.part(g, this.geo.blob, this.mat('sand'), 6.2, 1.1, 5.0, 0, 0, 0, pick);
      this.part(g, this.geo.blob, this.mat('hill'), 4.6, 1.0, 3.6, -0.3, 0.45, -0.2, pick);
      s.island = { group: g, n: 0 };
      this.pop(g, delay);
    }
    var I = s.island;
    while (I.n < years && I.n < ISLAND_STEPS.length - 1) {
      var k = ++I.n, o = new T.Group(); I.group.add(o);
      var P = function (geo, mat, sx, sy, sz, x, y, z) { return self.part(o, geo, mat, sx, sy, sz, x, y, z, pick); };
      if (k === 1) { o.position.set(0.4, 1.25, -0.6); o.rotation.y = -0.6; this.logWalls(P, 2.0, 1.6, 6); P(this.geo.gable, this.mat('wood'), 1.45, 1.2, 1.3, 0, 2.0, 0).rotation.y = Math.PI / 2; P(this.geo.box, this.mat('stone', 1), 0.3, 1.2, 0.3, -0.7, 2.4, 0.4); }
      else if (k === 2) { for (var d = 0; d < 6; d++) { var pl = P(this.geo.box, this.mat('wood'), 1.2, 0.1, 0.9, -1.8 - d * 0.75, 0.95 - d * 0.08, 3.8 + d * 0.55); pl.rotation.y = 0.9; } }
      else if (k === 3) {
        o.position.set(1.6, 1.15, 1.6);
        for (var l = 0; l < 6; l++) { var la = l / 6 * Math.PI * 2; P(this.geo.box, this.mat('rock'), 0.3, 0.2, 0.3, Math.cos(la) * 0.55, 0, Math.sin(la) * 0.55); }
        P(this.geo.cone, this.mat('fire'), 0.35, 0.8, 0.35, 0, 0.4, 0);
        P(this.geo.cone, this.mat('lantern'), 0.2, 0.5, 0.2, 0.05, 0.3, 0);
        [[-1.2, 0.2], [0.4, -1.2]].forEach(function (c) { P(self.geo.cyl6, self.mat('logwood', 0), 0.22, 0.35, 0.22, c[0], 0.05, c[1]); });
        s.islandFire = o;
      }
      else if (k === 4) { [[-2.5, -1.2], [-1.8, -2.2], [2.6, -1.0]].forEach(function (t) { P(self.geo.cone6, self.mat('pine', 1), 0.9, 2.4, 0.9, t[0], 2.2, t[1]); P(self.geo.cyl6, self.mat('trunk'), 0.12, 0.6, 0.12, t[0], 1.1, t[1]); }); }
      else if (k === 5) { var rb = new T.Group(); rb.position.set(-4.0, 0.12, 5.6); o.add(rb); this.part(rb, this.geo.box, this.mat('roofJo'), 0.8, 0.3, 2.0, 0, 0, 0, pick); this.part(rb, this.geo.box, this.mat('woodLight'), 0.7, 0.05, 1.8, 0, 0.16, 0, pick); }
      else if (k === 6) { o.position.set(2.4, 1.1, -0.2); [[-0.4, -0.4], [0.4, -0.4], [-0.4, 0.4], [0.4, 0.4]].forEach(function (lg) { P(self.geo.cyl6, self.mat('logwood', 1), 0.07, 3.2, 0.07, lg[0], 1.6, lg[1]); }); P(this.geo.box, this.mat('wood'), 1.2, 0.12, 1.2, 0, 3.2, 0); P(this.geo.cone4, this.mat('roof', 0), 0.95, 0.8, 0.95, 0, 3.8, 0).rotation.y = Math.PI / 4; I.lookout = o; }
      else if (k === 7) { var hm = P(this.geo.box, this.mat('canvas', 1), 1.6, 0.05, 0.5, -2.15, 1.7, -1.7); hm.rotation.z = 0.05; }
      else if (k === 8) { P(this.geo.cyl6, this.mat('wood'), 0.04, 1.6, 0.04, 2.4, 5.3, -0.2); P(this.geo.flag, this.mat('flag', 0), 1.6, 1.6, 1.6, 2.4, 6.0, -0.2); }
      if (!this.instant) this.pop(o, delay + 400);
      if (this.onSecret) this.onSecret({ id: 'island#' + k, title: k === 1 ? 'A year of Yukon' : k + ' years of Yukon', text: (k === 1 ? 'A whole year of logging! An island has risen in the bay, with ' : 'Another full year of logging! The island gets ') + ISLAND_STEPS[k] + '.' }, ev);
    }
  };

  // ---- swimming, cross-country skiing and mountain biking (from Strava) ----

  // Swims build a swimming spot on the lake's near shore, a step for each total distance.
  var SWIM_STEPS = [[0.01, 'A swimming dock and ladder'], [8, 'Lane buoys'], [20, 'A wood-fired sauna'], [40, 'A diving tower'], [65, 'A floating raft'],
    [100, 'A changing hut and towels'], [150, 'A lakeside bathhouse'], [220, 'Lanterns along the dock'], [300, 'The lido pavilion']];
  // Local (x, z) at the swimming spot, where +z runs out over the water, to world ground height.
  function swimGround(x, z) {
    var c = Math.cos(SWIM.rot), s = Math.sin(SWIM.rot);
    return groundY(SWIM.x + x * c + z * s, SWIM.z - x * s + z * c) - LAKE.y;
  }
  Town.prototype.addSwim = function (ev, delay) {
    var S = this.st.swim, self = this, pick = 'swim';
    S.km += ev.km || 0; S.sessions++;
    if (!S.group) {
      var g = new T.Group(); g.position.set(SWIM.x, LAKE.y, SWIM.z); g.rotation.y = SWIM.rot; this.world.add(g);
      S.group = g;
    }
    while (S.n < SWIM_STEPS.length && S.km >= SWIM_STEPS[S.n][0]) {
      var step = S.n++, o = new T.Group(); S.group.add(o);
      var P = function (geo, mat, sx, sy, sz, x, y, z, par) { return self.part(par || o, geo, mat, sx, sy, sz, x, y, z, pick); };
      var onLand = function (obj, x, z) { obj.position.set(x, swimGround(x, z), z); o.add(obj); return obj; };
      switch (step) {
        case 0:
          for (var d = 0; d < 7; d++) {
            P(this.geo.box, this.mat('wood'), 1.3, 0.1, 0.95, 0, 0.62, d);
            if (d % 2 === 0) [-0.55, 0.55].forEach(function (x) { P(self.geo.cyl6, self.mat('trunk'), 0.07, 1.6, 0.07, x, -0.1, d); });
          }
          [-0.35, 0.35].forEach(function (x) { P(self.geo.cyl6, self.mat('silver'), 0.04, 1.2, 0.04, x, 0.4, 6.6); });
          var dm = swimWorld(0, 3), de = swimWorld(0, 6.1), dw = swimWorld(0, 8.2);
          (this.st.decks = this.st.decks || []).push({ cx: dm.x, cz: dm.z, ux: Math.sin(SWIM.rot), uz: Math.cos(SWIM.rot), hl: 3.6, hw: 0.62, y: LAKE.y + 0.67 });
          (this.st.seats = this.st.seats || []).push({ x: de.x, z: de.z, y: LAKE.y + 0.67, rot: SWIM.rot, fish: { x: dw.x, z: dw.z, y: LAKE.y + 0.12 }, low: true });
          for (var rg = 0; rg < 3; rg++) P(this.geo.box, this.mat('silver'), 0.7, 0.04, 0.08, 0, 0.05 + rg * 0.25, 6.62);
          break;
        case 1:
          [-2.2, 2.2].forEach(function (x, li) {
            for (var b = 0; b < 12; b++) P(self.geo.ball, self.mat(b % 2 ? 'plaster' : 'flag', li ? 2 : 0), 0.13, 0.1, 0.13, x, 0.14, 2 + b * 0.75);
          });
          break;
        case 2: {
          var sa = onLand(new T.Group(), -4.2, -3.2); sa.rotation.y = 0.4;
          var SP = function (geo, mat, sx, sy, sz, x, y, z) { return self.part(sa, geo, mat, sx, sy, sz, x, y, z, pick); };
          this.logWalls(SP, 2.0, 1.7, 6);
          SP(this.geo.gable, this.mat('shingle'), 1.55, 0.9, 1.55, 0, 2.03, 0);
          SP(this.geo.box, this.mat('trunk'), 0.55, 1.1, 0.06, 0.3, 0.75, 0.9);
          SP(this.geo.cyl6, this.mat('stoneDark'), 0.1, 0.9, 0.1, -0.6, 2.5, -0.3);
          SP(this.geo.box, this.mat('window'), 0.3, 0.25, 0.04, -0.55, 1.2, 0.9);
          S.sauna = sa;
          break;
        }
        case 3: {
          var tw = new T.Group(); tw.position.set(2.0, 0, 6.2); o.add(tw);
          [[-0.45, -0.45], [0.45, -0.45], [-0.45, 0.45], [0.45, 0.45]].forEach(function (l) { self.part(tw, self.geo.cyl6, self.mat('whitewood'), 0.06, 4.2, 0.06, l[0], 1.3, l[1], pick); });
          [1.3, 3.2].forEach(function (y) { self.part(tw, self.geo.box, self.mat('wood'), 1.1, 0.1, 1.1, 0, y, 0, pick); });
          self.part(tw, self.geo.box, self.mat('woodLight'), 0.35, 0.06, 1.3, 0, 3.22, 1.1, pick);
          for (var lr = 0; lr < 6; lr++) self.part(tw, self.geo.box, self.mat('whitewood'), 0.5, 0.04, 0.05, 0, 0.6 + lr * 0.45, -0.5, pick);
          break;
        }
        case 4: {
          var raft = new T.Group(); raft.position.set(-1.5, 0.18, 11); o.add(raft);
          self.part(raft, self.geo.box, self.mat('wood'), 2.2, 0.16, 2.2, 0, 0, 0, pick);
          [[-0.8, -0.8], [0.8, 0.8], [-0.8, 0.8], [0.8, -0.8]].forEach(function (b) { self.part(raft, self.geo.cyl, self.mat('flag', 0), 0.25, 0.3, 0.25, b[0], -0.15, b[1], pick); });
          S.bob = raft;
          break;
        }
        case 5: {
          var ch = onLand(new T.Group(), -3.4, -7.6); ch.rotation.y = -0.3;
          self.part(ch, self.geo.box, self.mat('whitewood'), 1.4, 1.5, 1.0, 0, 0.75, 0, pick);
          self.part(ch, self.geo.box, self.mat('roof', 1), 1.6, 0.1, 1.2, 0, 1.55, 0, pick);
          self.part(ch, self.geo.box, self.mat('trunk'), 0.5, 1.0, 0.04, 0, 0.5, 0.51, pick);
          // A towel line.
          [-0.9, 1.6].forEach(function (x) { self.part(ch, self.geo.cyl6, self.mat('wood'), 0.04, 1.3, 0.04, x + 0.5, 0.65, 1.3, pick); });
          for (var tl = 0; tl < 4; tl++) self.part(ch, self.geo.box, self.mat('canvas', tl % 3), 0.38, 0.5, 0.03, -0.1 + tl * 0.55, 0.95, 1.3, pick);
          break;
        }
        case 6: {
          var bh = onLand(new T.Group(), 0, -4.6);
          self.part(bh, self.geo.box, self.mat('plaster', 0), 6.0, 2.0, 2.4, 0, 1.0, 0, pick);
          self.part(bh, self.geo.gable, self.mat('roof', 3), 3.75, 1.3, 1.75, 0, 2.0, 0, pick);
          for (var w = -2; w <= 2; w++) self.part(bh, self.geo.box, self.mat('window'), 0.5, 0.7, 0.04, w * 1.1, 1.1, 1.21, pick);
          self.part(bh, self.geo.box, self.mat('wood'), 6.2, 0.15, 1.6, 0, 0.1, 2.0, pick);
          [-2.6, 0, 2.6].forEach(function (x) { self.part(bh, self.geo.cyl6, self.mat('whitewood'), 0.08, 1.6, 0.08, x, 0.9, 2.7, pick); });
          self.part(bh, self.geo.box, self.mat('canvas', 2), 6.0, 0.08, 1.4, 0, 1.75, 2.1, pick).rotation.x = 0.25;
          break;
        }
        case 7:
          for (var ln = 0; ln < 4; ln++) {
            P(this.geo.cyl6, this.mat('wood'), 0.04, 1.0, 0.04, ln % 2 ? 0.62 : -0.62, 1.15, 0.5 + ln * 1.8);
            P(this.geo.box, this.mat('lantern'), 0.16, 0.2, 0.16, ln % 2 ? 0.62 : -0.62, 1.7, 0.5 + ln * 1.8);
          }
          break;
        case 8: {
          var pv = onLand(new T.Group(), -4.5, 1.2); pv.rotation.y = 0.5;
          self.part(pv, self.geo.cyl6, self.mat('stone', 0), 2.0, 0.3, 2.0, 0, 0.15, 0, pick);
          for (var c6 = 0; c6 < 6; c6++) { var ca = c6 / 6 * Math.PI * 2; self.part(pv, self.geo.cyl, self.mat('plaster', 0), 0.12, 2.0, 0.12, Math.cos(ca) * 1.7, 1.3, Math.sin(ca) * 1.7, pick); }
          self.part(pv, self.geo.ball, self.mat('copper'), 2.0, 1.1, 2.0, 0, 2.3, 0, pick);
          self.part(pv, self.geo.ball, self.mat('gold'), 0.15, 0.15, 0.15, 0, 3.45, 0, pick);
          break;
        }
      }
      if (!this.instant) this.pop(o, delay + 200);
    }
    // A swimmer doing lengths between the buoy lines.
    if (!S.swimmer) {
      var sw = new T.Group(); S.group.add(sw);
      this.part(sw, this.geo.ball, this.mat('fur', 1), 0.16, 0.13, 0.16, 0, 0.1, 0, pick);
      this.part(sw, this.geo.ball, this.mat('flag', 0), 0.17, 0.08, 0.17, 0, 0.17, 0, pick);
      [-1, 1].forEach(function (sd) { var arm = self.part(sw, self.geo.box, self.mat('fox', 1), 0.07, 0.07, 0.45, sd * 0.2, 0.1, 0.05, pick); arm.userData.sd = sd; });
      S.swimmer = sw;
    }
    this.stepSwim(0);
  };
  Town.prototype.stepSwim = function (now) {
    var S = this.st.swim;
    if (!S || !S.swimmer) return;
    var lap = (now / 16000) % 1, out = lap < 0.5, t = out ? lap * 2 : (1 - lap) * 2;
    S.swimmer.visible = this.season !== 'winter';
    S.swimmer.position.set(0, 0.12 + Math.sin(now / 300) * 0.02, 2.4 + t * 7.5);
    S.swimmer.rotation.y = out ? 0 : Math.PI;
    S.swimmer.children.forEach(function (c) { if (c.userData.sd) c.rotation.x = Math.sin(now / 260 + (c.userData.sd > 0 ? Math.PI : 0)) * 1.2; });
    if (S.bob) S.bob.position.y = 0.18 + Math.sin(now / 1400) * 0.05;
    this.needsRender = true;
  };

  // Cross-country ski days build a cozy cabin trail by the lake: a log ski cabin, then a trail of
  // little stepping-stone dashes that winds round the lake through spruces (about 0.3 map units
  // per km skied), with something new beside it at each milestone.
  var NORDIC_STEPS = [[0.01, 'A log ski cabin and ski rack'], [30, 'A bench by the trail'], [70, 'Lanterns along the trail'], [120, 'A birdhouse on a post'],
    [180, 'A fire pit with log seats'], [260, 'A sled and a snowman'], [350, 'A little sauna cabin'], [500, 'Bunting and a lookout at the trail end']];
  var NORDIC = (function () {
    var a0 = Math.atan2(-LAKE.c.z, -LAKE.c.x) + 0.75, pts = [], len = 0;
    for (var i = 0; i <= 120; i++) {
      var t = i / 120, a = a0 + t * 1.6, rr = LAKE.R + 7 + Math.sin(t * 9) * 1.4 + t;
      var p = { x: LAKE.c.x + Math.cos(a) * rr, z: LAKE.c.z + Math.sin(a) * rr };
      if (i) len += Math.hypot(p.x - pts[i - 1].x, p.z - pts[i - 1].z);
      p.s = len; pts.push(p);
    }
    var ca = a0 - 0.12, cr = LAKE.R + 9.5;
    return { pts: pts, len: len, cabin: { x: LAKE.c.x + Math.cos(ca) * cr, z: LAKE.c.z + Math.sin(ca) * cr } };
  })();
  // A point along the trail, with its heading and the unit normal pointing away from the lake.
  function nordicAt(s) {
    var P = NORDIC.pts, k = 1;
    while (k < P.length - 1 && P[k].s < s) k++;
    var a = P[k - 1], b = P[k], f = Math.max(0, Math.min(1, (s - a.s) / ((b.s - a.s) || 1)));
    var x = a.x + (b.x - a.x) * f, z = a.z + (b.z - a.z) * f, dx = b.x - a.x, dz = b.z - a.z, l = Math.hypot(dx, dz) || 1;
    var nx = -dz / l, nz = dx / l;
    if ((x - LAKE.c.x) * nx + (z - LAKE.c.z) * nz < 0) { nx = -nx; nz = -nz; }
    return { x: x, z: z, ang: Math.atan2(dx, dz), nx: nx, nz: nz };
  }
  Town.prototype.addNordic = function (ev, delay) {
    var N = this.st.nordic, self = this, pick = 'nordic';
    N.km += ev.km || 8; N.sessions++;
    if (!N.group) { N.group = new T.Group(); this.world.add(N.group); N.dashes = 0; N.pines = 0; }
    var G = N.group;
    function P(par, geo, mat, sx, sy, sz, x, y, z) { return self.part(par, geo, mat, sx, sy, sz, x, y, z, pick); }
    // Something sitting on the ground beside the trail: off > 0 is the outside, away from the lake.
    function beside(s, off, face) {
      var q = nordicAt(s), g = new T.Group(), x = q.x + q.nx * off, z = q.z + q.nz * off;
      g.position.set(x, groundY(x, z), z); g.rotation.y = face ? Math.atan2(-q.nx * Math.sign(off), -q.nz * Math.sign(off)) : q.ang; G.add(g);
      return g;
    }
    // The trail grows a dash at a time.
    var have = Math.min(NORDIC.len, 3 + N.km * 0.3), k0 = N.dashes;
    while ((N.dashes + 1) * 0.8 <= have) {
      var q = nordicAt(++N.dashes * 0.8), d = P(G, this.geo.box, this.mat('path'), 0.42, 0.06, 0.28, q.x, groundY(q.x, q.z) + 0.03, q.z);
      d.rotation.y = q.ang;
      if (!this.instant) this.pop(d, delay + (N.dashes - k0) * 25);
    }
    // A pair of spruces for every 25 km, along the finished trail.
    var want = Math.min(32, Math.floor(N.km / 25));
    while (N.pines < want) {
      var ps = (N.pines + 0.5) / 32 * NORDIC.len;
      if (ps > have) break;
      var pq = nordicAt(ps), side = N.pines % 2 ? 1 : -1, off = side * (1.3 + (N.pines * 0.37) % 1);
      this.plantTree({ x: pq.x + pq.nx * off, z: pq.z + pq.nz * off }, 'spruce', 900 + N.pines, delay + 200, pick, 0.55 + (N.pines % 3) * 0.08);
      N.pines++;
    }
    while (N.n < NORDIC_STEPS.length && N.km >= NORDIC_STEPS[N.n][0]) {
      var step = N.n++, g;
      switch (step) {
        case 0: {
          g = new T.Group(); var c = NORDIC.cabin;
          g.position.set(c.x, groundY(c.x, c.z), c.z); g.rotation.y = Math.atan2(LAKE.c.x - c.x, LAKE.c.z - c.z); G.add(g);
          var CP = function (geo, mat, sx, sy, sz, x, y, z) { return P(g, geo, mat, sx, sy, sz, x, y, z); };
          this.logWalls(CP, 2.2, 1.8, 7);
          CP(this.geo.gable, this.mat('roof', 0), 1.6, 1.0, 1.6, 0, 2.3, 0);
          CP(this.geo.box, this.mat('trunk'), 0.5, 1.05, 0.06, -0.35, 0.7, 0.95);
          CP(this.geo.box, this.mat('window'), 0.42, 0.36, 0.05, 0.55, 1.25, 0.95);
          CP(this.geo.box, this.mat('stone', 2), 0.32, 1.1, 0.32, -0.6, 2.75, -0.35);
          var chim = new T.Object3D(); chim.position.set(-0.6, 3.4, -0.35); g.add(chim); N.chim = chim;
          // The ski rack: a rail with bright skis and poles leaning on it.
          CP(this.geo.box, this.mat('wood'), 0.06, 0.06, 1.5, 1.75, 0.75, 0.2);
          [[1.75, -0.45], [1.75, 0.85]].forEach(function (l) { CP(self.geo.cyl6, self.mat('wood'), 0.04, 0.8, 0.04, l[0], 0.4, l[1]); });
          for (var sk = 0; sk < 4; sk++) CP(this.geo.box, this.mat('flag', sk), 0.05, 1.5, 0.08, 1.85, 0.72, -0.3 + sk * 0.3).rotation.z = -0.18;
          CP(this.geo.box, this.mat('woodLight'), 1.0, 0.08, 0.6, -0.35, 0.06, 1.3);
          break;
        }
        case 1:
          g = beside(NORDIC.len * 0.22, 1.1, true);
          P(g, this.geo.box, this.mat('wood'), 1.0, 0.08, 0.32, 0, 0.42, 0);
          P(g, this.geo.box, this.mat('wood'), 1.0, 0.3, 0.06, 0, 0.62, -0.16);
          [-0.4, 0.4].forEach(function (x) { P(g, self.geo.box, self.mat('trunk'), 0.08, 0.4, 0.28, x, 0.2, 0); });
          break;
        case 2:
          g = new T.Group(); G.add(g);
          for (var ls = 2; ls < NORDIC.len; ls += 5.5) {
            var lq = nordicAt(ls), lx = lq.x + lq.nx * 0.7, lz = lq.z + lq.nz * 0.7, ly = groundY(lx, lz);
            P(g, this.geo.cyl6, this.mat('wood'), 0.04, 0.9, 0.04, lx, ly + 0.45, lz);
            P(g, this.geo.box, this.mat('lantern'), 0.16, 0.18, 0.16, lx, ly + 0.95, lz);
          }
          break;
        case 3:
          g = beside(NORDIC.len * 0.4, 1.2, true);
          P(g, this.geo.cyl6, this.mat('wood'), 0.05, 1.3, 0.05, 0, 0.65, 0);
          P(g, this.geo.box, this.mat('roofJo'), 0.32, 0.32, 0.3, 0, 1.45, 0);
          P(g, this.geo.gable, this.mat('roof', 2), 0.24, 0.25, 0.25, 0, 1.6, 0);
          P(g, this.geo.box, this.mat('stoneDark'), 0.1, 0.1, 0.02, 0, 1.45, 0.16);
          break;
        case 4:
          g = beside(NORDIC.len * 0.58, -1.8, true);
          for (var fr = 0; fr < 7; fr++) { var fa = fr / 7 * Math.PI * 2; P(g, this.geo.box, this.mat('rock'), 0.2, 0.16, 0.2, Math.cos(fa) * 0.42, 0.08, Math.sin(fa) * 0.42); }
          P(g, this.geo.cone, this.mat('fire'), 0.24, 0.5, 0.24, 0, 0.25, 0);
          [[-1.0, 0.2, 0.3], [0.9, 0.4, -0.4]].forEach(function (lg) { P(g, self.geo.cyl6, self.mat('logwood', 0), 0.16, 0.9, 0.16, lg[0], 0.16, lg[1]).rotation.set(Math.PI / 2, lg[2], 0, 'YXZ'); });
          break;
        case 5:
          g = beside(NORDIC.len * 0.74, 1.3, true);
          P(g, this.geo.box, this.mat('roofJo'), 0.45, 0.12, 0.9, -0.5, 0.18, 0);
          [-0.68, -0.32].forEach(function (x) { P(g, self.geo.box, self.mat('stoneDark'), 0.04, 0.04, 1.0, x, 0.06, 0.03); });
          P(g, this.geo.ball, this.mat('snow'), 0.36, 0.33, 0.36, 0.6, 0.33, 0);
          P(g, this.geo.ball, this.mat('snow'), 0.27, 0.25, 0.27, 0.6, 0.83, 0);
          P(g, this.geo.ball, this.mat('snow'), 0.19, 0.18, 0.19, 0.6, 1.2, 0);
          P(g, this.geo.cone, this.mat('copper'), 0.04, 0.2, 0.04, 0.6, 1.2, 0.24).rotation.x = Math.PI / 2;
          P(g, this.geo.box, this.mat('stoneDark'), 0.26, 0.2, 0.26, 0.6, 1.45, 0);
          P(g, this.geo.box, this.mat('flag', 0), 0.32, 0.06, 0.3, 0.6, 1.0, 0);
          break;
        case 6: {
          g = new T.Group(); var c2 = NORDIC.cabin, sa = Math.atan2(LAKE.c.x - c2.x, LAKE.c.z - c2.z), sx2 = c2.x + Math.cos(sa) * 3.4, sz2 = c2.z - Math.sin(sa) * 3.4;
          g.position.set(sx2, groundY(sx2, sz2), sz2); g.rotation.y = sa; G.add(g);
          var SP2 = function (geo, mat, sx, sy, sz, x, y, z) { return P(g, geo, mat, sx, sy, sz, x, y, z); };
          this.logWalls(SP2, 1.5, 1.3, 5);
          SP2(this.geo.gable, this.mat('shingle'), 1.15, 0.7, 1.25, 0, 1.74, 0);
          SP2(this.geo.box, this.mat('trunk'), 0.4, 0.85, 0.05, 0.2, 0.6, 0.7);
          SP2(this.geo.cyl6, this.mat('stoneDark'), 0.07, 0.8, 0.07, -0.4, 2.2, -0.2);
          break;
        }
        case 7: {
          g = beside(NORDIC.len - 0.5, 1.4, true);
          [[-0.45, -0.45], [0.45, -0.45], [-0.45, 0.45], [0.45, 0.45]].forEach(function (l) { P(g, self.geo.cyl6, self.mat('logwood', 1), 0.06, 1.6, 0.06, l[0], 0.8, l[1]); });
          P(g, this.geo.box, this.mat('wood'), 1.1, 0.1, 1.1, 0, 1.6, 0);
          P(g, this.geo.cone4, this.mat('roof', 0), 0.85, 0.6, 0.85, 0, 2.15, 0).rotation.y = Math.PI / 4;
          P(g, this.geo.cyl6, this.mat('wood'), 0.03, 1.0, 0.03, 0.4, 2.4, 0.4); P(g, this.geo.flag, this.mat('flag', 2), 1.1, 1.1, 1.1, 0.4, 2.9, 0.4);
          // Bunting along the cabin's front.
          var cab = G.children.filter(function (o) { return o.userData.cabin; })[0];
          var c3 = NORDIC.cabin, bg = new T.Group(); bg.position.set(c3.x, groundY(c3.x, c3.z), c3.z); bg.rotation.y = Math.atan2(LAKE.c.x - c3.x, LAKE.c.z - c3.z); G.add(bg);
          for (var bf = 0; bf < 8; bf++) P(bg, this.geo.cone4, this.mat('flag', bf), 0.1, 0.18, 0.04, -1.2 + bf * 0.34, 2.15 - Math.sin(bf / 7 * Math.PI) * 0.12, 1.05).rotation.x = Math.PI;
          if (!this.instant) this.pop(bg, delay + 400);
          break;
        }
      }
      if (g && !this.instant) this.pop(g, delay + 300);
    }
  };

  // Mountain bike rides grow a little bike shop cottage on a knoll behind the mountains, one
  // upgrade at a time, like the friends' houses.
  var MTB_STEPS = [[1, 'A little bike shop cottage'], [3, 'A bike rack with bikes'], [6, 'Flower boxes and a bench'], [10, 'A repair stand and tool wall'],
    [15, 'A little dirt loop out front'], [21, 'A café patio with umbrellas'], [28, 'Bunting and lanterns'], [36, 'A second storey with a balcony'], [50, 'A timber lodge wing and a flag']];
  Town.prototype.bikeModel = function (par, x, z, rot, col, pick) {
    var b = new T.Group(); b.position.set(x, 0, z); b.rotation.y = rot || 0; par.add(b);
    var self = this;
    [-0.24, 0.24].forEach(function (bz) { self.part(b, self.geo.torus, self.mat('stoneDark'), 0.17, 0.17, 0.17, 0, 0.19, bz, pick).rotation.y = Math.PI / 2; });
    this.part(b, this.geo.box, this.mat('flag', col), 0.05, 0.05, 0.5, 0, 0.3, 0, pick);
    this.part(b, this.geo.box, this.mat('flag', col), 0.05, 0.2, 0.05, 0, 0.36, -0.08, pick);
    this.part(b, this.geo.box, this.mat('stoneDark'), 0.24, 0.04, 0.04, 0, 0.46, 0.2, pick);
    this.part(b, this.geo.box, this.mat('trunk'), 0.1, 0.04, 0.14, 0, 0.47, -0.1, pick);
    return b;
  };
  Town.prototype.addMtb = function (ev, delay) {
    var M = this.st.mtb, self = this, pick = 'mtb';
    if (!MTB_HILL) return;
    M.km += ev.km || 15; M.rides++;
    if (!M.group) {
      M.group = new T.Group(); M.group.position.set(MTB_HILL.x, groundY(MTB_HILL.x, MTB_HILL.z), MTB_HILL.z);
      M.group.rotation.y = Math.atan2(-MTB_HILL.x, -MTB_HILL.z); // the front faces town
      this.world.add(M.group);
    }
    var G = M.group;
    this.growMtbLane(delay);
    while (M.n < MTB_STEPS.length && M.rides >= MTB_STEPS[M.n][0]) {
      var step = M.n++, g = new T.Group();
      var P = function (geo, mat, sx, sy, sz, x, y, z) { return self.part(g, geo, mat, sx, sy, sz, x, y, z, pick); };
      var at = function (x, z) { G.add(g); g.position.set(x, 0, z); self.settle(g, x, z, G); return g; };
      switch (step) {
        case 0:
          P(this.geo.box, this.mat('stone', 2), 2.9, 0.2, 2.3, 0, 0.1, 0);
          P(this.geo.box, this.mat('plaster', 0), 2.6, 1.5, 2.0, 0, 0.95, 0);
          var roof = new T.Group(); roof.position.y = 1.7; g.add(roof); M.roof = roof;
          this.part(roof, this.geo.gable, this.mat('roof', 0), 1.75, 1.0, 1.5, 0, 0, 0, pick);
          this.part(roof, this.geo.box, this.mat('stone', 1), 0.3, 0.9, 0.3, 0.8, 0.55, -0.4, pick);
          var chim = new T.Object3D(); chim.position.set(0.8, 1.1, -0.4); roof.add(chim); M.chim = chim;
          P(this.geo.box, this.mat('trunk'), 0.55, 1.0, 0.05, -0.5, 0.7, 1.01);
          P(this.geo.box, this.mat('window'), 0.6, 0.5, 0.05, 0.6, 1.05, 1.01);
          P(this.geo.box, this.mat('whitewood'), 0.72, 0.06, 0.07, 0.6, 0.78, 1.03);
          // The shop sign: a little bike on a board over the door.
          P(this.geo.box, this.mat('woodLight'), 0.9, 0.34, 0.05, -0.5, 1.45, 1.04);
          [-0.68, -0.32].forEach(function (x) { P(self.geo.torus, self.mat('stoneDark'), 0.09, 0.09, 0.09, x, 1.43, 1.08); });
          P(this.geo.box, this.mat('flag', 0), 0.3, 0.04, 0.03, -0.5, 1.48, 1.08);
          G.add(g);
          break;
        case 1:
          P(this.geo.box, this.mat('stoneDark'), 1.8, 0.05, 0.05, 0, 0.42, 0);
          [-0.9, 0.9].forEach(function (x) { P(self.geo.cyl6, self.mat('stoneDark'), 0.03, 0.42, 0.03, x, 0.21, 0); });
          [0, 1, 3].forEach(function (c, i) { self.bikeModel(g, -0.6 + i * 0.6, 0.15, 0, c, pick); });
          at(2.6, 1.4).rotation.y = Math.PI / 2;
          break;
        case 2:
          [-0.5, 0.6].forEach(function (x) {
            P(self.geo.box, self.mat('wood'), 0.7, 0.16, 0.2, x, 0.0, 0);
            for (var f = 0; f < 4; f++) P(self.geo.ball, self.mat('flag', (f + (x > 0 ? 1 : 0)) % 5), 0.08, 0.08, 0.08, x - 0.24 + f * 0.16, 0.12, 0.02);
          });
          g.position.set(0, 0.62, 1.12); G.add(g);
          var bench = new T.Group(); G.add(bench); bench.position.set(-2.0, 0, 1.3); this.settle(bench, -2.0, 1.3, G);
          this.part(bench, this.geo.box, this.mat('wood'), 1.0, 0.08, 0.3, 0, 0.4, 0, pick);
          this.part(bench, this.geo.box, this.mat('wood'), 1.0, 0.28, 0.05, 0, 0.6, -0.15, pick);
          [-0.4, 0.4].forEach(function (x) { self.part(bench, self.geo.box, self.mat('trunk'), 0.07, 0.4, 0.26, x, 0.2, 0, pick); });
          if (!this.instant) this.pop(bench, delay + 400);
          break;
        case 3:
          P(this.geo.cyl6, this.mat('stoneDark'), 0.04, 0.9, 0.04, 0, 0.45, 0);
          P(this.geo.box, this.mat('stoneDark'), 0.3, 0.05, 0.05, 0, 0.9, 0);
          this.bikeModel(g, 0, 0, Math.PI / 2, 2, pick).position.y = 0.5;
          P(this.geo.box, this.mat('wood'), 0.06, 0.8, 1.2, -0.75, 0.9, -1.2 + 1.2);
          for (var tl = 0; tl < 4; tl++) P(this.geo.box, this.mat('silver'), 0.04, 0.3, 0.06, -0.7, 0.8 + (tl % 2) * 0.25, -0.4 + tl * 0.25);
          at(1.6, 2.2);
          break;
        case 4: {
          // A little oval of dirt dashes in front of the shop, with two small bumps.
          var dz0 = 4.6;
          for (var dd = 0; dd < 30; dd++) {
            var da = dd / 30 * Math.PI * 2, dx = Math.cos(da) * 2.6, dz = dz0 + Math.sin(da) * 1.4;
            var dash = P(this.geo.box, this.mat('dirt'), 0.36, 0.06, 0.24, dx, 0, dz); dash.rotation.y = -da;
            dash.position.y = this.localGround(G, dx, dz) + 0.03;
          }
          [0.6, Math.PI + 0.6].forEach(function (ba) { var bx = Math.cos(ba) * 2.6, bz = dz0 + Math.sin(ba) * 1.4; var bm = P(self.geo.blob, self.mat('dirt'), 0.4, 0.14, 0.3, bx, self.localGround(G, bx, bz), bz); bm.rotation.y = -ba; });
          G.add(g); M.loop = { cz: dz0 };
          break;
        }
        case 5:
          P(this.geo.box, this.mat('woodLight'), 2.2, 0.1, 1.8, 0, 0.05, 0);
          [[-0.5, -0.3, 1], [0.55, 0.35, 2]].forEach(function (t) {
            P(self.geo.cyl, self.mat('whitewood'), 0.3, 0.05, 0.3, t[0], 0.55, t[1]);
            P(self.geo.cyl6, self.mat('wood'), 0.03, 0.5, 0.03, t[0], 0.3, t[1]);
            P(self.geo.cyl6, self.mat('wood'), 0.025, 1.1, 0.025, t[0], 1.0, t[1]);
            P(self.geo.cone, self.mat('canvas', t[2]), 0.55, 0.3, 0.55, t[0], 1.6, t[1]);
            [-0.38, 0.38].forEach(function (cx) { P(self.geo.box, self.mat('wood'), 0.2, 0.3, 0.2, t[0] + cx, 0.25, t[1]); });
          });
          at(-3.3, 1.8);
          break;
        case 6:
          for (var bn = 0; bn < 9; bn++) P(this.geo.cone4, this.mat('flag', bn), 0.09, 0.16, 0.03, -1.3 + bn * 0.33, 1.62 - Math.sin(bn / 8 * Math.PI) * 0.14, 1.06).rotation.x = Math.PI;
          [-1.5, 1.5].forEach(function (x) { P(self.geo.cyl6, self.mat('wood'), 0.04, 1.2, 0.04, x * 1.6, 0.6, 2.1); P(self.geo.box, self.mat('lantern'), 0.16, 0.18, 0.16, x * 1.6, 1.25, 2.1); });
          G.add(g);
          break;
        case 7:
          P(this.geo.box, this.mat('plaster', 0), 2.6, 1.0, 2.0, 0, 2.2, 0);
          P(this.geo.box, this.mat('window'), 0.45, 0.4, 0.05, -0.6, 2.25, 1.01);
          P(this.geo.box, this.mat('window'), 0.45, 0.4, 0.05, 0.6, 2.25, 1.01);
          P(this.geo.box, this.mat('wood'), 2.0, 0.08, 0.6, 0, 1.75, 1.3);
          for (var rl = 0; rl < 9; rl++) P(this.geo.box, this.mat('whitewood'), 0.04, 0.32, 0.04, -0.95 + rl * 0.24, 1.95, 1.58);
          P(this.geo.box, this.mat('whitewood'), 2.0, 0.04, 0.05, 0, 2.12, 1.58);
          G.add(g);
          this.animTo(M.roof, 2.7, delay + 200);
          break;
        case 8:
          P(this.geo.box, this.mat('logwood', 0), 2.0, 1.5, 1.8, 0, 0.75, 0);
          for (var lr = 0; lr < 5; lr++) P(this.geo.box, this.mat('logwood', lr % 2), 2.05, 0.1, 1.85, 0, 0.2 + lr * 0.3, 0);
          P(this.geo.gable, this.mat('shingle'), 1.4, 0.9, 1.35, 0, 1.5, 0);
          P(this.geo.box, this.mat('window'), 0.5, 0.4, 0.05, 0, 0.9, 0.92);
          P(this.geo.cyl6, this.mat('wood'), 0.04, 2.6, 0.04, 1.4, 1.3, 1.2);
          P(this.geo.flag, this.mat('flag', 3), 1.4, 1.4, 1.4, 1.4, 2.6, 1.2);
          at(-2.6, -0.5);
          break;
      }
      if (!this.instant) this.pop(g, delay + 300);
    }
    if (!M.rider) {
      M.rider = this.bikeModel(G, 0, 0, 0, 1, pick);
      this.part(M.rider, this.geo.box, this.mat('flag', 3), 0.18, 0.3, 0.16, 0, 0.62, -0.04, pick);
      this.part(M.rider, this.geo.ball, this.mat('flag', 2), 0.11, 0.09, 0.11, 0, 0.84, 0.02, pick);
    }
    this.stepMtb(0);
  };
  // Three dashes of the lane per ride, from the ring road out (like the commuter lane), with
  // a stone portal at each end of the tunnel once the lane reaches it.
  Town.prototype.growMtbLane = function (delay) {
    var M = this.st.mtb, L = MTB_LANE, self = this, pick = 'mtb';
    if (!L) return;
    if (!M.lane) { M.lane = new T.Group(); this.world.add(M.lane); M.dashes = 0; M.portals = 0; }
    var want = Math.min(L.pts.length, M.rides * 3), k0 = M.dashes;
    function portal(i, dir) {
      var p = L.pts[i], g = new T.Group(), y = groundY(p.x, p.z);
      g.position.set(p.x, y, p.z); g.rotation.y = p.ang + (dir < 0 ? Math.PI : 0); M.lane.add(g);
      var P = function (geo, mat, sx, sy, sz, x, y2, z) { return self.part(g, geo, mat, sx, sy, sz, x, y2, z, pick); };
      P(self.geo.box, self.mat('stoneDark'), 1.5, 1.4, 0.5, 0, 0.7, 0.2);
      P(self.geo.box, self.mat('stone', 1), 0.42, 1.6, 0.6, -0.78, 0.8, 0);
      P(self.geo.box, self.mat('stone', 1), 0.42, 1.6, 0.6, 0.78, 0.8, 0);
      P(self.geo.box, self.mat('stone', 0), 2.0, 0.4, 0.62, 0, 1.75, 0);
      P(self.geo.box, self.mat('lantern'), 0.16, 0.18, 0.1, 0, 1.45, 0.32);
      if (!self.instant) self.pop(g, delay + 200);
    }
    while (M.dashes < want) {
      var i = M.dashes++, p = L.pts[i];
      if (i === L.t0) portal(L.t0, 1);
      if (i === L.t1) portal(L.t1, -1);
      if (p.tunnel) continue;
      var d = this.part(M.lane, this.geo.box, this.mat('dirt'), 0.5, 0.06, 0.3, p.x, groundY(p.x, p.z) + 0.03, p.z, pick);
      d.rotation.y = p.ang;
      if (!this.instant) this.pop(d, delay + (i - k0) * 60);
    }
  };
  // Ground height at a point given in a group's own coordinates, relative to the group.
  Town.prototype.localGround = function (par, x, z) {
    par.updateMatrixWorld(true);
    var v = new T.Vector3(x, 0, z); par.localToWorld(v);
    return groundY(v.x, v.z) - par.position.y;
  };
  Town.prototype.stepMtb = function (now) {
    var M = this.st.mtb;
    if (!M || !M.rider) return;
    M.rider.visible = !!M.loop && this.season !== 'winter';
    if (!M.loop) return;
    var a = now / 4000, x = Math.cos(a) * 2.6, z = M.loop.cz + Math.sin(a) * 1.4;
    M.rider.position.set(x, this.localGround(M.group, x, z) + 0.06, z);
    M.rider.rotation.y = Math.atan2(-Math.sin(a) * 2.6, Math.cos(a) * 1.4);
    this.needsRender = true;
  };

  // ---- the lighthouse beam, northern lights and chimney smoke -------------
  Town.prototype.buildBeam = function (light) {
    var g = new T.Group(); g.position.y = 6.1; light.add(g);
    var mat = new T.MeshBasicMaterial({ color: '#fff3b8', transparent: true, opacity: 0.05, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, fog: false });
    [0, Math.PI].forEach(function (a) {
      var c = new T.Mesh(new T.ConeGeometry(4, 34, 18, 1, true), mat);
      c.rotation.z = Math.PI / 2; c.position.x = 17;
      var arm = new T.Group(); arm.rotation.y = a; arm.add(c); g.add(arm);
    });
    g.visible = false;
    this.beam = g;
  };
  Town.prototype.buildAurora = function () {
    var g = new T.Group(), c = polar(140, 70);
    g.position.set(c.x, 46, c.z);
    g.rotation.y = Math.PI / 4;
    this.aurora = { group: g, bands: [] };
    for (var b = 0; b < 4; b++) {
      var geo = new T.PlaneGeometry(150, 16 + b * 3, 60, 1), cols = new Float32Array(geo.attributes.position.count * 3);
      for (var i = 0; i < geo.attributes.position.count; i++) {
        var top = geo.attributes.position.getY(i) > 0, cc = new T.Color(top ? (b % 2 ? '#a070ff' : '#60d0ff') : '#40ff90');
        cols[i * 3] = cc.r; cols[i * 3 + 1] = cc.g; cols[i * 3 + 2] = cc.b;
      }
      geo.setAttribute('color', new T.BufferAttribute(cols, 3));
      var m = new T.Mesh(geo, new T.MeshBasicMaterial({ vertexColors: true, transparent: true, opacity: 0.22, blending: T.AdditiveBlending, depthWrite: false, side: T.DoubleSide, fog: false }));
      m.position.set(0, b * 5, -b * 9);
      m.userData.base = Float32Array.from(geo.attributes.position.array);
      g.add(m); this.aurora.bands.push(m);
    }
    g.visible = false;
    this.scene.add(g);
  };
  // Planned workouts (uncoloured in the sheet this week) show as pale ghosts of what they'll build:
  // a glowing course of stone over the tower, a sapling in the forest, a pennant on the field. They
  // pop in for real once the cell turns green.
  Town.prototype.setPlanned = function (list) {
    var self = this, s = this.st;
    if (this.ghosts) { if (this.ghosts.parent) this.ghosts.parent.remove(this.ghosts); this.ghosts = null; }
    this.planned = list || [];
    if (!this.planned.length) { this.needsRender = true; return; }
    var g = this.ghosts = new T.Group(); this.world.add(g);
    var mat = this.ghostMat || (this.ghostMat = new T.MeshBasicMaterial({ color: '#d8ecff', transparent: true, opacity: 0.4, depthWrite: false }));
    function P(geo, sx, sy, sz, x, y, z) { var m = new T.Mesh(geo, mat); m.scale.set(sx, sy, sz); m.position.set(x, y, z); m.userData.pick = 'planned'; g.add(m); self.picks.push(m); return m; }
    var stack = {}, v = new T.Vector3(), saplings = 0, crops = 0;
    this.planned.forEach(function (ev) {
      if (ev.kind === 'lift') (ev.groups || []).forEach(function (key) {
        var tw = s.towers[key];
        if (!tw) return;
        tw.group.getWorldPosition(v);
        var k = stack[key] = (stack[key] || 0) + 1, y = v.y + self.towerTop(tw) + 1.9 + k * 0.55;
        P(self.geo.cyl, tw.r * 1.05, 0.38, tw.r * 1.05, v.x, y, v.z);
      });
      else if (ev.kind === 'run') {
        var G = GROVES.sequoia === undefined ? null : GROVES[groveOf(runTree(ev))], f = s.forest, used = f.used || {}, best = -1, bd = 1e9;
        for (var i = 0; i < FOREST.length; i++) { if (used[i]) continue; var d = Math.hypot(FOREST[i].x - G.seed.x, FOREST[i].z - G.seed.z) + saplings * 0.01 + i * 1e-6; if (d < bd) { bd = d; best = i; } }
        if (best < 0) return;
        var q = FOREST[(best + saplings * 3) % FOREST.length], y0 = groundY(q.x, q.z); saplings++;
        P(self.geo.cyl6, 0.12, 0.8, 0.12, q.x, y0 + 0.4, q.z); P(self.geo.cone6, 0.75, 1.6, 0.75, q.x, y0 + 1.5, q.z);
      } else if (ev.kind === 'sport' && s.sports[ev.sport]) {
        s.sports[ev.sport].group.getWorldPosition(v);
        P(self.geo.cyl6, 0.04, 1.0, 0.04, v.x, v.y + 0.5, v.z); P(self.geo.box, 0.5, 0.32, 0.03, v.x + 0.25, v.y + 0.85, v.z);
      } else if (ev.kind === 'bike' || ev.kind === 'mtb') {
        var cp = polar(FARM_SPINE + 4 + crops * 3, 31); crops++;
        P(self.geo.blob, 0.4, 0.35, 0.4, cp.x, groundY(cp.x, cp.z) + 0.3, cp.z);
      }
    });
    this.needsRender = true;
  };
  // A shooting star now and then on clear nights.
  Town.prototype.stepShootingStar = function (dt, now, night) {
    var S = this.star;
    if (!S) {
      var m = new T.Mesh(new T.BoxGeometry(0.12, 0.12, 6), new T.MeshBasicMaterial({ color: '#fffbe6', transparent: true, opacity: 0, blending: T.AdditiveBlending, depthWrite: false, fog: false }));
      m.visible = false; this.scene.add(m);
      S = this.star = { m: m, t: -1, next: now + 15000 };
    }
    if (S.t < 0) {
      if (!night || now < S.next || WEATHER[this.weatherNow]) return;
      var a = Math.random() * Math.PI * 2;
      S.from = new T.Vector3(Math.cos(a) * 60, 48 + Math.random() * 10, Math.sin(a) * 60);
      S.dir = new T.Vector3(-Math.sin(a) + (Math.random() - 0.5), -0.35, Math.cos(a) + (Math.random() - 0.5)).normalize();
      S.t = 0; S.m.visible = true;
    }
    S.t += dt / 1.1;
    S.m.position.copy(S.from).addScaledVector(S.dir, S.t * 40);
    S.m.lookAt(S.m.position.clone().add(S.dir));
    S.m.material.opacity = Math.sin(Math.min(1, S.t) * Math.PI) * 0.9;
    if (S.t >= 1) { S.t = -1; S.m.visible = false; S.next = now + 20000 + Math.random() * 40000; }
  };
  // Tap Jo and a few hearts float up.
  Town.prototype.hearts = function () {
    var c = this.st.critters.fox;
    if (!c) return;
    this.heartList = this.heartList || [];
    for (var i = 0; i < 6; i++) {
      var h = this.mesh(this.geo.cone4, this.mat('flag', 0), this.world);
      h.scale.set(0.22, 0.28, 0.1); h.rotation.z = Math.PI;
      h.position.set(c.g.position.x + (Math.random() - 0.5) * 0.6, c.g.position.y + 0.8, c.g.position.z + (Math.random() - 0.5) * 0.6);
      this.heartList.push({ m: h, t: -i * 0.12, vx: (Math.random() - 0.5) * 0.4 });
    }
    this.needsRender = true;
  };
  Town.prototype.stepSky = function (dt, now) {
    var night = this.dark, s = this.st;
    this.stepShootingStar(dt, now, night);
    if (this.ghosts) { this.ghostMat.opacity = 0.42 + 0.18 * Math.sin(now / 600); this.needsRender = true; }
    if (this.heartList && this.heartList.length) {
      var self = this;
      this.heartList = this.heartList.filter(function (h) {
        h.t += dt; if (h.t < 0) return true;
        h.m.position.y += dt * 1.1; h.m.position.x += h.vx * dt; h.m.scale.setScalar(1).multiply(new T.Vector3(0.22, 0.28, 0.1)).multiplyScalar(1 - h.t * 0.4);
        if (h.t > 1.8) { self.world.remove(h.m); return false; }
        return true;
      });
      this.needsRender = true;
    }
    if (this.beam) { this.beam.visible = night; if (night) this.beam.rotation.y = now / 2200; }
    if (!this.aurora && s.secrets && s.secrets.aurora) this.buildAurora();
    if (this.aurora) {
      var on = night && this.season === 'winter' && s.secrets.aurora;
      this.aurora.group.visible = !!on;
      if (on) this.aurora.bands.forEach(function (m, bi) {
        var p = m.geometry.attributes.position, base = m.userData.base;
        for (var i = 0; i < p.count; i++) {
          var x = base[i * 3], y = base[i * 3 + 1];
          p.array[i * 3 + 2] = Math.sin(x * 0.05 + now / 2400 + bi) * 7 + Math.sin(x * 0.13 - now / 1700) * 2;
          p.array[i * 3 + 1] = y + (y > 0 ? Math.sin(x * 0.08 + now / 1300 + bi) * 2.5 : 0);
        }
        p.needsUpdate = true;
        m.material.opacity = 0.16 + 0.08 * Math.sin(now / 1900 + bi * 1.3);
      });
    }
    if (s.islandFire) s.islandFire.children.forEach(function (c, i) { if (c.geometry === this.geo.cone) c.scale.y = (i % 2 ? 0.5 : 0.8) * (0.85 + 0.25 * Math.sin(now / 120 + i)); }, this);
    this.stepSmoke(dt, now, night);
    this.stepHarbour(now);
    if (!this.reduced) { this.stepSwim(now); this.stepMtb(now); }
    this.stepTrain(dt, now);
    if (night || this.st.rail) this.needsRender = true;
  };
  // Smoke drifting up from chimneys at night (and always from the train).
  Town.prototype.chimneys = function () {
    var out = [], s = this.st, v;
    for (var k in s.friends) { var f = s.friends[k]; if (f.roof) { f.roof.updateMatrixWorld(true); v = new T.Vector3(0.4, 0.85, -0.3); f.roof.localToWorld(v); out.push(v); } }
    [s.nordic.chim, s.mtb.chim].forEach(function (c) { if (c) { c.updateMatrixWorld(true); out.push(c.getWorldPosition(new T.Vector3())); } });
    if (s.pub) { s.pub.updateMatrixWorld(true); v = new T.Vector3(-1.0, 3.85, -0.4); s.pub.localToWorld(v); out.push(v); }
    if (s.snow.lodge) { s.snow.lodge.roof.updateMatrixWorld(true); v = new T.Vector3(0.6, 1.0, -0.3); s.snow.lodge.roof.localToWorld(v); out.push(v); }
    return out;
  };
  Town.prototype.stepSmoke = function (dt, now, night) {
    if (!this.smoke) this.smoke = { puffs: [], clock: 0, list: [], listAt: 0 };
    var S = this.smoke, self = this;
    if (night && now > S.listAt) { S.list = this.chimneys(); S.listAt = now + 3000; }
    S.clock -= dt;
    if (S.clock <= 0) {
      S.clock = 0.18;
      var src = night ? S.list.slice() : [];
      if (this.st.rail && this.st.rail.chimney) { var cv = new T.Vector3(); this.st.rail.chimney.getWorldPosition(cv); src.push(cv, cv); }
      src.forEach(function (p) { if (Math.random() < 0.6) self.puff(p); });
    }
    S.puffs = S.puffs.filter(function (pf) {
      pf.age += dt;
      var t = pf.age / pf.life;
      // Thin wisps: they rise, lean with the breeze, curl side to side and stretch out as they fade.
      pf.m.position.y += dt * 0.55;
      pf.m.position.x += dt * (0.18 + t * 0.35) + Math.sin(pf.age * 2.2 + pf.ph) * dt * 0.25;
      pf.m.position.z -= dt * 0.1 + Math.cos(pf.age * 1.7 + pf.ph) * dt * 0.15;
      pf.m.scale.set(pf.s * (0.5 + t * 0.9), pf.s * (1.2 + t * 2.4), pf.s * (0.5 + t * 0.9));
      pf.m.rotation.z = Math.sin(pf.age * 1.3 + pf.ph) * 0.5;
      pf.m.material.opacity = 0.22 * Math.min(1, t * 5) * (1 - t);
      if (t >= 1) { self.scene.remove(pf.m); pf.m.material.dispose(); return false; }
      return true;
    });
  };
  Town.prototype.puff = function (p) {
    if (this.smoke.puffs.length > 260) return;
    var m = new T.Mesh(this.geo.blob, new T.MeshBasicMaterial({ color: this.dark ? '#a8adb8' : '#e8e6e2', transparent: true, opacity: 0.4, depthWrite: false }));
    m.position.set(p.x + (Math.random() - 0.5) * 0.1, p.y, p.z + (Math.random() - 0.5) * 0.1);
    this.scene.add(m);
    this.smoke.puffs.push({ m: m, age: 0, life: 3.5 + Math.random() * 2, s: 0.07 + Math.random() * 0.05, ph: Math.random() * 6.28 });
  };

  // ---- the railway: a station opens at each finished castle ----------------
  // A White Pass & Yukon Route style narrow-gauge line round the edge of the map: an even grade,
  // timber trestles over low ground and the bay, and tunnels through four rocky hills.
  var RAIL_R = 112, RAIL_STEP = 0.5;
  // The line swings out over the water round the lighthouse headland.
  function railR(a) {
    var d = angleDiff(a, 338), d2 = angleDiff(a, 70); // the lighthouse headland, and the glacier's foot
    return RAIL_R + (d < 15 ? 17 * Math.pow(Math.cos(d / 15 * Math.PI / 2), 2) : 0) + (d2 < 10 ? 6 * Math.pow(Math.cos(d2 / 10 * Math.PI / 2), 2) : 0);
  }
  var RAIL_TUNNELS = [15, 100, 262], TUNNEL_HALF = 3.8; // hill centres, and the portals' angle either side
  var STATION_NAMES = ['Whitehorse', 'Carcross', 'Bennett', 'Fraser', 'Skagway'];
  function inTunnel(a, pad) { return RAIL_TUNNELS.some(function (t) { return angleDiff(a, t) < TUNNEL_HALF + (pad || 0); }); }
  var RAIL_LINE = null;
  function railLine() {
    if (RAIL_LINE) return RAIL_LINE;
    var n = Math.round(360 / RAIL_STEP), raw = [], pts = [];
    for (var i = 0; i < n; i++) {
      var p = polar(i * RAIL_STEP, railR(i * RAIL_STEP)), g = groundY(p.x, p.z);
      p.ground = g; p.a = i * RAIL_STEP;
      raw.push(Math.max(g + 0.12, SEA_Y + 1.6));
      pts.push(p);
    }
    // Ease the grade: average over a few degrees either side, then make sure the rails clear
    // the ground (except in the tunnels, where the hill covers them).
    var W = 10;
    pts.forEach(function (p, i) {
      var sum = 0;
      for (var k = -W; k <= W; k++) sum += raw[(i + k + n) % n];
      p.y = sum / (2 * W + 1);
      if (!inTunnel(p.a, 1)) p.y = Math.max(p.y, p.ground + 0.12);
    });
    return (RAIL_LINE = pts);
  }
  function railPoint(a) {
    var pts = railLine();
    return pts[((Math.round(a / RAIL_STEP) % pts.length) + pts.length) % pts.length];
  }
  Town.prototype.buildRailway = function () {
    var R = this.st.rail, self = this, g = new T.Group(), pick = 'railway';
    R.group = g; this.world.add(g);
    R.pts = railLine();
    var n = R.pts.length;
    function off(i, o) { var p = R.pts[i], q = R.pts[(i + 1) % n], dx = q.x - p.x, dz = q.z - p.z, l = Math.hypot(dx, dz) || 1; return { x: p.x - dz / l * o, z: p.z + dx / l * o, y: p.y + 0.12 }; }
    function heading(i) { var p = R.pts[i], q = R.pts[(i + 1) % n]; return -Math.atan2(q.z - p.z, q.x - p.x); }
    function P(parent, geo, mat, sx, sy, sz, x, y, z) { return self.part(parent, geo, mat, sx, sy, sz, x, y, z, pick); }
    [-0.32, 0.32].forEach(function (o) {
      var line = []; for (var i = 0; i <= n; i++) line.push(off(i % n, o));
      var r = self.ribbon(line, 0.09, self.mat('stoneDark')); r.userData.pick = pick; self.picks.push(r); g.add(r);
    });
    if (!this.soft) {
      var sleepers = new T.InstancedMesh(this.geo.box, this.mat('wood'), Math.ceil(n / 2)), m4 = new T.Matrix4(), q = new T.Quaternion(), k = 0;
      for (var i = 0; i < n; i += 2) {
        var p = R.pts[i];
        q.setFromEuler(new T.Euler(0, heading(i), 0));
        sleepers.setMatrixAt(k++, m4.compose(new T.Vector3(p.x, p.y, p.z), q, new T.Vector3(0.35, 0.08, 1.0)));
      }
      g.add(sleepers);
    }
    // Timber trestles wherever the line runs above the ground or the sea: a cap beam, two
    // battered legs and, on the tall ones, an X of bracing.
    var timber = this.mat('logwood', 1);
    // A timber deck under the rails along every raised stretch.
    var run = [];
    for (i = 0; i <= n; i++) {
      var dp = R.pts[i % n], raised = dp.y - dp.ground >= 0.5 && !inTunnel(dp.a, 0.5);
      if (raised) run.push({ x: dp.x, z: dp.z, y: dp.y + 0.02 });
      if ((!raised || i === n) && run.length > 1) { var deck = this.ribbon(run, 1.25, timber); deck.userData.pick = pick; this.picks.push(deck); g.add(deck); }
      if (!raised) run = [];
    }
    for (i = 0; i < n; i += 2) {
      var tp = R.pts[i], foot = Math.min(tp.ground, SEA_Y - 0.6), hgt = tp.y - foot;
      if (tp.y - tp.ground < 0.5 || inTunnel(tp.a, 0.5)) continue;
      var bent = new T.Group();
      bent.position.set(tp.x, foot, tp.z); bent.rotation.y = heading(i);
      P(bent, this.geo.box, timber, 0.16, 0.14, 1.5, 0, hgt - 0.02, 0);
      [-1, 1].forEach(function (sd) {
        var leg = P(bent, self.geo.box, timber, 0.14, hgt, 0.14, 0, hgt / 2, sd * (0.55 + hgt * 0.06));
        leg.rotation.x = -sd * Math.atan(0.12); // legs lean in at the top
      });
      if (hgt > 1.4) [-1, 1].forEach(function (sd) {
        var br = P(bent, self.geo.box, timber, 0.06, Math.hypot(hgt * 0.8, 1.3), 0.06, 0, hgt * 0.5, 0);
        br.rotation.x = sd * Math.atan2(1.3, hgt * 0.8);
      });
      g.add(bent);
    }
    // Tunnel bluffs: a steep rocky block over the line whose end faces stand right at the portals,
    // topped with grass and a few spruces.
    var bluffGeo = this.geo.bluff || (this.geo.bluff = new T.CylinderGeometry(0.75, 1, 1, 8, 1).rotateY(Math.PI / 8).translate(0, 0.5, 0));
    RAIL_TUNNELS.forEach(function (ta) {
      var ti = Math.round(ta / RAIL_STEP) % n, c = R.pts[ti], base = Math.min(c.ground, c.y) - 0.4, hill = new T.Group(), H = 4.6;
      hill.position.set(c.x, base, c.z); hill.rotation.y = heading(ti);
      // Half-length so the end facets meet the portals about half way up the opening.
      var half = RAIL_R * TUNNEL_HALF * D2R, mid = (c.y - base + 1.1) / H, L = half / (Math.cos(Math.PI / 8) * (1 - 0.25 * mid)) + 0.6;
      var rock = new T.Mesh(bluffGeo, self.mat('rock')); rock.scale.set(L, H, 4.8); hill.add(rock);
      var cap = new T.Mesh(self.geo.blob, self.mat('hill')); cap.scale.set(L * 0.72, 0.9, 3.4); cap.position.y = H + 0.05; hill.add(cap);
      [[-0.35, 0.6, 1.0], [0.1, -1.1, 1.25], [0.45, 0.9, 0.85]].forEach(function (t) {
        var tree = new T.Mesh(self.geo.cone, self.mat('pine', 0)); tree.scale.set(0.55 * t[2], 1.7 * t[2], 0.55 * t[2]); tree.position.set(t[0] * L, H + 0.6 + 0.85 * t[2], t[1]); hill.add(tree);
      });
      // A lower rocky shoulder off one side breaks up the outline.
      var side = ta % 2 ? 1 : -1, sh = new T.Mesh(bluffGeo, self.mat('rock')); sh.scale.set(L * 0.55, H * 0.62, 3.2); sh.position.set(L * 0.2 * side, 0, 3.1 * side); sh.rotation.y = 0.3 * side; hill.add(sh);
      var shCap = new T.Mesh(self.geo.blob, self.mat('hill')); shCap.scale.set(L * 0.38, 0.6, 2.2); shCap.position.set(L * 0.2 * side, H * 0.62 + 0.02, 3.1 * side); hill.add(shCap);
      hill.children.forEach(function (m) { m.userData.pick = pick; self.picks.push(m); });
      g.add(hill);
      [-1, 1].forEach(function (sd) {
        var pi = Math.round((ta + sd * TUNNEL_HALF) / RAIL_STEP + n) % n, pp = R.pts[pi], portal = new T.Group();
        portal.position.set(pp.x, pp.y, pp.z); portal.rotation.y = heading(pi) + (sd < 0 ? 0 : Math.PI);
        // Headwall round a 1.7 x 2.1 opening, timber posts and lintel, and darkness in the opening
        // (the train slips into it and is gone).
        [-1, 1].forEach(function (s2) {
          P(portal, self.geo.box, self.mat('rock'), 0.4, 2.9, 1.0, 0.1, 1.2, s2 * 1.35);
          P(portal, self.geo.box, timber, 0.22, 2.2, 0.22, -0.15, 1.0, s2 * 0.95);
        });
        P(portal, self.geo.box, self.mat('rock'), 0.4, 0.8, 3.1, 0.1, 2.55, 0);
        P(portal, self.geo.box, timber, 0.26, 0.22, 2.2, -0.15, 2.15, 0);
        P(portal, self.geo.box, self.mat('wpBlack'), 0.03, 2.05, 1.65, -0.13, 1.0, 0);
        g.add(portal);
      });
    });
    // The train: a black steam engine with a red cowcatcher, its tender, and three green-and-gold coaches.
    var train = [], green = this.mat('wpGreen'), gold = this.mat('wpYellow'), black = this.mat('wpBlack');
    for (var c2 = 0; c2 < 5; c2++) {
      var car = new T.Group(); g.add(car);
      if (c2 === 0) {
        P(car, this.geo.cyl, black, 0.36, 1.7, 0.36, 0.25, 0.72, 0).rotation.z = Math.PI / 2;
        [-0.2, 0.5].forEach(function (x) { P(car, self.geo.cyl, gold, 0.38, 0.05, 0.38, x, 0.72, 0).rotation.z = Math.PI / 2; });
        P(car, this.geo.ball, gold, 0.16, 0.16, 0.16, 0.05, 1.1, 0);                     // steam dome
        R.chimney = P(car, this.geo.cyl, black, 0.11, 0.42, 0.11, 0.8, 1.2, 0);
        P(car, this.geo.cone, black, 0.22, 0.26, 0.22, 0.8, 1.48, 0).rotation.z = Math.PI; // balloon stack
        P(car, this.geo.box, gold, 0.16, 0.18, 0.2, 1.08, 1.08, 0);                       // headlight
        P(car, this.geo.box, this.mat('lantern'), 0.03, 0.12, 0.14, 1.17, 1.08, 0);
        P(car, this.geo.box, black, 0.85, 1.05, 0.95, -0.85, 0.85, 0);                    // cab
        P(car, this.geo.box, this.mat('stoneDark'), 1.05, 0.1, 1.1, -0.85, 1.42, 0);
        [-0.48, 0.48].forEach(function (z) { P(car, self.geo.box, self.mat('window'), 0.4, 0.3, 0.03, -0.85, 1.05, z); });
        P(car, this.geo.cone4, this.mat('wpRed'), 0.32, 0.4, 0.42, 1.22, 0.3, 0).rotation.z = -Math.PI / 2;
      } else if (c2 === 1) {
        P(car, this.geo.box, black, 1.6, 0.6, 0.9, 0, 0.6, 0);
        P(car, this.geo.blob, this.mat('stoneDark'), 0.6, 0.18, 0.36, 0, 0.92, 0);
        P(car, this.geo.box, gold, 1.62, 0.05, 0.92, 0, 0.82, 0);
      } else {
        P(car, this.geo.box, green, 2.1, 0.8, 0.95, 0, 0.75, 0);
        P(car, this.geo.box, gold, 2.12, 0.08, 0.97, 0, 0.5, 0);                          // the gold stripe
        P(car, this.geo.box, this.mat('roofTavern'), 2.3, 0.1, 1.08, 0, 1.2, 0);
        P(car, this.geo.box, this.mat('roofTavern'), 1.8, 0.14, 0.55, 0, 1.31, 0);        // clerestory
        for (var w2 = 0; w2 < 4; w2++) [-0.48, 0.48].forEach(function (z) { P(car, self.geo.box, self.mat('window'), 0.3, 0.28, 0.04, -0.72 + w2 * 0.48, 0.9, z); });
        [-1.12, 1.12].forEach(function (x) { P(car, self.geo.box, black, 0.14, 0.32, 0.95, x, 0.55, 0); });   // end platforms
      }
      [-0.55, 0.55].forEach(function (x) { [-0.42, 0.42].forEach(function (z) { P(car, self.geo.cyl, self.mat('stoneDark'), 0.2, 0.08, 0.2, x, 0.2, z).rotation.x = Math.PI / 2; }); });
      train.push(car);
    }
    R.train = train; R.u = 0.1;
    this.stepTrain(0, 0); // place it on the line straight away (it stays put with reduced motion)
    this.pop(g, 300);
  };
  Town.prototype.addStation = function (ci) {
    var s = this.st, R = s.rail || (s.rail = { stations: [] });
    if (R.stations.indexOf(ci) >= 0) return;
    R.stations.push(ci);
    if (!R.group) this.buildRailway();
    var site = CASTLE_SITES[ci], a = ci ? angleOf(site.x, site.z) : 180;
    // Find dry land for the platform near the castle's direction, clear of the tunnels.
    for (var d = 0; d < 60; d++) {
      var t = a + (d % 2 ? 1 : -1) * Math.ceil(d / 2) * 1.5, p0 = polar(t, railR(t));
      if (coastSd(p0.x, p0.z) < -4 && riverDist(p0.x, p0.z) > 6 && !inTunnel(t, 4)) { a = t; break; }
    }
    var p = railPoint(a), g = new T.Group(), self = this, pick = 'railway';
    var up = p.y - p.ground;
    g.position.set(p.x, p.ground, p.z); g.rotation.y = Math.atan2(-p.x, -p.z);
    function P(geo, mat, sx, sy, sz, x, y, z) { return self.part(g, geo, mat, sx, sy, sz, x, y, z, pick); }
    // A plank platform, then a clapboard depot: cream boards, green trim, a deep red roof with a
    // bay for the station agent, a baggage cart and a lamp.
    P(this.geo.box, this.mat('wood'), 4.8, Math.max(0.3, up + 0.25), 1.4, 0, up / 2, 1.3);
    P(this.geo.box, this.mat('wpCream'), 3.2, 1.7, 1.8, 0, up + 0.85, 3.0);
    [-1.6, 1.6].forEach(function (x) { [2.1, 3.9].forEach(function (z) { P(self.geo.box, self.mat('wpGreen'), 0.12, 1.72, 0.12, x, up + 0.86, z); }); }); // corner boards
    P(this.geo.box, this.mat('wpGreen'), 3.24, 0.1, 1.84, 0, up + 0.1, 3.0);
    P(this.geo.gable, this.mat('wpRed'), 2.4, 1.1, 1.5, 0, up + 1.7, 3.0).rotation.y = Math.PI / 2;
    P(this.geo.box, this.mat('wpRed'), 4.0, 0.08, 1.0, 0, up + 1.75, 1.95);               // platform canopy
    [-1.7, 1.7].forEach(function (x) { P(self.geo.box, self.mat('wpGreen'), 0.08, 1.6, 0.08, x, up + 0.95, 1.55); });
    P(this.geo.box, this.mat('wpCream'), 0.9, 0.9, 0.35, 0, up + 0.95, 2.0);               // agent's bay window
    P(this.geo.box, this.mat('window'), 0.7, 0.5, 0.04, 0, up + 1.0, 1.82);
    [-1.0, 1.0].forEach(function (x) { P(self.geo.box, self.mat('window'), 0.4, 0.55, 0.04, x, up + 1.0, 2.08); });
    P(this.geo.box, this.mat('wpYellow'), 1.8, 0.32, 0.06, 0, up + 2.35, 2.2);              // name board
    P(this.geo.box, this.mat('wpBlack'), 1.5, 0.08, 0.07, 0, up + 2.35, 2.2);
    P(this.geo.box, this.mat('wood'), 0.7, 0.12, 0.4, 1.6, up + 0.45, 1.1);                 // baggage cart
    P(this.geo.box, this.mat('woodLight'), 0.3, 0.3, 0.3, 1.5, up + 0.66, 1.1);
    P(this.geo.cyl6, this.mat('stoneDark'), 0.04, 2.0, 0.04, -2.1, up + 1.0, 1.6);
    P(this.geo.box, this.mat('lantern'), 0.18, 0.22, 0.18, -2.1, up + 2.05, 1.6);
    R.group.add(g);
    // A path from the castle out to its station.
    if (ci) { var from = polar(angleOf(site.x, site.z), Math.hypot(site.x, site.z) + 14.5), to = polar(a, railR(a) - 4.5); this.layPath({ kind: 'path', pts: trail(from, to, 1) }, 200); }
    if (!this.instant) this.pop(g, 500);
  };
  Town.prototype.stepTrain = function (dt, now) {
    var R = this.st.rail;
    if (!R || !R.train) return;
    var n = R.pts.length, pts = R.pts;
    R.u = (R.u + dt * 0.006) % 1;
    R.train.forEach(function (car, k) {
      var f = ((R.u - k * 0.0042) % 1 + 1) % 1 * n, i = Math.floor(f), t = f - i, p = pts[i % n], q = pts[(i + 1) % n];
      car.position.set(p.x + (q.x - p.x) * t, p.y + (q.y - p.y) * t + 0.12, p.z + (q.z - p.z) * t);
      car.rotation.y = -Math.atan2(q.z - p.z, q.x - p.x);
    });
  };

  // ---- holidays from the real date ----------------------------------------
  // October: jack-o'-lanterns. December: a tree on the square, wreaths, lights and snowmen.
  // New Year's and Canada Day: fireworks at night. Your birthday: a bonfire on the square.
  Town.prototype.setToday = function (iso, birthday) {
    this.today = iso; this.birthday = birthday || null;
    this.decorDirty = true;
  };
  Town.prototype.holiday = function () {
    if (!this.today) return null;
    var m = +this.today.slice(5, 7), d = +this.today.slice(8, 10), md = this.today.slice(5);
    if (this.birthday && md === this.birthday) return 'birthday';
    if (m === 10 && d >= 10) return 'halloween';
    if (m === 12 && d <= 26) return 'christmas';
    if ((m === 12 && d === 31) || (m === 1 && d === 1)) return 'newyear';
    if (m === 7 && d === 1) return 'canada';
    return null;
  };
  Town.prototype.decorate = function () {
    this.decorDirty = false;
    var s = this.st, self = this, h = this.holiday();
    (this.decor || []).forEach(function (o) { if (o.parent) o.parent.remove(o); });
    this.decor = [];
    if (!h) return;
    function add(parent, build) { var o = new T.Group(); build(o); parent.add(o); self.decor.push(o); return o; }
    function P(o, geo, mat, sx, sy, sz, x, y, z) { return self.part(o, geo, mat, sx, sy, sz, x, y, z); }
    function pumpkin(o, x, y, z, k) {
      P(o, self.geo.ball, self.mat('fox', 0), 0.2 * k, 0.16 * k, 0.2 * k, x, y + 0.14 * k, z);
      P(o, self.geo.cyl6, self.mat('trunk'), 0.03 * k, 0.08 * k, 0.03 * k, x, y + 0.32 * k, z);
      P(o, self.geo.box, self.mat('lantern'), 0.12 * k, 0.05 * k, 0.03 * k, x, y + 0.14 * k, z + 0.19 * k);
    }
    function snowman(o, x, z) { [[0.42, 0.42], [0.3, 1.0], [0.2, 1.45]].forEach(function (b) { P(o, self.geo.ball, self.mat('swan', 0), b[0], b[0], b[0], x, b[1], z); }); P(o, self.geo.cone, self.mat('fox', 0), 0.05, 0.25, 0.05, x, 1.45, z + 0.28).rotation.x = Math.PI / 2; P(o, self.geo.cyl, self.mat('stoneDark'), 0.18, 0.25, 0.18, x, 1.72, z); }
    var sq = SQUARE;
    for (var k in s.friends) {
      var f = s.friends[k];
      if (!f.group || f.tent) continue;
      if (h === 'halloween') add(f.group, function (o) { pumpkin(o, -0.45, 0, 1.05, 1); pumpkin(o, 0.5, 0, 1.0, 0.8); });
      if (h === 'christmas') add(f.group, function (o) {
        P(o, self.geo.torus, self.mat('hedge'), 0.18, 0.18, 0.18, 0, 0.55, 0.69);
        P(o, self.geo.box, self.mat('flag', 0), 0.1, 0.08, 0.04, 0, 0.42, 0.71);
        var y = (f.floors || 1) * FH;
        for (var l = 0; l < 7; l++) P(o, self.geo.ball, self.mat(l % 2 ? 'lantern' : 'flag', l), 0.05, 0.05, 0.05, -0.72 + l * 0.24, y - 0.05, 0.7);
      });
    }
    if (s.pub && h === 'halloween') add(s.pub, function (o) { pumpkin(o, -0.6, 0, 1.3, 1); pumpkin(o, 0.7, 0, 1.3, 1.1); });
    if (h === 'halloween') add(this.world, function (o) { o.position.set(sq.x, groundY(sq.x, sq.z), sq.z); for (var i = 0; i < 5; i++) pumpkin(o, 2.2 + (i % 3) * 0.45, Math.floor(i / 3) * 0.3, 1.6 + (i % 2) * 0.3, 1.3); });
    if (h === 'christmas') add(this.world, function (o) {
      o.position.set(sq.x, groundY(sq.x, sq.z), sq.z);
      var tx = -2.4, tz = 1.8;
      [[1.3, 1.6, 1.2], [1.0, 1.4, 2.2], [0.7, 1.2, 3.1]].forEach(function (c) { P(o, self.geo.cone6, self.mat('pine', 1), c[0], c[1], c[0], tx, c[2], tz); });
      for (var b = 0; b < 14; b++) { var ba = b * 2.4, br = 1.1 - (b % 5) * 0.17; P(o, self.geo.ball, self.mat(b % 3 ? 'flag' : 'lantern', b), 0.08, 0.08, 0.08, tx + Math.cos(ba) * br, 1.0 + (b % 5) * 0.45, tz + Math.sin(ba) * br); }
      P(o, self.geo.cone4, self.mat('gold'), 0.22, 0.4, 0.22, tx, 3.95, tz);
      [[-1.2, 1.4], [1.6, 2.4]].forEach(function (g2, i) { P(o, self.geo.box, self.mat('flag', i + 1), 0.4, 0.3, 0.4, tx + g2[0] * 0.6, 0.15, tz + 0.9 + i * 0.2); });
      snowman(o, 2.6, 2.0);
    });
    if (h === 'christmas') add(this.world, function (o) { var p = polar(GATE_ANGLE + 8, 17.5); o.position.set(p.x, groundY(p.x, p.z), p.z); snowman(o, 0, 0); });
    if (h === 'birthday') add(this.world, function (o) {
      o.position.set(sq.x, groundY(sq.x, sq.z), sq.z);
      for (var l = 0; l < 8; l++) { var la = l / 8 * Math.PI * 2; P(o, self.geo.box, self.mat('rock'), 0.35, 0.25, 0.35, 2.4 + Math.cos(la) * 0.8, 0.12, -1.6 + Math.sin(la) * 0.8); }
      P(o, self.geo.cone, self.mat('fire'), 0.55, 1.4, 0.55, 2.4, 0.7, -1.6);
      P(o, self.geo.cone, self.mat('lantern'), 0.3, 0.9, 0.3, 2.45, 0.5, -1.6);
      [[0.9, -2.9], [3.9, -0.8], [1.2, -0.2]].forEach(function (c) { P(o, self.geo.cyl6, self.mat('logwood', 0), 0.25, 0.4, 0.25, c[0], 0.2, c[1]); });
      for (var b = 0; b < 12; b++) P(o, self.geo.cone4, self.mat('flag', b), 0.1, 0.2, 0.03, -2.5 + b * 0.45, 2.6 - Math.sin(b / 11 * Math.PI) * 0.4, -2.6).rotation.x = Math.PI;
    });
    if ((h === 'newyear' || h === 'canada') && !this.celebrated && this.dark) { this.celebrated = true; this.fireworks(90); }
    if (h === 'canada') add(this.world, function (o) { o.position.set(sq.x, groundY(sq.x, sq.z), sq.z); [-1.8, 1.8].forEach(function (x) { P(o, self.geo.cyl6, self.mat('stoneDark'), 0.04, 3.0, 0.04, x, 1.5, -2.4); P(o, self.geo.flag, self.mat('flag', 0), 2.0, 2.0, 2.0, x, 3.0, -2.4); }); });
    this.needsRender = true;
  };

  // ---- secrets ---------------------------------------------------------
  // Hidden surprises. Each one stays a "???" with a hint until you earn it; then something
  // appears somewhere on the map and the page pops up a card about it.
  var SECRETS = [
    { id: 'argonath', title: 'The Argonath', hint: 'Press a plate over your head.', text: 'One-plate overhead press! Two stone kings now stand guard over the river, hands raised.' },
    { id: 'barbell', title: 'The Golden Barbell', hint: 'Bench two plates.', text: 'Two-plate bench! A golden barbell now stands on a plinth out in the countryside.' },
    { id: 'henge', title: 'The Stone Circle', hint: 'Squat three plates.', text: 'Three-plate squat! An ancient stone circle has risen out in the hills.' },
    { id: 'dragon', title: 'The Dragon', hint: 'Pull four plates off the floor.', text: 'Four-plate deadlift! A dragon has come to circle the mountains.' },
    { id: 'wizard', title: 'The Wizard’s Tower', hint: 'Show up a hundred times.', text: '100 workouts! A wizard has built a tower on the far hills.' },
    { id: 'rainbow', title: 'The Rainbow', hint: 'Show up five hundred times.', text: '500 workouts! A rainbow now arcs over the whole town.' },
    { id: 'goodboys', title: 'Three Good Dogs', hint: 'Walk the whole pack at once.', text: 'Minto, Blue and Millie on one walk! Their statue now sits in the dog pen.' },
    { id: 'marathon', title: 'The Marathon Gate', hint: 'Run 42.2 km in one go.', text: 'A marathon! A golden laurel gate now stands in the forest.' },
    { id: 'hobbit', title: 'The Hobbit Hole', hint: 'Move a million pounds.', text: 'A million pounds lifted! Someone has dug a cosy hole in the hillside, with a round green door.' },
    { id: 'yeti', title: 'The Yeti', hint: 'Ten snow days in one winter.', text: 'Ten snow days in one season! A friendly yeti has moved in by the ski lodge.' },
    { id: 'maypole', title: 'The Maypole', hint: 'Work out with five friends at once.', text: 'Five friends in one workout! A maypole goes up on the village square, and it comes back for a week after every big group workout.' },
    { id: 'feast', title: 'The Long Table', hint: 'Work out with the whole crew: eleven friends at once.', text: 'All twelve of you in one workout! A long table is laid on the town square under strings of lights, with a seat for everyone, for a week after every whole-crew workout.' },
    { id: 'zamboni', title: 'The Zamboni', hint: 'Play ten hockey games.', text: 'Ten hockey games! The rink has its own Zamboni.' },
    { id: 'windmill', title: 'The Windmill', hint: 'Work out seven days in a row.', text: 'A seven-day streak! A windmill now turns at the edge of the farmland.' },
    { id: 'swans', title: 'The Swans', hint: 'Row 100 km.', text: '100 km rowed and paddled! A family of swans has settled on the lake behind the mountains.' },
    { id: 'shipwreck', title: 'The Shipwreck', hint: '365 workouts in one year.', text: '365 workouts in a single year! An old shipwreck has surfaced in the shallows, with a treasure chest glinting on its deck.' },
    { id: 'aurora', title: 'The Northern Lights', hint: 'Keep a seven-day streak in winter.', text: 'A seven-day streak in the dead of winter! On winter nights the northern lights now dance over Yukon.' },
    { id: 'mellon', title: 'The Doors of Durin', hint: 'Speak, friend, and enter.', text: 'Mellon! Moonlit runes glow on a hidden door at the foot of the mountains, and it swings open for you.' },
    { id: 'sub20', title: 'The Golden Runner', hint: 'Run 5 km in 20 minutes (on Strava).', big: true,
      text: 'A SUB-20 5K! The whole town is setting off fireworks, and a giant golden runner now strides over the forest. This one is a big deal.' }
  ];
  var PARTY = { maypole: 5, feast: 11 }; // friends needed in one workout
  var PARTY_DAYS = 7;
  var SECRET_BY_ID = {};
  SECRETS.forEach(function (x) { SECRET_BY_ID[x.id] = x; });
  var WORKOUT_KINDS = { lift: 1, run: 1, bike: 1, commute: 1, row: 1, hike: 1, stairs: 1, walk: 1, sport: 1, mobility: 1, snowboard: 1, swim: 1, xcski: 1, mtb: 1 };
  Town.prototype.checkSecrets = function (ev, delay) {
    var s = this.st, self = this, b = s.best;
    function hit(id) {
      if (s.secrets[id]) return;
      s.secrets[id] = true;
      var pos = self.buildSecret(id, delay + 900);
      s.secretPos[id] = pos;
      if (self.onSecret) self.onSecret(SECRET_BY_ID[id], ev);
    }
    // Streak of consecutive days with a workout. Every 7 days in a row counts once.
    if (ev.date && WORKOUT_KINDS[ev.kind]) {
      if (s.streakDate !== ev.date) {
        var gap = s.streakDate ? Math.round((new Date(ev.date + 'T12:00:00') - new Date(s.streakDate + 'T12:00:00')) / 86400000) : 99;
        s.streak = gap === 1 ? s.streak + 1 : 1;
        s.bestStreak = Math.max(s.bestStreak || 0, s.streak);
        s.streakDate = ev.date;
        if (s.streak % 7 === 0) {
          s.streaks = (s.streaks || 0) + 1;
          if ([12, 1, 2].indexOf(+ev.date.slice(5, 7)) >= 0) hit('aurora');
          if (s.mill && s.mill.n + 1 < MILL_AT.length && s.streaks >= MILL_AT[s.mill.n + 1]) this.growMill(s.mill.n + 1, delay, ev);
        }
      }
    }
    // Workouts per calendar year (for the shipwreck), and full years of logging (for the island).
    if (ev.date && WORKOUT_KINDS[ev.kind]) {
      var yr = ev.date.slice(0, 4), yc = s.yearCounts = s.yearCounts || {};
      yc[yr] = (yc[yr] || 0) + 1;
      if (yc[yr] >= 365) hit('shipwreck');
    }
    if (ev.date) {
      if (!s.firstDate || ev.date < s.firstDate) s.firstDate = ev.date;
      var yrs = Math.floor((new Date(ev.date + 'T12:00:00') - new Date(s.firstDate + 'T12:00:00')) / (365.25 * 86400000));
      if (yrs >= 1 && (!s.island || yrs > s.island.n)) this.growIsland(yrs, delay, ev);
    }
    var wl = Math.floor(s.sessions / 100);
    if (s.wiz && wl > s.wiz.level) this.growWizard(wl, delay, ev);
    if ((b.ohp || 0) >= 135) hit('argonath');
    if ((b.bench || 0) >= 225) hit('barbell');
    if ((b.squat || 0) >= 315) hit('henge');
    if ((b.deadlift || 0) >= 405) hit('dragon');
    if (s.sessions >= 100) hit('wizard');
    if (s.sessions >= 500) hit('rainbow');
    if (ev.dogs && ev.dogs.length >= 3) hit('goodboys');
    if (ev.kind === 'run' && ev.km >= 42) hit('marathon');
    if (s.tonnage >= 1e6) hit('hobbit');
    if (Object.keys(s.snow.seasons).some(function (k) { return s.snow.seasons[k].days >= 10; })) hit('yeti');
    // Party secrets: earned once, but only standing for a week after each big group workout.
    var nf = ev.friends ? ev.friends.length : 0;
    Object.keys(PARTY).forEach(function (id) {
      if (nf < PARTY[id]) return;
      (s.party = s.party || {})[id] = ev.date || s.lastDate || null;
      hit(id);
    });
    this.updateParty();
    if (s.sports.Hockey && s.sports.Hockey.n >= 10) hit('zamboni');
    if (s.streaks >= 1) hit('windmill');
    if (s.row.km >= 100) hit('swans');
    // Sub-20 5k: a Strava run of 5 km or more at 4:00/km or faster on average.
    if (ev.kind === 'run' && ev.strava && ev.secs && (ev.exactKm || ev.km) >= 4.95 && ev.secs / (ev.exactKm || ev.km) * 5 <= 1200) {
      if (!s.secrets.sub20) { hit('sub20'); this.fireworks(45); }
      s.sub20 = (s.sub20 || 0) + 1;
    }
    // Fireworks the day after a marathon (during a replay, as the next day's workouts come in).
    if (ev.kind === 'run' && ev.km >= 42 && ev.date) (s.marathons = s.marathons || []).push(ev.date);
    if (ev.date && s.marathons) s.marathons.forEach(function (d) {
      if (ev.date > d && !(s.fwDone = s.fwDone || {})[d]) { s.fwDone[d] = true; self.fireworks(25); }
    });
  };
  // A clear patch of ground near a preferred spot: away from houses, fields, the forest,
  // paths, water and everything else already planned.
  // Is this patch of ground free of everything planned on the map?
  // loose: ignore ground only reserved for future forest and wild trees.
  function groundClear(p, rad, loose) {
    var d = Math.hypot(p.x, p.z);
    if (d > 96 || d < 17) return false;
    var rdd = riverDist(p.x, p.z);
    if (rdd < rad + 2.5 || nearPath(p.x, p.z, rad + 0.9)) return false;
    // Keep well back from the canyon's rims and rocks.
    for (var ci2 = 0; ci2 < RIVER.length; ci2 += 2) { var rq = RIVER[ci2]; if (canyonDepth(rq.x, rq.z) > 0.5 && Math.hypot(rq.x - p.x, rq.z - p.z) < rad + 12) return false; }
    if (coastSd(p.x, p.z) > -(rad + 9) || lakeDist(p.x, p.z) < rad + 6 || streamDist(p.x, p.z) < rad + 2) return false;
    if (HOUSE_SLOTS.some(function (h) { return Math.hypot(h.x - p.x, h.z - p.z) < rad + 2.6; })) return false;
    if (FIELDS.some(function (f) { return Math.hypot(f.x - p.x, f.z - p.z) < f.size + rad + 1; })) return false;
    if (!loose && FOREST.hash ? FOREST.hash.near(p.x, p.z, rad + 0.9) : !loose && FOREST.some(function (f) { return Math.hypot(f.x - p.x, f.z - p.z) < rad + 0.9; })) return false;
    if (SPORT_SLOTS.some(function (sl) { var q = polar(sl[0], sl[1]); return Math.hypot(q.x - p.x, q.z - p.z) < rad + 4; })) return false;
    if (CASTLE_SITES.some(function (c, ci) { return Math.hypot(c.x - p.x, c.z - p.z) < rad + (ci ? 21 : 15); })) return false;
    if (PEAKS.some(function (k) { return Math.hypot(k.x - p.x, k.z - p.z) < rad + k.h * 0.9 + 2; })) return false;
    if (Math.hypot(SNOW.c.x - p.x, SNOW.c.z - p.z) < SNOW.R + rad + 3) return false;
    if (Math.hypot(PASTURE.x - p.x, PASTURE.z - p.z) < rad + PASTURE_R + 3) return false;
    var spots = [POND, DOG_PEN.c, OFFICE, HOCKEY, PUB, SQUARE, STATUE, LODGE, polar(FARM.angle, FARM.r + 3.2)];
    if (spots.some(function (q) { return Math.hypot(q.x - p.x, q.z - p.z) < rad + 7; })) return false;
    if (Math.hypot(CHURCH.x - p.x, CHURCH.z - p.z) < rad + 10 || Math.hypot(LIBRARY.x - p.x, LIBRARY.z - p.z) < rad + 13 || Math.hypot(HOARD.x - p.x, HOARD.z - p.z) < rad + 9) return false;
    for (var k = 0; k < LANE.length; k += 3) if (Math.hypot(LANE[k].x - p.x, LANE[k].z - p.z) < rad + 1.5) return false;
    if (MTB_HILL && Math.hypot(MTB_HILL.x - p.x, MTB_HILL.z - p.z) < rad + MTB_HILL.r + 6) return false;
    if (!loose && WILD && WILD.hash.near(p.x, p.z, rad + 0.9)) return false;
    if (CINEMA && Math.hypot(CINEMA.x - p.x, CINEMA.z - p.z) < rad + 5) return false;
    if (inTownSquare(p.x, p.z, rad + 2)) return false;
    if (Math.hypot(GLACIER.x - p.x, GLACIER.z - p.z) < rad + GLACIER.R + 3 || TARNS.some(function (t) { return Math.hypot(t.x - p.x, t.z - p.z) < rad + t.R + 2; })) return false;
    if (MTB_LANE) for (var mk = 0; mk < MTB_LANE.pts.length; mk += 3) if (Math.hypot(MTB_LANE.pts[mk].x - p.x, MTB_LANE.pts[mk].z - p.z) < rad + 1.5) return false;
    return true;
  }
  // The bike shop's knoll, close to town at the foot of the mountain range, with a few rounded
  // hills behind and beside it. Falls back to open ground behind the range if that spot is taken.
  var MTB_HILL = (function () {
    function hilly(p) {
      var out = Math.atan2(p.z, p.x), hills = [];
      [[-0.75, 8.5, 3.4, 4.5], [0.05, 9.5, 4.2, 5], [0.8, 8.5, 3.0, 4.2], [-1.55, 7.5, 2.1, 3.4], [1.5, 7.5, 1.9, 3.2]].forEach(function (h) {
        var a = out + h[0], hl = { x: p.x + Math.cos(a) * h[1], z: p.z + Math.sin(a) * h[1], h: h[2], r: h[3] };
        // Keep clear of every house plot and the campsite for friends past the village's 40 houses.
        var spots = HOUSE_SLOTS.concat([0, 1, 2, 3, 4, 5, 6, 7].map(function (t) { return polar(186 + (t * 13) % 92, 30); }));
        if (spots.some(function (q) { return Math.hypot(q.x - hl.x, q.z - hl.z) < hl.r + 2.8; })) return;
        hills.push(hl);
      });
      return { x: p.x, z: p.z, r: 7, h: 1.3, hills: hills };
    }
    for (var ring = 0; ring < 8; ring++) for (var j = 0; j < Math.max(1, ring * 6); j++) {
      var p = polar(160 + (ring ? (j / (ring * 6) - 0.5) * ring * 2 : 0), 30 + ((j % 3) - 1) * ring * 0.5);
      if (groundClear(p, 6.5)) return hilly(p);
    }
    for (ring = 0; ring < 30; ring++) for (j = 0; j < Math.max(1, ring * 6); j++) {
      p = polar(175 + (ring ? (j / (ring * 6) - 0.5) * ring * 3 : 0), 86 + ((j % 3) - 1) * ring * 0.6);
      if (groundClear(p, 9.5)) return hilly(p);
    }
    return null;
  })();
  // The lane out to the bike shop: straight out from the ring road and under the mountain range
  // through a little tunnel, ending at the front of the shop's dirt loop. Dashes are 0.8 apart.
  var MTB_LANE = (function () {
    if (!MTB_HILL) return null;
    var ry = Math.atan2(-MTB_HILL.x, -MTB_HILL.z), lx = 0, lz = 6.4;
    var end = { x: MTB_HILL.x + lx * Math.cos(ry) + lz * Math.sin(ry), z: MTB_HILL.z - lx * Math.sin(ry) + lz * Math.cos(ry) };
    var a = angleOf(end.x, end.z), start = polar(a + 4, RING_ROAD + 1.2), d = Math.hypot(end.x, end.z), mid1 = polar(a + 6, RING_ROAD + (d - RING_ROAD) * 0.35), mid2 = polar(a - 3, RING_ROAD + (d - RING_ROAD) * 0.7);
    var raw = [], n = 600;
    for (var i = 0; i <= n; i++) {
      var t = i / n, u = 1 - t;
      raw.push({ x: u * u * u * start.x + 3 * u * u * t * mid1.x + 3 * u * t * t * mid2.x + t * t * t * end.x, z: u * u * u * start.z + 3 * u * u * t * mid1.z + 3 * u * t * t * mid2.z + t * t * t * end.z });
    }
    var pts = [], acc = 0, next = 0;
    for (i = 1; i <= n; i++) {
      acc += Math.hypot(raw[i].x - raw[i - 1].x, raw[i].z - raw[i - 1].z);
      if (acc >= next) { var dx = raw[i].x - raw[i - 1].x, dz = raw[i].z - raw[i - 1].z; pts.push({ x: raw[i].x, z: raw[i].z, ang: Math.atan2(dx, dz) }); next += 0.8; }
    }
    // Under the mountains: from the first dash inside a peak's full-grown foot to the last.
    var inside = pts.map(function (p) { return PEAKS.some(function (k) { return Math.hypot(k.x - p.x, k.z - p.z) < k.h * 0.75 + 1.2; }); });
    var t0 = inside.indexOf(true), t1 = inside.lastIndexOf(true);
    pts.forEach(function (p, i) { p.tunnel = t0 >= 0 && i >= t0 && i <= t1; });
    return { pts: pts, t0: t0, t1: t1 };
  })();
  // Wild woods: once the forest is full, new trees spread into open countryside, nearest the
  // forest first, keeping clear of everything else (roads, houses, fields, the lake, the trails).
  var WILD = (function () {
    var r = rng(5151), pts = [], hash = new Scatter(3);
    for (var gx = -96; gx <= 96; gx += 1.15) for (var gz = -96; gz <= 96; gz += 1.15) {
      var p = { x: gx + (r() - 0.5) * 1.1, z: gz + (r() - 0.5) * 1.1 }, d = Math.hypot(p.x, p.z);
      if (d < 20 || d > 96 || inFarmland(p.x, p.z) || inSector(p.x, p.z, 186, 278, 0, 56) || noise2(p.x, p.z) < -0.6 || hash.near(p.x, p.z, 1.5)) continue;
      if (Math.hypot(p.x - NORDIC.cabin.x, p.z - NORDIC.cabin.z) < 6) continue;
      var nearTrail = false;
      if (Math.hypot(p.x - LAKE.c.x, p.z - LAKE.c.z) < LAKE.R + 22) for (var k = 0; k < NORDIC.pts.length; k += 3) if (Math.hypot(NORDIC.pts[k].x - p.x, NORDIC.pts[k].z - p.z) < 2.4) { nearTrail = true; break; }
      if (nearTrail || !groundClear(p, 0.8)) continue;
      p.order = Math.hypot(p.x - FOREST_SEED.x, p.z - FOREST_SEED.z);
      pts.push(p); hash.add(p);
    }
    pts.hash = hash;
    return pts.sort(function (a, b) { return a.order - b.order; });
  })();
  Town.prototype.secretSpot = function (angle, r, rad) {
    var taken = this.st.secretPos, friends = this.st.friends;
    function clear(p) {
      if (!groundClear(p, rad)) return false;
      for (var fk in friends) { var fg = friends[fk].group; if (fg && Math.hypot(fg.position.x - p.x, fg.position.z - p.z) < rad + 3.5) return false; }
      for (var id in taken) if (taken[id] && Math.hypot(taken[id].x - p.x, taken[id].z - p.z) < rad + 5) return false;
      return true;
    }
    for (var ring = 0; ring < 40; ring++) {
      for (var j = 0; j < Math.max(1, ring * 6); j++) {
        var p = polar(angle + (ring ? ((j / Math.max(1, ring * 6)) - 0.5) * ring * 4 : 0), r + ((j % 3) - 1) * ring * 1.2);
        if (clear(p)) return p;
      }
    }
    // Nothing near the hoped-for spot: take the nearest clear ground anywhere instead.
    for (var r2 = 20; r2 < 96; r2 += 3) for (var a2 = 0; a2 < 360; a2 += 4) { var q = polar(angle + a2, r2); if (clear(q)) return q; }
    return polar(angle, r);
  };
  // Secrets that aren't earned by workouts (typed in, say); the page remembers them and
  // passes them back after every rebuild.
  // Clear the hedgerows and lone oaks off a spot when something is built there (and put them
  // back when the town is rebuilt).
  Town.prototype.clearDecor = function (x, z, r) {
    var H = this.hedges, zero = new T.Matrix4().makeScale(0, 0, 0), m = new T.Matrix4();
    if (H) {
      H.spots.forEach(function (sp, i) {
        if (Math.hypot(sp[0] - x, sp[1] - z) > r || H.saved[i]) return;
        H.mesh.getMatrixAt(i, m); H.saved[i] = m.clone(); H.mesh.setMatrixAt(i, zero);
      });
      H.mesh.instanceMatrix.needsUpdate = true;
    }
    (this.oaks || []).forEach(function (t) { if (Math.hypot(t.position.x - x, t.position.z - z) < r + 1) t.visible = false; });
  };
  Town.prototype.restoreDecor = function () {
    var H = this.hedges;
    if (H) { for (var i in H.saved) H.mesh.setMatrixAt(+i, H.saved[i]); H.saved = {}; H.mesh.instanceMatrix.needsUpdate = true; }
    (this.oaks || []).forEach(function (t) { t.visible = true; });
  };
  // The date the town is showing: today, or the last dated workout when scrubbed back in time.
  Town.prototype.setViewDate = function (iso) { this.viewDate = iso || null; this.updateParty(); };
  Town.prototype.updateParty = function () {
    var s = this.st, view = this.viewDate || s.lastDate, objs = s.partyObjs || {};
    for (var id in objs) {
      var d = s.party && s.party[id], on = !!d && !!view && (new Date(view + 'T12:00:00') - new Date(d + 'T12:00:00')) / 86400000 <= PARTY_DAYS;
      if (objs[id].visible !== on) { objs[id].visible = on; this.needsRender = true; this.solidAt = 0; }
    }
  };
  Town.prototype.unlockSecret = function (id, quiet) {
    var s = this.st;
    if (s.secrets[id] || !SECRET_BY_ID[id]) return;
    s.secrets[id] = true;
    s.secretPos[id] = this.buildSecret(id, quiet ? 0 : 600);
    if (!quiet && this.onSecret) this.onSecret(SECRET_BY_ID[id]);
    this.needsRender = true;
  };
  Town.prototype.buildSecret = function (id, delay) {
    var self = this, g = new T.Group(), pick = 'secret:' + id, pos = null, spin = null;
    function P(geo, mat, sx, sy, sz, x, y, z, parent) { return self.part(parent || g, geo, mat, sx, sy, sz, x, y, z, pick); }
    function place(p, faceTown) { pos = p; g.position.set(p.x, groundY(p.x, p.z), p.z); if (faceTown) g.rotation.y = Math.atan2(-p.x, -p.z); }
    var stone = this.mat('citDark'), rock = this.mat('rock');
    switch (id) {
      case 'argonath': {
        // Two colossal kings on either bank of the river, left hands raised.
        var best = 0, bd = 1e9;
        RIVER.forEach(function (q, i) { var d = Math.abs(Math.hypot(q.x, q.z) - 66) + (angleOf(q.x, q.z) > 300 ? 0 : 50); if (d < bd && i > 2 && i < RIVER.length - 3) { bd = d; best = i; } });
        var q = RIVER[best], q0 = RIVER[best - 2], q1 = RIVER[best + 2], tx = q1.x - q0.x, tz = q1.z - q0.z, tl = Math.hypot(tx, tz) || 1;
        pos = { x: q.x, z: q.z };
        g.position.set(q.x, riverLevel(q.i) + 0.3, q.z);
        g.rotation.y = Math.atan2(tx, tz);
        [-1, 1].forEach(function (sd) {
          var k = new T.Group(); k.position.set(sd * (RIVER_HALF + 2.4), 0, 0); g.add(k);
          self.settle(k, k.position.x, 0, g);
          P(self.geo.box, rock, 2.4, 4.0, 2.4, 0, -1.3, 0, k);
          P(self.geo.box, stone, 1.7, 4.6, 1.3, 0, 3.7, 0, k);
          P(self.geo.box, stone, 2.3, 0.9, 1.4, 0, 6.0, 0, k);
          P(self.geo.ball, stone, 0.7, 0.75, 0.7, 0, 6.9, 0, k);
          P(self.geo.cone, stone, 0.62, 0.9, 0.62, 0, 7.75, 0, k);
          var arm = P(self.geo.box, stone, 0.45, 2.6, 0.45, -sd * 0.75, 7.3, 0, k); arm.rotation.z = sd * 0.25;
          P(self.geo.box, stone, 0.55, 0.7, 0.2, -sd * 1.05, 8.7, 0, k);
          P(self.geo.box, stone, 0.12, 5.2, 0.12, sd * 1.1, 3.4, 0.3, k);
          P(self.geo.cone4, stone, 0.4, 0.8, 0.12, sd * 1.1, 6.3, 0.3, k);
        });
        break;
      }
      case 'barbell': {
        place(this.secretSpot(GATE_ANGLE + 16, 21, 2), true);
        P(this.geo.box, this.mat('stone', 1), 3.6, 0.6, 1.2, 0, 0.3, 0);
        P(this.geo.box, this.mat('stone', 2), 3.8, 0.12, 1.35, 0, 0.66, 0);
        [-1.2, 1.2].forEach(function (x) { P(self.geo.box, self.mat('stoneDark'), 0.14, 1.2, 0.14, x, 1.3, 0); P(self.geo.box, self.mat('stoneDark'), 0.3, 0.1, 0.3, x, 1.9, 0); });
        var bar = P(this.geo.cyl, this.mat('silver'), 0.06, 4.6, 0.06, 0, 2.05, 0); bar.rotation.z = Math.PI / 2;
        [-1, 1].forEach(function (sd) {
          [1.55, 1.75].forEach(function (x) { P(self.geo.cyl, self.mat('gold'), 0.85, 0.16, 0.85, sd * x, 2.05, 0).rotation.z = Math.PI / 2; });
          P(self.geo.cyl, self.mat('silver'), 0.14, 0.12, 0.14, sd * 1.92, 2.05, 0).rotation.z = Math.PI / 2;
        });
        P(this.geo.box, this.mat('gold'), 1.0, 0.25, 0.04, 0, 0.35, 0.62);
        break;
      }
      case 'henge': {
        place(this.secretSpot(215, 52, 4.5));
        for (var i = 0; i < 12; i++) {
          var a = i / 12 * Math.PI * 2, x = Math.cos(a) * 3.6, z = Math.sin(a) * 3.6;
          var st = P(this.geo.box, rock, 0.7, 2.1 + (i % 3) * 0.2, 0.45, x, 1.05, z); st.rotation.y = -a;
          if (i % 2 === 0) { var l = P(this.geo.box, rock, 0.7, 0.35, 2.1, Math.cos(a + 0.26) * 3.6, 2.35, Math.sin(a + 0.26) * 3.6); l.rotation.y = -a - 0.26; }
        }
        P(this.geo.box, rock, 1.4, 0.4, 0.7, 0, 0.2, 0);
        [0.6, -0.6].forEach(function (x) { P(self.geo.box, rock, 0.7, 2.8, 0.5, x, 1.4, -1.2); });
        P(this.geo.box, rock, 2.0, 0.4, 0.6, 0, 3.0, -1.2);
        break;
      }
      case 'dragon': {
        // Circles the mountain range; wings flap in the frame loop.
        var c = polar(RIDGE.a, RIDGE.r);
        pos = { x: c.x, z: c.z };
        var d = new T.Group(); g.add(d);
        P(this.geo.ball, this.mat('dragon', 0), 0.8, 0.7, 2.0, 0, 0, 0, d);
        var neck = P(this.geo.cyl6, this.mat('dragon', 0), 0.28, 1.6, 0.28, 0, 0.5, 1.9, d); neck.rotation.x = 0.9;
        P(this.geo.box, this.mat('dragon', 0), 0.55, 0.45, 0.9, 0, 1.0, 2.75, d);
        [-0.18, 0.18].forEach(function (x) { P(self.geo.cone, self.mat('dragon', 2), 0.08, 0.45, 0.08, x, 1.4, 2.5, d).rotation.x = -0.6; });
        var tail = P(this.geo.cone, this.mat('dragon', 0), 0.35, 3.2, 0.35, 0, -0.1, -3.2, d); tail.rotation.x = -Math.PI / 2;
        P(this.geo.box, this.mat('dragon', 2), 0.3, 0.06, 1.8, 0, -0.35, 0.2, d);
        d.wings = [-1, 1].map(function (sd) {
          var w = new T.Group(); w.position.set(sd * 0.6, 0.3, 0.3); d.add(w);
          P(self.geo.box, self.mat('dragon', 1), 3.4, 0.08, 1.8, sd * 1.7, 0, 0, w);
          P(self.geo.box, self.mat('dragon', 0), 3.4, 0.14, 0.14, sd * 1.7, 0.05, 0.85, w);
          w.side = sd;
          return w;
        });
        d.position.set(c.x, 28, c.z);
        g.position.set(0, 0, 0);
        this.st.dragon = { group: d, c: c };
        break;
      }
      case 'wizard': {
        // Every hundred workouts after this, the tower gains something (see growWizard).
        place(this.secretSpot(150, 76, 9));
        P(this.geo.cyl, this.mat('keepStone', 2), 1.6, 1.0, 1.6, 0, 0.5, 0);
        P(this.geo.cyl, this.mat('keepDark'), 1.0, 4.6, 1.0, 0, 3.25, 0);
        for (var w2 = 0; w2 < 3; w2++) { var aa = w2 * 1.3; P(this.geo.box, this.mat('lantern'), 0.22, 0.4, 0.06, Math.cos(aa) * 1.0, 2.2 + w2 * 1.3, Math.sin(aa) * 1.0).rotation.y = -aa + Math.PI / 2; }
        var hat = new T.Group(); hat.position.y = 5.55; g.add(hat);
        P(this.geo.cyl, this.mat('keepStone', 0), 1.2, 0.3, 1.2, 0, 0.05, 0, hat);
        P(this.geo.cone, this.mat('roof', 2), 1.25, 3.4, 1.25, 0, 1.85, 0, hat);
        P(this.geo.ball, this.mat('gold'), 0.2, 0.2, 0.2, 0, 3.65, 0, hat);
        for (var st2 = 0; st2 < 6; st2++) P(this.geo.ball, this.mat('gold'), 0.08, 0.08, 0.08, Math.cos(st2) * 1.6, 1.05 + (st2 % 3) * 0.6, Math.sin(st2) * 1.6, hat);
        this.st.wiz = { group: g, hat: hat, top: 5.55, level: 1, crystals: null };
        break;
      }
      case 'rainbow': {
        pos = { x: 0, z: 0 };
        for (var band = 0; band < 6; band++) {
          var m = new T.MeshBasicMaterial({ color: STYLE_COLORS.rainbow[band], transparent: true, opacity: 0.17, depthWrite: false, fog: true });
          var arc = new T.Mesh(new T.TorusGeometry(70 - band * 0.8, 0.38, 4, 72, Math.PI), m);
          g.add(arc);
        }
        g.position.set(-30, -24, -30);
        g.rotation.y = Math.PI / 4;
        break;
      }
      case 'goodboys': {
        var c2 = DOG_PEN.c;
        place({ x: c2.x + 2.6, z: c2.z + 1.6 }, true);
        P(this.geo.box, this.mat('stone', 1), 1.6, 0.4, 0.8, 0, 0.2, 0);
        [-0.5, 0, 0.5].forEach(function (x, i) {
          var sc = [0.9, 1.0, 0.85][i];
          P(self.geo.box, self.mat('stone', 0), 0.32 * sc, 0.26 * sc, 0.5 * sc, x, 0.62, 0);
          P(self.geo.box, self.mat('stone', 0), 0.26 * sc, 0.26 * sc, 0.26 * sc, x, 0.86 * sc + 0.1, 0.28);
          P(self.geo.box, self.mat('stone', 0), 0.06, 0.12, 0.08, x - 0.08, 1.05 * sc + 0.08, 0.26);
          P(self.geo.box, self.mat('stone', 0), 0.06, 0.12, 0.08, x + 0.08, 1.05 * sc + 0.08, 0.26);
        });
        P(this.geo.box, this.mat('gold'), 0.8, 0.14, 0.04, 0, 0.22, 0.42);
        break;
      }
      case 'marathon': {
        place(this.secretSpot(30, 30, 1.8), true);
        [-1.2, 1.2].forEach(function (x) { P(self.geo.cyl, self.mat('stone', 0), 0.2, 2.4, 0.2, x, 1.2, 0); });
        var arch = new T.Mesh(new T.TorusGeometry(1.2, 0.14, 6, 16, Math.PI), this.mat('gold'));
        arch.position.y = 2.4; g.add(arch); arch.userData.pick = pick; this.picks.push(arch);
        for (var lf = 0; lf < 11; lf++) { var la = lf / 10 * Math.PI; P(this.geo.blob, this.mat('pine', 1), 0.16, 0.12, 0.16, Math.cos(la) * 1.25, 2.4 + Math.sin(la) * 1.25, 0.1); }
        P(this.geo.box, this.mat('gold'), 1.0, 0.3, 0.06, 0, 3.85, 0);
        break;
      }
      case 'hobbit': {
        // A round green door set into a grassy hill: a curved stone front wall with round
        // windows, a little chimney poking out of the turf, and a front garden with a gate.
        place(this.secretSpot(205, 46, 4.5), true);
        this.clearDecor(pos.x, pos.z, 6);
        P(this.geo.ball, this.mat('hill'), 4.0, 2.5, 3.0, 0, -0.5, -1.9);
        P(this.geo.ball, this.mat('hill'), 2.2, 1.6, 2.0, 2.6, -0.4, -2.2);
        // The front wall, curving round with the hill, and turf over its top.
        for (var w2 = -3; w2 <= 3; w2++) {
          var wa = w2 * 0.2, wx = Math.sin(wa) * 3.2, wz = Math.cos(wa) * 3.2 - 2.1;
          var seg = P(this.geo.box, this.mat('holdStone', (w2 + 3) % 3), 0.95, 1.5, 0.35, wx, 0.75, wz); seg.rotation.y = wa;
          var turf = P(this.geo.box, this.mat('hill'), 1.0, 0.2, 0.55, wx, 1.55, wz - 0.1); turf.rotation.y = wa;
        }
        // The round door, centred, with its brass knob in the middle and a timber frame.
        P(this.geo.torus, this.mat('wood'), 0.62, 0.62, 0.9, 0, 0.72, 1.3);
        P(this.geo.cyl, this.mat('hobbitDoor'), 0.58, 0.08, 0.58, 0, 0.72, 1.28).rotation.x = Math.PI / 2;
        P(this.geo.ball, this.mat('gold'), 0.07, 0.07, 0.07, 0, 0.72, 1.36);
        P(this.geo.box, this.mat('stone', 1), 1.0, 0.1, 0.5, 0, 0.05, 1.5);
        [-1.35, 1.35].forEach(function (x) {
          var wz2 = Math.cos(x / 3.2) * 3.2 - 2.1 + 0.2;
          P(self.geo.torus, self.mat('wood'), 0.32, 0.32, 0.5, x, 0.85, wz2).rotation.y = x / 3.2;
          P(self.geo.cyl, self.mat('window'), 0.28, 0.04, 0.28, x, 0.85, wz2 - 0.01).rotation.set(Math.PI / 2, 0, -x / 3.2, 'YXZ');
          P(self.geo.box, self.mat('wood'), 0.5, 0.08, 0.14, x, 0.52, wz2 + 0.05);
          for (var fb = 0; fb < 3; fb++) P(self.geo.ball, self.mat('flag', fb + (x > 0 ? 2 : 0)), 0.06, 0.06, 0.06, x - 0.14 + fb * 0.14, 0.6, wz2 + 0.05);
        });
        // A short stone chimney with a pot, poking out of the grass.
        P(this.geo.box, this.mat('holdStone', 2), 0.32, 0.55, 0.32, 1.1, 2.0, -1.2);
        P(this.geo.cyl6, this.mat('brick', 0), 0.1, 0.18, 0.1, 1.1, 2.35, -1.2);
        // The garden: a winding flagstone path, flowers, a bench and a little gate.
        for (var st2 = 0; st2 < 6; st2++) P(this.geo.box, this.mat('stone', st2 % 3), 0.5, 0.05, 0.36, Math.sin(st2 * 0.9) * 0.25, 0.03, 1.9 + st2 * 0.5).rotation.y = st2 * 0.4;
        for (var fl2 = 0; fl2 < 14; fl2++) { var side = fl2 % 2 ? 1 : -1, fz = 1.8 + Math.floor(fl2 / 2) * 0.4; P(this.geo.blob, this.mat('houseplant', fl2), 0.16, 0.13, 0.16, side * (0.75 + (fl2 % 3) * 0.1), 0.08, fz); P(this.geo.ball, this.mat('flag', fl2 % 5), 0.06, 0.06, 0.06, side * (0.75 + (fl2 % 3) * 0.1), 0.2, fz); }
        P(this.geo.box, this.mat('wood'), 0.8, 0.06, 0.26, 1.9, 0.36, 1.3).rotation.y = -0.3;
        [1.6, 2.2].forEach(function (x) { P(self.geo.box, self.mat('wood'), 0.06, 0.34, 0.22, x, 0.17, 1.3 + (x - 1.9) * 0.3).rotation.y = -0.3; });
        [-1, 1].forEach(function (sd) {
          for (var pk2 = 0; pk2 < 4; pk2++) P(self.geo.box, self.mat('woodLight'), 0.06, 0.45, 0.06, sd * (0.45 + pk2 * 0.35), 0.22, 4.9);
          P(self.geo.box, self.mat('woodLight'), 1.15, 0.05, 0.05, sd * 0.97, 0.32, 4.9);
        });
        var gate = P(this.geo.box, this.mat('hobbitDoor'), 0.5, 0.4, 0.05, -0.2, 0.25, 5.05); gate.rotation.y = 0.9;
        break;
      }
      case 'yeti': {
        var lp = { x: LODGE.x + (SNOW.c.x - LODGE.x) * -0.18 + 2.0, z: LODGE.z + (SNOW.c.z - LODGE.z) * -0.18 };
        place(lp, true);
        P(this.geo.blob, this.mat('fur', 0), 0.7, 0.9, 0.6, 0, 1.0, 0);
        P(this.geo.blob, this.mat('fur', 0), 0.45, 0.42, 0.42, 0, 2.0, 0);
        P(this.geo.box, this.mat('fur', 1), 0.42, 0.28, 0.08, 0, 1.95, 0.38);
        [-0.12, 0.12].forEach(function (x) { P(self.geo.ball, self.mat('swan', 2), 0.05, 0.05, 0.05, x, 2.0, 0.43); });
        [-0.3, 0.3].forEach(function (x) { P(self.geo.blob, self.mat('fur', 0), 0.22, 0.4, 0.22, x, 0.3, 0); });
        P(this.geo.blob, this.mat('fur', 0), 0.18, 0.55, 0.18, -0.8, 1.2, 0);
        var arm2 = new T.Group(); arm2.position.set(0.7, 1.5, 0); g.add(arm2);
        P(this.geo.blob, this.mat('fur', 0), 0.18, 0.55, 0.18, 0.2, 0.4, 0, arm2);
        this.st.yetiArm = arm2;
        break;
      }
      case 'maypole': {
        place({ x: SQUARE.x + (PUB.x - SQUARE.x) * -0.45, z: SQUARE.z + (PUB.z - SQUARE.z) * -0.45 });
        (this.st.partyObjs = this.st.partyObjs || {}).maypole = g;
        P(this.geo.cyl6, this.mat('woodLight'), 0.08, 4.0, 0.08, 0, 2.0, 0);
        P(this.geo.torus, this.mat('hedge'), 0.35, 0.35, 0.35, 0, 3.9, 0).rotation.x = Math.PI / 2;
        P(this.geo.ball, this.mat('gold'), 0.12, 0.12, 0.12, 0, 4.1, 0);
        for (var rb = 0; rb < 8; rb++) {
          var ra = rb / 8 * Math.PI * 2, ex = Math.cos(ra) * 1.6, ez = Math.sin(ra) * 1.6;
          var len = Math.hypot(1.6, 3.6), rib = P(this.geo.box, this.mat('flag', rb), 0.06, len, 0.02, ex / 2, 2.0, ez / 2);
          rib.rotation.order = 'YXZ'; rib.rotation.y = -ra + Math.PI / 2; rib.rotation.z = Math.atan2(1.6, 3.6);
          P(this.geo.cyl6, this.mat('wood'), 0.04, 0.3, 0.04, ex, 0.15, ez);
        }
        break;
      }
      case 'feast': {
        // A long table down the town square with a seat for all twelve, lights strung overhead.
        var Q = TOWN_SQ;
        pos = { x: Q.x, z: Q.z + 2.0 };
        g.position.set(pos.x, groundY(Q.x, Q.z) + 0.1, pos.z);
        (this.st.partyObjs = this.st.partyObjs || {}).feast = g;
        P(this.geo.box, this.mat('wood'), 5.0, 0.08, 0.9, 0, 0.62, 0);
        P(this.geo.box, this.mat('canvas', 0), 5.1, 0.02, 0.6, 0, 0.67, 0);
        [-2.3, 2.3].forEach(function (x) { [-0.35, 0.35].forEach(function (z) { P(self.geo.box, self.mat('wood'), 0.08, 0.6, 0.08, x, 0.3, z); }); });
        // Twelve chairs: five down each side and one at each end.
        var seats = [];
        for (var sc = 0; sc < 5; sc++) { seats.push([-2.0 + sc, -0.7, 0]); seats.push([-2.0 + sc, 0.7, Math.PI]); }
        seats.push([-2.85, 0, Math.PI / 2]); seats.push([2.85, 0, -Math.PI / 2]);
        seats.forEach(function (c, ci) {
          var ch = new T.Group(); ch.position.set(c[0], 0, c[1]); ch.rotation.y = c[2]; g.add(ch);
          (self.st.seats = self.st.seats || []).push({ x: pos.x + c[0], z: pos.z + c[1], y: g.position.y + 0.45, rot: c[2], party: 'feast' });
          if (ci === 4 || ci === 5) (self.st.stashes = self.st.stashes || []).push({ x: pos.x, z: pos.z, mx: pos.x + c[0] * 0.5, mz: pos.z + c[1] * 1.15, y: g.position.y - 0.1, finds: 4, party: 'feast' });
          P(self.geo.box, self.mat('woodLight'), 0.36, 0.05, 0.34, 0, 0.38, 0, ch);
          P(self.geo.box, self.mat('woodLight'), 0.36, 0.42, 0.05, 0, 0.6, -0.16, ch);
          [[-0.15, -0.14], [0.15, -0.14], [-0.15, 0.14], [0.15, 0.14]].forEach(function (l) { P(self.geo.box, self.mat('wood'), 0.04, 0.38, 0.04, l[0], 0.19, l[1], ch); });
          P(self.geo.box, self.mat('flag', ci), 0.3, 0.04, 0.28, 0, 0.42, 0.02, ch); // a cushion each
        });
        // Places set: a plate and a mug at every seat, then bread, pies and candles down the middle.
        seats.forEach(function (c) {
          var px = c[0] * (Math.abs(c[0]) > 2.5 ? 0.8 : 1), pz = c[1] * 0.45;
          P(self.geo.cyl, self.mat('swan', 0), 0.12, 0.02, 0.12, px, 0.69, pz);
          P(self.geo.cyl6, self.mat('woodLight'), 0.04, 0.09, 0.04, px + 0.16, 0.73, pz);
        });
        [-1.6, 0, 1.6].forEach(function (x) { P(self.geo.blob, self.mat('woodLight'), 0.22, 0.1, 0.12, x - 0.4, 0.73, 0); P(self.geo.cyl, self.mat('brick', 0), 0.16, 0.06, 0.16, x + 0.35, 0.71, 0); });
        [-2.2, -0.8, 0.8, 2.2].forEach(function (x) { P(self.geo.cyl6, self.mat('plaster', 0), 0.03, 0.18, 0.03, x, 0.78, 0); P(self.geo.ball, self.mat('lantern'), 0.04, 0.06, 0.04, x, 0.9, 0); });
        // Strings of lights from corner to corner of the square.
        var top = 2.5, cz = Q.hz - 0.35, cx = Q.hx - 0.35;
        [[-cx, -cz - 2.0, cx, cz - 2.0], [cx, -cz - 2.0, -cx, cz - 2.0], [-cx, cz - 2.0, cx, cz - 2.0]].forEach(function (L) {
          var prev = null, up = new T.Vector3(0, 1, 0);
          for (var b = 0; b <= 24; b++) {
            var t = b / 24, q = new T.Vector3(L[0] + (L[2] - L[0]) * t, top - Math.sin(t * Math.PI) * 0.5, L[1] + (L[3] - L[1]) * t);
            if (b > 0 && b < 24) P(self.geo.ball, self.mat(b % 3 ? 'lantern' : 'flag', b), 0.05, 0.07, 0.05, q.x, q.y - 0.06, q.z);
            if (prev) {
              var dv = q.clone().sub(prev), wire = P(self.geo.cyl6, self.mat('stoneDark'), 0.012, dv.length(), 0.012, (q.x + prev.x) / 2, (q.y + prev.y) / 2, (q.z + prev.z) / 2);
              wire.quaternion.setFromUnitVectors(up, dv.normalize());
            }
            prev = q;
          }
        });
        break;
      }
      case 'zamboni': {
        var hk = this.st.sports.Hockey && this.st.sports.Hockey.group;
        if (!hk) break;
        var z = new T.Group();
        P(this.geo.box, this.mat('swan', 0), 0.9, 0.42, 0.5, 0, 0.32, 0, z);
        P(this.geo.box, this.mat('roof', 0), 0.92, 0.12, 0.52, 0, 0.56, 0, z);
        P(this.geo.box, this.mat('stoneDark'), 0.25, 0.3, 0.3, 0.25, 0.75, 0, z);
        P(this.geo.box, this.mat('roof', 0), 0.3, 0.06, 0.55, -0.5, 0.15, 0, z);
        z.position.y = 0.08;
        hk.add(z);
        this.st.zamboni = z;
        var hp = new T.Vector3(); hk.getWorldPosition(hp);
        pos = { x: hp.x, z: hp.z };
        return pos;
      }
      case 'windmill': {
        // Room is kept around it: each later seven-day streak adds to the mill.
        place(this.secretSpot(FARM_SPINE + 6, 70, 10.5), true);
        this.st.mill = { group: g, n: 1, hubs: [this.windmill(g, 0, 0, 1, pick)] };
        break;
      }
      case 'sub20': {
        // A giant golden runner mid-stride on a stone plinth, ringed with laurel.
        place(this.secretSpot(25, 64, 5), true);
        var gold = this.mat('gold');
        P(this.geo.cyl6, this.mat('stone', 1), 2.4, 1.0, 2.4, 0, 0.5, 0);
        P(this.geo.cyl6, this.mat('stone', 2), 2.6, 0.15, 2.6, 0, 1.05, 0);
        P(this.geo.box, gold, 1.4, 0.4, 0.06, 0, 0.55, 2.2);
        var fig = new T.Group(); fig.position.y = 1.1; fig.scale.setScalar(2.4); g.add(fig);
        P(this.geo.box, gold, 0.9, 1.6, 0.5, 0, 3.0, 0.2, fig).rotation.x = 0.25;
        P(this.geo.ball, gold, 0.42, 0.45, 0.42, 0, 4.15, 0.55, fig);
        var lt = P(this.geo.box, gold, 0.34, 1.7, 0.36, 0, 1.6, 0.9, fig); lt.rotation.x = -0.7;
        var lb = P(this.geo.box, gold, 0.3, 1.5, 0.32, 0, 0.5, 1.15, fig); lb.rotation.x = 0.2;
        var rt = P(this.geo.box, gold, 0.34, 1.7, 0.36, 0, 1.55, -0.5, fig); rt.rotation.x = 0.6;
        var rb = P(this.geo.box, gold, 0.3, 1.5, 0.32, 0, 0.75, -1.45, fig); rb.rotation.x = 1.2;
        var la = P(this.geo.box, gold, 0.26, 1.3, 0.26, 0.6, 3.1, -0.35, fig); la.rotation.x = 0.9;
        var ra = P(this.geo.box, gold, 0.26, 1.3, 0.26, -0.6, 3.2, 0.8, fig); ra.rotation.x = -0.9;
        for (var lf2 = 0; lf2 < 16; lf2++) { var lfa = lf2 / 16 * Math.PI * 2; P(this.geo.blob, this.mat('pine', 1), 0.28, 0.2, 0.28, Math.cos(lfa) * 2.3, 1.25, Math.sin(lfa) * 2.3); }
        break;
      }
      case 'shipwreck': {
        var sp = shoreAt(292);
        pos = { x: sp.x + COAST_N.x * 7, z: sp.z + COAST_N.z * 7 };
        g.position.set(pos.x, SEA_Y, pos.z);
        g.rotation.set(0.12, 0.7, 0.3);
        P(this.geo.box, this.mat('trunk'), 2.0, 1.4, 6.5, 0, 0.1, 0);
        P(this.geo.box, this.mat('wood'), 1.8, 0.12, 5.0, 0, 0.82, -0.4);
        P(this.geo.box, this.mat('trunk'), 1.9, 1.0, 1.4, 0, 1.2, -2.6);
        var mast = P(this.geo.cyl6, this.mat('trunk'), 0.1, 3.4, 0.1, 0.1, 2.4, 0.4); mast.rotation.z = 0.35;
        P(this.geo.box, this.mat('plaster', 1), 1.4, 1.0, 0.05, 0.5, 3.0, 0.4).rotation.z = 0.5;
        P(this.geo.box, this.mat('gold'), 0.6, 0.4, 0.4, 0.2, 1.1, 1.4);
        P(this.geo.box, this.mat('wood'), 0.64, 0.12, 0.44, 0.2, 1.36, 1.3).rotation.x = -0.5;
        P(this.geo.ball, this.mat('lantern'), 0.14, 0.1, 0.14, 0.2, 1.35, 1.45);
        [[2.2, 2.5], [-2.0, 3.6], [1.4, -3.8]].forEach(function (b) { P(self.geo.cyl, self.mat('wood'), 0.3, 0.6, 0.3, b[0], 0.1, b[1]).rotation.z = Math.PI / 2; });
        break;
      }
      case 'aurora': { pos = polar(140, 70); g.position.set(0, 0, 0); break; }
      case 'mellon': {
        // A door in the foot of the tallest mountain: stone pillars, an arch of glowing runes,
        // two trees and a star carved in silver, and the doors standing open on darkness.
        var pk = PEAKS[0], toward = Math.atan2(-pk.z, -pk.x), back = pk.h * 0.62;
        place({ x: pk.x + Math.cos(toward) * back, z: pk.z + Math.sin(toward) * back });
        g.rotation.y = Math.atan2(-g.position.x, -g.position.z);
        var glow = new T.MeshBasicMaterial({ color: '#cfe8ff' });
        P(this.geo.box, this.mat('stoneDark'), 3.4, 3.6, 1.2, 0, 1.8, -0.5);
        P(this.geo.box, this.mat('rock'), 0.3, 2.4, 0.4, -1.12, 1.2, 0.15);
        P(this.geo.box, this.mat('rock'), 0.3, 2.4, 0.4, 1.12, 1.2, 0.15);
        P(this.geo.box, this.mat('fur', 2), 1.6, 2.4, 0.1, 0, 1.2, 0.14).material = new T.MeshBasicMaterial({ color: '#0d0d14' });
        var arch = new T.Mesh(new T.TorusGeometry(1.0, 0.07, 6, 24, Math.PI), glow); arch.position.set(0, 2.4, 0.37); g.add(arch);
        P(this.geo.box, this.mat('fur', 2), 1.6, 0.9, 0.1, 0, 2.6, 0.14).material = new T.MeshBasicMaterial({ color: '#0d0d14' });
        [-1, 1].forEach(function (sd) {
          P(self.geo.box, glow, 0.05, 2.4, 0.03, sd * 1.0, 1.2, 0.37);
          for (var b2 = 0; b2 < 3; b2++) P(self.geo.box, glow, 0.25, 0.03, 0.03, sd * (1.0 - 0.1), 1.3 + b2 * 0.3, 0.37).rotation.z = sd * 0.6;
          var door = P(self.geo.box, self.mat('stoneDark'), 0.78, 2.3, 0.1, 0, 0, 0); door.position.set(sd * 1.15, 1.15, 0.55); door.rotation.y = sd * 1.1;
        });
        P(this.geo.cone4, glow, 0.12, 0.3, 0.03, 0, 2.95, 0.37);
        P(this.geo.cone4, glow, 0.12, 0.3, 0.03, 0, 2.95, 0.37).rotation.z = Math.PI;
        break;
      }
      case 'swans': {
        pos = { x: LAKE.c.x, z: LAKE.c.z };
        g.position.set(LAKE.c.x, LAKE.y + 0.14, LAKE.c.z);
        this.st.swans = [0, 1, 2].map(function (i) {
          var sw = new T.Group(), sc = i ? 0.6 : 1;
          P(self.geo.ball, self.mat('swan', 0), 0.3 * sc, 0.2 * sc, 0.45 * sc, 0, 0.15 * sc, 0, sw);
          var nk = P(self.geo.cyl6, self.mat('swan', 0), 0.06 * sc, 0.5 * sc, 0.06 * sc, 0, 0.45 * sc, 0.3 * sc, sw); nk.rotation.x = -0.25;
          P(self.geo.ball, self.mat('swan', 0), 0.09 * sc, 0.08 * sc, 0.11 * sc, 0, 0.7 * sc, 0.36 * sc, sw);
          P(self.geo.cone, self.mat('swan', 1), 0.04 * sc, 0.14 * sc, 0.04 * sc, 0, 0.68 * sc, 0.5 * sc, sw).rotation.x = Math.PI / 2;
          g.add(sw); sw.userData.k = i;
          return sw;
        });
        break;
      }
    }
    this.world.add(g);
    this.st.secretObjs[id] = g;
    if (id !== 'dragon' && id !== 'rainbow') this.pop(g, delay);
    return pos || { x: g.position.x, z: g.position.z };
  };

  // A windmill: round tower, cap, and four sails on a hub that turns.
  Town.prototype.windmill = function (parent, x, z, sc, pick) {
    var self = this, g = new T.Group();
    g.position.set(x, 0, z); g.scale.setScalar(sc); parent.add(g);
    function P(geo, mat, sx, sy, sz, px, py, pz, par) { return self.part(par || g, geo, mat, sx, sy, sz, px, py, pz, pick); }
    P(this.geo.cyl, this.mat('plaster', 0), 1.0, 3.4, 1.0, 0, 1.7, 0);
    P(this.geo.cone, this.mat('roofTavern'), 1.15, 1.2, 1.15, 0, 4.0, 0);
    P(this.geo.box, this.mat('wood'), 0.4, 0.7, 0.06, 0, 0.35, 1.0);
    var hub = new T.Group(); hub.position.set(0, 3.5, 1.15); g.add(hub);
    for (var sl = 0; sl < 4; sl++) { var arm = new T.Group(); P(this.geo.box, this.mat('woodLight'), 0.4, 2.6, 0.04, 0, 1.4, 0, arm); arm.rotation.z = sl * Math.PI / 2; hub.add(arm); }
    P(this.geo.cyl, this.mat('wood'), 0.12, 0.2, 0.12, 0, 0, 0, hub).rotation.x = Math.PI / 2;
    hub.userData.phase = x * 0.7;
    return hub;
  };
  // Each seven-day streak after the first adds to the mill, until it's a little mill village.
  // Streaks needed for each step: each one takes a few more than the last.
  var MILL_AT = [0, 1, 2, 4, 7, 11, 16, 22, 30, 40];
  var MILL_STEPS = [null, null, 'a mill house', 'flour sacks and a cart', 'a second windmill', 'a millpond', 'a third windmill', 'a bakery', 'a fourth windmill', 'a fifth windmill'];
  Town.prototype.growMill = function (n, delay, ev) {
    var M = this.st.mill, self = this, pick = 'secret:windmill', o = new T.Group();
    if (!M || n >= MILL_STEPS.length || n <= M.n) return;
    M.n = n;
    function P(geo, mat, sx, sy, sz, x, y, z, par) { return self.part(par || o, geo, mat, sx, sy, sz, x, y, z, pick); }
    switch (n) {
      case 2:
        P(this.geo.box, this.mat('stone', 1), 2.0, 1.2, 1.6, 4.6, 0.6, 0.8);
        P(this.geo.gable, this.mat('roofTavern'), 1.3, 1.0, 1.15, 4.6, 1.2, 0.8);
        P(this.geo.box, this.mat('wood'), 0.45, 0.75, 0.05, 4.6, 0.37, 1.62);
        P(this.geo.box, this.mat('window'), 0.3, 0.3, 0.05, 4.0, 0.75, 1.62);
        break;
      case 3:
        for (var sk = 0; sk < 5; sk++) P(this.geo.blob, this.mat('plaster', 1), 0.22, 0.3, 0.2, 2.2 + (sk % 3) * 0.36, 0.25 + Math.floor(sk / 3) * 0.32, 3.4);
        P(this.geo.box, this.mat('wood'), 1.3, 0.16, 0.8, 4.0, 0.45, 3.9);
        [-0.35, 0.35].forEach(function (dz) { P(self.geo.torus, self.mat('trunk'), 0.24, 0.24, 0.24, 4.0, 0.26, 3.9 + dz * 1.2).rotation.y = Math.PI / 2; });
        P(this.geo.box, this.mat('wood'), 0.06, 0.06, 1.1, 3.2, 0.5, 3.9);
        break;
      case 4: M.hubs.push(this.windmill(o, -6.8, -1.0, 0.9, pick)); break;
      case 5:
        P(this.geo.cyl, this.mat('stone', 2), 1.5, 0.15, 1.1, 4.2, 0.07, -5.8);
        P(this.geo.cyl, this.mat('water'), 1.35, 0.05, 0.95, 4.2, 0.13, -5.8);
        var wheel = P(this.geo.torus, this.mat('wood'), 0.6, 0.6, 1.6, 2.75, 0.6, -5.8); wheel.rotation.y = Math.PI / 2;
        P(this.geo.blob, this.mat('hedge'), 0.25, 0.4, 0.25, 5.6, 0.3, -5.5);
        break;
      case 6: M.hubs.push(this.windmill(o, -3.4, -8.0, 0.85, pick)); break;
      case 7:
        P(this.geo.box, this.mat('plaster', 2), 1.7, 1.1, 1.4, -6.6, 0.55, 5.0);
        P(this.geo.gable, this.mat('roof', 4), 1.15, 0.9, 1.0, -6.6, 1.1, 5.0);
        P(this.geo.box, this.mat('stone', 2), 0.35, 1.3, 0.35, -6.1, 1.5, 4.6);
        P(this.geo.box, this.mat('window'), 0.5, 0.35, 0.05, -6.6, 0.6, 5.72);
        P(this.geo.box, this.mat('canvas', 1), 1.7, 0.06, 0.5, -6.6, 1.0, 5.9).rotation.x = 0.4;
        break;
      case 8: M.hubs.push(this.windmill(o, 2.6, -10.0, 0.8, pick)); break;
      case 9: M.hubs.push(this.windmill(o, -9.6, 2.6, 0.75, pick)); break;
    }
    M.group.add(o);
    // Sit each addition on the ground under it (the mill's plot isn't levelled).
    var ax = 0, az = 0, cnt = 0;
    o.children.forEach(function (ch) { ax += ch.position.x; az += ch.position.z; cnt++; });
    if (cnt) this.settle(o, ax / cnt, az / cnt, M.group);
    this.pop(o, delay + 900);
    if (this.onSecret) this.onSecret({ id: 'windmill#' + n, title: 'The Windmill grows', text: 'Seven-day streak number ' + MILL_AT[n] + '! The mill gets ' + MILL_STEPS[n] + '.' }, ev);
  };
  // Raises or lowers obj so the ground under local point (x, z) of parent is where it stands.
  Town.prototype.settle = function (obj, x, z, parent, own) {
    parent.updateMatrixWorld(true);
    var v = new T.Vector3(x, 0, z), base = new T.Vector3();
    parent.localToWorld(v); parent.getWorldPosition(base);
    obj.position.y = (own ? 0 : 0) + groundY(v.x, v.z) - base.y - 0.05;
  };
  // Every hundred workouts the wizard's place grows: two more storeys on the tower (with floating
  // crystals and a moon orb), then a little wizard village gathers round it.
  var WIZ_STEPS = { 2: 'another storey and floating crystals', 3: 'its top storey and a glowing moon orb', 4: 'a crooked cottage', 5: 'a mushroom house',
    6: 'a potion shop with a bubbling cauldron', 7: 'a crystal garden', 8: 'an owlery', 9: 'a rune circle', 10: 'a second crooked cottage', 11: 'a lantern-lit lane', 12: 'a floating island with a hut' };
  var WIZ_MAX = 12;
  Town.prototype.growWizard = function (level, delay, ev) {
    var W = this.st.wiz, self = this, pick = 'secret:wizard';
    if (!W || level <= W.level || W.level >= WIZ_MAX) return;
    function P(geo, mat, sx, sy, sz, x, y, z, par) { return self.part(par || W.group, geo, mat, sx, sy, sz, x, y, z, pick); }
    function cottage(x, z, rot, roofIdx) {
      var c = new T.Group(); c.position.set(x, 0, z); c.rotation.y = rot; W.group.add(c);
      self.settle(c, x, z, W.group, true);
      P(self.geo.box, self.mat('plaster', 1), 1.3, 1.0, 1.1, 0, 0.5, 0, c);
      var r = P(self.geo.cone4, self.mat('roof', roofIdx), 1.15, 1.6, 1.0, 0.1, 1.75, 0, c); r.rotation.y = Math.PI / 4; r.rotation.z = 0.18;
      P(self.geo.box, self.mat('lantern'), 0.25, 0.3, 0.05, 0.3, 0.6, 0.56, c);
      P(self.geo.box, self.mat('wood'), 0.35, 0.6, 0.05, -0.3, 0.3, 0.56, c);
      P(self.geo.cyl6, self.mat('stone', 2), 0.12, 0.7, 0.12, -0.45, 1.6, -0.2, c).rotation.z = -0.25;
      return c;
    }
    while (W.level < level && W.level < WIZ_MAX) {
      W.level++;
      var L = W.level, o = new T.Group();
      W.group.add(o);
      if (L <= 3) {
        // The tower tops out at two more storeys.
        o.position.y = W.top;
        P(this.geo.cyl, this.mat('keepDark'), 0.95, 1.3, 0.95, 0, 0.65, 0, o);
        P(this.geo.cyl, this.mat('keepStone', 1), 1.08, 0.14, 1.08, 0, 1.3, 0, o);
        var wa = L * 1.1; P(this.geo.box, this.mat('lantern'), 0.22, 0.4, 0.06, Math.cos(wa) * 0.95, 0.7, Math.sin(wa) * 0.95, o).rotation.y = -wa + Math.PI / 2;
        W.top += 1.3;
        this.animTo(W.hat, W.top, delay + 900);
        if (L === 2) {
          W.crystals = new T.Group(); W.crystals.position.y = W.top - 2; W.group.add(W.crystals);
          for (var c = 0; c < 4; c++) { var a = c / 4 * Math.PI * 2, cr = P(this.geo.cone4, this.mat(c % 2 ? 'silver' : 'elfRoof', 0), 0.18, 0.5, 0.18, Math.cos(a) * 2.2, 0, Math.sin(a) * 2.2, W.crystals); cr.rotation.x = Math.PI; }
        } else P(this.geo.ball, this.mat('lantern'), 0.38, 0.38, 0.38, 0, 4.4, 0, W.hat);
      } else if (L === 4) cottage(3.6, 1.4, 0.4, 2);
      else if (L === 5) {
        o.position.set(-3.4, 0, 2.2);
        P(this.geo.cyl, this.mat('plaster', 0), 0.7, 1.3, 0.7, 0, 0.65, 0, o);
        P(this.geo.ball, this.mat('flag', 0), 1.2, 0.7, 1.2, 0, 1.45, 0, o);
        for (var sp = 0; sp < 6; sp++) P(this.geo.ball, this.mat('plaster', 0), 0.12, 0.08, 0.12, Math.cos(sp) * 0.75, 1.75 + (sp % 2) * 0.15, Math.sin(sp) * 0.75, o);
        P(this.geo.box, this.mat('wood'), 0.3, 0.55, 0.05, 0, 0.3, 0.7, o);
        P(this.geo.box, this.mat('lantern'), 0.18, 0.18, 0.05, 0.35, 0.8, 0.62, o);
      } else if (L === 6) {
        o.position.set(1.8, 0, 4.4); o.rotation.y = -0.3;
        P(this.geo.box, this.mat('plaster', 2), 1.6, 1.1, 1.2, 0, 0.55, 0, o);
        var r6 = P(this.geo.gable, this.mat('roof', 3), 1.1, 0.9, 0.9, 0, 1.1, 0, o); r6.rotation.z = 0.08;
        P(this.geo.box, this.mat('window'), 0.9, 0.35, 0.05, 0, 0.6, 0.62, o);
        P(this.geo.cyl, this.mat('keepDark'), 0.35, 0.35, 0.35, 1.3, 0.25, 0.6, o);
        P(this.geo.cyl, this.mat('pitch'), 0.3, 0.05, 0.3, 1.3, 0.44, 0.6, o);
        for (var bb = 0; bb < 3; bb++) P(this.geo.ball, this.mat('pitch'), 0.08, 0.08, 0.08, 1.2 + bb * 0.1, 0.55 + bb * 0.12, 0.6, o);
        P(this.geo.cone, this.mat('fire'), 0.15, 0.25, 0.15, 1.3, 0.04, 0.6, o);
      } else if (L === 7) {
        o.position.set(-1.6, 0, -3.6);
        for (var cg = 0; cg < 9; cg++) { var ca = cg * 0.7, cr2 = P(this.geo.cone4, this.mat(['elfRoof', 'silver', 'roof'][cg % 3], 2), 0.18, 0.5 + (cg % 4) * 0.25, 0.18, Math.cos(ca) * (0.4 + cg * 0.12), 0.3, Math.sin(ca) * (0.4 + cg * 0.12), o); cr2.rotation.z = (cg % 3 - 1) * 0.3; }
      } else if (L === 8) {
        o.position.set(3.2, 0, -3.0);
        P(this.geo.cyl6, this.mat('wood'), 0.45, 2.6, 0.45, 0, 1.3, 0, o);
        P(this.geo.cone6, this.mat('roof', 2), 0.65, 0.9, 0.65, 0, 3.05, 0, o);
        [[0.5, 1.6], [-0.5, 2.1], [0.45, 2.4]].forEach(function (ow) { P(self.geo.ball, self.mat('trunk'), 0.14, 0.18, 0.14, ow[0], ow[1], 0.2, o); P(self.geo.ball, self.mat('lantern'), 0.04, 0.04, 0.04, ow[0] + 0.05, ow[1] + 0.05, 0.33, o); });
      } else if (L === 9) {
        o.position.set(-4.8, 0, -1.4);
        for (var rs = 0; rs < 7; rs++) { var ra = rs / 7 * Math.PI * 2; P(this.geo.box, this.mat('rock'), 0.3, 0.8, 0.2, Math.cos(ra) * 1.3, 0.4, Math.sin(ra) * 1.3, o).rotation.y = -ra; P(this.geo.box, this.mat('lantern'), 0.12, 0.12, 0.03, Math.cos(ra) * 1.2, 0.55, Math.sin(ra) * 1.2, o).rotation.y = -ra + Math.PI / 2; }
        P(this.geo.cyl, this.mat('elfRoof', 0), 0.5, 0.05, 0.5, 0, 0.03, 0, o);
      } else if (L === 10) cottage(-2.6, 5.2, -0.5, 4);
      else if (L === 11) {
        [[2.2, 2.6], [0.4, 3.0], [-1.6, 3.6], [-3.8, 4.0], [4.4, -0.6], [-5.2, 0.6]].forEach(function (lp) {
          P(self.geo.cyl6, self.mat('stoneDark'), 0.03, 1.1, 0.03, lp[0], 0.55, lp[1], o);
          P(self.geo.ball, self.mat('lantern'), 0.12, 0.12, 0.12, lp[0], 1.15, lp[1], o);
        });
      } else if (L === 12) {
        var isl = new T.Group(); isl.position.set(-0.5, 9.5, -5.5); W.group.add(isl); W.island = isl;
        var rock = P(this.geo.cone6, this.mat('rock'), 1.8, 2.2, 1.6, 0, -1.1, 0, isl); rock.rotation.x = Math.PI;
        P(this.geo.cyl6, this.mat('pitch'), 1.85, 0.2, 1.65, 0, 0.05, 0, isl);
        var hut = new T.Group(); hut.position.set(0, 0.15, 0); isl.add(hut);
        P(this.geo.box, this.mat('plaster', 1), 0.9, 0.7, 0.8, 0, 0.35, 0, hut);
        P(this.geo.cone4, this.mat('roof', 2), 0.8, 1.0, 0.7, 0, 1.2, 0, hut).rotation.y = Math.PI / 4;
        P(this.geo.ball, this.mat('lantern'), 0.08, 0.08, 0.08, 0.5, 0.5, 0.42, hut);
      }
      if (L > 3) {
        if (o.position.x || o.position.z) this.settle(o, o.position.x, o.position.z, W.group, true);
        else if (o.children.length) { var sx = 0, sz = 0; o.children.forEach(function (ch) { sx += ch.position.x; sz += ch.position.z; }); this.settle(o, sx / o.children.length, sz / o.children.length, W.group); }
      }
      if (!this.instant && L > 3) this.pop(o, delay + 900);
    }
    if (this.onSecret) this.onSecret({ id: 'wizard#' + level, title: 'The Wizard’s Tower grows', text: level * 100 + ' workouts! The wizard adds ' + WIZ_STEPS[Math.min(level, WIZ_MAX)] + '.' }, ev);
  };

  // ---- the sheep pasture ----------------------------------------------
  // One sheep for every Strava ride over 100 km.
  Town.prototype.updateSheep = function (ev, delay) {
    var S = this.st.sheep, self = this;
    if (!ev.strava || !(ev.km >= 100)) return;
    S.rides = (S.rides || 0) + 1;
    if (S.list.length >= 60) return;
    if (!S.pen) this.buildPasture(delay);
    {
      var k = S.list.length, r = rng(900 + k), a = r() * Math.PI * 2, d = Math.sqrt(r()) * (PASTURE_R - 1.2);
      var sh = new T.Group(), pick = 'sheep', sc = 0.85 + r() * 0.3;
      sh.position.set(Math.cos(a) * d, 0, Math.sin(a) * d);
      sh.rotation.y = r() * 6.28;
      sh.scale.setScalar(sc);
      this.part(sh, this.geo.blob, this.mat('fur', 0), 0.42, 0.32, 0.55, 0, 0.5, 0, pick);
      this.part(sh, this.geo.box, this.mat('swan', 2), 0.2, 0.22, 0.24, 0, 0.6, 0.55, pick);
      [[-0.2, -0.28], [0.2, -0.28], [-0.2, 0.28], [0.2, 0.28]].forEach(function (l) { self.part(sh, self.geo.box, self.mat('swan', 2), 0.07, 0.36, 0.07, l[0], 0.18, l[1], pick); });
      S.pen.add(sh);
      S.list.push({ g: sh, tx: sh.position.x, tz: sh.position.z, wait: r() * 6, seed: k });
      this.pop(sh, delay + 300 + (k % 5) * 120);
      if (S.list.length === 10) this.pastureExtra('hut', delay);
      if (S.list.length === 25) this.pastureExtra('dog', delay);
    }
  };
  Town.prototype.buildPasture = function (delay) {
    var S = this.st.sheep, g = new T.Group(), self = this, pick = 'sheep';
    g.position.set(PASTURE.x, groundY(PASTURE.x, PASTURE.z), PASTURE.z);
    var gate = Math.atan2(-PASTURE.z, -PASTURE.x);
    // Dry-stone wall round the field, with a gate facing town.
    for (var i = 0; i < 28; i++) {
      var a0 = i / 28 * Math.PI * 2, a1 = (i + 1) / 28 * Math.PI * 2, mid = (a0 + a1) / 2;
      if (Math.abs(Math.atan2(Math.sin(mid - gate), Math.cos(mid - gate))) < 0.12) continue;
      var x0 = Math.cos(a0) * PASTURE_R, z0 = Math.sin(a0) * PASTURE_R, x1 = Math.cos(a1) * PASTURE_R, z1 = Math.sin(a1) * PASTURE_R;
      var w = this.part(g, this.geo.box, this.mat('stone', i % 3), Math.hypot(x1 - x0, z1 - z0) + 0.1, 0.55, 0.35, (x0 + x1) / 2, 0.27, (z0 + z1) / 2, pick);
      w.rotation.y = -Math.atan2(z1 - z0, x1 - x0);
    }
    [-0.14, 0.14].forEach(function (o) { self.part(g, self.geo.box, self.mat('wood'), 0.16, 0.9, 0.16, Math.cos(gate + o) * PASTURE_R, 0.45, Math.sin(gate + o) * PASTURE_R, pick); });
    this.part(g, this.geo.box, this.mat('wood'), 1.3, 0.35, 0.45, -2.5, 0.18, 1.8, pick);
    this.part(g, this.geo.box, this.mat('water'), 1.15, 0.05, 0.32, -2.5, 0.34, 1.8, pick);
    this.part(g, this.geo.box, this.mat('wood'), 0.8, 0.9, 0.6, 2.4, 0.45, -2.6, pick);
    this.part(g, this.geo.blob, this.mat('crop', 3), 0.5, 0.35, 0.4, 2.4, 1.0, -2.6, pick);
    this.world.add(g);
    S.pen = g;
    this.pop(g, delay);
  };
  Town.prototype.pastureExtra = function (kind, delay) {
    var S = this.st.sheep, o = new T.Group(), self = this, pick = 'sheep';
    function P(geo, mat, sx, sy, sz, x, y, z) { return self.part(o, geo, mat, sx, sy, sz, x, y, z, pick); }
    if (kind === 'hut') {
      // A shepherd's hut on iron wheels.
      P(this.geo.box, this.mat('roofJo'), 1.5, 0.9, 0.9, 3.4, 0.85, 1.6);
      var rf = P(this.geo.cyl, this.mat('stoneDark'), 0.55, 1.6, 0.55, 3.4, 1.28, 1.6); rf.rotation.z = Math.PI / 2; rf.scale.set(0.5, 1.6, 0.5);
      [[2.9, 1.15], [3.9, 1.15], [2.9, 2.05], [3.9, 2.05]].forEach(function (w) { P(self.geo.torus, self.mat('stoneDark'), 0.2, 0.2, 0.2, w[0], 0.3, w[1]); });
      P(this.geo.box, this.mat('window'), 0.3, 0.25, 0.04, 3.4, 0.95, 2.06);
      P(this.geo.box, this.mat('stone', 2), 0.1, 0.4, 0.1, 3.9, 1.6, 1.6);
    } else {
      // A sheepdog keeping watch by the gate.
      var gate = Math.atan2(-PASTURE.z, -PASTURE.x), gx = Math.cos(gate) * (PASTURE_R - 1.2), gz = Math.sin(gate) * (PASTURE_R - 1.2);
      P(this.geo.box, this.mat('swan', 2), 0.22, 0.2, 0.45, gx, 0.25, gz);
      P(this.geo.box, this.mat('fur', 0), 0.2, 0.2, 0.2, gx, 0.42, gz + 0.28);
      P(this.geo.box, this.mat('swan', 2), 0.06, 0.24, 0.06, gx, 0.32, gz - 0.28).rotation.x = 0.8;
    }
    S.pen.add(o);
    this.pop(o, delay + 500);
  };

  // Moves the camera to look at a secret (the page's "Show me" button).
  Town.prototype.focusOn = function (id) {
    id = String(id).split('#')[0];
    var p = this.st.secretPos[id];
    if (!p) return;
    var c = this.controls, off = this.camera.position.clone().sub(c.target), y = groundY(p.x, p.z);
    this.fit.auto = false;
    c.target.set(p.x, y + (id === 'dragon' ? 18 : id === 'rainbow' ? 10 : 2), p.z);
    this.camera.position.copy(c.target).add(off);
    if (id !== 'rainbow') this.camera.zoom = Math.max(this.camera.zoom, 1.6);
    this.camera.updateProjectionMatrix();
    c.update();
    this.needsRender = true;
  };
  // Fireworks: bursts of coloured sparks over the town for a while.
  var FW_COLORS = ['#ff5a4a', '#ffd23a', '#5ab0ff', '#7aff7a', '#ff7ae0', '#ffffff', '#ffa03a'];
  Town.prototype.fireworks = function (secs) {
    if (this.soft || this.instant) return;
    this.fw = this.fw || { bursts: [], until: 0, next: 0 };
    this.fw.until = Math.max(this.fw.until, performance.now() + secs * 1000);
  };
  Town.prototype.stepFireworks = function (dt, now) {
    var F = this.fw;
    if (!F || (now > F.until && !F.bursts.length)) return;
    if (now < F.until && now > F.next) {
      F.next = now + 280 + Math.random() * 520;
      var c = this.controls.target, n = 90, pos = new Float32Array(n * 3), vel = [];
      var cx = c.x + (Math.random() - 0.5) * 36, cy = c.y + 12 + Math.random() * 12, cz = c.z + (Math.random() - 0.5) * 36, sp = 6 + Math.random() * 5;
      for (var i = 0; i < n; i++) {
        var u = Math.random() * 2 - 1, th = Math.random() * Math.PI * 2, r = Math.sqrt(1 - u * u);
        pos[i * 3] = cx; pos[i * 3 + 1] = cy; pos[i * 3 + 2] = cz;
        vel.push(r * Math.cos(th) * sp, u * sp, r * Math.sin(th) * sp);
      }
      var geo = new T.BufferGeometry(); geo.setAttribute('position', new T.BufferAttribute(pos, 3));
      var mat = new T.PointsMaterial({ color: FW_COLORS[Math.floor(Math.random() * FW_COLORS.length)], size: 11, sizeAttenuation: false, transparent: true, opacity: 1, depthWrite: false, blending: T.AdditiveBlending, fog: false });
      var pts = new T.Points(geo, mat);
      this.scene.add(pts);
      F.bursts.push({ pts: pts, vel: vel, age: 0 });
    }
    var self = this;
    F.bursts = F.bursts.filter(function (b) {
      b.age += dt;
      var p = b.pts.geometry.attributes.position, v = b.vel;
      for (var i = 0; i < p.count; i++) {
        v[i * 3 + 1] -= 5 * dt; v[i * 3] *= 0.985; v[i * 3 + 2] *= 0.985;
        p.array[i * 3] += v[i * 3] * dt; p.array[i * 3 + 1] += v[i * 3 + 1] * dt; p.array[i * 3 + 2] += v[i * 3 + 2] * dt;
      }
      p.needsUpdate = true;
      b.pts.material.opacity = Math.max(0, 1 - b.age / 2.2);
      if (b.age > 2.2) { self.scene.remove(b.pts); b.pts.geometry.dispose(); b.pts.material.dispose(); return false; }
      return true;
    });
    this.needsRender = true;
  };
  // Called by the page with today's date: fireworks if yesterday was a marathon.
  Town.prototype.dayAfterMarathon = function (today) {
    var s = this.st, y = new Date(today + 'T12:00:00'); y.setDate(y.getDate() - 1);
    var yd = y.toISOString().slice(0, 10);
    return (s.marathons || []).indexOf(yd) >= 0;
  };
  Town.prototype.animateSecrets = function (dt, now) {
    var s = this.st;
    this.stepFireworks(dt, now);
    this.stepCritters(dt, now);
    this.stepWildlife(dt, now);
    if (s.dragon) {
      var d = s.dragon.group, a = now / 9000, R = 16;
      d.position.set(s.dragon.c.x + Math.cos(a) * R, 26 + Math.sin(now / 1700) * 1.2, s.dragon.c.z + Math.sin(a) * R);
      d.rotation.y = -a;
      d.wings.forEach(function (w) { w.rotation.z = w.side * Math.sin(now / 260) * 0.55; });
    }
    if (s.mill) s.mill.hubs.forEach(function (h) { h.rotation.z = now / 1400 + h.userData.phase; });
    if (s.wiz && s.wiz.crystals) { s.wiz.crystals.rotation.y = now / 2500; s.wiz.crystals.position.y = s.wiz.top - 2 + Math.sin(now / 900) * 0.25; }
    if (s.wiz && s.wiz.island) s.wiz.island.position.y = 9.5 + Math.sin(now / 1300) * 0.35;
    if (s.sheep && s.sheep.list.length) {
      s.sheep.list.forEach(function (sh) {
        var g = sh.g, dx = sh.tx - g.position.x, dz = sh.tz - g.position.z, d = Math.hypot(dx, dz);
        if (sh.wait > 0) { sh.wait -= dt; return; }
        if (d < 0.05) {
          var r = rng(sh.seed * 7 + Math.floor(now / 997)), a = r() * Math.PI * 2, rr = Math.sqrt(r()) * (PASTURE_R - 1.2);
          sh.tx = Math.cos(a) * rr; sh.tz = Math.sin(a) * rr; sh.wait = 2 + r() * 7;
          return;
        }
        var step = Math.min(d, dt * 0.35);
        g.position.x += dx / d * step; g.position.z += dz / d * step;
        g.rotation.y = Math.atan2(dx, dz);
      });
    }
    if (s.yetiArm) s.yetiArm.rotation.z = 0.6 + Math.sin(now / 300) * 0.5;
    if (s.zamboni) { s.zamboni.position.x = Math.sin(now / 3000) * 1.0; s.zamboni.visible = this.season === 'winter'; }
    if (s.swans) {
      var PR = LAKE.R, winter = this.season === 'winter';
      s.swans.forEach(function (sw) {
        var k = sw.userData.k, a2 = -now / 7000 + k * 0.5, r = PR * 0.62 - k * 0.15;
        sw.position.set(Math.cos(a2) * r, 0, Math.sin(a2) * r);
        sw.rotation.y = -a2 + Math.PI;
        sw.visible = !winter;
      });
    }
  };

  // ---- runs: the forest ----------------------------------------------

  // One run, one tree. The kind of run picks the tree, and each kind grows in its own grove:
  // short or interval runs grow birches, other road runs maples, 10 km+ road runs giant oaks,
  // trail runs spruces (giant ones past 10 km), and a half marathon or longer a sequoia.
  // Longer runs grow bigger trees. A grove spreads out from its seed into the nearest free
  // spots; when the forest is full, new runs make that grove's smallest trees grow.
  function runTree(ev) {
    var km = ev.km || 0, trail = ev.sub === 'trail' || /trail/i.test(ev.label || '');
    if (km >= 21) return 'sequoia';
    if (trail) return km >= 10 ? 'bigspruce' : 'spruce';
    if (km >= 10) return 'bigoak';
    if (km < 5 || /interval|sprint|400|track|tempo|fartlek/i.test(ev.label || '')) return 'birch';
    return 'maple';
  }
  var TREE_NAMES = { spruce: 'spruce', bigspruce: 'giant spruce', birch: 'birch', maple: 'maple', bigoak: 'giant oak', sequoia: 'sequoia' };
  var GROVES = {
    birch: { seed: polar(0, 28), name: 'the birch copse' },
    maple: { seed: polar(12, 44), name: 'the maple wood' },
    bigoak: { seed: polar(38, 25), name: 'the old oaks' },
    spruce: { seed: polar(68, 40), name: 'the trail wood' },
    sequoia: { seed: polar(45, 48), name: 'the sequoia grove' }
  };
  function groveOf(kind) { return kind === 'bigspruce' ? 'spruce' : kind; }
  // Every run plants its tree, plus a smaller one for each 5 km, all in that run's grove.
  var UNDERSTORY = { birch: 'birch', maple: 'maple', bigoak: 'maple', spruce: 'spruce', bigspruce: 'spruce', sequoia: 'spruce' };
  Town.prototype.addRun = function (ev, delay) {
    var f = this.st.forest, km = ev.km || 0, kind = runTree(ev), grove = groveOf(kind);
    f.runs++; f.km += km;
    f.kinds[kind] = (f.kinds[kind] || 0) + 1;
    var main = this.plantRunTree(kind, grove, 0.8 + Math.min(km, 30) / 40, delay);
    this.endurancePRs('run', ev, main, delay);
    var extra = Math.min(12, Math.floor(km / 5));
    for (var e = 0; e < extra; e++) this.plantRunTree(UNDERSTORY[kind] || 'maple', grove, 0.75 + (e % 3) * 0.08, delay + 120 + e * 70);
    this.markBatch();
  };
  // Run and ride PRs, worked out from your own history like the lifting PRs: longest, fastest pace
  // (runs of 5 km+ and 10 km+, timed by Strava), fastest ride (20 km+) and most climbing. The run's
  // tree gets a gold star and pennant; the ride's first crop gets a pennant. Hover them for details.
  function paceLabel(secsPerKm) { var m = Math.floor(secsPerKm / 60), sec = Math.round(secsPerKm % 60); if (sec === 60) { m++; sec = 0; } return m + ':' + (sec < 10 ? '0' : '') + sec + '/km'; }
  Town.prototype.endurancePRs = function (kind, ev, anchor, delay) {
    var s = this.st, B = s.endBest || (s.endBest = {}), km = ev.exactKm || ev.km || 0, got = [];
    function check(key, value, better, label, fmtv) {
      var prev = B[key];
      if (prev != null && better(value, prev)) got.push(label + ': ' + fmtv(value) + ' (beat ' + fmtv(prev) + ')');
      if (prev == null || better(value, prev)) B[key] = value;
    }
    var kmf = function (v) { return (Math.round(v * 10) / 10) + ' km'; };
    if (kind === 'run') {
      if (km > 0) check('runKm', km, function (a, b) { return a > b + 0.05; }, 'Longest run', kmf);
      if (ev.secs && km >= 4.9) check('run5', ev.secs / km, function (a, b) { return a < b - 1; }, 'Fastest pace over 5 km+', paceLabel);
      if (ev.secs && km >= 9.9) check('run10', ev.secs / km, function (a, b) { return a < b - 1; }, 'Fastest pace over 10 km+', paceLabel);
    } else {
      if (km > 0) check('rideKm', km, function (a, b) { return a > b + 0.1; }, 'Longest ride', kmf);
      if (ev.secs && km >= 20) check('rideSpd', km / (ev.secs / 3600), function (a, b) { return a > b + 0.2; }, 'Fastest ride over 20 km+', function (v) { return (Math.round(v * 10) / 10) + ' km/h'; });
      if (ev.elev) check('rideElev', ev.elev, function (a, b) { return a > b + 5; }, 'Most climbing on a ride', function (v) { return Math.round(v) + ' m'; });
    }
    if (!got.length || !anchor) return;
    var list = s.endPRs || (s.endPRs = []), i = list.length, pick = 'endpr:' + i, self = this, g = new T.Group();
    list.push({ kind: kind, day: ev.day, label: ev.label, lines: got });
    function P(geo, mat, sx, sy, sz, x, y, z) { return self.part(g, geo, mat, sx, sy, sz, x, y, z, pick); }
    var top = kind === 'run' ? new T.Box3().setFromObject(anchor).max.y - anchor.position.y : 0.4;
    var sc = anchor.scale.x || 1;
    if (kind === 'run') {
      // A gold star on the treetop.
      P(this.geo.cone4, this.mat('gold'), 0.22, 0.32, 0.08, 0, 0.16, 0);
      P(this.geo.cone4, this.mat('gold'), 0.22, 0.32, 0.08, 0, -0.06, 0).rotation.z = Math.PI;
      g.position.y = top / sc + 0.2;
    }
    P(this.geo.cyl6, this.mat('wood'), 0.03, 0.9, 0.03, 0.35, kind === 'run' ? -0.2 : 0.45, 0);
    P(this.geo.flag, this.mat('flag', 0), 1.1, 1.1, 1.1, 0.35, kind === 'run' ? 0.25 : 0.9, 0);
    var hit = new T.Mesh(this.geo.box, this.hitMat || (this.hitMat = new T.MeshBasicMaterial({ visible: false })));
    hit.scale.set(0.9, 1.2, 0.9); hit.position.set(0.2, kind === 'run' ? 0.1 : 0.6, 0); hit.userData.pick = pick; g.add(hit); this.picks.push(hit);
    g.scale.setScalar(1 / sc);
    anchor.add(g);
    if (!this.instant) this.pop(g, delay + 800);
  };
  Town.prototype.plantRunTree = function (kind, grove, size, delay) {
    var f = this.st.forest, G = GROVES[grove];
    f.used = f.used || {};
    f.groves = f.groves || {};
    var list = f.groves[grove] = f.groves[grove] || [];
    // Nearest free spot to the grove's seed, with a little jitter so the edge stays ragged.
    var best = -1, bd = 1e9;
    for (var i = 0; i < FOREST.length; i++) {
      if (f.used[i]) continue;
      var p = FOREST[i], d = Math.hypot(p.x - G.seed.x, p.z - G.seed.z) + ((i * 2654435761) % 1000) / 1000 * 2.5;
      if (d < bd) { bd = d; best = i; }
    }
    if (best < 0) {
      // The forest is full: the next tree goes in the wild woods, in order outwards from it.
      f.wild = f.wild || 0;
      if (f.wild < WILD.length) { var w = WILD[f.wild++]; var tw = this.plantTree(w, kind, 3000 + f.wild, delay, 'run', size); f.trees.push(tw); list.push({ g: tw, size: size }); return tw; }
    }
    if (best >= 0) {
      f.used[best] = true;
      var t = this.plantTree(FOREST[best], kind, best, delay, 'run', size);
      f.trees.push(t);
      list.push({ g: t, size: size });
      return t;
    } else {
      // Full: the smallest tree in this grove (or anywhere) grows a little.
      var pool = list.length ? list : [].concat.apply([], Object.keys(f.groves).map(function (k) { return f.groves[k]; }));
      var small = pool.reduce(function (m, x) { return !m || x.size < m.size ? x : m; }, null);
      if (small && small.size < 2) { small.size = Math.min(2, small.size + 0.15); this.animScale(small.g, small.size, delay); }
    }
  };
  Town.prototype.plantTree = function (p, kind, k, delay, pick, size) {
    var g = new T.Group(), r = rng(77 + k), s = 0.8 + r() * 0.35, self = this;
    pick = pick || 'run';
    g.position.set(p.x, groundY(p.x, p.z), p.z);
    g.rotation.y = r() * 6.28;
    function part(geo, mat, sx, sy, sz, x, y, z) { return self.part(g, geo, mat, sx, sy, sz, x, y, z, pick); }
    if (kind === 'spruce') {
      part(this.geo.cyl6, this.mat('trunk'), 0.13 * s, 0.9 * s, 0.13 * s, 0, 0.45 * s, 0);
      part(this.geo.cone6, this.mat('pine'), 0.85 * s, 1.2 * s, 0.85 * s, 0, 1.0 * s, 0);
      part(this.geo.cone6, this.mat('pine'), 0.68 * s, 1.1 * s, 0.68 * s, 0, 1.6 * s, 0);
      part(this.geo.cone6, this.mat('pine'), 0.48 * s, 1.0 * s, 0.48 * s, 0, 2.15 * s, 0);
    } else if (kind === 'bigspruce') {
      part(this.geo.cyl6, this.mat('trunk'), 0.22, 1.0, 0.22, 0, 0.5, 0);
      [[1.4, 1.6, 1.2], [1.12, 1.5, 2.0], [0.82, 1.4, 2.75], [0.5, 1.2, 3.4]].forEach(function (c) { part(self.geo.cone6, self.mat('pine'), c[0], c[1], c[0], 0, c[2], 0); });
    } else if (kind === 'birch') {
      // White trunk with dark marks, small airy crowns.
      part(this.geo.cyl6, this.mat('birch'), 0.09 * s, 1.7 * s, 0.09 * s, 0, 0.85 * s, 0);
      for (var m = 0; m < 3; m++) part(this.geo.box, this.mat('stoneDark'), 0.19 * s, 0.05, 0.05, 0, (0.4 + m * 0.4) * s, 0.05);
      part(this.geo.blob, this.mat('birchleaf'), 0.5 * s, 0.6 * s, 0.5 * s, 0.1, 1.75 * s, 0);
      part(this.geo.blob, this.mat('birchleaf'), 0.36 * s, 0.42 * s, 0.36 * s, -0.25, 1.4 * s, 0.15);
    } else if (kind === 'maple') {
      part(this.geo.cyl6, this.mat('trunk'), 0.15 * s, 0.9 * s, 0.15 * s, 0, 0.45 * s, 0);
      part(this.geo.blob, this.mat('leaf', k), 0.8 * s, 0.75 * s, 0.8 * s, 0, 1.35 * s, 0);
      part(this.geo.blob, this.mat('leaf', k + 1), 0.5 * s, 0.45 * s, 0.5 * s, 0.4 * s, 1.75 * s, 0.1);
    } else if (kind === 'bigoak') {
      part(this.geo.cyl6, this.mat('trunk'), 0.24, 1.3, 0.24, 0, 0.65, 0);
      part(this.geo.blob, this.mat('leaf', k), 1.35, 1.15, 1.35, 0, 1.95, 0);
      part(this.geo.blob, this.mat('leaf', k + 1), 0.85, 0.8, 0.85, 0.65, 2.6, 0.2);
      part(this.geo.blob, this.mat('leaf', k + 2), 0.8, 0.75, 0.8, -0.55, 2.5, -0.3);
    } else {
      // Sequoia: tall red trunk, dark crown high up.
      // A giant: thick red trunk standing well clear of the rest of the forest, crown high up.
      part(this.geo.cyl6, this.mat('redwood'), 0.42, 5.6, 0.42, 0, 2.8, 0);
      part(this.geo.cyl6, this.mat('redwood'), 0.6, 0.5, 0.6, 0, 0.25, 0);
      part(this.geo.cone6, this.mat('pine', 1), 1.35, 1.8, 1.35, 0, 5.4, 0);
      part(this.geo.cone6, this.mat('pine', 1), 1.1, 1.6, 1.1, 0, 6.5, 0);
      part(this.geo.cone6, this.mat('pine', 1), 0.8, 1.4, 0.8, 0, 7.5, 0);
      part(this.geo.cone6, this.mat('pine', 1), 0.45, 1.1, 0.45, 0, 8.4, 0);
    }
    this.world.add(g);
    // Remember where the crown is, so brushing past shakes a few leaves (or snow) loose.
    var crown = { spruce: 1.6 * s, bigspruce: 2.6, birch: 1.6 * s, maple: 1.4 * s, bigoak: 2.1 }[kind] || 5.6;
    (this.st.treeSpots = this.st.treeSpots || []).push({ x: p.x, z: p.z, y: g.position.y + crown * (size || 1), r: (kind === 'bigoak' || kind === 'bigspruce' ? 1.1 : 0.7) * (size || 1), conifer: /spruce|^seq/.test(kind) || !{ birch: 1, maple: 1, bigoak: 1 }[kind], kind: kind, k: k, at: 0 });
    if (size) { g.scale.setScalar(this.instant ? size : 0.01); this.animScale(g, size, delay); }
    else this.pop(g, delay);
    return g;
  };

  // Lays a path that belongs to something just built (a field's track, a pitch's path).
  Town.prototype.layPath = function (entry, delay) {
    if (!entry) return;
    var g = new T.Group();
    this.layTiles(entry.pts, entry.kind === 'road' ? 'cobble' : 'path', entry.kind === 'road' ? 1.4 : 0.9, g);
    if (entry.kind === 'road') lampPoints(entry.pts, 13, 1.0, 0).forEach(function (l) { this.lamp(l.x, l.z, g); }, this);
    this.world.add(g);
    if (!this.instant) { g.position.y = 6; this.anims.push({ obj: g, start: performance.now() + (delay || 0), dur: 600, from: 6, to: 0, kind: 'slide' }); }
  };

  // ---- bikes: farmland ----------------------------------------------

  // Each non-commute ride sows crops: one per 5 km, up to 20. Fields come in different sizes
  // and angles; when one is full the next is fenced and ploughed. A barn goes up with the first
  // ride and another every 8 fields. Once every field is full, rides make the crops grow bigger.
  Town.prototype.addBike = function (ev, delay) {
    var s = this.st.bike, km = ev.km || 0;
    s.longest = Math.max(s.longest, km);
    if (!s.barns.length) this.buildBarn(0, delay);
    var n = Math.max(1, Math.min(20, Math.round(km / 5)));
    for (var i = 0; i < n; i++) this.sowCrop(delay + i * 70);
    if (km >= BALLOON_KM) this.addBalloon(ev, delay + 300);
  };
  Town.prototype.sowCrop = function (delay) {
    var s = this.st.bike;
    var field = s.fields[s.fields.length - 1];
    if (!field || field.n >= field.cols * field.rows) {
      var fi = s.fields.length;
      if (fi >= FIELDS.length) {
        var c = s.crops[(s.grow = (s.grow || 0) + 1) % s.crops.length];
        if (c.scale.x < 1.8) this.animScale(c, c.scale.x + 0.12, delay);
        return;
      }
      field = this.openField(FIELDS[fi], fi, delay);
      this.layPath(PATHS.filter(function (pa) { return pa.fi === fi; })[0], delay);
      s.fields.push(field);
      if (fi > 0 && fi % 8 === 0) this.buildBarn(fi, delay + 200);
    }
    var j = field.n++, col = j % field.cols, row = Math.floor(j / field.cols);
    var lx = (col - (field.cols - 1) / 2) * FIELD_TILE, lz = (row - (field.rows - 1) / 2) * FIELD_TILE;
    var wx = field.x + field.ux * lx + field.vx * lz, wz = field.z + field.uz * lx + field.vz * lz;
    var g = new T.Group(), pick = 'bike', kind = field.kind;
    g.position.set(wx, groundY(wx, wz), wz);
    g.rotation.y = field.rot;
    this.part(g, this.geo.box, this.mat('soil'), FIELD_TILE * 0.92, 0.1, FIELD_TILE * 0.92, 0, 0.03, 0, pick);
    if (kind === 'wheat') {
      for (var q = 0; q < 4; q++) this.part(g, this.geo.cyl6, this.mat('crop', 3), 0.07, 0.55, 0.07, (q % 2 - 0.5) * 0.36, 0.33, (Math.floor(q / 2) - 0.5) * 0.36, pick);
    } else if (kind === 'pumpkin') {
      this.part(g, this.geo.ball, this.mat('crop', 0), 0.27, 0.21, 0.27, 0, 0.26, 0, pick);
      this.part(g, this.geo.blob, this.mat('leaf', 0), 0.2, 0.08, 0.2, 0.2, 0.12, 0.15, pick);
    } else if (kind === 'cabbage') {
      this.part(g, this.geo.blob, this.mat('leaf', 1), 0.24, 0.18, 0.24, 0, 0.22, 0, pick);
      this.part(g, this.geo.ball, this.mat('crop', 1), 0.12, 0.1, 0.12, 0, 0.3, 0, pick);
    } else if (kind === 'corn') {
      this.part(g, this.geo.cyl6, this.mat('leaf', 0), 0.06, 0.9, 0.06, 0, 0.5, 0, pick);
      this.part(g, this.geo.cyl6, this.mat('crop', 3), 0.07, 0.22, 0.07, 0.07, 0.7, 0, pick);
      this.part(g, this.geo.cone6, this.mat('leaf', 2), 0.16, 0.4, 0.16, 0, 0.85, 0, pick);
    } else {
      this.part(g, this.geo.cyl6, this.mat('leaf', 0), 0.04, 0.85, 0.04, 0, 0.45, 0, pick);
      this.part(g, this.geo.cyl, this.mat('crop', 3), 0.17, 0.05, 0.17, 0, 0.9, 0.03, pick).rotation.x = 1.2;
      this.part(g, this.geo.cyl, this.mat('trunk'), 0.08, 0.06, 0.08, 0, 0.9, 0.05, pick).rotation.x = 1.2;
    }
    this.world.add(g);
    s.crops.push(g);
    this.pop(g, delay);
  };
  // A new field, fenced with a gate on the side facing town.
  Town.prototype.openField = function (spot, fi, delay) {
    var ang = spot.a * D2R + spot.tilt;
    var ux = -Math.sin(ang), uz = -Math.cos(ang), vx = Math.cos(ang), vz = -Math.sin(ang);
    var f = { x: spot.x, z: spot.z, ux: ux, uz: uz, vx: vx, vz: vz, rot: Math.atan2(vx, vz), cols: spot.cols, rows: spot.rows, n: 0, kind: CROP_KINDS[fi % CROP_KINDS.length] };
    var w = spot.cols * FIELD_TILE + 0.5, d = spot.rows * FIELD_TILE + 0.5, self = this, mat = this.mat('woodLight');
    var fence = new T.Group();
    [[0, -d / 2, w, 0], [0, d / 2, w, 0], [-w / 2, 0, d, 1], [w / 2, 0, d, 1]].forEach(function (side, si) {
      var steps = Math.round(side[2] / 0.6);
      for (var i = 0; i <= steps; i++) {
        var t = i / steps - 0.5;
        if (si === 0 && Math.abs(t) < 0.12) continue;
        var lx = side[3] ? side[0] : t * side[2], lz = side[3] ? t * side[2] : side[1];
        var wx = spot.x + ux * lx + vx * lz, wz = spot.z + uz * lx + vz * lz;
        self.part(fence, self.geo.box, mat, 0.08, 0.45, 0.08, wx, groundY(wx, wz) + 0.22, wz, 'bike');
      }
      var mx = spot.x + ux * (side[3] ? side[0] : 0) + vx * (side[3] ? 0 : side[1]), mz = spot.z + uz * (side[3] ? side[0] : 0) + vz * (side[3] ? 0 : side[1]);
      self.part(fence, self.geo.box, mat, side[3] ? 0.05 : side[2], 0.06, side[3] ? side[2] : 0.05, mx, groundY(mx, mz) + 0.36, mz, 'bike').rotation.y = f.rot;
    });
    this.world.add(fence);
    this.pop(fence, delay);
    return f;
  };
  // A red barn and silo beside a field.
  Town.prototype.buildBarn = function (fi, delay) {
    // Barns stand beside the drove road, alternating sides, level with the field's row.
    var s = this.st.bike, spot = FIELDS[fi], d = 30 + spot.band * FIELD_BAND, side = s.barns.length % 2 ? 1 : -1;
    var bp = polar(FARM_SPINE + side * 1.9 / d / D2R, d), px = bp.x, pz = bp.z;
    var g = new T.Group(), pick = 'bike';
    g.position.set(px, groundY(px, pz), pz);
    g.rotation.y = Math.atan2(px, pz) + Math.PI;
    this.part(g, this.geo.box, this.mat('roofJo'), 2.0, 1.5, 1.6, 0, 0.75, 0, pick);
    this.part(g, this.geo.gable, this.mat('stoneDark'), 1.3, 1.1, 1.15, 0, 1.5, 0, pick);
    this.part(g, this.geo.box, this.mat('woodLight'), 0.9, 1.0, 0.05, 0, 0.5, 0.81, pick);
    this.part(g, this.geo.box, this.mat('woodLight'), 0.05, 1.0, 0.06, 0, 0.5, 0.84, pick).rotation.z = 0.8;
    this.part(g, this.geo.cyl, this.mat('stone', 1), 0.45, 2.6, 0.45, 1.45, 1.3, -0.2, pick);
    this.part(g, this.geo.ball, this.mat('stoneDark'), 0.46, 0.35, 0.46, 1.45, 2.6, -0.2, pick);
    this.world.add(g);
    s.barns.push(g);
    this.animDrop(g, g.position.y, delay);
  };

  // Long rides launch a hot-air balloon that drifts around the island; bigger rides, bigger balloons.
  Town.prototype.addBalloon = function (ev, delay) {
    var s = this.st.bike, k = s.balloons.length;
    if (k >= 60) { s.extra = (s.extra || 0) + 1; return; }
    var r = rng(300 + k), size = Math.min(2.2, 0.9 + ev.km / 50);
    var g = new T.Group(), pick = 'balloon:' + k, c = k % 6;
    this.part(g, this.geo.ball, this.mat('balloon', c), size, size * 1.15, size, 0, size * 1.6, 0, pick);
    this.part(g, this.geo.ball, this.mat('balloon', c + 1), size * 1.01, size * 0.35, size * 1.01, 0, size * 1.6, 0, pick);
    this.part(g, this.geo.box, this.mat('wood'), size * 0.45, size * 0.35, size * 0.45, 0, 0, 0, pick);
    [-1, 1].forEach(function (sx) { [-1, 1].forEach(function (sz) {
      this.part(g, this.geo.box, this.mat('stoneDark'), 0.03, size * 0.9, 0.03, sx * size * 0.2, size * 0.5, sz * size * 0.2);
    }, this); }, this);
    var b = { group: g, ev: ev, angle: r() * Math.PI * 2, radius: 30 + r() * 40, height: 15 + r() * 18, speed: 0.025 + r() * 0.03, bob: r() * 6 };
    g.position.set(Math.cos(b.angle) * b.radius, b.height, Math.sin(b.angle) * b.radius);
    g.traverse(function (o) { o.castShadow = false; });
    this.world.add(g);
    s.balloons.push(b);
    this.pop(g, delay);
  };

  // ---- commutes: the long bridge -------------------------------------

  // Each commute lays one cobble on the lane out to the office; once it arrives,
  // commutes park bikes there and every 20 more add a floor.
  // Which weekdays of a week (keyed by its Monday) had a commute.
  function weekOf(date) {
    var d = new Date(date + 'T12:00:00Z'), wd = (d.getUTCDay() + 6) % 7; // Monday 0 ... Sunday 6
    return { key: new Date(d.getTime() - wd * 86400000).toISOString().slice(0, 10), wd: wd };
  }
  Town.prototype.addCommute = function (km, delay, date) {
    var s = this.st.commute, k = s.n, self = this;
    s.n++; s.km += km || 10;
    // Commuting every day Monday to Friday turns that Friday's cobble gold.
    var gold = false;
    if (date) {
      var w = weekOf(date), days = (s.weeks = s.weeks || {})[w.key] = s.weeks[w.key] || {};
      days[w.wd] = true;
      if (w.wd === 4 && days[0] && days[1] && days[2] && days[3] && !days.gold) { gold = days.gold = true; s.golden = (s.golden || 0) + 1; }
    }
    if (k < LANE_STONES) {
      var p = LANE[k], y = surfaceY(p.x, p.z), onBridge = riverDist(p.x, p.z) < RIVER_HALF + 1.1;
      // Each cobble tilts with the ground between its neighbours, so the lane reads as one smooth ribbon.
      var pa = LANE[Math.max(0, k - 1)], pb = LANE[Math.min(LANE_STONES - 1, k + 1)];
      var tilt = onBridge ? 0 : Math.atan2(surfaceY(pb.x, pb.z) - surfaceY(pa.x, pa.z), Math.hypot(pb.x - pa.x, pb.z - pa.z) || 1);
      var t = this.part(this.world, this.geo.box, gold ? this.mat('gold') : onBridge ? this.mat('stone', 2) : this.mat('cobble'), LANE.spacing * 1.04, onBridge ? 0.3 : 0.12, onBridge ? 1.7 : 1.15, p.x, 0, p.z, 'commute');
      t.rotation.order = 'YZX';
      t.rotation.z = tilt;
      if (onBridge && k % 2 === 0) [-1, 1].forEach(function (sd) {
        var rail = self.part(self.world, self.geo.box, self.mat('stoneDark'), LANE.spacing * 0.95, 0.45, 0.12, p.x + Math.sin(p.rot) * sd * 0.85, 0, p.z + Math.cos(p.rot) * sd * 0.85, 'commute');
        rail.rotation.y = p.rot;
        self.animDrop(rail, y + 0.3, delay + 100, 500);
      });
      t.rotation.y = p.rot;
      this.animDrop(t, y + 0.04, delay, 500);
      if (k % 14 === 13) {
        // A lamp post every so often along the lane.
        var lamp = new T.Group();
        lamp.position.set(p.x + Math.sin(p.rot) * 0.85, 0, p.z + Math.cos(p.rot) * 0.85);
        this.part(lamp, this.geo.cyl6, this.mat('stoneDark'), 0.05, 1.4, 0.05, 0, 0.7, 0, 'commute');
        this.part(lamp, this.geo.box, this.mat('lantern'), 0.18, 0.2, 0.18, 0, 1.48, 0, 'commute');
        this.world.add(lamp);
        this.animDrop(lamp, y, delay + 120, 500);
      }
      if (k === LANE_STONES - 1) this.buildOffice(delay + 300);
      return;
    }
    if (!s.office) this.buildOffice(delay);
    var extra = k - LANE_STONES;
    if (s.bikes < 16) {
      var bk = this.bicycle(s.office, s.bikes);
      var row = Math.floor(s.bikes / 8), col = s.bikes % 8;
      bk.position.set(3.4 + row * 0.6, 0, -1.5 + col * 0.42);
      bk.rotation.y = 0;
      bk.traverse(function (o) { if (o.isMesh) { o.userData.pick = 'commute'; self.picks.push(o); } });
      this.animDrop(bk, 0, delay, 500);
      s.bikes++;
    }
    if (extra + 1 >= officeStageAt(s.stage)) this.addOfficeStage(delay + 200);
  };
  Town.prototype.bicycle = function (parent, colorIdx) {
    var b = new T.Group();
    this.part(b, this.geo.torus, this.mat('stoneDark'), 0.14, 0.14, 0.14, -0.22, 0.16, 0);
    this.part(b, this.geo.torus, this.mat('stoneDark'), 0.14, 0.14, 0.14, 0.22, 0.16, 0);
    this.part(b, this.geo.box, this.mat('flag', colorIdx), 0.42, 0.05, 0.05, 0, 0.24, 0);
    this.part(b, this.geo.box, this.mat('flag', colorIdx), 0.05, 0.16, 0.05, -0.08, 0.3, 0);
    this.part(b, this.geo.box, this.mat('wood'), 0.12, 0.03, 0.07, -0.08, 0.39, 0);
    parent.add(b);
    return b;
  };
  Town.prototype.buildOffice = function (delay) {
    var s = this.st.commute;
    if (s.office) return;
    var g = new T.Group();
    g.position.set(OFFICE.x, groundY(OFFICE.x, OFFICE.z), OFFICE.z);
    g.rotation.y = Math.atan2(-OFFICE.x, -OFFICE.z);
    this.world.add(g);
    s.office = g;
    s.stage = 0;
    var roof = new T.Group();
    this.part(roof, this.geo.gable, this.mat('roof', 4), 1.5, 0.9, 1.25, 0, 0, 0, 'commute');
    g.add(roof);
    s.roof = roof;
    this.officeFloor(delay);
  };
  var OFFICE_FH = 0.9;
  Town.prototype.officeFloor = function (delay) {
    var s = this.st.commute, FH = OFFICE_FH, floor = new T.Group();
    this.part(floor, this.geo.box, this.mat('stone', 0), 2.4, FH, 1.8, 0, FH / 2, 0, 'commute');
    this.part(floor, this.geo.box, this.mat('stone', 2), 2.48, 0.08, 1.88, 0, FH - 0.04, 0, 'commute');
    for (var w = -2; w <= 2; w++) this.part(floor, this.geo.box, this.mat('window'), 0.24, 0.42, 0.04, w * 0.46, FH * 0.5, 0.91);
    s.office.add(floor);
    this.animDrop(floor, s.floors * FH, delay);
    s.floors++;
    this.animTo(s.roof, s.floors * FH, delay + (this.instant ? 0 : 480));
    this.fitDirty = true;
  };
  // The office stays three storeys and grows grander instead: a columned portico, wings, lawns,
  // a clock tower and dome, railings, a statue, flags, a rear hall and lanterns, like an old
  // institution. Each step costs a few more commutes than the one before.
  var OFFICE_STAGES = ['Second storey', 'Third storey', 'Columned portico', 'West wing', 'East wing', 'Front lawns',
    'Clock tower', 'Gilded dome', 'Iron railings and gates', 'Founder’s statue', 'Flagpoles', 'Rear hall', 'Lanterns along the walk'];
  function officeStageAt(i) { return 20 * (i + 1) + 4 * i * (i + 1); } // commutes past the lane for stage i
  Town.prototype.addOfficeStage = function (delay) {
    var s = this.st.commute, i = s.stage, g = s.office, self = this, FH = OFFICE_FH, H = 3 * FH;
    if (i >= OFFICE_STAGES.length) return;
    s.stage++;
    if (i < 2) { this.officeFloor(delay); return; }
    var o = new T.Group();
    function P(geo, mat, sx, sy, sz, x, y, z) { return self.part(o, geo, mat, sx, sy, sz, x, y, z, 'commute'); }
    function wing(x) {
      P(self.geo.box, self.mat('stone', 0), 1.8, FH * 2, 1.5, x, FH, -0.1);
      P(self.geo.box, self.mat('stone', 2), 1.88, 0.08, 1.58, x, FH * 2, -0.1);
      for (var fl = 0; fl < 2; fl++) for (var w = -1; w <= 1; w++) P(self.geo.box, self.mat('window'), 0.22, 0.4, 0.04, x + w * 0.5, FH * (fl + 0.5), 0.66);
      P(self.geo.gable, self.mat('roof', 4), 1.0, 0.7, 1.2, x, FH * 2, -0.1).rotation.y = Math.PI / 2;
    }
    switch (i) {
      case 2: // portico: steps, six columns and a pediment
        P(this.geo.box, this.mat('stone', 2), 2.2, 0.12, 0.9, 0, 0.06, 1.3);
        P(this.geo.box, this.mat('stone', 1), 2.0, 0.12, 0.7, 0, 0.18, 1.2);
        for (var c = 0; c < 6; c++) P(this.geo.cyl, this.mat('plaster', 0), 0.09, H - 0.3, 0.09, -0.9 + c * 0.36, 0.24 + (H - 0.3) / 2, 1.3);
        P(this.geo.box, this.mat('stone', 0), 2.1, 0.16, 0.7, 0, H, 1.2);
        P(this.geo.gable, this.mat('stone', 0), 1.25, 0.6, 0.45, 0, H + 0.08, 1.2);
        P(this.geo.ball, this.mat('gold'), 0.1, 0.1, 0.03, 0, H + 0.3, 1.55);
        break;
      case 3: wing(-2.1); break;
      case 4: wing(2.1); break;
      case 5: // lawns either side of a gravel walk, edged with low hedges
        P(this.geo.box, this.mat('path'), 0.8, 0.03, 2.0, 0, 0.015, 2.6);
        [-1, 1].forEach(function (sd) {
          P(self.geo.box, self.mat('pitch'), 1.7, 0.04, 1.4, sd * 1.4, 0.02, 2.6);
          P(self.geo.box, self.mat('hedge'), 1.7, 0.18, 0.14, sd * 1.4, 0.09, 3.3);
          P(self.geo.box, self.mat('hedge'), 0.14, 0.18, 1.4, sd * 0.55, 0.09, 2.6);
          P(self.geo.blob, self.mat('hedge'), 0.2, 0.26, 0.2, sd * 2.2, 0.18, 1.95);
        });
        break;
      case 6: // clock tower rising through the roof
        P(this.geo.box, this.mat('stone', 0), 0.62, 1.0, 0.62, 0, H + 0.6, 0);
        P(this.geo.box, this.mat('stone', 2), 0.7, 0.08, 0.7, 0, H + 1.1, 0);
        [[0, 0.32, 0], [0.32, 0, Math.PI / 2], [0, -0.32, 0], [-0.32, 0, Math.PI / 2]].forEach(function (f) {
          P(self.geo.cyl, self.mat('plaster', 0), 0.18, 0.02, 0.18, f[0], H + 0.72, f[1]).rotation.set(Math.PI / 2, f[2], 0, 'YXZ');
          P(self.geo.torus, self.mat('gold'), 0.18, 0.18, 0.18, f[0], H + 0.72, f[1]).rotation.y = f[2];
        });
        s.clockCap = P(this.geo.cone4, this.mat('roof', 4), 0.5, 0.6, 0.5, 0, H + 1.45, 0);
        s.clockCap.rotation.y = Math.PI / 4;
        break;
      case 7: // the cap becomes a gilded dome and lantern
        this.retire(s.clockCap);
        P(this.geo.cyl, this.mat('stone', 0), 0.36, 0.25, 0.36, 0, H + 1.26, 0);
        P(this.geo.ball, this.mat('gold'), 0.36, 0.42, 0.36, 0, H + 1.38, 0);
        P(this.geo.cyl6, this.mat('stone', 0), 0.08, 0.25, 0.08, 0, H + 1.9, 0);
        P(this.geo.cone, this.mat('gold'), 0.06, 0.3, 0.06, 0, H + 2.15, 0);
        break;
      case 8: // railings along the front with gold-capped gate piers
        for (var x = -3.0; x <= 3.01; x += 0.25) if (Math.abs(x) > 0.5) P(this.geo.box, this.mat('stoneDark'), 0.035, 0.5, 0.035, x, 0.25, 3.5);
        [-1, 1].forEach(function (sd) {
          P(self.geo.box, self.mat('stoneDark'), 2.6, 0.04, 0.04, sd * 1.75, 0.45, 3.5);
          P(self.geo.box, self.mat('stone', 1), 0.3, 0.8, 0.3, sd * 0.55, 0.4, 3.5);
          P(self.geo.ball, self.mat('gold'), 0.1, 0.1, 0.1, sd * 0.55, 0.88, 3.5);
        });
        break;
      case 9: // founder's statue on the left lawn
        P(this.geo.box, this.mat('stone', 1), 0.5, 0.5, 0.5, -1.4, 0.25, 2.6);
        P(this.geo.box, this.mat('stone', 2), 0.58, 0.06, 0.58, -1.4, 0.52, 2.6);
        P(this.geo.cyl6, this.mat('stone', 0), 0.13, 0.55, 0.13, -1.4, 0.82, 2.6);
        P(this.geo.ball, this.mat('stone', 0), 0.11, 0.11, 0.11, -1.4, 1.2, 2.6);
        P(this.geo.box, this.mat('stone', 0), 0.06, 0.38, 0.06, -1.28, 1.15, 2.6).rotation.z = -0.6;
        P(this.geo.cyl, this.mat('stone', 2), 0.35, 0.04, 0.35, 1.4, 0.06, 2.6);
        P(this.geo.cyl, this.mat('water'), 0.3, 0.02, 0.3, 1.4, 0.09, 2.6);
        break;
      case 10: // flagpoles by the portico
        [-1.3, 1.3].forEach(function (x, k) {
          P(self.geo.cyl6, self.mat('stoneDark'), 0.03, 2.6, 0.03, x, 1.3, 1.85);
          P(self.geo.flag, self.mat('flag', k ? 2 : 0), 1.5, 1.5, 1.5, x, 2.55, 1.85);
        });
        break;
      case 11: // rear hall with a colonnade
        P(this.geo.box, this.mat('stone', 0), 2.8, FH * 2, 1.4, 0, FH, -1.75);
        P(this.geo.gable, this.mat('roof', 4), 1.75, 0.7, 0.95, 0, FH * 2, -1.75);
        for (var cc = 0; cc < 7; cc++) P(this.geo.cyl, this.mat('plaster', 0), 0.07, FH * 2, 0.07, -1.35 + cc * 0.45, FH, -2.55);
        P(this.geo.box, this.mat('stone', 2), 3.0, 0.1, 0.4, 0, FH * 2, -2.55);
        break;
      case 12: // lanterns along the walk
        [1.85, 2.6, 3.3].forEach(function (z) { [-0.55, 0.55].forEach(function (x) {
          P(self.geo.cyl6, self.mat('stoneDark'), 0.03, 0.9, 0.03, x, 0.45, z);
          P(self.geo.box, self.mat('lantern'), 0.13, 0.16, 0.13, x, 0.96, z);
        }); });
        break;
    }
    g.add(o);
    this.pop(o, delay);
    this.fitDirty = true;
  };

  // ---- rowing: the pond ----------------------------------------------

  // The pond widens with every km; at 250 km it gets a jetty and boathouse, and more boats join
  // the first one at 300, 500 and 800 km.
  var POND_BOATS = [0, 300, 500, 800];
  Town.prototype.pondRadius = function () { return 1.3 + 3.2 * (1 - Math.exp(-this.st.row.km / 250)); };
  Town.prototype.addBoat = function (delay) {
    var s = this.st.row, boat = new T.Group(), i = s.boats.length, paint = ['wood', 'roof', 'roof', 'roof'][i];
    this.part(boat, this.geo.box, this.mat(paint, i), 1.1, 0.22, 0.42, 0, 0, 0, 'row');
    this.part(boat, this.geo.box, this.mat('wood'), 0.06, 0.05, 1.4, 0, 0.14, 0, 'row');
    boat.position.set(POND.x, groundY(POND.x, POND.z) + 0.16, POND.z);
    boat.userData = { r: [0.5, 0.75, 0.3, 0.62][i], speed: [4000, -5200, 3100, -6100][i], phase: i * 1.7 };
    this.world.add(boat);
    s.boats.push(boat);
    this.pop(boat, delay);
  };
  Town.prototype.buildDock = function (delay) {
    var g = new T.Group(), py = groundY(POND.x, POND.z), home = Math.atan2(-POND.z, -POND.x) + 0.9;
    g.position.set(POND.x, py, POND.z);
    g.rotation.y = -home;
    // Jetty: planks from the shore out over the water, on posts.
    this.part(g, this.geo.box, this.mat('wood'), 2.4, 0.1, 0.8, 3.7, 0.22, 0, 'row');
    var along = { x: Math.cos(-home), z: -Math.sin(-home) }, at = function (u) { return { x: POND.x + along.x * u, z: POND.z + along.z * u }; };
    var mid = at(3.7), end = at(4.75);
    (this.st.decks = this.st.decks || []).push({ cx: mid.x, cz: mid.z, ux: along.x, uz: along.z, hl: 1.2, hw: 0.4, y: py + 0.27 });
    (this.st.seats = this.st.seats || []).push({ x: end.x, z: end.z, y: py + 0.27, rot: -home + Math.PI / 2, fish: { x: POND.x + along.x * 6.3, z: POND.z + along.z * 6.3, y: py + 0.05 }, low: true });
    for (var i = 0; i < 3; i++) for (var side = -1; side <= 1; side += 2)
      this.part(g, this.geo.cyl, this.mat('wood', 1), 0.08, 0.5, 0.08, 2.7 + i * 0.9, 0.05, side * 0.34, 'row');
    // Boathouse on the shore beside it.
    var bh = new T.Group();
    bh.position.set(6.5, 0, 1.5);
    this.part(bh, this.geo.box, this.mat('wood'), 1.8, 1.0, 1.4, 0, 0.5, 0, 'row');
    var roof = this.part(bh, this.geo.box, this.mat('roof', 2), 2.1, 0.12, 1.0, 0, 1.25, 0.35, 'row'); roof.rotation.x = 0.55;
    roof = this.part(bh, this.geo.box, this.mat('roof', 2), 2.1, 0.12, 1.0, 0, 1.25, -0.35, 'row'); roof.rotation.x = -0.55;
    this.part(bh, this.geo.box, this.mat('trunk'), 0.7, 0.6, 0.05, -0.2, 0.3, 0.71, 'row');
    g.add(bh);
    this.world.add(g);
    this.pop(g, delay);
  };
  // Rowing and paddling build the harbour on the coast.
  Town.prototype.addRow = function (delay) { this.growHarbour(delay); };

  // ---- hikes: the mountain range --------------------------------------

  // Each peak is a jagged heightfield: a main summit, a couple of shoulders and ridged crags,
  // coloured grass at the foot, grey rock above, and snow on the high faces. It grows from a
  // grassy hill to its full height; a finished peak gets a summit cairn and flag.
  function peakGeometry(seed) {
    var N = 30, g = new T.PlaneGeometry(2, 2, N, N).rotateX(-Math.PI / 2), pos = g.attributes.position, r = rng(seed);
    var subs = [];
    for (var i = 0; i < 3; i++) { var a = r() * 6.28, d = 0.3 + r() * 0.35; subs.push({ x: Math.cos(a) * d, z: Math.sin(a) * d, h: 0.45 + r() * 0.3, w: 0.35 + r() * 0.2 }); }
    var f1 = 3 + r() * 2, f2 = 6 + r() * 3, o1 = r() * 6, o2 = r() * 6, max = 0;
    for (i = 0; i < pos.count; i++) {
      var x = pos.getX(i), z = pos.getZ(i), rr = Math.hypot(x, z);
      var h = Math.pow(Math.max(0, 1 - rr), 1.35);
      subs.forEach(function (sp) { var d = Math.hypot(x - sp.x, z - sp.z); h = Math.max(h, sp.h * Math.pow(Math.max(0, 1 - d / sp.w), 1.6) * (1 - rr * 0.6)); });
      // Ridged noise for crags and gullies.
      var ridge = 1 - Math.abs(Math.sin(x * f1 + o1) * Math.cos(z * f1 * 0.8 + o2));
      var ridge2 = 1 - Math.abs(Math.sin(x * f2 - z * f2 * 0.6 + o2));
      h *= 0.72 + 0.28 * ridge * ridge + 0.12 * ridge2;
      // Past the foot the sheet dives underground so its square edge never shows on rolling ground.
      if (rr > 0.9) h = Math.min(h, -0.4 * Math.min(1, (rr - 0.9) / 0.15));
      pos.setY(i, h);
      max = Math.max(max, h);
    }
    for (i = 0; i < pos.count; i++) pos.setY(i, pos.getY(i) / max);
    g.computeVertexNormals();
    g.setAttribute('color', new T.BufferAttribute(new Float32Array(pos.count * 3), 3));
    return g;
  }
  // Colours a peak for its current height and the season's snow line.
  Town.prototype.colorPeak = function (pk) {
    var g = pk.geo, pos = g.attributes.position, nrm = g.attributes.normal, col = g.attributes.color, p = this.palette;
    var rock = new T.Color(p.rock), rock2 = new T.Color(p.rock).multiplyScalar(0.82), snow = new T.Color(p.snow), grass = new T.Color(p.grassDeep), c = new T.Color();
    var H = pk.h, snowFrom = Math.max(4.5, H * SEASONS[this.season].snowLine);
    for (var i = 0; i < pos.count; i++) {
      var y = pos.getY(i) * H, ny = nrm.getY(i), n = Math.sin(pos.getX(i) * 17 + pos.getZ(i) * 13);
      if (y < 0.9 + n * 0.25 || H < 2.6) c.copy(grass);
      else if (y > snowFrom + n * 0.5 && ny > 0.35) c.copy(snow);
      else c.copy(n > 0 ? rock : rock2);
      col.setXYZ(i, c.r, c.g, c.b);
    }
    col.needsUpdate = true;
  };
  Town.prototype.peakCost = function (i) { return PEAKS[i].h * 0.9; };
  Town.prototype.addClimb = function (units, delay) {
    var s = this.st.hike, self = this, start = 0;
    s.units += units;
    PEAKS.forEach(function (def, i) {
      var cost = self.peakCost(i), frac = Math.max(0, Math.min(1, (s.units - start) / cost));
      start += cost * 0.7;
      if (frac <= 0) return;
      var pk = s.peaks[i] || (s.peaks[i] = self.makePeak(def, i));
      var h = PEAK_START + (def.h - PEAK_START) * Math.pow(frac, 0.85);
      if (Math.abs(h - pk.h) < 0.001) return;
      pk.h = h;
      var R = Math.max(2.4, h * 0.85 + 1.8);
      self.animScaleVec(pk.group, new T.Vector3(R * def.sx, h, R * def.sz), delay);
      self.colorPeak(pk);
      if (frac >= 1 && !pk.done) { pk.done = true; self.buildCairn(pk, i, delay + 800); }
    });
    this.fitDirty = true;
  };
  Town.prototype.makePeak = function (def, i) {
    var g = new T.Group(), geo = peakGeometry(4000 + i * 17);
    g.position.set(def.x, groundY(def.x, def.z) - 0.4, def.z);
    g.rotation.y = def.rot;
    g.scale.set(0.01, 0.01, 0.01);
    var mesh = new T.Mesh(geo, this.mat('peak'));
    mesh.castShadow = mesh.receiveShadow = true; mesh.userData.pick = 'hike';
    this.picks.push(mesh);
    g.add(mesh);
    this.world.add(g);
    return { group: g, mesh: mesh, geo: geo, h: 0.01, def: def };
  };
  // A summit cairn with a flag for every finished peak.
  Town.prototype.buildCairn = function (pk, i, delay) {
    var def = pk.def, top = groundY(def.x, def.z) - 0.4 + pk.h, c = new T.Group(), pick = 'hike', self = this;
    c.position.set(def.x, top - 0.1, def.z);
    [[0, 0, 0, 0.34], [0.3, 0, 0.1, 0.24], [-0.25, 0, 0.2, 0.24], [0.05, 0, -0.3, 0.24], [0.05, 0.3, 0.02, 0.26], [-0.05, 0.56, 0, 0.2], [0.02, 0.78, 0.02, 0.15]].forEach(function (st, k) {
      var m = self.part(c, self.geo.blob, self.mat('stone', k % 3), st[3] * 1.3, st[3] * 0.75, st[3] * 1.1, st[0], st[1] + st[3] * 0.4, st[2], pick);
      m.rotation.y = k * 1.7;
    });
    this.part(c, this.geo.cyl6, this.mat('wood'), 0.035, 1.3, 0.035, 0, 1.4, 0, pick);
    this.part(c, this.geo.flag, this.mat('flag', i), 2.0, 2.0, 2.0, 0, 2.0, 0, pick);
    this.world.add(c);
    pk.cairn = c;
    this.pop(c, delay);
  };
  Town.prototype.updateSnow = function () {
    var self = this;
    this.st.hike.peaks.forEach(function (pk) { if (pk) self.colorPeak(pk); });
    this.needsRender = true;
  };

  // ---- walks, sports, farm, friends, pub, statue ----------------------

  Town.prototype.addWalk = function (km, delay) {
    var s = this.st.walk;
    var n = Math.max(1, Math.min(6, Math.round(km)));
    for (var i = 0; i < n; i++) {
      var r = rng(500 + s.stones);
      var p = polar(198 + r() * 76, 9 + r() * 10);
      var sz = 0.22 + r() * 0.12;
      var st = this.part(this.world, this.geo.cyl6, this.mat('stone', s.stones % 3), sz, 0.07, sz * 0.85, p.x, 0, p.z, 'walk');
      this.animDrop(st, groundY(p.x, p.z) + 0.035, delay + i * 60, 450);
      s.stones++;
    }
  };

  Town.prototype.addSport = function (name, delay) {
    var sp = this.st.sports[name];
    if (!sp) {
      var others = this.st.sportOrder.filter(function (n) { return n !== 'Hockey'; }).length, extra = name !== 'Hockey' && others >= SPORT_SLOTS.length;
      var slot = name === 'Hockey' ? [132, 27] : SPORT_SLOTS[others % SPORT_SLOTS.length];
      // Past the eight fields by the castle, new sports find open ground further out.
      var p = extra ? this.secretSpot(80 + (others - SPORT_SLOTS.length) * 9, 38, 3.4) : polar(slot[0], slot[1]);
      if (extra) this.st.secretPos['sport:' + name] = p;
      var g = new T.Group();
      g.position.set(p.x, groundY(p.x, p.z), p.z);
      g.rotation.y = extra ? Math.atan2(p.x, p.z) + Math.PI / 2 : -(slot[0] - 90) * D2R;
      this.world.add(g);
      sp = this.st.sports[name] = { group: g, n: 0 };
      var si = others % SPORT_SLOTS.length;
      if (name === 'Hockey') this.retire(this.st.rinkSign);
      else if (!extra) this.layPath(PATHS.filter(function (pa) { return pa.sport === si; })[0], delay);
      this.st.sportOrder.push(name);
      this.buildPad(name, g);
      this.pop(g, delay);
    }
    if (sp.n < 22) {
      var k = sp.n, per = 11, side = k < per ? 1 : -1;
      var fl = new T.Group();
      fl.position.set(((k % per) / (per - 1) - 0.5) * 3.4, 0, side * 1.45);
      this.part(fl, this.geo.cyl6, this.mat('wood'), 0.03, 0.8, 0.03, 0, 0.4, 0, 'sport:' + name);
      this.part(fl, this.geo.flag, this.mat('flag', k), 0.8, 0.8, 0.8, 0, 0.8, 0, 'sport:' + name);
      sp.group.add(fl);
      this.animDrop(fl, 0, delay + 200, 500);
    } else this.stadiumStep(name, sp, sp.n - 22, delay);
    sp.n++;
  };
  // Once a field has all 22 pennants, each game builds it toward a stadium: stands, floodlights,
  // an upper tier, a scoreboard, then roofs over the stands. After that the crowd fills in.
  var STADIUM_STAGES = ['Stands', 'Floodlights', 'Upper tier', 'Scoreboard', 'Roofed stands', 'Crowd'];
  Town.prototype.stadiumStep = function (name, sp, k, delay) {
    var g = sp.group, pick = 'sport:' + name, self = this, piece = new T.Group();
    function part(geo, mat, sx, sy, sz, x, y, z) { return self.part(piece, geo, mat, sx, sy, sz, x, y, z, pick); }
    var xs = [-1.35, -0.45, 0.45, 1.35];
    if (k < 8) {                         // lower stands, a section at a time
      var side = k < 4 ? 1 : -1, x = xs[k % 4];
      for (var t = 0; t < 3; t++) part(this.geo.box, this.mat('stone', t), 0.86, 0.22 + t * 0.22, 0.34, x, (0.22 + t * 0.22) / 2, side * (1.95 + t * 0.34));
      for (var q = 0; q < 4; q++) part(this.geo.box, this.mat('flag', k + q), 0.1, 0.14, 0.1, x - 0.3 + q * 0.2, 0.3 + (q % 3) * 0.22, side * (1.95 + (q % 3) * 0.34));
      sp.stage = 0;
    } else if (k < 12) {                 // floodlights at the corners
      var c = [[-2.1, 2.7], [2.1, 2.7], [-2.1, -2.7], [2.1, -2.7]][k - 8];
      part(this.geo.cyl6, this.mat('stoneDark'), 0.06, 3.4, 0.06, c[0], 1.7, c[1]);
      part(this.geo.box, this.mat('lantern'), 0.5, 0.3, 0.12, c[0], 3.45, c[1]);
      sp.stage = 1;
    } else if (k < 20) {                 // upper tier behind the lower stands
      var side2 = k < 16 ? 1 : -1, x2 = xs[(k - 12) % 4];
      part(this.geo.box, this.mat('stone', 2), 0.86, 1.2, 0.5, x2, 0.6, side2 * 3.2);
      part(this.geo.box, this.mat('stone', 1), 0.86, 0.3, 0.4, x2, 1.35, side2 * 3.05);
      sp.stage = 2;
    } else if (k === 20) {               // scoreboard at one end
      part(this.geo.box, this.mat('stoneDark'), 0.12, 1.6, 0.12, 2.4, 0.8, 0);
      part(this.geo.box, this.mat('stoneDark'), 0.15, 0.7, 1.3, 2.4, 1.9, 0);
      part(this.geo.box, this.mat('window'), 0.17, 0.5, 1.1, 2.4, 1.9, 0);
      sp.stage = 3;
    } else if (k < 25) {                 // roofs over the stands
      var side3 = k < 23 ? 1 : -1, half = (k - 21) % 2 ? 0.9 : -0.9;
      var roof = part(this.geo.box, this.mat('roof', 2), 1.8, 0.08, 1.5, half, 2.0, side3 * 2.9);
      roof.rotation.x = side3 * 0.15;
      part(this.geo.cyl6, this.mat('stoneDark'), 0.05, 2.0, 0.05, half, 1.0, side3 * 3.55);
      sp.stage = 4;
    } else if (k < 60) {                 // the crowd keeps growing
      var r = rng(70 + k), sd = r() < 0.5 ? 1 : -1;
      part(this.geo.box, this.mat('flag', k), 0.1, 0.14, 0.1, (r() - 0.5) * 3.2, 0.3 + Math.floor(r() * 3) * 0.22, sd * (1.95 + Math.floor(r() * 3) * 0.34));
      sp.stage = 5;
    } else return;
    g.add(piece);
    this.pop(piece, delay);
  };
  Town.prototype.buildPad = function (name, g) {
    var self = this, pick = 'sport:' + name, L = this.mat('line');
    function part(geo, mat, sx, sy, sz, x, y, z) { return self.part(g, geo, mat, sx, sy, sz, x, y, z, pick); }
    if (name === 'Basketball') {
      part(this.geo.box, this.mat('court'), 3.4, 0.1, 2.1, 0, 0.05, 0);
      part(this.geo.box, L, 0.05, 0.02, 2.1, 0, 0.11, 0);
      [-1, 1].forEach(function (s) {
        part(self.geo.cyl6, self.mat('stoneDark'), 0.05, 1.3, 0.05, s * 1.6, 0.65, 0);
        part(self.geo.box, L, 0.05, 0.4, 0.6, s * 1.55, 1.3, 0);
        part(self.geo.torus, self.mat('flag', 4), 0.16, 0.16, 0.16, s * 1.38, 1.18, 0).rotation.x = Math.PI / 2;
      });
    } else if (name === 'Hockey') {
      part(this.geo.box, this.mat('ice'), 3.4, 0.08, 2, 0, 0.04, 0);
      part(this.geo.box, this.mat('flag', 0), 0.05, 0.02, 2, 0, 0.09, 0);
      [[0, 1.02, 3.4, 0.08], [0, -1.02, 3.4, 0.08], [1.72, 0, 0.08, 2.1], [-1.72, 0, 0.08, 2.1]].forEach(function (b) {
        part(self.geo.box, self.mat('woodLight'), b[2], 0.25, b[3], b[0], 0.12, b[1]);
      });
    } else if (name === 'Futsal') {
      part(this.geo.box, this.mat('pitch'), 3.4, 0.08, 2.1, 0, 0.04, 0);
      part(this.geo.box, L, 0.05, 0.02, 2.1, 0, 0.09, 0);
      [-1, 1].forEach(function (s) {
        part(self.geo.box, L, 0.06, 0.5, 0.06, s * 1.65, 0.25, 0.4);
        part(self.geo.box, L, 0.06, 0.5, 0.06, s * 1.65, 0.25, -0.4);
        part(self.geo.box, L, 0.06, 0.06, 0.86, s * 1.65, 0.5, 0);
      });
    } else if (name === 'Climbing') {
      part(this.geo.blob, this.mat('stoneDark'), 1.3, 1.6, 1.0, 0, 1.0, 0).rotation.y = 0.5;
      for (var i = 0; i < 9; i++) part(this.geo.blob, this.mat('flag', i), 0.09, 0.09, 0.09, Math.sin(i * 2.1) * 0.9, 0.4 + i * 0.22, 0.9 - Math.abs(Math.sin(i * 2.1)) * 0.3);
    } else if (/tennis|pickle|badminton|squash|racquet/i.test(name)) {
      // A court with white lines and a net across the middle.
      part(this.geo.box, this.mat(/tennis|pickle/i.test(name) ? 'pitch' : 'court'), 3.4, 0.08, 2.0, 0, 0.04, 0);
      [-0.95, 0.95].forEach(function (z) { part(self.geo.box, L, 3.3, 0.02, 0.05, 0, 0.09, z); });
      [-1.6, 1.6].forEach(function (x) { part(self.geo.box, L, 0.05, 0.02, 1.9, x, 0.09, 0); });
      part(this.geo.box, L, 0.05, 0.02, 1.9, 0, 0.09, 0);
      part(this.geo.box, this.mat('stoneDark'), 0.03, 0.45, 2.1, 0, 0.3, 0);
      part(this.geo.box, L, 0.04, 0.05, 2.1, 0, 0.52, 0);
    } else if (/volley/i.test(name)) {
      part(this.geo.box, this.mat('sand'), 3.4, 0.08, 2.0, 0, 0.04, 0);
      [-1.05, 1.05].forEach(function (z) { part(self.geo.cyl6, self.mat('wood'), 0.05, 1.2, 0.05, 0, 0.6, z); });
      part(this.geo.box, L, 0.03, 0.3, 2.1, 0, 0.95, 0);
      part(this.geo.ball, this.mat('flag', 1), 0.12, 0.12, 0.12, 0.8, 0.2, 0.3);
    } else if (/golf/i.test(name)) {
      part(this.geo.blob, this.mat('pitch'), 1.9, 0.12, 1.3, 0, 0.02, 0);
      part(this.geo.blob, this.mat('sand'), 0.6, 0.1, 0.4, 1.2, 0.03, 0.6);
      part(this.geo.cyl, this.mat('stoneDark'), 0.08, 0.04, 0.08, -0.3, 0.12, 0);
      part(this.geo.cyl6, L, 0.025, 1.2, 0.025, -0.3, 0.7, 0);
      part(this.geo.flag, this.mat('flag', 0), 1.0, 1.0, 1.0, -0.3, 1.3, 0);
    } else if (/skat|curling/i.test(name)) {
      part(this.geo.cyl, this.mat('ice'), 1.7, 0.08, 1.1, 0, 0.04, 0);
      part(this.geo.torus, this.mat('woodLight'), 1.7, 1.7, 1.1, 0, 0.1, 0).rotation.x = Math.PI / 2;
      if (/curling/i.test(name)) [0.5, 0.2, 0.05].forEach(function (r, i) { part(self.geo.cyl, self.mat('flag', [2, 0, 1][i]), r, 0.02, r, 1.0, 0.1 + i * 0.005, 0); });
    } else {
      part(this.geo.box, this.mat('sand'), 3.2, 0.06, 2, 0, 0.03, 0);
      part(this.geo.cyl6, this.mat('stoneDark'), 0.06, 1.2, 0.06, 0, 0.6, 0);
      part(this.geo.cyl, this.mat('flag', 2), 0.35, 0.08, 0.35, 0, 1.2, 0);
    }
  };

  // Pilates, stretching and mobility plant a flower bed in the garden by the gate: rows grow outward, then the flowers get bigger.
  Town.prototype.addCrop = function (delay) {
    var f = this.st.farm, k = f.crops.length, cap = FARM.cols * FARM.rows;
    if (!f.field) {
      var g = new T.Group(), p = polar(FARM.angle, FARM.r), c = polar(FARM.angle, FARM.r + 3.2);
      g.position.set(p.x, groundY(c.x, c.z), p.z);
      g.rotation.y = Math.atan2(p.x, p.z);
      this.world.add(g);
      f.field = g;
      this.pop(g, delay);
    }
    if (k >= cap) {
      var c = f.crops[(f.grow = (f.grow || 0) + 1) % cap];
      if (c.scale.x < 1.9) this.animScale(c, c.scale.x + 0.15, delay);
      f.crops.push(null);
      return;
    }
    var col = k % FARM.cols, row = Math.floor(k / FARM.cols);
    var x = (col - (FARM.cols - 1) / 2) * 0.85, z = row * 0.85;
    var plot = new T.Group();
    plot.position.set(x, 0, z);
    this.part(plot, this.geo.box, this.mat('soil'), 0.72, 0.08, 0.72, 0, 0.04, 0, 'farm');
    // A bed of flowers: three blooms in one colour on short stems.
    for (var q = 0; q < 3; q++) {
      var fx = (q - 1) * 0.2, fz = (q % 2) * 0.16 - 0.08;
      this.part(plot, this.geo.cyl6, this.mat('leaf', 0), 0.025, 0.3, 0.025, fx, 0.2, fz, 'farm');
      this.part(plot, this.geo.ball, this.mat('flag', k), 0.09, 0.07, 0.09, fx, 0.37, fz, 'farm');
    }
    this.part(plot, this.geo.blob, this.mat('leaf', 1), 0.22, 0.08, 0.22, 0, 0.1, 0, 'farm');
    f.field.add(plot);
    f.crops.push(plot);
    this.pop(plot, delay);
    // A fence frames the planted rows and stretches as they grow.
    this.fenceField();
  };
  Town.prototype.fenceField = function () {
    var f = this.st.farm, rows = Math.min(FARM.rows, Math.ceil(f.crops.filter(Boolean).length / FARM.cols));
    if (f.fenceRows === rows) return;
    if (f.fence) f.field.remove(f.fence);
    var g = new T.Group(), w = FARM.cols * 0.85 + 0.3, d = rows * 0.85 + 0.3, x0 = -w / 2, z0 = -0.6;
    var mat = this.mat('woodLight'), self = this;
    function rail(x, z, len, along) {
      var r = self.part(g, self.geo.box, mat, along ? len : 0.05, 0.06, along ? 0.05 : len, x, 0.3, z, 'farm');
      self.part(g, self.geo.box, mat, along ? len : 0.05, 0.06, along ? 0.05 : len, x, 0.15, z, 'farm');
      return r;
    }
    rail(0, z0 + d, w, true);
    rail(x0, z0 + d / 2, d, false); rail(-x0, z0 + d / 2, d, false);
    rail(x0 / 2 - 0.35, z0, w / 2 - 0.7, true); rail(-x0 / 2 + 0.35, z0, w / 2 - 0.7, true);
    [[x0, z0], [-x0, z0], [x0, z0 + d], [-x0, z0 + d]].forEach(function (c) { self.part(g, self.geo.box, mat, 0.1, 0.42, 0.1, c[0], 0.21, c[1], 'farm'); });
    f.field.add(g);
    f.fence = g; f.fenceRows = rows;
  };

  // Jo's place: an English cottage on the village green, with a big walled-in garden that fills in
  // the more you train together. Her gate faces the path from the square.
  // The house grows (a porch, a two-storey cross wing, a side wing, rooms over it) and new garden
  // beds keep filling the open corners of the yard until it's all garden.
  var JO_BEDS = [[16, 'A rose bed', 'rose', -3.3, -1.0], [23, 'A lavender bed', 'lavender', 1.5, 1.4], [29, 'A tulip bed', 'tulip', -1.8, 1.1],
    [34, 'A herb garden', 'herb', -3.3, 0.3], [41, 'A sunflower patch', 'sunflower', 1.5, 2.8], [48, 'A cutting garden', 'cutting', 2.2, -3.6],
    [56, 'A strawberry bed', 'veg', -1.5, -3.8], [64, 'A foxglove corner', 'foxglove', -4.5, 3.5], [74, 'A peony bed', 'rose', -4.6, -2.2],
    [86, 'A pumpkin patch', 'pumpkin', 4.7, 1.3], [98, 'A wildflower strip', 'cutting', -2.4, 3.9]];
  var JO_STAGES = [[1, 'A thatched cottage'], [3, 'Window boxes'], [5, 'Roses round the door'], [8, 'A white picket fence and gate'], [11, 'A flagstone path'],
    [15, 'Cottage flower borders'], [18, 'A thatched porch'], [20, 'Hollyhocks along the wall'], [26, 'A vegetable garden'], [32, 'An apple tree'], [38, 'A bench under the window'],
    [45, 'A bird bath'], [52, 'Dormer windows in the thatch'], [60, 'A potting shed'], [70, 'A lily pond'], [75, 'A two-storey cross wing'], [80, 'Beehives and wildflowers'],
    [92, 'The garden gazebo'], [105, 'A rose arch over the gate'], [120, 'A side wing and glasshouse'], [135, 'Lanterns along the path'], [150, 'A dovecote'],
    [170, 'Rooms over the side wing']].concat(JO_BEDS.map(function (b) { return [b[0], b[1]]; })).sort(function (x, y) { return x[0] - y[0]; });
  var JO_PLOT = (function () {
    var end = polar(angleOf(POND.x, POND.z) + 4, Math.hypot(POND.x, POND.z) - 5.5);
    return { x: POND.x, z: POND.z, face: Math.atan2(end.x - POND.x, end.z - POND.z) };
  })();
  function isJo(name) { return /^jo$/i.test(name); }
  Town.prototype.growCottage = function (f, name, delay) {
    var n = f.n, g = f.group, pick = 'friend:' + name, self = this, b = f.built;
    function at(x, z) { return self.localGround(g, x, z); }
    function stage(key, need, fn) {
      if (n < need || b[key]) return;
      b[key] = true;
      var o = new T.Group(); g.add(o);
      var P = function (geo, mat, sx, sy, sz, x, y, z) { return self.part(o, geo, mat, sx, sy, sz, x, y, z, pick); };
      fn(o, P);
      if (!self.instant) self.pop(o, delay + 150);
    }
    var hz = -1.3; // the cottage sits towards the back of the plot
    var thatch = this.mat('holdRoof', 0), walls = this.mat('plaster', 0), door = this.mat('roofJo');
    stage('cottage', 1, function (o, P) {
      P(self.geo.box, self.mat('holdStone', 1), 2.9, 0.2, 1.9, 0, 0.1, hz);
      P(self.geo.box, walls, 2.7, 1.25, 1.7, 0, 0.72, hz);
      // A deep golden thatch with a chunky ridge, hanging well past the walls.
      P(self.geo.gable, thatch, 1.9, 1.55, 1.35, 0, 1.33, hz);
      P(self.geo.box, self.mat('holdRoof', 1), 0.42, 0.22, 2.06, 0, 2.47, hz).rotation.z = Math.PI / 4;
      P(self.geo.box, self.mat('holdRoof', 1), 3.3, 0.14, 2.1, 0, 1.36, hz);
      // A stone chimney at the end.
      P(self.geo.box, self.mat('holdStone', 2), 0.42, 2.9, 0.5, 1.2, 1.45, hz - 0.2);
      P(self.geo.box, self.mat('holdStone', 0), 0.5, 0.12, 0.58, 1.2, 2.94, hz - 0.2);
      var chim = new T.Object3D(); chim.position.set(1.2 - 0.4, 3.0 - 0.85, hz - 0.2 + 0.3); g.add(chim); f.roof = chim;
      // Red door, small white-framed windows.
      P(self.geo.box, door, 0.5, 0.85, 0.05, 0, 0.55, hz + 0.86);
      P(self.geo.ball, self.mat('gold'), 0.04, 0.04, 0.04, 0.16, 0.55, hz + 0.9);
      [-0.85, 0.85].forEach(function (x) {
        P(self.geo.box, self.mat('whitewood'), 0.5, 0.44, 0.04, x, 0.85, hz + 0.86);
        P(self.geo.box, self.mat('window'), 0.4, 0.34, 0.05, x, 0.85, hz + 0.87);
        P(self.geo.box, self.mat('whitewood'), 0.04, 0.34, 0.06, x, 0.85, hz + 0.88);
      });
      P(self.geo.box, self.mat('stone', 1), 0.7, 0.08, 0.35, 0, 0.04, hz + 1.05);
      f.floors = 2;
    });
    stage('boxes', 3, function (o, P) {
      [-0.85, 0.85].forEach(function (x, xi) {
        P(self.geo.box, self.mat('wood'), 0.52, 0.1, 0.14, x, 0.6, hz + 0.93);
        for (var i = 0; i < 4; i++) P(self.geo.ball, self.mat('flag', (i + xi) % 5), 0.06, 0.06, 0.06, x - 0.18 + i * 0.12, 0.69, hz + 0.93);
      });
    });
    stage('roses', 5, function (o, P) {
      for (var i = 0; i < 11; i++) {
        var a = i / 10 * Math.PI, x = Math.cos(a) * 0.38, y = 0.15 + Math.sin(a) * 1.0;
        P(self.geo.blob, self.mat('houseplant', i), 0.09, 0.1, 0.06, x, y, hz + 0.9);
        if (i % 2 === 0) P(self.geo.ball, self.mat('flag', i % 4 ? 0 : 4), 0.05, 0.05, 0.05, x, y + 0.05, hz + 0.94);
      }
    });
    stage('fence', 8, function (o, P) {
      var X = 5.2, Z0 = -4.4, Z1 = 4.6, pick2 = self.mat('whitewood');
      function run(x0, z0, x1, z1) {
        var len = Math.hypot(x1 - x0, z1 - z0), steps = Math.round(len / 0.36);
        for (var i = 0; i <= steps; i++) {
          var t = i / steps, x = x0 + (x1 - x0) * t, z = z0 + (z1 - z0) * t;
          if (z === Z1 && Math.abs(x) < 0.65) continue; // the gate gap
          var y = at(x, z), pk = P(self.geo.box, pick2, 0.07, 0.5, 0.07, x, y + 0.25, z);
          P(self.geo.cone4, pick2, 0.06, 0.1, 0.06, x, y + 0.55, z).rotation.y = Math.PI / 4;
        }
        // Two rails.
        var mx = (x0 + x1) / 2, mz = (z0 + z1) / 2, my = at(mx, mz), ang = Math.atan2(x1 - x0, z1 - z0);
        [0.18, 0.38].forEach(function (ry) { if (z0 === Z1 && z1 === Z1) return; P(self.geo.box, pick2, 0.04, 0.05, len, mx, my + ry, mz).rotation.y = ang; });
      }
      run(-X, Z0, X, Z0); run(-X, Z0, -X, Z1); run(X, Z0, X, Z1);
      run(-X, Z1, -0.65, Z1); run(0.65, Z1, X, Z1);
      [[-X, -0.65], [0.65, X]].forEach(function (seg) { var mx = (seg[0] + seg[1]) / 2, len = seg[1] - seg[0], my = at(mx, Z1); [0.18, 0.38].forEach(function (ry) { P(self.geo.box, pick2, len, 0.05, 0.04, mx, my + ry, Z1); }); });
      // The gate, standing open.
      [-0.65, 0.65].forEach(function (x) { P(self.geo.box, pick2, 0.12, 0.7, 0.12, x, at(x, Z1) + 0.35, Z1); });
      var gate = P(self.geo.box, pick2, 0.6, 0.42, 0.04, -0.35, at(-0.6, Z1) + 0.28, Z1 + 0.3); gate.rotation.y = 1.2;
    });
    stage('path', 11, function (o, P) {
      for (var z = hz + 1.3, i = 0; z < 4.6; z += 0.55, i++) P(self.geo.box, self.mat('stone', i % 3), 0.55 + (i % 2) * 0.1, 0.05, 0.42, (i % 2 ? 0.08 : -0.06), at(0, z) + 0.03, z).rotation.y = (i % 3 - 1) * 0.12;
    });
    stage('borders', 15, function (o, P) {
      [[-4.8, -0.95], [0.95, 4.8]].forEach(function (seg) {
        for (var x = seg[0], i = 0; x <= seg[1]; x += 0.32, i++) {
          var z = 4.1 + (i % 2) * 0.18, y = at(x, z);
          P(self.geo.blob, self.mat('houseplant', i), 0.16, 0.14, 0.16, x, y + 0.1, z);
          P(self.geo.ball, self.mat('flag', (i * 3) % 5), 0.06, 0.06, 0.06, x, y + 0.26, z);
          if (i % 3 === 0) P(self.geo.ball, self.mat('plaster', 0), 0.05, 0.05, 0.05, x + 0.1, y + 0.22, z - 0.08);
        }
      });
    });
    stage('hollyhocks', 20, function (o, P) {
      [-1.25, -0.5, 0.5, 1.25].forEach(function (x, i) {
        P(self.geo.cyl6, self.mat('houseplant', 1), 0.025, 1.1, 0.025, x, 0.55, hz + 1.0);
        for (var k = 0; k < 5; k++) P(self.geo.ball, self.mat('flag', [0, 4, 1, 0][i]), 0.06 - k * 0.006, 0.06 - k * 0.006, 0.06, x, 0.55 + k * 0.13, hz + 1.03);
      });
    });
    stage('veg', 26, function (o, P) {
      [[-3.4, -3.3], [-3.4, -2.2], [-2.3, -3.3]].forEach(function (bd, i) {
        var y = at(bd[0], bd[1]);
        P(self.geo.box, self.mat('wood'), 0.9, 0.18, 0.75, bd[0], y + 0.09, bd[1]);
        P(self.geo.box, self.mat('soil'), 0.82, 0.04, 0.67, bd[0], y + 0.19, bd[1]);
        for (var c = 0; c < 6; c++) P(i === 1 && c % 2 ? self.geo.ball : self.geo.blob, i === 1 && c % 2 ? self.mat('crop', 0) : self.mat('houseplant', c), 0.09, 0.08, 0.09, bd[0] - 0.27 + (c % 3) * 0.27, y + 0.26, bd[1] - 0.15 + Math.floor(c / 3) * 0.3);
      });
    });
    stage('apple', 32, function (o, P) {
      var x = 3.5, z = 0.4, y = at(x, z);
      P(self.geo.cyl6, self.mat('trunk'), 0.12, 1.0, 0.12, x, y + 0.5, z);
      P(self.geo.blob, self.mat('houseplant', 0), 0.85, 0.7, 0.85, x, y + 1.35, z);
      P(self.geo.blob, self.mat('houseplant', 2), 0.55, 0.45, 0.55, x + 0.35, y + 1.7, z - 0.2);
      [[0.6, 1.2, 0.3], [-0.5, 1.3, 0.4], [0.2, 1.1, -0.65], [-0.3, 1.6, -0.4], [0.7, 1.5, -0.2], [0.1, 1.2, 0.75]].forEach(function (a) { P(self.geo.ball, self.mat('flag', 0), 0.07, 0.07, 0.07, x + a[0], y + a[1], z + a[2]); });
    });
    stage('bench', 38, function (o, P) {
      P(self.geo.box, self.mat('whitewood'), 0.9, 0.06, 0.3, 1.9, 0.38, hz + 1.25);
      P(self.geo.box, self.mat('whitewood'), 0.9, 0.3, 0.05, 1.9, 0.56, hz + 1.1);
      [1.5, 2.3].forEach(function (x) { P(self.geo.box, self.mat('whitewood'), 0.06, 0.38, 0.26, x, 0.19, hz + 1.25); });
    });
    stage('birdbath', 45, function (o, P) {
      var x = -1.7, z = 3.0, y = at(x, z);
      P(self.geo.cyl6, self.mat('stone', 0), 0.12, 0.6, 0.12, x, y + 0.3, z);
      P(self.geo.cyl, self.mat('stone', 1), 0.32, 0.08, 0.32, x, y + 0.64, z);
      P(self.geo.cyl, self.mat('water'), 0.26, 0.02, 0.26, x, y + 0.69, z);
      P(self.geo.ball, self.mat('fox', 2), 0.06, 0.05, 0.08, x + 0.15, y + 0.74, z);
    });
    stage('dormers', 52, function (o, P) {
      [-0.75, 0.75].forEach(function (x) {
        P(self.geo.box, walls, 0.5, 0.45, 0.5, x, 1.85, hz + 0.55);
        P(self.geo.gable, thatch, 0.4, 0.45, 0.42, x, 2.07, hz + 0.6);
        P(self.geo.box, self.mat('window'), 0.26, 0.24, 0.04, x, 1.86, hz + 0.81);
      });
    });
    stage('shed', 60, function (o, P) {
      var x = 3.9, z = -3.1, y = at(x, z);
      P(self.geo.box, self.mat('woodLight'), 1.2, 0.9, 0.9, x, y + 0.45, z);
      P(self.geo.box, self.mat('shingle'), 1.35, 0.08, 1.05, x, y + 0.95, z).rotation.x = 0.15;
      P(self.geo.box, self.mat('window'), 0.32, 0.26, 0.04, x - 0.25, y + 0.55, z + 0.46);
      P(self.geo.box, self.mat('wood'), 0.32, 0.6, 0.04, x + 0.3, y + 0.32, z + 0.46);
      for (var pp = 0; pp < 3; pp++) P(self.geo.cyl6, self.mat('brick', pp), 0.07, 0.12, 0.07, x - 0.4 + pp * 0.2, y + 0.06, z + 0.62);
    });
    stage('pond', 70, function (o, P) {
      var x = -3.5, z = 1.9, y = at(x, z);
      P(self.geo.cyl, self.mat('water'), 0.95, 0.04, 0.7, x, y + 0.03, z);
      for (var s2 = 0; s2 < 14; s2++) { var a = s2 / 14 * Math.PI * 2; P(self.geo.box, self.mat('stone', s2 % 3), 0.22, 0.1, 0.16, x + Math.cos(a) * 1.0, y + 0.05, z + Math.sin(a) * 0.75).rotation.y = -a; }
      [[0.3, 0.1], [-0.35, -0.2], [0.05, -0.3]].forEach(function (l) { P(self.geo.cyl, self.mat('houseplant', 3), 0.12, 0.015, 0.12, x + l[0], y + 0.06, z + l[1]); });
      P(self.geo.ball, self.mat('plaster', 0), 0.05, 0.04, 0.05, x + 0.3, y + 0.09, z + 0.1);
    });
    stage('bees', 80, function (o, P) {
      [[4.5, -1.6], [4.5, -0.9]].forEach(function (h) { var y = at(h[0], h[1]); for (var k = 0; k < 3; k++) P(self.geo.box, self.mat('whitewood'), 0.36 - k * 0.02, 0.16, 0.36 - k * 0.02, h[0], y + 0.1 + k * 0.16, h[1]); P(self.geo.cone4, self.mat('shingle'), 0.3, 0.12, 0.3, h[0], y + 0.6, h[1]).rotation.y = Math.PI / 4; });
      for (var w = 0; w < 18; w++) { var wx = 2.4 + (w * 0.37) % 2.4, wz = -2.2 + (w * 0.61) % 1.9; P(self.geo.ball, self.mat('flag', w % 5), 0.04, 0.04, 0.04, wx, at(wx, wz) + 0.12, wz); }
    });
    stage('gazebo', 92, function (o, P) {
      var x = 3.3, z = 3.0, y = at(x, z);
      P(self.geo.cyl6, self.mat('stone', 2), 1.15, 0.15, 1.15, x, y + 0.07, z);
      for (var gp = 0; gp < 6; gp++) { var ga = gp / 6 * Math.PI * 2; P(self.geo.cyl6, self.mat('whitewood'), 0.05, 1.2, 0.05, x + Math.cos(ga) * 1.0, y + 0.75, z + Math.sin(ga) * 1.0); }
      P(self.geo.cone6, self.mat('roof', 3), 1.35, 0.7, 1.35, x, y + 1.7, z);
      P(self.geo.ball, self.mat('gold'), 0.08, 0.08, 0.08, x, y + 2.08, z);
    });
    stage('arch', 105, function (o, P) {
      var y = at(0, 4.6);
      [-0.62, 0.62].forEach(function (x) { P(self.geo.box, self.mat('whitewood'), 0.06, 1.3, 0.06, x, y + 0.65, 4.6); });
      for (var i = 0; i <= 12; i++) {
        var a = i / 12 * Math.PI, x = Math.cos(a) * 0.62, yy = y + 1.3 + Math.sin(a) * 0.45;
        P(self.geo.blob, self.mat('houseplant', i), 0.1, 0.1, 0.1, x, yy, 4.6);
        if (i % 2) P(self.geo.ball, self.mat('flag', 0), 0.05, 0.05, 0.05, x, yy + 0.06, 4.66);
      }
    });
    stage('wing', 120, function (o, P) {
      P(self.geo.box, walls, 1.3, 1.0, 1.3, -1.95, 0.6, hz - 0.1);
      P(self.geo.gable, thatch, 0.9, 1.0, 0.95, -1.95, 1.1, hz - 0.1);
      P(self.geo.box, self.mat('window'), 0.34, 0.3, 0.04, -1.95, 0.7, hz + 0.56);
      // The glasshouse off the far end, full of plants.
      var x = 2.15, z = hz - 0.2;
      P(self.geo.box, self.mat('stone', 1), 0.95, 0.12, 1.1, x, 0.06, z);
      P(self.geo.box, self.mat('glasshouse'), 0.86, 0.6, 1.0, x, 0.42, z);
      P(self.geo.gable, self.mat('glasshouse'), 0.55, 0.45, 0.68, x, 0.72, z).rotation.y = Math.PI / 2;
      for (var pl = 0; pl < 6; pl++) { P(self.geo.blob, self.mat('houseplant', pl), 0.11, 0.13, 0.11, x - 0.25 + (pl % 2) * 0.5, 0.3, z - 0.35 + Math.floor(pl / 2) * 0.35); if (pl % 2) P(self.geo.ball, self.mat('flag', pl % 5), 0.04, 0.04, 0.04, x - 0.25 + (pl % 2) * 0.5, 0.44, z - 0.35 + Math.floor(pl / 2) * 0.35); }
    });
    stage('lanterns', 135, function (o, P) {
      [0.6, 1.8, 3.0].forEach(function (z) { [-0.55, 0.55].forEach(function (x) { var y = at(x, z); P(self.geo.cyl6, self.mat('stoneDark'), 0.03, 0.55, 0.03, x, y + 0.27, z); P(self.geo.box, self.mat('lantern'), 0.12, 0.14, 0.12, x, y + 0.6, z); }); });
    });
    stage('dovecote', 150, function (o, P) {
      var x = -4.6, z = -0.6, y = at(x, z);
      P(self.geo.cyl6, self.mat('whitewood'), 0.05, 1.5, 0.05, x, y + 0.75, z);
      P(self.geo.cyl6, self.mat('whitewood'), 0.25, 0.36, 0.25, x, y + 1.65, z);
      P(self.geo.cone6, thatch, 0.34, 0.35, 0.34, x, y + 2.0, z);
      [0, 2.1, 4.2].forEach(function (a) { P(self.geo.ball, self.mat('plaster', 0), 0.06, 0.05, 0.07, x + Math.cos(a) * 0.3, y + 1.86, z + Math.sin(a) * 0.3); });
    });
    stage('porch', 18, function (o, P) {
      // A little thatched porch on two posts over the front door.
      [-0.45, 0.45].forEach(function (x) { P(self.geo.box, self.mat('woodLight'), 0.08, 1.05, 0.08, x, 0.55, hz + 1.45); });
      var pr = P(self.geo.gable, thatch, 0.75, 0.55, 0.75, 0, 1.08, hz + 1.2); pr.rotation.y = 0;
      P(self.geo.box, self.mat('holdRoof', 1), 1.25, 0.08, 0.16, 0, 1.1, hz + 1.6);
    });
    stage('crosswing', 75, function (o, P) {
      // A taller two-storey wing behind, its gable end rising over the thatch.
      var z = hz - 1.25, x = 0.2;
      P(self.geo.box, self.mat('holdStone', 1), 2.3, 0.2, 1.5, x, 0.1, z);
      P(self.geo.box, walls, 2.1, 2.1, 1.3, x, 1.15, z);
      P(self.geo.box, self.mat('wood'), 2.14, 0.08, 1.34, x, 1.15, z);
      var cr = P(self.geo.gable, thatch, 1.5, 1.25, 1.0, x, 2.18, z); cr.rotation.y = Math.PI / 2;
      [-0.5, 0.5].forEach(function (dx) { [0.65, 1.6].forEach(function (y) {
        P(self.geo.box, self.mat('whitewood'), 0.4, 0.38, 0.04, x + dx, y, z - 0.67);
        P(self.geo.box, self.mat('window'), 0.32, 0.3, 0.05, x + dx, y, z - 0.68);
      }); });
      [-1.06, 1.06].forEach(function (dx) { P(self.geo.box, self.mat('window'), 0.04, 0.3, 0.3, x + dx, 1.6, z); });
    });
    stage('upstairs', 170, function (o, P) {
      // Rooms over the side wing, with their own dormer.
      P(self.geo.box, walls, 1.3, 0.75, 1.3, -1.95, 1.5, hz - 0.1);
      P(self.geo.gable, thatch, 0.95, 0.95, 1.0, -1.95, 1.85, hz - 0.1);
      P(self.geo.box, self.mat('window'), 0.3, 0.26, 0.04, -1.95, 1.5, hz + 0.56);
    });
    // Garden beds, each in its own open corner of the yard.
    JO_BEDS.forEach(function (bd, bi) {
      stage('bed' + bi, bd[0], function (o, P) {
        var x = bd[3], z = bd[4], y = at(x, z), kind = bd[2];
        P(self.geo.box, kind === 'herb' || kind === 'veg' ? self.mat('wood') : self.mat('stone', bi % 3), 1.0, 0.14, 0.8, x, y + 0.07, z);
        P(self.geo.box, self.mat('soil'), 0.9, 0.04, 0.7, x, y + 0.15, z);
        for (var r = 0; r < 3; r++) for (var c = 0; c < 4; c++) {
          var px = x - 0.33 + c * 0.22, pz = z - 0.22 + r * 0.22, k = r * 4 + c;
          if (kind === 'sunflower' || kind === 'foxglove') {
            P(self.geo.cyl6, self.mat('houseplant', 1), 0.02, 0.55, 0.02, px, y + 0.44, pz);
            P(self.geo.ball, kind === 'sunflower' ? self.mat('flag', 1) : self.mat('balloon', 3 + (k % 2) * 2), 0.07, kind === 'sunflower' ? 0.03 : 0.1, 0.07, px, y + 0.72, pz);
          } else if (kind === 'pumpkin') {
            if (k % 2) P(self.geo.ball, self.mat('crop', 0), 0.1, 0.08, 0.1, px, y + 0.22, pz);
            else P(self.geo.blob, self.mat('houseplant', k), 0.09, 0.06, 0.09, px, y + 0.2, pz);
          } else {
            P(self.geo.blob, self.mat('houseplant', k), 0.08, kind === 'herb' ? 0.1 : 0.08, 0.08, px, y + 0.22, pz);
            var bloom = { rose: self.mat('flag', k % 3 ? 0 : 4), lavender: self.mat('balloon', 3), tulip: self.mat('flag', k % 5), cutting: self.mat('flag', (k * 2) % 5), veg: self.mat('flag', 0) }[kind];
            if (bloom && (kind !== 'veg' || k % 2)) P(self.geo.ball, bloom, 0.05, kind === 'lavender' ? 0.09 : 0.05, 0.05, px, y + 0.31, pz);
          }
        }
      });
    });
  };

  // Friends: a house per training partner (couples share one) that keeps growing the more you train together.
  Town.prototype.addFriend = function (name, delay) {
    var f = this.st.friends[name];
    if (!f) {
      var idx = this.st.friendOrder.length;
      this.st.friendOrder.push(name);
      f = this.st.friends[name] = { n: 0, idx: idx, built: {}, floors: 0 };
      // Jo has her own cottage on the village green; everyone else takes the next house plot.
      var jo = isJo(name), slot = jo ? -1 : (this.st.slotNext = (this.st.slotNext || 0) + 1) - 1;
      var p = jo ? JO_PLOT : slot < HOUSE_SLOTS.length ? HOUSE_SLOTS[slot] : this.overflowSpot(), noSpot = !p;
      if (noSpot) p = polar(186 + ((slot - HOUSE_SLOTS.length) * 13) % 92, 30);
      var g = new T.Group();
      g.position.set(p.x, groundY(p.x, p.z), p.z);
      g.rotation.y = p.face != null ? p.face : Math.atan2(p.x, p.z) + Math.PI;
      this.world.add(g);
      f.group = g; f.jo = jo; f.spot = p;
      f.tent = noSpot; // a tent only if there's truly nowhere left
      if (jo && this.greenGazebo) this.greenGazebo.visible = false;
      if (!f.tent && p.si != null) { this.growStreet(p.si, p.ti + 5, delay); this.driveway(p, delay + 200); }
      f.roofMat = /^jo$/i.test(name) ? this.mat('roofJo') : this.mat('roof', idx);
      if (jo) this.placeCritter('fox', p.x, p.z, 2.2, 4.4);
      this.decorDirty = true;
      if (f.tent) {
        this.part(g, this.geo.cone4, f.roofMat, 0.8, 1.1, 0.8, 0, 0.55, 0, 'friend:' + name).rotation.y = Math.PI / 4;
        this.pop(g, delay);
      }
    }
    f.n++;
    if (f.jo) this.growCottage(f, name, delay);
    else if (!f.tent) this.growHouse(f, name, delay);
  };
  // Once the street plots are all taken, more houses go on open ground near the village, clear of
  // everything else and of each other, facing the square.
  Town.prototype.overflowSpot = function () {
    var used = Object.keys(this.st.friends).map(function (k) { return this.st.friends[k].group; }, this).filter(Boolean);
    for (var pass = 0; pass < 3; pass++) for (var r = 18; r < 92; r += 2.5) for (var k = 0; k < 72; k++) {
      var a = 180 + (k % 2 ? 1 : -1) * Math.ceil(k / 2) * 5, p = polar(a, r);
      if (Math.hypot(p.x - JO_PLOT.x, p.z - JO_PLOT.z) < 9 || !groundClear(p, 2.6, pass > 0)) continue;
      if (used.some(function (g2) { return Math.hypot(g2.position.x - p.x, g2.position.z - p.z) < 5.5; })) continue;
      var taken = this.st.secretPos, near = false;
      for (var id in taken) if (taken[id] && Math.hypot(taken[id].x - p.x, taken[id].z - p.z) < 8) near = true;
      if (near) continue;
      var hs = [[-2, -2], [2, -2], [2, 2], [-2, 2]].map(function (c) { return groundY(p.x + c[0], p.z + c[1]); });
      if (Math.max.apply(null, hs) - Math.min.apply(null, hs) > (pass < 2 ? 0.45 : 0.9)) continue; // fairly level ground
      p.face = Math.atan2(SQUARE.x - p.x, SQUARE.z - p.z);
      return p;
    }
    return null;
  };
  var FH = 0.85;
  Town.prototype.growHouse = function (f, name, delay) {
    var n = f.n, g = f.group, pick = 'friend:' + name, self = this, b = f.built;
    function once(key, at, fn) { if (n >= at && !b[key]) { b[key] = true; fn(); } }
    once('base', 1, function () {
      var roof = new T.Group();
      self.part(roof, self.geo.gable, f.roofMat, 1, 1, 1, 0, 0, 0, pick);
      self.part(roof, self.geo.box, self.mat('stone', 2), 0.22, 0.6, 0.22, 0.4, 0.45, -0.3, pick);
      g.add(roof);
      f.roof = roof;
      self.addFloor(f, pick, delay, true);
    });
    once('boxes', 3, function () {
      var box = new T.Group();
      [-0.45, 0.45].forEach(function (x) {
        self.part(box, self.geo.box, self.mat('wood'), 0.32, 0.1, 0.12, x, 0.3, 0.7, pick);
        for (var i = 0; i < 3; i++) self.part(box, self.geo.ball, self.mat('flag', i + (x > 0 ? 1 : 0)), 0.06, 0.06, 0.06, x - 0.1 + i * 0.1, 0.38, 0.7, pick);
      });
      g.add(box); self.pop(box, delay);
    });
    once('floor2', 5, function () { self.addFloor(f, pick, delay); });
    once('porch', 8, function () {
      var porch = new T.Group();
      var aw = self.part(porch, self.geo.box, f.roofMat, 1.4, 0.06, 0.6, 0, 1.0, 0.92, pick); aw.rotation.x = 0.35;
      self.part(porch, self.geo.cyl6, self.mat('woodLight'), 0.04, 1.0, 0.04, -0.6, 0.5, 1.15, pick);
      self.part(porch, self.geo.cyl6, self.mat('woodLight'), 0.04, 1.0, 0.04, 0.6, 0.5, 1.15, pick);
      self.part(porch, self.geo.box, self.mat('wood'), 1.4, 0.06, 0.6, 0, 0.03, 0.95, pick);
      g.add(porch); self.pop(porch, delay);
    });
    once('fence', 11, function () {
      var fence = new T.Group(), mat = self.mat('woodLight');
      [[0, -1.6, 3.4, true], [-1.7, 0, 3.2, false], [1.7, 0, 3.2, false], [-1.15, 1.6, 1.1, true], [1.15, 1.6, 1.1, true]].forEach(function (r) {
        [0.15, 0.3].forEach(function (y) { self.part(fence, self.geo.box, mat, r[3] ? r[2] : 0.05, 0.05, r[3] ? 0.05 : r[2], r[0], y, r[1], pick); });
      });
      g.add(fence); self.pop(fence, delay);
      f.fence = fence;
    });
    once('backwing', 14, function () {
      var w = new T.Group();
      w.position.set(0, 0, -1.1);
      self.part(w, self.geo.box, self.mat('plaster', f.idx + 1), 1.1, 0.75, 0.9, 0, 0.375, 0, pick);
      self.part(w, self.geo.gable, f.roofMat, 0.75, 0.7, 0.6, 0, 0.75, 0, pick).rotation.y = Math.PI / 2;
      g.add(w); self.pop(w, delay);
    });
    once('patch', 18, function () {
      var patch = new T.Group();
      patch.position.set(1.15, 0, -0.6);
      for (var i = 0; i < 4; i++) {
        self.part(patch, self.geo.box, self.mat('soil'), 0.36, 0.06, 0.36, (i % 2) * 0.4 - 0.2, 0.03, Math.floor(i / 2) * 0.4 - 0.2, pick);
        self.part(patch, self.geo.ball, self.mat('crop', i), 0.1, 0.09, 0.1, (i % 2) * 0.4 - 0.2, 0.14, Math.floor(i / 2) * 0.4 - 0.2, pick);
      }
      g.add(patch); self.pop(patch, delay);
      f.patch = patch;
    });
    once('sidewing', 22, function () {
      var w = new T.Group();
      w.position.set(-1.15, 0, -0.1);
      self.part(w, self.geo.box, self.mat('plaster', f.idx + 2), 0.8, 1.1, 1.0, 0, 0.55, 0, pick);
      self.part(w, self.geo.gable, f.roofMat, 0.55, 0.8, 0.7, 0, 1.1, 0, pick);
      self.part(w, self.geo.box, self.mat('window'), 0.04, 0.26, 0.24, -0.41, 0.6, 0, pick);
      g.add(w); self.pop(w, delay);
    });
    once('roses', 26, function () {
      // Climbing roses up the front wall and a row of rose bushes inside the front fence.
      var r = new T.Group();
      [-0.62, 0.62].forEach(function (x, j) {
        for (var i = 0; i < 6; i++) self.part(r, self.geo.blob, self.mat(i % 3 ? 'hedge' : 'flag', j * 2), 0.11, 0.11, 0.08, x + Math.sin(i * 2.1) * 0.06, 0.15 + i * 0.25, 0.68, pick);
      });
      [-1.35, -1.0, 1.0, 1.35].forEach(function (x, i) {
        self.part(r, self.geo.blob, self.mat('hedge'), 0.17, 0.15, 0.17, x, 0.13, 1.4, pick);
        self.part(r, self.geo.ball, self.mat('flag', i % 2 ? 0 : 4), 0.06, 0.06, 0.06, x + 0.05, 0.27, 1.45, pick);
      });
      g.add(r); self.pop(r, delay);
    });
    once('well', 30, function () {
      var well = new T.Group();
      well.position.set(-1.2, 0, 1.1);
      self.part(well, self.geo.cyl, self.mat('stone', 1), 0.28, 0.4, 0.28, 0, 0.2, 0, pick);
      self.part(well, self.geo.cyl, self.mat('water'), 0.22, 0.02, 0.22, 0, 0.41, 0, pick);
      self.part(well, self.geo.cone4, f.roofMat, 0.42, 0.3, 0.42, 0, 0.95, 0, pick).rotation.y = Math.PI / 4;
      self.part(well, self.geo.box, self.mat('wood'), 0.04, 0.6, 0.04, -0.25, 0.6, 0, pick);
      self.part(well, self.geo.box, self.mat('wood'), 0.04, 0.6, 0.04, 0.25, 0.6, 0, pick);
      g.add(well); self.pop(well, delay);
    });
    // A third storey at 46, then no taller: past 30 sessions the garden grows into a little estate.
    once('floor3', 46, function () { self.addFloor(f, pick, delay); });
    if (n >= 36) this.growEstate(f, pick, delay);
  };
  // Hides a piece the estate has outgrown (the picket fence, the vegetable patch).
  Town.prototype.retire = function (obj) {
    if (!obj) return;
    obj.visible = false;
    var gone = [];
    obj.traverse(function (o) { if (o.isMesh) gone.push(o); });
    this.picks = this.picks.filter(function (m) { return gone.indexOf(m) < 0; });
  };
  Town.prototype.growEstate = function (f, pick, delay) {
    var n = f.n, g = f.group, self = this, b = f.built;
    if (!f.estate) {
      // Squeeze the layout a little where the neighbours are close.
      var room = 99, here = g.position;
      HOUSE_SLOTS.forEach(function (h) { var d = Math.hypot(h.x - here.x, h.z - here.z); if (d > 0.1) room = Math.min(room, d / 2); });
      var k = Math.max(0.85, Math.min(1, room / 2.3));
      f.estate = new T.Group();
      f.estate.scale.set(k, 1, k);
      g.add(f.estate);
    }
    var E = f.estate;
    function once(key, at, fn) { if (n >= at && !b[key]) { b[key] = true; var o = new T.Group(); fn(o); E.add(o); self.pop(o, delay); } }
    function P(o, geo, mat, sx, sy, sz, x, y, z) { return self.part(o, geo, mat, sx, sy, sz, x, y, z, pick); }
    function topiary(o, x, z, h) {
      P(o, self.geo.box, self.mat('stone', 1), 0.26, 0.2, 0.26, x, 0.1, z);
      P(o, self.geo.ball, self.mat('hedge'), 0.18, 0.18, 0.18, x, 0.36, z);
      P(o, self.geo.ball, self.mat('hedge'), 0.13, 0.13, 0.13, x, 0.6, z);
      if (h) P(o, self.geo.ball, self.mat('hedge'), 0.08, 0.08, 0.08, x, 0.78, z);
    }
    once('arbour', 36, function (o) {
      [-0.55, 0.55].forEach(function (x) { P(o, self.geo.box, self.mat('woodLight'), 0.07, 1.1, 0.07, x, 0.55, 1.65); });
      P(o, self.geo.box, self.mat('woodLight'), 1.25, 0.07, 0.2, 0, 1.12, 1.65);
      for (var i = 0; i < 7; i++) P(o, self.geo.blob, self.mat(i % 2 ? 'hedge' : 'flag', 0), 0.13, 0.11, 0.13, -0.55 + i * 0.183, 1.2, 1.65);
      [-0.55, 0.55].forEach(function (x) { for (var j = 0; j < 3; j++) P(o, self.geo.blob, self.mat('hedge'), 0.09, 0.12, 0.09, x, 0.3 + j * 0.3, 1.65); });
    });
    once('wall', 42, function (o) {
      // A low stone wall replaces the picket fence, taking in a bigger garden, with capped gateposts.
      self.retire(f.fence);
      [[0, -2.6, 4.4, true], [-2.2, -0.45, 4.3, false], [2.2, -0.45, 4.3, false], [-1.4, 1.7, 1.6, true], [1.4, 1.7, 1.6, true]].forEach(function (r) {
        P(o, self.geo.box, self.mat('stone', 0), r[3] ? r[2] : 0.2, 0.38, r[3] ? 0.2 : r[2], r[0], 0.19, r[1]);
        P(o, self.geo.box, self.mat('stone', 2), r[3] ? r[2] + 0.04 : 0.26, 0.06, r[3] ? 0.26 : r[2] + 0.04, r[0], 0.41, r[1]);
      });
      [-0.6, 0.6].forEach(function (x) {
        P(o, self.geo.box, self.mat('stone', 1), 0.28, 0.7, 0.28, x, 0.35, 1.7);
        P(o, self.geo.ball, self.mat('stone', 2), 0.12, 0.12, 0.12, x, 0.8, 1.7);
      });
      // Gravel path from the gate to the door.
      P(o, self.geo.box, self.mat('path'), 0.5, 0.03, 0.9, 0, 0.015, 1.2);
    });
    once('courtyard', 50, function (o) {
      P(o, self.geo.box, self.mat('cobble'), 3.0, 0.04, 0.95, 0, 0.02, -2.05);
      [-1.6, 1.6].forEach(function (x) { P(o, self.geo.box, self.mat('stone', 2), 0.2, 0.05, 0.95, x, 0.03, -2.05); });
      // A bench against the back wall.
      P(o, self.geo.box, self.mat('wood'), 0.7, 0.06, 0.22, -1.0, 0.25, -2.4);
      [-1.25, -0.75].forEach(function (x) { P(o, self.geo.box, self.mat('stone', 1), 0.08, 0.22, 0.2, x, 0.11, -2.4); });
    });
    once('fountain', 58, function (o) {
      P(o, self.geo.cyl, self.mat('stone', 0), 0.42, 0.18, 0.42, 0.2, 0.11, -2.05);
      P(o, self.geo.cyl, self.mat('water'), 0.36, 0.02, 0.36, 0.2, 0.2, -2.05);
      P(o, self.geo.cyl, self.mat('stone', 1), 0.06, 0.4, 0.06, 0.2, 0.38, -2.05);
      P(o, self.geo.cyl, self.mat('stone', 0), 0.16, 0.05, 0.16, 0.2, 0.58, -2.05);
      P(o, self.geo.ball, self.mat('water'), 0.06, 0.12, 0.06, 0.2, 0.68, -2.05);
    });
    once('topiary', 66, function (o) {
      topiary(o, -0.95, 1.45, true); topiary(o, 0.95, 1.45, true);
      topiary(o, -1.45, -2.05); topiary(o, 1.45, -2.05);
      // Low box hedges edging the path.
      [-0.38, 0.38].forEach(function (x) { P(o, self.geo.box, self.mat('hedge'), 0.14, 0.16, 0.8, x, 0.08, 1.2); });
    });
    once('statue', 75, function (o) {
      P(o, self.geo.box, self.mat('stone', 1), 0.34, 0.34, 0.34, 1.55, 0.17, 0.95);
      P(o, self.geo.box, self.mat('stone', 2), 0.4, 0.05, 0.4, 1.55, 0.36, 0.95);
      P(o, self.geo.cyl6, self.mat('stone', 0), 0.09, 0.42, 0.09, 1.55, 0.6, 0.95);
      P(o, self.geo.ball, self.mat('stone', 0), 0.08, 0.08, 0.08, 1.55, 0.89, 0.95);
      P(o, self.geo.box, self.mat('stone', 0), 0.05, 0.3, 0.05, 1.64, 0.82, 0.95).rotation.z = -0.5;
      P(o, self.geo.ball, self.mat('gold'), 0.05, 0.05, 0.05, 1.72, 0.98, 0.95);
      [-0.22, 0.22].forEach(function (dx) { P(o, self.geo.blob, self.mat('hedge'), 0.1, 0.08, 0.1, 1.55 + dx, 0.06, 1.2); });
    });
    once('orchard', 85, function (o) {
      [[-1.85, -1.2], [1.85, -1.55], [-1.85, 0.6]].forEach(function (t, i) {
        P(o, self.geo.cyl6, self.mat('trunk'), 0.06, 0.6, 0.06, t[0], 0.3, t[1]);
        P(o, self.geo.blob, self.mat('leaf', i), 0.34, 0.3, 0.34, t[0], 0.78, t[1]);
        for (var j = 0; j < 4; j++) P(o, self.geo.ball, self.mat('flag', i % 2 ? 1 : 0), 0.045, 0.045, 0.045, t[0] + Math.cos(j * 1.6) * 0.27, 0.72 + (j % 2) * 0.12, t[1] + Math.sin(j * 1.6) * 0.27);
      });
    });
    once('conservatory', 96, function (o) {
      // The vegetable patch makes way for a white-framed glasshouse.
      self.retire(f.patch);
      var x = 1.3, z = -0.55;
      P(o, self.geo.box, self.mat('stone', 1), 0.95, 0.16, 1.05, x, 0.08, z);
      P(o, self.geo.box, self.mat('glasshouse'), 0.86, 0.6, 0.96, x, 0.46, z);
      [[-0.43, -0.48], [0.43, -0.48], [-0.43, 0.48], [0.43, 0.48]].forEach(function (c) { P(o, self.geo.box, self.mat('plaster', 0), 0.05, 0.62, 0.05, x + c[0], 0.47, z + c[1]); });
      P(o, self.geo.gable, self.mat('glasshouse'), 0.55, 0.45, 0.66, x, 0.76, z).rotation.y = Math.PI / 2;
      P(o, self.geo.box, self.mat('plaster', 0), 0.05, 0.05, 1.0, x, 1.1, z);
      // Packed with plants: potting benches down both sides lined with pots and flowers, a little
      // lemon tree in the middle, big leafy plants on the floor and trailing vines from the roof.
      [-0.3, 0.3].forEach(function (bx) {
        P(o, self.geo.box, self.mat('wood'), 0.2, 0.04, 0.84, x + bx, 0.36, z);
        [-0.36, 0.36].forEach(function (lz) { P(o, self.geo.box, self.mat('wood'), 0.03, 0.2, 0.03, x + bx, 0.26, z + lz); });
        for (var pi = 0; pi < 5; pi++) {
          var pz = z - 0.34 + pi * 0.17, k = pi + (bx > 0 ? 2 : 0);
          P(o, self.geo.cyl6, self.mat('brick', k % 3), 0.045, 0.07, 0.045, x + bx, 0.415, pz);
          P(o, self.geo.blob, self.mat('houseplant', k), 0.07, 0.08, 0.07, x + bx, 0.49, pz);
          if (k % 2 === 0) P(o, self.geo.ball, self.mat('flag', k % 5), 0.035, 0.035, 0.035, x + bx + (bx > 0 ? -0.03 : 0.03), 0.55, pz);
        }
      });
      // The lemon tree in a big pot.
      P(o, self.geo.cyl6, self.mat('brick', 1), 0.09, 0.12, 0.09, x, 0.22, z);
      P(o, self.geo.cyl6, self.mat('trunk'), 0.025, 0.3, 0.025, x, 0.42, z);
      P(o, self.geo.blob, self.mat('houseplant', 2), 0.17, 0.15, 0.17, x, 0.66, z);
      [[0.09, 0.62, 0.06], [-0.08, 0.7, -0.05], [0.03, 0.74, -0.1], [-0.1, 0.6, 0.08]].forEach(function (l) { P(o, self.geo.ball, self.mat('flag', 1), 0.03, 0.03, 0.03, x + l[0], l[1], z + l[2]); });
      // Big leafy floor plants by the door and in the corners.
      [[0, 0.36, 0.12], [0.02, -0.38, 0.11]].forEach(function (f2) { P(o, self.geo.blob, self.mat('houseplant', 1), f2[2], f2[2] * 1.2, f2[2], x + f2[0], 0.26, z + f2[1]); });
      // Trailing vines hanging from the ridge.
      for (var hv = 0; hv < 4; hv++) {
        var hz = z - 0.33 + hv * 0.22;
        P(o, self.geo.box, self.mat('houseplant', hv), 0.03, 0.18, 0.03, x + (hv % 2 ? 0.08 : -0.08), 0.95, hz);
        P(o, self.geo.blob, self.mat('houseplant', hv + 1), 0.06, 0.05, 0.06, x + (hv % 2 ? 0.08 : -0.08), 1.02, hz);
      }
    });
    once('dovecote', 108, function (o) {
      P(o, self.geo.cyl6, self.mat('woodLight'), 0.05, 1.2, 0.05, -1.85, 0.6, -2.25);
      P(o, self.geo.cyl6, self.mat('plaster', 0), 0.2, 0.3, 0.2, -1.85, 1.33, -2.25);
      P(o, self.geo.cone6, f.roofMat, 0.27, 0.3, 0.27, -1.85, 1.63, -2.25);
      P(o, self.geo.ball, self.mat('plaster', 0), 0.05, 0.04, 0.07, -1.7, 1.82, -2.2);
    });
    once('lanterns', 120, function (o) {
      [[-0.6, 1.7, 0.92], [0.6, 1.7, 0.92], [-1.55, -2.5, 0.0], [1.55, -2.5, 0.0]].forEach(function (l) {
        if (l[2]) { P(o, self.geo.box, self.mat('lantern'), 0.12, 0.14, 0.12, l[0], l[2] + 0.04, l[1]); return; }
        P(o, self.geo.cyl6, self.mat('stoneDark'), 0.03, 0.8, 0.03, l[0], 0.4, l[1]);
        P(o, self.geo.box, self.mat('lantern'), 0.13, 0.15, 0.13, l[0], 0.86, l[1]);
      });
    });
    if (n >= 135 && !b.vane) {
      // A gilded weathervane on the ridge of the roof (it rides on the roof group).
      b.vane = true;
      var v = new T.Group();
      P(v, self.geo.cyl6, self.mat('gold'), 0.025, 0.5, 0.025, -0.3, 0.95, 0);
      P(v, self.geo.box, self.mat('gold'), 0.36, 0.04, 0.02, -0.3, 1.1, 0);
      P(v, self.geo.cone4, self.mat('gold'), 0.05, 0.1, 0.05, -0.3, 1.25, 0);
      f.roof.add(v); self.pop(v, delay);
    }
  };
  Town.prototype.addFloor = function (f, pick, delay, first) {
    var floor = new T.Group();
    this.part(floor, this.geo.box, this.mat('plaster', f.idx), 1.5, FH, 1.3, 0, FH / 2, 0, pick);
    this.part(floor, this.geo.box, this.mat('wood'), 1.56, 0.08, 1.36, 0, FH - 0.04, 0, pick);
    for (var w = -1; w <= 1; w += 2) this.part(floor, this.geo.box, this.mat('window'), 0.24, 0.26, 0.04, w * 0.45, FH * 0.55, 0.66);
    if (first) this.part(floor, this.geo.box, this.mat('wood'), 0.3, 0.5, 0.04, 0, 0.25, 0.66);
    f.group.add(floor);
    this.animDrop(floor, f.floors * FH, delay);
    f.floors++;
    this.animTo(f.roof, f.floors * FH, delay + (this.instant ? 0 : 480));
    this.fitDirty = true;
  };

  // The Slow Pour: a timber-framed tavern on the village square, with barrels stacking up outside.
  Town.prototype.addDrink = function (count, delay) {
    var s = this.st, self = this;
    if (!s.pub) {
      var g = new T.Group(), pick = 'pub';
      g.position.set(PUB.x, 0, PUB.z);
      g.rotation.y = facingSquare(PUB); // front faces the town square
      function part(geo, mat, sx, sy, sz, x, y, z) { return self.part(g, geo, mat, sx, sy, sz, x, y, z, pick); }
      part(this.geo.box, this.mat('stone', 1), 2.8, 1.1, 2.0, 0, 0.55, 0);                 // stone ground floor
      part(this.geo.box, this.mat('plaster', 0), 3.1, 1.05, 2.3, 0, 1.62, 0);              // overhanging upper floor
      // Dark timber framing on the front of the upper floor.
      [-1.5, -0.75, 0, 0.75, 1.5].forEach(function (x) { part(self.geo.box, self.mat('trunk'), 0.1, 1.05, 0.06, x, 1.62, 1.17); });
      part(this.geo.box, this.mat('trunk'), 3.1, 0.1, 0.06, 0, 1.12, 1.17);
      part(this.geo.box, this.mat('trunk'), 3.1, 0.1, 0.06, 0, 2.12, 1.17);
      [-1.12, 1.12].forEach(function (x) { part(self.geo.box, self.mat('trunk'), 0.08, 1.0, 0.05, x, 1.62, 1.18).rotation.z = x > 0 ? 0.62 : -0.62; });
      part(this.geo.gable, this.mat('roofTavern'), 2.05, 1.6, 1.65, 0, 2.15, 0);           // steep roof
      part(this.geo.box, this.mat('stone', 2), 0.42, 1.5, 0.42, -1.0, 3.0, -0.4);           // chimney
      part(this.geo.box, this.mat('wood'), 0.62, 0.85, 0.06, 0, 0.42, 1.01);               // door
      [-0.95, 0.95].forEach(function (x) {
        part(self.geo.box, self.mat('window'), 0.5, 0.38, 0.05, x, 0.6, 1.01);
        part(self.geo.box, self.mat('window'), 0.42, 0.34, 0.05, x * 0.8, 1.66, 1.2);
        part(self.geo.box, self.mat('lantern'), 0.13, 0.17, 0.13, x * 0.48, 0.95, 1.08);
      });
      // Hanging sign on an iron bracket.
      part(this.geo.box, this.mat('stoneDark'), 0.7, 0.05, 0.05, 1.75, 1.35, 1.0);
      part(this.geo.box, this.mat('woodLight'), 0.05, 0.42, 0.55, 2.02, 1.08, 1.0).rotation.y = Math.PI / 2;
      part(this.geo.box, this.mat('gold'), 0.06, 0.12, 0.3, 2.02, 1.1, 1.03).rotation.y = Math.PI / 2;
      // Picnic tables out front.
      [-1.1, 1.1].forEach(function (x) {
        part(self.geo.box, self.mat('woodLight'), 0.9, 0.07, 0.5, x, 0.5, 2.0);
        part(self.geo.box, self.mat('wood'), 0.9, 0.06, 0.18, x, 0.3, 1.6);
        part(self.geo.box, self.mat('wood'), 0.9, 0.06, 0.18, x, 0.3, 2.4);
        part(self.geo.box, self.mat('wood'), 0.08, 0.5, 0.4, x, 0.25, 2.0);
      });
      this.world.add(g);
      s.pub = g;
      this.animDrop(g, groundY(PUB.x, PUB.z), delay);
    }
    for (var i = 0; i < count && s.barrels < 21; i++) {
      var b = s.barrels, row = 0, inRow = b, cap = 6;
      while (inRow >= cap) { inRow -= cap; row++; cap--; }
      var bar = this.part(s.pub, this.geo.cyl, this.mat('wood'), 0.2, 0.36, 0.2, -1.85, 0, -0.95 + inRow * 0.42 + row * 0.21, 'pub');
      bar.rotation.x = Math.PI / 2;
      this.animDrop(bar, 0.2 + row * 0.36, delay + i * 80, 500);
      s.barrels++;
    }
    this.growPub(delay + 300);
  };
  // Past the barrel pile, the Slow Pour keeps getting cosier: a beer garden, a brewhouse, a hop
  // garden, a coaching-inn wing and so on, all the way to a golden tankard at 1000 drinks.
  var PUB_STAGES = [
    [25, 'baskets', 'Hanging flower baskets'], [40, 'garden', 'Beer garden'], [60, 'lights', 'String lights'],
    [85, 'brewhouse', 'Brewhouse with a copper kettle'], [115, 'hops', 'Hop garden'], [150, 'sign', 'Gilded inn sign'],
    [200, 'wing', 'Coaching-inn wing'], [260, 'coach', 'Stagecoach'], [340, 'snug', 'Thatched snug'],
    [450, 'bunting', 'Bunting out to the square'], [600, 'cart', 'Cellar cart'], [800, 'bandstand', 'Bandstand'],
    [1000, 'tankard', 'Golden tankard on the roof']
  ];
  Town.prototype.growPub = function (delay) {
    var s = this.st, self = this, built = s.pubBuilt = s.pubBuilt || {}, pick = 'pub';
    PUB_STAGES.forEach(function (st) {
      if (s.drinks < st[0] || built[st[1]]) return;
      built[st[1]] = true;
      var o = new T.Group();
      function P(geo, mat, sx, sy, sz, x, y, z) { return self.part(o, geo, mat, sx, sy, sz, x, y, z, pick); }
      function table(x, z) {
        P(self.geo.box, self.mat('woodLight'), 0.5, 0.06, 0.8, x, 0.48, z);
        P(self.geo.box, self.mat('wood'), 0.16, 0.06, 0.8, x - 0.38, 0.28, z);
        P(self.geo.box, self.mat('wood'), 0.16, 0.06, 0.8, x + 0.38, 0.28, z);
        P(self.geo.box, self.mat('wood'), 0.4, 0.46, 0.08, x, 0.24, z);
      }
      switch (st[1]) {
        case 'baskets':
          [-0.95, 0.95, -0.3, 0.3].forEach(function (x, i) {
            P(self.geo.ball, self.mat('trunk'), 0.13, 0.08, 0.13, x * (i > 1 ? 3.3 : 1), 1.0, 1.38);
            P(self.geo.blob, self.mat('hedge'), 0.15, 0.1, 0.15, x * (i > 1 ? 3.3 : 1), 0.94, 1.38);
            for (var k = 0; k < 3; k++) P(self.geo.ball, self.mat('flag', i + k), 0.05, 0.05, 0.05, x * (i > 1 ? 3.3 : 1) + (k - 1) * 0.08, 0.86, 1.42);
          });
          break;
        case 'garden':
          // Low hedge round a lawn beside the barrels, with two more tables and parasols.
          P(self.geo.box, self.mat('pitch'), 2.0, 0.03, 3.0, -3.3, 0.015, 0.8);
          [[-3.3, -0.7, 2.0, 0.16], [-4.3, 0.8, 0.16, 3.0], [-3.3, 2.3, 2.0, 0.16]].forEach(function (h) { P(self.geo.box, self.mat('hedge'), h[2], 0.3, h[3], h[0], 0.15, h[1]); });
          [[-3.4, 0.2], [-3.4, 1.6]].forEach(function (t, i) {
            table(t[0], t[1]);
            P(self.geo.cyl6, self.mat('woodLight'), 0.03, 1.3, 0.03, t[0], 0.65, t[1]);
            P(self.geo.cone, self.mat('canvas', i + 1), 0.6, 0.3, 0.6, t[0], 1.35, t[1]);
          });
          break;
        case 'lights':
          [[-2.4, -0.6], [-4.2, -0.6], [-4.2, 2.2], [-2.4, 2.2]].forEach(function (q) { P(self.geo.cyl6, self.mat('wood'), 0.03, 1.8, 0.03, q[0], 0.9, q[1]); });
          [[-2.4, -0.6, -4.2, -0.6], [-4.2, -0.6, -4.2, 2.2], [-4.2, 2.2, -2.4, 2.2], [-2.4, 2.2, -1.5, 1.2], [-2.4, -0.6, -4.2, 2.2]].forEach(function (l) {
            for (var k = 1; k < 8; k++) { var t = k / 8, sag = Math.sin(t * Math.PI) * 0.25; P(self.geo.ball, self.mat('lantern'), 0.05, 0.05, 0.05, l[0] + (l[2] - l[0]) * t, 1.75 - sag, l[1] + (l[3] - l[1]) * t); }
          });
          break;
        case 'brewhouse':
          P(self.geo.box, self.mat('stone', 1), 1.5, 1.1, 1.2, -0.9, 0.55, -2.4);
          P(self.geo.gable, self.mat('roofTavern'), 1.0, 0.8, 0.85, -0.9, 1.1, -2.4).rotation.y = Math.PI / 2;
          P(self.geo.cyl, self.mat('copper'), 0.35, 0.6, 0.35, -0.3, 0.3, -1.65);
          P(self.geo.ball, self.mat('copper'), 0.35, 0.3, 0.35, -0.3, 0.6, -1.65);
          P(self.geo.cyl6, self.mat('copper'), 0.06, 1.3, 0.06, -0.3, 1.2, -1.65);
          P(self.geo.box, self.mat('wood'), 0.5, 0.7, 0.04, -1.2, 0.35, -1.79);
          break;
        case 'hops':
          for (var r = 0; r < 2; r++) for (var c = 0; c < 4; c++) {
            var hx = -3.9 + c * 0.5, hz = -2.7 + r * 0.8;
            P(self.geo.cyl6, self.mat('woodLight'), 0.03, 1.9, 0.03, hx, 0.95, hz);
            P(self.geo.blob, self.mat('hedge'), 0.14, 0.75, 0.14, hx, 0.85, hz);
            P(self.geo.ball, self.mat('birchleaf'), 0.06, 0.08, 0.06, hx + 0.08, 1.3, hz);
          }
          P(self.geo.box, self.mat('stoneDark'), 1.9, 0.02, 0.02, -3.15, 1.9, -2.7);
          P(self.geo.box, self.mat('stoneDark'), 1.9, 0.02, 0.02, -3.15, 1.9, -1.9);
          break;
        case 'sign':
          P(self.geo.box, self.mat('gold'), 0.6, 0.46, 0.06, 1.95, 1.55, 1.35);
          P(self.geo.box, self.mat('roofTavern'), 0.46, 0.32, 0.07, 1.95, 1.55, 1.35);
          P(self.geo.ball, self.mat('gold'), 0.08, 0.08, 0.08, 1.95, 1.9, 1.35);
          P(self.geo.box, self.mat('lantern'), 0.15, 0.2, 0.15, 1.6, 1.15, 1.25);
          break;
        case 'wing':
          P(self.geo.box, self.mat('stone', 1), 1.7, 0.95, 1.4, 1.4, 0.48, -2.4);
          P(self.geo.box, self.mat('plaster', 0), 1.85, 0.9, 1.55, 1.4, 1.38, -2.4);
          [0.6, 1.4, 2.2].forEach(function (x) { P(self.geo.box, self.mat('trunk'), 0.08, 0.9, 0.04, x, 1.38, -1.62); });
          [0.95, 1.85].forEach(function (x) { P(self.geo.box, self.mat('window'), 0.3, 0.3, 0.04, x, 1.4, -1.6); P(self.geo.box, self.mat('window'), 0.3, 0.3, 0.04, x, 0.5, -1.68); });
          P(self.geo.gable, self.mat('roofTavern'), 1.15, 1.1, 1.1, 1.4, 1.83, -2.4).rotation.y = Math.PI / 2;
          break;
        case 'coach':
          P(self.geo.box, self.mat('roofJo'), 1.0, 0.55, 0.6, 2.4, 0.62, 2.2);
          P(self.geo.box, self.mat('trunk'), 1.05, 0.06, 0.65, 2.4, 0.93, 2.2);
          P(self.geo.box, self.mat('window'), 0.3, 0.25, 0.62, 2.4, 0.7, 2.2);
          [[1.95, 1.88], [2.85, 1.88], [1.95, 2.52], [2.85, 2.52]].forEach(function (w) { P(self.geo.torus, self.mat('wood'), 0.22, 0.22, 0.22, w[0], 0.24, w[1]); });
          P(self.geo.box, self.mat('gold'), 0.08, 0.08, 0.66, 2.4, 0.98, 2.2);
          break;
        case 'snug':
          P(self.geo.box, self.mat('plaster', 2), 0.9, 1.0, 1.3, 2.05, 0.5, -0.2);
          P(self.geo.cone4, self.mat('holdRoof'), 0.85, 0.75, 1.0, 2.05, 1.38, -0.2).rotation.y = Math.PI / 4;
          P(self.geo.box, self.mat('stone', 2), 0.38, 2.2, 0.38, 2.45, 1.1, -0.6);
          P(self.geo.box, self.mat('window'), 0.04, 0.34, 0.5, 2.51, 0.55, 0.0);
          break;
        case 'bunting':
          [[-1.6, 1.5, -2.2, 4.0], [1.6, 1.5, 2.2, 4.0], [-1.6, 1.5, 1.6, 1.5]].forEach(function (l, j) {
            for (var k = 0; k <= 9; k++) {
              var t = k / 9, x = l[0] + (l[2] - l[0]) * t, z = l[1] + (l[3] - l[1]) * t, y = 2.1 - Math.sin(t * Math.PI) * 0.3;
              var f = P(self.geo.cone4, self.mat('flag', k + j), 0.08, 0.16, 0.02, x, y - 0.08, z); f.rotation.x = Math.PI;
            }
          });
          [[-2.2, 4.0], [2.2, 4.0]].forEach(function (q) { P(self.geo.cyl6, self.mat('wood'), 0.04, 2.2, 0.04, q[0], 1.1, q[1]); });
          break;
        case 'cart':
          P(self.geo.box, self.mat('wood'), 0.9, 0.18, 0.6, -1.9, 0.45, 2.0);
          [-0.3, 0.3].forEach(function (dz) { P(self.geo.torus, self.mat('trunk'), 0.25, 0.25, 0.25, -1.9, 0.27, 2.0 + dz * 1.15).rotation.y = Math.PI / 2; });
          for (var bk = 0; bk < 3; bk++) P(self.geo.cyl, self.mat('wood', 1), 0.15, 0.32, 0.15, -2.15 + bk * 0.25, 0.7, 2.0);
          P(self.geo.box, self.mat('wood'), 0.7, 0.05, 0.05, -1.2, 0.5, 2.0);
          break;
        case 'bandstand':
          P(self.geo.cyl6, self.mat('stone', 2), 0.75, 0.25, 0.75, -3.5, 0.12, -0.0 + 3.4);
          for (var c2 = 0; c2 < 6; c2++) { var a2 = c2 / 6 * Math.PI * 2; P(self.geo.cyl6, self.mat('plaster', 0), 0.04, 1.2, 0.04, -3.5 + Math.cos(a2) * 0.62, 0.85, 3.4 + Math.sin(a2) * 0.62); }
          P(self.geo.cone6, self.mat('canvas', 1), 0.9, 0.55, 0.9, -3.5, 1.72, 3.4);
          P(self.geo.ball, self.mat('gold'), 0.07, 0.07, 0.07, -3.5, 2.05, 3.4);
          break;
        case 'tankard':
          P(self.geo.cyl, self.mat('gold'), 0.22, 0.42, 0.22, 0, 3.75, 0);
          P(self.geo.torus, self.mat('gold'), 0.13, 0.13, 0.13, 0.26, 3.75, 0);
          P(self.geo.blob, self.mat('plaster', 0), 0.23, 0.12, 0.23, 0, 4.0, 0);
          P(self.geo.cyl6, self.mat('stoneDark'), 0.04, 0.4, 0.04, 0, 3.4, 0);
          break;
      }
      s.pub.add(o);
      self.pop(o, delay);
    });
  };

  // Weigh-ins build the weight wall at the end of the gate road: one stone pillar per week (the
  // week's average), up to the last 26 weeks, so the pillar tops trace your weight like a chart.
  // A brass rail marks your first weigh-in and the latest pillar wears a gold cap.
  var WALL_WEEKS = 26;
  Town.prototype.addWeight = function (ev, delay) {
    var w = this.st.weight, value = ev.value, self = this, pick = 'statue';
    w.count++;
    if (w.first == null) w.first = value;
    w.prev = w.latest;
    w.latest = value;
    w.weeks = w.weeks || [];
    var key = ev.date ? (function () { var d = new Date(ev.date + 'T12:00:00'); d.setDate(d.getDate() - (d.getDay() + 6) % 7); return d.toISOString().slice(0, 10); })() : 'n' + w.count;
    var last = w.weeks[w.weeks.length - 1];
    var added = !last || last.key !== key;
    if (added) w.weeks.push(last = { key: key, sum: 0, n: 0 });
    last.sum += value; last.n++;
    if (!w.statue) {
      var g = new T.Group();
      g.position.set(STATUE.x, groundY(STATUE.x, STATUE.z), STATUE.z);
      g.rotation.y = Math.atan2(STATUE.x, STATUE.z) + Math.PI; // facing town
      this.part(g, this.geo.box, this.mat('stoneDark'), 5.6, 0.3, 0.7, 0, 0.15, 0, pick);
      this.part(g, this.geo.box, this.mat('stone', 1), 5.8, 0.08, 0.8, 0, 0.32, 0, pick);
      // Little end posts with lanterns.
      [-3.0, 3.0].forEach(function (x) { self.part(g, self.geo.box, self.mat('stone', 0), 0.35, 1.6, 0.35, x, 0.8, 0, pick); self.part(g, self.geo.box, self.mat('lantern'), 0.2, 0.22, 0.2, x, 1.72, 0, pick); });
      this.world.add(g);
      w.statue = { group: g, pillars: null };
      this.pop(g, delay);
    }
    // Redraw the pillars for the latest weeks.
    var W = w.statue;
    if (W.pillars) W.group.remove(W.pillars);
    var pg = W.pillars = new T.Group(); W.group.add(pg);
    var shown = w.weeks.slice(-WALL_WEEKS).map(function (k) { return k.sum / k.n; });
    var lo = Math.min.apply(null, shown.concat([w.first])), hi = Math.max.apply(null, shown.concat([w.first]));
    var span = Math.max(4, hi - lo), mid = (hi + lo) / 2;
    function hAt(v) { return 1.1 + (v - mid) / span * 1.6; }
    var gap = 5.2 / Math.max(8, shown.length);
    shown.forEach(function (v, i) {
      var x = -2.6 + gap * (i + 0.5), h = hAt(v), latest = i === shown.length - 1;
      self.part(pg, self.geo.box, self.mat('stone', i % 2 ? 0 : 2), gap * 0.7, h, 0.3, x, 0.36 + h / 2, 0, pick);
      var cap = self.part(pg, self.geo.box, self.mat(latest ? 'gold' : 'stone', 1), gap * 0.85, 0.07, 0.36, x, 0.36 + h + 0.035, 0, pick);
      if (latest && added && !self.instant) { cap.parent.remove(cap); }
    });
    // The brass rail at your starting weight, in front of the pillars.
    this.part(pg, this.geo.box, this.mat('gold'), 5.4, 0.04, 0.04, 0, 0.36 + hAt(w.first), 0.22, pick);
    if (!this.instant && added) {
      // The new week's pillar grows up from the plinth.
      var lp = pg.children[pg.children.length - 2];
      if (lp) { var full = lp.scale.y; lp.scale.y = 0.01; lp.position.y = 0.36; this.anims.push({ obj: lp, start: performance.now() + delay, dur: 900, from: null, to: new T.Vector3(lp.scale.x, full, lp.scale.z), kind: 'vec' }); this.animTo(lp, 0.36 + full / 2, delay); }
      var gc = this.part(pg, this.geo.box, this.mat('gold'), gap * 0.85, 0.07, 0.36, lp ? lp.position.x : 0, 0.36 + full + 0.035, 0, pick);
      this.pop(gc, delay + 900);
    }
    this.needsRender = true;
  };

  // ---- dogs: the pen ---------------------------------------------------

  // Walks with Minto, Blue or Millie: the pen appears with the first walk, each dog arrives on its
  // first walk and wanders the pen, every walk leaves a toy, 3 walks earns a doghouse, and once the
  // dogs have 10 walks between them an agility jump goes up.
  Town.prototype.addDog = function (name, delay) {
    var D = this.st.dogs, self = this;
    if (!D.pen) {
      var c = DOG_PEN.c, g = new T.Group(), pick = 'dogs';
      g.position.set(c.x, groundY(c.x, c.z), c.z);
      g.rotation.y = Math.atan2(c.x, c.z) + Math.PI;
      var w = DOG_PEN.w, d = DOG_PEN.d, mat = this.mat('woodLight');
      [[0, -d / 2, w, true], [0, d / 2, w, true], [-w / 2, 0, d, false], [w / 2, 0, d, false]].forEach(function (side, si) {
        var len = side[2], steps = Math.round(len / 0.55);
        for (var i = 0; i <= steps; i++) {
          var t = i / steps - 0.5;
          if (si === 1 && Math.abs(t) < 0.1) continue; // gate toward the castle
          self.part(g, self.geo.box, mat, 0.07, 0.5, 0.07, side[3] ? t * len : side[0], 0.25, side[3] ? side[1] : t * len, pick);
        }
        [0.2, 0.42].forEach(function (y) { self.part(g, self.geo.box, mat, side[3] ? len : 0.05, 0.05, side[3] ? 0.05 : len, side[0], y, side[1], pick); });
      });
      this.part(g, this.geo.box, this.mat('soil'), w - 0.3, 0.04, d - 0.3, 0, 0.02, 0, pick);
      this.part(g, this.geo.cyl, this.mat('stoneDark'), 0.28, 0.12, 0.28, w / 2 - 0.7, 0.06, d / 2 - 0.7, pick);
      this.part(g, this.geo.cyl, this.mat('water'), 0.22, 0.02, 0.22, w / 2 - 0.7, 0.13, d / 2 - 0.7, pick);
      this.world.add(g);
      D.pen = g;
      this.pop(g, delay);
    }
    var dog = D.list[name];
    if (!dog) {
      var k = D.order.length, body = new T.Group(), pk = 'dog:' + name, m0 = this.mat('dog:' + name, 0), m1 = this.mat('dog:' + name, 1);
      this.part(body, this.geo.box, m0, 0.62, 0.3, 0.3, 0, 0.42, 0, pk);
      this.part(body, this.geo.box, m1, 0.4, 0.06, 0.24, 0.02, 0.29, 0, pk);
      this.part(body, this.geo.box, m0, 0.28, 0.26, 0.26, 0.36, 0.62, 0, pk);
      this.part(body, this.geo.box, m1, 0.14, 0.1, 0.14, 0.52, 0.56, 0, pk);
      this.part(body, this.geo.box, m0, 0.06, 0.12, 0.08, 0.32, 0.79, 0.09, pk);
      this.part(body, this.geo.box, m0, 0.06, 0.12, 0.08, 0.32, 0.79, -0.09, pk);
      var tail = this.part(body, this.geo.box, m0, 0.22, 0.07, 0.07, -0.38, 0.6, 0, pk); tail.rotation.z = 0.7;
      this.part(tail, this.geo.box, m1, 0.5, 1.3, 1.3, -0.45, 0, 0, pk);
      [-1, 1].forEach(function (sd) {
        self.part(body, self.geo.box, self.mat('swan', 2), 0.03, 0.04, 0.03, 0.5, 0.66, sd * 0.08, pk);           // eyes
      });
      this.part(body, this.geo.box, this.mat('swan', 2), 0.05, 0.05, 0.06, 0.6, 0.57, 0, pk);                  // nose
      this.part(body, this.geo.box, this.mat('flag', name.length), 0.08, 0.05, 0.28, 0.27, 0.5, 0, pk);         // collar
      this.part(body, this.geo.cyl, this.mat('gold'), 0.03, 0.01, 0.03, 0.31, 0.44, 0, pk).rotation.z = Math.PI / 2; // tag
      var legs = [[0.2, 0.1], [0.2, -0.1], [-0.2, 0.1], [-0.2, -0.1]].map(function (l) {
        // Legs pivot at the hip so they can swing.
        var hip = new T.Group(); hip.position.set(l[0], 0.3, l[1]); body.add(hip);
        self.part(hip, self.geo.box, m0, 0.07, 0.3, 0.07, 0, -0.15, 0, pk);
        return hip;
      });
      var sx = (k - 1) * 1.8, sz = (k % 2) * 0.8 - 0.4;
      body.position.set(sx, 0, sz);
      D.pen.add(body);
      dog = D.list[name] = { name: name, n: 0, toys: 0, group: body, tail: tail, legs: legs, x: sx, z: sz, tx: sx, tz: sz, wait: 0, house: false, k: k, speed: 1.1 };
      D.order.push(name);
      this.pop(body, delay);
    }
    dog.n++;
    if (dog.n >= 3 && !dog.house) {
      dog.house = true;
      var h = new T.Group(), hx = (dog.k - 1) * 2.2, hz = -DOG_PEN.d / 2 + 0.8;
      h.position.set(hx, 0, hz);
      this.part(h, this.geo.box, this.mat('dog:' + name, 0), 0.9, 0.6, 0.75, 0, 0.3, 0, 'dog:' + name);
      this.part(h, this.geo.gable, this.mat('roofJo'), 0.6, 0.5, 0.55, 0, 0.6, 0, 'dog:' + name).rotation.y = Math.PI / 2;
      this.part(h, this.geo.box, this.mat('stoneDark'), 0.04, 0.34, 0.3, 0.46, 0.18, 0, 'dog:' + name);
      h.rotation.y = -Math.PI / 2;
      D.pen.add(h);
      this.pop(h, delay + 150);
    }
    if (dog.toys < 10) {
      var r = rng(900 + dog.k * 50 + dog.toys), toy;
      var tx = (r() - 0.5) * (DOG_PEN.w - 1.2), tz = (r() - 0.5) * (DOG_PEN.d - 1.2);
      if (dog.toys % 2) {
        toy = new T.Group();
        this.part(toy, this.geo.box, this.mat('woodLight'), 0.26, 0.05, 0.06, 0, 0, 0, 'dog:' + name);
        this.part(toy, this.geo.ball, this.mat('woodLight'), 0.05, 0.05, 0.05, 0.13, 0, 0.03, 'dog:' + name);
        this.part(toy, this.geo.ball, this.mat('woodLight'), 0.05, 0.05, 0.05, -0.13, 0, 0.03, 'dog:' + name);
      } else toy = this.part(D.pen, this.geo.ball, this.mat('flag', dog.k + dog.toys), 0.08, 0.08, 0.08, 0, 0, 0, 'dog:' + name);
      toy.position.set(tx, 0, tz);
      toy.userData.toy = true;
      if (!toy.parent) D.pen.add(toy);
      this.animDrop(toy, 0.08, delay + 200, 500);
      dog.toys++;
    }
    var total = D.order.reduce(function (n, k) { return n + D.list[k].n; }, 0);
    if (total >= 10 && !D.hurdle) {
      D.hurdle = true;
      var j = new T.Group();
      j.position.set(0, 0, DOG_PEN.d / 2 - 1.1);
      [-0.5, 0.5].forEach(function (x) { self.part(j, self.geo.cyl6, self.mat('flag', 2), 0.04, 0.6, 0.04, x, 0.3, 0, 'dogs'); });
      this.part(j, this.geo.cyl6, this.mat('flag', 0), 0.035, 1.0, 0.035, 0, 0.4, 0, 'dogs').rotation.z = Math.PI / 2;
      D.pen.add(j);
      this.pop(j, delay + 300);
    }
  };
  // ---- the town square grows cozier the more you train ----------------------------------
  var SQUARE_STEPS = [[20, 'Flower planters in the corners'], [40, 'Hanging baskets on the lamps'], [60, 'Bunting along the boardwalk'], [90, 'Caf\u00e9 tables under umbrellas'],
    [120, 'Cobbled paving'], [160, 'A second tier on the fountain'], [210, 'Potted trees on the boardwalk'], [270, 'A town clock'], [350, 'Flower beds round the fountain']];
  Town.prototype.growSquare = function (delay) {
    var s = this.st, S = s.square || (s.square = { n: 0, g: null });
    while (S.n < SQUARE_STEPS.length && s.sessions >= SQUARE_STEPS[S.n][0]) this.squareStep(S.n++, delay);
  };
  Town.prototype.squareStep = function (k, delay) {
    var s = this.st, S = s.square, self = this, Q = TOWN_SQ, pick = 'townsquare';
    if (!S.g) { S.g = new T.Group(); S.g.position.set(Q.x, this.squareY != null ? this.squareY : groundY(Q.x, Q.z), Q.z); this.world.add(S.g); }
    var o = new T.Group(); S.g.add(o);
    function P(geo, mat, sx, sy, sz, x, y, z, par) { return self.part(par || o, geo, mat, sx, sy, sz, x, y, z, pick); }
    var top = 0.1, cx = Q.hx - 0.35, cz = Q.hz - 0.35;
    switch (k) {
      case 0: // planters
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (c, i) {
          var x = c[0] * 3.85, z = c[1] * 2.85;
          P(self.geo.box, self.mat('wood'), 0.62, 0.3, 0.62, x, top + 0.15, z);
          P(self.geo.blob, self.mat('hedge'), 0.3, 0.2, 0.3, x, top + 0.38, z);
          for (var f = 0; f < 6; f++) P(self.geo.ball, self.mat('flag', (f + i) % 5), 0.07, 0.07, 0.07, x + Math.cos(f) * 0.2, top + 0.47, z + Math.sin(f) * 0.2);
        });
        break;
      case 1: // hanging baskets on the corner lamps
        [[-1, -1], [1, -1], [-1, 1], [1, 1]].forEach(function (c, i) {
          var x = c[0] * cx - c[0] * 0.28, z = c[1] * cz - c[1] * 0.28;
          P(self.geo.box, self.mat('stoneDark'), 0.3, 0.02, 0.02, c[0] * cx - c[0] * 0.14, 1.55, c[1] * cz - c[1] * 0.14).rotation.y = Math.atan2(c[1], c[0]) * -1 + Math.PI / 4 * 0;
          P(self.geo.ball, self.mat('wood'), 0.14, 0.09, 0.14, x, 1.3, z);
          P(self.geo.blob, self.mat('hedge'), 0.16, 0.12, 0.16, x, 1.4, z);
          for (var f = 0; f < 5; f++) P(self.geo.ball, self.mat('flag', (f + i) % 5), 0.05, 0.05, 0.05, x + Math.cos(f * 1.3) * 0.14, 1.36 - (f % 2) * 0.08, z + Math.sin(f * 1.3) * 0.14);
        });
        break;
      case 2: // bunting along the east and west boardwalks
        [-1, 1].forEach(function (sd) {
          var x = sd * cx, z0 = -cz, z1 = cz, prev = null, up = new T.Vector3(0, 1, 0);
          for (var b = 0; b <= 16; b++) {
            var t = b / 16, q = new T.Vector3(x, 2.25 - Math.sin(t * Math.PI) * 0.45, z0 + (z1 - z0) * t);
            if (prev) { var dv = q.clone().sub(prev), w = P(self.geo.cyl6, self.mat('stoneDark'), 0.01, dv.length(), 0.01, (q.x + prev.x) / 2, (q.y + prev.y) / 2, (q.z + prev.z) / 2); w.quaternion.setFromUnitVectors(up, dv.normalize()); }
            if (b && b < 16) { var fl = P(self.geo.cone4, self.mat('flag', b), 0.09, 0.16, 0.02, q.x, q.y - 0.09, q.z); fl.rotation.x = Math.PI; fl.rotation.y = Math.PI / 2; }
            prev = q;
          }
        });
        break;
      case 3: // café tables
        [-1, 1].forEach(function (sd, i) {
          var x = sd * 2.5, z = -1.4;
          P(self.geo.cyl, self.mat('wood'), 0.36, 0.05, 0.36, x, top + 0.62, z);
          P(self.geo.cyl6, self.mat('stoneDark'), 0.04, 0.6, 0.04, x, top + 0.3, z);
          P(self.geo.cyl6, self.mat('stoneDark'), 0.025, 1.3, 0.025, x, top + 1.25, z);
          for (var u = 0; u < 8; u++) { var ua = u / 8 * Math.PI * 2; var pan = P(self.geo.cone4, self.mat('canvas', u % 2 ? 0 : 1 + i), 0.36, 0.3, 0.12, x + Math.cos(ua) * 0.32, top + 1.8, z + Math.sin(ua) * 0.32); pan.rotation.y = -ua + Math.PI / 2; pan.rotation.z = Math.PI / 2 - 0.45; }
          P(self.geo.cone, self.mat('canvas', 1 + i), 0.75, 0.3, 0.75, x, top + 1.92, z);
          [-0.5, 0.5].forEach(function (dz) { P(self.geo.box, self.mat('woodLight'), 0.3, 0.04, 0.3, x, top + 0.4, z + dz); P(self.geo.box, self.mat('woodLight'), 0.3, 0.32, 0.04, x, top + 0.58, z + dz + Math.sign(dz) * 0.14); });
          P(self.geo.cyl, self.mat('swan', 0), 0.06, 0.05, 0.06, x + 0.1, top + 0.67, z);
        });
        break;
      case 4: // cobbles over the packed earth, and a stone ring round the fountain
        P(self.geo.box, self.mat('cobble'), Q.hx * 2 - 2.2, 0.03, Q.hz * 2 - 2.2, 0, top + 0.015, 0);
        P(self.geo.cyl, self.mat('stone', 2), 1.7, 0.035, 1.7, 0, top + 0.02, 0);
        for (var cb = 0; cb < 40; cb++) P(self.geo.box, self.mat('stone', cb % 3), 0.32, 0.04, 0.26, ((cb * 37) % 80) / 10 - 4, top + 0.025, ((cb * 53) % 60) / 10 - 3).rotation.y = cb;
        break;
      case 5: // a second tier on the fountain
        P(self.geo.cyl6, self.mat('stone', 1), 0.12, 0.5, 0.12, 0, 1.1, 0);
        P(self.geo.cyl, self.mat('stone', 1), 0.5, 0.12, 0.5, 0, 1.38, 0);
        P(self.geo.cyl, self.mat('water'), 0.43, 0.03, 0.43, 0, 1.45, 0);
        P(self.geo.ball, self.mat('water'), 0.1, 0.2, 0.1, 0, 1.62, 0);
        break;
      case 6: // potted trees on the boardwalk
        [[0, -(Q.hz - 0.5)], [0, Q.hz - 0.5], [-(Q.hx - 0.5), 0], [Q.hx - 0.5, 0]].forEach(function (c) {
          P(self.geo.cyl, self.mat('brick', 1), 0.24, 0.35, 0.24, c[0], 0.4, c[1]);
          P(self.geo.cyl6, self.mat('trunk'), 0.05, 0.6, 0.05, c[0], 0.85, c[1]);
          P(self.geo.blob, self.mat('hedge'), 0.36, 0.42, 0.36, c[0], 1.35, c[1]);
        });
        break;
      case 7: // a town clock on a post
        var ck = new T.Group(); ck.position.set(3.9, 0, -1.2); o.add(ck);
        P(self.geo.cyl6, self.mat('stoneDark'), 0.07, 2.4, 0.07, 0, top + 1.2, 0, ck);
        P(self.geo.box, self.mat('stoneDark'), 0.5, 0.5, 0.16, 0, top + 2.5, 0, ck);
        [-1, 1].forEach(function (sd) {
          var face = P(self.geo.cyl, self.mat('swan', 0), 0.2, 0.02, 0.2, 0, top + 2.5, sd * 0.09, ck); face.rotation.x = Math.PI / 2;
          P(self.geo.box, self.mat('swan', 2), 0.02, 0.15, 0.01, 0, top + 2.55, sd * 0.1, ck);
          P(self.geo.box, self.mat('swan', 2), 0.1, 0.02, 0.01, 0.04, top + 2.5, sd * 0.1, ck);
        });
        P(self.geo.ball, self.mat('gold'), 0.07, 0.07, 0.07, 0, top + 2.82, 0, ck);
        break;
      case 8: // flower beds round the fountain
        for (var fb = 0; fb < 28; fb++) { var fa = fb / 28 * Math.PI * 2; P(self.geo.ball, self.mat(fb % 4 ? 'flag' : 'hedge', fb % 5), 0.09, 0.08, 0.09, Math.cos(fa) * 1.32, top + 0.12, Math.sin(fa) * 1.32); }
        break;
    }
    this.pop(o, delay || 0);
    this.solidAt = 0;
  };
  // ---- townsfolk: mice in their Sunday best -------------------------------------------------
  // They live in your friends' houses, stroll the streets, pop in on each other, sit on the
  // square's benches with the paper, greet you (and each other), and are all home by dark.
  var MOUSE_NAMES = ['Mrs. Whiskers', 'Mr. Pemberton', 'Old Tom', 'Mabel', 'Bramble', 'Fennimore', 'Clementine', 'Bartholomew', 'Primrose', 'Wilfred', 'Hazel', 'Rupert'];
  var HELLOS = ['hello!', 'top of the morning!', 'lovely day for it', 'afternoon, raccoon', 'mind the bins, dear', 'oh! you startled me', 'you\u2019re new around here', 'cheerio!', 'good day to you', 'how do?'];
  var MOUSE_CHAT = ['morning!', 'how do', 'lovely weather', 'did you hear?', 'give my best to the missus', 'quite right', 'see you at the pub'];
  // Walk the street network from one street point to another: up each street to where it
  // branches off its parent, across, and back down.
  function streetChain(si, ti) {
    var out = [{ si: si, ti: ti }], guard = 0;
    while (STREET_PARENT[si] && guard++ < 12) { var par = STREET_PARENT[si]; out.push({ si: par.j, ti: par.k, from: si }); si = par.j; ti = par.k; }
    return out;
  }
  function streetRoute(a, b) {
    var ca = streetChain(a.si, a.ti), cb = streetChain(b.si, b.ti), pts = [];
    function along(si, t0, t1) { var st = STREETS[si], d = t1 >= t0 ? 1 : -1; for (var t = t0; d > 0 ? t <= t1 : t >= t1; t += d * 2) pts.push(st[t]); pts.push(st[t1]); }
    var ib = -1, ia;
    for (ia = 0; ia < ca.length; ia++) { ib = -1; for (var j = 0; j < cb.length; j++) if (cb[j].si === ca[ia].si) { ib = j; break; } if (ib >= 0) break; }
    if (ib < 0) return [STREETS[a.si][a.ti], STREETS[b.si][b.ti]];
    for (var i = 0; i < ia; i++) along(ca[i].si, ca[i].ti, 0);
    along(ca[ia].si, ca[ia].ti, cb[ib].ti);
    for (i = ib - 1; i >= 0; i--) along(cb[i].si, 0, cb[i].ti);
    return pts;
  }
  var SQ_STREET = (function () { var best = null, bd = 1e9; STREETS.forEach(function (st, si) { st.forEach(function (q, ti) { var d = Math.hypot(q.x - TOWN_SQ.x, q.z - TOWN_SQ.z); if (d < bd) { bd = d; best = { si: si, ti: ti }; } }); }); return best; })();
  var MOUSE_JOBS = { postie: 'Percy the postie', barkeep: 'Doris behind the bar', hiker: 'A hiking mouse' };
  Town.prototype.makeMouse = function (k, job) {
    var g = new T.Group(), self = this, name = job ? MOUSE_JOBS[job] + (job === 'hiker' ? ' ' + (k + 1) : '') : MOUSE_NAMES[k % MOUSE_NAMES.length], pick = 'folk:' + name;
    function P(par, geo, mat, sx, sy, sz, x, y, z) { return self.part(par, geo, mat, sx, sy, sz, x, y, z, pick); }
    var fur = this.mat('mouse', k % 3), pink = this.mat('mouse', 3), dark = this.mat('swan', 2), lady = job === 'barkeep' || (!job && k % 2 === 0);
    var cloth = job === 'postie' ? this.mat('flag', 2) : job === 'barkeep' ? this.mat('swan', 0) : job === 'hiker' ? this.mat('flag', 3 + (k % 2)) : this.mat('flag', k);
    var body = new T.Group(); body.position.y = 0.13; g.add(body);
    // Clothes: a dress for some, a waistcoat and trousers for others.
    if (lady) { P(body, this.geo.cone, cloth, 0.11, 0.2, 0.11, 0, 0.06, 0); P(body, this.geo.box, this.mat('swan', 0), 0.1, 0.03, 0.07, 0, 0.12, 0.02); }
    else { P(body, this.geo.box, fur, 0.13, 0.17, 0.1, 0, 0.07, 0); P(body, this.geo.box, cloth, 0.135, 0.11, 0.105, 0, 0.1, 0); P(body, this.geo.box, this.mat('gold'), 0.015, 0.015, 0.01, 0.03, 0.09, 0.055); }
    var head = new T.Group(); head.position.set(0, 0.23, 0.01); body.add(head);
    P(head, this.geo.box, fur, 0.12, 0.1, 0.11, 0, 0, 0);
    P(head, this.geo.cone4, fur, 0.05, 0.09, 0.05, 0, -0.015, 0.09).rotation.x = Math.PI / 2;
    P(head, this.geo.ball, pink, 0.018, 0.018, 0.018, 0, -0.015, 0.135);
    [-1, 1].forEach(function (sd) {
      var ear = P(head, self.geo.cyl, fur, 0.055, 0.015, 0.055, sd * 0.065, 0.075, -0.01); ear.rotation.x = Math.PI / 2;
      var inner = P(head, self.geo.cyl, pink, 0.038, 0.016, 0.038, sd * 0.065, 0.075, -0.003); inner.rotation.x = Math.PI / 2;
      P(head, self.geo.box, dark, 0.02, 0.022, 0.01, sd * 0.032, 0.015, 0.055);
      [0.01, -0.01].forEach(function (wy) { var wh = P(head, self.geo.box, dark, 0.07, 0.003, 0.003, sd * 0.05, -0.02 + wy, 0.1); wh.rotation.y = sd * 0.3; });
    });
    // Hats: a bowler or a bonnet with a flower.
    if (!job && !lady && k % 4 === 1) { P(head, this.geo.cyl, dark, 0.06, 0.05, 0.06, 0, 0.08, 0); P(head, this.geo.cyl, dark, 0.085, 0.008, 0.085, 0, 0.056, 0); }
    if (job === 'postie') {
      // Peaked cap and a satchel full of letters.
      P(head, this.geo.cyl, this.mat('flag', 2), 0.065, 0.04, 0.065, 0, 0.075, 0); P(head, this.geo.box, dark, 0.07, 0.008, 0.05, 0, 0.058, 0.06);
      var bag = P(body, this.geo.box, this.mat('wood'), 0.06, 0.07, 0.1, 0.085, 0.04, 0); P(body, this.geo.box, this.mat('wood'), 0.012, 0.2, 0.012, 0.0, 0.12, 0.05).rotation.z = 0.7;
      P(body, this.geo.box, this.mat('swan', 0), 0.05, 0.035, 0.01, 0.09, 0.08, 0.02);
    }
    if (job === 'barkeep') {
      // Apron, a tea towel over the shoulder, a pint glass to polish.
      P(body, this.geo.box, this.mat('canvas', 1), 0.1, 0.14, 0.01, 0, 0.05, 0.065);
      P(body, this.geo.box, this.mat('canvas', 0), 0.04, 0.08, 0.02, -0.07, 0.15, 0.02);
    }
    if (job === 'hiker') {
      // Bucket hat, a big pack and a walking stick.
      P(head, this.geo.cyl, this.mat('leaf', 2), 0.07, 0.035, 0.07, 0, 0.07, 0); P(head, this.geo.cyl, this.mat('leaf', 2), 0.09, 0.006, 0.09, 0, 0.055, 0);
      P(body, this.geo.box, this.mat('flag', 4 - (k % 3)), 0.12, 0.16, 0.08, 0, 0.12, -0.09); P(body, this.geo.cyl, this.mat('canvas', 2), 0.035, 0.12, 0.035, 0, 0.22, -0.09).rotation.z = Math.PI / 2;
    }
    if (!job && lady && k % 4 === 2) { var bn = P(head, this.geo.ball, this.mat('canvas', 0), 0.075, 0.05, 0.075, 0, 0.05, -0.015); P(head, this.geo.ball, this.mat('flag', 0), 0.018, 0.018, 0.018, 0.05, 0.07, 0.02); }
    var arms = [-1, 1].map(function (sd) { var a = new T.Group(); a.position.set(sd * 0.075, 0.16, 0); body.add(a); P(a, self.geo.box, lady ? fur : cloth, 0.03, 0.1, 0.03, 0, -0.05, 0); P(a, self.geo.box, pink, 0.028, 0.02, 0.028, 0, -0.105, 0); return a; });
    var legs = [-1, 1].map(function (sd) { var l = new T.Group(); l.position.set(sd * 0.035, 0.13, 0); g.add(l); P(l, self.geo.box, lady ? fur : self.mat('stoneDark'), 0.035, 0.12, 0.035, 0, -0.06, 0); P(l, self.geo.box, pink, 0.04, 0.015, 0.06, 0, -0.123, 0.012); return l; });
    // A long pink tail.
    var tail = new T.Group(); tail.position.set(0, 0.06, -0.05); body.add(tail);
    for (var tsg = 0; tsg < 4; tsg++) { var ts = P(tail, this.geo.box, pink, 0.012, 0.012, 0.08, 0, -tsg * 0.012, -0.04 - tsg * 0.075); ts.rotation.x = tsg * 0.15; }
    // The newspaper, kept folded away until they sit down.
    var paper = new T.Group(); paper.position.set(0, 0.17, 0.09); body.add(paper); paper.visible = false;
    P(paper, this.geo.box, this.mat('paper', 0), 0.2, 0.15, 0.006, 0, 0, 0);
    for (var ln = 0; ln < 4; ln++) P(paper, this.geo.box, this.mat('paper', 1), ln ? 0.15 : 0.17, ln ? 0.006 : 0.018, 0.008, 0, 0.05 - ln * 0.025, 0.001);
    // An umbrella for rainy days (in the left paw), and a ghost sheet for Halloween week.
    var umb = new T.Group(); umb.position.set(0, -0.1, 0); arms[0].add(umb); umb.visible = false;
    P(umb, this.geo.cyl6, dark, 0.008, 0.36, 0.008, 0, 0.17, 0);
    P(umb, this.geo.cone, this.mat('flag', k + 2), 0.2, 0.09, 0.2, 0, 0.38, 0);
    var ghost = new T.Group(); ghost.visible = false; body.add(ghost);
    P(ghost, this.geo.cone, this.mat('swan', 0), 0.14, 0.42, 0.14, 0, 0.13, 0);
    P(ghost, this.geo.ball, this.mat('swan', 0), 0.1, 0.1, 0.1, 0, 0.32, 0);
    [-1, 1].forEach(function (sd) { P(ghost, self.geo.box, dark, 0.03, 0.04, 0.01, sd * 0.035, 0.33, 0.095); });
    P(ghost, this.geo.box, dark, 0.035, 0.02, 0.01, 0, 0.28, 0.095);
    if (job === 'hiker') { var stick = P(arms[1], this.geo.cyl6, this.mat('wood'), 0.01, 0.4, 0.01, 0, -0.1, 0.03); stick.rotation.x = 0.2; }
    if (job === 'barkeep') { var glass = new T.Group(); glass.position.set(0, -0.11, 0.04); arms[1].add(glass); P(glass, this.geo.cyl, this.mat('beer', 2), 0.03, 0.07, 0.03, 0, 0, 0); }
    g.scale.setScalar(1.15);
    this.world.add(g);
    return { g: g, body: body, head: head, arms: arms, legs: legs, tail: tail, paper: paper, umbrella: umb, ghost: ghost, name: name, phase: k, k: k, job: job };
  };
  Town.prototype.stepMice = function (dt, now) {
    var s = this.st, self = this;
    if (this.soft) return;
    if (!s.folk || (now > (this.folkAt || 0) && s.folk.length < 10)) {
      // A mouse for each house on a street (up to ten); new houses get theirs as they go up.
      this.folkAt = now + 3000;
      var have = (s.folk || []).map(function (m) { return m.house; });
      var homes = Object.keys(s.friends).map(function (k) { return s.friends[k]; }).filter(function (f) { return f.group && !f.tent && !f.jo && f.spot && f.spot.si != null && have.indexOf(f) < 0; });
      s.folk = (s.folk || []).concat(homes.slice(0, 10 - (s.folk || []).length).map(function (f, k0) {
        var k = have.length + k0;
        var m = self.makeMouse(k), sp = f.spot, fx = Math.sin(sp.face), fz = Math.cos(sp.face);
        m.home = { door: { x: sp.x + fx * 1.0, z: sp.z + fz * 1.0 }, si: sp.si, ti: sp.ti };
        m.homeName = Object.keys(s.friends).filter(function (n) { return s.friends[n] === f; })[0];
        m.state = 'inside'; m.wait = 1 + k * 2.5 + Math.random() * 3; m.g.visible = false;
        m.g.position.set(m.home.door.x, groundY(m.home.door.x, m.home.door.z), m.home.door.z);
        m.house = f;
        return m;
      }));
    }
    var folk = s.folk, night = this.dark, P = this.explore && this.player ? this.player.g.position : null;
    var spooky = this.halloweenWeek(), rain = this.weatherNow === 'rain', winter = this.season === 'winter';
    this.dressMice(folk, spooky, rain);
    this.stepJobMice(dt, now, spooky, rain);
    if (winter) this.stepSnowmen(dt, now); else if (s.snowmen) s.snowmen.forEach(function (sm) { sm.g.visible = false; });
    folk.forEach(function (m) {
      var g = m.g;
      if (m.state === 'inside') {
        g.visible = false;
        m.wait -= dt;
        if (m.wait <= 0 && !night) { m.state = 'idle'; g.visible = true; g.position.set(m.home.door.x, groundY(m.home.door.x, m.home.door.z), m.home.door.z); self.pop(g, 0); }
        return;
      }
      // Greet the raccoon (once in a while), then carry on.
      if (P && m.state !== 'sit' && now > (m.helloAt || 0) && Math.hypot(P.x - g.position.x, P.z - g.position.z) < 1.8) {
        m.helloAt = now + 25000; m.greet = 1.8;
        var pl = self.player, line = spooky ? 'trick or treat!' : pl.tipsy && now < pl.tipsy ? 'someone\u2019s had a few' : pl.carry && pl.carry.kind === 'beer' ? 'bit early for that, isn\u2019t it?' : pl.cig ? 'filthy habit, that' : night ? 'evening!' : HELLOS[Math.floor(Math.random() * HELLOS.length)];
        self.say(line, g, 0.65, 2.0);
        // Halloween: a sweet for the raccoon.
        if (spooky && pl) setTimeout(function () { self.carryItem(pl, 'candy'); self.say('a sweetie!', pl.g, 1.0, 1.4); self.sfx('found'); }, 900);
      }
      if (m.greet > 0) {
        m.greet -= dt;
        if (P) { var gy = Math.atan2(P.x - g.position.x, P.z - g.position.z), dg = gy - g.rotation.y; while (dg > Math.PI) dg -= Math.PI * 2; while (dg < -Math.PI) dg += Math.PI * 2; g.rotation.y += dg * Math.min(1, dt * 8); }
        m.arms[1].rotation.x = -2.6 + Math.sin(now / 90) * 0.4; m.arms[1].rotation.z = 0.3;                          // a wave
        m.legs.forEach(function (l) { l.rotation.x *= 0.8; });
        return;
      }
      m.arms[1].rotation.z = 0;
      if (m.state === 'build') {
        // Rolling and patting the snowman into shape.
        var sm = m.dest.sm;
        sm.prog = Math.min(1, sm.prog + dt / 30);
        g.rotation.y = Math.atan2(sm.x - g.position.x, sm.z - g.position.z);
        m.arms.forEach(function (a, i) { a.rotation.x = -1.2 + Math.sin(now / 160 + i * 2) * 0.5; });
        m.body.rotation.x = 0.3;
        if (sm.prog >= 1 || night) {
          sm.builder = null; m.body.rotation.x = 0; m.arms.forEach(function (a) { a.rotation.x = 0; });
          if (sm.prog >= 1) self.say(['ta-da!', 'a fine fellow', 'needs a scarf'][Math.floor(Math.random() * 3)], g, 0.65, 1.6);
          m.state = 'idle';
        }
        return;
      }
      if (m.state === 'sit') {
        // On the bench with the paper: turning a page now and then, glancing up.
        m.wait -= dt;
        m.paper.rotation.y = Math.sin(now / 1800 + m.k) * 0.15; m.head.rotation.x = 0.25 + Math.sin(now / 2500 + m.k) * 0.1;
        if (Math.floor(now / 4000 + m.k) % 5 === 0) m.paper.rotation.z = Math.sin(now / 120) * 0.08; else m.paper.rotation.z = 0;
        if (m.wait <= 0 || night) {
          m.state = 'idle'; m.paper.visible = false; m.seat.taken = null; m.seat = null; m.body.position.y = 0.13; m.legs.forEach(function (l) { l.rotation.x = 0; }); m.arms.forEach(function (a) { a.rotation.x = 0; }); m.head.rotation.x = 0;
        }
        return;
      }
      if (m.state === 'idle') {
        // Decide where to next: a neighbour's, a bench on the square, or home (always home by dark).
        var r = Math.random(), dest, route, from = m.at || { si: m.home.si, ti: m.home.ti };
        var needs = winter && s.snowmen ? s.snowmen.filter(function (sm) { return sm.prog < 1 && !sm.builder; }) : [];
        if (night) dest = { kind: 'home' };
        else if (needs.length && r < 0.5) { var sm0 = needs[Math.floor(Math.random() * needs.length)]; sm0.builder = m; dest = { kind: 'snowman', sm: sm0 }; }
        else if (r < 0.35) { var bench = (self.seats || []).filter(function (q) { return !q.taken && inTownSquare(q.x, q.z, 1); })[Math.floor(Math.random() * 4)]; dest = bench ? { kind: 'bench', seat: bench } : { kind: 'home' }; }
        else if (r < 0.75) { var other = folk[Math.floor(Math.random() * folk.length)]; dest = { kind: 'visit', who: other }; }
        else dest = { kind: 'home' };
        var to = dest.kind === 'bench' || dest.kind === 'snowman' ? SQ_STREET : dest.kind === 'visit' ? { si: dest.who.home.si, ti: dest.who.home.ti } : { si: m.home.si, ti: m.home.ti };
        var start = from.door || (m.at ? null : m.home.door);
        route = (m.state === 'idle' && g.position ? [{ x: g.position.x, z: g.position.z }] : []).concat(streetRoute(from, to));
        var end = dest.kind === 'snowman' ? { x: dest.sm.x + 0.45, z: dest.sm.z + 0.2 } : dest.kind === 'bench' ? dest.seat : dest.kind === 'visit' ? dest.who.home.door : m.home.door;
        route.push({ x: end.x, z: end.z });
        if (dest.kind === 'bench') { dest.seat.taken = m; }
        m.route = route; m.ri = 1; m.dest = dest; m.state = 'walk'; m.at = to;
        return;
      }
      if (m.state === 'walk') {
        var tgt = m.route[m.ri];
        if (!tgt) { arrive(m); return; }
        var dx = tgt.x - g.position.x, dz = tgt.z - g.position.z, d = Math.hypot(dx, dz);
        if (d < 0.08) { m.ri++; return; }
        var sp = Math.min(d, dt * 0.95);
        g.position.x += dx / d * sp; g.position.z += dz / d * sp; g.position.y = self.standY(g.position.x, g.position.z);
        var want = Math.atan2(dx, dz), dr = want - g.rotation.y; while (dr > Math.PI) dr -= Math.PI * 2; while (dr < -Math.PI) dr += Math.PI * 2; g.rotation.y += dr * Math.min(1, dt * 7);
        m.phase += dt * 11;
        m.legs.forEach(function (l, i) { l.rotation.x = Math.sin(m.phase + i * Math.PI) * 0.6; });
        m.arms.forEach(function (a, i) { a.rotation.x = Math.sin(m.phase + (1 - i) * Math.PI) * 0.4; });
        m.body.position.y = 0.13 + Math.abs(Math.sin(m.phase)) * 0.015;
        m.tail.rotation.y = Math.sin(m.phase * 0.5) * 0.3;
        // Passing a neighbour in the street: a word or two.
        folk.forEach(function (o) {
          if (o === m || o.state !== 'walk' || now < (m.chatAt || 0) || now < (o.chatAt || 0)) return;
          if (Math.hypot(o.g.position.x - g.position.x, o.g.position.z - g.position.z) < 1.0) {
            m.chatAt = o.chatAt = now + 30000;
            self.say(MOUSE_CHAT[Math.floor(Math.random() * MOUSE_CHAT.length)], g, 0.65, 1.6);
            setTimeout(function () { self.say(MOUSE_CHAT[Math.floor(Math.random() * MOUSE_CHAT.length)], o.g, 0.65, 1.6); }, 900);
          }
        });
      }
    });
    function arrive(m) {
      var D = m.dest;
      m.legs.forEach(function (l) { l.rotation.x = 0; }); m.arms.forEach(function (a) { a.rotation.x = 0; });
      if (D.kind === 'snowman') { m.state = 'build'; return; }
      if (D.kind === 'bench') {
        // Sit, open the paper.
        var q = D.seat;
        m.g.position.set(q.x - Math.cos(q.rot) * 0.28, q.y - 0.12, q.z + Math.sin(q.rot) * 0.28); m.g.rotation.y = q.rot;
        m.body.position.y = 0.06; m.legs.forEach(function (l) { l.rotation.x = -1.4; });
        m.arms.forEach(function (a, i) { a.rotation.x = -1.2; a.rotation.z = (i ? -1 : 1) * 0.35; });
        m.paper.visible = true; m.seat = q; m.state = 'sit'; m.wait = 15 + Math.random() * 20;
      } else {
        // In the door, for a cup of tea (or bed).
        m.state = 'inside'; m.wait = night ? 5 : 8 + Math.random() * 18;
        if (D.kind === 'visit' && !night) self.say(Math.random() < 0.5 ? 'yoo-hoo!' : '*knock knock*', m.g, 0.65, 1.2);
        if (D.kind === 'home') m.at = null;
      }
    }
    this.needsRender = true;
  };
  // Halloween week (the 24th to the 31st of October): costumes on.
  Town.prototype.halloweenWeek = function () {
    if (!this.today) return false;
    var m = +this.today.slice(5, 7), d = +this.today.slice(8, 10);
    return m === 10 && d >= 24;
  };
  Town.prototype.dressMice = function (list, spooky, rain) {
    list.forEach(function (m) {
      if (m.ghost.visible !== spooky) { m.ghost.visible = spooky; m.head.visible = !spooky; }
      var u = rain && m.state !== 'inside' && m.state !== 'sit' && !m.job;
      if (m.umbrella.visible !== u) { m.umbrella.visible = u; }
      if (u) { m.arms[0].rotation.x = -0.6; m.umbrella.rotation.x = 0.6; }
    });
  };
  // ---- snowmen: in winter the mice build them on the square and outside their houses ---------
  Town.prototype.stepSnowmen = function (dt, now) {
    var s = this.st, self = this;
    if (!s.snowmen) {
      var Q = TOWN_SQ, spots = [{ x: Q.x - 3.4, z: Q.z - 0.6 }, { x: Q.x + 3.4, z: Q.z + 0.4 }];
      (s.folk || []).slice(0, 3).forEach(function (m) { var d = m.home.door, a = Math.atan2(d.x, d.z); spots.push({ x: d.x + Math.cos(a) * 0.9, z: d.z - Math.sin(a) * 0.9 }); });
      s.snowmen = spots.map(function (p, i) {
        var g = new T.Group(); g.position.set(p.x, groundY(p.x, p.z), p.z); g.rotation.y = i;
        var snow = self.mat('swan', 0), coal = self.mat('swan', 2);
        var b0 = self.part(g, self.geo.ball, snow, 0.22, 0.2, 0.22, 0, 0.18, 0), b1 = self.part(g, self.geo.ball, snow, 0.16, 0.15, 0.16, 0, 0.47, 0), b2 = self.part(g, self.geo.ball, snow, 0.11, 0.11, 0.11, 0, 0.68, 0);
        var bits = new T.Group(); g.add(bits);
        self.part(bits, self.geo.cone, self.mat('flag', 4), 0.025, 0.12, 0.025, 0, 0.68, 0.14).rotation.x = Math.PI / 2;
        [-1, 1].forEach(function (sd) { self.part(bits, self.geo.box, coal, 0.025, 0.025, 0.02, sd * 0.04, 0.72, 0.1); var arm = self.part(bits, self.geo.cyl6, self.mat('trunk'), 0.01, 0.28, 0.01, sd * 0.25, 0.52, 0); arm.rotation.z = sd * 1.1; });
        self.part(bits, self.geo.cyl, coal, 0.08, 0.1, 0.08, 0, 0.82, 0); self.part(bits, self.geo.cyl, coal, 0.12, 0.012, 0.12, 0, 0.77, 0);
        self.part(bits, self.geo.cyl, self.mat('flag', i), 0.12, 0.035, 0.12, 0, 0.6, 0);
        self.world.add(g);
        return { g: g, x: p.x, z: p.z, balls: [b0, b1, b2], bits: bits, prog: i < 2 ? 0.2 + Math.random() * 0.5 : 1, shown: -1 };
      });
    }
    s.snowmen.forEach(function (sm) {
      sm.g.visible = true;
      var p = sm.prog;
      if (Math.abs(p - sm.shown) < 0.01) return;
      sm.shown = p;
      // Bottom, middle, head, then the finishing touches.
      [[0, 0.35], [0.35, 0.65], [0.65, 0.85]].forEach(function (r, i) { var k = Math.max(0, Math.min(1, (p - r[0]) / (r[1] - r[0]))); sm.balls[i].visible = k > 0; sm.balls[i].scale.setScalar(1).multiplyScalar(0.0001 + k); sm.balls[i].scale.set([0.22, 0.16, 0.11][i] * k + 0.0001, [0.2, 0.15, 0.11][i] * k + 0.0001, [0.22, 0.16, 0.11][i] * k + 0.0001); });
      sm.bits.visible = p >= 0.95;
      self.needsRender = true;
    });
  };
  // ---- mice with jobs: the postie, the barkeep, and hikers after you've been up a mountain ----
  Town.prototype.stepJobMice = function (dt, now, spooky, rain) {
    var s = this.st, self = this, J = s.jobMice || (s.jobMice = {}), night = this.dark, view = this.viewDate || s.lastDate;
    var P = this.explore && this.player ? this.player.g.position : null;
    function walkTo(m, tgt, speed) {
      var g = m.g, dx = tgt.x - g.position.x, dz = tgt.z - g.position.z, d = Math.hypot(dx, dz);
      if (d < 0.08) return true;
      var stp = Math.min(d, dt * (speed || 0.95));
      g.position.x += dx / d * stp; g.position.z += dz / d * stp; g.position.y = self.standY(g.position.x, g.position.z);
      var want = Math.atan2(dx, dz), dr = want - g.rotation.y; while (dr > Math.PI) dr -= Math.PI * 2; while (dr < -Math.PI) dr += Math.PI * 2; g.rotation.y += dr * Math.min(1, dt * 7);
      m.phase += dt * 11;
      m.legs.forEach(function (l, i) { l.rotation.x = Math.sin(m.phase + i * Math.PI) * 0.6; });
      m.arms.forEach(function (a, i) { if (!(i === 0 && m.umbrella.visible)) a.rotation.x = Math.sin(m.phase + (1 - i) * Math.PI) * 0.4; });
      m.body.position.y = 0.13 + Math.abs(Math.sin(m.phase)) * 0.015;
      return false;
    }
    function still(m) { m.legs.forEach(function (l) { l.rotation.x *= 0.8; }); }
    var all = [];
    // The barkeep: out front of the pub, polishing a glass; she pours your pints.
    if (s.pub) {
      if (!J.barkeep) { J.barkeep = this.makeMouse(5, 'barkeep'); }
      var bk = J.barkeep, bp = s.pub.localToWorld(new T.Vector3(0.9, 0, 2.85));
      bk.g.visible = true; bk.g.position.set(bp.x, groundY(bp.x, bp.z), bp.z); bk.g.rotation.y = s.pub.rotation.y;
      bk.arms[1].rotation.x = -1.1 + Math.sin(now / 300) * 0.25; bk.arms[0].rotation.x = -1.0 + Math.cos(now / 300) * 0.25;
      if (bk.pour > 0) { bk.pour -= dt; bk.arms[1].rotation.x = -2.0; }
      all.push(bk);
    }
    // The postie: on a day you trained with friends, a round of their houses with the letters.
    var due = view && s.friendDays && s.friendDays[view] ? s.friendDays[view] : null;
    if (due && !night) {
      if (!J.postie) { J.postie = this.makeMouse(2, 'postie'); J.postie.g.position.set(TOWN_SQ.x, groundY(TOWN_SQ.x, TOWN_SQ.z), TOWN_SQ.z); }
      var pm = J.postie;
      pm.g.visible = true; all.push(pm);
      if (!pm.route || pm.rest > 0) {
        if (pm.rest > 0) { pm.rest -= dt; still(pm); }
        else {
          // Plan the round: house to house along the streets, then back to the square.
          var stops = due.map(function (h) { var f = s.friends[h]; return f && f.spot && f.spot.si != null ? f.spot : null; }).filter(Boolean);
          var route = [{ x: TOWN_SQ.x, z: TOWN_SQ.z }], at = SQ_STREET;
          stops.forEach(function (sp) { route = route.concat(streetRoute(at, { si: sp.si, ti: sp.ti })); route.push({ x: sp.x + Math.sin(sp.face) * 1.0, z: sp.z + Math.cos(sp.face) * 1.0, drop: true }); at = { si: sp.si, ti: sp.ti }; });
          route = route.concat(streetRoute(at, SQ_STREET)); route.push({ x: TOWN_SQ.x, z: TOWN_SQ.z });
          pm.route = route; pm.ri = 0;
        }
      } else {
        var tg = pm.route[pm.ri];
        if (!tg) { pm.route = null; pm.rest = 40; }
        else if (pm.wait > 0) { pm.wait -= dt; still(pm); pm.arms[1].rotation.x = -1.4; }
        else if (walkTo(pm, tg, 1.15)) { if (tg.drop) { pm.wait = 1.5; self.say(['post!', 'letter for you!', 'parcel!', 'sign here, please'][Math.floor(Math.random() * 4)], pm.g, 0.65, 1.4); } pm.ri++; }
      }
    } else if (J.postie) J.postie.g.visible = false;
    // Hikers: for a couple of days after a hike, a little party out on the ridge trail.
    var hikeDays = s.lastHike && view ? (new Date(view + 'T12:00:00') - new Date(s.lastHike + 'T12:00:00')) / 86400000 : 99;
    var trail = PATHS[5] && PATHS[5].pts;
    if (hikeDays >= 0 && hikeDays <= 2 && !night && trail) {
      if (!J.hikers) J.hikers = [0, 1, 2].map(function (i) { var h = self.makeMouse(i, 'hiker'); h.ti = Math.floor(trail.length * 0.3) + i * 3; h.dir = 1; var q = trail[h.ti]; h.g.position.set(q.x, groundY(q.x, q.z), q.z); return h; });
      J.hikers.forEach(function (h) {
        h.g.visible = true; all.push(h);
        if (h.wait > 0) { h.wait -= dt; still(h); return; }
        var q = trail[h.ti];
        if (walkTo(h, q, 0.75)) {
          h.ti += h.dir;
          if (h.ti >= trail.length - 1 || h.ti <= 0) { h.dir = -h.dir; h.ti = Math.max(0, Math.min(trail.length - 1, h.ti)); h.wait = 3; self.say(h.dir < 0 ? 'what a view!' : 'onward!', h.g, 0.65, 1.6); }
        }
      });
    } else if (J.hikers) J.hikers.forEach(function (h) { h.g.visible = false; });
    // Job mice greet you too, in their own way.
    all.forEach(function (m) {
      if (!P || now < (m.helloAt || 0) || Math.hypot(P.x - m.g.position.x, P.z - m.g.position.z) > 1.8) return;
      m.helloAt = now + 25000;
      self.say(spooky ? 'boo!' : m.job === 'barkeep' ? 'the usual, love?' : m.job === 'postie' ? 'nothing for you today' : 'lovely day for a hike!', m.g, 0.65, 1.8);
    });
    this.dressMice(all, spooky, rain);
  };
  // Dogs trot around the pen with moving legs and wagging tails: they sniff, sit, nose their
  // toys and now and then break into zoomies.
  Town.prototype.walkDogs = function (dt, now) {
    var D = this.st.dogs, W = DOG_PEN.w - 1.2, Dd = DOG_PEN.d - 1.6, self = this, chase = null;
    // A raccoon near the pen: every dog in there goes absolutely bananas.
    if (this.explore && this.player && D.pen) {
      var pp = this.player.g.position, pc = DOG_PEN.c;
      if (Math.hypot(pp.x - pc.x, pp.z - pc.z) < 7.5) { chase = D.pen.worldToLocal(pp.clone()); chase.x = Math.max(-W / 2, Math.min(W / 2, chase.x)); chase.z = Math.max(-Dd / 2, Math.min(Dd / 2, chase.z)); }
    }
    D.order.forEach(function (name, k) {
      var g = D.list[name], body = g.group, t = now / 1000 + k * 1.7;
      if (chase) {
        g.wait = 0; g.mood = 'zoom'; g.speed = 3.4; g.target = null;
        g.tx = chase.x + (k - 1) * 0.5; g.tz = chase.z;
        if (now > (g.barkAt || 0)) { g.barkAt = now + 1200 + Math.random() * 1800; self.bark(name, true); }
      }
      if (g.wag > 0) g.wag -= dt;
      g.tail.rotation.y = Math.sin(t * (g.wag > 0 ? 30 : g.wait > 0 ? 9 : 14)) * 0.6;
      var hopY = 0;
      if (g.hop > 0) { g.hop -= dt; hopY = Math.sin(Math.max(0, g.hop) / 0.45 * Math.PI) * 0.35; }
      if (g.wait > 0) {
        g.wait -= dt;
        // Sitting or sniffing: head dips, legs still.
        body.rotation.z = g.mood === 'sit' ? 0.25 : 0;
        body.position.y = (g.mood === 'sniff' ? Math.abs(Math.sin(t * 6)) * 0.02 : 0) + hopY;
        g.legs.forEach(function (l) { l.rotation.z = 0; });
        return;
      }
      body.rotation.z = 0;
      var dx = g.tx - g.x, dz = g.tz - g.z, dist = Math.hypot(dx, dz);
      if (dist < 0.06) {
        var r = Math.random();
        if (r < 0.15) { g.speed = 3.2; g.mood = 'zoom'; g.wait = 0; }            // zoomies
        else { g.speed = 1.1; g.mood = r < 0.45 ? 'sit' : 'sniff'; g.wait = 0.8 + Math.random() * 2.5; }
        var toy = D.pen.children.filter(function (c) { return c.userData.toy; });
        if (r > 0.75 && toy.length) { var tt = toy[Math.floor(Math.random() * toy.length)]; g.tx = tt.position.x; g.tz = tt.position.z; g.target = tt; }
        else { g.tx = (Math.random() - 0.5) * W; g.tz = (Math.random() - 0.5) * Dd; g.target = null; }
        return;
      }
      var step = Math.min(dist, (g.speed || 1.1) * dt);
      g.x += dx / dist * step; g.z += dz / dist * step;
      var gait = t * (g.speed > 2 ? 22 : 13);
      body.position.set(g.x, Math.abs(Math.sin(gait)) * (g.speed > 2 ? 0.12 : 0.05) + hopY, g.z);
      body.rotation.y = -Math.atan2(dz, dx);
      g.legs.forEach(function (l, i) { l.rotation.z = Math.sin(gait + (i % 2 ? Math.PI : 0) + (i > 1 ? Math.PI / 2 : 0)) * 0.6; });
      // Nudge a toy when arriving at it.
      if (g.target && dist < 0.4) { g.target.position.x += dx / dist * 0.5; g.target.position.z += dz / dist * 0.5; g.target = null; }
    });
  };

  // ---- snowboarding: runs on the snow mountain ---------------------------

  // Each snowboard day carves a new run down the face (green, blue, then black), up to 18;
  // after that, days add to the lodge. The chairlift and lodge go up with the first day.
  Town.prototype.addSnowboard = function (ev, delay) {
    var S = this.st.snow, c = SNOW.c, y0 = groundY(c.x, c.z) - 0.2, self = this;
    S.days++;
    var laps = ev.laps || 0;
    S.laps += laps; S.best = Math.max(S.best, laps);
    var season = ev.date ? (+ev.date.slice(5, 7) >= 8 ? ev.date.slice(0, 4) + '–' + String(+ev.date.slice(2, 4) + 1) : String(+ev.date.slice(0, 4) - 1) + '–' + ev.date.slice(2, 4)) : 'Undated';
    var se = S.seasons[season] = S.seasons[season] || { days: 0, laps: 0 };
    se.days++; se.laps += laps;
    // The first days build the chairlift, a tower at a time; once it runs, each day cuts a run.
    if (!S.lift) this.buildLift(delay);
    if (S.lift.built < LIFT_TOWERS) { this.addLiftTower(delay); return; }
    var k = S.runs.length;
    if (k < SNOW.runs) {
      // The two back peaks rise while the back-side and mid-mountain runs go in.
      this.setSkiSats(Math.min(1, Math.max(0, (k - 17) / 6)), Math.min(1, Math.max(0, (k - 23) / 6)));
      var spec = skiRun(k), wig = 1.3 + (k % 4) * 0.5;
      var pts = [];
      for (var t = spec.t0; t <= 0.98; t += 0.03) {
        var d = spec.R * t, a = spec.a + Math.sin(t * wig * 5 + k) * 0.09 * (1 - t * 0.5);
        var x = spec.cx + Math.cos(a) * d, z = spec.cz + Math.sin(a) * d;
        pts.push({ x: x, z: z, y: this.skiY(x, z) + 0.12 });
      }
      var group = new T.Group();
      group.position.set(c.x, this.skiBase(), c.z);
      var top = pts[0];
      var post = [this.part(group, this.geo.cyl6, this.mat('wood'), 0.04, 0.7, 0.04, top.x, top.y + 0.35, top.z, 'snow'),
        this.part(group, this.geo.box, this.mat('run', k % 3), 0.3, 0.3, 0.05, top.x, top.y + 0.8, top.z, 'snow')];
      post[0].userData.dy = 0.35; post[1].userData.dy = 0.8;
      var run = { group: group, pts: pts, k: k, post: post, where: spec.where };
      this.layRun(run);
      this.world.add(group);
      S.runs.push(run);
      if (!this.instant) { group.position.y = this.skiBase() + 30; this.animDrop(group, this.skiBase(), delay, 700); }
    } else if ((S.days - SNOW.runs) % 10 === 0) {
      this.addLodgeFloor(delay);
    }
  };
  // Where each run goes: 18 down the front from the summit, 6 down the back, 6 starting halfway
  // up the sides, then 6 on each of the back peaks once they've risen.
  function skiRun(k) {
    if (k < 18) return { cx: 0, cz: 0, R: SNOW.R, t0: 0.1, a: SNOW_FACE + ((k % 9) - 4) * 0.17 + (k >= 9 ? 0.085 : 0), where: 'front' };
    if (k < 24) return { cx: 0, cz: 0, R: SNOW.R, t0: 0.1, a: SNOW_FACE + Math.PI + (k - 18 - 2.5) * 0.19, where: 'back' };
    if (k < 30) { var j = k - 24, sd = j % 2 ? 1 : -1; return { cx: 0, cz: 0, R: SNOW.R, t0: 0.48, a: SNOW_FACE + sd * (1.2 + Math.floor(j / 2) * 0.18), where: 'mid' }; }
    var sp = SKI_SATS[k < 36 ? 0 : 1], i = (k - 30) % 6;
    return { cx: sp.x, cz: sp.z, R: sp.R, t0: 0.12, a: sp.a + (i - 2.5) * 0.24, where: k < 36 ? 'peak2' : 'peak3' };
  }
  // Lays a run's surface: groomed snow above the snow line, a mown grass strip below it.
  Town.prototype.layRun = function (run) {
    var self = this;
    (run.ribbons || []).forEach(function (m) { run.group.remove(m); m.geometry.dispose(); });
    run.ribbons = [];
    var line = SKI_SNOWLINE[this.season] * SNOW.H + 0.04;
    var snowPts = run.pts.filter(function (p) { return p.y >= line; }), grassPts = run.pts.filter(function (p) { return p.y < line + 0.3; });
    [[snowPts, 'groomed', 0.16], [grassPts, 'skirun', 0]].forEach(function (set) {
      if (set[0].length < 2) return;
      var lift = set[1] === 'groomed' ? 0.22 : 0.06;
      var pts = set[0].map(function (p) { return { x: p.x, z: p.z, y: p.y + lift }; });
      var rib = self.ribbon(pts, 1.05, self.mat(set[1]));
      var stripe = self.ribbon(pts.map(function (p) { return { x: p.x, z: p.z, y: p.y + 0.02 }; }), 0.16, self.mat('run', run.k % 3));
      [rib, stripe].forEach(function (m) { m.userData.pick = 'snow'; self.picks.push(m); run.group.add(m); run.ribbons.push(m); });
    });
  };
  // A flat ribbon that follows a list of points (used for ski runs).
  Town.prototype.ribbon = function (pts, width, mat) {
    var pos = [], idx = [];
    pts.forEach(function (p, i) {
      var q = pts[Math.min(i + 1, pts.length - 1)], o = pts[Math.max(i - 1, 0)];
      var dx = q.x - o.x, dz = q.z - o.z, l = Math.hypot(dx, dz) || 1, nx = -dz / l * width / 2, nz = dx / l * width / 2;
      pos.push(p.x + nx, p.y, p.z + nz, p.x - nx, p.y, p.z - nz);
      if (i) { var b = (i - 1) * 2; idx.push(b, b + 1, b + 2, b + 1, b + 3, b + 2); }
    });
    var g = new T.BufferGeometry();
    g.setAttribute('position', new T.Float32BufferAttribute(pos, 3));
    g.setIndex(idx);
    g.computeVertexNormals();
    var m = new T.Mesh(g, mat);
    m.receiveShadow = true;
    m.material.side = T.DoubleSide;
    return m;
  };
  var LIFT_TOWERS = 7;
  // Lodge and the empty lift line go in on the first day; towers follow, then cable and chairs.
  Town.prototype.buildLift = function (delay) {
    var S = this.st.snow, c = SNOW.c, y0 = groundY(c.x, c.z) - 0.2, g = new T.Group();
    g.position.set(c.x, y0, c.z);
    var a = SNOW_FACE + 0.95, spots = [];
    for (var i = 0; i < LIFT_TOWERS; i++) {
      var d = SNOW.R * (0.96 - i * 0.14), x = Math.cos(a) * d, z = Math.sin(a) * d;
      spots.push({ x: x, z: z, y: this.skiY(x, z) });
    }
    this.world.add(g);
    S.lift = { group: g, spots: spots, towers: [], built: 0, side: new T.Vector3(-Math.sin(a), 0, Math.cos(a)).multiplyScalar(0.4), a: a, chairs: [] };
    var la = SNOW_FACE - 0.35, lx = c.x + Math.cos(la) * (SNOW.R + 2.4), lz = c.z + Math.sin(la) * (SNOW.R + 2.4);
    var lodge = new T.Group();
    lodge.position.set(lx, groundY(lx, lz), lz);
    lodge.rotation.y = Math.atan2(lx - c.x, lz - c.z);
    var roof = new T.Group();
    this.part(roof, this.geo.gable, this.mat('roof', 3), 1.5, 1.2, 1.3, 0, 0, 0, 'snow');
    this.part(roof, this.geo.box, this.mat('stone', 2), 0.25, 0.8, 0.25, 0.6, 0.5, -0.3, 'snow');
    lodge.add(roof);
    this.world.add(lodge);
    S.lodge = { group: lodge, roof: roof };
    this.addLodgeFloor(delay);
  };
  Town.prototype.addLiftTower = function (delay) {
    var L = this.st.snow.lift, sp = L.spots[L.built], t = new T.Group();
    t.position.set(sp.x, sp.y, sp.z);
    this.part(t, this.geo.cyl6, this.mat('stoneDark'), 0.08, 2.2, 0.08, 0, 1.1, 0, 'snow');
    this.part(t, this.geo.box, this.mat('stoneDark'), 0.9, 0.08, 0.08, 0, 2.2, 0, 'snow').rotation.y = -L.a;
    if (L.built === 0 || L.built === LIFT_TOWERS - 1) this.part(t, this.geo.box, this.mat('roof', 1), 1.2, 0.9, 1.0, 0, 0.45, 0, 'snow'); // stations
    L.group.add(t);
    L.towers.push(new T.Vector3(sp.x, sp.y + 2.15, sp.z));
    L.built++;
    if (!this.instant) { t.position.y = sp.y + 12; this.animDrop(t, sp.y, delay); }
    if (L.built === LIFT_TOWERS) this.finishLift(delay + 500);
  };
  // Cables between tower tops, one up and one down, and chairs to ride them.
  Town.prototype.finishLift = function (delay) {
    var L = this.st.snow.lift, g = new T.Group(), self = this, towers = L.towers;
    [1, -1].forEach(function (sgn) {
      for (var i = 0; i < towers.length - 1; i++) {
        var p0 = towers[i].clone().addScaledVector(L.side, sgn), p1 = towers[i + 1].clone().addScaledVector(L.side, sgn);
        var mid = p0.clone().add(p1).multiplyScalar(0.5), len = p0.distanceTo(p1);
        var cab = self.part(g, self.geo.box, self.mat('stoneDark'), len, 0.03, 0.03, mid.x, mid.y, mid.z);
        cab.rotation.set(0, -Math.atan2(p1.z - p0.z, p1.x - p0.x), Math.atan2(p1.y - p0.y, Math.hypot(p1.x - p0.x, p1.z - p0.z)));
      }
    });
    for (var i = 0; i < 10; i++) {
      var ch = new T.Group();
      this.part(ch, this.geo.box, this.mat('flag', 0), 0.32, 0.06, 0.24, 0, -0.45, 0);
      this.part(ch, this.geo.box, this.mat('stoneDark'), 0.03, 0.45, 0.03, 0, -0.22, 0);
      g.add(ch);
      L.chairs.push(ch);
    }
    L.group.add(g);
    this.pop(g, delay);
  };
  Town.prototype.addLodgeFloor = function (delay) {
    var S = this.st.snow, L = S.lodge, FHL = 1.0, floor = new T.Group();
    this.part(floor, this.geo.box, this.mat('wood'), 2.4, FHL, 1.8, 0, FHL / 2, 0, 'snow');
    for (var w = -1; w <= 1; w++) this.part(floor, this.geo.box, this.mat('window'), 0.34, 0.34, 0.04, w * 0.7, FHL * 0.55, 0.91);
    L.group.add(floor);
    this.animDrop(floor, S.floors * FHL, delay);
    S.floors++;
    this.animTo(L.roof, S.floors * FHL, delay + (this.instant ? 0 : 480));
  };
  Town.prototype.moveChairs = function (now) {
    var L = this.st.snow.lift;
    if (!L || !L.chairs.length) return;
    var T0 = L.towers, segs = T0.length - 1, n = L.chairs.length;
    L.chairs.forEach(function (ch, i) {
      var u = ((now / 26000) + i / n) % 1, up = u < 0.5, f = up ? u * 2 : (1 - u) * 2;
      ch.userData.u = u;
      var pos = f * segs, k = Math.min(segs - 1, Math.floor(pos)), t = pos - k;
      ch.position.lerpVectors(T0[k], T0[k + 1], t).addScaledVector(L.side, up ? 1 : -1);
      ch.position.y -= 0.05;
    });
  };

  // ---- public ---------------------------------------------------------

  Town.prototype.climbUnits = function (ev) {
    if (ev.elev) return Math.max(0.5, ev.elev / 250);
    return 1 + (ev.km || 0) / 16;
  };

  Town.prototype.add = function (ev, delay) {
    this.needsRender = true;
    delay = delay || 0;
    var s = this.st, self = this;
    var mark = function (k) { s.last[k] = ev; };
    if (ev.date && (!s.lastDate || ev.date > s.lastDate)) s.lastDate = ev.date;
    if (ev.kind !== 'drink' && ev.kind !== 'weight' && ev.kind !== 'social' && ev.kind !== 'bible' && ev.kind !== 'book' && ev.kind !== 'movie') { s.sessions++; this.growSquare(delay); }
    switch (ev.kind) {
      case 'lift':
        ev.groups.forEach(function (g, i) {
          var tw = self.liftSession(g, delay + i * 120);
          mark('tower:' + g); mark(tw.pick);
          var n = (ev.prs && ev.prs[g]) || 0;
          s.towers[g].prs += n;
          tw.prEv = n > 0 ? { day: ev.day, label: ev.label, n: n, lines: (ev.prLines && ev.prLines[g]) || [] } : null;
          self.setPrFlag(g, n > 0, delay + i * 120, tw);
        });
        s.lifts++;
        s.prs += ev.prCount || 0;
        s.tonnage += ev.tonnage || 0;
        this.castleMilestones(delay);
        this.markBatch();
        mark('castle');
        break;
      case 'run': this.addRun(ev, delay); mark('run'); break;
      case 'snowboard': this.addSnowboard(ev, delay); mark('snow'); break;
      case 'bike': s.bike.km += ev.km; s.bike.sessions++; var c0 = s.bike.crops.length; this.addBike(ev, delay); this.endurancePRs('ride', ev, s.bike.crops[c0] || s.bike.crops[s.bike.crops.length - 1], delay); this.markBatch(); this.updateSheep(ev, delay); mark('bike'); break;
      case 'commute': this.addCommute(ev.km, delay, ev.date); mark('commute'); break;
      case 'row': s.row.km += ev.km; s.row.sessions++; this.addRow(delay); mark('row'); break;
      case 'swim': this.addSwim(ev, delay); mark('swim'); break;
      case 'xcski': this.addNordic(ev, delay); mark('nordic'); break;
      // Mountain bike rides farm like any ride, and build the bike park too.
      case 'mtb': s.bike.km += ev.km || 15; s.bike.sessions++; var m0 = s.bike.crops.length; this.addBike(ev, delay); this.endurancePRs('ride', ev, s.bike.crops[m0] || s.bike.crops[s.bike.crops.length - 1], delay); this.markBatch(); this.updateSheep(ev, delay); mark('bike'); this.addMtb(ev, delay); mark('mtb'); break;
      case 'hike': if (ev.date) s.lastHike = ev.date; s.hike.km += ev.km; s.hike.sessions++; s.hike.elev += ev.elev || 0; this.addClimb(this.climbUnits(ev), delay); mark('hike'); break;
      case 'stairs': s.stairs.n++; this.addClimb(0.5, delay); mark('hike'); break;
      case 'walk': s.walk.km += ev.km; s.walk.sessions++; this.addWalk(ev.km, delay); mark('walk'); break;
      case 'sport': this.addSport(ev.sport, delay); mark('sport:' + ev.sport); break;
      case 'mobility': this.addCrop(delay); mark('farm'); break;
      case 'movie': this.addMovie(ev); mark('cinema'); break;
      case 'drink': s.drinks += ev.count; this.addDrink(ev.count, delay); mark('pub'); break;
      case 'weight': this.addWeight(ev, delay); mark('statue'); break;
      case 'social': s.social++; break;
      case 'bible': this.addBible(ev, delay); mark('church'); break;
      case 'book': this.addBook(ev, delay); mark('library'); break;
    }
    // Couples share a house: a workout with both counts once for the household.
    var homes = [];
    (ev.friends || []).forEach(function (f) { var h = HOUSEHOLDS[f.toLowerCase()] || f; if (homes.indexOf(h) < 0) homes.push(h); });
    homes.forEach(function (f, i) { self.addFriend(f, delay + 150 + i * 90); mark('friend:' + f); });
    // Which houses get post: the days you worked out with them.
    if (ev.date && homes.length) { var fd = s.friendDays = s.friendDays || {}; fd[ev.date] = (fd[ev.date] || []).concat(homes.filter(function (h) { return (fd[ev.date] || []).indexOf(h) < 0; })); }
    (ev.dogs || []).forEach(function (d, i) { self.addDog(d, delay + 200 + i * 90); mark('dog:' + d); mark('dogs'); });
    if (ev.kind === 'lift' && ev.bests) for (var bk in ev.bests) s.best[bk] = Math.max(s.best[bk] || 0, ev.bests[bk]);
    this.checkSecrets(ev, delay);
    this.updateWildlife(delay, ev);
    this.markBatch();
    if (this.wallsDirty && this.instant) { this.rebuildWalls(); this.wallsDirty = false; }
    else if (this.wallsDirty) { this.wallsAt = performance.now() + delay + 700; }
  };

  // ---- batching ------------------------------------------------------
  // The farmland and the forest run to thousands of little pieces, so once they settle they're drawn
  // as one merged mesh per material. The originals stay (hidden) for hovering and for growing; any
  // change marks the batch dirty and it's rebuilt once nothing is animating.
  var BATCH_PICKS = { bike: 1, run: 1, tower: 1, commute: 1, walk: 1, sport: 1 };
  Town.prototype.markBatch = function () { this.batchDirty = true; this.batchMarked = performance.now(); };
  Town.prototype.rebatch = function () {
    this.batchDirty = false;
    var self = this, groups = {}, inv = new T.Matrix4(), nm = new T.Matrix3(), mw = new T.Matrix4(), v = new T.Vector3();
    (this.batchMeshes || []).forEach(function (m) { if (m.parent) m.parent.remove(m); m.geometry.dispose(); });
    this.batchMeshes = [];
    this.world.updateMatrixWorld(true);
    inv.copy(this.world.matrixWorld).invert();
    (function walk(o) {
      if (o.visible === false && !o.userData.inBatch) return;
      if (o.isMesh && !o.isInstancedMesh && BATCH_PICKS[String(o.userData.pick).split(':')[0]] && !o.material.transparent) {
        o.visible = false; o.userData.inBatch = true;
        (groups[o.material.uuid] = groups[o.material.uuid] || { mat: o.material, list: [] }).list.push(o);
      }
      for (var i = 0; i < o.children.length; i++) walk(o.children[i]);
    })(this.world);
    Object.keys(groups).forEach(function (k) {
      var G = groups[k], nv = 0, ni = 0, vo = 0, io = 0;
      G.list.forEach(function (m) { var g = m.geometry; nv += g.attributes.position.count; ni += g.index ? g.index.count : g.attributes.position.count; });
      var pos = new Float32Array(nv * 3), nor = new Float32Array(nv * 3), idx = nv > 65535 ? new Uint32Array(ni) : new Uint16Array(ni);
      G.list.forEach(function (m) {
        var g = m.geometry, P = g.attributes.position, N = g.attributes.normal, i;
        mw.multiplyMatrices(inv, m.matrixWorld); nm.getNormalMatrix(mw);
        for (i = 0; i < P.count; i++) {
          v.fromBufferAttribute(P, i).applyMatrix4(mw); pos[(vo + i) * 3] = v.x; pos[(vo + i) * 3 + 1] = v.y; pos[(vo + i) * 3 + 2] = v.z;
          v.fromBufferAttribute(N, i).applyMatrix3(nm).normalize(); nor[(vo + i) * 3] = v.x; nor[(vo + i) * 3 + 1] = v.y; nor[(vo + i) * 3 + 2] = v.z;
        }
        if (g.index) for (i = 0; i < g.index.count; i++) idx[io++] = g.index.getX(i) + vo;
        else for (i = 0; i < P.count; i++) idx[io++] = i + vo;
        vo += P.count;
      });
      var geo = new T.BufferGeometry();
      geo.setAttribute('position', new T.BufferAttribute(pos, 3));
      geo.setAttribute('normal', new T.BufferAttribute(nor, 3));
      geo.setIndex(new T.BufferAttribute(idx, 1));
      geo.computeBoundingSphere();
      var mesh = new T.Mesh(geo, G.mat);
      mesh.castShadow = mesh.receiveShadow = true;
      self.world.add(mesh); self.batchMeshes.push(mesh);
    });
    this.needsRender = true;
  };

  Town.prototype.build = function (events, upto) {
    this.needsRender = true;
    this.reset();
    this.instant = true;
    for (var i = 0; i < upto; i++) this.add(events[i], 0);
    this.instant = false;
    this.rebuildWalls();
    this.wallsDirty = false;
    this.rebatch();
    this.fit.auto = true;
    this.fitDirty = true;
  };

  // Pull the camera back as the tallest thing in town grows, so towers can rise for years.
  Town.prototype.updateFit = function () {
    this.fitDirty = false;
    var top = 9;
    for (var k in this.st.towers) top = Math.max(top, this.towerTop(this.st.towers[k]) + 3);
    this.st.hike.peaks.forEach(function (pk) { if (pk) top = Math.max(top, pk.h + 1.5); });
    if (this.st.commute.office) top = Math.max(top, this.st.commute.floors * 0.9 + 1.5);
    for (k in this.st.friends) top = Math.max(top, (this.st.friends[k].floors || 0) * FH + 2);
    var half = this.baseHalf || 19;
    var targetY = Math.max(1.5, (0.85 * top - 16) / 1.7);
    var need = Math.max(half, targetY * 0.85 + 18, (top - targetY) * 0.85 + 4);
    var zoom = Math.min(1, half / need, half / 23);
    zoom = Math.min(zoom, (half * this.aspect) / 40);
    this.fit.zoom = zoom;
    this.fit.y = targetY;
    this.controls.minZoom = Math.min(0.5, zoom * 0.3); // far enough out to see the outlying castles
  };

  Town.prototype.info = function (key) {
    var s = this.st, p = key.split(':'), last = s.last[p[0] === 'balloon' ? 'bike' : key];
    var tail = last ? 'Last: ' + last.day + ' · ' + last.label : '';
    var km = function (v) { return Math.round(v) + ' km'; };
    var plural = function (n, w) { return n + ' ' + w + (n === 1 ? '' : 's'); };
    switch (p[0]) {
      case 'endpr': {
        var EP = (s.endPRs || [])[+p[1]];
        if (!EP) return null;
        return { title: EP.kind === 'run' ? 'Run PR!' : 'Ride PR!', lines: [EP.day + ' \u00b7 ' + EP.label].concat(EP.lines.map(function (l) { return '\u2605 ' + l; }), ['Worked out from your ' + (EP.kind === 'run' ? 'runs' : 'rides') + ' so far.']) };
      }
      case 'cinema': {
        var CF = s.cinema.films, cn = CF.length, cnext = CINEMA_STEPS.filter(function (x) { return cn < x[0]; })[0], ratedF = CF.filter(function (f) { return f.stars != null; });
        return { title: 'The picture house', lines: ['Click for your film list.', plural(cn, 'film') + (ratedF.length ? ' \u00b7 average ' + (ratedF.reduce(function (a, f) { return a + f.stars; }, 0) / ratedF.length).toFixed(1) + '\u2605' : ''), cnext ? 'Next: ' + cnext[1].toLowerCase() + ' at ' + cnext[0] + ' films.' : 'The cinema is complete.'] };
      }
      case 'planned': {
        var pl = this.planned || [];
        return { title: 'Planned this week', lines: pl.map(function (e) { return e.day + ' \u00b7 ' + e.label; }).slice(0, 10).concat(['Turn the cell green in your sheet once it\u2019s done and it builds for real.']) };
      }
      case 'prflag': {
        var pc = +(p[2] || 0), ptw = pc ? s.castles[pc] && s.castles[pc].towers[p[1]] : s.towers[p[1]], pe = ptw && ptw.prEv;
        if (!pe) return null;
        return { title: 'PR! ' + ptw.def.name, lines: [pe.day + ' \u00b7 ' + pe.label, plural(pe.n, 'new personal record') + ' that session:'].concat(pe.lines.slice(0, 5).map(function (l) { return '\u2605 ' + l; }), [
          pe.lines.length > 5 ? '+ ' + (pe.lines.length - 5) + ' more' : '', plural(ptw.prs, 'PR') + ' on this tower all-time. The flag flies until your next session here without a PR.']) };
      }
      case 'tower':
        var ci = +(p[2] || 0), C = ci ? s.castles[ci] : null, tw = C ? C.towers[p[1]] : s.towers[p[1]], next = (Math.floor(tw.n / TIER) + 1) * TIER;
        if (C) return { title: C.name + ': ' + tw.def.name.toLowerCase(), lines: [plural(tw.n, 'layer') + (tw.bailey ? ' · ' + plural(tw.bailey.done, 'bailey piece') : ''), C.style.vibe,
          'Lifting sessions build here once the castles before it are complete. Its towers rise evenly, with halls and turrets when they get ahead, plus upgrades of its own (tap the walls or gate).', s.last[key] ? 'Last: ' + s.last[key].day + ' · ' + s.last[key].label : ''] };
        return { title: tw.def.name, lines: [plural(tw.n, 'session') + ' · ' + plural(tw.prs, 'PR') + ' all-time',
          tw.n ? (tw.flying ? 'Flag flying: your last session here set a PR.' : 'No flag: your last session here didn’t set a PR.') : '',
          tw.features.length ? 'Added so far: ' + tw.features.join(', ') + '.' : '',
          'Next addition (' + FEATURE_NAMES[Math.floor(tw.n / TIER) % 4] + ') at ' + next + ' layers.',
          tw.def.key === 'full' ? '' : 'Height limit right now: ' + Math.min(MAX_LAYERS, this.towerCap()) + ' layers (rises with all your lifting, up to ' + MAX_LAYERS + '). Extra sessions build halls and turrets beside it' + (tw.bailey ? ': ' + tw.bailey.done + ' built so far.' : '.') + ' After that, a new castle starts on the hill.',
          tail || 'Empty plot. Log one of these to start building.'] };
      case 'secret':
        var sc = SECRET_BY_ID[p[1]], extra = '';
        if (p[1] === 'windmill' && s.mill) extra = plural(s.streaks || 1, 'seven-day streak') + ' so far. ' + (s.mill.n + 1 < MILL_STEPS.length ? 'At ' + MILL_AT[s.mill.n + 1] + ' streaks it gets ' + MILL_STEPS[s.mill.n + 1] + '.' : 'The mill village is complete.');
        if (p[1] === 'wizard' && s.wiz) extra = 'Level ' + s.wiz.level + ' of ' + WIZ_MAX + '. ' + (s.wiz.level < WIZ_MAX ? 'At ' + (s.wiz.level + 1) * 100 + ' workouts the wizard adds ' + WIZ_STEPS[s.wiz.level + 1] + '.' : 'The wizard village is complete.');
        return { title: sc.title, lines: [sc.text, extra, 'Secret: ' + sc.hint] };
      case 'sheep':
        var SH = s.sheep;
        return { title: 'The sheep pasture', lines: [plural(SH.list.length, 'sheep').replace('sheeps', 'sheep') + ' · one for every Strava ride over 100 km.',
          SH.list.length >= 60 ? 'The pasture is full.' : 'Your next 100 km+ ride brings another sheep.', SH.list.length < 10 ? 'A shepherd\u2019s hut comes at 10 sheep.' : SH.list.length < 25 ? 'A sheepdog comes at 25 sheep.' : ''] };
      case 'church':
        var BB = s.bible, nextC = CHURCH_STAGES.filter(function (x) { return BB.chapters < x[0]; })[0];
        return { title: 'The church', lines: [fmtN(BB.chapters) + ' of 1,189 chapters read (' + (BB.chapters / BIBLE_TOTAL * 100).toFixed(1) + '%) · ' + plural(BB.books.length, 'book') + ' of 66 finished.',
          'Every chapter builds; every finished book lights a stained-glass window.' + (BB.books.length ? ' Lit so far: ' + BB.books.map(function (bi) { return BIBLE[bi][0]; }).join(', ') + '.' : ''),
          nextC ? 'Next: ' + nextC[1].toLowerCase() + ' at ' + fmtN(nextC[0]) + ' chapters.' : 'The church is complete.', s.last.church ? 'Last: ' + s.last.church.day + ' · ' + s.last.church.label : ''] };
      case 'folk': {
        var mo = (this.st.folk || []).filter(function (q) { return q.name === p[1]; })[0];
        return mo ? { title: mo.name, lines: ['Lives at the ' + mo.homeName + ' house.', mo.state === 'sit' ? 'Reading the paper.' : mo.state === 'inside' ? 'Popped indoors.' : 'Out and about.'] } : null;
      }
      case 'fox': return { title: 'Jo the fox', lines: ['Jo, mostly round her house, sometimes off exploring.'] };
      case 'library':
        var LB = s.library, nextL = LIBRARY_STAGES.filter(function (x) { return LB.pages < x[0]; })[0];
        if (!LB.books.length) return { title: 'The library', lines: ['This plot is kept for your library.', 'Finish a book in your book tracker and it starts with a reading nook.'] };
        var real = LB.books.filter(function (b) { return !b.projected; });
        return { title: 'The library', lines: ['Click for your bookshelf: covers, ratings and reviews.', plural(LB.books.length, 'book') + ' · ' + fmtN(LB.pages) + ' pages' + (real.length < LB.books.length ? ' (' + (LB.books.length - real.length) + ' projected)' : ''),
          nextL ? 'Next: ' + nextL[1].toLowerCase() + ' at ' + fmtN(nextL[0]) + ' pages.' : 'The library is complete.'] };
      case 'raccoon': return { title: 'The raccoon', lines: ['That\u2019s you. You follow whichever castle is being built.'] };
      case 'townsquare': {
        var SQ = this.st.square || { n: 0 }, done = SQUARE_STEPS.slice(0, SQ.n).map(function (x) { return x[1].toLowerCase(); }), nx = SQUARE_STEPS[SQ.n];
        return { title: 'The town square', lines: ['It gets a little cozier with every workout (' + this.st.sessions + ' so far).', done.length ? 'So far: ' + done.join(', ') + '.' : 'Nothing added yet.', nx ? 'Next: ' + nx[1].toLowerCase() + ' at ' + nx[0] + ' workouts.' : 'The square is complete.'] };
      }
      case 'square': return { title: 'The town square', lines: ['The library, the picture house and the Slow Pour all open onto it.', 'Have a seat by the fountain.'] };
      case 'rink': return { title: 'The hockey rink', lines: ['Kept clear for your winter hockey. Your first game floods the rink.', 'Write "hockey" in a Morning or Evening cell, or log it in Strava.'] };
      case 'castle':
        if (p[1]) {
          var CC = s.castles[+p[1]], ms = CC.style.milestones;
          var bl = ms.filter(function (m) { return CC.done[m[1]]; }).map(function (m) { return m[2].toLowerCase(); });
          var nm2 = ms.filter(function (m) { return !CC.done[m[1]]; })[0];
          return { title: CC.name, lines: [CC.style.vibe, plural(CC.lifts, 'lifting session') + ' built here.',
            bl.length ? 'Built: ' + bl.join(', ') + '.' : 'Just foundations so far.',
            nm2 ? 'Next: ' + nm2[2].toLowerCase() + ' at ' + nm2[0] + ' sessions here.' : 'Every upgrade here is built.'] };
        }
        var nextM = CASTLE_MILESTONES.filter(function (m) { return s.lifts < m[0]; })[0];
        var built = CASTLE_MILESTONES.filter(function (m) { return s.lifts >= m[0]; }).map(function (m) { return m[2].toLowerCase(); });
        return { title: 'The castle', lines: [plural(s.lifts, 'lifting session') + ' in all.' + (s.baileyPieces ? ' ' + plural(s.baileyPieces, 'bailey piece') + ' built around it.' : '') + (s.castles.filter(Boolean).length ? ' Other castles: ' + s.castles.filter(Boolean).map(function (C) { return C.name; }).join(', ') + '.' : ''),
          built.length ? 'Built: ' + built.join(', ') + '.' : 'Walls rise between towers as they grow.',
          nextM ? 'Next: ' + nextM[2].toLowerCase() + ' at ' + nextM[0] + ' sessions.' : 'Every castle upgrade is built.'] };
      case 'run':
        var f = s.forest, mix = Object.keys(f.kinds).map(function (k) { return f.kinds[k] + ' ' + TREE_NAMES[k]; }).join(', ');
        var gl = Object.keys(GROVES).filter(function (k) { return f.groves && f.groves[k] && f.groves[k].length; }).map(function (k) { return f.groves[k].length + ' in ' + GROVES[k].name; });
        return { title: 'The running forest', lines: [plural(f.runs, 'run') + ' · ' + km(f.km) + ' · ' + plural(f.trees.length, 'tree'),
          'Every run plants a tree, plus one more for each 5 km. Short or interval runs grow birches, 5\u201310 km road runs maples, 10 km+ giant oaks, trail runs spruces, a half marathon or more a sequoia. Longer runs grow bigger trees.',
          gl.length ? 'Groves: ' + gl.join(', ') + '.' : '',
          f.trees.length < FOREST.length ? (FOREST.length - f.trees.length) + ' spots left in the forest, then the wild woods spread out across the countryside.' : (f.wild || 0) < WILD.length ? 'The forest is full, so new trees spread into the wild woods: ' + (WILD.length - (f.wild || 0)) + ' spots left there.' : 'Every spot is planted, so new runs make each grove\u2019s smallest trees grow.', tail] };
      case 'bike':
        var fl = s.bike.fields, cur = fl[fl.length - 1], left = cur ? cur.cols * cur.rows - cur.n : 0;
        return { title: 'The farmland', lines: [plural(s.bike.sessions, 'ride') + ' · ' + km(s.bike.km) + ' · ' + plural(s.bike.crops.length, 'crop') + ' in ' + plural(fl.length, 'field'),
          'Each ride sows a crop per 5 km. ' + (fl.length >= FIELDS.length && !left ? 'Every field is planted, so rides now make crops bigger.' : (cur ? left + ' more crops until the next field is ploughed.' : '')),
          'A new barn every 8 fields. Rides of ' + BALLOON_KM + ' km or more also launch a balloon. Rides come from Strava (not tagged Commute).', tail] };
      case 'balloon':
        var b = s.bike.balloons[+p[1]];
        return { title: 'Long ride balloon', lines: [b.ev.day + ' · ' + b.ev.label, km(b.ev.km) + (b.ev.elev ? ' · ' + Math.round(b.ev.elev) + ' m climbed' : ''), plural(s.bike.balloons.length, 'balloon') + ' in the sky. Bigger rides fly bigger balloons.'] };
      case 'commute':
        var c = s.commute;
        return { title: 'The commuter lane', lines: [plural(c.n, 'commute') + ' · ' + km(c.km),
          c.n < LANE_STONES ? 'Lane ' + Math.round(c.n / LANE_STONES * 100) + '% built: ' + (LANE_STONES - c.n) + ' more cobbles to reach the office.' : (c.stage >= OFFICE_STAGES.length ? 'Lane complete and the institute is finished: ' + OFFICE_STAGES.join(', ').toLowerCase() + '.' : 'Lane complete. The office grows grander: next, ' + OFFICE_STAGES[c.stage].toLowerCase() + ' in ' + (officeStageAt(c.stage) - (c.n - LANE_STONES)) + ' more commutes.'),
          'One cobble per Strava ride tagged Commute; commute every weekday and Friday\u2019s cobble is gold' + (c.golden ? ' (' + plural(c.golden, 'golden week') + ' so far).' : '.'), tail] };
      case 'harbour':
      case 'row':
        var RH = s.row, nh = HARBOUR_STEPS.filter(function (x) { return RH.km < x[0]; })[0], hb = HARBOUR_STEPS.filter(function (x) { return RH.km >= x[0]; }).map(function (x) { return x[1].toLowerCase(); });
        return { title: 'The harbour', lines: [plural(RH.sessions, 'outing') + ' · ' + km(RH.km), hb.length ? 'Built: ' + hb.join(', ') + '.' : 'Your first row or paddle builds a jetty.', nh ? 'Next: ' + nh[1].toLowerCase() + ' at ' + nh[0] + ' km.' : 'The harbour is complete.', tail] };
      case 'swim':
        var SW = s.swim, ns = SWIM_STEPS[SW.n], sb = SWIM_STEPS.slice(0, SW.n).map(function (x) { return x[1].toLowerCase(); });
        return { title: 'The swimming dock', lines: [plural(SW.sessions, 'swim') + ' \u00b7 ' + km(SW.km), 'Built: ' + sb.join(', ') + '.', ns ? 'Next: ' + ns[1].toLowerCase() + ' at ' + ns[0] + ' km.' : 'The lido is complete.', 'Swims come from Strava.', tail] };
      case 'nordic':
        var NO = s.nordic, nn = NORDIC_STEPS[NO.n], nb = NORDIC_STEPS.slice(0, NO.n).map(function (x) { return x[1].toLowerCase(); }), done = Math.min(1, (3 + NO.km * 0.3) / NORDIC.len);
        return { title: 'The ski cabin trail', lines: [plural(NO.sessions, 'ski day') + ' \u00b7 ' + km(NO.km), done >= 1 ? 'The trail runs all the way round to the lookout.' : 'The trail is ' + Math.round(done * 100) + '% of the way round the lake; every km skied lays more of it, and every 25 km plants a spruce.',
          'Built: ' + nb.join(', ') + '.', nn ? 'Next: ' + nn[1].toLowerCase() + ' at ' + nn[0] + ' km.' : 'Everything on the trail is built.', 'Cross-country ski days come from Strava.', tail] };
      case 'mtb':
        var MB = s.mtb, nm = MTB_STEPS[MB.n], mb = MTB_STEPS.slice(0, MB.n).map(function (x) { return x[1].toLowerCase(); });
        return { title: 'The bike shop', lines: [plural(MB.rides, 'mountain bike ride') + ' \u00b7 ' + km(MB.km), 'Built: ' + mb.join(', ') + '.', nm ? 'Next: ' + nm[1].toLowerCase() + ' at ' + nm[0] + ' rides.' : 'The bike shop is complete.', 'Mountain bike rides come from Strava, and they sow the farmland too.', tail] };
      case 'wild':
        var sp = WILDLIFE.filter(function (w) { return w.key === p[1]; })[0], seen = WILDLIFE.filter(function (w) { return s.wild.have[w.key]; }).length;
        var nextW = this.nextWildlife();
        return { title: sp ? sp.title : 'Wildlife', lines: [sp ? sp.text : '', sp ? 'Arrived with ' + sp.how + '.' : '', seen + ' of ' + WILDLIFE.length + ' kinds of wildlife in Yukon.' + (nextW ? ' Closest next: ' + nextW.title.toLowerCase() + ', ' + nextW.have + ' of ' + nextW.how + '.' : '')] };
      case 'island':
        var IS = s.island;
        return { title: 'The island', lines: ['One more thing for every full year you keep logging: ' + plural(IS ? IS.n : 0, 'year') + ' so far.', IS && IS.n + 1 < ISLAND_STEPS.length ? 'Next year: ' + ISLAND_STEPS[IS.n + 1] + '.' : ''] };
      case 'railway':
        var RW = s.rail;
        var names = RW ? RW.stations.map(function (ci) { return STATION_NAMES[ci] || 'a halt'; }) : [];
        return { title: 'The White Pass & Yukon Route', lines: [plural(names.length, 'station') + ' open' + (names.length ? ': ' + names.join(', ') : '') + '.', 'Through three tunnels, over the trestles and round the lighthouse.', 'A new station opens at each castle when it\u2019s finished.'] };
      case 'hike':
        var h = s.hike, peaks = h.peaks.filter(Boolean), done = peaks.filter(function (x) { return x.done; }).length;
        var cur = peaks[peaks.length - 1];
        return { title: 'The mountain range', lines: [plural(h.sessions, 'hike') + ' · ' + km(h.km) + (h.elev ? ' · ' + Math.round(h.elev) + ' m climbed' : ''),
          plural(peaks.length, 'peak') + ' so far, ' + done + ' at full height.',
          cur && !cur.done ? 'Current peak: ' + cur.h.toFixed(1) + ' of ' + cur.def.h.toFixed(1) + ' tall.' : '',
          'Each hike raises the range, more for bigger climbs. New peaks rise along the ridge as older ones top out, and every finished peak gets a summit cairn.', s.stairs.n ? plural(s.stairs.n, 'stair session') + ' helped too.' : '', tail] };
      case 'walk': return { title: 'Stepping stones', lines: [plural(s.walk.sessions, 'walk') + ' · ' + km(s.walk.km), 'Scattered through the village.', tail] };
      case 'sport':
        var sp = s.sports[p[1]];
        return { title: p[1], lines: [plural(sp.n, 'game'),
          sp.n < 22 ? 'One pennant per game: ' + (22 - sp.n) + ' to go before it starts becoming a stadium.' : 'Stadium: ' + STADIUM_STAGES.slice(0, (sp.stage || 0) + 1).join(', ').toLowerCase() + '.', tail] };
      case 'farm':
        var planted = s.farm.crops.length;
        return { title: 'The flower garden', lines: [plural(planted, 'mobility session'), 'Pilates, stretching and mobility each plant a flower bed. Once the garden is full, the flowers grow bigger.', tail] };
      case 'friend':
        var fr = s.friends[p[1]];
        if (fr.jo) {
          var jh = JO_STAGES.filter(function (st) { return fr.n >= st[0]; }).map(function (st) { return st[1].toLowerCase(); }), jn = JO_STAGES.filter(function (st) { return fr.n < st[0]; })[0];
          return { title: p[1] + '’s cottage', lines: [plural(fr.n, 'workout') + ' together', 'An English cottage on the village green, growing and filling its garden. Has: ' + jh.join(', ') + '.',
            jn ? 'Next: ' + jn[1].toLowerCase() + ' at ' + jn[0] + ' workouts.' : 'The cottage garden is complete.', tail] };
        }
        if (fr.tent) return { title: p[1] + '’s tent', lines: [plural(fr.n, 'workout') + ' together', 'The village is full, so newer friends camp at the edge.'] };
        var have = HOUSE_STAGES.filter(function (st) { return fr.n >= st[0]; }).map(function (st) { return st[1].toLowerCase(); });
        var nextS = HOUSE_STAGES.filter(function (st) { return fr.n < st[0]; })[0];
        return { title: p[1] + '’s house', lines: [plural(fr.n, 'workout') + ' together', 'Has: ' + have.join(', ') + '.',
          nextS ? 'Next: ' + nextS[1].toLowerCase() + ' at ' + nextS[0] + ' workouts.' : 'The estate is complete.', tail] };
      case 'dogs':
      case 'dog':
        var D = s.dogs, who = p[0] === 'dog' ? [p[1]] : D.order;
        return { title: p[0] === 'dog' ? p[1] : 'The dog pen', lines: who.map(function (n) { var d = D.list[n]; return d ? n + ': ' + plural(d.n, 'walk') + (d.house ? ', has a doghouse' : '') : ''; }).concat([
          'Each walk leaves a toy; 3 walks earns a doghouse; 10 walks between them adds an agility jump.', s.last[key] ? 'Last: ' + s.last[key].day + ' · ' + s.last[key].label : '']) };
      case 'snow':
        var S = s.snow;
        if (!S.days) return { title: 'The snowboard mountain', lines: ['No snowboard days yet.', 'Write "Snowboard", "Ski" or "Sima" in a Morning or Evening cell (add "8 laps" to count laps), or record a Snowboard day in Strava. The first 7 days build the chairlift; after that each day carves a new run.'] };
        var seasons = Object.keys(S.seasons).sort().map(function (k) { return k + ': ' + plural(S.seasons[k].days, 'day') + (S.seasons[k].laps ? ' · ' + plural(S.seasons[k].laps, 'lap') : ''); });
        return { title: 'The snowboard mountain', lines: [plural(S.days, 'day') + ' on the hill' + (S.laps ? ' · ' + plural(S.laps, 'lap') + ' · best day ' + S.best + ' laps' : '') + ' · ' + plural(S.runs.length, 'run') + ' cut'].concat(seasons, [
          S.lift && S.lift.built < LIFT_TOWERS ? 'Building the chairlift: ' + S.lift.built + ' of ' + LIFT_TOWERS + ' towers. Runs start once it is running.' : S.runs.length < SNOW.runs ? (SNOW.runs - S.runs.length) + ' more runs to cut (green, blue and black in turn). ' + (S.runs.length < 18 ? 'Next: down the front from the summit.' : S.runs.length < 24 ? 'Next: down the back side, while a second peak rises behind.' : S.runs.length < 30 ? 'Next: runs starting halfway up, while a third peak rises.' : 'Next: runs off the back peaks.') : 'Every run is cut; every 10 more days adds a floor to the lodge.', tail]) };
      case 'pub':
        var pb = PUB_STAGES.filter(function (st) { return s.drinks >= st[0]; }).map(function (st) { return st[2].toLowerCase(); });
        var pn = PUB_STAGES.filter(function (st) { return s.drinks < st[0]; })[0];
        return { title: 'The Slow Pour', lines: [s.drinks + ' drinks logged · ' + s.barrels + ' barrels stacked',
          pb.length ? 'Added: ' + pb.join(', ') + '.' : 'Every drink stacks a barrel out front (up to 21); after that the tavern gets cosier.',
          pn ? 'Next: ' + pn[2].toLowerCase() + ' at ' + pn[0] + ' drinks.' : 'The Slow Pour is complete.', tail] };
      case 'statue':
        var w = s.weight, diff = w.latest - w.first;
        var wk = (w.weeks || []).slice(-WALL_WEEKS).map(function (k) { return k.sum / k.n; });
        var lowest = wk.length ? Math.min.apply(null, wk) : w.latest, highest = wk.length ? Math.max.apply(null, wk) : w.latest;
        return { title: 'The weight wall', lines: ['First weigh-in ' + w.first + ' lb → latest ' + w.latest + ' lb (' + (diff >= 0 ? '+' : '') + diff.toFixed(1) + ' lb)',
          plural(w.count, 'weigh-in') + ' over ' + plural((w.weeks || []).length, 'week') + '. One pillar per week (that week\u2019s average); the tops trace your weight, the brass rail marks where you started and the gold cap is this week.',
          wk.length > 1 ? 'Shown: the last ' + plural(wk.length, 'week') + ', from ' + lowest.toFixed(1) + ' to ' + highest.toFixed(1) + ' lb.' : '', tail] };
    }
    return null;
  };

  Town.prototype.pick = function (clientX, clientY) {
    var rect = this.canvas.getBoundingClientRect();
    var v = new T.Vector2(((clientX - rect.left) / rect.width) * 2 - 1, -((clientY - rect.top) / rect.height) * 2 + 1);
    this.raycaster.setFromCamera(v, this.camera);
    var hits = this.raycaster.intersectObjects(this.snowMtn ? this.picks.concat([this.snowMtn]) : this.picks, false);
    for (var i = 0; i < hits.length; i++) {
      var o = hits[i].object, vis = true;
      for (var q = o; q; q = q.parent) if (!q.visible && !q.userData.inBatch) { vis = false; break; }
      if (vis && o.userData.pick) return o.userData.pick;
    }
    return null;
  };

  Town.prototype.resize = function () {
    this.needsRender = true;
    var w = this.canvas.clientWidth, h = this.canvas.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h, false);
    var aspect = w / h;
    var half = Math.max(19, 25 / aspect);
    this.aspect = aspect;
    this.baseHalf = half;
    this.camera.left = -half * aspect; this.camera.right = half * aspect;
    this.camera.top = half; this.camera.bottom = -half;
    this.camera.updateProjectionMatrix();
    this.fitDirty = true;
  };

  Town.prototype.safe = function (name, fn) {
    try { fn(); }
    catch (e) {
      var E = this.errors || (this.errors = {});
      if (!E[name]) { E[name] = e.message || String(e); console.error('town: ' + name + ' stopped:', e); if (this.onError) this.onError(name, E[name]); }
    }
  };
  Town.prototype.loop = function (now) {
    requestAnimationFrame(this.loop);
    var dt = Math.min(0.1, (now - this.lastNow) / 1000);
    this.lastNow = now;
    var keep = [];
    for (var i = 0; i < this.anims.length; i++) {
      var a = this.anims[i], o = a.obj;
      var t = (now - a.start) / a.dur;
      if (t < 0) { if (a.kind === 'y') o.visible = false; keep.push(a); continue; }
      if (a.from == null) a.from = a.kind === 'slide' ? o.position.y : a.kind === 'vec' ? o.scale.clone() : o.scale.x;
      o.visible = true;
      var k = Math.min(1, t);
      if (a.kind === 'y') o.position.y = a.from + (a.to - a.from) * easeOutBounce(k);
      else {
        var e = 1 - Math.pow(1 - k, 3);
        if (a.kind === 'vec') o.scale.lerpVectors(a.from, a.to, e);
        else {
          var v = a.from + (a.to - a.from) * e;
          if (a.kind === 'slide') o.position.y = v;
          else if (a.kind === 'scaleXZ') { o.scale.x = v; o.scale.z = v; }
          else o.scale.setScalar(v);
        }
      }
      if (t < 1) keep.push(a);
    }
    this.anims = keep;
    if (this.batchDirty && !keep.length && now - this.batchMarked > 1200) this.rebatch();
    // Peak flags ride on scaled groups; undo the scale so they stay flag-sized and sit on the summit.
    if (this.flagsToFix) this.flagsToFix.forEach(function (f) {
      var s = f.parent.scale;
      f.scale.set(1 / s.x, 1 / s.y, 1 / s.z);
      f.position.y = 1;
    });
    if (this.wallsAt && now > this.wallsAt) { this.rebuildWalls(); this.wallsAt = 0; this.wallsDirty = false; }
    if (this.churchDirty) this.buildChurch();
    if (this.libraryDirty) this.buildLibrary();
    if (this.cinemaDirty) this.buildCinema();
    if (this.decorDirty && this.today && now > (this.decorAt || 0)) { this.decorAt = now + 1000; this.decorate(); }
    if (this.fitDirty) this.updateFit();
    var moved = false;
    if (this.fit.auto && !this.explore) {
      var cam = this.camera, f = this.fit;
      var nz = cam.zoom + (f.zoom - cam.zoom) * 0.06;
      if (Math.abs(nz - cam.zoom) > 0.0005) { cam.zoom = nz; cam.updateProjectionMatrix(); moved = true; }
      var dy = (f.y - this.controls.target.y) * 0.06;
      if (Math.abs(dy) > 0.002) moved = true;
      this.controls.target.y += dy;
      cam.position.y += dy;
    }
    // Each moving part runs on its own: if one goes wrong, the rest keep going, and the page
    // is told what broke.
    var self = this;
    if (!this.soft) {
      this.safe('weather', function () { self.stepWeather(dt, now); });
      if (!this.reduced) this.safe('sky', function () { self.stepSky(dt, now); });
      else if (this.beam) this.beam.visible = false;
      if (!this.reduced) {
        this.safe('dogs', function () { self.walkDogs(dt, now); });
        this.safe('mice', function () { self.stepMice(dt, now); });
        this.safe('chairlift', function () { self.moveChairs(now); });
        this.safe('animals', function () { self.animateSecrets(dt, now); });
        this.safe('balloons', function () { self.st.bike.balloons.forEach(function (b) {
          b.angle += b.speed * dt;
          b.group.position.set(Math.cos(b.angle) * b.radius, b.height + Math.sin(now / 1500 + b.bob) * 0.4, Math.sin(b.angle) * b.radius);
        }); });
      }
    }
    if (this.explore) this.safe('raccoon', function () { if (self.stepPlayer(dt, now)) moved = true; });
    this.safe('effects', function () { if (self.stepFx(dt, now)) moved = true; });
    // Keyboard: WASD or arrows move across the ground, Q and E turn.
    var K = this.explore ? {} : this.keys, mx = (K.d || K.arrowright ? 1 : 0) - (K.a || K.arrowleft ? 1 : 0), mz = (K.w || K.arrowup ? 1 : 0) - (K.s || K.arrowdown ? 1 : 0);
    var turn = (K.e ? 1 : 0) - (K.q ? 1 : 0);
    if (mx || mz || turn) {
      var cam2 = this.camera, tgt = this.controls.target;
      var fwd = new T.Vector3().subVectors(tgt, cam2.position); fwd.y = 0; fwd.normalize();
      var right = new T.Vector3(-fwd.z, 0, fwd.x);
      var step = 22 * dt / cam2.zoom;
      var mv = right.multiplyScalar(mx * step).add(fwd.multiplyScalar(mz * step));
      tgt.add(mv); cam2.position.add(mv);
      if (turn) {
        var off = new T.Vector3().subVectors(cam2.position, tgt).applyAxisAngle(new T.Vector3(0, 1, 0), -turn * 1.4 * dt);
        cam2.position.copy(tgt).add(off);
      }
      moved = true;
    }
    // Keep the view over the countryside.
    var tg = this.controls.target, far = Math.hypot(tg.x, tg.z);
    if (far > 120) { var back = new T.Vector3(tg.x, 0, tg.z).multiplyScalar(1 - 120 / far); tg.sub(back); this.camera.position.sub(back); }
    var changed = this.controls.update();
    if (this.soft) {
      if (!(changed || moved || this.anims.length || this.needsRender) || now - (this.lastPaint || 0) < 33) return;
      this.lastPaint = now;
      this.needsRender = false;
    }
    this.renderer.render(this.scene, this.camera);
  };

  // ---- explore: walk the town as the raccoon ---------------------------------
  // A Stardew-style follow camera on a raccoon you steer with WASD or the arrows (or a joystick on
  // a phone); Shift runs, E looks at whatever's nearby. Buildings, trees, water and the sea are in
  // the way; paths and bridges are fine.
  var SOLID_SKIP = /^(folk|raccoon|fox|dog|dogs|wild:|prflag|endpr|balloon|sheep|railway|commute|bike|farm|field|path|hike|snow|lift|sky|weather|walk)/;
  Town.prototype.setExplore = function (on) {
    this.explore = !!on;
    var c = this.controls;
    if (on) {
      if (!this.player) {
        var pc = this.critter('raccoon');
        this.picks = this.picks.filter(function (m) { return pc.g.getObjectById(m.id) == null; });
        pc.g.traverse(function (m) { if (m.isMesh) m.userData.pick = null; });
        this.world.remove(pc.g); this.scene.add(pc.g);
        pc.g.position.set(TOWN_SQ.x + 2.4, 0, TOWN_SQ.z - 0.6);
        pc.g.rotation.y = Math.PI;
        pc.g.scale.setScalar(PLAYER_SCALE);
        pc.hip0 = pc.legs.map(function (l) { return l.position.clone(); });
        // Little eyes that shine in the dark, like a raccoon's in torchlight.
        pc.eyeMat = new T.MeshBasicMaterial({ color: '#1a1a1a' });
        [-0.06, 0.06].forEach(function (x) { var e = new T.Mesh(this.geo.box, pc.eyeMat); e.scale.set(0.045, 0.04, 0.02); e.position.set(x, 0.03, 0.13); pc.head.add(e); }, this);
        // And a mouth to carry things in.
        pc.mouth = new T.Group(); pc.mouth.position.set(0, -0.08, 0.27); pc.head.add(pc.mouth);
        this.player = pc;
      }
      this.player.g.visible = true;
      var P = this.player.g.position;
      P.y = this.floorAt(P.x, P.z, P.y + 0.4); this.player.air = 0; this.player.vy = 0; this.player.idle = 0; this.player.climb = null; this.player.dig = null;
      this.fit.auto = false; c.autoRotate = false; c.enablePan = false;
      c.mouseButtons = { LEFT: T.MOUSE.ROTATE, MIDDLE: T.MOUSE.DOLLY, RIGHT: T.MOUSE.ROTATE };
      c.touches = { ONE: T.TOUCH.ROTATE, TWO: T.TOUCH.DOLLY_ROTATE };
      c.maxZoom = 7;
      var off = new T.Vector3(1, 1.05, 1).normalize().multiplyScalar(40);
      c.target.set(P.x, P.y + 0.6, P.z);
      this.camera.position.copy(c.target).add(off);
      this.camera.zoom = 3.4; this.camera.updateProjectionMatrix();
      this.solidAt = 0;
    } else {
      if (this.player) { var pq = this.player; pq.g.visible = false; pq.seat = null; pq.ride = null; if (pq.snow) this.endSnow(pq); if (pq.paddle) this.leavePaddle(pq, false); if (pq.fishing) this.stopFishing(pq); }
      this.wakeHouses();
      var sc3 = this.sun.shadow.camera;
      sc3.left = -75; sc3.right = 75; sc3.top = 75; sc3.bottom = -75; sc3.updateProjectionMatrix();
      this.sun.target.position.set(0, 0, 0);
      if (this.sunBase) this.sun.position.copy(this.sunBase);
      c.enablePan = true; c.maxZoom = 4;
      c.mouseButtons = { LEFT: T.MOUSE.PAN, MIDDLE: T.MOUSE.DOLLY, RIGHT: T.MOUSE.ROTATE };
      c.touches = { ONE: T.TOUCH.PAN, TWO: T.TOUCH.DOLLY_ROTATE };
      this.recenter();
    }
    var coon = this.st.critters && this.st.critters.raccoon;
    if (coon) coon.g.visible = !on;
    this.near = null;
    if (this.onNear) this.onNear(null);
    this.needsRender = true;
  };
  // Footprints of everything solid: the ground-level parts of buildings, walls, trunks and so on,
  // bucketed into a grid. Rebuilt every few seconds while things are still being built.
  Town.prototype.buildSolids = function () {
    var grid = {}, list = [], geoBox = this.geo.box, climb = {};
    // The mountains (the ski hill and the hiking peaks) are ground you walk up, not scenery to
    // walk through.
    function ground(m) {
      for (var q = m; q; q = q.parent) if (!q.visible) return;
      m.updateWorldMatrix(true, false);
      // Their shapes are raised after they're made: refresh the bounds the ray test relies on.
      m.geometry.computeBoundingSphere(); m.geometry.computeBoundingBox();
      var b = new T.Box3().setFromObject(m);
      if (!isFinite(b.min.x)) return;
      var co = { x0: b.min.x, x1: b.max.x, z0: b.min.z, z1: b.max.z, y0: b.min.y, y1: b.max.y, m: m };
      for (var cx = Math.floor(co.x0 / 4); cx <= Math.floor(co.x1 / 4); cx++) for (var cz = Math.floor(co.z0 / 4); cz <= Math.floor(co.z1 / 4); cz++) (climb[cx + ',' + cz] = climb[cx + ',' + cz] || []).push(co);
    }
    if (this.snowMtn) ground(this.snowMtn);
    this.picks.forEach(function (m) { if (/^hike/.test(m.userData.pick || '') && !m.isInstancedMesh && m.geometry && m.geometry.attributes.position.count > 200) ground(m); });
    this.picks.forEach(function (m) {
      var k = m.userData.pick;
      if (!k || SOLID_SKIP.test(k)) return;
      for (var q = m; q; q = q.parent) if (!q.visible && !q.userData.inBatch) return;
      m.updateWorldMatrix(true, false);
      var b = new T.Box3().setFromObject(m);
      if (!isFinite(b.min.x)) return;
      // Everything you might stand on top of, filed by where it is.
      if (b.max.x - b.min.x < 24 && b.max.z - b.min.z < 24 && !m.isInstancedMesh && !/^(prflag|secret:feast)/.test(k)) {
        var co = { x0: b.min.x, x1: b.max.x, z0: b.min.z, z1: b.max.z, y0: b.min.y, y1: b.max.y, m: m };
        for (var cx = Math.floor(co.x0 / 4); cx <= Math.floor(co.x1 / 4); cx++) for (var cz = Math.floor(co.z0 / 4); cz <= Math.floor(co.z1 / 4); cz++) (climb[cx + ',' + cz] = climb[cx + ',' + cz] || []).push(co);
      }
      if (m.userData.passable || b.max.y - b.min.y < 0.35) return;
      var gy = groundY((b.min.x + b.max.x) / 2, (b.min.z + b.max.z) / 2);
      if (b.min.y > gy + 0.9) return; // roofs, canopies, things up in the air
      var o = { x0: b.min.x, x1: b.max.x, z0: b.min.z, z1: b.max.z, k: k, top: b.max.y };
      // An upright box turned at an angle (a stretch of wall, a door): test its real footprint,
      // not the square around it, or every diagonal wall would block its gate.
      var gp = m.geometry.parameters;
      if (m.geometry.type === 'CylinderGeometry' && gp && Math.abs(m.matrixWorld.elements[4]) + Math.abs(m.matrixWorld.elements[6]) < 1e-3) {
        var ce = m.matrixWorld.elements;
        o.circ = { cx: ce[12], cz: ce[14], r: Math.max(gp.radiusTop, gp.radiusBottom) * Math.max(Math.hypot(ce[0], ce[2]), Math.hypot(ce[8], ce[10])) };
      } else if (m.geometry === geoBox) {
        var e = m.matrixWorld.elements, ux = e[0] / 2, uz = e[2] / 2, vx = e[8] / 2, vz = e[10] / 2;
        if (Math.abs(e[4]) + Math.abs(e[6]) < 1e-3 && Math.abs(ux * vx + uz * vz) < 1e-4) o.obb = { cx: e[12], cz: e[14], ux: ux, uz: uz, vx: vx, vz: vz, uu: ux * ux + uz * uz, vv: vx * vx + vz * vz };
      }
      list.push(o);
      for (var gx = Math.floor(o.x0 / 4); gx <= Math.floor(o.x1 / 4); gx++) for (var gz = Math.floor(o.z0 / 4); gz <= Math.floor(o.z1 / 4); gz++) (grid[gx + ',' + gz] = grid[gx + ',' + gz] || []).push(o);
    });
    // The town square's fountain and trough, and the old square's well, aren't clickable but are in the way.
    var Q = TOWN_SQ, wellX = SQUARE.x + 1.2, wellZ = SQUARE.z + 0.6;
    [{ x0: Q.x - 1.1, x1: Q.x + 1.1, z0: Q.z - 1.1, z1: Q.z + 1.1, k: 'square' }, { x0: Q.x - 0.55, x1: Q.x + 0.55, z0: Q.z - Q.hz + 1.4, z1: Q.z - Q.hz + 1.9, k: 'square' },
     { x0: wellX - 0.5, x1: wellX + 0.5, z0: wellZ - 0.5, z1: wellZ + 0.5, k: null }].forEach(function (o) {
      list.push(o);
      for (var gx = Math.floor(o.x0 / 4); gx <= Math.floor(o.x1 / 4); gx++) for (var gz = Math.floor(o.z0 / 4); gz <= Math.floor(o.z1 / 4); gz++) (grid[gx + ',' + gz] = grid[gx + ',' + gz] || []).push(o);
    });
    // Benches and chairs: solid (their legs are too thin to count on their own); hop up or sit.
    var objs = this.st.partyObjs || {};
    (this.seats || []).concat(this.st.seats || []).forEach(function (q) {
      if (q.low || (q.party && !(objs[q.party] && objs[q.party].visible))) return;
      var L = q.party ? 0.2 : 0.55, Dp = q.party ? 0.18 : 0.17, ca = Math.cos(q.rot), sa = Math.sin(q.rot);
      var ux = ca * L, uz = -sa * L, vx = sa * Dp, vz = ca * Dp, ex = Math.abs(ux) + Math.abs(vx), ez = Math.abs(uz) + Math.abs(vz);
      var o = { x0: q.x - ex, x1: q.x + ex, z0: q.z - ez, z1: q.z + ez, k: null, top: q.y, obb: { cx: q.x, cz: q.z, ux: ux, uz: uz, vx: vx, vz: vz, uu: ux * ux + uz * uz, vv: vx * vx + vz * vz } };
      list.push(o);
      for (var gx = Math.floor(o.x0 / 4); gx <= Math.floor(o.x1 / 4); gx++) for (var gz = Math.floor(o.z0 / 4); gz <= Math.floor(o.z1 / 4); gz++) (grid[gx + ',' + gz] = grid[gx + ',' + gz] || []).push(o);
    });
    this.solids = { grid: grid, list: list };
    this.climbGrid = climb;
  };
  // feet: how high the raccoon's feet are mid-jump; anything lower than that can be hopped over.
  Town.prototype.walkable = function (x, z, feet, aloft) {
    var r = 0.22;
    if (Math.hypot(x, z) > 118) return false;
    var deck = this.deckAt(x, z);
    if (deck || aloft) return this.clearOfSolids(x, z, feet);
    // Raccoons swim: the lake, the ponds, the sea and the river are all fair game, except the
    // river down in the canyon, where the walls are too steep to climb back out.
    if (riverDist(x, z) < RIVER_HALF + 0.2 && canyonDepth(x, z) > 0.4 && !nearPath(x, z, 1.1)) return false;
    return this.clearOfSolids(x, z, feet);
  };
  // The water surface at x, z, if there's water to swim in there (not under a bridge's deck).
  function waterAt(x, z) {
    if (lakeDist(x, z) < -0.4) return LAKE.y + 0.12; // the surface as drawn
    var cs = coastSd(x, z);
    if (cs > -0.6) return SEA_Y;
    // The shallows: anything near the coast that dips below sea level is under the sea too.
    if (cs > -16 && x * COAST_N.x + z * COAST_N.z > 96.5 && groundY(x, z) < SEA_Y - 0.03) return SEA_Y; // (where the sea sheet is drawn)
    for (var i = 0; i < TARNS.length; i++) { var t = TARNS[i]; if (Math.hypot(x - t.x, z - t.z) < t.R) return t.y; }
    if (riverDist(x, z) < RIVER_HALF + 0.2 && !nearPath(x, z, 1.1) && !LANE.some(function (q) { return Math.hypot(q.x - x, q.z - z) < 0.9; })) return riverWaterY(x, z);
    return null;
  }
  // The river's surface as drawn: the level eased along the nearest stretch, not just the nearest point.
  function riverWaterY(x, z) {
    var i = RIVER_NEAR.i, best = riverLevel(i), bd = 1e9;
    for (var a = i - 1; a <= i; a++) {
      if (a < 0 || a + 1 >= RIVER.length) continue;
      var p = RIVER[a], q = RIVER[a + 1], dx = q.x - p.x, dz = q.z - p.z, t = Math.max(0, Math.min(1, ((x - p.x) * dx + (z - p.z) * dz) / (dx * dx + dz * dz || 1))), d = Math.hypot(p.x + dx * t - x, p.z + dz * t - z);
      if (d < bd) { bd = d; best = riverLevel(p.i) + (riverLevel(q.i) - riverLevel(p.i)) * t; }
    }
    return best;
  }
  var SWIM_SINK = 0.24;
  // Docks and jetties: planks you can walk out on over the water.
  Town.prototype.deckAt = function (x, z) {
    var D = this.st.decks;
    if (D) for (var i = 0; i < D.length; i++) {
      var d = D[i], dx = x - d.cx, dz = z - d.cz, u = dx * d.ux + dz * d.uz, v = -dx * d.uz + dz * d.ux;
      if (Math.abs(u) < d.hl && Math.abs(v) < d.hw) return d;
    }
    return null;
  };
  Town.prototype.clearOfSolids = function (x, z, feet) {
    var r = 0.22, cell = this.solids && this.solids.grid[Math.floor(x / 4) + ',' + Math.floor(z / 4)];
    if (cell) for (var i = 0; i < cell.length; i++) {
      var o = cell[i];
      if (!(x > o.x0 - r && x < o.x1 + r && z > o.z0 - r && z < o.z1 + r) || (feet != null && o.top < feet)) continue;
      if (o.circ) { if (Math.hypot(x - o.circ.cx, z - o.circ.cz) < o.circ.r + r) return false; continue; }
      if (!o.obb) return false;
      var B = o.obb, dx = x - B.cx, dz = z - B.cz, s = (dx * B.ux + dz * B.uz) / B.uu, t = (dx * B.vx + dz * B.vz) / B.vv;
      if (Math.abs(s) < 1 + r / Math.sqrt(B.uu) && Math.abs(t) < 1 + r / Math.sqrt(B.vv)) return false;
    }
    return true;
  };
  var PLAYER_SCALE = 1.25, STEP_UP = 0.4, GRAVITY = 17;
  Town.prototype.stepPlayer = function (dt, now) {
    var pl = this.player;
    if (!pl) return false;
    if (!this.solids || now > this.solidAt) { this.buildSolids(); this.solidAt = now + (this.anims.length ? 1500 : 6000); }
    var roam = this.st.critters && this.st.critters.raccoon; if (roam && roam.g.visible) roam.g.visible = false; // you are the raccoon now
    var K = this.keys, g = pl.g, P = g.position, c = this.controls, cam = this.camera, self = this;
    var mx = (K.d || K.arrowright ? 1 : 0) - (K.a || K.arrowleft ? 1 : 0) + (this.stick ? this.stick.x : 0);
    var mz = (K.w || K.arrowup ? 1 : 0) - (K.s || K.arrowdown ? 1 : 0) + (this.stick ? -this.stick.y : 0);
    var len = Math.hypot(mx, mz), moving = len > 0.15;
    pl.vy = pl.vy || 0;
    if (pl.eyeMat) { var glow = this.dark ? '#d9ff7a' : '#1a1a1a'; if (pl.eyeGlow !== glow) { pl.eyeGlow = glow; pl.eyeMat.color.set(glow); } }
    this.stepCarry(pl, dt, now, moving);
    // Snowboarding and paddleboarding have their own controls.
    if (pl.snow) { this.snowStep(pl, mx, mz, dt, now); this.followCam(P, dt); return true; }
    if (pl.paddle) { this.paddleStep(pl, mx, mz, dt, now); this.followCam(P, dt); return true; }
    // Riding the train or the chairlift: sit tight and enjoy the view; move to hop off.
    if (pl.ride) {
      if (moving) this.dismount(pl);
      else { this.rideStep(pl, dt, now); this.followCam(P, dt); return true; }
    }
    // Scrambling up a wall: nothing else happens until it's on top.
    if (pl.climb) { this.climbStep(pl, dt, now); this.followCam(P, dt); return true; }
    // Sitting on something: stay put until you move, then hop off.
    if (pl.seat) {
      if (moving) this.leaveSeat(pl);
      else return this.sitStep(pl, dt, now);
    }
    var floor = this.floorAt(P.x, P.z, P.y + STEP_UP), air = P.y - floor > STEP_UP || pl.vy > 0;
    var wHere = this.deckAt(P.x, P.z) ? null : waterAt(P.x, P.z);
    pl.swim = wHere != null && P.y < wHere + 0.05 && !air;
    var aloft = P.y > surfaceY(P.x, P.z) + 0.3, stuck = !this.walkable(P.x, P.z, P.y + 0.3, aloft);
    if (moving) {
      if (len > 1) { mx /= len; mz /= len; }
      var fwd = new T.Vector3().subVectors(c.target, cam.position); fwd.y = 0; fwd.normalize();
      var right = new T.Vector3(-fwd.z, 0, fwd.x);
      var run = K.shift || (this.stick && Math.hypot(this.stick.x, this.stick.y) > 0.92);
      var wired = pl.caffeine && now < pl.caffeine;
      var sp = (run ? 6.4 : 3.3) * dt * (pl.dig ? 0 : pl.swim ? 0.5 : 1) * (wired ? 1.75 : 1);
      if (wired && !pl.swim && Math.random() < dt * 14) this.puff(P.x, P.y + 0.02, P.z, 1, 'dust');
      var dx = (right.x * mx + fwd.x * mz) * sp, dz = (right.z * mx + fwd.z * mz) * sp;
      if (pl.tipsy && now < pl.tipsy) { var wob = Math.sin(now / 380) * 0.55, cw = Math.cos(wob), sw = Math.sin(wob), ox = dx; dx = ox * cw - dz * sw; dz = ox * sw + dz * cw; }
      var tryMove = function (ddx, ddz) {
        var nx = P.x + ddx, nz = P.z + ddz;
        if (!stuck && !self.walkable(nx, nz, P.y + 0.3, aloft)) return false;
        return !self.blockedAt(nx, nz, P.y); // a wall, a chimney, a rising roof too steep to step up
      };
      // Up on a ledge (a castle wall, a roof ridge): steer along it rather than stepping off.
      var keepsHeight = function (ddx, ddz) { return self.floorAt(P.x + ddx, P.z + ddz, P.y + STEP_UP) > P.y - 0.5; };
      var moved = false;
      if (aloft && !air && !keepsHeight(dx, dz)) {
        for (var a = 1; a <= 4 && !moved; a++) [1, -1].forEach(function (sg) {
          if (moved) return;
          var ang = sg * a * 0.4, ca = Math.cos(ang), sa = Math.sin(ang), rx = dx * ca - dz * sa, rz = dx * sa + dz * ca;
          if (keepsHeight(rx, rz) && tryMove(rx, rz)) { P.x += rx; P.z += rz; dx = rx; dz = rz; moved = true; }
        });
      }
      if (!moved) {
        if (tryMove(dx, dz)) { P.x += dx; P.z += dz; }
        else if (tryMove(dx, 0)) P.x += dx;
        else if (tryMove(0, dz)) P.z += dz;
      }
      var face = Math.atan2(dx, dz), d = face - g.rotation.y;
      while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
      g.rotation.y += d * Math.min(1, dt * 14);
      pl.phase += dt * (run ? 21 : 14) * (wired ? 1.6 : 1);
      if (!air && !pl.swim) pl.legs.forEach(function (l, li) { l.rotation.x = Math.sin(pl.phase + (li === 0 || li === 3 ? 0 : Math.PI)) * 0.7; });
      // A little wake behind, paddling along.
      if (pl.swim && now > (pl.wakeAt || 0)) { pl.wakeAt = now + 260; this.puff(P.x - Math.sin(g.rotation.y) * 0.3, wHere + 0.02, P.z - Math.cos(g.rotation.y) * 0.3, 2, 'ripple'); if (Math.random() < 0.5) this.sfx('paddle'); }
      pl.tail.rotation.y = Math.sin(pl.phase * 0.5) * 0.3;
      if (!aloft) this.brushPast(P.x, P.z, dx / dt, dz / dt, now);
      if (this.season === 'winter' && !air && !aloft) this.pawprint(pl, P, g.rotation.y);
      this.bumpCans(P, dx / dt, dz / dt, now);
    }
    // Falling, jumping and landing on whatever's underneath: ground, a roof, a wall, a bench.
    floor = this.floorAt(P.x, P.z, P.y + STEP_UP);
    if (pl.vy > 0 || P.y - floor > STEP_UP) {
      pl.vy -= GRAVITY * dt; P.y += pl.vy * dt;
      pl.fallFrom = Math.max(pl.fallFrom || P.y, P.y);
      if (P.y <= floor) {
        var wl = waterAt(P.x, P.z);
        if (wl != null && !this.deckAt(P.x, P.z) && (pl.fallFrom || 0) - floor > 0.3) { this.puff(P.x, wl + 0.05, P.z, 10, 'splash'); this.sfx('splash'); if ((pl.fallFrom || 0) - floor > 1.5) this.say('SPLOOSH', pl.g, 0.9, 1.0); }
        else if ((pl.fallFrom || 0) - floor > 0.3) { pl.squash = 0.18; this.puff(P.x, floor, P.z, 5, 'dust'); if ((pl.fallFrom || 0) - floor > 1.2) this.sfx('wood'); }
        P.y = floor; pl.vy = 0; pl.fallFrom = null;
        this.bumpCans(P, 0, 0, now, true);
      }
    } else {
      // Settled (or stepped down a little): stop falling.
      if (pl.vy < 0) { if ((pl.fallFrom || 0) - floor > 0.3) { pl.squash = 0.18; this.puff(P.x, floor, P.z, 5, 'dust'); } this.bumpCans(P, 0, 0, now, true); }
      pl.vy = 0; P.y += (floor - P.y) * Math.min(1, dt * 18); pl.fallFrom = null;
    }
    pl.air = Math.max(0, P.y - floor);
    air = pl.vy !== 0 || pl.air > STEP_UP;
    if (moving || air) pl.idle = 0; else pl.idle = (pl.idle || 0) + dt;
    // Footsteps, when the sound is on: one per paw that lands.
    if (moving && !air) { var stepN = Math.floor(pl.phase / Math.PI); if (stepN !== pl.stepN) { pl.stepN = stepN; this.footstep(P.x, P.z, aloft); } }
    // Rummaging in a knocked-over can.
    this.digStep(pl, dt, now, moving || air);
    // Left alone next to a bench, a chair or the end of a dock: hop up and sit.
    if (!moving && !air && !pl.dig && pl.idle > 0.8 && pl.idle < 25 && now > (pl.seatAt || 0)) {
      pl.seatAt = now + 400;
      var seat = this.seatNear(P.x, P.z);
      if (seat && Math.abs(seat.y - P.y) < 1.2) { this.takeSeat(pl, seat, now); return true; }
    }
    this.posePlayer(pl, dt, now, moving);
    // Sharper shadows close up: the sun's shadow box follows you about.
    if (this.sunBase && !this.soft) {
      var sun = this.sun, sc2 = sun.shadow.camera;
      if (sc2.right !== 34) { sc2.left = -34; sc2.right = 34; sc2.top = 34; sc2.bottom = -34; sc2.updateProjectionMatrix(); if (!sun.target.parent) this.scene.add(sun.target); }
      // Move it in whole shadow-map pixels (in the light's own frame), or shadows shimmer as you walk.
      var L = this.sunBase.clone().normalize(), rt = new T.Vector3(0, 1, 0).cross(L).normalize(), upL = L.clone().cross(rt), texel = 68 / sun.shadow.mapSize.x;
      var a = P.x * rt.x + P.z * rt.z, b = P.x * upL.x + P.z * upL.z, da = Math.round(a / texel) * texel - a, db = Math.round(b / texel) * texel - b;
      var sx = P.x + rt.x * da + upL.x * db, sz = P.z + rt.z * da + upL.z * db, sy = rt.y * da + upL.y * db;
      sun.target.position.set(sx, sy, sz);
      sun.position.set(sx + this.sunBase.x, this.sunBase.y + sy, sz + this.sunBase.z);
    }
    var mv = this.followCam(P, dt);
    // What's close enough to look at.
    if (now > (this.nearAt || 0)) {
      this.nearAt = now + 200;
      var best = null, bd = 2.6, list = this.solids ? this.solids.list : [];
      for (var i = 0; i < list.length; i++) {
        var o = list[i], ddx = Math.max(o.x0 - P.x, 0, P.x - o.x1), ddz = Math.max(o.z0 - P.z, 0, P.z - o.z1), dd = Math.hypot(ddx, ddz);
        if (o.k && dd < bd) { bd = dd; best = o.k; }
      }
      var R = this.st.rail;
      if (R && R.train && R.train[0]) { var lp = R.train[0].position; if (Math.hypot(lp.x - P.x, lp.z - P.z) < 3.2) best = 'railway'; }
      if (best !== this.near) { this.near = best; if (this.onNear) this.onNear(best); }
    }
    return moving || air || pl.idle < 60 || mv;
  };
  // The highest thing to stand on at x, z, no higher than fromY: the ground (or a dock), or the
  // top of a roof, a wall, a fence, a bench, a treetop.
  // Standing height on the town square: the paving, or the boardwalk round its edge.
  Town.prototype.squareTop = function (x, z) {
    if (this.squareY == null || !inTownSquare(x, z, 0)) return -1e9;
    var Q = TOWN_SQ, edge = Math.abs(x - Q.x) > Q.hx - 1.1 || Math.abs(z - Q.z) > Q.hz - 1.1;
    return this.squareY + (edge ? 0.225 : 0.1);
  };
  Town.prototype.standY = function (x, z) { return Math.max(groundY(x, z), this.squareTop(x, z)); };
  Town.prototype.floorAt = function (x, z, fromY) {
    var deck = this.deckAt(x, z), w = deck ? null : waterAt(x, z);
    var base = deck ? deck.y : w != null ? Math.max(w - SWIM_SINK, groundY(x, z)) : Math.max(surfaceY(x, z), this.squareTop(x, z)), C = this.climbGrid;
    if (!C || fromY <= base) return base;
    var cell = C[Math.floor(x / 4) + ',' + Math.floor(z / 4)];
    if (!cell) return base;
    var cands = [];
    for (var i = 0; i < cell.length; i++) { var o = cell[i]; if (x >= o.x0 && x <= o.x1 && z >= o.z0 && z <= o.z1 && o.y0 < fromY && o.y1 > base + 0.12) cands.push(o.m); }
    if (!cands.length) return base;
    var rc = this.footRay || (this.footRay = new T.Raycaster());
    rc.ray.origin.set(x, fromY, z); rc.ray.direction.set(0, -1, 0); rc.near = 0; rc.far = fromY - base;
    var hits = rc.intersectObjects(cands, false);
    return hits.length ? Math.max(base, hits[0].point.y) : base;
  };
  // Something in the way at body height (above what can be stepped up onto).
  Town.prototype.blockedAt = function (x, z, y) {
    return this.floorAt(x, z, y + 0.55) > y + STEP_UP;
  };
  Town.prototype.followCam = function (P, dt) {
    var c = this.controls, cam = this.camera, k = Math.min(1, dt * 6);
    var mvx = (P.x - c.target.x) * k, mvy = (P.y + 0.5 - c.target.y) * k, mvz = (P.z - c.target.z) * k;
    c.target.x += mvx; c.target.y += mvy; c.target.z += mvz;
    cam.position.x += mvx; cam.position.y += mvy; cam.position.z += mvz;
    return Math.abs(mvx) + Math.abs(mvy) + Math.abs(mvz) > 0.001;
  };
  Town.prototype.interact = function () {
    var pl = this.player, pub = this.st.pub;
    if (this.fishGame) { this.fishGame.press(); return; }
    if (pl && pl.ride) { this.dismount(pl); return; }
    if (pl && this.boardNear(pl)) return;
    if (pl && !pl.seat && !(pl.carry && pl.carry.kind === 'beer')) { var sq = this.seatNear(pl.g.position.x, pl.g.position.z); if (sq && Math.abs(sq.y - pl.g.position.y) < 1.2 && Math.hypot(sq.x - pl.g.position.x, sq.z - pl.g.position.z) < 1.1) { this.takeSeat(pl, sq, performance.now()); return; } }
    // Holding a pint: E is a swig. Near the pub: E orders one, whatever else is closer.
    if (pl && pl.carry && (pl.carry.kind === 'beer' || pl.carry.kind === 'coffee')) { this.swig(pl); return; }
    if (pl && pl.snow) { this.endSnow(pl); return; }
    if (pl && pl.paddle) {
      // Land ahead: step off. Otherwise: cast a line (or reel it in).
      var fa = pl.g.rotation.y, lx = pl.g.position.x + Math.sin(fa) * 0.9, lz = pl.g.position.z + Math.cos(fa) * 0.9;
      if (waterAt(lx, lz) == null) this.leavePaddle(pl, false); else if (pl.fishing) this.stopFishing(pl); else this.startFishing(pl);
      return;
    }
    if (pl && this.onSkiHill(pl.g.position)) { this.startSnow(pl); return; }
    if (pl && this.paddleAhead(pl)) { this.startPaddle(pl); return; }
    var shop = this.st.mtb && this.st.mtb.group;
    if (pl && shop && Math.hypot(shop.position.x - pl.g.position.x, shop.position.z - pl.g.position.z) < 5) { this.getCoffee(); return; }
    if (pl && pub && Math.hypot(pub.position.x - pl.g.position.x, pub.position.z - pl.g.position.z) < 4.5) { this.getBeer(); return; }
    if (this.near && this.onInteract) { this.onInteract(this.near); return; }
    // Nothing to look at: have a little chitter to yourself.
    var pl = this.player;
    if (!pl) return;
    this.say(['*chitter*', 'hehehe', '*chirrrp*', 'mine.', 'trash panda!', '*sniff sniff*', 'hrrrm'][Math.floor(Math.random() * 7)], pl.g, 1.0, 1.2);
    this.sfx('chitter');
    if (!pl.vy && !pl.climb && !pl.seat) pl.vy = 2.2;
  };
  Town.prototype.jump = function () {
    var pl = this.player;
    if (this.fishGame) { this.fishGame.press(); return; }
    if (pl && pl.ride) { this.dismount(pl); return; }
    if (pl && pl.snow) { if (!pl.snow.vy && pl.snow.onGround) { pl.snow.vy = 4.2; this.say(['ollie!', 'kickflip!', 'woo!'][Math.floor(Math.random() * 3)], pl.g, 1.0, 0.8); } return; }
    if (pl && pl.paddle) { this.leavePaddle(pl, true); return; }
    if (!pl || pl.climb || pl.air > 0.05 || pl.vy > 0) return;
    if (pl.idle > 25) { pl.idle = 0; this.say('!', pl.g, 1.0, 0.8); } // woken up
    if (pl.seat) this.leaveSeat(pl);
    pl.dig = null; pl.idle = 0;
    // Right up against something too tall to hop onto (a house, a shed, a castle wall, a tree)?
    // Scramble up it.
    var P = pl.g.position, ry = pl.g.rotation.y, fx = Math.sin(ry), fz = Math.cos(ry);
    for (var d = 0.4; d <= 0.95; d += 0.275) {
      var px = P.x + fx * d, pz = P.z + fz * d, top = this.floorAt(px, pz, P.y + 4.6), h = top - P.y;
      if (h > 0.6 && h < 4.6 && this.floorAt(px, pz, top + 0.8) <= top + 0.05) {
        var lx = px + fx * 0.12, lz = pz + fz * 0.12, land = this.floorAt(lx, lz, top + 0.3);
        if (Math.abs(land - top) > 0.4) { lx = px; lz = pz; land = top; }
        pl.climb = { x0: P.x, z0: P.z, y0: P.y, x1: lx, z1: lz, y1: land, t: 0, dur: 0.35 + h * 0.16, fx: fx, fz: fz };
        this.puff(P.x + fx * 0.2, P.y + 0.1, P.z + fz * 0.2, 4, 'dust');
        return;
      }
    }
    pl.vy = 4.8;
  };
  // Up the wall in a scrabble of paws, then over the top.
  Town.prototype.climbStep = function (pl, dt, now) {
    var C = pl.climb, P = pl.g.position, t;
    C.t += dt; t = Math.min(1, C.t / C.dur);
    var wallX = C.x0 + C.fx * 0.12, wallZ = C.z0 + C.fz * 0.12;
    if (t < 0.72) {
      var u = t / 0.72;
      P.x = C.x0 + (wallX - C.x0) * Math.min(1, u * 4); P.z = C.z0 + (wallZ - C.z0) * Math.min(1, u * 4);
      P.y = C.y0 + (C.y1 + 0.1 - C.y0) * u;
      pl.body.rotation.x += (-1.25 - pl.body.rotation.x) * Math.min(1, dt * 14);
      pl.legs.forEach(function (l, i) { l.rotation.x = -1.2 + Math.sin(now / 45 + i * 1.7) * 0.7; });
      if (Math.floor(C.t * 12) !== C.tick) { C.tick = Math.floor(C.t * 12); this.sfx('scrabble'); }
    } else {
      var v = (t - 0.72) / 0.28;
      P.x = wallX + (C.x1 - wallX) * v; P.z = wallZ + (C.z1 - wallZ) * v;
      P.y = C.y1 + 0.1 + Math.sin(v * Math.PI) * 0.25 - 0.1 * v;
      pl.body.rotation.x += (0 - pl.body.rotation.x) * Math.min(1, dt * 14);
    }
    pl.g.scale.set(PLAYER_SCALE, PLAYER_SCALE, PLAYER_SCALE);
    if (t >= 1) { P.set(C.x1, this.floorAt(C.x1, C.z1, C.y1 + 0.4), C.z1); pl.climb = null; pl.vy = 0; pl.squash = 0.12; pl.idle = 0; }
  };
  Town.prototype.seatNear = function (x, z) {
    var list = (this.seats || []).concat(this.st.seats || []), objs = this.st.partyObjs || {}, best = null, bd = 1.15;
    for (var i = 0; i < list.length; i++) {
      var q = list[i], d = Math.hypot(q.x - x, q.z - z);
      if (q.party && !(objs[q.party] && objs[q.party].visible)) continue;
      if (d < (q.wall ? 1.1 : bd)) { bd = d; best = q; }
    }
    return best;
  };
  Town.prototype.takeSeat = function (pl, seat, now) {
    var P = pl.g.position;
    // Benches have room for two: the raccoon takes the right-hand end.
    if (!seat.low && !seat.party) { var ca = Math.cos(seat.rot), sa = Math.sin(seat.rot); seat = Object.assign({}, seat, { x: seat.x + ca * 0.28, z: seat.z - sa * 0.28 }); }
    pl.seat = seat; pl.seatT = 0; pl.from = { x: P.x, y: P.y, z: P.z }; pl.fishT = 0; pl.fishAt = 6 + Math.random() * 7;
    pl.seatAct = Math.random() < 0.5 ? 'paper' : 'smoke';
    pl.air = 0; pl.vy = 0;
  };
  Town.prototype.smokeStep = function (pl, dt, now) {
    if (pl.carry && pl.carry.kind === 'beer') return; // one vice at a time
    if (!pl.cig) {
      if (pl.seatT < 2.5) return;
      var cg = new T.Group(); cg.position.set(0.05, 0.0, -0.01); cg.rotation.y = 0.5; pl.mouth.add(cg);
      this.part(cg, this.geo.cyl6, this.mat('swan', 0), 0.012, 0.11, 0.012, 0, 0, 0.05).rotation.x = Math.PI / 2;
      this.part(cg, this.geo.cyl6, this.mat('woodLight'), 0.013, 0.03, 0.013, 0, 0, 0.005).rotation.x = Math.PI / 2;
      var ember = this.part(cg, this.geo.cyl6, this.mat('fire'), 0.014, 0.015, 0.014, 0, 0, 0.11); ember.rotation.x = Math.PI / 2;
      pl.cig = { g: cg, ember: ember, next: now + 1500 };
      this.say('*flick*', pl.g, 1.0, 0.8);
      return;
    }
    var C = pl.cig, wp = new T.Vector3();
    // Draw, glow, then breathe out a big cloud.
    var drag = now > C.next - 600 && now < C.next;
    C.ember.scale.set(drag ? 0.022 : 0.014, 0.015, drag ? 0.022 : 0.014);
    pl.sipping = drag;
    if (now > C.next) {
      C.next = now + 2800 + Math.random() * 2200;
      pl.mouth.getWorldPosition(wp);
      this.puff(wp.x, wp.y + 0.03, wp.z, 9, 'smoke', 0.03);
      if (Math.random() < 0.25) this.say(['*puff*', 'ahh.', 'long day', 'this town, man'][Math.floor(Math.random() * 4)], pl.g, 1.1, 1.3);
    } else if (Math.random() < dt * 5) { C.ember.getWorldPosition(wp); this.puff(wp.x, wp.y + 0.02, wp.z, 1, 'smoke', 0.004); }
  };
  // The morning paper: held up in both paws, a page turned now and then, the odd headline read aloud.
  var HEADLINES = ['RACCOON SIGHTED IN BINS', 'hm.', 'they built WHAT?', 'LOCAL FOX: STILL CUTE', 'BIN DAY MOVED TO THURSDAY', 'pfft.', 'TRAIN LATE AGAIN',
    'huh. a new house', 'WHO KEEPS KNOCKING OVER THE CANS?', 'ooh, a coupon', 'weather: bins', 'MOUSE WINS PIE CONTEST', 'crossword… 7 down… TRASH', 'lol'];
  Town.prototype.paperStep = function (pl, dt, now) {
    var self = this;
    if (!pl.paper) {
      if (pl.seatT < 1.2) return;
      var pg = new T.Group(); pg.position.set(0, 0.42, 0.3); pl.g.add(pg);
      function page(r, photo) {
        var pp = new T.Group(); pp.rotation.y = r; pg.add(pp);
        self.part(pp, self.geo.box, self.mat('paper', 0), 0.17, 0.23, 0.006, 0.085, 0, 0);
        [-0.004, 0.004].forEach(function (z) {
          self.part(pp, self.geo.box, self.mat('paper', 1), 0.14, 0.024, 0.003, 0.085, 0.085, z);
          for (var ln = 0; ln < 5; ln++) self.part(pp, self.geo.box, self.mat('paper', 1), photo && ln < 2 ? 0.07 : 0.14, 0.006, 0.003, photo && ln < 2 ? 0.12 : 0.085, 0.04 - ln * 0.03, z);
          if (photo) self.part(pp, self.geo.box, self.mat('coon', 1), 0.055, 0.05, 0.003, 0.04, 0.03, z);
        });
        return pp;
      }
      // Two pages pivot on the spine; a third sweeps across when a page turns.
      var L = page(Math.PI - 0.35, true), R = page(0.35), turn = page(0.35); turn.visible = false;
      pl.paper = { g: pg, left: L, right: R, turn: turn, next: now + 3500 + Math.random() * 3000, flip: -1 };
      this.say('*rustle*', pl.g, 1.0, 0.8);
      return;
    }
    var Pp = pl.paper;
    Pp.g.rotation.z = Math.sin(now / 1700) * 0.04; Pp.g.rotation.x = -0.15 + Math.sin(now / 2300) * 0.03;
    if (Pp.flip < 0 && now > Pp.next) {
      Pp.flip = 0; Pp.next = now + 5000 + Math.random() * 5000; Pp.turn.visible = true;
      if (Math.random() < 0.45) {
        var hl = HEADLINES.slice(); if (this.st && this.st.sessions) hl.push('TOWN LOGS ' + this.st.sessions + ' WORKOUTS', 'GYM RAT SPOTTED AGAIN');
        this.say(hl[Math.floor(Math.random() * hl.length)], pl.g, 1.15, 2.0);
      }
    }
    if (Pp.flip >= 0) {
      Pp.flip += dt / 0.55;
      var k = Math.min(1, Pp.flip), e = k * k * (3 - 2 * k);
      Pp.turn.rotation.y = 0.35 + (Math.PI - 0.7) * e; Pp.turn.rotation.x = -Math.sin(k * Math.PI) * 0.25;
      if (k >= 1) { Pp.flip = -1; Pp.turn.visible = false; }
    }
  };
  Town.prototype.leaveSeat = function (pl) {
    if (pl.fishing) this.stopFishing(pl);
    if (pl.cig) { var wp = new T.Vector3(); pl.cig.ember.getWorldPosition(wp); pl.mouth.remove(pl.cig.g); pl.cig = null; pl.sipping = false; this.puff(wp.x, wp.y, wp.z, 3, 'dust'); }
    if (pl.paper) { pl.g.remove(pl.paper.g); pl.paper = null; this.say('*fold*', pl.g, 1.0, 0.8); }
    pl.seat = null; pl.idle = 0; pl.seatAt = performance.now() + 2500; pl.vy = 2.2;
  };
  // Hop across onto the seat, then sit; on the end of a dock, now and then a fish jumps.
  Town.prototype.sitStep = function (pl, dt, now) {
    var seat = pl.seat, P = pl.g.position, f = pl.from, g = pl.g;
    pl.seatT += dt;
    var t = Math.min(1, pl.seatT / 0.45), e = t * t * (3 - 2 * t);
    P.x = f.x + (seat.x - f.x) * e; P.z = f.z + (seat.z - f.z) * e;
    P.y = f.y + (seat.y - f.y) * e + Math.sin(t * Math.PI) * (seat.wall ? 0.9 : 0.45);
    var d = seat.rot - g.rotation.y;
    while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
    g.rotation.y += d * Math.min(1, dt * 10);
    pl.idle = Math.min(20, (pl.idle || 0) + dt);
    // On a bench or a chair, after a moment: a cigarette, or the paper.
    if (!seat.low && t >= 1) { if (pl.seatAct === 'paper') this.paperStep(pl, dt, now); else this.smokeStep(pl, dt, now); }
    // Sitting bolt upright (on the edge of a dock, with its legs swinging).
    var sp = this.sitPose(now / 1000, seat.low ? 'ledge' : 'sit');
    if (pl.paper) { sp.legs[0] = sp.legs[1] = -1.2; sp.front = { y: 0.44, z: 0.08 }; sp.hx += 0.22; sp.hy *= 0.3; }
    this.applyPose(pl, this.fishPose(pl, sp, now), dt, now / 1000, false);
    g.scale.set(PLAYER_SCALE, PLAYER_SCALE, PLAYER_SCALE);
    if (seat.fish && t >= 1) {
      // Line in the water off the end of the dock.
      if (!pl.fishing) this.startFishing(pl, seat.fish);
      this.fishStep(pl, dt, now);
      pl.fishT += dt;
      if (pl.fishT > pl.fishAt) { pl.fishT = 0; pl.fishAt = 15 + Math.random() * 15; this.fishJump(seat.fish); }
    }
    this.followCam(P, dt);
    return true;
  };
  // ---- snowboarding: E anywhere up on the ski hill, and down you go ----------------------------
  Town.prototype.onSkiHill = function (P) {
    return Math.hypot(P.x - SNOW.c.x, P.z - SNOW.c.z) < SNOW.R + 8 && P.y > groundY(P.x, P.z) + 1.2;
  };
  Town.prototype.startSnow = function (pl) {
    if (pl.fishing) this.stopFishing(pl);
    var board = new T.Group(); board.position.y = 0.02; pl.g.add(board);
    this.part(board, this.geo.box, this.mat('flag', Math.floor(Math.random() * 5)), 0.24, 0.03, 0.78, 0, 0, 0);
    this.part(board, this.geo.box, this.mat('swan', 2), 0.25, 0.012, 0.12, 0, 0.02, 0.33);
    this.part(board, this.geo.box, this.mat('swan', 0), 0.25, 0.012, 0.12, 0, 0.02, -0.33);
    pl.snow = { vx: 0, vz: 0, vy: 0, board: board, t: 0, onGround: true };
    pl.seat = null; pl.dig = null;
    this.say(['time to shred', 'send it!', 'here goes nothing'][Math.floor(Math.random() * 3)], pl.g, 1.0, 1.3);
  };
  Town.prototype.endSnow = function (pl, line) {
    if (!pl.snow) return;
    pl.g.remove(pl.snow.board); pl.snow = null; pl.vy = 0; pl.idle = 0;
    pl.body.rotation.z = 0;
    this.say(line || 'gnarly!', pl.g, 1.0, 1.2);
  };
  Town.prototype.snowStep = function (pl, mx, mz, dt, now) {
    var S = pl.snow, P = pl.g.position, self = this, e = 0.35;
    S.t += dt;
    function h(x, z) { return self.floorAt(x, z, P.y + 2.5); }
    // Downhill: the slope pulls you along; your steering nudges you across it.
    var gx = (h(P.x + e, P.z) - h(P.x - e, P.z)) / (2 * e), gz = (h(P.x, P.z + e) - h(P.x, P.z - e)) / (2 * e);
    S.vx -= gx * 15 * dt; S.vz -= gz * 15 * dt;
    if (Math.hypot(mx, mz) > 0.15) {
      var c = this.controls, cam = this.camera, fwd = new T.Vector3().subVectors(c.target, cam.position); fwd.y = 0; fwd.normalize();
      var right = new T.Vector3(-fwd.z, 0, fwd.x), ix = right.x * mx + fwd.x * mz, iz = right.z * mx + fwd.z * mz;
      S.vx += ix * 6 * dt; S.vz += iz * 6 * dt;
    }
    var fr = 1 - 0.55 * dt; S.vx *= fr; S.vz *= fr;
    var sp = Math.hypot(S.vx, S.vz); if (sp > 9) { S.vx *= 9 / sp; S.vz *= 9 / sp; sp = 9; }
    P.x += S.vx * dt; P.z += S.vz * dt;
    var floor = h(P.x, P.z);
    if (S.vy || P.y > floor + 0.3) { S.vy -= GRAVITY * dt; P.y += S.vy * dt; S.onGround = false; if (P.y <= floor) { P.y = floor; S.vy = 0; S.onGround = true; this.puff(P.x, floor, P.z, 6, 'snow', 0.2); } }
    else { P.y = floor; S.onGround = true; }
    // Carving: lean into the turn, spray snow off the tail.
    var face = Math.atan2(S.vx, S.vz);
    if (sp > 0.3) { var d = face - pl.g.rotation.y; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2; pl.g.rotation.y += d * Math.min(1, dt * 8); pl.body.rotation.z = Math.max(-0.5, Math.min(0.5, -d * 1.5)); }
    if (sp > 2 && Math.random() < dt * sp * 2) this.puff(P.x - Math.sin(face) * 0.4, P.y + 0.05, P.z - Math.cos(face) * 0.4, 2, 'snow', 0.15);
    // Crouched, arms out for balance.
    this.applyPose(pl, { pitch: 0.1, by: 0.25, hx: -0.15, tailX: 0.1, legs: [0.5, -0.5, 0.6, -0.6] }, dt, now / 1000, false);
    pl.vy = 0; pl.air = 0; pl.idle = 0;
    if (now > (S.whoopAt || 0) && sp > 6) { S.whoopAt = now + 6000; this.say(['WHEEE', 'shredding', 'pow day!'][Math.floor(Math.random() * 3)], pl.g, 1.0, 1.0); }
    // Off the hill and slowed right down: done.
    if (S.t > 1.5 && sp < 0.35 && (P.y < groundY(P.x, P.z) + 0.4 || Math.hypot(gx, gz) < 0.05)) this.endSnow(pl);
    if (Math.hypot(P.x, P.z) > 116) this.endSnow(pl, 'whoa');
  };

  // ---- paddleboarding: E with water just ahead ---------------------------------------------
  // Open water a step or so ahead, and you're standing (in the shallows is fine), not swimming.
  Town.prototype.paddleAhead = function (pl) {
    var P = pl.g.position, a = pl.g.rotation.y, wh = this.deckAt(P.x, P.z) ? null : waterAt(P.x, P.z);
    if (wh != null && P.y < wh - SWIM_SINK + 0.04) return null;
    for (var d = 0.7; d <= 1.6; d += 0.3) {
      var x = P.x + Math.sin(a) * d, z = P.z + Math.cos(a) * d, w = waterAt(x, z);
      if (w != null && !this.deckAt(x, z) && w - groundY(x, z) > 0.15 && P.y - w < 1.5 && Math.hypot(x, z) < 117) return { x: x, z: z };
    }
    return null;
  };
  Town.prototype.startPaddle = function (pl) {
    if (pl.fishing) this.stopFishing(pl);
    var P = pl.g.position, spot = this.paddleAhead(pl) || { x: P.x + Math.sin(pl.g.rotation.y) * 0.9, z: P.z + Math.cos(pl.g.rotation.y) * 0.9 }, x = spot.x, z = spot.z;
    var board = new T.Group(); board.position.y = -0.04; pl.g.add(board);
    this.part(board, this.geo.box, this.mat('canvas', 0), 0.32, 0.05, 0.95, 0, 0.01, 0);
    this.part(board, this.geo.box, this.mat('canvas', 1), 0.33, 0.012, 0.08, 0, 0.03, 0.3);
    this.part(board, this.geo.box, this.mat('woodLight'), 0.26, 0.01, 0.36, 0, 0.037, -0.1);
    this.part(board, this.geo.cone4, this.mat('canvas', 0), 0.16, 0.2, 0.05, 0, 0.01, 0.55).rotation.x = Math.PI / 2;
    // The paddle, gripped in both front paws at chest height: shaft, T-grip, blade.
    var paddle = new T.Group(); paddle.position.set(0, 0.42, 0.2); pl.g.add(paddle);
    this.part(paddle, this.geo.cyl6, this.mat('wood'), 0.012, 0.74, 0.012, 0, -0.06, 0);
    this.part(paddle, this.geo.box, this.mat('wood'), 0.07, 0.018, 0.018, 0, 0.31, 0);
    var blade = this.part(paddle, this.geo.box, this.mat('flag', 2), 0.08, 0.18, 0.016, 0, -0.4, 0);
    pl.paddle = { board: board, paddle: paddle, blade: blade, ph: 0, side: 1, u: 0 };
    P.x = x; P.z = z; P.y = waterAt(x, z) + 0.09; pl.seat = null; pl.dig = null; pl.vy = 0;
    this.say(['paddle time', 'ahoy!', 'smooth sailing'][Math.floor(Math.random() * 3)], pl.g, 1.0, 1.3);
    this.puff(x, P.y, z, 6, 'splash', 0.3);
  };
  Town.prototype.leavePaddle = function (pl, bail) {
    var Pd = pl.paddle, P = pl.g.position;
    if (!Pd) return;
    if (pl.fishing) this.stopFishing(pl);
    pl.g.remove(Pd.board); pl.g.remove(Pd.paddle); pl.paddle = null; pl.idle = 0;
    if (bail) { pl.vy = 2.5; this.say('SPLASH', pl.g, 1.0, 1.0); this.puff(P.x, P.y, P.z, 10, 'splash', 0.4); }
    else { var a = pl.g.rotation.y; P.x += Math.sin(a) * 0.9; P.z += Math.cos(a) * 0.9; P.y = this.floorAt(P.x, P.z, P.y + 1.5); }
  };
  Town.prototype.paddleStep = function (pl, mx, mz, dt, now) {
    var Pd = pl.paddle, P = pl.g.position, g = pl.g, len = Math.hypot(mx, mz), moving = len > 0.15;
    if (moving) {
      if (pl.fishing) this.stopFishing(pl);
      if (len > 1) { mx /= len; mz /= len; }
      var c = this.controls, cam = this.camera, fwd = new T.Vector3().subVectors(c.target, cam.position); fwd.y = 0; fwd.normalize();
      var right = new T.Vector3(-fwd.z, 0, fwd.x), dx = (right.x * mx + fwd.x * mz) * 2.4 * dt, dz = (right.z * mx + fwd.z * mz) * 2.4 * dt;
      // Only on the water: the shore stops you (E to step off).
      if (waterAt(P.x + dx, P.z + dz) != null && !this.deckAt(P.x + dx, P.z + dz) && Math.hypot(P.x + dx, P.z + dz) < 118 && waterAt(P.x + dx, P.z + dz) - groundY(P.x + dx, P.z + dz) > 0.08) { P.x += dx; P.z += dz; }
      var face = Math.atan2(dx, dz), d = face - g.rotation.y; while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
      g.rotation.y += d * Math.min(1, dt * 4);
      if (now > (Pd.wakeAt || 0)) { Pd.wakeAt = now + 300; this.puff(P.x - Math.sin(g.rotation.y) * 0.5, P.y - 0.02, P.z - Math.cos(g.rotation.y) * 0.5, 2, 'ripple'); }
      pl.idle = 0;
    } else pl.idle = (pl.idle || 0) + dt;
    var w = waterAt(P.x, P.z);
    P.y = (w != null ? w : P.y) + 0.09 + Math.sin(now / 600) * 0.012;
    pl.vy = 0; pl.air = 0;
    // Strokes: dig in up front, sweep back past the hip, lift and swing across to the other side.
    // Let go of the stick mid-stroke and it finishes the stroke, then rests the paddle across its lap.
    var pad = Pd.paddle, k = Math.min(1, dt * 14), tx = 0, ty = 0.42, tz = 0.2, rx = 0, rz = 0, pose, body = pl.body;
    if (moving || Pd.u > 0.02) {
      var u0 = Pd.u;
      Pd.u += dt * 1.25;
      if (Pd.u >= 1) { Pd.u = moving ? Pd.u - 1 : 0; Pd.side = -Pd.side; }
      var u = Pd.u, sd = Pd.side;
      if (u < 0.6) { var q = u / 0.6; rx = -0.75 + 1.5 * q; rz = sd * 0.5; ty = 0.37; tx = sd * 0.05; }
      else { var r = (u - 0.6) / 0.4; rx = 0.75 - 1.5 * r; rz = sd * 0.5 * Math.cos(Math.PI * r); ty = 0.37 + Math.sin(Math.PI * r) * 0.1; tx = sd * 0.05 * Math.cos(Math.PI * r); }
      if (u0 < 0.06 && u >= 0.06 && moving) {
        // The blade bites the water.
        var bw = new T.Vector3(); Pd.blade.getWorldPosition(bw);
        this.puff(bw.x, (w != null ? w : bw.y) + 0.02, bw.z, 4, 'splash', 0.12); this.sfx('paddle');
      }
      if (u0 < 0.55 && u >= 0.55 && moving) { var bw2 = new T.Vector3(); Pd.blade.getWorldPosition(bw2); this.puff(bw2.x, (w != null ? w : bw2.y), bw2.z, 1, 'ripple'); }
      // Twist through the stroke (round the spine, standing up), head steady.
      var twist = u < 0.6 ? sd * 0.25 * (1 - 2 * (u / 0.6)) : 0, reach = -1.15, sw = rx * 0.45 * sd;
      pose = { pitch: -1.28, by: 0.38, bz: -0.06, hx: 1.15, hy: -twist * 0.6, sway: twist, tailX: 1.5, front: { y: 0.42, z: 0.12 }, legs: [reach - sw, reach + sw, 1.2, 1.2] };
    } else {
      // Resting: kneeling, the paddle laid across its lap.
      ty = 0.33; tz = 0.22; rz = Math.PI / 2;
      pose = this.sitPose(now / 1000, 'sit'); pose.legs[0] = pose.legs[1] = -0.7;
    }
    pad.visible = !pl.fishing;
    pad.position.x += (tx - pad.position.x) * k; pad.position.y += (ty - pad.position.y) * k; pad.position.z += (tz - pad.position.z) * k;
    pad.rotation.x += (rx - pad.rotation.x) * k; pad.rotation.z += (rz - pad.rotation.z) * k;
    if (pl.fishing) pose = this.sitPose(now / 1000, 'sit');
    this.applyPose(pl, this.fishPose(pl, pose, now), dt, now / 1000, false);
    g.scale.set(PLAYER_SCALE, PLAYER_SCALE, PLAYER_SCALE);
    // Drift still for a moment and the line goes in.
    if (!moving && pl.idle > 2.5 && !pl.fishing) this.startFishing(pl);
    if (pl.fishing) this.fishStep(pl, dt, now);
  };

  // ---- fishing: a rod, a line, a bobber; wait for a bite ----------------------------------
  var CATCHES = ['a rainbow trout!', 'an arctic grayling!', 'a lake trout!', 'a northern pike!', 'a sockeye salmon!!', 'a tiny minnow', 'an old boot', 'a whitefish', 'a burbot (ugly but tasty)', 'a big ol\u2019 char!'];
  var SEA_CATCHES = ['a halibut!', 'a chinook salmon!!', 'a rockfish', 'a dungeness crab!', 'a lingcod', 'a sea star', 'a herring', 'an old boot', 'a spot prawn', 'a coho salmon!'];
  Town.prototype.startFishing = function (pl, spot) {
    var F = this.fx || (this.fx = { bits: [], group: null });
    if (!F.group) { F.group = new T.Group(); this.scene.add(F.group); }
    var P = pl.g.position, a = pl.g.rotation.y;
    if (!spot) { var x = P.x + Math.sin(a) * 1.4, z = P.z + Math.cos(a) * 1.4, w = waterAt(x, z); if (w == null) return; spot = { x: x, z: z, y: w }; }
    // The rod, held out in both front paws: cork grip, reel, a long whippy blank.
    var rod = new T.Group(); rod.position.set(0.02, 0.34, 0.26); rod.rotation.x = 0.9; pl.g.add(rod);
    this.part(rod, this.geo.cyl6, this.mat('trunk'), 0.01, 0.72, 0.01, 0, 0.26, 0);
    this.part(rod, this.geo.cyl6, this.mat('woodLight'), 0.02, 0.14, 0.02, 0, -0.04, 0);
    var reel = new T.Group(); reel.position.set(0.035, 0.02, 0); rod.add(reel);
    this.part(reel, this.geo.cyl, this.mat('stoneDark'), 0.035, 0.022, 0.035, 0, 0, 0).rotation.z = Math.PI / 2;
    this.part(reel, this.geo.box, this.mat('silver'), 0.008, 0.008, 0.045, 0.015, 0, 0.015);
    var tip = new T.Object3D(); tip.position.y = 0.62; rod.add(tip);
    var bob = new T.Group(); this.part(bob, this.geo.ball, this.mat('flag', 0), 0.04, 0.035, 0.04, 0, 0.02, 0); this.part(bob, this.geo.ball, this.mat('swan', 0), 0.04, 0.03, 0.04, 0, -0.01, 0);
    // A fish on the hook, hidden until one's landed.
    var hook = new T.Group(); hook.position.y = -0.14; hook.visible = false; bob.add(hook);
    this.part(hook, this.geo.box, this.mat('salmon', 0), 0.05, 0.16, 0.08, 0, 0, 0);
    this.part(hook, this.geo.cone4, this.mat('salmon', 0), 0.06, 0.06, 0.02, 0, -0.1, 0).rotation.z = Math.PI;
    F.group.add(bob);
    var line = new T.Mesh(this.geo.box, this.mat('swan', 0)); F.group.add(line);
    pl.fishing = { rod: rod, tip: tip, reel: reel, bob: bob, hook: hook, line: line, spot: spot, t: 0, biteAt: 4 + Math.random() * 7, state: 'cast', from: new T.Vector3() };
    pl.fishing.tip.getWorldPosition(bob.position);
  };
  Town.prototype.stopFishing = function (pl) {
    var Fi = pl.fishing, F = this.fx;
    if (!Fi) return;
    if (this.fishGame && this.fishGame.fi === Fi) this.fishGame.finish(false, false, true);
    pl.g.remove(Fi.rod); F.group.remove(Fi.bob); F.group.remove(Fi.line); pl.fishing = null;
  };
  // Arms follow the rod: up and back for the cast, out front while waiting, cranking on a fish.
  Town.prototype.fishPose = function (pl, p, now) {
    var Fi = pl.fishing;
    if (!Fi || !p) return p;
    var hold = -1.55 + Fi.rod.rotation.x * 0.45, crank = Fi.state === 'game' || Fi.state === 'reel' ? Math.sin(now / 45) * 0.25 : 0;
    p.legs = [hold + crank, hold - crank, p.legs ? p.legs[2] : 1.45, p.legs ? p.legs[3] : 1.45];
    p.front = { y: 0.42, z: 0.08 };
    p.hx = (p.hx || 0) + (Fi.state === 'cast' ? -0.1 : 0.15); p.hy = 0;
    return p;
  };
  // A bite: with the game on the page, a timing bar (sea fish are quicker); otherwise the luck of the draw.
  Town.prototype.startFishGame = function (pl) {
    var Fi = pl.fishing, sea = Fi.spot.y === SEA_Y, self = this, wd = sea ? 0.15 : 0.22, c = 0.2 + Math.random() * 0.6;
    var G = { sea: sea, zone: [c - wd / 2, c + wd / 2], sweet: [c - 0.035, c + 0.035], speed: (sea ? 1.3 : 0.85) * (0.9 + Math.random() * 0.3), t0: performance.now(), fi: Fi, over: false, limit: 5 };
    G.pos = function () { var u = ((performance.now() - G.t0) / 1000 * G.speed) % 2; return u < 1 ? u : 2 - u; };
    G.press = function () { if (G.over) return; var x = G.pos(); G.finish(x >= G.zone[0] && x <= G.zone[1], x >= G.sweet[0] && x <= G.sweet[1]); };
    G.finish = function (ok, perfect, quiet) {
      if (G.over) return;
      G.over = true; if (self.fishGame === G) self.fishGame = null;
      if (G.onEnd) G.onEnd(ok, perfect);
      if (!quiet && pl.fishing === Fi) self.fishResult(pl, ok, perfect);
    };
    this.fishGame = G; Fi.state = 'game'; Fi.t = 0;
    this.onFishBite(G);
  };
  Town.prototype.fishResult = function (pl, ok, perfect) {
    var Fi = pl.fishing, sp = Fi.spot, what = null;
    if (ok) {
      var list = sp.y === SEA_Y ? SEA_CATCHES : CATCHES, pool = perfect ? list.filter(function (w) { return /!/.test(w); }) : list;
      what = pool[Math.floor(Math.random() * pool.length)];
      this.loot = (this.loot || 0) + 1; if (this.onLoot) this.onLoot(what, this.loot);
      this.say((perfect ? 'PERFECT! ' : '') + 'caught ' + what, pl.g, 1.0, 2.2); this.sfx('found');
      this.puff(sp.x, sp.y + 0.05, sp.z, 6, 'splash', 0.2);
      Fi.hook.visible = !/boot/.test(what);
    } else { this.say(['it got away!', 'so close', 'next time', 'NOOO'][Math.floor(Math.random() * 4)], pl.g, 1.0, 1.4); this.puff(sp.x, sp.y + 0.03, sp.z, 4, 'splash', 0.15); }
    Fi.got = !!what && !/boot/.test(what);
    Fi.state = 'reel'; Fi.t = 0;
  };
  Town.prototype.fishStep = function (pl, dt, now) {
    var Fi = pl.fishing;
    if (!Fi) return;
    Fi.t += dt;
    var sp = Fi.spot, b = Fi.bob.position, tw = new T.Vector3(), rod = Fi.rod, ra = 0.95, k;
    Fi.tip.getWorldPosition(tw);
    if (Fi.state === 'cast') {
      // Wind up over the shoulder, flick forward, and the bobber sails out and plops in.
      var t = Fi.t;
      if (t < 0.3) { k = t / 0.3; ra = 0.9 - 1.4 * k * k; }
      else if (t < 0.5) { k = (t - 0.3) / 0.2; ra = -0.5 + 1.7 * k; }
      else { k = Math.min(1, (t - 0.5) / 0.4); ra = 1.2 - 0.25 * k; }
      if (t < 0.42) { b.copy(tw); Fi.from.copy(tw); }
      else {
        k = Math.min(1, (t - 0.42) / 0.55);
        b.set(Fi.from.x + (sp.x - Fi.from.x) * k, Fi.from.y + (sp.y - Fi.from.y) * k + Math.sin(k * Math.PI) * 0.7, Fi.from.z + (sp.z - Fi.from.z) * k);
        if (k >= 1) { Fi.state = 'wait'; Fi.t = 0; this.puff(sp.x, sp.y + 0.02, sp.z, 3, 'ripple'); this.puff(sp.x, sp.y + 0.02, sp.z, 3, 'splash', 0.05); this.sfx('paddle'); }
      }
      if (t > 0.3 && t - dt <= 0.3) this.sfx('paddle');
    } else if (Fi.state === 'wait') {
      ra = 0.95 + Math.sin(now / 900) * 0.03;
      b.set(sp.x, sp.y + Math.sin(now / 500) * 0.01, sp.z);
      if (Fi.t > Fi.biteAt) {
        this.say('!', pl.g, 1.2, 0.8); this.sfx('splash');
        if (this.onFishBite) this.startFishGame(pl); else { Fi.state = 'bite'; Fi.t = 0; }
      }
    } else if (Fi.state === 'bite' || Fi.state === 'game') {
      // Tug, tug: the bobber's dragged under and the rod bends.
      ra = 1.15 + Math.sin(Fi.t * 22) * 0.12;
      b.set(sp.x + Math.sin(Fi.t * 7) * 0.06, sp.y + Math.sin(Fi.t * 30) * 0.05 - 0.05, sp.z + Math.cos(Fi.t * 5) * 0.06);
      Fi.reel.rotation.x += dt * 25;
      if (Math.random() < dt * 6) this.puff(b.x, sp.y + 0.02, b.z, 1, 'ripple');
      if (Fi.state === 'bite' && Fi.t > 0.9) this.fishResult(pl, Math.random() < 0.65, false);
      else if (Fi.state === 'game' && Fi.t > (this.fishGame ? this.fishGame.limit : 0)) { if (this.fishGame) this.fishGame.finish(false, false); else this.fishResult(pl, false, false); }
    } else if (Fi.state === 'reel') {
      // Haul it in: rod up, reel spinning, bobber (and the fish) swung in to the paws.
      k = Math.min(1, Fi.t / 0.8);
      ra = 0.95 - 0.85 * Math.sin(k * Math.PI * 0.5);
      Fi.reel.rotation.x += dt * 40;
      b.set(sp.x + (tw.x - sp.x) * k, sp.y + (tw.y - 0.15 - sp.y) * k + Math.sin(k * Math.PI) * 0.4, sp.z + (tw.z - sp.z) * k);
      Fi.hook.rotation.z = Math.sin(Fi.t * 25) * 0.5;
      if (k >= 1) {
        if (Fi.got) this.carryItem(pl, 'fish');
        Fi.hook.visible = false; Fi.got = false;
        Fi.state = 'cast'; Fi.t = 0; Fi.biteAt = 6 + Math.random() * 10;
      }
    }
    rod.rotation.x += (ra - rod.rotation.x) * Math.min(1, dt * (Fi.state === 'cast' ? 30 : 12));
    // The line: rod tip down to the bobber.
    var mid = tw.clone().add(b).multiplyScalar(0.5), dv = b.clone().sub(tw), L = Math.max(0.001, dv.length());
    Fi.line.position.copy(mid); Fi.line.scale.set(0.006, L, 0.006); Fi.line.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dv.normalize());
  };

  // A fish leaps out of the water in an arc and splashes back in.
  Town.prototype.fishJump = function (w) {
    var F = this.fx || (this.fx = { bits: [], group: null }), fish = new T.Group();
    if (!F.group) { F.group = new T.Group(); this.scene.add(F.group); }
    this.part(fish, this.geo.box, this.mat('salmon', 0), 0.1, 0.16, 0.42, 0, 0, 0);
    this.part(fish, this.geo.cone4, this.mat('salmon', 1), 0.1, 0.18, 0.08, 0, 0, -0.25).rotation.x = -Math.PI / 2;
    var a = Math.random() * Math.PI * 2, dx = Math.cos(a), dz = Math.sin(a);
    fish.position.set(w.x, w.y, w.z); fish.rotation.y = Math.atan2(dx, dz);
    F.group.add(fish);
    (F.fish = F.fish || []).push({ g: fish, t: 0, x: w.x - dx * 0.5, z: w.z - dz * 0.5, dx: dx, dz: dz, y: w.y });
    this.puff(w.x - dx * 0.5, w.y + 0.05, w.z - dz * 0.5, 6, 'splash');
    this.sfx('splash');
  };
  // Ding dong: the church bell rings out (once the church has one).
  Town.prototype.ringBell = function () {
    var B = this.st.bible, g = B && B.group;
    if (!g) return false;
    if (B.chapters < 70) { this.say('No bell yet', this.player ? this.player.g : g, 1.3, 1.4); return false; }
    var box = new T.Box3().setFromObject(g), top = new T.Object3D();
    top.position.set((box.min.x + box.max.x) / 2, box.max.y, (box.min.z + box.max.z) / 2);
    this.scene.add(top);
    var self = this, bubbles = ['Ding!', 'Dong!', 'Ding!', 'Dong!'];
    bubbles.forEach(function (w, i) { setTimeout(function () { self.say(w, top, 0.6 + i * 0.15, 1.1, true); self.sfx(i % 2 ? 'dong' : 'ding'); }, i * 650); });
    setTimeout(function () { self.scene.remove(top); }, 5000);
    return true;
  };
  // Toot toot! The engine whistles and puffs steam.
  Town.prototype.toot = function () {
    var R = this.st.rail, eng = R && R.train && R.train[0];
    if (!eng) return;
    this.say('Toot toot!', eng, 1.6, 1.6);
    var p = eng.position;
    for (var i = 0; i < 3; i++) this.puff(p.x, p.y + 1.1 + i * 0.2, p.z, 6, 'steam', 0.25);
    this.sfx('toot');
  };

  // ---- sound: everything is made up on the spot with WebAudio; off until switched on ----------
  Town.prototype.setSound = function (on) {
    this.soundOn = !!on;
    if (on && !this.audio) {
      try {
        var AC = window.AudioContext || window.webkitAudioContext, ctx = new AC();
        var buf = ctx.createBuffer(1, ctx.sampleRate * 0.5, ctx.sampleRate), d = buf.getChannelData(0);
        for (var i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
        var out = ctx.createGain(); out.gain.value = 0.55; out.connect(ctx.destination);
        this.audio = { ctx: ctx, noise: buf, out: out };
      } catch (e) { this.audio = null; }
    }
    if (on && this.audio && this.audio.ctx.state === 'suspended') this.audio.ctx.resume();
  };
  Town.prototype.footstep = function (x, z, aloft) {
    if (!this.soundOn) return;
    if (aloft) { this.sfx('wood'); return; }
    var deck = this.deckAt(x, z), Q = TOWN_SQ, inSq = inTownSquare(x, z, 0);
    var board = deck || (inSq && (Math.abs(x - Q.x) > Q.hx - 1.1 || Math.abs(z - Q.z) > Q.hz - 1.1));
    this.sfx(board ? 'wood' : this.season === 'winter' ? 'snow' : inSq || nearPath(x, z, 0.8) ? 'gravel' : 'grass');
  };
  Town.prototype.sfx = function (kind) {
    var A = this.audio;
    if (!this.soundOn || !A) return;
    var ctx = A.ctx, t = ctx.currentTime;
    function env(node, peak, attack, decay, at) {
      var g = ctx.createGain(); g.gain.setValueAtTime(0.0001, at); g.gain.exponentialRampToValueAtTime(peak, at + attack); g.gain.exponentialRampToValueAtTime(0.0001, at + attack + decay);
      node.connect(g); g.connect(A.out); return g;
    }
    function noise(type, freq, q, peak, decay, at) {
      var src = ctx.createBufferSource(); src.buffer = A.noise; src.playbackRate.value = 0.8 + Math.random() * 0.4;
      var f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q || 0.7;
      src.connect(f); env(f, peak, 0.004, decay, at); src.start(at); src.stop(at + decay + 0.05);
    }
    function tone(type, f0, f1, peak, attack, decay, at, lp) {
      var o = ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f0, at); if (f1) o.frequency.exponentialRampToValueAtTime(f1, at + attack + decay);
      var node = o;
      if (lp) { var f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lp; o.connect(f); node = f; }
      env(node, peak, attack, decay, at); o.start(at); o.stop(at + attack + decay + 0.05);
    }
    var v = 0.85 + Math.random() * 0.3;
    switch (kind) {
      case 'wood': noise('lowpass', 900, 1, 0.22 * v, 0.07, t); tone('sine', 140, 90, 0.18 * v, 0.003, 0.06, t); break;
      case 'gravel': noise('bandpass', 2600, 0.6, 0.12 * v, 0.06, t); noise('bandpass', 4200, 0.8, 0.06 * v, 0.04, t + 0.02); break;
      case 'snow': noise('lowpass', 1300, 0.5, 0.16 * v, 0.11, t); break;
      case 'grass': noise('highpass', 2200, 0.5, 0.05 * v, 0.05, t); break;
      case 'bark': tone('square', 520, 260, 0.12, 0.01, 0.12, t, 1400); tone('square', 480, 250, 0.1, 0.01, 0.1, t + 0.16, 1400); break;
      case 'ding': case 'dong': {
        var b = kind === 'ding' ? 660 : 495;
        [[1, 0.25], [2.0, 0.12], [2.76, 0.08], [5.4, 0.04]].forEach(function (h) { tone('sine', b * h[0], null, h[1], 0.005, 2.4 / h[0] + 0.4, t); });
        break;
      }
      case 'toot': [0, 0.55].forEach(function (d) { tone('sawtooth', 392, null, 0.07, 0.04, 0.4, t + d, 1200); tone('sawtooth', 494, null, 0.06, 0.04, 0.4, t + d, 1200); }); break;
      case 'owl': [0, 0.45].forEach(function (d) { tone('sine', 410, 360, 0.12, 0.08, 0.32, t + d); }); break;
      case 'splash': noise('bandpass', 900, 0.6, 0.25, 0.35, t); noise('highpass', 3000, 0.5, 0.1, 0.2, t + 0.05); break;
      case 'boing': tone('sine', 300, 600, 0.06, 0.01, 0.15, t); break;
      case 'clang': [[620, 0.12], [1550, 0.07], [2470, 0.05]].forEach(function (h) { tone('triangle', h[0], h[0] * 0.97, h[1], 0.003, 0.5, t); }); noise('bandpass', 3000, 0.8, 0.18, 0.25, t); tone('triangle', 540, 520, 0.08, 0.003, 0.3, t + 0.18); break;
      case 'rustle': noise('bandpass', 1800 + Math.random() * 1500, 0.9, 0.07, 0.07, t); break;
      case 'paddle': noise('lowpass', 700, 0.6, 0.06, 0.12, t); break;
      case 'chitter': for (var ch = 0; ch < 5; ch++) tone('square', 1500 + Math.random() * 900, 1100, 0.035, 0.004, 0.035, t + ch * 0.055, 3500); break;
      case 'hiss': noise('highpass', 3500, 0.5, 0.12, 0.45, t); break;
      case 'glug': [0, 0.16, 0.32].forEach(function (d) { tone('sine', 220, 150, 0.12, 0.01, 0.1, t + d, 900); }); break;
      case 'nom': [0, 0.14, 0.28].forEach(function (d) { noise('bandpass', 900, 1.2, 0.08, 0.05, t + d); }); break;
      case 'scrabble': noise('highpass', 2500, 0.6, 0.06, 0.04, t); break;
      case 'found': tone('square', 660, null, 0.05, 0.005, 0.08, t, 2500); tone('square', 990, null, 0.05, 0.005, 0.14, t + 0.09, 2500); break;
    }
  };

  // ---- a sleepy town: out walking after dark, the houses turn in one by one; the owl hoots ----
  Town.prototype.stepNight = function (dt, now) {
    var on = this.explore && this.dark, N = this.night || (this.night = { off: [], at: 0, owlAt: now + 8000 });
    if (!on) {
      if (N.off.length) { N.off.forEach(function (o) { o.m.material = o.mat; }); N.off = []; this.wakeHouses(); this.needsRender = true; }
      return;
    }
    if (now > N.at) {
      N.at = now + 4000 + Math.random() * 5000;
      var F = this.st.friends, names = Object.keys(F).filter(function (k) { return F[k].group && !F[k].asleep; });
      if (names.length) {
        var f = F[names[Math.floor(Math.random() * names.length)]], winMat = this.mat('window'), dim = this.mat('stoneDark'), list = N.off;
        f.asleep = true;
        f.group.traverse(function (m) { if (m.isMesh && m.material === winMat) { list.push({ m: m, mat: winMat, f: f }); m.material = dim; } });
        this.needsRender = true;
      }
    }
    if (now > N.owlAt) {
      N.owlAt = now + 16000 + Math.random() * 20000;
      // Hoo-hoo, from whichever tree is nearest you.
      var P = this.player && this.player.g.position, trees = this.st.treeSpots || [], best = null, bd = 1e9;
      if (P) trees.forEach(function (t) { var d = Math.hypot(t.x - P.x, t.z - P.z); if (d > 3 && d < bd) { bd = d; best = t; } });
      if (best && bd < 25) {
        var spot = new T.Object3D(); spot.position.set(best.x, best.y, best.z); this.scene.add(spot);
        this.say('hoo-hoo', spot, 0.4, 2.2); this.sfx('owl');
        var self = this; setTimeout(function () { self.scene.remove(spot); }, 2500);
      }
    }
  };
  // The houses wake up again when you leave, or when it gets light.
  Town.prototype.wakeHouses = function () { var F = this.st.friends; for (var k in F) F[k].asleep = false; };

  // The raccoon's body language: legs tucked mid-jump, a squash on landing, and when left alone
  // it sits, looks about, washes its paws if there's water close by, and in the end curls up asleep.
  Town.prototype.posePlayer = function (pl, dt, now, moving) {
    var body = pl.body, head = pl.head, t = now / 1000, idle = pl.idle || 0, P = pl.g.position;
    var pose = null;
    if (pl.vy !== 0) pose = { pitch: pl.vy > 0 ? -0.35 : 0.2, legs: [0.9, 0.9, -0.9, -0.9] };
    else if (pl.swim) {
      // Swimming: nose up, paws paddling under the surface, tail floating out behind.
      var pd = moving ? 14 : 5;
      pose = { pitch: -0.15, by: 0.3, hx: -0.25, tailX: 0.05, tailY: Math.sin(t * 3) * 0.3, legs: [Math.sin(t * pd) * 0.8, Math.sin(t * pd + Math.PI) * 0.8, Math.sin(t * pd + Math.PI) * 0.6, Math.sin(t * pd) * 0.6] };
    } else if (pl.dig) {
      // Head first in the can, front paws going like mad, tail up and wagging.
      pose = { pitch: 0.55, by: 0.27, hx: 0.45, tailX: -0.2, tailY: Math.sin(t * 9) * 0.6,
        legs: [-0.9 + Math.sin(t * 34) * 0.7, -0.9 + Math.sin(t * 34 + 2) * 0.7, -0.3, -0.3] };
    } else if (!moving && idle > 25 && !pl.swim) {
      // Asleep: curled up low, head down, tail wrapped round, and the odd Zzz.
      pose = { by: 0.16, hx: 0.35, hy: 0.5, tailY: 1.3, legs: [1.4, 1.4, -1.4, -1.4], breathe: true };
      if (now > (pl.zzzAt || 0)) { pl.zzzAt = now + 2600; this.say('z z Z', pl.g, 0.7, 2.4, true); }
    } else if (!moving && idle > 4) {
      if (pl.water == null || now > (pl.waterAt || 0)) {
        pl.waterAt = now + 1000;
        pl.water = pl.air < 0.05 && P.y < surfaceY(P.x, P.z) + 0.3 && (lakeDist(P.x, P.z) < 2.2 || riverDist(P.x, P.z) < RIVER_HALF + 1.6 || streamDist(P.x, P.z) < 1.6 || coastSd(P.x, P.z) > -2.4 || TARNS.some(function (q) { return Math.hypot(P.x - q.x, P.z - q.z) < q.R + 1.6; }));
      }
      pose = this.sitPose(t, pl.water ? 'wash' : 'sit');
    }
    this.applyPose(pl, pose, dt, t, moving);
    // Squash and stretch.
    var sq = 1;
    if (pl.squash > 0) { pl.squash -= dt; sq = 1 - Math.sin(Math.max(0, pl.squash) / 0.18 * Math.PI) * 0.22; }
    else if (pl.vy !== 0) sq = 1.08;
    pl.g.scale.set(PLAYER_SCALE / Math.sqrt(sq), PLAYER_SCALE * sq, PLAYER_SCALE / Math.sqrt(sq));
  };
  // Sitting bolt upright on its haunches, front paws up by its chest, looking about.
  Town.prototype.sitPose = function (t, kind) {
    var look = Math.sin(t * 0.45) + Math.sin(t * 0.83), w = Math.sin(t * 11);
    var p = { pitch: -1.42, by: 0.36, bz: -0.1, hx: 1.3, hy: Math.abs(look) > 1.1 ? Math.sign(look) * 0.7 : 0, tailX: 1.75, tailY: Math.sin(t * 1.6) * 0.35,
      front: { y: 0.44, z: 0.04 }, legs: [-0.25, -0.25, 1.45, 1.45] };
    if (kind === 'wash') { p.legs = [-0.9 + w * 0.35, -0.9 - w * 0.35, 1.45, 1.45]; p.hx = 1.6; p.hy = 0; }
    if (kind === 'ledge') { p.legs = [-0.35, -0.35, 1.35 + Math.sin(t * 3) * 0.2, 1.35 + Math.sin(t * 3 + 1.4) * 0.2]; }
    return p;
  };
  Town.prototype.applyPose = function (pl, p, dt, t, moving) {
    var body = pl.body, head = pl.head, k = Math.min(1, dt * 9);
    p = p || {};
    body.rotation.x += ((p.pitch || 0) - body.rotation.x) * k;
    body.position.y += ((p.by || 0.3) - body.position.y) * k;
    body.position.z += ((p.bz || 0) - body.position.z) * k;
    // A bit unsteady after a pint.
    if (pl.tipsy && performance.now() < pl.tipsy) p.sway = Math.sin(t * 2.3) * 0.16;
    body.rotation.z += ((p.breathe ? 0.08 * Math.sin(t * 1.3) : 0) + (p.sway || 0) - body.rotation.z) * k;
    head.rotation.x += ((p.hx || 0) - (pl.sipping ? 0.8 : 0) - head.rotation.x) * k;
    head.rotation.y += ((p.hy || 0) - head.rotation.y) * Math.min(1, dt * 4);
    pl.tail.rotation.x += ((p.tailX != null ? p.tailX : 0.4) - pl.tail.rotation.x) * k;
    if (p.tailY != null) pl.tail.rotation.y += (p.tailY - pl.tail.rotation.y) * k;
    else if (!moving) pl.tail.rotation.y = Math.sin(t * 2.9) * 0.35;
    var h0 = pl.hip0;
    pl.legs.forEach(function (l, i) {
      if (p.legs) l.rotation.x += (p.legs[i] - l.rotation.x) * k;
      else if (!moving) l.rotation.x *= 0.8;
      if (h0) {
        var fr = i < 2 && p.front, ty = fr ? p.front.y : h0[i].y, tz = fr ? p.front.z : h0[i].z;
        l.position.y += (ty - l.position.y) * k; l.position.z += (tz - l.position.z) * k;
      }
    });
  };

  // ---- garbage cans: knock them over, dig through them -------------------------------------
  var LOOT = ['half a sandwich!', 'a shiny bottle cap!', 'pizza crust!', 'a single sock?', 'a banana peel', 'a lost earring!', 'fish bones', 'a cold french fry',
    'birthday cake!!', 'a rubber duck', 'an apple core', 'a mystery noodle', 'a lottery ticket (not a winner)', 'cheese puffs!', 'a whole donut!!', 'a soggy fortune cookie',
    'someone’s homework', 'a corn cob', 'a tiny trophy', 'chicken wing (mostly bone)'];
  var MEH = ['nothing good', 'just napkins', 'eww', 'coffee grounds', 'empty', 'only wrappers'];
  Town.prototype.addCan = function (x, z, rot) {
    if (this.soft) return;
    var g = new T.Group(), self = this, y = groundY(x, z);
    g.position.set(x, y, z); g.rotation.y = rot || 0;
    var can = new T.Group(); g.add(can);
    function P(par, geo, mat, sx, sy, sz, px, py, pz) { return self.part(par, geo, mat, sx, sy, sz, px, py, pz); }
    P(can, this.geo.cyl, this.mat('bin', 0), 0.15, 0.4, 0.15, 0, 0.2, 0);
    [0.08, 0.2, 0.32].forEach(function (yy) { P(can, self.geo.cyl, self.mat('bin', 1), 0.157, 0.025, 0.157, 0, yy, 0); });
    var lid = new T.Group(); lid.position.y = 0.41; can.add(lid);
    P(lid, this.geo.cyl, this.mat('bin', 2), 0.17, 0.04, 0.17, 0, 0, 0);
    P(lid, this.geo.box, this.mat('bin', 1), 0.1, 0.035, 0.03, 0, 0.04, 0);
    this.world.add(g);
    (this.st.cans = this.st.cans || []).push({ g: g, can: can, lid: lid, x: x, z: z, y: y, down: false, t: 0, finds: 1 + Math.floor(Math.random() * 2), mess: [] });
  };
  // Run into a can and over it goes, lid rolling off and rubbish everywhere.
  Town.prototype.bumpCans = function (P, vx, vz, now, landed) {
    var C = this.st.cans;
    if (!C) return;
    for (var i = 0; i < C.length; i++) {
      var c = C[i];
      if (c.down || Math.abs(c.x - P.x) > 0.6 || Math.abs(c.z - P.z) > 0.6 || P.y > c.y + 0.6) continue;
      var d = Math.hypot(c.x - P.x, c.z - P.z);
      if (d > (landed ? 0.35 : 0.3)) continue;
      var sp = Math.hypot(vx, vz), dx = sp ? vx / sp : (c.x - P.x) / (d || 1), dz = sp ? vz / sp : (c.z - P.z) / (d || 1);
      this.knockCan(c, dx, dz, now);
    }
  };
  Town.prototype.knockCan = function (c, dx, dz, now) {
    var self = this;
    c.down = true; c.t = 0; c.dir = Math.atan2(dx, dz) - c.g.rotation.y; c.downAt = now; c.finds = 1 + Math.floor(Math.random() * 2);
    // The lid flies off and skitters away.
    var lidW = new T.Vector3(); c.lid.getWorldPosition(lidW); c.can.remove(c.lid); this.world.add(c.lid); c.lid.position.copy(lidW);
    c.lidV = { x: dx * 2.2 + (Math.random() - 0.5), y: 2.2, z: dz * 2.2 + (Math.random() - 0.5), spin: (Math.random() - 0.5) * 14 };
    // Rubbish spills out where the mouth of the can lands.
    var mx = c.x + dx * 0.55, mz = c.z + dz * 0.55, cols = ['flag', 'woodLight', 'plaster', 'leaf', 'swan', 'balloon'];
    for (var k = 0; k < 7; k++) {
      var m = new T.Mesh(this.geo.box, this.mat(cols[k % cols.length], k));
      var r = 0.05 + Math.random() * 0.05;
      m.scale.set(r, 0.025, r * (0.6 + Math.random()));
      m.position.set(mx + (Math.random() - 0.5) * 0.5 + dx * Math.random() * 0.3, groundY(mx, mz) + 0.02, mz + (Math.random() - 0.5) * 0.5 + dz * Math.random() * 0.3);
      m.rotation.y = Math.random() * 6;
      this.world.add(m); c.mess.push(m);
    }
    this.sfx('clang');
    if (Math.random() < 0.55) this.say(['CRASH!', 'CLANG!', 'BONK!', 'oops', 'heh heh'][Math.floor(Math.random() * 5)], c.g, 0.9, 0.9);
    this.needsRender = true;
  };
  // Standing still by a knocked-over can: dig in. Every so often, a find.
  Town.prototype.digStep = function (pl, dt, now, busy) {
    var C = this.st.cans, P = pl.g.position;
    if (busy || !C) { pl.dig = null; return; }
    var best = null, objs = this.st.partyObjs || {};
    for (var i = 0; i < C.length; i++) {
      var c = C[i];
      if (!c.down || c.t < 0.3) continue;
      var mx = c.x + Math.sin(c.dir + c.g.rotation.y) * 0.5, mz = c.z + Math.cos(c.dir + c.g.rotation.y) * 0.5;
      if (Math.hypot(mx - P.x, mz - P.z) < 0.75 && Math.abs(P.y - c.y) < 0.4) { best = c; break; }
    }
    // Market stalls and the long table can be raided too, and they restock after a while.
    (this.st.stashes || []).forEach(function (sh) {
      if (best || (sh.party && !(objs[sh.party] && objs[sh.party].visible))) return;
      if (!sh.finds && now > (sh.refill || 0)) sh.finds = 3;
      if (Math.hypot(sh.mx - P.x, sh.mz - P.z) < 0.7 && Math.abs(P.y - sh.y) < 0.6) best = sh;
    });
    if (!best || (pl.idle || 0) < 0.5) { pl.dig = null; return; }
    if (!pl.dig || pl.dig.c !== best) pl.dig = { c: best, t: 0, next: 1.6 + Math.random() };
    var D = pl.dig, g = pl.g, tx = best.x - P.x, tz = best.z - P.z;
    // Face into the can.
    var want = Math.atan2(tx, tz), d = want - g.rotation.y;
    while (d > Math.PI) d -= Math.PI * 2; while (d < -Math.PI) d += Math.PI * 2;
    g.rotation.y += d * Math.min(1, dt * 8);
    D.t += dt; pl.idle = Math.min(pl.idle, 3);
    if (Math.floor(D.t * 7) !== D.tick) {
      D.tick = Math.floor(D.t * 7);
      // Rubbish flies out behind.
      this.puff(P.x + Math.sin(g.rotation.y) * 0.25, P.y + 0.25, P.z + Math.cos(g.rotation.y) * 0.25, 1, 'trash');
      if (D.tick % 2) this.sfx('rustle');
    }
    if (D.t > D.next) {
      D.t = 0; D.next = 2 + Math.random() * 1.5;
      if (best.finds > 0 && Math.random() < 0.6) {
        best.finds--;
        if (!best.finds) best.refill = now + 90000;
        var what = LOOT[Math.floor(Math.random() * LOOT.length)];
        this.loot = (this.loot || 0) + 1;
        this.say(what, pl.g, 1.0, 2.2);
        this.sfx('found');
        this.carryItem(pl);
        if (this.onLoot) this.onLoot(what, this.loot);
      } else this.say(best.finds > 0 ? MEH[Math.floor(Math.random() * MEH.length)] : 'all gone', pl.g, 1.0, 1.4);
    }
  };
  // Hold the find in its mouth; sit still for a bit and it gets eaten (washed first, by water).
  Town.prototype.carryItem = function (pl, kind) {
    if (pl.carry) pl.mouth.remove(pl.carry.m);
    if (kind === 'coffee') {
      // A takeaway cup: white, a brown sleeve, a lid, steaming.
      var cup = new T.Group(); pl.mouth.add(cup); cup.position.set(0, -0.06, 0.04); cup.scale.setScalar(1.6);
      this.part(cup, this.geo.cyl, this.mat('swan', 0), 0.045, 0.12, 0.045, 0, 0, 0);
      this.part(cup, this.geo.cyl, this.mat('woodLight'), 0.048, 0.045, 0.048, 0, -0.005, 0);
      this.part(cup, this.geo.cyl, this.mat('swan', 2), 0.05, 0.015, 0.05, 0, 0.065, 0);
      var lip = new T.Object3D(); lip.position.set(0, 0.08, 0); cup.add(lip);
      pl.carry = { m: cup, eat: 0, kind: 'coffee', sips: 0, steam: lip };
      return;
    }
    if (kind === 'fish') {
      var fs = new T.Group(); pl.mouth.add(fs); fs.rotation.y = Math.PI / 2; fs.position.y = -0.04;
      this.part(fs, this.geo.box, this.mat('salmon', 0), 0.05, 0.08, 0.2, 0, 0, 0);
      this.part(fs, this.geo.cone4, this.mat('salmon', 1), 0.05, 0.08, 0.04, 0, 0, -0.13).rotation.x = -Math.PI / 2;
      pl.carry = { m: fs, eat: 0 };
      return;
    }
    if (kind === 'candy') {
      var cd = new T.Group(); pl.mouth.add(cd);
      this.part(cd, this.geo.box, this.mat('flag', Math.floor(Math.random() * 5)), 0.08, 0.05, 0.05, 0, 0, 0);
      [-1, 1].forEach(function (sd) { this.part(cd, this.geo.cone4, this.mat('flag', 1), 0.03, 0.05, 0.03, sd * 0.06, 0, 0).rotation.z = sd * Math.PI / 2; }, this);
      pl.carry = { m: cd, eat: 0 };
      return;
    }
    if (kind === 'beer') {
      // A proper pint: amber glass, a head of foam, a handle.
      var mug = new T.Group(); pl.mouth.add(mug); mug.position.set(0, -0.06, 0.04); mug.scale.setScalar(1.7);
      this.part(mug, this.geo.cyl, this.mat('beer', 0), 0.06, 0.14, 0.06, 0, 0, 0);
      this.part(mug, this.geo.cyl, this.mat('beer', 1), 0.065, 0.04, 0.065, 0, 0.085, 0);
      this.part(mug, this.geo.box, this.mat('beer', 2), 0.025, 0.08, 0.02, 0.075, 0, 0);
      pl.carry = { m: mug, eat: 0, kind: 'beer', sips: 0 };
      return;
    }
    var m = this.mesh(Math.random() < 0.5 ? this.geo.box : this.geo.ball, this.mat(['flag', 'woodLight', 'balloon', 'leaf', 'brick'][Math.floor(Math.random() * 5)], Math.floor(Math.random() * 4)), pl.mouth);
    m.scale.set(0.09, 0.06, 0.12); m.rotation.y = Math.random();
    pl.carry = { m: m, eat: 0 };
  };
  Town.prototype.stepCarry = function (pl, dt, now, moving) {
    var c = pl.carry;
    if (pl.caffeine && now < pl.caffeine && now > (pl.zoomAt || 0)) { pl.zoomAt = now + 7000 + Math.random() * 6000; this.say(['ZOOM', 'go go go', 'I can hear colours', 'gotta go fast', 'wheeee'][Math.floor(Math.random() * 5)], pl.g, 0.9, 1.0); }
    if (pl.tipsy && now < pl.tipsy && now > (pl.hicAt || 0)) { pl.hicAt = now + 5000 + Math.random() * 6000; this.say('*hic*', pl.g, 0.9, 0.9); }
    if (!c) return;
    if (c.kind === 'coffee') {
      // Always steaming.
      if (now > (c.steamAt || 0)) { c.steamAt = now + 220; var sw = new T.Vector3(); c.steam.getWorldPosition(sw); this.puff(sw.x, sw.y, sw.z, 1, 'smoke', 0.01); }
      pl.sipping = false;
      var forcedC = c.forced && now < c.forced;
      if (!forcedC && (moving || pl.swim || pl.dig || (pl.idle || 0) < 0.8)) return;
      c.eat += dt;
      pl.sipping = c.eat % 1.6 > 1.0;
      if (pl.sipping && !c.glugged) { c.glugged = true; c.sips++; this.sfx('glug'); this.say(['*sip*', 'ahh', 'hot hot hot'][Math.min(2, c.sips - 1)], pl.g, 1.15, 0.8); }
      if (!pl.sipping) c.glugged = false;
      if (c.sips >= 3 && !pl.sipping) {
        pl.mouth.remove(c.m); pl.carry = null; pl.caffeine = now + 60000;
        this.say('CAFFEINE', pl.g, 1.0, 1.2); this.sfx('found');
      }
      return;
    }
    if (c.kind === 'beer') {
      // Sit down with it and it goes down in big glugs; then the hiccups.
      pl.sipping = false;
      var forced = c.forced && now < c.forced;
      if (!forced && (moving || pl.swim || pl.dig || (pl.idle || 0) < 0.8)) return;
      c.eat += dt;
      var ph = c.eat % 1.8;
      pl.sipping = ph > 1.1;
      if (pl.sipping && !c.glugged) { c.glugged = true; this.sfx('glug'); c.sips++; this.say(c.sips < 4 ? '*glug*' : '*GLUG*', pl.g, 1.15, 0.7); c.m.children[0].scale.y = 0.14 * (1 - c.sips / 5); c.m.children[1].position.y = 0.085 - 0.13 * c.sips / 5 * 0.5; }
      if (!pl.sipping) c.glugged = false;
      if (c.sips >= 4 && !pl.sipping) {
        pl.mouth.remove(c.m); pl.carry = null; pl.tipsy = now + 45000; pl.hicAt = now + 1500;
        this.say(['ahhh', '*BURRRP*', 'another!', 'that hit the spot'][Math.floor(Math.random() * 4)], pl.g, 1.0, 1.5);
      }
      return;
    }
    if (moving || pl.swim || pl.dig || (pl.idle || 0) < 3.5) { c.eat = Math.max(0, c.eat - dt); return; }
    c.eat += dt;
    pl.head.rotation.x += Math.sin(now / 90) * 0.04;
    if (Math.floor(c.eat * 3) !== c.tick) { c.tick = Math.floor(c.eat * 3); this.sfx('nom'); }
    var k = Math.max(0.05, 1 - c.eat / 4), base = c.base || (c.base = c.m.scale.clone());
    c.m.scale.copy(base).multiplyScalar(k);
    if (c.eat > 4) { pl.mouth.remove(c.m); pl.carry = null; this.say(['nom nom nom', '*munch*', 'delicious', 'gourmet', '*burp*'][Math.floor(Math.random() * 5)], pl.g, 1.0, 1.4); }
  };
  // All aboard: the nearest train carriage, or a chair at the bottom of the ski lift.
  Town.prototype.boardNear = function (pl) {
    var P = pl.g.position, R = this.st.rail, L = this.st.snow && this.st.snow.lift, best = null, bd = 3.2;
    if (R && R.train) R.train.forEach(function (car, i) { if (!i) return; var d = Math.hypot(car.position.x - P.x, car.position.z - P.z); if (d < bd) { bd = d; best = car; } });
    if (best) {
      var box = new T.Box3().setFromObject(best);
      pl.ride = { kind: 'train', obj: best, y: box.max.y - best.position.y, t: 0 };
      this.say('all aboard!', pl.g, 1.0, 1.4); this.toot(); pl.seat = null; pl.dig = null;
      return true;
    }
    if (L && L.chairs.length && L.towers.length > 1) {
      // The towers are stored relative to the ski hill: find the bottom station on the map.
      L.group.updateWorldMatrix(true, false);
      var bottom = L.group.localToWorld(L.towers[0].clone());
      if (Math.hypot(bottom.x - P.x, bottom.z - P.z) < 3.5) {
        // The next chair heading up.
        var ch = L.chairs.slice().sort(function (a, b) { return (a.userData.u || 0) - (b.userData.u || 0); }).filter(function (c) { return (c.userData.u || 0) < 0.45; })[0];
        if (ch) { pl.ride = { kind: 'lift', obj: ch, t: 0 }; this.say('to the top!', pl.g, 1.0, 1.4); pl.seat = null; pl.dig = null; return true; }
      }
    }
    return false;
  };
  Town.prototype.rideStep = function (pl, dt, now) {
    var Rd = pl.ride, P = pl.g.position, o = Rd.obj, wp = new T.Vector3();
    Rd.t += dt;
    if (Rd.kind === 'train') {
      wp.copy(o.position); wp.y += Rd.y;
      pl.g.rotation.y = o.rotation.y + Math.PI / 2;
      if (now > (Rd.cheer || 0)) { Rd.cheer = now + 9000 + Math.random() * 9000; if (Rd.t > 3) this.say(['wheee!', 'choo choo', 'what a view', 'tickets please?', 'next stop: Skagway'][Math.floor(Math.random() * 5)], pl.g, 1.0, 1.5); }
    } else {
      o.getWorldPosition(wp); wp.y -= 0.43;
      var L = this.st.snow.lift, top = L.group.localToWorld(L.towers[L.towers.length - 1].clone()), bot = L.group.localToWorld(L.towers[0].clone());
      pl.g.rotation.y = Math.atan2(top.x - bot.x, top.z - bot.z);
      // Off at the top.
      if ((o.userData.u || 0) > 0.48) {
        var a = pl.g.rotation.y;
        pl.ride = null; P.set(top.x + Math.sin(a) * 1.2, top.y, top.z + Math.cos(a) * 1.2); P.y = this.floorAt(P.x, P.z, P.y + 2); pl.vy = 1.5; pl.idle = 0;
        this.say('made it! (E to snowboard)', pl.g, 1.0, 2.2);
        return;
      }
    }
    P.copy(wp);
    pl.vy = 0; pl.air = 0;
    pl.idle = Math.min(20, (pl.idle || 0) + dt);
    this.applyPose(pl, this.sitPose(now / 1000, Rd.kind === 'lift' ? 'ledge' : 'sit'), dt, now / 1000, false);
    pl.g.scale.set(PLAYER_SCALE, PLAYER_SCALE, PLAYER_SCALE);
  };
  // Hop off: to the side of the train, or straight down off the chairlift (it's a raccoon).
  Town.prototype.dismount = function (pl) {
    var Rd = pl.ride, P = pl.g.position;
    if (!Rd) return;
    pl.ride = null; pl.idle = 0;
    if (Rd.kind === 'train') { var a = Rd.obj.rotation.y; P.x += Math.sin(a) * 1.1; P.z += Math.cos(a) * 1.1; }
    pl.vy = 2.0;
    this.say(Rd.kind === 'lift' ? 'geronimo!' : 'hup!', pl.g, 1.0, 1.0);
  };
  Town.prototype.swig = function (pl) {
    var c = pl.carry;
    if (!c || (c.kind !== 'beer' && c.kind !== 'coffee')) return;
    c.eat = 1.1; c.glugged = false; pl.idle = Math.max(pl.idle || 0, 1.6); c.forced = performance.now() + 700;
  };
  // A coffee from the bike shop: a minute of going very fast.
  Town.prototype.getCoffee = function () {
    var pl = this.player;
    if (!pl) return false;
    this.carryItem(pl, 'coffee');
    this.say(['flat white, extra shot', 'one oat latte please', 'double espresso. make it a triple'][Math.floor(Math.random() * 3)], pl.g, 1.0, 1.6);
    var shop = this.st.mtb.group, self = this, spot = new T.Object3D(); spot.position.copy(shop.position); spot.position.y += 2.4; this.scene.add(spot);
    setTimeout(function () { self.say(['coming right up', 'here you go, speedy', 'that\u2019ll be one acorn'][Math.floor(Math.random() * 3)], spot, 0, 1.6); }, 700);
    setTimeout(function () { self.scene.remove(spot); }, 3000);
    this.sfx('found');
    return true;
  };
  // Up to the bar for a pint.
  Town.prototype.getBeer = function () {
    var pl = this.player;
    if (!pl) return false;
    if (pl.carry && pl.carry.kind === 'beer') { this.swig(pl); return true; }
    this.carryItem(pl, 'beer');
    this.say(['one pint please', 'pint of the usual', 'put it on my tab'][Math.floor(Math.random() * 3)], pl.g, 1.0, 1.6);
    var bk = this.st.jobMice && this.st.jobMice.barkeep, self = this;
    if (bk) { bk.pour = 1.2; setTimeout(function () { self.say(['there you go, love', 'one pint', 'mind how you go', 'on the house, dear'][Math.floor(Math.random() * 4)], bk.g, 0.65, 1.6); }, 700); }
    this.sfx('found');
    return true;
  };
  Town.prototype.stepCans = function (dt, now) {
    var C = this.st.cans, busy = false, self = this, P = this.player && this.explore ? this.player.g.position : null;
    if (!C) return false;
    C.forEach(function (c) {
      if (!c.down) return;
      c.t += dt;
      if (c.t < 0.35) {
        busy = true;
        var u = Math.min(1, c.t / 0.3), ax = Math.cos(c.dir), az = -Math.sin(c.dir);
        c.can.rotation.set(0, 0, 0); c.can.rotateOnAxis(new T.Vector3(ax, 0, az), u * u * Math.PI / 2 * 0.95);
        c.can.position.set(Math.sin(c.dir) * 0.2 * u, 0.0, Math.cos(c.dir) * 0.2 * u);
      }
      if (c.lidV) {
        busy = true;
        var L = c.lid, v = c.lidV;
        v.y -= 14 * dt; L.position.x += v.x * dt; L.position.y += v.y * dt; L.position.z += v.z * dt; L.rotation.x += v.spin * dt;
        var gy = groundY(L.position.x, L.position.z) + 0.02;
        if (L.position.y < gy) { L.position.y = gy; v.y = Math.abs(v.y) > 1 ? -v.y * 0.35 : 0; v.x *= 0.6; v.z *= 0.6; v.spin *= 0.5; L.rotation.x = Math.round(L.rotation.x / Math.PI) * Math.PI; if (Math.abs(v.x) + Math.abs(v.z) < 0.05 && !v.y) c.lidV = null; }
      }
      // Tidied up by someone in the night: back on its feet a minute or so later, once you've gone.
      if (c.t > 70 && (!P || Math.hypot(P.x - c.x, P.z - c.z) > 7)) {
        c.down = false; c.lidV = null;
        c.lid.parent && c.lid.parent.remove(c.lid); c.lid.position.set(0, 0.41, 0); c.lid.rotation.set(0, 0, 0); c.can.add(c.lid);
        c.can.rotation.set(0, 0, 0); c.can.position.set(0, 0, 0);
        c.mess.forEach(function (m) { self.world.remove(m); }); c.mess = [];
        self.pop(c.g, 0); busy = true;
      }
    });
    return busy;
  };

  // ---- little effects: rustling plants, falling leaves, speech bubbles, pawprints ------------
  // Grass tufts, flowers and hedges are instanced; each is filed in a grid so the ones you brush
  // past can be found and given a wobble.
  Town.prototype.addBrush = function (mesh, i, x, z, r) {
    var B = this.brush || (this.brush = { cells: {}, wob: [] }), key = Math.floor(x / 2) + ',' + Math.floor(z / 2);
    (B.cells[key] = B.cells[key] || []).push({ mesh: mesh, i: i, x: x, z: z, r: r, at: 0 });
  };
  Town.prototype.brushPast = function (x, z, vx, vz, now) {
    var B = this.brush, self = this;
    if (B) for (var gx = Math.floor(x / 2) - 1; gx <= Math.floor(x / 2) + 1; gx++) for (var gz = Math.floor(z / 2) - 1; gz <= Math.floor(z / 2) + 1; gz++) {
      var cell = B.cells[gx + ',' + gz];
      if (cell) cell.forEach(function (b) {
        if (now < b.at || Math.hypot(b.x - x, b.z - z) > b.r || !b.mesh.visible || (b.mesh.parent && !b.mesh.parent.visible)) return;
        b.at = now + 900;
        var base = new T.Matrix4(); b.mesh.getMatrixAt(b.i, base);
        var sp = Math.hypot(vx, vz) || 1;
        // Lean away from the raccoon, along its path.
        B.wob.push({ b: b, base: base, t: 0, ax: vz / sp, az: -vx / sp, big: b.r > 0.6 });
        if (b.r > 0.6 && Math.random() < 0.5) self.puff(b.x, groundY(b.x, b.z) + 0.6, b.z, 3, 'leaf');
      });
    }
    // Trees: shake a few leaves, needles or snow out of the crown.
    var trees = this.st.treeSpots || [];
    for (var i = 0; i < trees.length; i++) {
      var tr = trees[i];
      if (now < tr.at || Math.abs(tr.x - x) > 1.6 || Math.abs(tr.z - z) > 1.6 || Math.hypot(tr.x - x, tr.z - z) > tr.r + 0.5) continue;
      tr.at = now + 2500;
      var snowy = this.season === 'winter' && tr.conifer;
      this.puff(tr.x, tr.y, tr.z, snowy ? 14 : 8, snowy ? 'snow' : tr.conifer ? 'needle' : tr.kind === 'birch' ? 'birchleaf' : 'leaf', tr.r);
    }
  };
  // A handful of little bits: falling leaves, puffs of dust, snow off the branches.
  Town.prototype.puff = function (x, y, z, n, kind, spread) {
    if (this.soft) return;
    var F = this.fx || (this.fx = { bits: [], group: null }), self = this;
    if (!F.group) { F.group = new T.Group(); this.scene.add(F.group); }
    if (kind === 'ripple') {
      for (var ri = 0; ri < n && F.bits.length < 90; ri++) {
        var rm = new T.Mesh(this.geo.box, this.mat('swan', 0)); rm.scale.set(0.05, 0.01, 0.05);
        rm.position.set(x + (Math.random() - 0.5) * 0.3, y, z + (Math.random() - 0.5) * 0.3); F.group.add(rm);
        F.bits.push({ m: rm, kind: 'ripple', life: 0.9, t: 0, vx: 0, vy: 0, vz: 0, ph: 0, fixedY: y });
      }
      return;
    }
    if (kind === 'smoke') {
      // Thin curls of smoke: each wisp fades on its own.
      for (var si = 0; si < n && F.bits.length < 110; si++) {
        var sm = new T.Mesh(this.geo.box, new T.MeshBasicMaterial({ color: '#e4e1da', transparent: true, opacity: 0.55, depthWrite: false }));
        var sw = 0.012 + Math.random() * 0.012;
        sm.scale.set(sw, sw * 2.5, sw);
        sm.position.set(x + (Math.random() - 0.5) * (spread || 0.02), y, z + (Math.random() - 0.5) * (spread || 0.02));
        F.group.add(sm);
        F.bits.push({ m: sm, kind: 'smoke', life: 1.8 + Math.random() * 0.8, t: -si * 0.07, vx: (Math.random() - 0.5) * 0.08, vy: 0.22 + Math.random() * 0.12, vz: (Math.random() - 0.5) * 0.08, ph: Math.random() * 6 });
      }
      this.needsRender = true;
      return;
    }
    var mat = kind === 'trash' ? this.mat(['flag', 'woodLight', 'plaster', 'leaf', 'balloon'][Math.floor(Math.random() * 5)], Math.floor(Math.random() * 4)) : kind === 'snow' || kind === 'splash' || kind === 'steam' ? this.mat('swan', 0) : kind === 'dust' ? this.mat('path') : kind === 'needle' ? this.mat('pine', 0) : kind === 'birchleaf' ? this.mat('birchleaf') : this.mat('leaf', Math.floor(Math.random() * 3));
    spread = spread || 0.3;
    for (var i = 0; i < n && F.bits.length < 90; i++) {
      var m = new T.Mesh(this.geo.box, mat);
      var sz = kind === 'dust' ? 0.07 : kind === 'snow' ? 0.06 : 0.08;
      m.scale.set(sz, kind === 'dust' || kind === 'snow' ? sz : 0.015, kind === 'needle' ? sz * 0.4 : sz);
      m.position.set(x + (Math.random() - 0.5) * spread * 2, y + (Math.random() - 0.5) * spread, z + (Math.random() - 0.5) * spread * 2);
      F.group.add(m);
      var burst = kind === 'dust' || kind === 'splash' || kind === 'steam' || kind === 'trash' || kind === 'smoke';
      if (kind === 'trash') { m.scale.set(0.06, 0.02, 0.05); }
      if (kind === 'steam') m.scale.setScalar(0.14 + Math.random() * 0.08);
      if (kind === 'smoke') m.scale.setScalar(0.04 + Math.random() * 0.03);
      F.bits.push({ m: m, kind: kind, life: kind === 'smoke' ? 1.6 : kind === 'dust' ? 0.5 : kind === 'splash' ? 0.6 : kind === 'steam' ? 1.2 : 1.6 + Math.random() * 0.9, t: 0, vx: (Math.random() - 0.5) * (burst ? 1.6 : 0.5), vy: kind === 'smoke' ? 0.35 + Math.random() * 0.2 : kind === 'trash' ? 1.8 + Math.random() : kind === 'splash' ? 1.4 + Math.random() : kind === 'steam' ? 0.9 + Math.random() * 0.4 : kind === 'dust' ? 0.6 + Math.random() * 0.5 : -0.25 - Math.random() * 0.3, vz: (Math.random() - 0.5) * (burst ? 1.6 : 0.5), ph: Math.random() * 6 });
    }
    this.needsRender = true;
  };
  // A little speech bubble over something: Woof!, z z Z, !
  Town.prototype.say = function (text, obj, yOff, dur, drift) {
    if (this.soft) return;
    var F = this.fx || (this.fx = { bits: [], group: null }), bubbles = F.bubbles || (F.bubbles = []);
    // The bubble grows to fit what's said.
    var font = '700 34px "Trebuchet MS", sans-serif', meas = document.createElement('canvas').getContext('2d');
    meas.font = font;
    var w = Math.ceil(meas.measureText(text).width + 36), W = w + 12, cx = W / 2;
    var cv = document.createElement('canvas'); cv.width = W; cv.height = 72;
    var c = cv.getContext('2d');
    c.font = font;
    c.fillStyle = 'rgba(255, 250, 238, 0.96)'; c.strokeStyle = '#5a3c1e'; c.lineWidth = 4;
    c.beginPath(); c.moveTo(cx - w / 2 + 14, 6); c.arcTo(cx + w / 2, 6, cx + w / 2, 56, 14); c.arcTo(cx + w / 2, 56, cx - w / 2, 56, 14);
    c.lineTo(cx + 10, 56); c.lineTo(cx, 68); c.lineTo(cx - 8, 56); c.arcTo(cx - w / 2, 56, cx - w / 2, 6, 14); c.arcTo(cx - w / 2, 6, cx + w / 2, 6, 14); c.closePath();
    c.fill(); c.stroke();
    c.fillStyle = '#3b2716'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillText(text, cx, 32);
    var tex = new T.CanvasTexture(cv); tex.magFilter = T.NearestFilter;
    var sp = new T.Sprite(new T.SpriteMaterial({ map: tex, depthTest: false, transparent: true }));
    var aspect = W / 160;
    sp.scale.set(1.5 * aspect, 0.68, 1); sp.renderOrder = 10;
    this.scene.add(sp);
    bubbles.push({ sp: sp, obj: obj, y: yOff, t: 0, dur: dur, drift: drift, aspect: aspect });
    this.needsRender = true;
  };
  // Pawprints in the snow, fading as the snow fills them in.
  Town.prototype.pawprint = function (pl, P, rot) {
    var last = pl.lastPrint;
    if (last && Math.hypot(last.x - P.x, last.z - P.z) < 0.32) return;
    pl.lastPrint = { x: P.x, z: P.z };
    var F = this.fx || (this.fx = { bits: [], group: null }), prints = F.prints || (F.prints = []);
    if (!F.group) { F.group = new T.Group(); this.scene.add(F.group); }
    pl.printSide = -(pl.printSide || 1);
    var m = new T.Mesh(this.geo.box, F.printMat || (F.printMat = new T.MeshBasicMaterial({ color: '#a9b8cc' })));
    var sx = Math.cos(rot) * 0.1 * pl.printSide, sz = -Math.sin(rot) * 0.1 * pl.printSide;
    m.scale.set(0.11, 0.01, 0.14); m.rotation.y = rot;
    m.position.set(P.x + sx, surfaceY(P.x + sx, P.z + sz) + 0.02, P.z + sz);
    F.group.add(m);
    prints.push({ m: m, t: 0 });
    if (prints.length > 60) { var old = prints.shift(); F.group.remove(old.m); }
  };
  Town.prototype.stepFx = function (dt, now) {
    var busy = false, B = this.brush, F = this.fx, self = this;
    this.stepNight(dt, now);
    if (this.stepCans(dt, now)) busy = true;
    // Wood smoke from the library chimneys.
    var LC = this.st.library && this.st.library.chimneys;
    if (LC && this.st.library.group && !this.soft && !this.reduced && now > (this.libSmokeAt || 0)) {
      this.libSmokeAt = now + 450;
      var cw = new T.Vector3();
      LC.forEach(function (c) { if (c.parent) { c.getWorldPosition(cw); self.puff(cw.x, cw.y, cw.z, 1, 'smoke', 0.05); } });
    }
    if (B && B.wob.length) {
      busy = true;
      var m4 = new T.Matrix4(), rot = new T.Matrix4(), tr = new T.Matrix4(), back = new T.Matrix4(), axis = new T.Vector3(), dirty = [];
      B.wob = B.wob.filter(function (w) {
        w.t += dt;
        var done = w.t > 0.9, e = w.base.elements, ang = done ? 0 : Math.sin(w.t * 16) * Math.exp(-w.t * 4.5) * (w.big ? 0.22 : 0.5);
        // Tip about the plant's foot.
        var footY = e[13] - e[5] * (w.big ? 0.5 : 0.45);
        axis.set(w.ax, 0, w.az).normalize();
        tr.makeTranslation(e[12], footY, e[14]); back.makeTranslation(-e[12], -footY, -e[14]); rot.makeRotationAxis(axis, ang);
        m4.copy(tr).multiply(rot).multiply(back).multiply(w.base);
        w.b.mesh.setMatrixAt(w.b.i, m4);
        if (dirty.indexOf(w.b.mesh) < 0) dirty.push(w.b.mesh);
        return !done;
      });
      dirty.forEach(function (m) { m.instanceMatrix.needsUpdate = true; });
    }
    if (F) {
      if (F.bits.length) busy = true;
      F.bits = F.bits.filter(function (b) {
        b.t += dt;
        var m = b.m;
        if (b.kind === 'dust') { b.vy -= 2 * dt; m.scale.multiplyScalar(1 - dt * 1.5); }
        else if (b.kind === 'splash') { b.vy -= 6 * dt; }
        else if (b.kind === 'trash') { b.vy -= 7 * dt; m.rotation.x += dt * 9; }
        else if (b.kind === 'ripple') { m.scale.x += dt * 0.5; m.scale.z += dt * 0.5; m.position.y = b.fixedY; if (b.t > b.life) { F.group.remove(m); return false; } return true; }
        else if (b.kind === 'steam') { b.vy *= 1 - dt; m.scale.multiplyScalar(1 + dt * 0.8); }
        else if (b.kind === 'smoke') {
          if (b.t < 0) { m.visible = false; return true; }
          m.visible = true;
          // Curling up and drifting, stretching thin, fading out.
          m.position.x += Math.sin(b.t * 3.1 + b.ph) * dt * 0.12; m.position.z += Math.cos(b.t * 2.3 + b.ph) * dt * 0.12;
          m.rotation.z = Math.sin(b.t * 2 + b.ph) * 0.6; m.rotation.y += dt * 0.8;
          m.scale.x *= 1 + dt * 0.5; m.scale.z *= 1 + dt * 0.5; m.scale.y *= 1 + dt * 0.9;
          m.material.opacity = Math.max(0, 0.55 * (1 - b.t / b.life));
          m.position.x += b.vx * dt; m.position.y += b.vy * dt; m.position.z += b.vz * dt;
          if (b.t > b.life) { F.group.remove(m); m.material.dispose(); return false; }
          return true;
        }
        else { m.rotation.x += dt * 3; m.rotation.z += dt * 2; b.vx += Math.sin(b.t * 4 + b.ph) * dt * 0.8; }
        m.position.x += b.vx * dt; m.position.y += b.vy * dt; m.position.z += b.vz * dt;
        var gy = b.kind === 'splash' ? -1e9 : groundY(m.position.x, m.position.z);
        if (b.kind === 'splash' && b.t > b.life) { F.group.remove(m); return false; }
        if (m.position.y < gy + 0.02) { m.position.y = gy + 0.02; b.vx = b.vz = b.vy = 0; }
        if (b.t > b.life + 1.2) { F.group.remove(m); return false; }
        if (b.t > b.life) m.scale.multiplyScalar(1 - dt * 2);
        return true;
      });
      var cam = this.camera;
      F.bubbles = (F.bubbles || []).filter(function (bb) {
        bb.t += dt; busy = true;
        var p = new T.Vector3(); bb.obj.getWorldPosition(p);
        bb.sp.position.set(p.x + (bb.drift ? bb.t * 0.25 : 0), p.y + bb.y + (bb.drift ? bb.t * 0.35 : Math.min(bb.t, 0.15)), p.z);
        var s = Math.min(1, bb.t / 0.12) * (bb.t > bb.dur - 0.25 ? Math.max(0, (bb.dur - bb.t) / 0.25) : 1);
        // Same size on screen however far you're zoomed in.
        var z = 3.4 / Math.max(0.5, cam.zoom);
        bb.sp.scale.set(1.5 * (bb.aspect || 1) * s * z, 0.68 * s * z, 1);
        if (bb.t >= bb.dur) { bb.sp.parent.remove(bb.sp); bb.sp.material.map.dispose(); bb.sp.material.dispose(); return false; }
        return true;
      });
      F.fish = (F.fish || []).filter(function (f) {
        f.t += dt; busy = true;
        var u = Math.min(1, f.t / 0.9);
        f.g.position.set(f.x + f.dx * u, f.y + Math.sin(u * Math.PI) * 0.9, f.z + f.dz * u);
        f.g.rotation.x = -Math.cos(u * Math.PI) * 0.9;
        if (u >= 1) { F.group.remove(f.g); self.puff(f.x + f.dx, f.y + 0.05, f.z + f.dz, 7, 'splash'); self.sfx('splash'); return false; }
        return true;
      });
      (F.prints || []).forEach(function (pr) { pr.t += dt; if (pr.t > 8) { var k = Math.max(0.01, 1 - (pr.t - 8) / 6); pr.m.scale.set(0.11 * k, 0.01, 0.14 * k); } });
      F.prints = (F.prints || []).filter(function (pr) { if (pr.t > 14) { F.group.remove(pr.m); return false; } return true; });
    }
    return busy;
  };
  // Woof! A dog barks and hops; now and then another answers.
  var BARKS = ['Woof!', 'Arf!', 'Bork!', 'Ruff!', 'Yip!'];
  Town.prototype.bark = function (name, answer) {
    var D = this.st.dogs, g = D && D.list[name];
    if (!g) return;
    g.hop = 0.45; g.wag = 1.5;
    this.say(BARKS[Math.floor(Math.random() * BARKS.length)], g.group, 1.25, 1.3);
    this.sfx('bark');
    // The raccoon is not impressed.
    var pl = this.player;
    if (this.explore && pl && Math.hypot(pl.g.position.x - DOG_PEN.c.x, pl.g.position.z - DOG_PEN.c.z) < 7.5 && performance.now() > (pl.hissAt || 0)) {
      pl.hissAt = performance.now() + 3500;
      var self2 = this; setTimeout(function () { self2.say(Math.random() < 0.5 ? 'HSSSS' : 'come at me', pl.g, 1.0, 1.1); self2.sfx('hiss'); }, 350);
    }
    var others = D.order.filter(function (n) { return n !== name; });
    if (!answer && others.length && Math.random() < 0.6) { var self = this, o = others[Math.floor(Math.random() * others.length)]; setTimeout(function () { self.bark(o, true); }, 380 + Math.random() * 300); }
    this.needsRender = true;
  };
  Town.prototype.playerScreen = function () {
    if (!this.player) return null;
    var v = this.player.g.position.clone(); v.y += 1.2; v.project(this.camera);
    var r = this.canvas.getBoundingClientRect();
    return { x: r.left + (v.x + 1) / 2 * r.width, y: r.top + (1 - v.y) / 2 * r.height };
  };

  // Back to the starting view: town in the middle, framed to fit.
  Town.prototype.recenter = function () {
    if (this.explore) { this.setExplore(true); return; }
    var c = this.controls, cam = this.camera;
    c.target.set(0, this.fit.y, 0);
    cam.position.set(34, 30 + this.fit.y, 34);
    this.fit.auto = true;
    this.fitDirty = true;
    this.needsRender = true;
  };

  Town.seasonOf = function (iso) {
    if (!iso) return null;
    var m = +iso.slice(5, 7);
    return m === 12 || m <= 2 ? 'winter' : m <= 5 ? 'spring' : m <= 8 ? 'summer' : 'fall';
  };

  Town.houseSlots = HOUSE_SLOTS.length;
  Town.layout = { groundClear: groundClear, groundY: groundY, landY: landY, HEAD: HEAD, polar: polar, FOREST: FOREST, WILD: WILD, PEAKS: PEAKS, FIELDS: FIELDS, HOUSE_SLOTS: HOUSE_SLOTS, CASTLE_SITES: CASTLE_SITES, CASTLE_ROADS: CASTLE_ROADS };
  Town.secrets = SECRETS;
  Town.bible = BIBLE;
  function fmtN(n) { return Math.round(n).toLocaleString('en-CA'); }
  root.Town = Town;
})(window);
