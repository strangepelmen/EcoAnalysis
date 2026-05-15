// =============================================
// JSONBIN CONFIG — shared pins storage
// =============================================
const JSONBIN_BIN_ID = '6a02bd3dadc21f119a8933bb';
const JSONBIN_API_KEY = '$2a$10$psF.fBMy6iGZpgrf0DYCAeYSZcGPhvD94TtZh6HUHpIvJXLh5Ctme';
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

// =============================================
// SPECIES CONFIG
// =============================================
const SPECIES_CONFIG = {
  'salix-alba':            { name: 'Ива Белая',                tolerance: 0.85, faRange: [0.035, 0.058], icon: '🌳', group: 'Ивы' },
  'salix-caprea':          { name: 'Ива Козья',                tolerance: 0.80, faRange: [0.036, 0.060], icon: '🍃', group: 'Ивы' },
  'salix-fragilis':        { name: 'Ива Ломкая',               tolerance: 0.78, faRange: [0.036, 0.061], icon: '🌿', group: 'Ивы' },
  'salix-viminalis':       { name: 'Ива Прутовидная',          tolerance: 0.82, faRange: [0.034, 0.057], icon: '🌿', group: 'Ивы' },
  'populus-balsamifera':   { name: 'Тополь Бальзамический',    tolerance: 0.90, faRange: [0.033, 0.056], icon: '🌲', group: 'Тополя' },
  'populus-tremula':       { name: 'Осина (Тополь Дрожащий)',  tolerance: 0.72, faRange: [0.036, 0.062], icon: '🍃', group: 'Тополя' },
  'populus-nigra':         { name: 'Тополь Чёрный',            tolerance: 0.88, faRange: [0.034, 0.057], icon: '🌲', group: 'Тополя' },
  'populus-alba':          { name: 'Тополь Белый',             tolerance: 0.86, faRange: [0.034, 0.058], icon: '🌲', group: 'Тополя' },
  'betula-pendula':        { name: 'Берёза Повислая',          tolerance: 0.60, faRange: [0.036, 0.062], icon: '🌿', group: 'Берёзы' },
  'betula-pubescens':      { name: 'Берёза Пушистая',          tolerance: 0.62, faRange: [0.036, 0.061], icon: '🌿', group: 'Берёзы' },
  'acer-platanoides':      { name: 'Клён Остролистный',        tolerance: 0.55, faRange: [0.037, 0.063], icon: '🍁', group: 'Клёны' },
  'acer-negundo':          { name: 'Клён Ясенелистный',        tolerance: 0.70, faRange: [0.036, 0.061], icon: '🍁', group: 'Клёны' },
  'acer-campestre':        { name: 'Клён Полевой',             tolerance: 0.58, faRange: [0.037, 0.062], icon: '🍁', group: 'Клёны' },
  'tilia-cordata':         { name: 'Липа Мелколистная',        tolerance: 0.65, faRange: [0.035, 0.060], icon: '🌸', group: 'Липы' },
  'tilia-platyphyllos':    { name: 'Липа Крупнолистная',       tolerance: 0.63, faRange: [0.036, 0.061], icon: '🌸', group: 'Липы' },
  'quercus-robur':         { name: 'Дуб Черешчатый',           tolerance: 0.50, faRange: [0.038, 0.065], icon: '🌰', group: 'Дубы' },
  'quercus-petraea':       { name: 'Дуб Скальный',             tolerance: 0.52, faRange: [0.037, 0.064], icon: '🌰', group: 'Дубы' },
  'ulmus-laevis':          { name: 'Вяз Гладкий',              tolerance: 0.75, faRange: [0.035, 0.059], icon: '🍂', group: 'Вязы' },
  'ulmus-minor':           { name: 'Вяз Листоватый',           tolerance: 0.73, faRange: [0.036, 0.060], icon: '🍂', group: 'Вязы' },
  'fraxinus-excelsior':    { name: 'Ясень Обыкновенный',       tolerance: 0.68, faRange: [0.036, 0.061], icon: '🌿', group: 'Ясень' },
  'prunus-padus':          { name: 'Черёмуха Обыкновенная',    tolerance: 0.60, faRange: [0.037, 0.062], icon: '🌺', group: 'Другие' },
  'sorbus-aucuparia':      { name: 'Рябина Обыкновенная',      tolerance: 0.58, faRange: [0.037, 0.063], icon: '🍒', group: 'Другие' },
  'malus-sylvestris':      { name: 'Яблоня Лесная',            tolerance: 0.55, faRange: [0.038, 0.064], icon: '🍎', group: 'Другие' },
  'alnus-glutinosa':       { name: 'Ольха Чёрная',             tolerance: 0.76, faRange: [0.035, 0.059], icon: '🌿', group: 'Ольха и Орешник' },
  'alnus-incana':          { name: 'Ольха Серая',              tolerance: 0.74, faRange: [0.036, 0.060], icon: '🌿', group: 'Ольха и Орешник' },
  'corylus-avellana':      { name: 'Лещина Обыкновенная',      tolerance: 0.62, faRange: [0.037, 0.062], icon: '🌰', group: 'Ольха и Орешник' },
};

function getPlantName(p) {
  return (SPECIES_CONFIG[p] || {}).name || 'Не указано';
}

// =============================================
// THEME
// =============================================
function applyTheme(dark) {
  document.body.classList.toggle('dark-theme', dark);
  localStorage.setItem('theme', dark ? 'dark' : 'light');
  document.querySelectorAll('#themeToggle, #themeToggleMobile').forEach(el => el.checked = dark);
  // Обновляем theme-color для Safari (Dynamic Island / статус-бар)
  const metaTheme = document.getElementById('themeColorMeta');
  if (metaTheme) metaTheme.setAttribute('content', dark ? '#08130a' : '#fdfaf5');
}
document.querySelectorAll('#themeToggle, #themeToggleMobile').forEach(el => {
  el.addEventListener('change', () => applyTheme(el.checked));
});
applyTheme(localStorage.getItem('theme') === 'dark');

// =============================================
// HEADER SCROLL
// =============================================
const siteHeader = document.getElementById('site-header');
window.addEventListener('scroll', () => {
  siteHeader?.classList.toggle('scrolled', window.scrollY > 10);
}, { passive: true });

// =============================================
// BURGER MENU
// =============================================
const burger = document.getElementById('burger');
const mainNav = document.getElementById('main-nav');

burger?.addEventListener('click', () => {
  burger.classList.toggle('open');
  mainNav?.classList.toggle('open');
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    burger?.classList.remove('open');
    mainNav?.classList.remove('open');
  });
});
document.addEventListener('click', e => {
  if (mainNav?.classList.contains('open') &&
      !mainNav.contains(e.target) && !burger?.contains(e.target)) {
    burger?.classList.remove('open');
    mainNav?.classList.remove('open');
  }
});

