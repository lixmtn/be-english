'use strict';
/* Bé English — ôn tiếng Anh theo bài trên lớp cho 2 bé.
   Vanilla JS, offline, giọng đọc = speechSynthesis của iPad. */

const $ = (s, r = document) => r.querySelector(s);
const app = $('#app');
const fx = $('#fx');
const rnd = n => Math.floor(Math.random() * n);
const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = rnd(i + 1); [a[i], a[j]] = [a[j], a[i]]; } return a; };
const pick = a => a[rnd(a.length)];
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);

/* ---------------- state ---------------- */
const KEY = 'be-english-v1';
const DEFAULT = {
  kids: {
    minh: { name: 'Minh', age: '2.5 tuổi', stickers: [] },
    pony: { name: 'Pony', age: '4 tuổi', stickers: [] },
  },
  kid: null, rate: 1, custom: [], memSize: {},
};
let S;
try { S = Object.assign(structuredClone(DEFAULT), JSON.parse(localStorage.getItem(KEY) || '{}')); } catch { S = structuredClone(DEFAULT); }
const save = () => { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch {} };
const kid = () => S.kids[S.kid];
const small = () => S.kid === 'minh'; // bé nhỏ 2.5 tuổi → dễ hơn

/* ---------------- timers (dọn khi rời màn) ---------------- */
let timers = [];
const later = (fn, ms) => { const t = setTimeout(fn, ms); timers.push(t); return t; };
const clearTimers = () => { timers.forEach(clearTimeout); timers = []; };

/* ---------------- voice ---------------- */
let enVoice = null;
function loadVoice() {
  const vs = speechSynthesis.getVoices();
  const en = vs.filter(v => /^en[-_]US/i.test(v.lang));
  enVoice = ['Samantha', 'Karen', 'Google US English', 'Ava', 'Allison', 'Susan']
    .map(n => en.find(v => v.name.includes(n))).find(Boolean) || en[0] || vs.find(v => /^en/i.test(v.lang)) || null;
}
if ('speechSynthesis' in window) { loadVoice(); speechSynthesis.onvoiceschanged = loadVoice; }
function say(text, rate) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(text);
  if (enVoice) u.voice = enVoice;
  u.lang = 'en-US';
  u.rate = (rate || (small() ? 0.8 : 0.88)) * S.rate;
  u.pitch = 1.1;
  speechSynthesis.speak(u);
}
const LETTER_NAME = { a: 'ay', b: 'bee', c: 'see', d: 'dee', e: 'ee', f: 'ef', g: 'jee', h: 'aitch', i: 'eye', j: 'jay', k: 'kay', l: 'el', m: 'em', n: 'en', o: 'oh', p: 'pee', q: 'cue', r: 'ar', s: 'ess', t: 'tee', u: 'you', v: 'vee', w: 'double you', x: 'ex', y: 'why', z: 'zee' };
const PRAISE = ['Great job!', 'Well done!', 'Yay!', 'Super!', 'Good job!', 'Excellent!', 'You did it!'];

/* ---------------- sound fx ---------------- */
let actx;
function tone(freqs, dur = 0.12, type = 'sine', vol = 0.18) {
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    let t = actx.currentTime;
    freqs.forEach(f => {
      const o = actx.createOscillator(), g = actx.createGain();
      o.type = type; o.frequency.value = f;
      g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur * 1.8);
      o.connect(g).connect(actx.destination); o.start(t); o.stop(t + dur * 2);
      t += dur;
    });
  } catch {}
}
const sfx = {
  good: () => tone([660, 880, 1175], 0.09),
  pop: () => tone([520], 0.06, 'triangle', 0.12),
  oops: () => tone([300, 240], 0.1, 'sine', 0.1),
  win: () => tone([523, 659, 784, 1047, 1319], 0.1, 'triangle', 0.16),
};

function confetti(n = 40) {
  const cols = ['#f08a5d', '#7a7fe8', '#57b894', '#f2a93b', '#e86a92', '#4fb3d9'];
  for (let i = 0; i < n; i++) {
    const p = document.createElement('i');
    p.className = 'conf';
    p.style.left = (Math.random() * 100) + 'vw';
    p.style.background = pick(cols);
    p.style.animationDuration = (1.4 + Math.random() * 1.4) + 's';
    p.style.animationDelay = (Math.random() * 0.3) + 's';
    p.style.transform = `rotate(${rnd(360)}deg)`;
    fx.appendChild(p);
    setTimeout(() => p.remove(), 3200);
  }
}

