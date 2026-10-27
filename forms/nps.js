// Pesquisa da Comunidade: comportamento do formulário.
// Exemplo estático: nada sai do navegador, o envio só monta o payload JSON.

(function () {
  'use strict';

  var answers = {};
  var REQUIRED = ['connection', 'nps'];

  var BUCKETS = {
    detractor: { label: 'Detrator', color: '#ec6b9a' },
    passive: { label: 'Neutro', color: '#f5a623' },
    promoter: { label: 'Promotor', color: '#00d9b4' }
  };

  function bucketOf(score) {
    if (score <= 6) return 'detractor';
    if (score <= 8) return 'passive';
    return 'promoter';
  }

  // --- escalas 0-10 -------------------------------------------------------

  function buildScale(scale) {
    var field = scale.dataset.field;
    for (var n = 0; n <= 10; n++) {
      var b = document.createElement('button');
      b.type = 'button';
      b.textContent = String(n);
      b.value = String(n);
      b.setAttribute('aria-pressed', 'false');
      b.setAttribute('aria-label', 'Nota ' + n + ' de 10');
      scale.appendChild(b);
    }
    scale.addEventListener('click', function (ev) {
      var btn = ev.target.closest('button');
      if (!btn) return;
      select(scale, field, Number(btn.value));
    });
  }

  function select(scale, field, score) {
    answers[field] = score;
    Array.prototype.forEach.call(scale.children, function (b) {
      b.setAttribute('aria-pressed', String(Number(b.value) === score));
    });
    if (scale.dataset.nps === 'true') {
      scale.dataset.tone = bucketOf(score);
    }
    paintVerdict(field, score, scale.dataset.nps === 'true');
    refresh();
  }

  function paintVerdict(field, score, isNps) {
    var el = document.querySelector('[data-verdict="' + field + '"]');
    if (!el) return;
    if (isNps) {
      var b = BUCKETS[bucketOf(score)];
      el.style.setProperty('--verdict-color', b.color);
      el.innerHTML = 'Nota ' + score + ': você conta como <b>' + b.label + '</b> no NPS.';
    } else {
      el.style.setProperty('--verdict-color', '#378add');
      el.innerHTML = 'Você marcou <b>' + score + ' de 10</b>.';
    }
  }

  document.querySelectorAll('.mh-scale').forEach(buildScale);

  // --- progresso e estado do botão ---------------------------------------

  var fill = document.getElementById('progress-fill');
  var label = document.getElementById('progress-label');
  var submit = document.getElementById('submit');
  var hint = document.getElementById('hint');

  function answeredRequired() {
    return REQUIRED.filter(function (f) { return typeof answers[f] === 'number'; }).length;
  }

  function refresh() {
    var answered = answeredRequired();
    fill.style.width = (answered / REQUIRED.length * 100) + '%';
    label.textContent = answered + ' de ' + REQUIRED.length + ' perguntas obrigatórias respondidas';
    submit.disabled = answered < REQUIRED.length;
    hint.textContent = submit.disabled
      ? 'Responda as duas perguntas obrigatórias para enviar.'
      : 'Pronto para enviar.';
  }

  refresh();

  // --- seção opcional -----------------------------------------------------

  var toggle = document.getElementById('optional-toggle');
  var optional = document.getElementById('optional');

  toggle.addEventListener('click', function () {
    var open = optional.hidden;
    optional.hidden = !open;
    toggle.setAttribute('aria-expanded', String(open));
    toggle.querySelector('strong').textContent = open
      ? 'Avaliando cada coordenação'
      : 'Quer avaliar cada coordenação também?';
    if (open) optional.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // --- envio (apenas monta o payload) ------------------------------------

  var form = document.getElementById('form');
  var doneBox = document.getElementById('done');

  form.addEventListener('submit', function (ev) {
    ev.preventDefault();
    if (submit.disabled) return;

    var coordFields = ['metarank', 'metawriters', 'engagement'];
    var coordComment = document.getElementById('coord-comment').value.trim();
    var touched = coordFields.some(function (f) { return typeof answers[f] === 'number'; }) || coordComment !== '';

    var payload = {
      form: 'metahub-nps',
      version: 1,
      submitted_at: new Date().toISOString(),
      core: {
        connection: answers.connection,
        nps: answers.nps,
        nps_bucket: bucketOf(answers.nps),
        comment: document.getElementById('comment').value.trim()
      },
      coordinations: touched ? {
        metarank: typeof answers.metarank === 'number' ? answers.metarank : null,
        metawriters: typeof answers.metawriters === 'number' ? answers.metawriters : null,
        engagement: typeof answers.engagement === 'number' ? answers.engagement : null,
        comment: coordComment
      } : null
    };

    document.getElementById('payload').textContent = JSON.stringify(payload, null, 2);
    form.hidden = true;
    toggle.hidden = true;
    doneBox.hidden = false;
    doneBox.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
})();
