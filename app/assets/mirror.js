// Restores the bits of behaviour the React app owned, for the static mirror.
(function () {
  var GROUPS = {"MetaWriters": "<div id=\":r0:\" class=\"mh-nav-children\"><a class=\"mh-nav-child \" href=\"metawriters.html\">About</a><a class=\"mh-nav-child \" href=\"metawriters-submit.html\">Submit a paper</a><a class=\"mh-nav-child \" href=\"metawriters-my-papers.html\">My submissions</a><a class=\"mh-nav-child \" href=\"https://metahub.metaanalysisacademy.com/metawriters/team\">Team workspace</a></div>", "Conferences": "<div id=\":r1:\" class=\"mh-nav-children\"><a class=\"mh-nav-child \" href=\"sprints.html#program\">About</a><a class=\"mh-nav-child \" href=\"sprints.html#conferences\">Conferences &amp; deadlines</a></div>", "Experts Program": "<div id=\":r2:\" class=\"mh-nav-children\"><a class=\"mh-nav-child \" href=\"expert-apply.html#program\">Program</a><a class=\"mh-nav-child \" href=\"expert-apply.html#applications\">My applications</a></div>", "Admin": "<div id=\":r3:\" class=\"mh-nav-children\"><a class=\"mh-nav-child \" href=\"https://metahub.metaanalysisacademy.com/admin/onboarding\">Onboarding</a><a class=\"mh-nav-child \" href=\"https://metahub.metaanalysisacademy.com/admin/course-covers\">Course covers</a><a class=\"mh-nav-child \" href=\"https://metahub.metaanalysisacademy.com/admin/users\">Users</a><a class=\"mh-nav-child \" href=\"https://metahub.metaanalysisacademy.com/admin/alumni\">Alumni</a><a class=\"mh-nav-child \" href=\"https://metahub.metaanalysisacademy.com/admin/survey\">Survey</a><a class=\"mh-nav-child \" href=\"https://metahub.metaanalysisacademy.com/admin/metawriters\">MetaWriters</a><a class=\"mh-nav-child \" href=\"https://metahub.metaanalysisacademy.com/admin/roles\">Roles</a><a class=\"mh-nav-child \" href=\"https://metahub.metaanalysisacademy.com/admin/groups\">Groups</a><a class=\"mh-nav-child \" href=\"https://metahub.metaanalysisacademy.com/admin/banners\">Banners</a><a class=\"mh-nav-child \" href=\"https://metahub.metaanalysisacademy.com/admin/ranks\">Ranks</a><a class=\"mh-nav-child \" href=\"https://metahub.metaanalysisacademy.com/admin/showcases\">Showcases</a><a class=\"mh-nav-child \" href=\"https://metahub.metaanalysisacademy.com/admin/announcements\">Announcements</a><a class=\"mh-nav-child \" href=\"https://metahub.metaanalysisacademy.com/admin/expert-program\">Expert Program</a><a class=\"mh-nav-child \" href=\"https://metahub.metaanalysisacademy.com/admin/calendar\">Calendar</a><a class=\"mh-nav-child \" href=\"https://metahub.metaanalysisacademy.com/admin/sprints\">Conferences</a><a class=\"mh-nav-child \" href=\"https://metahub.metaanalysisacademy.com/admin/header-links\">Header Links</a></div>"};
  // sidebar groups (MetaWriters, Conferences, Experts Program, Admin)
  document.querySelectorAll('.mh-nav-group > button').forEach(function (b) {
    var name = b.textContent.trim(), kids = GROUPS[name];
    if (!kids || b.nextElementSibling) return;
    b.insertAdjacentHTML('afterend', kids);
    var panel = b.nextElementSibling;
    var open = /\/(metawriters|sprints|expert-apply)/.test(location.pathname) &&
      panel.querySelector('a[href^="' + location.pathname.split('/').pop() + '"]');
    panel.hidden = !open; b.setAttribute('aria-expanded', String(!!open));
    b.addEventListener('click', function () {
      panel.hidden = !panel.hidden; b.setAttribute('aria-expanded', String(!panel.hidden));
    });
  });
  // courses carousel: --pos rotates the three cards around the active one
  var track = document.querySelector('.mh-course-track');
  if (track) {
    var slides = [].slice.call(track.querySelectorAll('.mh-course-slide'));
    var dots = [].slice.call(document.querySelectorAll('.mh-course-dots button'));
    var arrows = document.querySelectorAll('.mh-course-arrow');
    var n = slides.length, i = Math.max(0, slides.findIndex(function (s) { return s.classList.contains('is-active'); }));
    var render = function () {
      slides.forEach(function (s, k) {
        var p = ((k - i) % n + n) % n; if (p > n / 2) p -= n;
        s.style.setProperty('--pos', p); s.classList.toggle('is-active', k === i);
      });
      dots.forEach(function (d, k) { d.setAttribute('aria-pressed', String(k === i)); });
    };
    arrows[0] && arrows[0].addEventListener('click', function () { i = (i - 1 + n) % n; render(); });
    arrows[1] && arrows[1].addEventListener('click', function () { i = (i + 1) % n; render(); });
    dots.forEach(function (d, k) { d.addEventListener('click', function () { i = k; render(); }); });
    var DEST = { 'MetaRank': 'metarank.html', 'Meta-Analysis Academy': 'academy.html' };
    slides.forEach(function (s, k) {
      s.querySelector('button').addEventListener('click', function () {
        if (k !== i) { i = k; render(); return; }
        var name = s.querySelector('.mh-course-name').textContent.trim();
        location.href = DEST[name] || 'index.html';
      });
    });
  }
})();