/* ---------------- graphics ---------------- */
// Gấu: mỗi bộ phận là 1 nhóm SVG riêng (viewBox 0 0 300 380)
const FUR = '#c98b5a', DARK = '#8a5a36', LIGHT = '#f3d6b3';
const BEAR = {
  arms: `<rect x="55" y="158" width="34" height="84" rx="17" fill="${FUR}" stroke="${DARK}" stroke-width="3" transform="rotate(20 72 165)"/>
         <rect x="211" y="158" width="34" height="84" rx="17" fill="${FUR}" stroke="${DARK}" stroke-width="3" transform="rotate(-20 228 165)"/>`,
  legs: `<rect x="104" y="258" width="40" height="78" rx="19" fill="${FUR}" stroke="${DARK}" stroke-width="3"/>
         <rect x="156" y="258" width="40" height="78" rx="19" fill="${FUR}" stroke="${DARK}" stroke-width="3"/>`,
  feet: `<ellipse cx="118" cy="343" rx="32" ry="17" fill="${FUR}" stroke="${DARK}" stroke-width="3"/>
         <ellipse cx="182" cy="343" rx="32" ry="17" fill="${FUR}" stroke="${DARK}" stroke-width="3"/>
         <ellipse class="d" cx="118" cy="345" rx="16" ry="8" fill="${LIGHT}"/><ellipse class="d" cx="182" cy="345" rx="16" ry="8" fill="${LIGHT}"/>`,
  body: `<ellipse cx="150" cy="212" rx="62" ry="72" fill="${FUR}" stroke="${DARK}" stroke-width="3"/>
         <ellipse class="d" cx="150" cy="222" rx="38" ry="46" fill="${LIGHT}"/>`,
  head: `<circle cx="104" cy="42" r="22" fill="${FUR}" stroke="${DARK}" stroke-width="3"/><circle cx="196" cy="42" r="22" fill="${FUR}" stroke="${DARK}" stroke-width="3"/>
         <circle class="d" cx="104" cy="42" r="11" fill="${LIGHT}"/><circle class="d" cx="196" cy="42" r="11" fill="${LIGHT}"/>
         <circle cx="150" cy="88" r="57" fill="${FUR}" stroke="${DARK}" stroke-width="3"/>
         <ellipse class="d" cx="150" cy="106" rx="26" ry="20" fill="${LIGHT}"/>
         <circle class="d" cx="127" cy="80" r="7" fill="#2b1d14"/><circle class="d" cx="173" cy="80" r="7" fill="#2b1d14"/>
         <circle class="d" cx="129" cy="78" r="2.4" fill="#fff"/><circle class="d" cx="175" cy="78" r="2.4" fill="#fff"/>
         <ellipse class="d" cx="150" cy="98" rx="9" ry="6.5" fill="#2b1d14"/>
         <path class="d" d="M140 110 Q150 119 160 110" stroke="#2b1d14" stroke-width="3" fill="none" stroke-linecap="round"/>
         <circle class="d" cx="114" cy="102" r="7" fill="#f4a3a3" opacity=".6"/><circle class="d" cx="186" cy="102" r="7" fill="#f4a3a3" opacity=".6"/>`,
  hands: `<circle cx="45" cy="242" r="20" fill="${FUR}" stroke="${DARK}" stroke-width="3"/><circle cx="255" cy="242" r="20" fill="${FUR}" stroke="${DARK}" stroke-width="3"/>
          <circle class="d" cx="45" cy="244" r="9" fill="${LIGHT}"/><circle class="d" cx="255" cy="244" r="9" fill="${LIGHT}"/>`,
};
const BEAR_ORDER = ['arms', 'legs', 'feet', 'body', 'head', 'hands']; // thứ tự vẽ (dưới → trên)
const BEAR_NAMES = { head: 'head', body: 'body', arms: 'arms', hands: 'hands', legs: 'legs', feet: 'feet' };
function bearSVG({ highlight, cls = '' } = {}) {
  const g = BEAR_ORDER.map(p => `<g class="part ${highlight ? (p === highlight ? 'hl' : 'dim') : ''}" data-part="${p}">${BEAR[p]}</g>`).join('');
  return `<svg class="bear ${cls}" viewBox="0 0 300 380">${g}</svg>`;
}

function shapeSVG(s, fill = '#7a7fe8') {
  const m = {
    circle: `<circle cx="50" cy="50" r="38"/>`,
    square: `<rect x="14" y="14" width="72" height="72" rx="6"/>`,
    triangle: `<polygon points="50,10 92,86 8,86"/>`,
    star: `<polygon points="50,6 61,38 95,38 67,58 78,92 50,71 22,92 33,58 5,38 39,38"/>`,
    heart: `<path d="M50 88 C10 60 4 34 22 20 C36 9 48 18 50 28 C52 18 64 9 78 20 C96 34 90 60 50 88Z"/>`,
    rectangle: `<rect x="6" y="26" width="88" height="48" rx="6"/>`,
  };
  return `<svg class="shape" viewBox="0 0 100 100" fill="${fill}" stroke="#0002" stroke-width="2">${m[s]}</svg>`;
}
const SHAPE_FILL = { circle: '#ef6b57', square: '#4fb3d9', triangle: '#57b894', star: '#f2c53b', heart: '#e86a92', rectangle: '#7a7fe8' };

function vis(it) {
  if (it.bear) return bearSVG({ highlight: it.bear, cls: 'mini' });
  if (it.color) return `<span class="blob${it.color === '#ffffff' ? ' white' : ''}" style="background:${it.color}"></span>`;
  if (it.shape) return shapeSVG(it.shape, SHAPE_FILL[it.shape]);
  if (it.num) return `<span class="num"><b>${it.num}</b><span class="dots">${'<i></i>'.repeat(it.num)}</span></span>`;
  if (it.e) return `<span class="emo">${it.e}</span>`;
  return `<span class="txt">${esc(it.w)}</span>`;
}

/* ---------------- shell ---------------- */
function screen(html, { back, title, cls = '' } = {}) {
  clearTimers();
  if ('speechSynthesis' in window) speechSynthesis.cancel();
  document.body.className = S.kid ? 'kid-' + S.kid : 'picker';
  app.innerHTML = `
    ${back ? `<header class="top">
      <button class="btn-round" id="backBtn" aria-label="Quay lại">←</button>
      <h1>${title || ''}</h1>
      <button class="sticker-pill" id="stickerBtn">⭐ ${kid() ? kid().stickers.length : 0}</button>
    </header>` : ''}
    <main class="${cls}">${html}</main>`;
  if (back) {
    $('#backBtn').onclick = back;
    $('#stickerBtn').onclick = () => renderStickers(() => renderHome());
  }
  return $('main');
}

function allUnits() {
  return [...S.custom.map(u => ({ ...u, custom: true, hue: u.hue || '#ff8a5b' })), ...UNITS];
}

