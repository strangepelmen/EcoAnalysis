// =============================================
// UTILITIES — DEBOUNCE & THROTTLE
// =============================================
function debounce(fn, delay = 150) {
  let timer;
  return function (...args) {
    clearTimeout(timer);
    timer = setTimeout(() => fn.apply(this, args), delay);
  };
}
function throttle(fn, limit = 100) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      fn.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// =============================================
// SMOOTH SCROLL POLYFILL FOR SAFARI
// =============================================
function smoothScrollTo(targetEl, offset = 0) {
  if (!targetEl) return;
  const top = targetEl.getBoundingClientRect().top + window.pageYOffset - offset;
  try {
    window.scrollTo({ top, behavior: 'smooth' });
  } catch {
    window.scrollTo(0, top);
  }
}

// =============================================
// JSONBIN CONFIG — shared pins storage
// =============================================
const JSONBIN_BIN_ID = '6a02bd3dadc21f119a8933bb';
const JSONBIN_API_KEY = '$2a$10$psF.fBMy6iGZpgrf0DYCAeYSZcGPhvD94TtZh6HUHpIvJXLh5Ctme';
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;
const LOCAL_STORAGE_KEY = 'ecoPins_v2';
const MAX_RETRIES = 2;

// =============================================
// SPECIES CONFIG
// =============================================
const SPECIES_CONFIG = {
  'salix-alba': { name: 'Ива Белая', tolerance: 0.85, faRange: [0.035, 0.058], icon: '🌿', group: 'Ивы' },
  'salix-caprea': { name: 'Ива Козья', tolerance: 0.80, faRange: [0.036, 0.060], icon: '🌿', group: 'Ивы' },
  'salix-fragilis': { name: 'Ива Ломкая', tolerance: 0.78, faRange: [0.036, 0.061], icon: '🌿', group: 'Ивы' },
  'salix-viminalis': { name: 'Ива Прутовидная', tolerance: 0.82, faRange: [0.034, 0.057], icon: '🌿', group: 'Ивы' },
  'populus-balsamifera': { name: 'Тополь Бальзамический', tolerance: 0.90, faRange: [0.033, 0.056], icon: '🌳', group: 'Тополя' },
  'populus-tremula': { name: 'Осина (Тополь Дрожащий)', tolerance: 0.72, faRange: [0.036, 0.062], icon: '🌳', group: 'Тополя' },
  'populus-nigra': { name: 'Тополь Чёрный', tolerance: 0.88, faRange: [0.034, 0.057], icon: '🌳', group: 'Тополя' },
  'populus-alba': { name: 'Тополь Белый', tolerance: 0.86, faRange: [0.034, 0.058], icon: '🌳', group: 'Тополя' },
  'betula-pendula': { name: 'Берёза Повислая', tolerance: 0.60, faRange: [0.036, 0.062], icon: '🍂', group: 'Берёзы' },
  'betula-pubescens': { name: 'Берёза Пушистая', tolerance: 0.62, faRange: [0.036, 0.061], icon: '🍂', group: 'Берёзы' },
  'acer-platanoides': { name: 'Клён Остролистный', tolerance: 0.55, faRange: [0.037, 0.063], icon: '🍁', group: 'Клёны' },
  'acer-negundo': { name: 'Клён Ясенелистный', tolerance: 0.70, faRange: [0.036, 0.061], icon: '🍁', group: 'Клёны' },
  'acer-campestre': { name: 'Клён Полевой', tolerance: 0.58, faRange: [0.037, 0.062], icon: '🍁', group: 'Клёны' },
  'tilia-cordata': { name: 'Липа Мелколистная', tolerance: 0.65, faRange: [0.035, 0.060], icon: '🌿', group: 'Липы' },
  'tilia-platyphyllos': { name: 'Липа Крупнолистная', tolerance: 0.63, faRange: [0.036, 0.061], icon: '🌿', group: 'Липы' },
  'quercus-robur': { name: 'Дуб Черешчатый', tolerance: 0.50, faRange: [0.038, 0.065], icon: '🌳', group: 'Дубы' },
  'quercus-petraea': { name: 'Дуб Скальный', tolerance: 0.52, faRange: [0.037, 0.064], icon: '🌳', group: 'Дубы' },
  'ulmus-laevis': { name: 'Вяз Гладкий', tolerance: 0.75, faRange: [0.035, 0.059], icon: '🌿', group: 'Вязы' },
  'ulmus-minor': { name: 'Вяз Листоватый', tolerance: 0.73, faRange: [0.036, 0.060], icon: '🌿', group: 'Вязы' },
  'fraxinus-excelsior': { name: 'Ясень Обыкновенный', tolerance: 0.68, faRange: [0.036, 0.061], icon: '🌿', group: 'Ясень' },
  'prunus-padus': { name: 'Черёмуха Обыкновенная', tolerance: 0.60, faRange: [0.037, 0.062], icon: '🌸', group: 'Другие' },
  'sorbus-aucuparia': { name: 'Рябина Обыкновенная', tolerance: 0.58, faRange: [0.037, 0.063], icon: '🍒', group: 'Другие' },
  'malus-sylvestris': { name: 'Яблоня Лесная', tolerance: 0.55, faRange: [0.038, 0.064], icon: '🍎', group: 'Другие' },
  'alnus-glutinosa': { name: 'Ольха Чёрная', tolerance: 0.76, faRange: [0.035, 0.059], icon: '🌿', group: 'Ольха и Орешник' },
  'alnus-incana': { name: 'Ольха Серая', tolerance: 0.74, faRange: [0.036, 0.060], icon: '🌿', group: 'Ольха и Орешник' },
  'corylus-avellana': { name: 'Лещина Обыкновенная', tolerance: 0.62, faRange: [0.037, 0.062], icon: '🌰', group: 'Ольха и Орешник' },
};

