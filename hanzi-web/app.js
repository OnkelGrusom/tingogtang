import { render } from 'preact';
import { useEffect, useMemo, useRef, useState } from 'preact/hooks';
import { html } from 'htm/preact';
import confetti from 'https://esm.sh/canvas-confetti@1.9.4';
import { LESSONS, CHARACTERS } from './data.js';

const KEYS = { PROFILE: 'hanzi2_user_profile', SRS: 'hanzi2_srs_items' };

const TONES = {
  1: { name: '1. tone — høy og flat', short: 'Høy flat', symbol: 'ā', analogy: 'Som en jevn sangtone hos tannlegen: «aaaa».', contour: '5–5' },
  2: { name: '2. tone — stigende', short: 'Stigende', symbol: 'á', analogy: 'Som et undrende spørsmål: «Hæ?» eller «Ja?»', contour: '3–5' },
  3: { name: '3. tone — dal', short: 'Fall-stig', symbol: 'ǎ', analogy: 'En ettertenksom «Tjaaa...» som går ned og opp.', contour: '2–1–4' },
  4: { name: '4. tone — bratt fall', short: 'Fallende', symbol: 'à', analogy: 'Kort og bestemt, som «NEI!» eller «STOPP!»', contour: '5–1' },
  5: { name: 'Nøytral tone', short: 'Lett', symbol: 'a', analogy: 'Kort og ubetont, som endelsen i «gutt-en».', contour: 'lett' }
};

const TONE_EX = {
  1: { char: '妈', pinyin: 'mā', meaning: 'mamma' },
  2: { char: '麻', pinyin: 'má', meaning: 'hamp / nummen' },
  3: { char: '马', pinyin: 'mǎ', meaning: 'hest' },
  4: { char: '骂', pinyin: 'mà', meaning: 'å kjefte' },
  5: { char: '吗', pinyin: 'ma', meaning: 'spørrepartikkel' }
};

const today = () => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};
const addDays = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

const defaultProfile = (level = 'beginner') => ({
  level,
  currentLessonId: level === 'hsk1' ? 'lesson-4' : 'lesson-1',
  completedLessonIds: level === 'hsk1' ? ['lesson-1', 'lesson-2', 'lesson-3'] : [],
  streak: 0,
  lastStudyDate: '',
  darkMode: false,
  totalCharactersLearned: 0,
  hasOnboarded: false,
  autoPlayAudio: true,
  dailyGoal: 10
});

const loadJSON = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};
const saveJSON = (key, value) => localStorage.setItem(key, JSON.stringify(value));

const speak = (text, rate = 0.8) =>
  new Promise((resolve) => {
    if (!('speechSynthesis' in window)) return resolve();
    speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = 'zh-CN';
    u.rate = rate;
    const voice = speechSynthesis.getVoices().find((v) => /zh|cmn|chinese/i.test(v.lang + v.name));
    if (voice) u.voice = voice;
    u.onend = resolve;
    u.onerror = resolve;
    speechSynthesis.speak(u);
  });

const initialSRS = (charId) => ({
  charId, interval: 0, repetitions: 0, easeFactor: 2.5,
  nextReviewDate: today(), status: 'new', correctCount: 0, incorrectCount: 0
});

const nextSRS = (item, grade) => {
  let { interval, repetitions, easeFactor = 2.5 } = item;
  if (grade === 'again') {
    return { ...item, interval: 1, repetitions: 0, easeFactor: Math.max(1.3, easeFactor - 0.2), nextReviewDate: today(), lastReviewedDate: today(), status: 'learning', incorrectCount: (item.incorrectCount || 0) + 1 };
  }
  if (grade === 'hard') {
    interval = repetitions === 0 ? 1 : Math.max(1, Math.round(interval * 1.2));
    repetitions += 1;
    easeFactor = Math.max(1.3, easeFactor - 0.15);
  } else if (grade === 'good') {
    interval = repetitions === 0 ? 1 : repetitions === 1 ? 3 : Math.round(interval * easeFactor);
    repetitions += 1;
  } else {
    interval = repetitions === 0 ? 3 : repetitions === 1 ? 6 : Math.round(interval * easeFactor * 1.3);
    repetitions += 1;
    easeFactor += 0.15;
  }
  return { ...item, interval, repetitions, easeFactor, nextReviewDate: addDays(interval), lastReviewedDate: today(), status: interval >= 7 ? 'mastered' : 'review', correctCount: (item.correctCount || 0) + 1 };
};

const preview = (item, grade) => {
  if (grade === 'again') return 'i dag';
  const n = nextSRS(item || initialSRS('x'), grade).interval;
  return n === 1 ? '1 dag' : `${n} dager`;
};

const isDue = (item) => item.nextReviewDate <= today();

const updateStreak = (profile) => {
  const t = today();
  if (profile.lastStudyDate === t) return profile;
  const y = new Date();
  y.setDate(y.getDate() - 1);
  const ys = `${y.getFullYear()}-${String(y.getMonth() + 1).padStart(2, '0')}-${String(y.getDate()).padStart(2, '0')}`;
  const streak = profile.lastStudyDate === ys ? profile.streak + 1 : 1;
  return { ...profile, streak, lastStudyDate: t };
};

const seedBeginner = () => {
  const initial = {};
  LESSONS.filter((l) => ['lesson-1', 'lesson-2', 'lesson-3'].includes(l.id)).forEach((l) => {
    l.characterIds.forEach((id) => {
      initial[id] = { ...initialSRS(id), interval: 3, repetitions: 1, status: 'review' };
    });
  });
  return initial;
};