/* ---------------- picker ---------------- */
function renderPicker() {
  if (pendingReload) { S.kid = null; save(); return location.reload(); }
  S.kid = null; save();
  const m = screen(`
    <div class="picker-wrap">
      <h1 class="brand">Bé English</h1>
      <p class="sub">Ai học hôm nay nè?</p>
      <div class="kids">
        ${['minh', 'pony'].map(k => `
          <button class="kid-card kc-${k}" data-k="${k}">
            <span class="kid-ava">${k === 'minh' ? '🦖' : '🦄'}</span>
            <b>${esc(S.kids[k].name)}</b><small>${esc(S.kids[k].age)} · ⭐ ${S.kids[k].stickers.length}</small>
          </button>`).join('')}
      </div>
      <button class="parent-btn" id="parentBtn">⚙️ <small>giữ 1 giây</small></button>
    </div>`);
  m.querySelectorAll('.kid-card').forEach(b => b.onclick = () => {
    S.kid = b.dataset.k; save();
    say(`Hello ${S.kids[S.kid].name}!`);
    renderHome();
  });
  holdToOpen($('#parentBtn'), renderParent);
}

/* ---------------- home ---------------- */
let homeTab = 'units', pendingReload = false;
function renderHome(tab = homeTab) {
  if (pendingReload) return location.reload();
  homeTab = tab;
  const k = kid();
  const m = screen(`
    <div class="tabs">
      <button class="tab ${tab === 'units' ? 'on' : ''}" data-t="units">📚 Bài học</button>
      <button class="tab ${tab === 'abc' ? 'on' : ''}" data-t="abc">🔤 ABC Phonics</button>
    </div>
    <div id="homeBody"></div>`, { back: renderPicker, title: `${S.kid === 'minh' ? '🦖' : '🦄'} ${esc(k.name)}` });
  m.querySelectorAll('.tab').forEach(b => b.onclick = () => { sfx.pop(); renderHome(b.dataset.t); });
  const body = $('#homeBody');
  if (tab === 'units') {
    body.innerHTML = `<div class="grid units">${allUnits().map((u, i) => `
      <button class="card unit" data-i="${i}" style="--hue:${u.hue};animation-delay:${i * 30}ms">
        <span class="plate">${u.icon || '📘'}</span>
        <b>${esc(u.title)}</b><small>${esc(u.vi || '')}</small>
        ${u.custom ? '<em class="badge">Lớp</em>' : ''}
      </button>`).join('')}</div>`;
    const us = allUnits();
    body.querySelectorAll('.unit').forEach(b => b.onclick = () => { sfx.pop(); const u = us[+b.dataset.i]; say(u.title); renderUnit(u); });
  } else {
    const games = small()
      ? [['explore', '🅰️', 'Chữ cái', 'ABC Explorer'], ['parade', '🎵', 'Đọc ABC', 'ABC Parade'], ['findLetter', '🔍', 'Tìm chữ', 'Find the letter']]
      : [['explore', '🅰️', 'Chữ cái', 'ABC Explorer'], ['parade', '🎵', 'Đọc ABC', 'ABC Parade'], ['findLetter', '🔍', 'Tìm chữ', 'Find the letter'],
         ['startsWith', '🍎', 'Bắt đầu bằng?', 'Starts with…'], ['firstLetter', '✏️', 'Chữ đầu tiên', 'First letter']];
    const hues = ['#f08a5d', '#7a7fe8', '#57b894', '#e86a92', '#f2a93b'];
    body.innerHTML = `<div class="grid games">${games.map(([id, ic, vi, en], i) => `
      <button class="card game" data-g="${id}" style="--hue:${hues[i]};animation-delay:${i * 40}ms">
        <span class="plate">${ic}</span><b>${vi}</b><small>${en}</small></button>`).join('')}</div>`;
    body.querySelectorAll('.game').forEach(b => b.onclick = () => { sfx.pop(); PHONICS_GAMES[b.dataset.g](); });
  }
}

/* ---------------- unit menu ---------------- */
function unitGames(u) {
  const g = [];
  if (u.kind === 'body') { g.push(['puzzle', '🧩', 'Ghép Gấu', 'Build the bear']); g.push(['touch', '👆', 'Chạm vào', 'Touch the…']); }
  g.push(['cards', '🃏', 'Học từ', 'Flashcards']);
  g.push(['listen', '👂', 'Nghe & chọn', 'Listen & tap']);
  g.push(['memory', '🎴', 'Lật hình', 'Memory']);
  if (u.items.every(it => it.e || it.shape)) g.push(['shadow', '🌗', 'Ghép bóng', 'Match the shadow']);
  return g;
}
function renderUnit(u) {
  const games = unitGames(u);
  const m = screen(`
    <div class="unit-head" style="--hue:${u.hue}">
      <span class="plate big">${u.icon || '📘'}</span>
      <div><h2>${esc(u.title)}</h2><p>${u.items.map(i => esc(i.w)).join(' · ')}</p></div>
    </div>
    <div class="grid games">${games.map(([id, ic, vi, en], i) => `
      <button class="card game" data-g="${id}" style="--hue:${u.hue};animation-delay:${i * 40}ms">
        <span class="plate">${ic}</span><b>${vi}</b><small>${en}</small></button>`).join('')}</div>`,
    { back: () => renderHome('units'), title: esc(u.vi || u.title) });
  m.querySelectorAll('.game').forEach(b => b.onclick = () => { sfx.pop(); GAMES[b.dataset.g](u); });
}

/* ---------------- reward ---------------- */
function finish(again, back) {
  const k = kid();
  const pool = STICKERS.filter(s => !k.stickers.includes(s));
  const st = pick(pool.length ? pool : STICKERS);
  k.stickers.push(st); save();
  sfx.win(); confetti(60);
  later(() => say(`${pick(PRAISE)} ${k.name}! You got a sticker!`), 300);
  const ov = document.createElement('div');
  ov.className = 'overlay';
  ov.innerHTML = `<div class="reward">
      <div class="big-sticker">${st}</div>
      <h2>Giỏi quá, ${esc(k.name)}!</h2>
      <p>Bé được thêm 1 sticker ⭐ ${k.stickers.length}</p>
      <div class="row"><button class="btn primary" id="again">🔁 Chơi lại</button><button class="btn" id="home">🏠 Về</button></div>
    </div>`;
  fx.appendChild(ov);
  $('#again', ov).onclick = () => { ov.remove(); again(); };
  $('#home', ov).onclick = () => { ov.remove(); back(); };
  $('#stickerBtn') && ($('#stickerBtn').textContent = '⭐ ' + k.stickers.length);
}