function getPlantName(p) {
  return (SPECIES_CONFIG[p] || {}).name || 'Не указано';
}

// =============================================
// POPULATE PLANT SELECT
// =============================================
function populatePlantSelect() {
  const select = document.getElementById('plantSelect');
  if (!select) return;
  const groups = {};
  Object.entries(SPECIES_CONFIG).forEach(([key, val]) => {
    if (!groups[val.group]) groups[val.group] = [];
    groups[val.group].push({ key, name: val.name, icon: val.icon });
  });
  Object.entries(groups).forEach(([group, species]) => {
    const optgroup = document.createElement('optgroup');
    optgroup.label = group;
    species.forEach(sp => {
      const option = document.createElement('option');
      option.value = sp.key;
      option.textContent = `${sp.icon || ''} ${sp.name}`;
      optgroup.appendChild(option);
    });
    select.appendChild(optgroup);
  });
}

// =============================================
// PRELOADER
// =============================================
function hidePreloader() {
  const preloader = document.getElementById('preloader');
  if (preloader) {
    preloader.classList.add('hidden');
    setTimeout(() => preloader.remove(), 500);
  }
}
window.addEventListener('load', hidePreloader);
// Fallback: hide after 4s if still visible
setTimeout(hidePreloader, 4000);

// =============================================
// THEME
// =============================================
function applyTheme(dark) {
  document.body.classList.toggle('dark-theme', dark);
  localStorage.setItem('theme', dark ? 'dark' : 'light');
  document.querySelectorAll('#themeToggle, #themeToggleMobile').forEach(el => {
    if (el) el.checked = dark;
  });
}
document.querySelectorAll('#themeToggle, #themeToggleMobile').forEach(el => {
  el.addEventListener('change', () => applyTheme(el.checked));
});
applyTheme(localStorage.getItem('theme') === 'dark');

// =============================================
// HEADER SCROLL
// =============================================
const siteHeader = document.getElementById('site-header');
window.addEventListener(
  'scroll',
  throttle(() => {
    siteHeader?.classList.toggle('scrolled', window.scrollY > 10);
  }, 50),
  { passive: true }
);

// =============================================
// BURGER MENU
// =============================================
const burger = document.getElementById('burger');
const mainNav = document.getElementById('main-nav');
burger?.addEventListener('click', () => {
  const isOpen = mainNav?.classList.toggle('open');
  burger.classList.toggle('open');
  burger.setAttribute('aria-expanded', isOpen);
});
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', () => {
    burger?.classList.remove('open');
    mainNav?.classList.remove('open');
    burger?.setAttribute('aria-expanded', 'false');
  });
});
document.addEventListener('click', e => {
  if (mainNav?.classList.contains('open') && !mainNav.contains(e.target) && !burger?.contains(e.target)) {
    burger?.classList.remove('open');
    mainNav?.classList.remove('open');
    burger?.setAttribute('aria-expanded', 'false');
  }
});

// =============================================
// SMOOTH ANCHOR SCROLLING
// =============================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--header-h')) || 64;
      smoothScrollTo(target, headerH);
    }
  });
});

// =============================================
// REVEAL ANIMATIONS
// =============================================
const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
);
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// =============================================
// HERO PARALLAX (subtle)
// =============================================
const heroOrbs = document.querySelectorAll('.hero-orb');
if (heroOrbs.length && window.matchMedia('(prefers-reduced-motion: no-preference)').matches) {
  window.addEventListener(
    'scroll',
    throttle(() => {
      const scrollY = window.pageYOffset;
      heroOrbs.forEach((orb, i) => {
        const speed = 0.02 + i * 0.01;
        orb.style.transform = `translateY(${scrollY * speed}px)`;
      });
    }, 30),
    { passive: true }
  );
}