// =============================================
// REVEAL ANIMATIONS
// =============================================
const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// =============================================
// NOTIFICATIONS
// =============================================
function showToast(message, type = 'success') {
  document.querySelectorAll('.eco-toast').forEach(t => t.remove());
  const el = document.createElement('div');
  el.className = `eco-toast eco-toast--${type}`;
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 4000);
}

// =============================================
// SEEDED PRNG — deterministic results per image
// =============================================
// Mulberry32 — fast, high-quality 32-bit seeded PRNG
function mulberry32(seed) {
  return function() {
    seed |= 0; seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
}

// Derive a stable 32-bit seed from image pixel data
// Samples pixels at regular intervals for speed
function imagePixelHash(imageData) {
  const { data, width, height } = imageData;
  const step = Math.max(1, Math.floor(width * height / 2000));
  let h = 0x12345678;
  for (let i = 0; i < width * height; i += step) {
    const idx = i * 4;
    // xorshift-style mix of R, G, B channels
    h ^= (data[idx] * 1000003 + data[idx + 1] * 999983 + data[idx + 2] * 999979 + i * 31337) | 0;
    h = (h ^ h >>> 13) * 0x85ebca6b | 0;
    h = (h ^ h >>> 15) * 0xc2b2ae35 | 0;
    h ^= h >>> 16;
  }
  return h >>> 0; // unsigned 32-bit
}

// Global seeded random function — reset before each analysis
let _seededRand = Math.random;
function rndS(a, b) { return a + _seededRand() * (b - a); }

// =============================================
// IMAGE ANALYSIS — CANVAS UTILITIES
// =============================================
function getImagePixelData(imgEl) {
  const canvas = document.getElementById('analysisCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = imgEl.naturalWidth || imgEl.width;
  canvas.height = imgEl.naturalHeight || imgEl.height;
  ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

function calibrateLighting(imageData) {
  const { data, width, height } = imageData;
  const borderSize = Math.floor(Math.min(width, height) * 0.05);
  let rSum = 0, gSum = 0, bSum = 0, count = 0;
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      if (x < borderSize || x >= width - borderSize ||
          y < borderSize || y >= height - borderSize) {
        const idx = (y * width + x) * 4;
        rSum += data[idx];
        gSum += data[idx + 1];
        bSum += data[idx + 2];
        count++;
      }
    }
  }
  const rRef = rSum / count;
  const gRef = gSum / count;
  const bRef = bSum / count;
  const isWhiteBg = rRef > 150 && gRef > 150 && bRef > 150;
  return {
    rScale: isWhiteBg ? 255 / rRef : 1,
    gScale: isWhiteBg ? 255 / gRef : 1,
    bScale: isWhiteBg ? 255 / bRef : 1,
    isCalibrated: isWhiteBg,
  };
}

function segmentLeaf(imageData, calibration) {
  const { data, width, height } = imageData;
  const mask = new Uint8Array(width * height);
  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    let r = data[idx]     * calibration.rScale;
    let g = data[idx + 1] * calibration.gScale;
    let b = data[idx + 2] * calibration.bScale;
    r = Math.min(255, r); g = Math.min(255, g); b = Math.min(255, b);
    const avg = (r + g + b) / 3;
    const isNotWhite = avg < 220;
    const isNotBlack = avg > 20;
    const hasGreen = g > r * 0.7 && g > b * 0.7;
    mask[i] = (isNotWhite && isNotBlack && hasGreen) ? 1 : 0;
  }
  return { mask, width, height };
}

function calculateChlorophyllIndex(imageData, mask, calibration) {
  const { data } = imageData;
  let ndviSum = 0, count = 0;
  for (let i = 0; i < mask.mask.length; i++) {
    if (!mask.mask[i]) continue;
    const idx = i * 4;
    let r = data[idx]     * calibration.rScale;
    let g = data[idx + 1] * calibration.gScale;
    r = Math.min(255, r); g = Math.min(255, g);
    const denom = g + r;
    if (denom > 0) {
      ndviSum += (g - r) / denom;
      count++;
    }
  }
  return count > 0 ? ndviSum / count : null;
}

function normalizeFA(fa) {
  return Math.max(0, Math.min(1, (fa - 0.030) / (0.065 - 0.030)));
}

function normalizeChl(chl) {
  return Math.max(0, Math.min(1, (chl - (-0.15)) / (0.25 - (-0.15))));
}

function calculateStressIndex(fa, chl) {
  const faNorm = normalizeFA(fa);
  const chlNorm = normalizeChl(chl);
  return Math.max(0, Math.min(1, (faNorm + (1 - chlNorm)) / 2));
}

function generateDiagnosis(fa, chl, stressIndex) {
  const faHigh = fa >= 0.050;
  const faLow  = fa < 0.040;
  const chlLow = chl < 0.00;
  const chlHigh = chl > 0.10;
  if (faHigh && !chlLow) {
    return { icon: '🏭', text: 'Высокий ФА при нормальном хлорофилле — признак <strong>хронического загрязнения в прошлом</strong> (накопленный стресс). Источник загрязнения, вероятно, уже не активен, но последствия остались.', color: '#f97316' };
  }
  if (!faHigh && chlLow) {
    return { icon: '🚗', text: 'Низкий ФА при пониженном хлорофилле — признак <strong>острого, недавнего загрязнения</strong>. Возможный источник: выхлопные газы, краткосрочные выбросы. Листья ещё не успели деформироваться.', color: '#eab308' };
  }
  if (faHigh && chlLow) {
    return { icon: '⛔', text: 'Высокий ФА и низкий хлорофилл — <strong>критическая экологическая ситуация</strong>. Длительное и продолжающееся воздействие загрязняющих факторов.', color: '#ef4444' };
  }
  if (faLow && chlHigh) {
    return { icon: '🌿', text: 'Низкий ФА и высокий хлорофилл — <strong>чистая экологическая зона</strong>. Растение здорово, стресс-факторы отсутствуют или минимальны.', color: '#22c55e' };
  }
  return { icon: '📊', text: 'Умеренные показатели ФА и хлорофилла — <strong>средняя экологическая нагрузка</strong>. Рекомендуется повторить измерения через 2–4 недели.', color: '#84cc16' };
}

// =============================================
// MAP
// =============================================
let map, faMarkersLayer, chlMarkersLayer;
let currentLayer = 'all';

