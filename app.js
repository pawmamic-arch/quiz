(function () {
  'use strict';

  var QUESTIONS_PER_GAME = 12;
  var STORAGE_KEY = 'krolewski-quiz:best';
  var LETTERS = ['A', 'B', 'C', 'D'];

  // Progi podsumowania dla 12 pytań
  var RANKS = [
    { max: 2,  name: 'Henryk Walezy', symbol: '🏃', desc: 'Uciekłeś, zanim się na dobre zaczęło. Szlachta wciąż Cię szuka.' },
    { max: 4,  name: 'August III Sas', symbol: '🍗', desc: 'Historia? Wolisz polowania i operę. Jedz, pij i popuszczaj pasa.' },
    { max: 6,  name: 'Michał Korybut Wiśniowiecki', symbol: '🥒', desc: 'Całkiem nieźle — tylko uważaj na kiszone ogórki.' },
    { max: 8,  name: 'August II Mocny', symbol: '💪', desc: 'Siła jest, wiedza też się pojawia. Podkowy drżą.' },
    { max: 10, name: 'Jan III Sobieski', symbol: '⚔️', desc: 'Wjechałeś w ten quiz jak husaria pod Wiedniem.' },
    { max: 11, name: 'Władysław Jagiełło', symbol: '⏳', desc: 'Prawdziwy długodystansowiec — rządziłbyś 48 lat.' },
    { max: 12, name: 'Kazimierz Wielki', symbol: '🏰', desc: 'Zastałeś quiz drewnianym, a zostawiłeś murowanym. Królu!' }
  ];

  var PRAISE = ['Brawo, Wasza Wysokość!', 'Królewska odpowiedź!', 'Wiwat! Dokładnie tak.', 'Kronikarze to zapiszą!', 'Ależ erudycja!', 'Szlachta bije brawo!'];
  var OOPS = ['Ojoj, nie tym razem!', 'Pudło, Miłościwa Pani!', 'Kronikarz litościwie przemilczy…', 'Nawet królom się zdarza (królowym nie).', 'Szlachta kręci wąsem…'];

  var reducedMotionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;
  function reducedMotion() { return !!(reducedMotionQuery && reducedMotionQuery.matches); }

  function $(id) { return document.getElementById(id); }

  var el = {
    screens: document.querySelectorAll('.screen'),
    best: $('best'),
    startBtn: $('start-btn'),
    qNum: $('q-num'),
    qTotal: $('q-total'),
    scoreNow: $('score-now'),
    scorePill: document.querySelector('.score-pill'),
    progress: $('progress'),
    card: $('q-card'),
    qText: $('q-text'),
    answers: $('answers'),
    feedback: $('feedback'),
    verdict: $('verdict'),
    fact: $('fact'),
    nextBtn: $('next-btn'),
    resultTitle: $('result-title'),
    resultSymbol: $('result-symbol'),
    resultRuler: $('result-ruler'),
    resultDesc: $('result-desc'),
    resultScore: $('result-score'),
    resultTotal: $('result-total'),
    record: $('record'),
    againBtn: $('again-btn'),
    shareBtn: $('share-btn'),
    toast: $('toast'),
    confetti: $('confetti')
  };

  var state = { questions: [], index: 0, score: 0, locked: false, lastResult: null };

  /* ---------- Narzędzia ---------- */

  function shuffle(arr) {
    var a = arr.slice();
    for (var i = a.length - 1; i > 0; i--) {
      var j = Math.floor(Math.random() * (i + 1));
      var t = a[i]; a[i] = a[j]; a[j] = t;
    }
    return a;
  }

  function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }

  function rankFor(score) {
    for (var i = 0; i < RANKS.length; i++) if (score <= RANKS[i].max) return RANKS[i];
    return RANKS[RANKS.length - 1];
  }

  function restartAnimation(node, cls) {
    node.classList.remove(cls);
    void node.offsetWidth; // wymusza reflow, żeby animacja ruszyła od nowa
    node.classList.add(cls);
  }

  /* ---------- Rekord (localStorage może być niedostępny) ---------- */

  function loadBest() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var data = JSON.parse(raw);
      return data && typeof data.score === 'number' ? data : null;
    } catch (e) {
      return null;
    }
  }

  function saveBest(data) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) { /* tryb prywatny itp. — trudno */ }
  }

  function renderBest() {
    var best = loadBest();
    if (!best) { el.best.hidden = true; return; }
    el.best.innerHTML = '';
    el.best.appendChild(document.createTextNode('Twój rekord: '));
    var strong = document.createElement('strong');
    strong.textContent = best.score + '/' + best.total;
    el.best.appendChild(strong);
    el.best.appendChild(document.createTextNode(' · ' + rankFor(best.score).name));
    el.best.hidden = false;
  }

  /* ---------- Ekrany ---------- */

  function showScreen(id, focusEl) {
    for (var i = 0; i < el.screens.length; i++) {
      el.screens[i].classList.toggle('is-active', el.screens[i].id === id);
    }
    window.scrollTo(0, 0);
    if (focusEl) focusEl.focus({ preventScroll: true });
  }

  /* ---------- Gra ---------- */

  function startGame() {
    var pool = window.QUESTIONS || [];
    var count = Math.min(QUESTIONS_PER_GAME, pool.length);
    state.questions = shuffle(pool).slice(0, count).map(function (q) {
      return {
        q: q.q,
        fact: q.fact,
        options: shuffle(q.answers.map(function (text, i) { return { text: text, correct: i === q.correct }; }))
      };
    });
    state.index = 0;
    state.score = 0;
    el.qTotal.textContent = count;
    el.progress.setAttribute('aria-valuemax', count);
    el.scoreNow.textContent = '0';
    stopConfetti();
    showScreen('screen-quiz');
    renderQuestion();
  }

  function setProgress(done) {
    var total = state.questions.length;
    el.progress.style.setProperty('--p', total ? done / total : 0);
    el.progress.setAttribute('aria-valuenow', done);
  }

  function renderQuestion() {
    var q = state.questions[state.index];
    state.locked = false;

    el.qNum.textContent = state.index + 1;
    el.qText.textContent = q.q;
    el.feedback.hidden = true;
    setProgress(state.index);

    el.answers.innerHTML = '';
    q.options.forEach(function (opt, i) {
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'answer is-entering';
      btn.dataset.idx = i;
      btn.style.animationDelay = (0.12 + i * 0.06) + 's';

      var letter = document.createElement('span');
      letter.className = 'answer__letter';
      letter.setAttribute('aria-hidden', 'true');
      letter.textContent = LETTERS[i];

      var text = document.createElement('span');
      text.className = 'answer__text';
      text.textContent = opt.text;

      btn.appendChild(letter);
      btn.appendChild(text);
      btn.addEventListener('click', function () { choose(i); });
      el.answers.appendChild(btn);
    });

    restartAnimation(el.card, 'is-entering');
    window.scrollTo(0, 0);
    el.qText.focus({ preventScroll: true });
  }

  function choose(picked) {
    if (state.locked) return;
    state.locked = true;

    var q = state.questions[state.index];
    var ok = q.options[picked].correct;
    var correctText = '';
    var buttons = el.answers.querySelectorAll('.answer');

    q.options.forEach(function (opt, i) {
      var btn = buttons[i];
      btn.disabled = true;
      btn.style.animationDelay = '0s';
      btn.classList.remove('is-entering');
      var letter = btn.querySelector('.answer__letter');
      if (opt.correct) {
        correctText = opt.text;
        btn.classList.add('is-correct');
        letter.textContent = '✓';
        btn.setAttribute('aria-label', opt.text + ' — poprawna odpowiedź');
      } else if (i === picked) {
        btn.classList.add('is-wrong');
        letter.textContent = '✗';
        btn.setAttribute('aria-label', opt.text + ' — Twoja odpowiedź, błędna');
      } else {
        btn.classList.add('is-dimmed');
      }
    });

    if (ok) {
      state.score++;
      el.scoreNow.textContent = state.score;
      restartAnimation(el.scorePill, 'is-bumped');
    } else if (navigator.vibrate && !reducedMotion()) {
      try { navigator.vibrate(60); } catch (e) { /* ignore */ }
    }

    el.verdict.className = 'verdict ' + (ok ? 'is-ok' : 'is-bad');
    el.verdict.innerHTML = '';
    var main = document.createElement('span');
    main.textContent = ok ? pick(PRAISE) : pick(OOPS);
    if (!ok) {
      var small = document.createElement('small');
      small.textContent = 'Poprawna odpowiedź: ' + correctText;
      main.appendChild(small);
    }
    el.verdict.appendChild(main);

    el.fact.textContent = q.fact;
    el.nextBtn.querySelector('span').textContent =
      state.index === state.questions.length - 1 ? 'Zobacz werdykt' : 'Dalej';
    el.feedback.hidden = false;
    setProgress(state.index + 1);

    el.nextBtn.focus({ preventScroll: true });
    // Na telefonie ciekawostka i „Dalej” bywają pod ekranem — przewiń płynnie.
    setTimeout(function () {
      var rect = el.nextBtn.getBoundingClientRect();
      if (rect.bottom > window.innerHeight - 8) {
        el.feedback.scrollIntoView({ behavior: reducedMotion() ? 'auto' : 'smooth', block: 'end' });
      }
    }, 380);
  }

  function next() {
    if (!state.locked) return;
    if (state.index < state.questions.length - 1) {
      state.index++;
      renderQuestion();
    } else {
      finish();
    }
  }

  function finish() {
    var total = state.questions.length;
    var score = state.score;
    var rank = rankFor(score);
    var best = loadBest();
    var isRecord = !best || score > best.score;

    state.lastResult = { score: score, total: total, rank: rank };
    if (isRecord) saveBest({ score: score, total: total, date: new Date().toISOString() });

    el.resultSymbol.textContent = rank.symbol;
    el.resultRuler.textContent = rank.name;
    el.resultDesc.textContent = rank.desc;
    el.resultTotal.textContent = total;
    el.record.hidden = !(isRecord && best); // pierwszej gry nie ogłaszamy jako rekordu
    showScreen('screen-result', el.resultTitle);
    countUp(el.resultScore, score);

    if (score >= 7 && !reducedMotion()) {
      setTimeout(function () { launchConfetti(score === total ? 320 : score >= 9 ? 220 : 130); }, 450);
    }
  }

  function countUp(node, target) {
    if (reducedMotion() || target === 0) { node.textContent = target; return; }
    var start = null;
    var duration = 300 + target * 90;
    node.textContent = '0';
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / duration);
      var eased = 1 - Math.pow(1 - t, 3);
      node.textContent = Math.round(eased * target);
      if (t < 1) requestAnimationFrame(step);
    }
    setTimeout(function () { requestAnimationFrame(step); }, 500);
  }

  /* ---------- Udostępnianie ---------- */

  function shareUrl() {
    if (!/^https?:$/.test(location.protocol)) return '';
    return location.origin + location.pathname.replace(/index\.html$/, '');
  }

  function shareText() {
    var r = state.lastResult;
    return 'Mój wynik w quizie „Kto jest najlepszym władcą w historii Polski?”: ' + r.score + '/' + r.total +
      ' — jestem jak ' + r.rank.name + '! 👑 Sprawdź, czy masz w sobie królewską krew.';
  }

  function share() {
    if (!state.lastResult) return;
    var text = shareText();
    var url = shareUrl();
    var data = { title: 'Kto jest najlepszym władcą w historii Polski?', text: text };
    if (url) data.url = url;

    if (navigator.share && (!navigator.canShare || navigator.canShare(data))) {
      navigator.share(data).catch(function (err) {
        if (err && err.name === 'AbortError') return; // użytkownik zamknął okno
        copyToClipboard(url ? text + ' ' + url : text);
      });
    } else {
      copyToClipboard(url ? text + ' ' + url : text);
    }
  }

  function copyToClipboard(text) {
    function fallback() {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      var ok = false;
      try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
      document.body.removeChild(ta);
      toast(ok ? 'Skopiowano wynik do schowka — wklej go znajomym!' : 'Nie udało się skopiować. Zrób zrzut ekranu, Wasza Wysokość!');
    }
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(function () {
        toast('Skopiowano wynik do schowka — wklej go znajomym!');
      }, fallback);
    } else {
      fallback();
    }
  }

  var toastTimer = null;
  function toast(msg) {
    el.toast.textContent = msg;
    el.toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () { el.toast.classList.remove('is-visible'); }, 3200);
  }

  /* ---------- Konfetti ze złotych drobinek ---------- */

  var confettiRaf = null;

  function stopConfetti() {
    if (confettiRaf) cancelAnimationFrame(confettiRaf);
    confettiRaf = null;
    var ctx = el.confetti.getContext && el.confetti.getContext('2d');
    if (ctx) ctx.clearRect(0, 0, el.confetti.width, el.confetti.height);
  }

  function launchConfetti(count) {
    var canvas = el.confetti;
    var ctx = canvas.getContext && canvas.getContext('2d');
    if (!ctx) return;
    stopConfetti();

    var dpr = Math.min(window.devicePixelRatio || 1, 2);
    var W = window.innerWidth;
    var H = window.innerHeight;
    canvas.width = Math.round(W * dpr);
    canvas.height = Math.round(H * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    var colors = ['#fff4c7', '#fbe9a6', '#f6dc8c', '#e9c45a', '#d4a73a', '#b8891f', '#ffffff', '#a8243a'];
    var parts = [];
    for (var i = 0; i < count; i++) {
      var fromLeft = i % 2 === 0;
      var angle = (fromLeft ? -60 : -120) + (Math.random() - 0.5) * 40;
      var speed = 9 + Math.random() * 10;
      var rad = angle * Math.PI / 180;
      var type = Math.random();
      parts.push({
        x: fromLeft ? -10 : W + 10,
        y: H * (0.75 + Math.random() * 0.2),
        vx: Math.cos(rad) * speed * (0.6 + W / 900),
        vy: Math.sin(rad) * speed * (0.85 + H / 2600),
        size: 4 + Math.random() * 6,
        color: colors[(Math.random() * colors.length) | 0],
        shape: type < 0.6 ? 'rect' : type < 0.85 ? 'dot' : 'star',
        rot: Math.random() * Math.PI * 2,
        vr: (Math.random() - 0.5) * 0.3,
        wobble: Math.random() * Math.PI * 2,
        delay: Math.random() * 18
      });
    }

    var start = performance.now();
    var last = start;

    function drawStar(p, s) {
      ctx.beginPath();
      for (var k = 0; k < 8; k++) {
        var r = k % 2 === 0 ? s : s * 0.35;
        var a = k * Math.PI / 4;
        ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
      }
      ctx.closePath();
      ctx.fill();
    }

    function frame(now) {
      var dt = Math.min(3, (now - last) / 16.67);
      last = now;
      var elapsed = now - start;
      ctx.clearRect(0, 0, W, H);
      var alive = 0;

      for (var i = 0; i < parts.length; i++) {
        var p = parts[i];
        if (p.delay > 0) { p.delay -= dt; alive++; continue; }
        p.vy += 0.28 * dt;
        p.vx *= Math.pow(0.985, dt);
        p.vy *= Math.pow(0.985, dt);
        p.wobble += 0.12 * dt;
        p.x += (p.vx + Math.sin(p.wobble) * 0.8) * dt;
        p.y += p.vy * dt;
        p.rot += p.vr * dt;
        if (p.y > H + 30) continue;
        alive++;

        var fade = elapsed > 4200 ? Math.max(0, 1 - (elapsed - 4200) / 1200) : 1;
        ctx.save();
        ctx.globalAlpha = fade;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        ctx.fillStyle = p.color;
        if (p.shape === 'rect') {
          ctx.scale(1, Math.cos(p.wobble * 1.6));
          ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
        } else if (p.shape === 'dot') {
          ctx.beginPath();
          ctx.arc(0, 0, p.size / 3, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.globalAlpha = fade * (0.6 + 0.4 * Math.abs(Math.sin(p.wobble * 2)));
          drawStar(p, p.size * 0.8);
        }
        ctx.restore();
      }

      if (alive > 0 && elapsed < 5400) {
        confettiRaf = requestAnimationFrame(frame);
      } else {
        stopConfetti();
      }
    }
    confettiRaf = requestAnimationFrame(frame);
  }

  /* ---------- Zdarzenia ---------- */

  el.startBtn.addEventListener('click', startGame);
  el.nextBtn.addEventListener('click', next);
  el.againBtn.addEventListener('click', startGame);
  el.shareBtn.addEventListener('click', share);

  // Skróty na desktopie: 1–4 / A–D wybiera odpowiedź
  document.addEventListener('keydown', function (e) {
    if (e.altKey || e.ctrlKey || e.metaKey) return;
    if (!$('screen-quiz').classList.contains('is-active') || state.locked) return;
    var key = e.key.toUpperCase();
    var idx = '1234'.indexOf(key);
    if (idx < 0) idx = LETTERS.indexOf(key);
    if (idx >= 0 && idx < state.questions[state.index].options.length) {
      e.preventDefault();
      choose(idx);
    }
  });

  renderBest();

  /* ---------- Service worker (offline) ---------- */
  if ('serviceWorker' in navigator && /^https?:$/.test(location.protocol)) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function () { /* brak offline — trudno */ });
    });
  }
})();