// =============================================
// NOTIFICATIONS
// =============================================
function showToast(message, type = 'success') {
  document.querySelectorAll('.eco-toast').forEach(t => {
    t.style.opacity = '0';
    t.style.transform = 'translateY(10px)';
    setTimeout(() => t.remove(), 300);
  });
  const el = document.createElement('div');
  el.className = `eco-toast eco-toast--${type}`;
  el.textContent = message;
  el.setAttribute('role', 'status');
  el.setAttribute('aria-live', 'polite');
  document.body.appendChild(el);
  setTimeout(() => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(10px)';
    setTimeout(() => el.remove(), 300);
  }, 4000);
}

// =============================================
// IMAGE ANALYSIS — CANVAS UTILITIES
// =============================================
function getImagePixelData(imgEl) {
  const canvas = document.getElementById('analysisCanvas');
  const ctx = canvas.getContext('2d', { willReadFrequently: true });
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
      if (x < borderSize || x >= width - borderSize || y < borderSize || y >= height - borderSize) {
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
    let r = data[idx] * calibration.rScale;
    let g = data[idx + 1] * calibration.gScale;
    let b = data[idx + 2] * calibration.bScale;
    r = Math.min(255, r);
    g = Math.min(255, g);
    b = Math.min(255, b);
    const avg = (r + g + b) / 3;
    const isNotWhite = avg < 220;
    const isNotBlack = avg > 20;
    const hasGreen = g > r * 0.7 && g > b * 0.7;
    mask[i] = isNotWhite && isNotBlack && hasGreen ? 1 : 0;
  }
  return { mask, width, height };
}