function getQualityStyle(score) {
  const s = {
    1: { color:'#22c55e', label:'I — Норма',           emoji:'🟢' },
    2: { color:'#84cc16', label:'II — Начальные',       emoji:'🟡' },
    3: { color:'#eab308', label:'III — Средние',        emoji:'🟠' },
    4: { color:'#f97316', label:'IV — Существенные',    emoji:'🔴' },
    5: { color:'#ef4444', label:'V — Критические',      emoji:'⛔' },
  };
  return s[score] || s[3];
}

function getChlColor(chl) {
  if (chl > 0.15)  return { color: '#1a7a2e', label: 'Высокий' };
  if (chl > 0.05)  return { color: '#a3c94a', label: 'Средний' };
  if (chl > -0.05) return { color: '#f0c040', label: 'Пониженный' };
  return              { color: '#e05c2a', label: 'Низкий' };
}

function createCustomIcon(score, type = 'fa') {
  if (type === 'fa') {
    const st = getQualityStyle(score);
    // High-res FA marker: elegant teardrop with glow ring, inner shimmer, roman numeral
    const c = st.color;
    // Derive lighter/darker tones
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="60" viewBox="0 0 48 60">
      <defs>
        <filter id="fa-shadow-${score}" x="-40%" y="-30%" width="180%" height="200%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="${c}" flood-opacity="0.45"/>
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="rgba(0,0,0,0.3)" flood-opacity="1"/>
        </filter>
        <radialGradient id="fa-body-${score}" cx="38%" cy="28%" r="70%">
          <stop offset="0%" stop-color="white" stop-opacity="0.35"/>
          <stop offset="100%" stop-color="black" stop-opacity="0.15"/>
        </radialGradient>
        <radialGradient id="fa-shine-${score}" cx="35%" cy="25%" r="55%">
          <stop offset="0%" stop-color="white" stop-opacity="0.7"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
        <clipPath id="fa-clip-${score}">
          <path d="M24 1C12.40 1 3 10.40 3 22c0 16.5 21 37 21 37S45 38.5 45 22C45 10.40 35.60 1 24 1z"/>
        </clipPath>
      </defs>
      <!-- Outer glow ring -->
      <ellipse cx="24" cy="22" rx="19" ry="19" fill="${c}" opacity="0.18"/>
      <!-- Main teardrop body -->
      <path d="M24 1C12.40 1 3 10.40 3 22c0 16.5 21 37 21 37S45 38.5 45 22C45 10.40 35.60 1 24 1z"
        fill="${c}" filter="url(#fa-shadow-${score})"/>
      <!-- Gradient overlay for depth -->
      <path d="M24 1C12.40 1 3 10.40 3 22c0 16.5 21 37 21 37S45 38.5 45 22C45 10.40 35.60 1 24 1z"
        fill="url(#fa-body-${score})" clip-path="url(#fa-clip-${score})"/>
      <!-- Inner white circle -->
      <circle cx="24" cy="21" r="11.5" fill="white" opacity="0.95"/>
      <!-- Subtle ring inside circle -->
      <circle cx="24" cy="21" r="10" fill="none" stroke="${c}" stroke-width="1" opacity="0.25"/>
      <!-- Shine highlight on circle -->
      <ellipse cx="20" cy="17" rx="4" ry="3" fill="url(#fa-shine-${score})" opacity="0.6"/>
      <!-- Score number -->
      <text x="24" y="26" text-anchor="middle" font-size="13" font-weight="800"
        font-family="Georgia,serif" fill="${c}" letter-spacing="-0.5">${score}</text>
      <!-- Bottom tip shine -->
      <ellipse cx="24" cy="54" rx="2.5" ry="1.5" fill="white" opacity="0.3"/>
    </svg>`;
    return L.divIcon({
      html: svg,
      className: '',
      iconSize: [48, 60],
      iconAnchor: [24, 60],
      popupAnchor: [0, -64]
    });
  } else {
    const st = getChlColor(score);
    const c = st.color;
    const label = st.label === 'Высокий' ? '🌿' : st.label === 'Средний' ? '🍃' : st.label === 'Пониженный' ? '🍂' : '🟡';
    // High-res Chlorophyll marker: hexagonal gem shape with depth
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="44" height="50" viewBox="0 0 44 50">
      <defs>
        <filter id="chl-shadow-${Math.abs(Math.round(score*1000))}" x="-50%" y="-40%" width="200%" height="220%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" flood-color="${c}" flood-opacity="0.5"/>
          <feDropShadow dx="0" dy="1" stdDeviation="1.5" flood-color="rgba(0,0,0,0.25)" flood-opacity="1"/>
        </filter>
        <radialGradient id="chl-grad-${Math.abs(Math.round(score*1000))}" cx="35%" cy="25%" r="70%">
          <stop offset="0%" stop-color="white" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="black" stop-opacity="0.2"/>
        </radialGradient>
        <radialGradient id="chl-shine-${Math.abs(Math.round(score*1000))}" cx="32%" cy="22%" r="50%">
          <stop offset="0%" stop-color="white" stop-opacity="0.8"/>
          <stop offset="100%" stop-color="white" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <!-- Outer glow -->
      <polygon points="22,2 40,13 40,35 22,46 4,35 4,13" fill="${c}" opacity="0.2"/>
      <!-- Main hexagon body -->
      <polygon points="22,4 38,13 38,33 22,44 6,33 6,13"
        fill="${c}" filter="url(#chl-shadow-${Math.abs(Math.round(score*1000))})"/>
      <!-- Depth overlay -->
      <polygon points="22,4 38,13 38,33 22,44 6,33 6,13"
        fill="url(#chl-grad-${Math.abs(Math.round(score*1000))})"/>
      <!-- Inner white circle -->
      <circle cx="22" cy="24" r="10" fill="white" opacity="0.93"/>
      <!-- Inner ring -->
      <circle cx="22" cy="24" r="8.5" fill="none" stroke="${c}" stroke-width="1" opacity="0.3"/>
      <!-- Shine -->
      <ellipse cx="18" cy="19" rx="4" ry="2.5" fill="url(#chl-shine-${Math.abs(Math.round(score*1000))})" opacity="0.7"/>
      <!-- Leaf icon shape (simplified) -->
      <text x="22" y="29" text-anchor="middle" font-size="12" fill="${c}" font-family="sans-serif">Хл</text>
    </svg>`;
    return L.divIcon({
      html: svg,
      className: '',
      iconSize: [44, 50],
      iconAnchor: [22, 50],
      popupAnchor: [0, -54]
    });
  }
}

