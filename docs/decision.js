/* ============================================================
   decision.js — Logique du widget de décision
   À placer dans inegalites/docs/js/decision.js
   (ou référencé via include-after-body dans _quarto.yml)
   ============================================================ */

(function() {
  const STORAGE_KEY = 'voyage_inegalites_decisions';

  function loadDecisions() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}'); }
    catch(e) { return {}; }
  }

  function saveDecision(acte, choice, label, echo) {
    const all = loadDecisions();
    all['acte_' + acte] = { choice, label, echo, ts: Date.now() };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
  }

  function initWidget(root) {
    const d = root.dataset;
    const existing = loadDecisions()['acte_' + d.acte];

    root.classList.add('wd-root');
    root.innerHTML = `
      <div class="wd-card">
        <div class="wd-header">
          <div class="wd-avatar">✦</div>
          <div>
            <div class="wd-guide-name">${d.guide}</div>
            <div class="wd-parole">${d.parole}</div>
          </div>
        </div>
        <div class="wd-body">
          <div class="wd-lieu">${d.titre}</div>
          <div class="wd-dilemme">${d.dilemme}</div>
          <div class="wd-opts">
            <button class="wd-opt" data-choice="a" ${existing ? 'disabled' : ''}>
              <span class="wd-opt-label">${d.labelA}</span>
              <span>${d.optA}</span>
            </button>
            <button class="wd-opt" data-choice="b" ${existing ? 'disabled' : ''}>
              <span class="wd-opt-label">${d.labelB}</span>
              <span>${d.optB}</span>
            </button>
            <button class="wd-opt" data-choice="c" ${existing ? 'disabled' : ''}>
              <span class="wd-opt-label">${d.labelC}</span>
              <span>${d.optC}</span>
            </button>
          </div>
          <div class="wd-echo ${existing ? 'visible' : ''}" id="wd-echo-${d.acte}">
            <div class="wd-echo-label">Résonance historique</div>
            <span id="wd-echo-text-${d.acte}">${existing ? existing.echo : ''}</span>
          </div>
        </div>
        <div class="wd-footer">
          <div class="wd-status">
            <div class="wd-dot ${existing ? 'done' : ''}" id="wd-dot-${d.acte}"></div>
            <span id="wd-status-txt-${d.acte}">${existing ? 'Décision enregistrée dans le journal' : 'En attente de ta décision'}</span>
          </div>
          <button class="wd-change ${existing ? 'visible' : ''}" id="wd-change-${d.acte}">Modifier</button>
        </div>
      </div>`;

    if (existing) {
      const btn = root.querySelector(`[data-choice="${existing.choice}"]`);
      if (btn) btn.classList.add('chosen');
    }

    root.querySelectorAll('.wd-opt').forEach(function(btn) {
      btn.addEventListener('click', function() {
        const choice = this.dataset.choice;
        const label = d['label' + choice.toUpperCase()];
        const echo = d['echo' + choice.toUpperCase()];
        saveDecision(d.acte, choice, label, echo);

        root.querySelectorAll('.wd-opt').forEach(function(b) {
          b.disabled = true;
          b.classList.remove('chosen');
        });
        this.classList.add('chosen');

        const echoEl = root.querySelector('#wd-echo-' + d.acte);
        const echoText = root.querySelector('#wd-echo-text-' + d.acte);
        echoText.textContent = echo;
        echoEl.classList.add('visible');

        root.querySelector('#wd-dot-' + d.acte).classList.add('done');
        root.querySelector('#wd-status-txt-' + d.acte).textContent = 'Décision enregistrée dans le journal';
        const changeBtn = root.querySelector('#wd-change-' + d.acte);
        if (changeBtn) changeBtn.classList.add('visible');
      });
    });

    const changeBtn = root.querySelector('#wd-change-' + d.acte);
    if (changeBtn) {
      changeBtn.addEventListener('click', function() {
        root.querySelectorAll('.wd-opt').forEach(function(b) {
          b.disabled = false;
          b.classList.remove('chosen');
        });
        root.querySelector('#wd-echo-' + d.acte).classList.remove('visible');
        root.querySelector('#wd-dot-' + d.acte).classList.remove('done');
        root.querySelector('#wd-status-txt-' + d.acte).textContent = 'En attente de ta décision';
        this.classList.remove('visible');

        const all = loadDecisions();
        delete all['acte_' + d.acte];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(all));
      });
    }
  }

  // Init tous les widgets présents sur la page
  function initAll() {
    document.querySelectorAll('[id="widget-decision"], [data-acte]').forEach(function(root) {
      if (root.dataset.acte && !root.classList.contains('wd-root')) {
        initWidget(root);
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