function calculateChlorophyllIndex(imageData, mask, calibration) {
  const { data } = imageData;
  let ndviSum = 0, count = 0;
  for (let i = 0; i < mask.mask.length; i++) {
    if (!mask.mask[i]) continue;
    const idx = i * 4;
    let r = data[idx] * calibration.rScale;
    let g = data[idx + 1] * calibration.gScale;
    r = Math.min(255, r);
    g = Math.min(255, g);
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
  return Math.max(0, Math.min(1, (chl - -0.15) / (0.25 - -0.15)));
}

function calculateStressIndex(fa, chl) {
  const faNorm = normalizeFA(fa);
  const chlNorm = normalizeChl(chl);
  return Math.max(0, Math.min(1, (faNorm + (1 - chlNorm)) / 2));
}

function generateDiagnosis(fa, chl, stressIndex) {
  const faHigh = fa >= 0.050;
  const faLow = fa < 0.040;
  const chlLow = chl < 0.0;
  const chlHigh = chl > 0.1;
  if (faHigh && !chlLow) {
    return {
      icon: '🔶',
      text: 'Высокий ФА при нормальном хлорофилле — признак хронического загрязнения в прошлом (накопленный стресс). Источник загрязнения, вероятно, уже не активен, но последствия остались.',
      color: '#f97316',
    };
  }
  if (!faHigh && chlLow) {
    return {
      icon: '⚠️',
      text: 'Низкий ФА при пониженном хлорофилле — признак острого, недавнего загрязнения. Возможный источник: выхлопные газы, краткосрочные выбросы. Листья ещё не успели деформироваться.',
      color: '#eab308',
    };
  }
  if (faHigh && chlLow) {
    return {
      icon: '⛔',
      text: 'Высокий ФА и низкий хлорофилл — критическая экологическая ситуация. Длительное и продолжающееся воздействие загрязняющих факторов.',
      color: '#ef4444',
    };
  }
  if (faLow && chlHigh) {
    return {
      icon: '✅',
      text: 'Низкий ФА и высокий хлорофилл — чистая экологическая зона. Растение здорово, стресс-факторы отсутствуют или минимальны.',
      color: '#22c55e',
    };
  }
  return {
    icon: '📊',
    text: 'Умеренные показатели ФА и хлорофилла — средняя экологическая нагрузка. Рекомендуется повторить измерения через 2–4 недели.',
    color: '#84cc16',
  };
}

// =============================================
// MAP
// =============================================
let map, faMarkersLayer, chlMarkersLayer;
let currentLayer = 'all';

function getQualityStyle(score) {
  const s = {
    1: { color: '#22c55e', label: 'I — Норма', emoji: '🟢' },
    2: { color: '#84cc16', label: 'II — Начальные', emoji: '🟡' },
    3: { color: '#eab308', label: 'III — Средние', emoji: '🟠' },
    4: { color: '#f97316', label: 'IV — Существенные', emoji: '🔴' },
    5: { color: '#ef4444', label: 'V — Критические', emoji: '⛔' },
  };
  return s[score] || s[3];
}

function getChlColor(chl) {
  if (chl > 0.15) return { color: '#1a7a2e', label: 'Высокий' };
  if (chl > 0.05) return { color: '#a3c94a', label: 'Средний' };
  if (chl > -0.05) return { color: '#f0c040', label: 'Пониженный' };
  return { color: '#e05c2a', label: 'Низкий' };
}

function createCustomIcon(score, type = 'fa') {
  if (type === 'fa') {
    const st = getQualityStyle(score);
    const c = st.color;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 60" width="48" height="60">
      <defs>
        <filter id="faGlow"><feGaussianBlur stdDeviation="2" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <radialGradient id="faGrad" cx="30%" cy="30%"><stop offset="0%" stop-color="white" stop-opacity="0.4"/><stop offset="100%" stop-color="${c}" stop-opacity="0.9"/></radialGradient>
      </defs>
      <ellipse cx="24" cy="28" rx="18" ry="24" fill="url(#faGrad)" stroke="white" stroke-width="1.5" filter="url(#faGlow)"/>
      <text x="24" y="34" text-anchor="middle" fill="white" font-size="16" font-weight="700" font-family="sans-serif">${score}</text>
    </svg>`;
    return L.divIcon({ html: svg, className: '', iconSize: [48, 60], iconAnchor: [24, 60], popupAnchor: [0, -64] });
  } else {
    const st = getChlColor(score);
    const c = st.color;
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 44 50" width="44" height="50">
      <defs>
        <filter id="chlGlow"><feGaussianBlur stdDeviation="1.5" result="blur"/><feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
        <linearGradient id="chlGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="white" stop-opacity="0.5"/><stop offset="100%" stop-color="${c}" stop-opacity="0.95"/></linearGradient>
      </defs>
      <polygon points="22,2 42,14 42,36 22,48 2,36 2,14" fill="url(#chlGrad)" stroke="white" stroke-width="1.5" filter="url(#chlGlow)"/>
      <text x="22" y="30" text-anchor="middle" fill="white" font-size="12" font-weight="700" font-family="sans-serif">Хл</text>
    </svg>`;
    return L.divIcon({ html: svg, className: '', iconSize: [44, 50], iconAnchor: [22, 50], popupAnchor: [0, -54] });
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
    faMarker.bindPopup(
      `<div class="eco-popup-header" style="background:${st.color}">${st.emoji} ${st.label} <span style="opacity:0.7;font-size:11px;">Слой ФА</span></div>
      <div class="eco-popup-body">
        <strong>Растение</strong> ${pin.plant || '—'}<br>
        <strong>ФА</strong> ${pin.asymmetry !== undefined ? Number(pin.asymmetry).toFixed(4) : '—'}<br>
        <strong>Хлорофилл</strong> ${chlValue} (${chlSt.label})<br>
        <strong>Стресс</strong> ${stressValue}<br>
        <strong>Дата</strong> ${date}
      </div>`,
      { maxWidth: 280, className: 'eco-popup' }
    );
    faMarkersLayer.addLayer(faMarker);

    if (pin.chlIndex !== undefined) {
      const offset = 0.0005;
      const chlMarker = L.marker([pin.lat + offset, pin.lng + offset], { icon: createCustomIcon(pin.chlIndex, 'chl') });
      chlMarker.bindPopup(
        `<div class="eco-popup-header" style="background:${chlSt.color}">🌿 ${chlSt.label} <span style="opacity:0.7;font-size:11px;">Хлорофилл</span></div>
        <div class="eco-popup-body">
          <strong>Растение</strong> ${pin.plant || '—'}<br>
          <strong>ХлИ</strong> ${chlValue}<br>
          <strong>ФА балл</strong> ${st.emoji} ${st.label}<br>
          <strong>Стресс</strong> ${stressValue}<br>
          <strong>Дата</strong> ${date}
        </div>`,
        { maxWidth: 280, className: 'eco-popup' }
      );
      chlMarkersLayer.addLayer(chlMarker);
    }
  });
  applyLayerVisibility();
  updateComparison(pins);
  updateDynamicRecommendations(pins);

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
    if (!map.hasLayer(faMarkersLayer)) map.addLayer(faMarkersLayer);
    if (!map.hasLayer(chlMarkersLayer)) map.addLayer(chlMarkersLayer);
  } else if (currentLayer === 'fa') {
    if (!map.hasLayer(faMarkersLayer)) map.addLayer(faMarkersLayer);
    if (map.hasLayer(chlMarkersLayer)) map.removeLayer(chlMarkersLayer);
  } else {
    if (map.hasLayer(faMarkersLayer)) map.removeLayer(faMarkersLayer);
    if (!map.hasLayer(chlMarkersLayer)) map.addLayer(chlMarkersLayer);
  }
  updateLegendForLayer();
}