const Icon = ({ d, size = 16 }) => html`<svg width=${size} height=${size} viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d=${d} /></svg>`;
const I = {
  book: 'M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 7H20v13H6.5A2.5 2.5 0 0 1 4 17.5z',
  layers: 'M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5',
  library: 'M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5zM8 7h8M8 11h8',
  settings: 'M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z',
  flame: 'M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.4-.5-2-1-3-1.1-2 0-4.5 1.5-6 .3 2.2 1.7 3.2 2.5 4.5C15.1 9 16 10.6 16 12a4 4 0 1 1-8 .5z',
  sun: 'M12 3v2M12 19v2M5.6 5.6l1.4 1.4M17 17l1.4 1.4M3 12h2M19 12h2M5.6 18.4 7 17M17 7l1.4-1.4M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z',
  moon: 'M21 14.3A8.5 8.5 0 1 1 9.7 3 7 7 0 0 0 21 14.3z',
  play: 'M8 5v14l11-7z',
  check: 'M20 6 9 17l-5-5',
  clock: 'M12 8v5l3 2M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
  chevron: 'M9 18l6-6-6-6',
  left: 'M19 12H5M12 19l-7-7 7-7',
  right: 'M5 12h14M12 5l7 7-7 7',
  volume: 'M11 5 6 9H2v6h4l5 4V5zM15.5 8.5a5 5 0 0 1 0 7M19 5a9 9 0 0 1 0 14',
  feather: 'M20.2 7.8 7 21H3v-4L16.2 3.8a2.8 2.8 0 0 1 4 4z',
  spark: 'M12 3v4M12 17v4M4.2 6.2l2.8 2.8M17 15l2.8 2.8M3 12h4M17 12h4M4.2 17.8 7 15M17 9l2.8-2.8',
  help: 'M12 17h.01M9.1 9a3 3 0 1 1 5.8 1c-.7 1.1-2 1.6-2.9 2.4-.5.5-.1 1.6-.1 1.6',
  x: 'M18 6 6 18M6 6l12 12',
  award: 'M8 21l4-2 4 2v-8M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z',
  search: 'M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16zM21 21l-4.3-4.3',
  info: 'M12 16v-4M12 8h.01M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z',
  music: 'M9 18V5l12-2v13M9 18a3 3 0 1 1-6 0 3 3 0 0 1 6 0zM21 16a3 3 0 1 1-6 0 3 3 0 0 1 6 0z',
  pencil: 'M17 3a2.8 2.8 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z',
  eye: 'M2 12s4-7 10-7 10 7 10 7-4 7-10 7S2 12 2 12zM12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6z',
  refresh: 'M3 12a9 9 0 0 1 15.5-6.4L21 8M21 3v5h-5M21 12a9 9 0 0 1-15.5 6.4L3 16M3 21v-5h5'
};

function Header({ profile, view, setView, toggleDark, openTones, dueCount }) {
  const nav = [
    ['dashboard', 'Hjem', I.book],
    ['review', 'Repetisjon', I.layers],
    ['overview', 'Tegn', I.library],
    ['settings', 'Innstillinger', I.settings]
  ];
  const hide = view === 'lesson';
  const item = (id, label, d, mobile) => html`
    <button type="button" onClick=${() => setView(id)} class=${mobile
      ? `py-2.5 flex flex-col items-center gap-0.5 text-[10px] font-medium ${view === id ? 'text-[#c23b2a] dark:text-rose-300' : 'text-stone-500'}`
      : `relative py-2.5 px-3.5 text-xs font-medium flex items-center gap-1.5 ${view === id ? 'text-[#c23b2a] dark:text-rose-300' : 'text-stone-500 hover:text-stone-800 dark:text-stone-400'}`}>
      <span class="relative">${html`<${Icon} d=${d} />`}${id === 'review' && dueCount > 0 && html`<span class="absolute -top-1.5 -right-2 min-w-3.5 h-3.5 px-0.5 rounded-full bg-[#c23b2a] text-white text-[9px] font-bold flex items-center justify-center">${dueCount}</span>`}</span>
      ${label}
      ${!mobile && view === id && html`<span class="absolute left-3 right-3 bottom-0 h-0.5 rounded-full bg-[#c23b2a]"></span>`}
    </button>`;

  return html`
    <header class="sticky top-0 z-40 glass border-b border-stone-200/70 dark:border-white/10">
      <div class="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <button type="button" onClick=${() => setView('dashboard')} class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-2xl bg-gradient-to-br from-[#c23b2a] to-[#7a1f16] text-white hanzi text-xl flex items-center justify-center shadow-md">汉</div>
          <div class="text-left">
            <div class="flex items-center gap-2">
              <span class="font-semibold tracking-tight text-[15px]">Hanzi</span>
              <span class="text-[10px] font-semibold tracking-widest uppercase px-1.5 py-0.5 rounded-full bg-[#c23b2a]/10 text-[#c23b2a] dark:bg-[#c23b2a]/20 dark:text-rose-300">2.0</span>
            </div>
            <p class="text-[11px] text-stone-500 dark:text-stone-400 -mt-0.5">Kinesisk på norsk</p>
          </div>
        </button>
        <div class="flex items-center gap-2">
          <div class="flex items-center gap-1 px-2.5 py-1.5 rounded-full bg-amber-50 dark:bg-amber-950/40 border border-amber-200/70 dark:border-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-semibold">
            <${Icon} d=${I.flame} size=${14} /> ${profile.streak}
          </div>
          <button type="button" onClick=${openTones} class="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-stone-200 dark:border-white/10 text-xs font-medium hover:bg-stone-100 dark:hover:bg-white/5">
            <span class="font-mono text-[#c23b2a] font-semibold">āáǎà</span> Toner
          </button>
          <button type="button" onClick=${toggleDark} class="p-2 rounded-xl border border-stone-200 dark:border-white/10 hover:bg-stone-100 dark:hover:bg-white/5">
            <${Icon} d=${profile.darkMode ? I.sun : I.moon} />
          </button>
        </div>
      </div>
      ${!hide && html`
        <nav class="hidden sm:block border-t border-stone-200/60 dark:border-white/5">
          <div class="max-w-5xl mx-auto px-4 flex gap-1">${nav.map(([id, label, d]) => item(id, label, d, false))}</div>
        </nav>`}
    </header>
    ${!hide && html`
      <nav class="sm:hidden fixed bottom-0 inset-x-0 z-40 glass border-t border-stone-200/80 dark:border-white/10 pb-[env(safe-area-inset-bottom)]">
        <div class="grid grid-cols-4">${nav.map(([id, label, d]) => item(id, label, d, true))}</div>
      </nav>`}
  `;
}