function renderStickers(back) {
  const k = kid();
  const m = screen(`
    <h2 class="center">Sticker của ${esc(k.name)} (${k.stickers.length})</h2>
    <div class="sticker-book">${k.stickers.length ? k.stickers.map((s, i) => `<span style="animation-delay:${Math.min(i, 40) * 25}ms">${s}</span>`).join('') : '<p class="muted">Chơi game để nhận sticker nhé! 🌟</p>'}</div>`,
    { back, title: '⭐ Sticker' });
}

/* ---------------- shared: game header ---------------- */
function gameShell(u, title, en, again) {
  const m = screen(`
    <div class="prompt"><button class="btn-round speak" id="replay">🔊</button><div id="promptTxt"></div><div class="dotsbar" id="prog"></div></div>
    <div class="stage" id="stage"></div>`,
    { back: () => u ? renderUnit(u) : renderHome('abc'), title });
  return { stage: $('#stage'), setPrompt(en, vi) { $('#promptTxt').innerHTML = `<b>${esc(en)}</b>${vi ? `<small>${esc(vi)}</small>` : ''}`; },
    onReplay(fn) { $('#replay').onclick = fn; },
    progress(i, n) { $('#prog').innerHTML = Array.from({ length: n }, (_, j) => `<i class="${j < i ? 'on' : ''}"></i>`).join(''); },
    finish: () => finish(again, () => u ? renderUnit(u) : renderHome('abc')) };
}

/* ---------------- generic quiz engine ---------------- */
// build(i) → { en, vi, sayPrompt, choices:[{html, ok, word}], cls }
function quiz({ u, title, rounds, build, again }) {
  const g = gameShell(u, title, '', again);
  let i = 0;
  function round() {
    if (i >= rounds) return g.finish();
    g.progress(i, rounds);
    const r = build(i);
    g.setPrompt(r.en, r.vi);
    const sp = () => say(r.sayPrompt || r.en);
    g.onReplay(sp); later(sp, 250);
    let misses = 0, locked = false;
    g.stage.innerHTML = `${r.top || ''}<div class="choices n${r.choices.length} ${r.cls || ''}">${r.choices.map((c, j) =>
      `<button class="choice" data-j="${j}" style="animation-delay:${j * 60}ms">${c.html}</button>`).join('')}</div>`;
    g.stage.querySelectorAll('.choice').forEach(b => b.onclick = () => {
      if (locked) return;
      const c = r.choices[+b.dataset.j];
      if (c.ok) {
        locked = true; b.classList.add('right'); sfx.good();
        say(`${c.word ? cap(c.word) + '! ' : ''}${pick(PRAISE)}`);
        i++; later(round, 1500);
      } else {
        misses++; b.classList.add('wrong'); sfx.oops();
        if (c.word) say(c.word);
        later(() => b.classList.remove('wrong'), 500);
        if (misses >= 2) g.stage.querySelector(`.choice[data-j="${r.choices.findIndex(x => x.ok)}"]`).classList.add('hint');
      }
    });
  }
  round();
}
const sampleWith = (items, ans, n) => shuffle([ans, ...shuffle(items.filter(x => x !== ans && x.w !== ans.w)).slice(0, n - 1)]);

/* ---------------- GAMES (per unit) ---------------- */
const GAMES = {};

GAMES.cards = function cards(u) {
  const items = u.items;
  let i = 0, seen = new Set();
  const g = gameShell(u, '🃏 Học từ', '', () => cards(u));
  function show() {
    seen.add(i);
    const it = items[i];
    g.progress(seen.size, items.length);
    g.setPrompt(cap(it.w), it.vi);
    g.stage.innerHTML = `
      <div class="flash-wrap">
        <button class="nav" id="prev" ${i === 0 ? 'disabled' : ''}>‹</button>
        <button class="flashcard" id="fc">${vis(it)}<b>${esc(it.w)}</b></button>
        <button class="nav" id="next">›</button>
      </div>`;
    const sp = () => { say(it.w); $('#fc').classList.remove('bump'); void $('#fc').offsetWidth; $('#fc').classList.add('bump'); };
    g.onReplay(sp); $('#fc').onclick = sp; later(sp, 200);
    $('#prev').onclick = () => { if (i > 0) { i--; sfx.pop(); show(); } };
    $('#next').onclick = () => {
      sfx.pop();
      if (i < items.length - 1) { i++; show(); } else if (seen.size >= items.length) g.finish();
    };
    swipe(g.stage, d => (d < 0 ? $('#next') : $('#prev')).click());
  }
  show();
};

GAMES.listen = function listen(u) {
  const n = small() ? 2 : (u.items.length >= 8 ? 4 : 3);
  const rounds = small() ? 5 : 8;
  let order = shuffle(u.items);
  quiz({ u, title: '👂 Nghe & chọn', rounds, again: () => listen(u),
    build: i => {
      const ans = order[i % order.length];
      const are = /s$/.test(ans.w) || ['feet', 'teeth'].includes(ans.w);
      return { en: `Where ${are ? 'are' : 'is'} the ${ans.w}?`, vi: `Đâu là ${ans.vi}?`, cls: ans.bear ? 'bears' : '',
        choices: sampleWith(u.items, ans, n).map(it => ({ html: vis(it), ok: it === ans, word: it.w })) };
    } });
};

