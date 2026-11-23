// Courses pages: phone drawer, and on the MetaRank page collapsible ranks,
// the rank switcher and search across every rank.
(function () {
  var root = document.documentElement;

  // ---- phone drawer (replaces the icon rail below 768px) ----
  var side = document.querySelector('.mh-sidebar');
  var main = document.querySelector('main');
  if (side && main) {
    root.classList.add('mc-has-drawer');
    var logo = (document.querySelector('.mh-brand-dark') || {}).src || '';
    main.insertAdjacentHTML('afterbegin',
      '<div class="mc-topbar"><button type="button" class="mc-icon-btn mc-menu" aria-label="Open menu" aria-expanded="false">' +
      '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg></button>' +
      '<a href="index.html"><img src="' + logo + '" alt="MetaHub"></a><span class="mc-topbar-title">Courses</span></div>');
    document.body.insertAdjacentHTML('beforeend', '<div class="mc-scrim"></div>');
    var menu = document.querySelector('.mc-menu');
    var setDrawer = function (open) {
      root.classList.toggle('mc-drawer-open', open);
      menu.setAttribute('aria-expanded', String(open));
    };
    menu.addEventListener('click', function () { setDrawer(!root.classList.contains('mc-drawer-open')); });
    document.querySelector('.mc-scrim').addEventListener('click', function () { setDrawer(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setDrawer(false); });
  }

  var page = document.querySelector('.mc-page');
  if (!page) return;
  var ranks = [].slice.call(page.querySelectorAll('.mc-rank'));
  var chips = [].slice.call(page.querySelectorAll('.mc-chip'));
  var pill = page.querySelector('.mc-chip-pill');
  var toolbar = page.querySelector('.mc-toolbar');

  // ---- collapse / expand ----
  function setOpen(rank, open) {
    rank.classList.toggle('is-open', open);
    rank.querySelector('.mc-rank-head').setAttribute('aria-expanded', String(open));
  }
  ranks.forEach(function (r) {
    r.querySelector('.mc-rank-head').addEventListener('click', function () {
      setOpen(r, !r.classList.contains('is-open')); markCurrent(r);
    });
  });
  var expandAll = page.querySelector('.mc-expand');
  expandAll.addEventListener('click', function () {
    var open = expandAll.getAttribute('aria-pressed') !== 'true';
    ranks.forEach(function (r) { setOpen(r, open); });
    expandAll.setAttribute('aria-pressed', String(open));
    expandAll.setAttribute('aria-label', open ? 'Collapse all ranks' : 'Expand all ranks');
  });

  // ---- rank switcher: open that rank and glide to it ----
  function markCurrent(rank) {
    var n = rank.getAttribute('data-rank');
    chips.forEach(function (c) { c.setAttribute('aria-current', String(c.getAttribute('data-rank') === n)); });
    movePill();
  }
  function movePill() {
    var c = page.querySelector('.mc-chip[aria-current="true"]');
    if (!c || !c.offsetWidth) { pill.style.opacity = 0; return; }
    pill.style.opacity = 1;
    pill.style.width = c.offsetWidth + 'px';
    pill.style.transform = 'translateX(' + c.offsetLeft + 'px)';
  }
  chips.forEach(function (c) {
    c.addEventListener('click', function () {
      var r = page.querySelector('.mc-rank[data-rank="' + c.getAttribute('data-rank') + '"]');
      if (search.value) { search.value = ''; runSearch(); }
      setOpen(r, true); markCurrent(r);
      r.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
    });
  });
  window.addEventListener('resize', movePill);
  markCurrent(ranks[0]);

  // ---- phone: one button flips the toolbar between ranks and search ----
  var mode = page.querySelector('.mc-mode');
  var ICON_SEARCH = mode.innerHTML;
  var ICON_RANKS = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/></svg>';
  mode.addEventListener('click', function () {
    var toSearch = !toolbar.classList.contains('is-search');
    toolbar.classList.toggle('is-search', toSearch);
    mode.innerHTML = toSearch ? ICON_RANKS : ICON_SEARCH;
    mode.setAttribute('aria-label', toSearch ? 'Show MetaRank switcher' : 'Search lessons');
    if (toSearch) search.focus(); else movePill();
  });

  // ---- search: every rank, accents and case ignored, numbers like 1.3.2 work ----
  var search = page.querySelector('.mc-search input');
  var box = page.querySelector('.mc-search');
  var status = page.querySelector('.mc-status');
  var fold = function (s) { return s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase(); };
  var texts = [].slice.call(page.querySelectorAll('[data-text]'));
  texts.forEach(function (el) { el._raw = el.textContent; });
  var before = null; // which ranks were open before searching

  function highlight(el, q) {
    if (!q) { el.textContent = el._raw; return; }
    var raw = el._raw, f = fold(raw), out = '', i = 0, k;
    while ((k = f.indexOf(q, i)) !== -1) {
      out += esc(raw.slice(i, k)) + '<mark class="mc-hit">' + esc(raw.slice(k, k + q.length)) + '</mark>';
      i = k + q.length;
    }
    el.innerHTML = out + esc(raw.slice(i));
  }
  function esc(s) { return s.replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); }

  function runSearch() {
    var q = fold(search.value.trim());
    box.classList.toggle('has-value', !!q);
    if (q && !before) before = ranks.map(function (r) { return r.classList.contains('is-open'); });
    var hits = 0;
    ranks.forEach(function (r, ri) {
      var rankHit = 0;
      r.querySelectorAll('.mc-domain').forEach(function (d) {
        var title = d.querySelector('.mc-domain-head [data-text]');
        var domainMatch = q && fold(title._raw).indexOf(q) !== -1;
        var shown = 0;
        d.querySelectorAll('.mc-lesson').forEach(function (l) {
          var t = l.querySelector('[data-text]');
          var ok = !q || domainMatch || fold(t._raw).indexOf(q) !== -1;
          l.hidden = !ok; if (ok) shown++;
          highlight(t, q);
        });
        highlight(title, q);
        d.hidden = q && !shown;
        if (q) rankHit += domainMatch ? d.querySelectorAll('.mc-lesson').length : shown;
      });
      r.hidden = q && !rankHit;
      if (q) { setOpen(r, rankHit > 0); hits += rankHit; }
      else if (before) setOpen(r, before[ri]);
    });
    if (!q) before = null;
    status.textContent = q ? hits + (hits === 1 ? ' lesson' : ' lessons') + ' found' : '';
    page.classList.toggle('is-empty', !!q && !hits);
  }
  search.addEventListener('input', runSearch);
  search.addEventListener('keydown', function (e) { if (e.key === 'Escape') { search.value = ''; runSearch(); } });
  page.querySelector('.mc-search-clear').addEventListener('click', function () { search.value = ''; runSearch(); search.focus(); });
})();