function WritingCanvas({ character }) {
  const ref = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [hasDrawn, setHasDrawn] = useState(false);
  const [ghost, setGhost] = useState(true);
  const [showSteps, setShowSteps] = useState(true);
  const [done, setDone] = useState(false);

  const reset = () => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const dpr = window.devicePixelRatio || 1;
    const size = 280;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    canvas.style.width = size + 'px';
    canvas.style.height = size + 'px';
    const dark = document.documentElement.classList.contains('dark');
    ctx.clearRect(0, 0, size, size);
    ctx.strokeStyle = dark ? '#3f342d' : '#e8ddd0';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(0, 0, size, size);
    ctx.setLineDash([4, 5]);
    ctx.strokeStyle = dark ? '#2c241f' : '#eadfce';
    ctx.lineWidth = 1;
    [[0, size / 2, size, size / 2], [size / 2, 0, size / 2, size], [0, 0, size, size], [size, 0, 0, size]].forEach(([a, b, c, d]) => {
      ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.stroke();
    });
    setHasDrawn(false); setDone(false);
  };

  useEffect(() => { reset(); }, [character.char]);

  const pos = (e) => {
    const r = ref.current.getBoundingClientRect();
    const p = e.touches ? e.touches[0] : e;
    return { x: p.clientX - r.left, y: p.clientY - r.top };
  };
  const start = (e) => {
    e.preventDefault();
    const ctx = ref.current.getContext('2d');
    const { x, y } = pos(e);
    const dark = document.documentElement.classList.contains('dark');
    ctx.beginPath(); ctx.moveTo(x, y);
    ctx.strokeStyle = dark ? '#f3ece4' : '#1a120e';
    ctx.lineWidth = 9; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
    setDrawing(true); setHasDrawn(true);
  };
  const move = (e) => {
    if (!drawing) return;
    e.preventDefault();
    const ctx = ref.current.getContext('2d');
    const { x, y } = pos(e);
    ctx.lineTo(x, y); ctx.stroke();
  };

  return html`
    <div class="flex flex-col items-center select-none">
      <div class="flex items-center justify-between w-full max-w-[320px] mb-3 text-xs text-stone-600 dark:text-stone-300">
        <span class="font-medium flex items-center gap-1"><${Icon} d=${I.pencil} size=${14} /> Tegn ${character.char} (${character.strokesCount} streker)</span>
        <div class="flex gap-1.5">
          <button type="button" onClick=${() => setGhost((v) => !v)} class="px-2 py-1 rounded-lg bg-stone-100 dark:bg-white/8">${ghost ? 'Skjul' : 'Hjelp'}</button>
          <button type="button" onClick=${() => speak(character.char)} class="p-1.5 rounded-lg bg-stone-100 dark:bg-white/8"><${Icon} d=${I.volume} size=${14} /></button>
        </div>
      </div>
      <div class="relative w-[280px] h-[280px] rounded-2xl overflow-hidden border border-stone-300/80 dark:border-white/10 bg-[#fbf6ef] dark:bg-[#1a1512] touch-none">
        ${ghost && html`<div class="absolute inset-0 flex items-center justify-center pointer-events-none hanzi text-stone-300/80 dark:text-white/10" style=${{ fontSize: '176px', lineHeight: 1 }}>${character.char}</div>`}
        <canvas ref=${ref} class="relative z-10 cursor-crosshair"
          onMouseDown=${start} onMouseMove=${move} onMouseUp=${() => setDrawing(false)} onMouseLeave=${() => setDrawing(false)}
          onTouchStart=${start} onTouchMove=${move} onTouchEnd=${() => setDrawing(false)} />
      </div>
      <div class="flex w-full max-w-[280px] mt-3 gap-2">
        <button type="button" onClick=${reset} class="flex-1 py-2 text-xs font-medium rounded-xl border border-stone-200 dark:border-white/10">Tøm</button>
        <button type="button" disabled=${!hasDrawn} onClick=${() => setDone(true)} class=${`flex-1 py-2 text-xs font-medium rounded-xl ${done ? 'bg-emerald-600 text-white' : hasDrawn ? 'bg-[#c23b2a] text-white' : 'bg-stone-100 text-stone-400'}`}>${done ? 'Fint!' : 'Ferdig'}</button>
      </div>
      <div class="w-full max-w-[320px] mt-4 p-3 rounded-2xl bg-stone-100/80 dark:bg-white/5 border border-stone-200/70 dark:border-white/8 text-xs">
        <button type="button" onClick=${() => setShowSteps((v) => !v)} class="w-full text-left font-medium flex justify-between">
          <span>Strekrekkefølge</span><span class="text-stone-500">${showSteps ? 'Skjul' : 'Vis'}</span>
        </button>
        ${showSteps && html`<ol class="mt-2 space-y-1 list-decimal list-inside text-stone-600 dark:text-stone-400">
          ${character.strokeSteps.map((s) => html`<li>${s}</li>`)}
        </ol>`}
      </div>
    </div>
  `;
}

function CharacterCard({ character, onWrite, onTones }) {
  const tone = TONES[character.tone] || TONES[5];
  const badge = { 1: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/50 dark:text-sky-300', 2: 'bg-emerald-50 text-emerald-800 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300', 3: 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300', 4: 'bg-rose-50 text-rose-800 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300', 5: 'bg-stone-100 text-stone-700 dark:bg-stone-800 dark:text-stone-300' };
  return html`
    <article class="w-full max-w-lg mx-auto rounded-3xl border border-stone-200/80 dark:border-white/10 bg-white/80 dark:bg-[#16110e]/80 shadow-sm overflow-hidden">
      <div class="p-6 text-center">
        <div class="flex justify-between items-center mb-4">
          <span class="text-[11px] font-semibold tracking-wider uppercase px-2 py-0.5 rounded-full bg-stone-100 dark:bg-white/8 text-stone-500">HSK ${character.hskLevel} · ${character.strokesCount} streker</span>
          <button type="button" onClick=${onTones} class=${`text-[11px] px-2.5 py-1 rounded-lg border font-medium ${badge[character.tone]}`}>${tone.short} · ${tone.symbol}</button>
        </div>
        <div class="hanzi text-7xl sm:text-8xl leading-none select-none">${character.char}</div>
        <div class="mt-4 flex items-center justify-center gap-2">
          <span class="text-2xl font-semibold text-[#c23b2a] dark:text-rose-300">${character.pinyin}</span>
          <button type="button" onClick=${() => speak(character.char)} class="p-2 rounded-full bg-[#c23b2a]/10 text-[#c23b2a]"><${Icon} d=${I.volume} /></button>
          <button type="button" onClick=${() => speak(character.char, 0.5)} class="text-[11px] px-2 py-1 rounded-lg border border-stone-200 dark:border-white/10">0.5×</button>
        </div>
        <h3 class="mt-3 text-lg font-semibold">${character.meaningNo}</h3>
        <p class="text-xs text-stone-500 mt-1">${tone.analogy}</p>
      </div>
      <div class="px-5 pb-4">
        <div class="flex items-center justify-between mb-2">
          <span class="text-[11px] font-semibold uppercase tracking-wider text-stone-500">Eksempel</span>
          <button type="button" onClick=${() => speak(character.exampleSentence.hanzi, 0.85)} class="flex items-center gap-1 text-xs text-[#c23b2a]"><${Icon} d=${I.volume} size=${14} /> Spill setning</button>
        </div>
        <div class="p-3.5 rounded-2xl bg-stone-50 dark:bg-white/5 border border-stone-100 dark:border-white/8 text-left">
          <p class="hanzi text-lg">${character.exampleSentence.hanzi}</p>
          <p class="text-xs font-mono text-[#c23b2a] mt-0.5">${character.exampleSentence.pinyin}</p>
          <p class="text-xs text-stone-600 dark:text-stone-300 mt-1">${character.exampleSentence.meaningNo}</p>
        </div>
      </div>
      <div class="px-5 pb-5 space-y-2 text-xs text-stone-600 dark:text-stone-300 text-left">
        ${character.explanationNo && html`<p><span class="font-semibold text-stone-800 dark:text-stone-100">Huskeregel: </span>${character.explanationNo}</p>`}
        ${character.grammarNoteNo && html`<p><span class="font-semibold text-stone-800 dark:text-stone-100">Bruk: </span>${character.grammarNoteNo}</p>`}
        ${character.radical && html`<p class="text-stone-500">Radikal: <span class="hanzi px-1.5 py-0.5 rounded bg-stone-100 dark:bg-white/8">${character.radical}</span> ${character.radicalMeaningNo || ''}</p>`}
      </div>
      ${onWrite && html`<div class="px-5 pb-5"><button type="button" onClick=${onWrite} class="w-full py-2.5 rounded-2xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-white/5 text-xs font-semibold">Øv på å skrive (${character.strokesCount} streker)</button></div>`}
    </article>
  `;
}