GAMES.memory = function memory(u) {
  const key = S.kid;
  const opts = small() ? [3, 5] : [5, 8];
  let pairs = S.memSize[key] || opts[0];
  if (!opts.includes(pairs)) pairs = opts[0];
  pairs = Math.min(pairs, u.items.length);
  const g = gameShell(u, '🎴 Lật hình', '', () => memory(u));
  g.setPrompt('Find the pairs!', `Lật ${pairs * 2} hình — tìm 2 hình giống nhau`);
  const sp = () => say('Find the pairs!'); g.onReplay(sp); later(sp, 200);
  const items = shuffle(u.items).slice(0, pairs);
  const deck = shuffle([...items, ...items]);
  const cols = deck.length <= 6 ? 3 : deck.length <= 10 ? 5 : 4;
  g.stage.innerHTML = `
    <div class="col">
      <div class="seg">${opts.map(p => `<button class="${p === pairs ? 'on' : ''}" data-p="${p}">${p * 2} hình</button>`).join('')}</div>
      <div class="mem" style="--cols:${cols}">${deck.map((it, j) => `
        <button class="mcard" data-j="${j}" style="animation-delay:${j * 35}ms"><span class="back">${S.kid === 'minh' ? '🦖' : '🦄'}</span><span class="face">${vis(it)}</span></button>`).join('')}</div>
    </div>`;
  g.stage.querySelectorAll('.seg button').forEach(b => b.onclick = () => { S.memSize[key] = +b.dataset.p; save(); memory(u); });
  let open = [], matched = 0, busy = false;
  g.progress(0, pairs);
  g.stage.querySelectorAll('.mcard').forEach(c => c.onclick = () => {
    if (busy || c.classList.contains('up')) return;
    const it = deck[+c.dataset.j];
    c.classList.add('up'); sfx.pop(); say(it.w);
    open.push(c);
    if (open.length === 2) {
      const [a, b] = open; open = [];
      if (deck[+a.dataset.j] === deck[+b.dataset.j]) {
        matched++; g.progress(matched, pairs);
        later(() => { a.classList.add('done'); b.classList.add('done'); sfx.good(); }, 350);
        if (matched === pairs) later(g.finish, 1300);
      } else {
        busy = true;
        later(() => { a.classList.remove('up'); b.classList.remove('up'); busy = false; }, 1100);
      }
    }
  });
};

GAMES.shadow = function shadow(u) {
  const per = small() ? 2 : 4;
  const rounds = small() ? 2 : 3;
  let r = 0;
  const g = gameShell(u, '🌗 Ghép bóng', '', () => shadow(u));
  const pool = shuffle(u.items);
  function round() {
    if (r >= rounds) return g.finish();
    g.progress(r, rounds);
    g.setPrompt('Match the shadow!', 'Kéo hình vào đúng cái bóng');
    const sp = () => say('Match the shadow!'); g.onReplay(sp); later(sp, 200);
    const set = [];
    for (let k = 0; k < per; k++) set.push(pool[(r * per + k) % pool.length]);
    const uniq = [...new Set(set)];
    g.stage.innerHTML = `
      <div class="col shadow-game">
        <div class="slots">${shuffle(uniq).map(it => `<div class="slot" data-w="${esc(it.w)}">${vis(it)}</div>`).join('')}</div>
        <div class="tray">${shuffle(uniq).map(it => `<button class="piece" data-w="${esc(it.w)}">${vis(it)}</button>`).join('')}</div>
      </div>`;
    let left = uniq.length, selected = null;
    const place = (p, slot) => {
      slot.classList.add('filled'); p.classList.add('gone'); sfx.good();
      say(p.dataset.w); left--;
      if (left === 0) { r++; later(round, 1400); }
    };
    const tryDrop = (p, slot) => {
      if (slot && slot.dataset.w === p.dataset.w && !slot.classList.contains('filled')) { place(p, slot); return true; }
      if (slot) { sfx.oops(); slot.classList.add('wrong'); later(() => slot.classList.remove('wrong'), 450); }
      return false;
    };
    g.stage.querySelectorAll('.piece').forEach(p => {
      draggable(p, {
        onStart: () => { say(p.dataset.w); },
        onDrop: (x, y) => tryDrop(p, document.elementsFromPoint(x, y).find(e => e.classList && e.classList.contains('slot'))),
        onTap: () => {
          g.stage.querySelectorAll('.piece').forEach(q => q.classList.remove('sel'));
          selected = p; p.classList.add('sel'); say(p.dataset.w);
        },
      });
    });
    g.stage.querySelectorAll('.slot').forEach(s => s.onclick = () => { if (selected && !selected.classList.contains('gone')) { if (tryDrop(selected, s)) selected = null; } });
  }
  round();
};