function updateLegendForLayer() {
  const chlElements = ['chlLegendDivider', 'chlLegendTitle', 'chlLeg1', 'chlLeg2', 'chlLeg3', 'chlLeg4'];
  const legendTitle = document.getElementById('legendTitle');
  if (currentLayer === 'fa') {
    if (legendTitle) legendTitle.textContent = 'Индекс ФА';
    chlElements.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = 'none';
    });
  } else if (currentLayer === 'chl') {
    if (legendTitle) legendTitle.textContent = 'Хлорофилл';
    chlElements.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = '';
    });
    const divider = document.getElementById('chlLegendDivider');
    if (divider) divider.style.display = 'none';
  } else {
    if (legendTitle) legendTitle.textContent = 'Индекс ФА / Стресс';
    chlElements.forEach(id => {
      const el = document.getElementById(id);
      if (el) el.style.display = '';
    });
  }
}

// Layer button handlers
document.querySelectorAll('.layer-btn').forEach(btn => {
  btn.addEventListener('click', function () {
    document.querySelectorAll('.layer-btn').forEach(b => {
      b.classList.remove('active');
      b.setAttribute('aria-checked', 'false');
    });
    this.classList.add('active');
    this.setAttribute('aria-checked', 'true');
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

async function fetchWithRetry(url, options, retries = MAX_RETRIES) {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, options);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (err) {
      if (i === retries) throw err;
      await new Promise(r => setTimeout(r, 1000 * (i + 1)));
    }
  }
}

async function loadSharedPins() {
  try {
    const res = await fetchWithRetry(`${JSONBIN_URL}/latest`, {
      headers: { 'X-Master-Key': JSONBIN_API_KEY },
    });
    const data = await res.json();
    const pins = data.record?.pins || [];
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(pins));
    renderPins(pins);
  } catch (err) {
    console.warn('JSONBin load failed, using local cache:', err.message);
    renderPins(JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]'));
  }
}

async function saveSharedPin(pin) {
  const local = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  local.push(pin);
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(local));
  renderPins(local);

  if (_isSaving) {
    showToast('Метка сохранена локально (синхронизация в процессе)', 'warning');
    return;
  }
  _isSaving = true;
  try {
    const getRes = await fetchWithRetry(`${JSONBIN_URL}/latest`, {
      headers: { 'X-Master-Key': JSONBIN_API_KEY },
    });
    const getData = await getRes.json();
    const remote = getData.record?.pins || [];
    const makeKey = p => `${p.lat}|${p.lng}|${p.date}`;
    const remoteKeys = new Set(remote.map(makeKey));
    const newPins = local.filter(p => !remoteKeys.has(makeKey(p)));
    const merged = [...remote, ...newPins];

    const putRes = await fetchWithRetry(JSONBIN_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Master-Key': JSONBIN_API_KEY,
      },
      body: JSON.stringify({ pins: merged }),
    });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
    renderPins(merged);
    showToast('Метка добавлена и синхронизирована! ✨', 'success');
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
    scrollWheelZoom: true,
  });

  const isDark = document.body.classList.contains('dark-theme');
  const lightTile = 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
  const darkTile = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
  const tileLayer = L.tileLayer(isDark ? darkTile : lightTile, {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OSM</a> © <a href="https://carto.com/">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  document.querySelectorAll('#themeToggle, #themeToggleMobile').forEach(el => {
    el.addEventListener('change', () => {
      const dark = el.checked;
      tileLayer.setUrl(dark ? darkTile : lightTile);
    });
  });

  L.control.zoom({ position: 'bottomright' }).addTo(map);
  faMarkersLayer = L.layerGroup().addTo(map);
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

  // Handle map clicks for adding pins
  map.on('click', function (e) {
    if (window._pendingPin) {
      const pin = { ...window._pendingPin, lat: e.latlng.lat, lng: e.latlng.lng };
      saveSharedPin(pin);
      window._pendingPin = null;
      showToast('Метка добавлена на карту! 📍', 'success');
    }
  });
}

const mapSection = document.getElementById('map');
if (mapSection) {
  new IntersectionObserver(
    entries => {
      if (entries[0].isIntersecting) {
        initMap();
      }
    },
    { threshold: 0.1 }
  ).observe(mapSection);
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
    if (pin.chlIndex !== undefined) groups[pin.plant].chl.push(Number(pin.chlIndex));
    if (pin.stressIndex !== undefined) groups[pin.plant].stress.push(Number(pin.stressIndex));
  });

  const species = Object.keys(groups);
  if (species.length === 0) {
    container.innerHTML = `<div class="comparison-empty"><span style="font-size:48px;">📊</span><p>Данных пока нет — добавьте результаты анализа на карту</p></div>`;
    return;
  }

  const avg = arr => (arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : null);
  const rows = species
    .map(sp => ({
      name: sp,
      avgFa: avg(groups[sp].fa),
      avgChl: avg(groups[sp].chl),
      avgStress: avg(groups[sp].stress),
      count: Math.max(groups[sp].fa.length, groups[sp].stress.length),
    }))
    .sort((a, b) => (a.avgStress || 0) - (b.avgStress || 0));

  let html = `<table class="comparison-table"><thead><tr><th>Вид</th><th>Ср. ФА</th><th>Ср. ХлИ</th><th>Стресс</th><th>Проб</th></tr></thead><tbody>`;
  rows.forEach(row => {
    const stressPct = row.avgStress !== null ? (row.avgStress * 100).toFixed(0) : '—';
    const stressColor =
      row.avgStress !== null
        ? row.avgStress < 0.3
          ? '#22c55e'
          : row.avgStress < 0.5
          ? '#eab308'
          : row.avgStress < 0.7
          ? '#f97316'
          : '#ef4444'
        : '#999';
    const barWidth = row.avgStress !== null ? (row.avgStress * 100).toFixed(1) : 0;
    html += `<tr>
      <td><strong>${row.name}</strong></td>
      <td style="font-family:monospace;">${row.avgFa !== null ? row.avgFa.toFixed(4) : '—'}</td>
      <td style="font-family:monospace;">${row.avgChl !== null ? row.avgChl.toFixed(3) : '—'}</td>
      <td>
        <span style="color:${stressColor};font-weight:700;">${stressPct}%</span>
        <div class="comparison-bar-wrap" style="margin-top:4px;"><div class="comparison-bar" style="width:${barWidth}%;background:${stressColor};"></div></div>
      </td>
      <td style="text-align:center;">${row.count}</td>
    </tr>`;
  });
  html += `</tbody></table>`;
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
    recs.push({ icon: '🏭', text: 'Высокий средний уровень стресса. Рекомендуется посадка газоустойчивых видов: Тополь Бальзамический, Ива Белая.' });
    recs.push({ icon: '⚠️', text: 'Не рекомендуется: Клён Остролистный, Берёза — чувствительны к загрязнению.' });
  } else if (avgStress > 0.35) {
    recs.push({ icon: '🌿', text: 'Умеренный уровень загрязнения. Подходят Липа Мелколистная и Ива Козья.' });
    recs.push({ icon: '🔍', text: 'Используйте Берёзу Повислую как биоиндикатор для мониторинга изменений.' });
  } else {
    recs.push({ icon: '✅', text: 'Экологическая ситуация благоприятная. Можно высаживать любые виды, включая Клён и Берёзу.' });
    recs.push({ icon: '✨', text: 'Для максимального биоразнообразия рекомендуются смешанные посадки всех видов.' });
  }

  if (avgChl !== null && avgChl < 0.02) {
    recs.push({ icon: '⚠️', text: 'Низкий хлорофилльный индекс указывает на острое загрязнение. Проверьте источники выбросов в радиусе 500 м.' });
  }

  content.innerHTML = recs.map(r => `<div class="dynamic-rec-item"><span style="font-size:20px;">${r.icon}</span><span>${r.text}</span></div>`).join('');
  block.classList.remove('hidden');
}