function Onboarding({ onDone }) {
  const [level, setLevel] = useState('beginner');
  return html`
    <div class="min-h-screen paper-grain flex items-center justify-center p-5">
      <div class="w-full max-w-md">
        <div class="text-center mb-8">
          <div class="w-16 h-16 mx-auto rounded-3xl bg-gradient-to-br from-[#c23b2a] to-[#7a1f16] text-white hanzi text-3xl flex items-center justify-center shadow-lg">汉</div>
          <h1 class="mt-5 text-3xl font-semibold tracking-tight">Hanzi 2.0</h1>
          <p class="mt-2 text-sm text-stone-600 dark:text-stone-400">Lær kinesiske tegn på norsk — korte økter, uttale og en repetisjonsplan som husker for deg.</p>
        </div>
        ${[['beginner', 'Helt nybegynner', 'Hei, tall, toner og de første tegnene. Fra null.'], ['hsk1', 'HSK 1 — kan litt fra før', 'Hopper over de enkleste tallene og går til hverdagsord.']].map(([id, title, text]) => html`
          <button type="button" onClick=${() => setLevel(id)} class=${`w-full text-left p-4 mb-3 rounded-2xl border-2 ${level === id ? 'border-[#c23b2a] bg-[#c23b2a]/8' : 'border-stone-200 dark:border-white/10 bg-white/70 dark:bg-white/4'}`}>
            <p class="font-semibold text-sm">${title}</p>
            <p class="text-xs text-stone-500 mt-0.5">${text}</p>
          </button>
        `)}
        <button type="button" onClick=${() => onDone(level)} class="mt-4 w-full py-3 rounded-2xl bg-[#c23b2a] text-white font-semibold text-sm">Start å lære</button>
      </div>
    </div>
  `;
}

function Dashboard({ profile, srs, startLesson, startReview, openTones }) {
  const current = LESSONS.find((l) => !profile.completedLessonIds.includes(l.id)) || LESSONS[LESSONS.length - 1];
  const due = Object.values(srs).filter(isDue).length;
  const learned = Object.keys(srs).length;
  return html`
    <div class="max-w-3xl mx-auto py-6 px-4 space-y-6 pb-24 sm:pb-8 ink-in">
      <div>
        <p class="text-[11px] uppercase tracking-[0.18em] text-stone-500 font-semibold">${profile.lastStudyDate === today() ? 'Bra innsats i dag' : 'Ny økt'}</p>
        <h1 class="text-2xl sm:text-3xl font-semibold tracking-tight mt-1">Klar for kinesisk?</h1>
        <p class="text-sm text-stone-500 mt-1">15–20 rolige minutter. Nye tegn, eller bare repetisjon.</p>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="relative overflow-hidden p-5 rounded-3xl text-white bg-gradient-to-br from-[#c23b2a] via-[#b13224] to-[#6e1b14] shadow-lg">
          <div class="absolute -right-6 -top-8 hanzi text-[140px] leading-none opacity-10">${CHARACTERS[current.characterIds[0]]?.char || '汉'}</div>
          <div class="relative">
            <div class="flex items-center justify-between mb-4">
              <span class="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-white/15">Dagens leksjon</span>
              <span class="text-xs text-white/80">ca. 15 min</span>
            </div>
            <h2 class="text-lg font-semibold">${current.titleNo}</h2>
            <p class="text-xs text-white/80 mt-2">${current.summaryNo}</p>
            <div class="flex gap-1.5 mt-4 mb-5">
              ${current.characterIds.slice(0, 6).map((id) => html`<span class="w-8 h-8 rounded-lg bg-white/15 hanzi text-base flex items-center justify-center">${CHARACTERS[id]?.char}</span>`)}
            </div>
            <button type="button" onClick=${() => startLesson(current)} class="w-full py-3 rounded-2xl bg-white text-[#9a2b1e] font-semibold text-sm">Start økt · ${current.characterIds.length} tegn</button>
          </div>
        </div>
        <div class="p-5 rounded-3xl bg-white/80 dark:bg-[#16110e]/80 border border-stone-200/80 dark:border-white/10 flex flex-col justify-between">
          <div>
            <div class="flex justify-between mb-4">
              <span class="text-[10px] uppercase tracking-widest font-bold px-2 py-0.5 rounded-full bg-stone-100 dark:bg-white/8">Spaced repetition</span>
              <span class="text-xs font-semibold text-[#c23b2a]">${due} forfalt</span>
            </div>
            <h2 class="text-lg font-semibold">Repeter det du kan</h2>
            <p class="text-xs text-stone-500 mt-2">Tegnene kommer tilbake akkurat når du er i ferd med å glemme dem.</p>
            <div class="mt-4 grid grid-cols-2 gap-2 text-xs">
              <div class="p-3 rounded-2xl bg-stone-50 dark:bg-white/5"><p class="text-stone-500">I kø i dag</p><p class="text-lg font-semibold">${due}</p></div>
              <div class="p-3 rounded-2xl bg-stone-50 dark:bg-white/5"><p class="text-stone-500">I minnekassa</p><p class="text-lg font-semibold">${learned}</p></div>
            </div>
          </div>
          <button type="button" onClick=${startReview} class=${`mt-5 w-full py-3 rounded-2xl text-sm font-semibold ${due > 0 ? 'bg-[#1a120e] text-white dark:bg-[#f3ece4] dark:text-[#1a120e]' : 'bg-stone-100 dark:bg-white/8'}`}>${due > 0 ? `Repeter ${due} kort` : learned ? 'Ekstra øving' : 'Ingen kort ennå'}</button>
        </div>
      </div>
      <section class="rounded-3xl bg-white/80 dark:bg-[#16110e]/80 border border-stone-200/80 dark:border-white/10 p-5">
        <div class="flex justify-between mb-4">
          <div><h3 class="font-semibold">Læringssti</h3><p class="text-xs text-stone-500">${profile.completedLessonIds.length} av ${LESSONS.length} leksjoner</p></div>
          <div class="w-28 h-1.5 rounded-full bg-stone-200 dark:bg-white/10 overflow-hidden"><div class="h-full bg-[#c23b2a]" style=${{ width: (profile.completedLessonIds.length / LESSONS.length) * 100 + '%' }}></div></div>
        </div>
        <div class="space-y-2">
          ${LESSONS.map((lesson) => {
            const done = profile.completedLessonIds.includes(lesson.id);
            const active = lesson.id === current.id && !done;
            return html`
              <button type="button" onClick=${() => startLesson(lesson)} class=${`w-full p-3.5 rounded-2xl border text-left flex items-center justify-between ${active ? 'border-[#c23b2a]/40 bg-[#c23b2a]/8' : 'border-stone-200/80 dark:border-white/8'}`}>
                <div class="flex items-center gap-3">
                  <div class=${`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold ${done ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300' : active ? 'bg-[#c23b2a] text-white' : 'bg-stone-100 text-stone-500 dark:bg-white/8'}`}>${done ? '✓' : lesson.number}</div>
                  <div><p class="text-sm font-medium">${lesson.titleNo}</p><p class="text-[11px] text-stone-500">${lesson.themeNo} · ${lesson.characterIds.length} tegn</p></div>
                </div>
                <span class="text-stone-400">›</span>
              </button>`;
          })}
        </div>
      </section>
    </div>
  `;
}