/* Ghép Gấu — kéo từng bộ phận vào đúng chỗ */
GAMES.puzzle = function puzzle(u) {
  const g = gameShell(u, '🧩 Ghép Gấu', '', () => puzzle(u));
  const ghost = BEAR_ORDER.map(p => `<g class="ghost" data-ghost="${p}">${BEAR[p]}</g>`).join('');
  const real = BEAR_ORDER.map(p => `<g class="part hide" data-real="${p}">${BEAR[p]}</g>`).join('');
  g.stage.innerHTML = `<div class="puzzle"><div class="board"><svg class="bear" viewBox="0 0 300 380">${ghost}${real}</svg></div><div class="ptray" id="ptray"></div></div>`;
  const svg = g.stage.querySelector('svg');
  const bbox = {};
  BEAR_ORDER.forEach(p => { const b = svg.querySelector(`[data-ghost="${p}"]`).getBBox(); bbox[p] = [b.x - 4, b.y - 4, b.width + 8, b.height + 8]; });
  const seq = small() ? ['head', 'body', 'arms', 'hands', 'legs', 'feet'] : shuffle(['head', 'body', 'arms', 'hands', 'legs', 'feet']);
  let step = 0;
  const tray = $('#ptray');
  const pieceSVG = p => `<svg viewBox="${bbox[p].join(' ')}">${BEAR[p]}</svg>`;
  function want() { return seq[step]; }
  function prompt() {
    g.progress(step, seq.length);
    if (step >= seq.length) {
      svg.classList.add('dance');
      g.setPrompt('Head, body, arms, hands, legs and feet!', 'Gấu hoàn thành rồi!');
      say('Head, body, arms, hands, legs and feet! Yay!');
      svg.querySelectorAll('[data-real]').forEach(el => el.addEventListener('click', () => say(el.dataset.real)));
      later(g.finish, 4200);
      return;
    }
    const w = want();
    g.setPrompt(small() ? cap(w) + '!' : `Where do the ${w} go?`.replace('do the head go', 'does the head go').replace('do the body go', 'does the body go'),
      small() ? 'Kéo vào chỗ đúng' : 'Tìm và kéo đúng bộ phận');
    const sp = () => say(small() ? `${cap(w)}! Put the ${w} on the bear.` : `Find the ${w}!`);
    g.onReplay(sp); sp();
    svg.querySelectorAll('.ghost').forEach(el => el.classList.toggle('glow', small() && el.dataset.ghost === w));
    renderTray();
  }
  function renderTray() {
    const remaining = small() ? [want()] : shuffle(seq.slice(step));
    tray.innerHTML = remaining.map(p => `<button class="bpiece" data-p="${p}"><span>${pieceSVG(p)}</span><small>${p}</small></button>`).join('');
    tray.querySelectorAll('.bpiece').forEach(el => {
      const p = el.dataset.p;
      draggable(el, {
        sizeTo: () => svg.querySelector(`[data-ghost="${p}"]`).getBoundingClientRect(),
        floatHTML: pieceSVG(p),
        onStart: () => say(p),
        onTap: () => { say(p); if (small()) svg.querySelector(`[data-ghost="${p}"]`).classList.add('glow'); },
        onDrop: (x, y, rect) => {
          if (p !== want()) { sfx.oops(); say(`That's the ${p}. Find the ${want()}!`); return false; }
          const t = svg.querySelector(`[data-ghost="${p}"]`).getBoundingClientRect();
          const cx = rect.left + rect.width / 2, cy = rect.top + rect.height / 2;
          const d = Math.hypot(cx - (t.left + t.width / 2), cy - (t.top + t.height / 2));
          const thr = Math.max(small() ? 140 : 80, Math.min(t.width, t.height) * 0.45);
          if (d > thr) { sfx.oops(); say(small() ? `Put the ${p} on the bear!` : 'Try again!'); svg.querySelector(`[data-ghost="${p}"]`).classList.add('glow'); return false; }
          svg.querySelector(`[data-ghost="${p}"]`).classList.add('hide');
          const r = svg.querySelector(`[data-real="${p}"]`); r.classList.remove('hide'); r.classList.add('pop');
          sfx.good(); say(`${cap(p)}! ${pick(PRAISE)}`);
          step++; tray.innerHTML = '';
          later(prompt, 1500);
          return true;
        },
      });
    });
  }
  prompt();
};

/* Chạm vào bộ phận trên Gấu */
GAMES.touch = function touch(u) {
  const parts = ['head', 'body', 'arms', 'hands', 'legs', 'feet'];
  const seq = small() ? shuffle(parts).slice(0, 4) : shuffle(parts);
  let i = 0, misses = 0, locked = false;
  const g = gameShell(u, '👆 Chạm vào', '', () => touch(u));
  g.stage.innerHTML = `<div class="board touch">${bearSVG({ cls: 'tap' })}</div>`;
  const svg = g.stage.querySelector('svg');
  function round() {
    if (i >= seq.length) { svg.classList.add('dance'); return later(g.finish, 1200); }
    g.progress(i, seq.length); misses = 0; locked = false;
    const w = seq[i];
    g.setPrompt(`Touch the ${w}!`, `Chạm vào ${u.items.find(x => x.w === w).vi}`);
    const sp = () => say(`Touch the ${w}!`); g.onReplay(sp); later(sp, 250);
  }
  svg.addEventListener('pointerdown', e => {
    const part = e.target.closest('[data-part]');
    if (!part || locked) return;
    const p = part.dataset.part, w = seq[i];
    part.classList.remove('flash'); void part.getBBox(); part.classList.add('flash');
    if (p === w) {
      locked = true; sfx.good(); say(`${cap(p)}! ${pick(PRAISE)}`);
      svg.querySelectorAll('.part').forEach(x => x.classList.remove('hl'));
      i++; later(round, 1500);
    } else {
      misses++; sfx.oops(); say(`That's the ${p}.`);
      if (misses >= 2) svg.querySelector(`[data-part="${w}"]`).classList.add('hl');
    }
  });
  round();
};

/* ---------------- PHONICS ---------------- */
const letterSay = l => `${LETTER_NAME[l.l]}. ${LETTER_NAME[l.l]} is for ${l.w}.`;
const letterHTML = l => `<span class="letter"><b>${l.l.toUpperCase()}</b><i>${l.l}</i></span>`;
const PHONICS_GAMES = {};

PHONICS_GAMES.explore = function explore() {
  const m = screen(`<div class="abc-grid">${PHONICS.map((l, i) => `<button class="abc" data-i="${i}" style="--hue:hsl(${i * 14} 75% 62%);animation-delay:${i * 15}ms">${l.l.toUpperCase()}${l.l}</button>`).join('')}</div>`,
    { back: () => renderHome('abc'), title: '🅰️ ABC Explorer' });
  let count = new Set();
  m.querySelectorAll('.abc').forEach(b => b.onclick = () => {
    const l = PHONICS[+b.dataset.i];
    count.add(l.l); b.classList.add('seen');
    sfx.pop(); say(letterSay(l));
    const ov = document.createElement('div');
    ov.className = 'overlay light';
    ov.innerHTML = `<div class="letter-card">${letterHTML(l)}<span class="emo">${l.e}</span><b class="kw">${l.w}</b></div>`;
    ov.onclick = () => ov.remove();
    fx.appendChild(ov);
    later(() => ov.remove(), 4000);
  });
};