// =============================================
// MAP ACTION BUTTONS
// =============================================
document.getElementById('refreshMapBtn')?.addEventListener('click', () => {
  loadSharedPins();
  showToast('Данные карты обновлены 🔄', 'success');
});

document.getElementById('exportMapBtn')?.addEventListener('click', () => {
  const pins = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY) || '[]');
  const blob = new Blob([JSON.stringify(pins, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `ecoanalysis-export-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('Данные экспортированы 📥', 'success');
});

document.getElementById('importMapBtn')?.addEventListener('click', () => {
  document.getElementById('importFileInput')?.click();
});

document.getElementById('importFileInput')?.addEventListener('change', function () {
  const file = this.files[0];
  if (!file) return;
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const data = JSON.parse(e.target.result);
      if (Array.isArray(data)) {
        localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(data));
        renderPins(data);
        showToast(`Импортировано ${data.length} меток 📤`, 'success');
      } else {
        showToast('Неверный формат файла', 'error');
      }
    } catch {
      showToast('Ошибка чтения файла', 'error');
    }
  };
  reader.readAsText(file);
  this.value = '';
});

document.getElementById('clearLocalBtn')?.addEventListener('click', () => {
  if (confirm('Удалить все локально сохранённые метки? Это действие необратимо.')) {
    localStorage.removeItem(LOCAL_STORAGE_KEY);
    renderPins([]);
    showToast('Локальные данные очищены 🗑️', 'warning');
  }
});

// =============================================
// IMAGE ANALYSIS — FULL PIPELINE
// =============================================
const uploadZone = document.getElementById('uploadZone');
const fileInput = document.getElementById('fileInput');
const previewBox = document.getElementById('previewBox');
const previewImage = document.getElementById('previewImage');
const analyzeBtn = document.getElementById('analyzeBtn');
const changePhotoBtn = document.getElementById('changePhotoBtn');
const analysisProgress = document.getElementById('analysisProgress');
const resultCard = document.getElementById('resultCard');
const addToMapBtn = document.getElementById('addToMapBtn');
let currentImageData = null;
let currentAnalysisResult = null;

// Drag and drop
uploadZone?.addEventListener('dragover', e => {
  e.preventDefault();
  uploadZone.classList.add('drag-over');
});
uploadZone?.addEventListener('dragleave', () => {
  uploadZone.classList.remove('drag-over');
});
uploadZone?.addEventListener('drop', e => {
  e.preventDefault();
  uploadZone.classList.remove('drag-over');
  const file = e.dataTransfer.files[0];
  if (file && file.type.startsWith('image/')) {
    handleFile(file);
  }
});
uploadZone?.addEventListener('click', () => fileInput?.click());
uploadZone?.addEventListener('keydown', e => {
  if (e.key === 'Enter' || e.key === ' ') {
    e.preventDefault();
    fileInput?.click();
  }
});

fileInput?.addEventListener('change', function () {
  const file = this.files[0];
  if (file) handleFile(file);
});

function handleFile(file) {
  if (!file.type.startsWith('image/')) {
    showToast('Пожалуйста, выберите изображение', 'warning');
    return;
  }
  const reader = new FileReader();
  reader.onload = e => {
    previewImage.src = e.target.result;
    previewImage.alt = `Загруженный лист: ${file.name}`;
    uploadZone.classList.add('hidden');
    previewBox.classList.remove('hidden');
    resultCard.classList.add('hidden');
    analysisProgress.classList.add('hidden');
    currentImageData = null;
    currentAnalysisResult = null;
  };
  reader.readAsDataURL(file);
}

changePhotoBtn?.addEventListener('click', () => {
  uploadZone.classList.remove('hidden');
  previewBox.classList.add('hidden');
  resultCard.classList.add('hidden');
  analysisProgress.classList.add('hidden');
  currentImageData = null;
  currentAnalysisResult = null;
  fileInput.value = '';
});

analyzeBtn?.addEventListener('click', async () => {
  const plantSelect = document.getElementById('plantSelect');
  if (!plantSelect.value) {
    plantSelect.classList.add('shake');
    showToast('Выберите вид растения перед анализом 🌿', 'warning');
    setTimeout(() => plantSelect.classList.remove('shake'), 600);
    return;
  }
  if (!previewImage.complete || !previewImage.naturalWidth) {
    showToast('Изображение ещё загружается...', 'warning');
    return;
  }

  previewBox.classList.add('hidden');
  analysisProgress.classList.remove('hidden');
  resultCard.classList.add('hidden');

  const steps = document.querySelectorAll('.progress-step');
  steps.forEach(s => s.classList.remove('active', 'completed'));

  await simulateStep(0, 800);
  const imageData = getImagePixelData(previewImage);
  currentImageData = imageData;
  await simulateStep(1, 600);

  const calibration = calibrateLighting(imageData);
  await simulateStep(2, 700);

  const leafMask = segmentLeaf(imageData, calibration);
  await simulateStep(3, 600);

  const chlIndex = calculateChlorophyllIndex(imageData, leafMask, calibration);
  await simulateStep(4, 700);

  // Calculate FA (simplified demo)
  const fa = (0.035 + Math.random() * 0.03);
  await simulateStep(5, 800);

  // Finalize
  const stressIndex = calculateStressIndex(fa, chlIndex || 0);
  steps.forEach(s => s.classList.add('completed'));
  await new Promise(r => setTimeout(r, 400));

  analysisProgress.classList.add('hidden');
  displayResults(fa, chlIndex, stressIndex, plantSelect.value);
});

async function simulateStep(stepIndex, delay) {
  const steps = document.querySelectorAll('.progress-step');
  for (let i = 0; i <= stepIndex; i++) {
    if (steps[i]) steps[i].classList.add('active');
  }
  await new Promise(r => setTimeout(r, delay));
  for (let i = 0; i <= stepIndex; i++) {
    if (steps[i]) {
      steps[i].classList.remove('active');
      steps[i].classList.add('completed');
    }
  }
}

function displayResults(fa, chlIndex, stressIndex, plantKey) {
  const score = fa < 0.040 ? 1 : fa < 0.045 ? 2 : fa < 0.050 ? 3 : fa < 0.055 ? 4 : 5;
  const st = getQualityStyle(score);
  const chlSt = chlIndex !== null ? getChlColor(chlIndex) : { color: '#999', label: '—' };
  const diagnosis = generateDiagnosis(fa, chlIndex || 0, stressIndex);

  // Score header
  const resultScore = document.getElementById('resultScore');
  resultScore.className = `result-card__score quality-${score}`;
  document.getElementById('resultQualityEmoji').textContent = st.emoji;
  document.getElementById('resultQualityLabel').textContent = st.label;

  // Index values
  document.getElementById('faValue').textContent = fa.toFixed(4);
  document.getElementById('chlValue').textContent = chlIndex !== null ? chlIndex.toFixed(3) : '—';
  document.getElementById('stressValue').textContent = (stressIndex * 100).toFixed(0) + '%';

  // Bars
  const faBar = document.getElementById('faBar');
  faBar.style.width = (normalizeFA(fa) * 100).toFixed(1) + '%';
  faBar.style.background = st.color;
  document.getElementById('faInterp').textContent = st.label;
  document.getElementById('faInterp').style.color = st.color;

  const chlBar = document.getElementById('chlBar');
  const chlNorm = chlIndex !== null ? normalizeChl(chlIndex) : 0;
  chlBar.style.width = (chlNorm * 100).toFixed(1) + '%';
  chlBar.style.background = chlSt.color;
  document.getElementById('chlInterp').textContent = chlSt.label;
  document.getElementById('chlInterp').style.color = chlSt.color;

  const stressBar = document.getElementById('stressBar');
  stressBar.style.width = (stressIndex * 100).toFixed(1) + '%';
  stressBar.style.background = diagnosis.color;
  document.getElementById('stressInterp').textContent = stressIndex < 0.3 ? 'Низкий' : stressIndex < 0.5 ? 'Средний' : stressIndex < 0.7 ? 'Высокий' : 'Критический';
  document.getElementById('stressInterp').style.color = diagnosis.color;

  // Diagnosis
  const diagnosisBlock = document.getElementById('diagnosisBlock');
  diagnosisBlock.style.display = 'flex';
  diagnosisBlock.style.borderLeftColor = diagnosis.color;
  document.getElementById('diagnosisIcon').textContent = diagnosis.icon;
  document.getElementById('diagnosisText').textContent = diagnosis.text;

  // FA parameters table (demo data)
  const paramsBody = document.getElementById('paramsTableBody');
  const params = [
    { name: 'Ширина половинок листа', left: (12.4 + Math.random() * 2).toFixed(1), right: (12.6 + Math.random() * 2).toFixed(1) },
    { name: 'Длина 2-й жилки', left: (28.1 + Math.random() * 3).toFixed(1), right: (27.8 + Math.random() * 3).toFixed(1) },
    { name: 'Расст. между основаниями', left: (8.3 + Math.random()).toFixed(1), right: (8.5 + Math.random()).toFixed(1) },
    { name: 'Расст. между концами', left: (6.9 + Math.random()).toFixed(1), right: (7.2 + Math.random()).toFixed(1) },
    { name: 'Угол жилки', left: (42 + Math.random() * 5).toFixed(1) + '°', right: (43 + Math.random() * 5).toFixed(1) + '°' },
  ];
  let html = '';
  let asymSum = 0;
  params.forEach(p => {
    const leftNum = parseFloat(p.left);
    const rightNum = parseFloat(p.right);
    const asym = Math.abs(leftNum - rightNum) / ((leftNum + rightNum) / 2);
    asymSum += asym;
    html += `<tr>
      <td class="param-name">${p.name}</td>
      <td class="param-value">${p.left}</td>
      <td class="param-value">${p.right}</td>
      <td class="param-asym">${asym.toFixed(4)}</td>
    </tr>`;
  });
  const meanAsym = asymSum / params.length;
  html += `<tr class="param-mean-row">
    <td class="param-mean-label">Среднее</td>
    <td></td><td></td>
    <td class="param-mean-value">${meanAsym.toFixed(4)}</td>
  </tr>`;
  paramsBody.innerHTML = html;

  resultCard.classList.remove('hidden');
  resultCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  currentAnalysisResult = {
    plant: plantKey,
    asymmetry: meanAsym,
    chlIndex: chlIndex,
    stressIndex: stressIndex,
    score: score,
    date: new Date().toISOString(),
  };
}

addToMapBtn?.addEventListener('click', () => {
  if (!currentAnalysisResult) {
    showToast('Сначала выполните анализ листа 🔬', 'warning');
    return;
  }
  if (!map) {
    initMap();
  }
  showToast('Кликните на карту, чтобы поставить метку 📍', 'success');
  window._pendingPin = currentAnalysisResult;
});

// =============================================
// INITIALIZATION
// =============================================
populatePlantSelect();

// Migrate old localStorage key if exists
if (localStorage.getItem('ecoPins') && !localStorage.getItem(LOCAL_STORAGE_KEY)) {
  localStorage.setItem(LOCAL_STORAGE_KEY, localStorage.getItem('ecoPins'));
}

// =============================================
// END
// =============================================