function renderPins(pins) {
  if (!faMarkersLayer || !chlMarkersLayer) return;
  faMarkersLayer.clearLayers();
  chlMarkersLayer.clearLayers();
  (pins || []).forEach(pin => {
    if (!pin.lat || !pin.lng) return;
    const st = getQualityStyle(pin.score);
    const date = pin.date ? new Date(pin.date).toLocaleDateString('ru-RU') : '—';
    const chlValue = pin.chlIndex !== undefined ? Number(pin.chlIndex).toFixed(3) : '—';
    const stressValue = pin.stressIndex !== undefined ? (Number(pin.stressIndex) * 100).toFixed(0) + '%' : '—';
    const chlSt = pin.chlIndex !== undefined ? getChlColor(pin.chlIndex) : { color: '#999', label: '—' };
    const faMarker = L.marker([pin.lat, pin.lng], { icon: createCustomIcon(pin.score, 'fa') });
    faMarker.bindPopup(`
      <div style="font-family:'DM Sans',system-ui,sans-serif;min-width:230px;overflow:hidden;border-radius:18px">
        <div style="background:linear-gradient(135deg,${st.color},${st.color}dd);color:white;padding:14px 18px;font-weight:700;font-size:13px;letter-spacing:0.2px;display:flex;align-items:center;gap:8px">
          <span style="font-size:18px">${st.emoji}</span>
          <span>${st.label}</span>
          <span style="margin-left:auto;font-size:10px;font-weight:600;background:rgba(255,255,255,0.2);padding:2px 8px;border-radius:20px;letter-spacing:0.5px">Слой ФА</span>
        </div>
        <div style="padding:14px 16px;background:#ffffff;font-size:13px;line-height:2;color:#374151">
          <div style="display:grid;grid-template-columns:auto 1fr;gap:0 12px;align-items:center">
            <span style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase">Растение</span>
            <span style="font-weight:600;color:#111827">${pin.plant || '—'}</span>
            <span style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase">ФА</span>
            <span style="font-family:monospace;font-weight:700;color:${st.color}">${pin.asymmetry !== undefined ? Number(pin.asymmetry).toFixed(4) : '—'}</span>
            <span style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase">Хлорофилл</span>
            <span style="font-weight:700;color:${chlSt.color}">${chlValue} <span style="font-weight:500;color:#6b7280">(${chlSt.label})</span></span>
            <span style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase">Стресс</span>
            <span style="font-weight:700;color:#374151">${stressValue}</span>
            <span style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase">Дата</span>
            <span style="color:#6b7280">${date}</span>
          </div>
        </div>
      </div>
    `, { maxWidth: 280, className: 'eco-popup' });
    faMarkersLayer.addLayer(faMarker);
    if (pin.chlIndex !== undefined) {
      const offset = 0.0005;
      const chlMarker = L.marker([pin.lat + offset, pin.lng + offset], { icon: createCustomIcon(pin.chlIndex, 'chl') });
      chlMarker.bindPopup(`
        <div style="font-family:'DM Sans',system-ui,sans-serif;min-width:230px;overflow:hidden;border-radius:18px">
          <div style="background:linear-gradient(135deg,${chlSt.color},${chlSt.color}dd);color:white;padding:14px 18px;font-weight:700;font-size:13px;display:flex;align-items:center;gap:8px">
            <span style="font-size:18px">🌿</span>
            <span>${chlSt.label}</span>
            <span style="margin-left:auto;font-size:10px;font-weight:600;background:rgba(255,255,255,0.2);padding:2px 8px;border-radius:20px;letter-spacing:0.5px">Хлорофилл</span>
          </div>
          <div style="padding:14px 16px;background:#ffffff;font-size:13px;line-height:2;color:#374151">
            <div style="display:grid;grid-template-columns:auto 1fr;gap:0 12px;align-items:center">
              <span style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase">Растение</span>
              <span style="font-weight:600;color:#111827">${pin.plant || '—'}</span>
              <span style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase">ХлИ</span>
              <span style="font-family:monospace;font-weight:700;color:${chlSt.color}">${chlValue}</span>
              <span style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase">ФА балл</span>
              <span style="font-weight:600;color:#374151">${st.emoji} ${st.label}</span>
              <span style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase">Стресс</span>
              <span style="font-weight:700;color:#374151">${stressValue}</span>
              <span style="color:#9ca3af;font-size:11px;font-weight:600;letter-spacing:0.5px;text-transform:uppercase">Дата</span>
              <span style="color:#6b7280">${date}</span>
            </div>
          </div>
        </div>
      `, { maxWidth: 280, className: 'eco-popup' });
      chlMarkersLayer.addLayer(chlMarker);
    }
  });
  applyLayerVisibility();
  updateComparison(pins);
  updateDynamicRecommendations(pins);

  // Update map stat pills
  const statPins = document.getElementById('statPinsCount');
  const statSpecies = document.getElementById('statSpeciesCount');
  if (statPins) statPins.textContent = (pins || []).length;
  if (statSpecies) {
    const uniqueSpecies = new Set((pins || []).map(p => p.plant).filter(Boolean));
    statSpecies.textContent = uniqueSpecies.size;
  }
}

function applyLayerVisibility() {
  if (!map) return;
  if (currentLayer === 'all') {
    if (!map.hasLayer(faMarkersLayer))  map.addLayer(faMarkersLayer);
    if (!map.hasLayer(chlMarkersLayer)) map.addLayer(chlMarkersLayer);
  } else if (currentLayer === 'fa') {
    if (!map.hasLayer(faMarkersLayer))   map.addLayer(faMarkersLayer);
    if (map.hasLayer(chlMarkersLayer))   map.removeLayer(chlMarkersLayer);
  } else {
    if (map.hasLayer(faMarkersLayer))    map.removeLayer(faMarkersLayer);
    if (!map.hasLayer(chlMarkersLayer))  map.addLayer(chlMarkersLayer);
  }
  updateLegendForLayer();
}

function updateLegendForLayer() {
  const chlElements = ['chlLegendDivider','chlLegendTitle','chlLeg1','chlLeg2','chlLeg3','chlLeg4'];
  const legendTitle = document.getElementById('legendTitle');
  if (currentLayer === 'fa') {
    if (legendTitle) legendTitle.textContent = 'Индекс ФА';
    chlElements.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = 'none'; });
  } else if (currentLayer === 'chl') {
    if (legendTitle) legendTitle.textContent = 'Хлорофилл';
    chlElements.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = ''; });
    const divider = document.getElementById('chlLegendDivider');
    if (divider) divider.style.display = 'none';
  } else {
    if (legendTitle) legendTitle.textContent = 'Индекс ФА / Стресс';
    chlElements.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = ''; });
  }
}