PHONICS_GAMES.parade = function parade() {
  let i = 0, playing = true;
  const m = screen(`
    <div class="parade"><div class="letter-card" id="pc"></div>
      <div class="row"><button class="btn" id="pv">‹</button><button class="btn primary" id="pp">⏸ Dừng</button><button class="btn" id="nx">›</button></div></div>`,
    { back: () => renderHome('abc'), title: '🎵 ABC Parade' });
  function show() {
    const l = PHONICS[i];
    $('#pc').innerHTML = `${letterHTML(l)}<span class="emo">${l.e}</span><b class="kw">${l.w}</b>`;
    $('#pc').classList.remove('bump'); void $('#pc').offsetWidth; $('#pc').classList.add('bump');
    say(letterSay(l));
  }
  function tick() {
    show();
    if (!playing) return;
    later(() => {
      if (!playing) return;
      if (i < PHONICS.length - 1) { i++; tick(); }
      else { playing = false; finish(parade, () => renderHome('abc')); }
    }, small() ? 3600 : 3200);
  }
  $('#pp').onclick = () => { playing = !playing; $('#pp').textContent = playing ? '⏸ Dừng' : '▶️ Chạy'; clearTimers(); if (playing) tick(); };
  $('#pv').onclick = () => { playing = false; clearTimers(); $('#pp').textContent = '▶️ Chạy'; i = Math.max(0, i - 1); show(); };
  $('#nx').onclick = () => { playing = false; clearTimers(); $('#pp').textContent = '▶️ Chạy'; i = Math.min(PHONICS.length - 1, i + 1); show(); };
  $('#pc').onclick = show;
  later(tick, 300);
};

PHONICS_GAMES.findLetter = function findLetter() {
  const n = small() ? 2 : 4, rounds = small() ? 5 : 8;
  const base = small() ? PHONICS.slice(0, 10) : PHONICS; // bé nhỏ: A–J trước
  const order = shuffle(base);
  quiz({ title: '🔍 Tìm chữ', rounds, again: findLetter,
    build: i => {
      const ans = order[i % order.length];
      const set = shuffle([ans, ...shuffle(base.filter(x => x !== ans)).slice(0, n - 1)]);
      return { en: `Find the letter ${ans.l.toUpperCase()}!`, vi: 'Tìm chữ cái', sayPrompt: `Find the letter ${LETTER_NAME[ans.l]}!`, cls: 'letters',
        choices: set.map(l => ({ html: letterHTML(l), ok: l === ans, word: LETTER_NAME[l.l] })) };
    } });
};

const PH_START = PHONICS.filter(l => l.w[0] === l.l);
PHONICS_GAMES.startsWith = function startsWith() {
  const order = shuffle(PH_START);
  quiz({ title: '🍎 Bắt đầu bằng?', rounds: 8, again: startsWith,
    build: i => {
      const ans = order[i % order.length];
      const set = shuffle([ans, ...shuffle(PH_START.filter(x => x !== ans)).slice(0, 2)]);
      return { en: `Which one starts with ${ans.l.toUpperCase()}?`, vi: 'Hình nào bắt đầu bằng chữ này?',
        sayPrompt: `${LETTER_NAME[ans.l]}. Which one starts with ${LETTER_NAME[ans.l]}?`,
        top: `<div class="big-letter">${letterHTML(ans)}</div>`,
        choices: set.map(l => ({ html: `<span class="emo">${l.e}</span>`, ok: l === ans, word: l.w })) };
    } });
};

PHONICS_GAMES.firstLetter = function firstLetter() {
  const order = shuffle(PH_START);
  quiz({ title: '✏️ Chữ đầu tiên', rounds: 8, again: firstLetter,
    build: i => {
      const ans = order[i % order.length];
      const set = shuffle([ans, ...shuffle(PH_START.filter(x => x !== ans)).slice(0, 2)]);
      return { en: `${cap(ans.w)} starts with…?`, vi: 'Từ này bắt đầu bằng chữ gì?',
        sayPrompt: `${ans.w}. ${ans.w} starts with…`,
        top: `<div class="big-pic"><span class="emo">${ans.e}</span><b>${ans.w}</b></div>`,
        cls: 'letters',
        choices: set.map(l => ({ html: letterHTML(l), ok: l === ans, word: LETTER_NAME[l.l] })) };
    } });
};

/* ---------------- input helpers ---------------- */
function draggable(el, { onStart, onDrop, onTap, sizeTo, floatHTML }) {
  el.addEventListener('pointerdown', e => {
    e.preventDefault();
    const r0 = el.getBoundingClientRect();
    const sx = e.clientX, sy = e.clientY;
    let fl = null, moved = false;
    const begin = () => {
      moved = true;
      const sz = sizeTo ? sizeTo() : r0;
      fl = document.createElement('div');
      fl.className = 'floater';
      fl.innerHTML = floatHTML || el.innerHTML;
      fl.style.width = sz.width + 'px'; fl.style.height = sz.height + 'px';
      fx.appendChild(fl);
      el.classList.add('dragging');
      onStart && onStart();
    };
    const pos = (x, y) => { fl.style.transform = `translate(${x - fl.offsetWidth / 2}px, ${y - fl.offsetHeight / 2}px) scale(1.04)`; };
    const move = ev => {
      if (!moved && Math.hypot(ev.clientX - sx, ev.clientY - sy) > 8) begin();
      if (moved) pos(ev.clientX, ev.clientY);
    };
    const up = ev => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', up);
      window.removeEventListener('pointercancel', up);
      if (!moved) { onTap && onTap(); return; }
      const rect = fl.getBoundingClientRect();
      fl.style.visibility = 'hidden';
      const ok = onDrop(ev.clientX, ev.clientY, rect);
      fl.style.visibility = '';
      el.classList.remove('dragging');
      if (ok) { fl.remove(); return; }
      fl.style.transition = 'transform .35s cubic-bezier(.3,1.4,.6,1)';
      fl.style.transform = `translate(${r0.left + r0.width / 2 - fl.offsetWidth / 2}px, ${r0.top + r0.height / 2 - fl.offsetHeight / 2}px) scale(.6)`;
      setTimeout(() => fl.remove(), 360);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    window.addEventListener('pointercancel', up);
  });
}