function LessonView({ lesson, profile, setProfile, srs, setSrs, back, finish, openTones }) {
  const chars = lesson.characterIds.map((id) => CHARACTERS[id]).filter(Boolean);
  const [i, setI] = useState(0);
  const [mode, setMode] = useState('learn');
  const [selected, setSelected] = useState(null);
  const [options, setOptions] = useState([]);
  const [done, setDone] = useState(false);
  const current = chars[i];

  useEffect(() => {
    if (profile.autoPlayAudio && current && mode === 'learn') speak(current.char);
  }, [current?.id, mode]);

  const openQuiz = () => {
    const correct = current.meaningNo;
    const pool = Object.values(CHARACTERS).filter((c) => c.id !== current.id).map((c) => c.meaningNo);
    const others = pool.sort(() => 0.5 - Math.random()).slice(0, 3);
    setOptions([correct, ...others].sort(() => 0.5 - Math.random()));
    setSelected(null);
    setMode('quiz');
  };

  const complete = () => {
    setDone(true);
    confetti({ particleCount: 80, spread: 70, origin: { y: 0.62 } });
    const next = { ...srs };
    chars.forEach((c) => { if (!next[c.id]) next[c.id] = initialSRS(c.id); });
    setSrs(next); saveJSON(KEYS.SRS, next);
    const p = updateStreak({ ...profile, completedLessonIds: [...new Set([...profile.completedLessonIds, lesson.id])], totalCharactersLearned: Object.keys(next).length });
    setProfile(p); saveJSON(KEYS.PROFILE, p);
  };

  if (done) {
    return html`<div class="max-w-md mx-auto py-14 px-4 text-center ink-in">
      <div class="w-16 h-16 mx-auto rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 flex items-center justify-center mb-4 text-2xl">✓</div>
      <h2 class="text-2xl font-semibold">Leksjon fullført</h2>
      <p class="text-sm text-stone-500 mt-2">${chars.length} nye tegn er lagt i repetisjonskøen.</p>
      <div class="mt-6 p-4 rounded-2xl bg-white/80 dark:bg-white/5 border border-stone-200 dark:border-white/10 text-left">
        <div class="flex flex-wrap gap-2">${chars.map((c) => html`<span class="px-2.5 py-1 rounded-lg bg-stone-50 dark:bg-white/8 border text-xs"><span class="hanzi font-semibold">${c.char}</span> <span class="font-mono text-[#c23b2a]">${c.pinyin}</span></span>`)}</div>
      </div>
      <button type="button" onClick=${finish} class="mt-6 w-full py-3 rounded-2xl bg-[#c23b2a] text-white font-semibold text-sm">Tilbake til oversikten</button>
    </div>`;
  }

  return html`<div class="max-w-2xl mx-auto py-4 px-4 pb-10 ink-in">
    <div class="flex items-center justify-between mb-4">
      <button type="button" onClick=${back} class="text-xs font-medium text-stone-500">← Avslutt</button>
      <div class="flex items-center gap-2">
        <span class="text-xs text-stone-500">${i + 1} / ${chars.length}</span>
        <div class="w-28 h-1.5 bg-stone-200 dark:bg-white/10 rounded-full overflow-hidden"><div class="h-full bg-[#c23b2a]" style=${{ width: ((i + 1) / chars.length) * 100 + '%' }}></div></div>
      </div>
    </div>
    <div class="flex justify-center gap-1.5 mb-5">
      ${[['learn', 'Lær', () => setMode('learn')], ['write', 'Skriv', () => setMode('write')], ['quiz', 'Sjekk', openQuiz]].map(([id, label, fn]) => html`
        <button type="button" onClick=${fn} class=${`py-1.5 px-3 rounded-xl text-xs font-medium ${mode === id ? 'bg-[#1a120e] text-white dark:bg-[#f3ece4] dark:text-[#1a120e]' : 'bg-white/70 dark:bg-white/8 border border-stone-200 dark:border-white/10'}`}>${label}</button>`)}
    </div>
    ${mode === 'learn' && html`<${CharacterCard} character=${current} onWrite=${() => setMode('write')} onTones=${openTones} />`}
    ${mode === 'write' && html`<div class="rounded-3xl p-6 border border-stone-200 dark:border-white/10 bg-white/80 dark:bg-[#16110e]/80 text-center">
      <p class="mb-3"><span class="hanzi text-2xl">${current.char}</span><span class="ml-2 text-[#c23b2a]">${current.pinyin}</span></p>
      <${WritingCanvas} character=${current} />
    </div>`}
    ${mode === 'quiz' && html`<div class="rounded-3xl p-6 border border-stone-200 dark:border-white/10 bg-white/80 dark:bg-[#16110e]/80 text-center">
      <p class="text-[11px] uppercase tracking-wider text-stone-500 font-semibold">Hva betyr dette?</p>
      <p class="hanzi text-6xl my-4">${current.char}</p>
      <div class="space-y-2 max-w-sm mx-auto">${options.map((opt) => {
        const right = opt === current.meaningNo;
        let cls = 'bg-stone-50 dark:bg-white/5 border-stone-200 dark:border-white/10';
        if (selected) cls = right ? 'bg-emerald-50 border-emerald-500' : selected === opt ? 'bg-rose-50 border-rose-500' : cls;
        return html`<button type="button" onClick=${() => !selected && setSelected(opt)} class=${`w-full py-3 px-4 rounded-2xl border text-sm text-left ${cls}`}>${opt}</button>`;
      })}</div>
    </div>`}
    <div class="flex justify-between mt-6">
      <button type="button" disabled=${i === 0} onClick=${() => { setI(i - 1); setMode('learn'); setSelected(null); }} class="py-2.5 px-4 rounded-2xl border text-xs font-semibold ${i === 0 ? 'opacity-40' : ''}">Forrige</button>
      <button type="button" onClick=${() => i === chars.length - 1 ? complete() : (setI(i + 1), setMode('learn'), setSelected(null))} class="py-2.5 px-5 rounded-2xl bg-[#c23b2a] text-white text-xs font-semibold">${i === chars.length - 1 ? 'Fullfør leksjon' : 'Neste tegn'}</button>
    </div>
  </div>`;
}