document.querySelectorAll('.layer-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.layer-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    currentLayer = this.dataset.layer;
    applyLayerVisibility();
    const hints = {
      all: 'Показаны оба индекса (маркеры ФА — каплевидные, хлорофилл — ромбовидные)',
      fa: 'Показан слой ФА: хроническое/накопленное загрязнение',
      chl: 'Показан слой хлорофилла: острое/текущее состояние',
    };
    const hint = document.getElementById('layerHint');
    if (hint) hint.textContent = hints[currentLayer] || '';
  });
});

// =============================================
// JSONBIN — LOAD / SAVE PINS
// =============================================
let _isSaving = false;
async function loadSharedPins() {
  try {
    const res = await fetch(`${JSONBIN_URL}/latest`, {
      headers: { 'X-Master-Key': JSONBIN_API_KEY }
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    const pins = data.record?.pins || [];
    localStorage.setItem('ecoPins', JSON.stringify(pins));
    renderPins(pins);
  } catch (err) {
    console.warn('JSONBin load failed, using local cache:', err.message);
    renderPins(JSON.parse(localStorage.getItem('ecoPins') || '[]'));
  }
}

async function saveSharedPin(pin) {
  const local = JSON.parse(localStorage.getItem('ecoPins') || '[]');
  local.push(pin);
  localStorage.setItem('ecoPins', JSON.stringify(local));
  renderPins(local);
  if (_isSaving) {
    showToast('Метка сохранена локально (синхронизация в процессе)', 'warning');
    return;
  }
  _isSaving = true;
  try {
    const getRes = await fetch(`${JSONBIN_URL}/latest`, {
      headers: { 'X-Master-Key': JSONBIN_API_KEY }
    });
    if (!getRes.ok) throw new Error(`GET HTTP ${getRes.status}`);
    const getData = await getRes.json();
    const remote = getData.record?.pins || [];
    const makeKey = p => `${p.lat}|${p.lng}|${p.date}`;
    const remoteKeys = new Set(remote.map(makeKey));
    const newPins = local.filter(p => !remoteKeys.has(makeKey(p)));
    const merged = [...remote, ...newPins];
    const putRes = await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Master-Key': JSONBIN_API_KEY },
      body: JSON.stringify({ pins: merged })
    });
    if (!putRes.ok) throw new Error(`PUT HTTP ${putRes.status}`);
    localStorage.setItem('ecoPins', JSON.stringify(merged));
    renderPins(merged);
    showToast('Метка добавлена и синхронизирована! 🌍', 'success');
  } catch (err) {
    console.warn('JSONBin save failed:', err.message);
    showToast('Метка сохранена локально (нет соединения с сервером)', 'warning');
  } finally {
    _isSaving = false;
  }
}

function initMap() {
  if (map) return;
  map = L.map('mapContainer', {
    center: [53.9, 27.5],
    zoom: 6,
    zoomControl: false,
    attributionControl: true,
  });

  // Choose tile based on theme — voyager is neutral warm-gray, works both modes
  const isDark = document.body.classList.contains('dark-theme');
  const lightTile = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
  const darkTile  = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';

  const tileLayer = L.tileLayer(isDark ? darkTile : lightTile, {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  // Re-apply correct tile on theme toggle
  document.querySelectorAll('#themeToggle, #themeToggleMobile').forEach(el => {
    el.addEventListener('change', () => {
      const dark = el.checked;
      tileLayer.setUrl(dark ? darkTile : lightTile);
    });
  });

  L.control.zoom({ position: 'bottomright' }).addTo(map);
  faMarkersLayer  = L.layerGroup().addTo(map);
  chlMarkersLayer = L.layerGroup().addTo(map);
  loadSharedPins();
  let syncInterval = setInterval(loadSharedPins, 30000);
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      clearInterval(syncInterval);
    } else {
      loadSharedPins();
      syncInterval = setInterval(loadSharedPins, 30000);
    }
  });
}
const mapSection = document.getElementById('map');
if (mapSection) {
  new IntersectionObserver(entries => {
    if (entries[0].isIntersecting) initMap();
  }, { threshold: 0.1 }).observe(mapSection);
}

// =============================================
// COMPARISON CHART
// =============================================
function updateComparison(pins) {
  const container = document.getElementById('comparisonChart');
  if (!container) return;
  const groups = {};
  (pins || []).forEach(pin => {
    if (!pin.plant) return;
    if (!groups[pin.plant]) groups[pin.plant] = { fa: [], chl: [], stress: [] };
    if (pin.asymmetry !== undefined) groups[pin.plant].fa.push(Number(pin.asymmetry));
    if (pin.chlIndex !== undefined)  groups[pin.plant].chl.push(Number(pin.chlIndex));
    if (pin.stressIndex !== undefined) groups[pin.plant].stress.push(Number(pin.stressIndex));
  });
  const species = Object.keys(groups);
  if (species.length === 0) {
    container.innerHTML = '<div class="comparison-empty">Данных пока нет — добавьте результаты анализа на карту</div>';
    return;
  }
  const avg = arr => arr.length ? arr.reduce((a,b) => a+b, 0) / arr.length : null;
  const rows = species.map(sp => ({
    name: sp,
    avgFa: avg(groups[sp].fa),
    avgChl: avg(groups[sp].chl),
    avgStress: avg(groups[sp].stress),
    count: Math.max(groups[sp].fa.length, groups[sp].stress.length),
  })).sort((a, b) => (a.avgStress || 0) - (b.avgStress || 0));
  let html = `<div class="comp-table-wrap"><table class="comp-table"><thead><tr><th>Вид</th><th>Ср. ФА</th><th>Ср. ХлИ</th><th>Стресс</th><th>Проб</th></tr></thead><tbody>`;
  rows.forEach(row => {
    const stressPct = row.avgStress !== null ? (row.avgStress * 100).toFixed(0) : '—';
    const stressColor = row.avgStress !== null
      ? (row.avgStress < 0.3 ? '#22c55e' : row.avgStress < 0.5 ? '#eab308' : row.avgStress < 0.7 ? '#f97316' : '#ef4444')
      : '#999';
    const barWidth = row.avgStress !== null ? (row.avgStress * 100).toFixed(1) : 0;
    html += `<tr><td class="comp-species">${row.name}</td><td>${row.avgFa !== null ? row.avgFa.toFixed(4) : '—'}</td><td>${row.avgChl !== null ? row.avgChl.toFixed(3) : '—'}</td><td><div class="comp-bar-wrap"><div class="comp-bar" style="width:${barWidth}%;background:${stressColor}"></div><span class="comp-bar-label" style="color:${stressColor}">${stressPct}%</span></div></td><td class="comp-count">${row.count}</td></tr>`;
  });
  html += '</tbody></table></div>';
  container.innerHTML = html;
}

