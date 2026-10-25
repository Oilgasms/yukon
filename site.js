// Website mode: there's no claude.ai connection here, so answer the town's Google Drive and
// Strava requests from the files the twice-daily update saves in data/.
(function () {
  if (window.claude) return;
  var SHEETS = {
    '1ezfrNTfIvEWl_mphezu3zOHHLqCIJjRi4sE3gAHbHho': 'data/workouts.xlsx',
    '18H8UIzPnUcA-tuPPp8i17TbBM9CE_TSY3s4U0hl5XuA': 'data/bible.xlsx',
    '12y_x_81x0vXwEpqRJrU5eJaUcmWHCnVl7XMGSq_guTE': 'data/books.xlsx'
  };
  try {
    // Always read the published files, never anything a visitor's browser remembers.
    ['fittertown:sheet', 'fittertown:readingSheet', 'fittertown:readingPaste', 'fittertown:movieSheet'].forEach(function (k) { localStorage.removeItem(k); });
    localStorage.setItem('fittertown:strava', '1');
  } catch (e) {}

  window.SITE_MODE = true;
  function base64(buf) {
    var bytes = new Uint8Array(buf), s = '';
    for (var i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000));
    return btoa(s);
  }
  function file(path, as) {
    return fetch(path + '?v=' + Date.now(), { cache: 'no-store' }).then(function (r) {
      if (!r.ok) throw new Error(path + ': ' + r.status);
      return as === 'json' ? r.json() : r.arrayBuffer();
    });
  }
  var mcp = {
    callTool: function (server, tool, input) {
      // Until Strava is connected there's no file yet: show no activities rather than an error.
      if (server === 'Strava') return file('data/strava.json', 'json').catch(function () { return []; }).then(function (acts) { return { payload: { activities: acts, has_next_page: false } }; });
      var path = SHEETS[input && input.fileId];
      if (!path) return Promise.reject(new Error('No published copy of that file'));
      return file(path).then(function (buf) { return { payload: { content: base64(buf) } }; });
    },
    watchTool: function () { return function () {}; },
    describeTool: function () { return Promise.resolve({ inputSchema: { properties: {} } }); }
  };
  window.claude = { use: function (n) { return Promise.resolve(n === 'mcp' ? mcp : null); } };

  // Visitors can look but not rewire anything.
  var css = document.createElement('style');
  css.textContent = '#refresh,#strava,#reading,#movies,#reading-panel,#movies-panel{display:none!important}';
  document.head.append(css);
})();