function swipe(el, fn) {
  let x0 = null;
  el.addEventListener('touchstart', e => { x0 = e.touches[0].clientX; }, { passive: true });
  el.addEventListener('touchend', e => {
    if (x0 === null) return;
    const d = e.changedTouches[0].clientX - x0; x0 = null;
    if (Math.abs(d) > 60) fn(d);
  });
}

function holdToOpen(btn, fn) {
  let t;
  const start = e => { e.preventDefault(); btn.classList.add('holding'); t = setTimeout(() => { btn.classList.remove('holding'); fn(); }, 1000); };
  const end = () => { clearTimeout(t); btn.classList.remove('holding'); };
  btn.addEventListener('pointerdown', start);
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => btn.addEventListener(ev, end));
}

/* ---------------- parent panel ---------------- */
function renderParent() {
  const m = screen(`
    <div class="parent">
      <h2>⚙️ Phụ huynh</h2>
      <section>
        <h3>Tên các bé</h3>
        <label>Bé nhỏ 🦖 <input id="nMinh" value="${esc(S.kids.minh.name)}"> <input id="aMinh" value="${esc(S.kids.minh.age)}" class="short"></label>
        <label>Bé lớn 🦄 <input id="nPony" value="${esc(S.kids.pony.name)}"> <input id="aPony" value="${esc(S.kids.pony.age)}" class="short"></label>
      </section>
      <section>
        <h3>Tốc độ đọc</h3>
        <div class="seg" id="rate">${[[0.8, 'Chậm'], [1, 'Vừa'], [1.15, 'Nhanh']].map(([v, t]) => `<button data-v="${v}" class="${S.rate === v ? 'on' : ''}">${t}</button>`).join('')}</div>
        <button class="btn" id="testVoice">🔊 Thử giọng</button> <small class="muted" id="voiceName"></small>
      </section>
      <section>
        <h3>➕ Thêm bài trên lớp</h3>
        <p class="muted">Mỗi dòng 1 từ: <code>từ | emoji | nghĩa</code> (emoji, nghĩa có thể bỏ trống). Ví dụ: <code>apple | 🍎 | quả táo</code></p>
        <input id="cuTitle" placeholder="Tên bài, vd: Unit 3 – My Toys">
        <input id="cuIcon" placeholder="Icon (emoji), vd: 🧸" class="short">
        <textarea id="cuWords" rows="6" placeholder="ball | ⚽ | quả bóng&#10;car | 🚗 | xe hơi"></textarea>
        <button class="btn primary" id="cuAdd">Lưu bài</button>
        <div class="custom-list">${S.custom.map((u, i) => `<div class="cu"><span>${u.icon || '📘'} ${esc(u.title)} <small>(${u.items.length} từ)</small></span><button class="btn small" data-del="${i}">Xoá</button></div>`).join('') || '<p class="muted">Chưa có bài nào.</p>'}</div>
      </section>
      <section>
        <h3>Sticker</h3>
        <button class="btn" id="resetSt">Xoá hết sticker 2 bé</button>
      </section>
      <button class="btn primary wide" id="done">✓ Xong</button>
    </div>`, { cls: 'scroll' });
  $('#voiceName').textContent = enVoice ? 'Giọng: ' + enVoice.name : 'Chưa thấy giọng tiếng Anh — vào Cài đặt › Trợ năng › Nội dung được đọc › Giọng nói';
  m.querySelectorAll('#rate button').forEach(b => b.onclick = () => { S.rate = +b.dataset.v; save(); m.querySelectorAll('#rate button').forEach(x => x.classList.toggle('on', x === b)); });
  $('#testVoice').onclick = () => say('Hello! Head, body, arms, hands, legs and feet.', 0.88);
  $('#cuAdd').onclick = () => {
    const title = $('#cuTitle').value.trim();
    const items = $('#cuWords').value.split('\n').map(l => l.split('|').map(s => s.trim())).filter(a => a[0])
      .map(([w, e, vi]) => ({ w: w.toLowerCase(), e: e || '', vi: vi || '' }));
    if (!title || items.length < 2) { alert('Cần tên bài và ít nhất 2 từ.'); return; }
    items.forEach(it => { if (!it.e) delete it.e; });
    S.custom.push({ id: 'c' + Date.now(), title, vi: 'Bài trên lớp', icon: $('#cuIcon').value.trim() || '📘', items });
    save(); renderParent();
  };
  m.querySelectorAll('[data-del]').forEach(b => b.onclick = () => { if (confirm('Xoá bài này?')) { S.custom.splice(+b.dataset.del, 1); save(); renderParent(); } });
  $('#resetSt').onclick = () => { if (confirm('Xoá hết sticker?')) { S.kids.minh.stickers = []; S.kids.pony.stickers = []; save(); } };
  $('#done').onclick = () => {
    S.kids.minh.name = $('#nMinh').value.trim() || 'Minh'; S.kids.minh.age = $('#aMinh').value.trim();
    S.kids.pony.name = $('#nPony').value.trim() || 'Pony'; S.kids.pony.age = $('#aPony').value.trim();
    save(); renderPicker();
  };
}

/* ---------------- boot ---------------- */
document.addEventListener('gesturestart', e => e.preventDefault());
if (S.kid && S.kids[S.kid]) renderHome(); else renderPicker();

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js').then(reg => setInterval(() => reg.update(), 60000)).catch(() => {});
  let had = !!navigator.serviceWorker.controller;
  // bản mới: chỉ reload khi bé đang ở màn chọn bài, không cắt ngang game
  navigator.serviceWorker.addEventListener('controllerchange', () => { if (had) pendingReload = true; had = true; });
}