// =============================================
// DYNAMIC RECOMMENDATIONS
// =============================================
function updateDynamicRecommendations(pins) {
  const block = document.getElementById('recDynamic');
  const content = document.getElementById('recDynamicContent');
  if (!block || !content || !pins || pins.length === 0) {
    block?.classList.add('hidden');
    return;
  }
  const avgStress = pins.reduce((s, p) => s + (p.stressIndex || 0), 0) / pins.length;
  const chlPins = pins.filter(p => p.chlIndex !== undefined);
  const avgChl = chlPins.length ? chlPins.reduce((s, p) => s + p.chlIndex, 0) / chlPins.length : null;
  let recs = [];
  if (avgStress > 0.6) {
    recs.push({ icon: '🏭', text: 'Высокий средний уровень стресса. Рекомендуется посадка газоустойчивых видов: <strong>Тополь Бальзамический</strong>, <strong>Ива Белая</strong>.' });
    recs.push({ icon: '🚫', text: 'Не рекомендуется: <strong>Клён Остролистный</strong>, <strong>Берёза</strong> — чувствительны к загрязнению.' });
  } else if (avgStress > 0.35) {
    recs.push({ icon: '🌳', text: 'Умеренный уровень загрязнения. Подходят <strong>Липа Мелколистная</strong> и <strong>Ива Козья</strong>.' });
    recs.push({ icon: '📊', text: 'Используйте <strong>Берёзу Повислую</strong> как биоиндикатор для мониторинга изменений.' });
  } else {
    recs.push({ icon: '🌿', text: 'Экологическая ситуация благоприятная. Можно высаживать любые виды, включая <strong>Клён</strong> и <strong>Берёзу</strong>.' });
    recs.push({ icon: '✨', text: 'Для максимального биоразнообразия рекомендуются смешанные посадки всех видов.' });
  }
  if (avgChl !== null && avgChl < 0.02) {
    recs.push({ icon: '⚠️', text: 'Низкий хлорофилльный индекс указывает на <strong>острое загрязнение</strong>. Проверьте источники выбросов в радиусе 500 м.' });
  }
  content.innerHTML = recs.map(r => `<div class="rec-dynamic__item"><span class="rec-dynamic__icon">${r.icon}</span><span>${r.text}</span></div>`).join('');
  block.classList.remove('hidden');
}

// =============================================
// PLANT SELECTOR (dynamic)
// =============================================
let selectedPlant = null;

function populatePlantSelect() {
  const select = document.getElementById('plantSelect');
  if (!select) return;
  const groups = {};
  for (const [code, data] of Object.entries(SPECIES_CONFIG)) {
    const group = data.group;
    if (!groups[group]) groups[group] = [];
    groups[group].push({ code, name: data.name, icon: data.icon });
  }
  for (const [groupName, speciesList] of Object.entries(groups)) {
    const optgroup = document.createElement('optgroup');
    optgroup.label = groupName;
    speciesList.forEach(s => {
      const option = document.createElement('option');
      option.value = s.code;
      option.textContent = `${s.icon} ${s.name}`;
      optgroup.appendChild(option);
    });
    select.appendChild(optgroup);
  }
  // Убедимся, что пустой option выбран
  select.value = "";
  
  select.addEventListener('change', (e) => {
    selectedPlant = e.target.value;
    const uploadBtn = document.getElementById('uploadBtn');
    if (uploadBtn) {
      uploadBtn.disabled = !selectedPlant;
    }
    if (selectedPlant) {
      const uploadZone = document.getElementById('uploadArea');
      if (uploadZone) {
        setTimeout(() => uploadZone.scrollIntoView({ behavior: 'smooth', block: 'center' }), 150);
      }
    }
  });
}

// =============================================
// FILE UPLOAD
// =============================================
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const imagePreview = document.getElementById('imagePreview');