function ReviewView({ srs, setSrs, profile, setProfile, back }) {
  const dueIds = Object.values(srs).filter(isDue).map((x) => x.charId);
  const allIds = Object.keys(srs);
  const [practiceAll, setPracticeAll] = useState(false);
  const [i, setI] = useState(0);
  const [show, setShow] = useState(false);
  const [write, setWrite] = useState(false);
  const [done, setDone] = useState(false);
  const [count, setCount] = useState(0);
  const queue = practiceAll || dueIds.length === 0 ? allIds : dueIds;
  const id = queue[i];
  const ch = id ? CHARACTERS[id] : null;

  useEffect(() => {
    const onKey = (e) => {
      if (e.code === 'Space' && !show && ch) { e.preventDefault(); setShow(true); }
      if (!show) return;
      if (e.key === '1') grade('again');
      if (e.key === '2') grade('hard');
      if (e.key === '3') grade('good');
      if (e.key === '4') grade('easy');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  const grade = (g) => {
    if (!id || !srs[id]) return;
    const next = { ...srs, [id]: nextSRS(srs[id], g) };
    setSrs(next); saveJSON(KEYS.SRS, next);
    setCount((n) => n + 1);
    if (i < queue.length - 1) { setI(i + 1); setShow(false); setWrite(false); }
    else {
      setDone(true);
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      const p = updateStreak(profile);
      setProfile(p); saveJSON(KEYS.PROFILE, p);
    }
  };

  if (!allIds.length) return html`<div class="max-w-md mx-auto py-14 px-4 text-center"><h2 class="text-xl font-semibold">Ingen tegn å repetere ennå</h2><p class="text-sm text-stone-500 mt-2">Fullfør en leksjon først.</p><button type="button" onClick=${back} class="mt-6 py-2.5 px-5 rounded-2xl bg-[#c23b2a] text-white text-xs font-semibold">Gå til leksjonene</button></div>`;
  if (!dueIds.length && !practiceAll && !done) return html`<div class="max-w-md mx-auto py-14 px-4 text-center">
    <h2 class="text-xl font-semibold">Alt er repetert i dag</h2>
    <p class="text-sm text-stone-500 mt-2">Nye kort dukker opp i morgen.</p>
    <div class="flex gap-2 justify-center mt-6">
      <button type="button" onClick=${() => setPracticeAll(true)} class="py-2.5 px-4 rounded-2xl border text-xs font-semibold">Øv på alle (${allIds.length})</button>
      <button type="button" onClick=${back} class="py-2.5 px-4 rounded-2xl bg-[#c23b2a] text-white text-xs font-semibold">Tilbake</button>
    </div>
  </div>`;
  if (done) return html`<div class="max-w-md mx-auto py-14 px-4 text-center"><h2 class="text-xl font-semibold">Repetisjon ferdig</h2><p class="text-sm text-stone-500 mt-2">Du gikk gjennom ${count} tegn.</p><button type="button" onClick=${back} class="mt-6 py-2.5 px-5 rounded-2xl bg-[#c23b2a] text-white text-xs font-semibold">Ferdig for nå</button></div>`;
  if (!ch) return null;
  const tone = TONES[ch.tone] || TONES[5];

  return html`<div class="max-w-xl mx-auto py-4 px-4 pb-24 ink-in">
    <div class="flex justify-between mb-4">
      <button type="button" onClick=${back} class="text-xs text-stone-500">Avslutt</button>
      <span class="text-xs text-stone-500">${i + 1} / ${queue.length}</span>
    </div>
    <div class="rounded-3xl border border-stone-200 dark:border-white/10 bg-white/80 dark:bg-[#16110e]/80 overflow-hidden">
      <div class="p-8 text-center">
        <p class="hanzi text-7xl sm:text-8xl select-none">${ch.char}</p>
        <div class="flex justify-center gap-2 mt-4">
          <button type="button" onClick=${() => speak(ch.char)} class="p-2 rounded-full bg-stone-100 dark:bg-white/8"><${Icon} d=${I.volume} /></button>
          <button type="button" onClick=${() => setWrite((v) => !v)} class="p-2 rounded-full bg-stone-100 dark:bg-white/8"><${Icon} d=${I.feather} /></button>
        </div>
        ${write && html`<div class="mt-4"><${WritingCanvas} character=${ch} /></div>`}
      </div>
      ${!show ? html`<div class="p-6 text-center bg-stone-50/70 dark:bg-white/4">
        <p class="text-xs text-stone-500 mb-4">Husker du betydning og uttale?</p>
        <button type="button" onClick=${() => setShow(true)} class="w-full max-w-xs py-3 rounded-2xl bg-[#1a120e] text-white dark:bg-[#f3ece4] dark:text-[#1a120e] text-sm font-semibold">Vis svar <span class="text-[10px] opacity-60">mellomrom</span></button>
      </div>` : html`<div class="p-6 space-y-4 border-t border-stone-100 dark:border-white/8">
        <div><p class="text-2xl font-semibold text-[#c23b2a] font-mono">${ch.pinyin}</p><p class="text-xs text-stone-500">${tone.name}</p></div>
        <h3 class="font-semibold">${ch.meaningNo}</h3>
        ${ch.explanationNo && html`<p class="text-xs text-stone-500">${ch.explanationNo}</p>`}
        <div class="p-3 rounded-2xl bg-stone-50 dark:bg-white/5 text-xs">
          <p class="hanzi">${ch.exampleSentence.hanzi}</p>
          <p class="font-mono text-[#c23b2a]">${ch.exampleSentence.pinyin}</p>
          <p>${ch.exampleSentence.meaningNo}</p>
        </div>
        <p class="text-[11px] uppercase tracking-wider text-stone-500 text-center font-semibold">Hvor godt satt det?</p>
        <div class="grid grid-cols-4 gap-1.5">
          ${[['again','Igjen','border-rose-300 bg-rose-50 text-rose-800'],['hard','Hardt','border-amber-300 bg-amber-50 text-amber-800'],['good','Bra','border-sky-300 bg-sky-50 text-sky-800'],['easy','Lett','border-emerald-300 bg-emerald-50 text-emerald-800']].map(([g,label,cls], n) => html`
            <button type="button" onClick=${() => grade(g)} class=${`py-2.5 rounded-xl border text-center ${cls}`}>
              <div class="text-xs font-bold">${label}</div>
              <div class="text-[10px] opacity-80">${preview(srs[id], g)}</div>
              <div class="text-[9px] opacity-50">${n + 1}</div>
            </button>`)}
        </div>
      </div>`}
    </div>
  </div>`;
}

function Overview({ profile, srs }) {
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');
  const [sel, setSel] = useState(null);
  const [write, setWrite] = useState(false);
  const all = Object.values(CHARACTERS);
  const learned = new Set(Object.keys(srs));
  const mastered = Object.values(srs).filter((x) => x.status === 'mastered').length;
  const list = all.filter((c) => {
    const s = q.trim().toLowerCase();
    const match = !s || c.char.includes(q) || c.pinyin.toLowerCase().includes(s) || c.meaningNo.toLowerCase().includes(s);
    if (!match) return false;
    if (filter === 'learned') return learned.has(c.id);
    if (filter === 'new') return !learned.has(c.id);
    if (filter === 'mastered') return srs[c.id]?.status === 'mastered';
    return true;
  });
  return html`<div class="max-w-3xl mx-auto py-6 px-4 space-y-6 pb-24 sm:pb-8 ink-in">
    <div><h1 class="text-2xl font-semibold">Dine tegn</h1><p class="text-sm text-stone-500 mt-1">Bibliotek, progresjon og skriveøvelse.</p></div>
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      ${[['Lært', learned.size, `av ${all.length}`], ['Streak', profile.streak, 'dager'], ['Mestret', mastered, '7+ dager'], ['Kurs', Math.min(100, Math.round((learned.size / all.length) * 100)) + '%', 'fullført']].map(([l,v,h]) => html`
        <div class="p-4 rounded-2xl bg-white/80 dark:bg-[#16110e]/80 border border-stone-200/80 dark:border-white/10"><p class="text-[11px] uppercase tracking-wider text-stone-500">${l}</p><p class="text-2xl font-semibold">${v}</p><p class="text-[11px] text-stone-500">${h}</p></div>`)}
    </div>
    <section class="rounded-3xl border border-stone-200/80 dark:border-white/10 bg-white/80 dark:bg-[#16110e]/80 p-5">
      <div class="flex flex-col sm:flex-row justify-between gap-3 mb-4">
        <div class="flex gap-1">${[['all','Alle'],['learned','Lært'],['new','Ulært'],['mastered','Mestret']].map(([id,label]) => html`
          <button type="button" onClick=${() => setFilter(id)} class=${`px-2.5 py-1 rounded-lg text-[11px] font-medium ${filter===id ? 'bg-[#1a120e] text-white dark:bg-[#f3ece4] dark:text-[#1a120e]' : 'bg-stone-100 dark:bg-white/8'}`}>${label}</button>`)}</div>
        <input value=${q} onInput=${(e) => setQ(e.target.value)} placeholder="Søk tegn, pinyin, norsk…" class="w-full sm:w-56 px-3 py-1.5 text-xs rounded-xl border border-stone-200 dark:border-white/10 bg-stone-50 dark:bg-white/5 outline-none" />
      </div>
      <div class="grid grid-cols-3 sm:grid-cols-6 md:grid-cols-8 gap-2">
        ${list.map((c) => html`<button type="button" onClick=${() => { setSel(c); setWrite(false); }} class=${`p-2.5 rounded-2xl border text-center ${learned.has(c.id) ? 'border-stone-200 dark:border-white/10 bg-stone-50/70 dark:bg-white/5' : 'border-dashed opacity-55'}`}>
          <span class="hanzi text-2xl block">${c.char}</span>
          <span class="text-[11px] font-mono text-[#c23b2a]">${c.pinyin}</span>
          <span class="block text-[10px] text-stone-500 truncate">${c.meaningNo.split('/')[0]}</span>
        </button>`)}
      </div>
    </section>
    ${sel && html`<div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/55 backdrop-blur-sm">
      <div class="w-full max-w-md bg-[#f6efe6] dark:bg-[#16110e] rounded-3xl border border-stone-200 dark:border-white/10 p-6 text-center relative max-h-[92vh] overflow-y-auto">
        <button type="button" onClick=${() => setSel(null)} class="absolute top-3 right-3 p-1.5">✕</button>
        <p class="hanzi text-7xl">${sel.char}</p>
        <p class="text-xl font-mono font-semibold text-[#c23b2a] mt-2">${sel.pinyin}</p>
        <h3 class="font-semibold mt-2">${sel.meaningNo}</h3>
        ${sel.explanationNo && html`<p class="text-xs text-stone-500 mt-3 p-3 rounded-2xl bg-white/70 dark:bg-white/5 text-left">${sel.explanationNo}</p>`}
        ${!write ? html`<button type="button" onClick=${() => setWrite(true)} class="mt-4 w-full py-2.5 rounded-2xl border text-xs font-semibold">Tegn tegnet</button>` : html`<div class="mt-4"><${WritingCanvas} character=${sel} /></div>`}
      </div>
    </div>`}
  </div>`;
}

function Settings({ profile, setProfile, setSrs, openLevel }) {
  const update = (partial) => {
    const next = { ...profile, ...partial };
    setProfile(next); saveJSON(KEYS.PROFILE, next);
  };
  const reset = () => {
    if (!confirm('Nullstille all progresjon?')) return;
    const fresh = { ...defaultProfile('beginner'), hasOnboarded: true, darkMode: profile.darkMode };
    setProfile(fresh); setSrs({}); saveJSON(KEYS.PROFILE, fresh); saveJSON(KEYS.SRS, {});
  };
  return html`<div class="max-w-lg mx-auto py-6 px-4 space-y-4 pb-24 sm:pb-8 ink-in">
    <div><h1 class="text-2xl font-semibold">Innstillinger</h1><p class="text-sm text-stone-500 mt-1">Utseende, lyd og progresjon.</p></div>
    <section class="rounded-3xl border border-stone-200/80 dark:border-white/10 bg-white/80 dark:bg-[#16110e]/80 divide-y divide-stone-200/70 dark:divide-white/8">
      <div class="flex justify-between items-center p-4"><div><p class="text-sm font-medium">Mørk modus</p><p class="text-[11px] text-stone-500">Blekk på nattpapir</p></div>
        <button type="button" onClick=${() => update({ darkMode: !profile.darkMode })} class=${`w-11 h-6 rounded-full relative ${profile.darkMode ? 'bg-[#c23b2a]' : 'bg-stone-300'}`}><span class="absolute top-0.5 w-5 h-5 rounded-full bg-white" style=${{ left: profile.darkMode ? 22 : 2 }}></span></button></div>
      <div class="flex justify-between items-center p-4"><div><p class="text-sm font-medium">Spill lyd automatisk</p><p class="text-[11px] text-stone-500">Uttale når du åpner et tegn</p></div>
        <button type="button" onClick=${() => update({ autoPlayAudio: !profile.autoPlayAudio })} class=${`w-11 h-6 rounded-full relative ${profile.autoPlayAudio ? 'bg-[#c23b2a]' : 'bg-stone-300'}`}><span class="absolute top-0.5 w-5 h-5 rounded-full bg-white" style=${{ left: profile.autoPlayAudio ? 22 : 2 }}></span></button></div>
      <div class="flex justify-between items-center p-4"><div><p class="text-sm font-medium">Startnivå</p><p class="text-[11px] text-stone-500">${profile.level === 'beginner' ? 'Nybegynner' : 'HSK 1'}</p></div>
        <button type="button" onClick=${openLevel} class="text-xs font-semibold px-3 py-1.5 rounded-xl border">Endre</button></div>
    </section>
    <p class="text-xs text-stone-500 leading-relaxed px-1">Hanzi 2.0 kjører helt i nettleseren. Progresjon lagres på denne enheten.</p>
    <button type="button" onClick=${reset} class="w-full py-3 rounded-2xl border border-rose-200 text-rose-700 text-xs font-semibold">Nullstill progresjon</button>
  </div>`;
}

function Modal({ title, onClose, children }) {
  return html`<div class="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/50 backdrop-blur-sm">
    <div class="w-full max-w-lg bg-[#f6efe6] dark:bg-[#16110e] rounded-t-3xl sm:rounded-3xl border border-stone-200 dark:border-white/10 max-h-[92vh] flex flex-col">
      <div class="flex items-center justify-between p-5 border-b border-stone-200/80 dark:border-white/8">
        <h2 class="font-semibold">${title}</h2>
        <button type="button" onClick=${onClose} class="p-1.5">✕</button>
      </div>
      <div class="p-5 overflow-y-auto">${children}</div>
    </div>
  </div>`;
}

function App() {
  const [profile, setProfile] = useState(() => ({ ...defaultProfile(), ...loadJSON(KEYS.PROFILE, {}) }));
  const [srs, setSrs] = useState(() => loadJSON(KEYS.SRS, {}));
  const [view, setView] = useState('dashboard');
  const [lesson, setLesson] = useState(null);
  const [tones, setTones] = useState(false);
  const [levels, setLevels] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', !!profile.darkMode);
  }, [profile.darkMode]);

  const dueCount = Object.values(srs).filter(isDue).length;

  if (!profile.hasOnboarded) {
    return html`<${Onboarding} onDone=${(level) => {
      const p = { ...defaultProfile(level), hasOnboarded: true };
      setProfile(p); saveJSON(KEYS.PROFILE, p);
      if (level === 'hsk1') { const s = seedBeginner(); setSrs(s); saveJSON(KEYS.SRS, s); }
    }} />`;
  }

  return html`
    <div class="min-h-screen flex flex-col paper-grain">
      <${Header} profile=${profile} view=${view} setView=${(v) => { setView(v); if (v !== 'lesson') setLesson(null); }} toggleDark=${() => { const p = { ...profile, darkMode: !profile.darkMode }; setProfile(p); saveJSON(KEYS.PROFILE, p); }} openTones=${() => setTones(true)} dueCount=${dueCount} />
      <main class="flex-1">
        ${view === 'dashboard' && html`<${Dashboard} profile=${profile} srs=${srs} startLesson=${(l) => { setLesson(l); setView('lesson'); }} startReview=${() => setView('review')} openTones=${() => setTones(true)} />`}
        ${view === 'lesson' && lesson && html`<${LessonView} lesson=${lesson} profile=${profile} setProfile=${setProfile} srs=${srs} setSrs=${setSrs} back=${() => setView('dashboard')} finish=${() => { setView('dashboard'); setLesson(null); }} openTones=${() => setTones(true)} />`}
        ${view === 'review' && html`<${ReviewView} srs=${srs} setSrs=${setSrs} profile=${profile} setProfile=${setProfile} back=${() => setView('dashboard')} />`}
        ${view === 'overview' && html`<${Overview} profile=${profile} srs=${srs} />`}
        ${view === 'settings' && html`<${Settings} profile=${profile} setProfile=${setProfile} setSrs=${setSrs} openLevel=${() => setLevels(true)} />`}
      </main>
      ${tones && html`<${Modal} title="De fire tonene" onClose=${() => setTones(false)}>
        <p class="text-xs text-stone-600 dark:text-stone-300 p-3 rounded-2xl bg-[#c23b2a]/8 border border-[#c23b2a]/15 mb-3">Samme stavelse — <strong>ma</strong> — kan bety mamma, hamp, hest eller kjefte, avhengig av tonen.</p>
        ${[1,2,3,4,5].map((n) => html`<div class="p-3.5 mb-2 rounded-2xl border border-stone-200 dark:border-white/8 bg-white/70 dark:bg-white/4">
          <div class="flex justify-between"><span class="font-medium"><span class="font-mono text-[#c23b2a] mr-1">${TONES[n].symbol}</span>${TONES[n].name}</span><span class="text-[11px] text-stone-500">${TONES[n].contour}</span></div>
          <p class="text-xs text-stone-500 italic mt-1">${TONES[n].analogy}</p>
          <div class="flex justify-between items-center mt-2 pt-2 border-t border-stone-200/70 dark:border-white/8 text-xs">
            <span><span class="hanzi text-lg">${TONE_EX[n].char}</span> <span class="text-[#c23b2a]">${TONE_EX[n].pinyin}</span> (${TONE_EX[n].meaning})</span>
            <button type="button" onClick=${() => speak(TONE_EX[n].char, 0.7)} class="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-white/8">Hør</button>
          </div>
        </div>`)}
        <button type="button" onClick=${() => setTones(false)} class="w-full mt-2 py-2.5 rounded-2xl bg-[#c23b2a] text-white text-sm font-semibold">Skjønner — la meg øve</button>
      </${Modal}>`}
      ${levels && html`<${Modal} title="Velg startnivå" onClose=${() => setLevels(false)}>
        ${[['beginner','Helt nybegynner','Hilsener, tall 1–10, toner og de første tegnene.'],['hsk1','HSK 1','Hopper over de enkleste tallene. Mat, verb og hverdag.']].map(([id,title,text]) => html`
          <button type="button" onClick=${() => {
            const p = { ...defaultProfile(id), hasOnboarded: true, darkMode: profile.darkMode, autoPlayAudio: profile.autoPlayAudio };
            setProfile(p); saveJSON(KEYS.PROFILE, p);
            if (id === 'hsk1') { const s = seedBeginner(); setSrs(s); saveJSON(KEYS.SRS, s); }
            setLevels(false);
          }} class=${`w-full text-left p-4 mb-3 rounded-2xl border-2 ${profile.level===id ? 'border-[#c23b2a] bg-[#c23b2a]/8' : 'border-stone-200 dark:border-white/10'}`}>
            <p class="text-sm font-semibold">${title}</p><p class="text-xs text-stone-500 mt-1">${text}</p>
          </button>`)}
      </${Modal}>`}
    </div>
  `;
}

render(html`<${App} />`, document.getElementById('root'));