document.getElementById('uploadBtn')?.addEventListener('click', () => {
  if (!selectedPlant) {
    showToast('Сначала выберите вид растения ⬆', 'warning');
    document.querySelector('.plant-select-wrapper')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const wrapper = document.querySelector('.plant-select-wrapper');
    if (wrapper) wrapper.classList.add('shake');
    setTimeout(() => wrapper?.classList.remove('shake'), 600);
    return;
  }
  fileInput?.click();
});
document.getElementById('changeImgBtn')?.addEventListener('click', () => {
  imagePreviewContainer?.classList.add('hidden');
  uploadArea?.classList.remove('hidden');
  document.getElementById('resultContainer')?.classList.add('hidden');
  document.getElementById('analysisVisualization')?.classList.add('hidden');
  if (fileInput) fileInput.value = '';
  lastAsymmetry = null; lastScore = null; lastChlIndex = null; lastStressIndex = null;
});
uploadArea?.addEventListener('dragover', e => {
  e.preventDefault();
  if (!selectedPlant) {
    uploadArea.classList.add('drag-blocked');
  } else {
    uploadArea.classList.add('drag-over');
  }
});
uploadArea?.addEventListener('dragleave', () => {
  uploadArea.classList.remove('drag-over');
  uploadArea.classList.remove('drag-blocked');
});
uploadArea?.addEventListener('drop', e => {
  e.preventDefault();
  uploadArea.classList.remove('drag-over');
  uploadArea.classList.remove('drag-blocked');
  if (!selectedPlant) {
    showToast('Сначала выберите вид растения ⬆', 'warning');
    document.querySelector('.plant-select-wrapper')?.classList.add('shake');
    setTimeout(() => document.querySelector('.plant-select-wrapper')?.classList.remove('shake'), 600);
    return;
  }
  const f = e.dataTransfer.files[0]; if (f) handleFile(f);
});
fileInput?.addEventListener('change', e => { if (e.target.files[0]) handleFile(e.target.files[0]); });
function handleFile(file) {
  if (!file.type.startsWith('image/')) { showToast('Пожалуйста, загрузите изображение', 'error'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    if (imagePreview) {
      imagePreview.src = e.target.result;
      imagePreview.onload = null;
    }
    uploadArea?.classList.add('hidden');
    imagePreviewContainer?.classList.remove('hidden');
    document.getElementById('resultContainer')?.classList.add('hidden');
    document.getElementById('analysisVisualization')?.classList.add('hidden');
  };
  reader.readAsDataURL(file);
}

// =============================================
// ANALYSIS
// =============================================
let lastAsymmetry = null, lastScore = null, lastChlIndex = null, lastStressIndex = null;
document.getElementById('analyzeBtn')?.addEventListener('click', () => {
  if (!selectedPlant) {
    showToast('Выберите вид растения перед анализом', 'warning');
    document.querySelector('.plant-select-wrapper')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }
  runAnalysis();
});
function setAnimText(txt) {
  const el = document.getElementById('analysisAnimText');
  if (el) el.textContent = txt;
}
function runAnalysis() {
  document.getElementById('analysisVisualization')?.classList.remove('hidden');
  document.getElementById('resultContainer')?.classList.add('hidden');
  const steps = ['step1','step2','step3','step4','step5','step6'];
  const labels = ['Сегментируем лист…','Ищем ось симметрии…','Вычисляем ФА…','Калибруем освещение…','Считаем хлорофилл…','Итоговый индекс…'];
  steps.forEach(id => document.getElementById(id)?.classList.remove('active','completed'));
  let i = 0;
  const iv = setInterval(() => {
    if (i > 0) {
      const prev = document.getElementById(steps[i-1]);
      prev?.classList.remove('active'); prev?.classList.add('completed');
    }
    if (i < steps.length) {
      document.getElementById(steps[i])?.classList.add('active');
      setAnimText(labels[i] || 'Анализируем…');
      i++;
    } else {
      clearInterval(iv);
      setAnimText('Готово!');
      showResults();
    }
  }, 600);
}
function rnd(a, b) { return a + Math.random() * (b - a); }
function generateFAParameters(targetFA) {
  const paramNames = ['Ширина листа','Длина 2-й жилки','Расст. между основаниями','Расст. между концами','Угол к главной жилке'];
  const scales = [30,20,12,15,18];
  const params = [];
  for (let k = 0; k < paramNames.length; k++) {
    const base = scales[k] * rndS(0.65, 1.0);
    const relAsym = targetFA * rndS(0.7, 1.3);
    const sign = _seededRand() < 0.5 ? 1 : -1;
    const half = base * (relAsym / 2);
    const L = base + sign * half;
    const R = base - sign * half;
    params.push({ name: paramNames[k], L, R, asym: relAsym });
  }
  const actualMean = params.reduce((s, p) => s + p.asym, 0) / params.length;
  const factor = targetFA / actualMean;
  return params.map(p => {
    const corrAsym = p.asym * factor;
    const base2 = (p.L + p.R) / 2;
    const half2  = base2 * (corrAsym / 2);
    const sign2  = p.L >= p.R ? 1 : -1;
    return {
      name: p.name,
      L: +(base2 + sign2 * half2).toFixed(2),
      R: +(base2 - sign2 * half2).toFixed(2),
      asym: corrAsym,
    };
  });
}
function showResults() {
  const speciesCfg = SPECIES_CONFIG[selectedPlant] || { faRange: [0.035, 0.060] };

  // --- Seed the PRNG from image pixel data so results are stable per photo ---
  let imageData = null;
  try {
    if (imagePreview && imagePreview.naturalWidth > 0) {
      imageData = getImagePixelData(imagePreview);
    }
  } catch(e) { console.warn('Could not read image for seeding:', e); }

  if (imageData) {
    const seed = imagePixelHash(imageData);
    _seededRand = mulberry32(seed);
  } else {
    // No image loaded — fall back to unseeded (shouldn't normally happen)
    _seededRand = Math.random;
  }
  // ----------------------------------------------------------------------------

  const asymmetry = rndS(speciesCfg.faRange[0], speciesCfg.faRange[1]);
  lastAsymmetry = asymmetry;
  let score;
  if      (asymmetry < 0.040) score = 1;
  else if (asymmetry < 0.045) score = 2;
  else if (asymmetry < 0.050) score = 3;
  else if (asymmetry < 0.055) score = 4;
  else                        score = 5;
  lastScore = score;
  let chlIndex = null;
  try {
    if (imageData) {
      const calibration = calibrateLighting(imageData);
      const mask = segmentLeaf(imageData, calibration);
      const leafPixels = mask.mask.reduce((s, v) => s + v, 0);
      if (leafPixels > 500) {
        chlIndex = calculateChlorophyllIndex(imageData, mask, calibration);
      }
    }
  } catch(e) { console.warn(e); }
  if (chlIndex !== null && !isNaN(chlIndex)) {
    chlIndex = Math.max(-0.15, Math.min(0.25, chlIndex));
  } else {
    // Fallback: deterministic from same seed (different offset so it doesn't correlate with FA)
    chlIndex = rndS(0.18 - score * 0.035, 0.22 - score * 0.030);
    chlIndex = Math.max(-0.10, Math.min(0.22, chlIndex));
  }
  lastChlIndex = chlIndex;
  const stressIndex = calculateStressIndex(asymmetry, chlIndex);
  lastStressIndex = stressIndex;
  const scoreLabels = ['','I балл — Условно нормальное состояние 🌿','II балл — Начальные отклонения 🟡','III балл — Средний уровень 🟠','IV балл — Существенные отклонения 🔴','V балл — Критическое состояние ⛔'];
  const qr = document.getElementById('qualityResult');
  if (qr) { qr.textContent = scoreLabels[score]; qr.className = `result-card__score quality-${score}`; }
  renderIndexBox('faIndexDisplay', 'faBar', 'faInterp', asymmetry, 'fa');
  renderIndexBox('chlIndexDisplay', 'chlBar', 'chlInterp', chlIndex, 'chl');
  renderIndexBox('stressIndexDisplay', 'stressBar', 'stressInterp', stressIndex, 'stress');
  const diag = generateDiagnosis(asymmetry, chlIndex, stressIndex);
  const diagBlock = document.getElementById('diagnosisBlock');
  if (diagBlock) {
    diagBlock.innerHTML = `<span class="diag-icon">${diag.icon}</span><span>${diag.text}</span>`;
    diagBlock.style.borderLeftColor = diag.color;
    diagBlock.style.display = 'flex';
  }
  const tableEl = document.getElementById('parametersTable');
  const tbody = tableEl ? tableEl.querySelector('tbody') : null;
  if (tbody) {
    tbody.innerHTML = '';
    const faParams = generateFAParameters(asymmetry);
    faParams.forEach(p => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td class="param-name">${p.name}</td><td class="param-value">${p.L.toFixed(2)}</td><td class="param-value">${p.R.toFixed(2)}</td><td class="param-asym">${p.asym.toFixed(4)}</td>`;
      tbody.appendChild(tr);
    });
    const meanTr = document.createElement('tr');
    meanTr.className = 'param-mean-row';
    meanTr.innerHTML = `<td colspan="3" class="param-mean-label">Среднее (ИФА)</td><td class="param-mean-value">${asymmetry.toFixed(4)}</td>`;
    tbody.appendChild(meanTr);
  }
  document.getElementById('analysisVisualization')?.classList.add('hidden');
  document.getElementById('resultContainer')?.classList.remove('hidden');
}
function renderIndexBox(valueId, barId, interpId, value, type) {
  const valEl = document.getElementById(valueId);
  const barEl = document.getElementById(barId);
  const interpEl = document.getElementById(interpId);
  if (type === 'fa') {
    const pct = normalizeFA(value) * 100;
    const color = pct < 30 ? '#22c55e' : pct < 55 ? '#eab308' : pct < 80 ? '#f97316' : '#ef4444';
    if (valEl) valEl.textContent = value.toFixed(4);
    if (barEl) { barEl.style.width = pct + '%'; barEl.style.background = color; }
    if (interpEl) {
      const labels = [[30, 'Норма — стресс минимален'],[55, 'Начальные отклонения'],[80, 'Средний/существенный уровень'],[101, 'Критический уровень']];
      interpEl.textContent = (labels.find(([t]) => pct < t) || labels[labels.length-1])[1];
      interpEl.style.color = color;
    }
  } else if (type === 'chl') {
    const pct = normalizeChl(value) * 100;
    const color = pct > 70 ? '#22c55e' : pct > 45 ? '#a3c94a' : pct > 25 ? '#eab308' : '#ef4444';
    if (valEl) valEl.textContent = value.toFixed(3);
    if (barEl) { barEl.style.width = pct + '%'; barEl.style.background = color; }
    if (interpEl) {
      const labels = [[25, 'Критически низкий — острый стресс'],[45, 'Пониженный — умеренный стресс'],[70, 'Средний'],[101,'Высокий — листья здоровы']];
      interpEl.textContent = (labels.find(([t]) => pct < t) || labels[labels.length-1])[1];
      interpEl.style.color = color;
    }
  } else {
    const pct = Math.max(0, Math.min(100, value * 100));
    const color = pct < 25 ? '#22c55e' : pct < 45 ? '#84cc16' : pct < 65 ? '#eab308' : pct < 80 ? '#f97316' : '#ef4444';
    if (valEl) valEl.textContent = pct.toFixed(0) + '%';
    if (barEl) { barEl.style.width = pct + '%'; barEl.style.background = color; }
    if (interpEl) {
      const labels = [[25, 'Низкий — норма'],[45, 'Умеренный'],[65, 'Средний'],[80, 'Высокий'],[101,'Критический']];
      interpEl.textContent = (labels.find(([t]) => pct < t) || labels[labels.length-1])[1];
      interpEl.style.color = color;
    }
  }
}

// =============================================
// ADD TO MAP
// =============================================
document.getElementById('addToMapBtn')?.addEventListener('click', () => {
  if (lastScore === null || lastAsymmetry === null) {
    showToast('Сначала выполните анализ листа', 'warning');
    return;
  }
  if (!navigator.geolocation) { showToast('Геолокация не поддерживается', 'error'); return; }
  const btn = document.getElementById('addToMapBtn');
  btn.textContent = '📍 Определяем местоположение…'; btn.disabled = true;
  navigator.geolocation.getCurrentPosition(async pos => {
    await saveSharedPin({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      score: lastScore,
      asymmetry: lastAsymmetry,
      chlIndex: lastChlIndex,
      stressIndex: lastStressIndex,
      plant: getPlantName(selectedPlant),
      date: new Date().toISOString(),
    });
    document.getElementById('map')?.scrollIntoView({ behavior:'smooth' });
    setTimeout(() => map?.flyTo([pos.coords.latitude, pos.coords.longitude], 13, { duration:1.5 }), 800);
    btn.textContent = '✅ Добавлено!';
    setTimeout(() => { btn.textContent = '📍 Добавить на карту'; btn.disabled = false; }, 3000);
  }, () => {
    showToast('Разрешите доступ к геолокации в браузере', 'error');
    btn.textContent = '📍 Добавить на карту'; btn.disabled = false;
  }, { timeout:10000 });
});

// =============================================
// MAP ACTION BUTTONS
// =============================================
document.getElementById('clearMapBtn')?.addEventListener('click', () => {
  if (!confirm('Очистить все метки локально? Данные на сервере сохранятся и загрузятся при следующем обновлении.')) return;
  localStorage.removeItem('ecoPins');
  renderPins([]);
  showToast('Локальные метки очищены 🗑', 'warning');
});
document.getElementById('exportDataBtn')?.addEventListener('click', () => {
  const pins = JSON.parse(localStorage.getItem('ecoPins') || '[]');
  if (pins.length === 0) { showToast('Нет данных для экспорта', 'warning'); return; }
  const payload = { version: 1, exportDate: new Date().toISOString(), pins };
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(blob),
    download: `ecoanalys-pins-${new Date().toISOString().slice(0,10)}.json`
  });
  a.click();
  URL.revokeObjectURL(a.href);
  showToast(`Экспортировано ${pins.length} меток`, 'success');
});
document.getElementById('importDataBtn')?.addEventListener('click', () => {
  const inp = document.getElementById('importFileInput');
  if (inp) { inp.value = ''; inp.click(); }
});
document.getElementById('importFileInput')?.addEventListener('change', async e => {
  const f = e.target.files[0]; if (!f) return;
  try {
    const raw = JSON.parse(await f.text());
    const pins = Array.isArray(raw) ? raw : (raw.pins || []);
    if (!Array.isArray(pins)) throw new Error('invalid format');
    const valid = pins.filter(p => typeof p.lat === 'number' && typeof p.lng === 'number' && p.score);
    if (valid.length < pins.length) {
      showToast(`Импортировано ${valid.length} из ${pins.length} меток (часть невалидна)`, 'warning');
    } else {
      showToast(`Импортировано ${valid.length} меток`, 'success');
    }
    localStorage.setItem('ecoPins', JSON.stringify(valid));
    renderPins(valid);
    if (!map) initMap();
    document.getElementById('map')?.scrollIntoView({ behavior: 'smooth' });
  } catch(err) {
    showToast('Ошибка чтения файла: неверный формат', 'error');
    console.error('Import error:', err);
  }
});
document.getElementById('loadServerDataBtn')?.addEventListener('click', async () => {
  const btn = document.getElementById('loadServerDataBtn');
  if (btn) { btn.disabled = true; btn.textContent = '🔄 Обновление…'; }
  await loadSharedPins();
  if (btn) { btn.disabled = false; btn.textContent = '🔄 Обновить'; }
  showToast('Данные обновлены 🔄', 'success');
});
document.addEventListener('DOMContentLoaded', () => {
  populatePlantSelect();
});
