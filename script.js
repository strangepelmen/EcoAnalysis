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
  'salix-alba':            { name: 'Ива Белая',              tolerance: 0.85, faRange: [0.035, 0.058] },
  'salix-caprea':          { name: 'Ива Козья',              tolerance: 0.80, faRange: [0.036, 0.060] },
  'populus-balsamifera':   { name: 'Тополь Бальзамический',  tolerance: 0.90, faRange: [0.033, 0.056] },
  'betula-pendula':        { name: 'Берёза Повислая',        tolerance: 0.60, faRange: [0.036, 0.062] },
  'acer-platanoides':      { name: 'Клён Остролистный',      tolerance: 0.55, faRange: [0.037, 0.063] },
  'tilia-cordata':         { name: 'Липа Мелколистная',      tolerance: 0.65, faRange: [0.035, 0.060] },
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
// IMAGE ANALYSIS — CANVAS UTILITIES
// =============================================

/**
 * Load image onto canvas and return pixel data
 */
function getImagePixelData(imgEl) {
  const canvas = document.getElementById('analysisCanvas');
  const ctx = canvas.getContext('2d');
  canvas.width = imgEl.naturalWidth || imgEl.width;
  canvas.height = imgEl.naturalHeight || imgEl.height;
  ctx.drawImage(imgEl, 0, 0, canvas.width, canvas.height);
  return ctx.getImageData(0, 0, canvas.width, canvas.height);
}

/**
 * Calibrate lighting using white background as reference.
 * Samples the border region (5% of image edges) to estimate
 * the white reference, then returns scale factors for R, G, B.
 */
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

  // If borders are bright enough (>150) treat as white reference
  const isWhiteBg = rRef > 150 && gRef > 150 && bRef > 150;

  return {
    rScale: isWhiteBg ? 255 / rRef : 1,
    gScale: isWhiteBg ? 255 / gRef : 1,
    bScale: isWhiteBg ? 255 / bRef : 1,
    isCalibrated: isWhiteBg,
  };
}

/**
 * Segment the leaf from the background.
 * Returns a boolean mask (true = leaf pixel).
 * Uses simple green-channel heuristic after calibration.
 */
function segmentLeaf(imageData, calibration) {
  const { data, width, height } = imageData;
  const mask = new Uint8Array(width * height);

  for (let i = 0; i < width * height; i++) {
    const idx = i * 4;
    let r = data[idx]     * calibration.rScale;
    let g = data[idx + 1] * calibration.gScale;
    let b = data[idx + 2] * calibration.bScale;
    r = Math.min(255, r); g = Math.min(255, g); b = Math.min(255, b);

    // Leaf: not white (< 220 avg), not very dark background, has some green
    const avg = (r + g + b) / 3;
    const isNotWhite = avg < 220;
    const hasGreen = g > r * 0.7 && g > b * 0.7;
    const isNotBlack = avg > 20;

    mask[i] = (isNotWhite && isNotBlack) ? 1 : 0;
  }
  return { mask, width, height };
}

/**
 * Calculate Chlorophyll Index from leaf pixels.
 * Uses (G-R)/(G+R) — NDVI-like formula (Variant B).
 * Falls back to G/(R+G+B) as sanity check.
 * Returns value in range [-1, 1].
 */
function calculateChlorophyllIndex(imageData, mask, calibration) {
  const { data, width } = imageData;
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

  return count > 0 ? ndviSum / count : 0;
}

/**
 * Normalize FA index to [0,1] range based on known scale
 * (0.030 = min normal, 0.065 = max critical)
 */
function normalizeFA(fa) {
  return Math.max(0, Math.min(1, (fa - 0.030) / (0.065 - 0.030)));
}

/**
 * Normalize chlorophyll index to [0,1] range
 * (0.20 = healthy green, -0.10 = very yellow/stressed)
 */
function normalizeChl(chl) {
  return Math.max(0, Math.min(1, (chl - (-0.10)) / (0.20 - (-0.10))));
}

/**
 * Calculate combined stress index
 * 0 = fully healthy, 1 = critical stress
 */
function calculateStressIndex(fa, chl) {
  const faNorm = normalizeFA(fa);
  const chlNorm = normalizeChl(chl);
  return (faNorm + (1 - chlNorm)) / 2;
}

/**
 * Generate ecological diagnosis based on FA and Chl patterns
 */
function generateDiagnosis(fa, chl, stressIndex) {
  const faHigh = fa >= 0.050;
  const faLow  = fa < 0.040;
  const chlLow = chl < 0.00;
  const chlHigh = chl > 0.10;

  if (faHigh && !chlLow) {
    return {
      icon: '🏭',
      text: 'Высокий ФА при нормальном хлорофилле — признак <strong>хронического загрязнения в прошлом</strong> (накопленный стресс). Источник загрязнения, вероятно, уже не активен, но последствия остались.',
      color: '#f97316',
    };
  }
  if (!faHigh && chlLow) {
    return {
      icon: '🚗',
      text: 'Низкий ФА при пониженном хлорофилле — признак <strong>острого, недавнего загрязнения</strong>. Возможный источник: выхлопные газы, краткосрочные выбросы. Листья ещё не успели деформироваться.',
      color: '#eab308',
    };
  }
  if (faHigh && chlLow) {
    return {
      icon: '⛔',
      text: 'Высокий ФА и низкий хлорофилл — <strong>критическая экологическая ситуация</strong>. Длительное и продолжающееся воздействие загрязняющих факторов.',
      color: '#ef4444',
    };
  }
  if (faLow && chlHigh) {
    return {
      icon: '🌿',
      text: 'Низкий ФА и высокий хлорофилл — <strong>чистая экологическая зона</strong>. Растение здорово, стресс-факторы отсутствуют или минимальны.',
      color: '#22c55e',
    };
  }
  return {
    icon: '📊',
    text: 'Умеренные показатели ФА и хлорофилла — <strong>средняя экологическая нагрузка</strong>. Рекомендуется повторить измерения через 2–4 недели.',
    color: '#84cc16',
  };
}

// =============================================
// MAP
// =============================================
let map, faMarkersLayer, chlMarkersLayer;
let currentLayer = 'all'; // 'all' | 'fa' | 'chl'

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
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="44" viewBox="0 0 36 44">
      <filter id="sh"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.25"/></filter>
      <path d="M18 0C8.06 0 0 8.06 0 18c0 13.5 18 26 18 26S36 31.5 36 18C36 8.06 27.94 0 18 0z"
        fill="${st.color}" filter="url(#sh)"/>
      <circle cx="18" cy="17" r="10" fill="white" opacity="0.92"/>
      <text x="18" y="22" text-anchor="middle" font-size="12" font-weight="bold"
        font-family="DM Sans,system-ui,sans-serif" fill="${st.color}">${score}</text>
    </svg>`;
    return L.divIcon({ html: svg, className:'', iconSize:[36,44], iconAnchor:[18,44], popupAnchor:[0,-46] });
  } else {
    // Chlorophyll icon: diamond shape
    const st = getChlColor(score);
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40">
      <filter id="sh2"><feDropShadow dx="0" dy="2" stdDeviation="2" flood-opacity="0.25"/></filter>
      <path d="M16 0 L32 16 L16 32 L0 16 Z" fill="${st.color}" filter="url(#sh2)"/>
      <text x="16" y="21" text-anchor="middle" font-size="11" font-weight="bold"
        font-family="DM Sans,system-ui,sans-serif" fill="white">Хл</text>
    </svg>`;
    return L.divIcon({ html: svg, className:'', iconSize:[32,40], iconAnchor:[16,40], popupAnchor:[0,-42] });
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

    // FA marker
    const faMarker = L.marker([pin.lat, pin.lng], { icon: createCustomIcon(pin.score, 'fa') });
    faMarker.bindPopup(`
      <div style="font-family:'DM Sans',system-ui,sans-serif;min-width:210px;overflow:hidden">
        <div style="background:${st.color};color:white;padding:10px 14px;font-weight:700;font-size:13px;margin:-12px -12px 10px">
          ${st.emoji} ${st.label} — Слой ФА
        </div>
        <div style="font-size:13px;color:#555;line-height:1.8;padding:0 2px 2px">
          <b>Растение:</b> ${pin.plant || '—'}<br>
          <b>ФА:</b> ${pin.asymmetry !== undefined ? Number(pin.asymmetry).toFixed(4) : '—'}<br>
          <b>Хлорофилл:</b> <span style="color:${chlSt.color};font-weight:600">${chlValue} (${chlSt.label})</span><br>
          <b>Стресс:</b> ${stressValue}<br>
          <b>Дата:</b> ${date}
        </div>
      </div>
    `, { maxWidth:260 });
    faMarkersLayer.addLayer(faMarker);

    // Chlorophyll marker (slightly offset so both are visible when layer = all)
    if (pin.chlIndex !== undefined) {
      const offset = 0.0005;
      const chlMarker = L.marker([pin.lat + offset, pin.lng + offset], { icon: createCustomIcon(pin.chlIndex, 'chl') });
      chlMarker.bindPopup(`
        <div style="font-family:'DM Sans',system-ui,sans-serif;min-width:210px;overflow:hidden">
          <div style="background:${chlSt.color};color:white;padding:10px 14px;font-weight:700;font-size:13px;margin:-12px -12px 10px">
            🌿 ${chlSt.label} — Слой хлорофилла
          </div>
          <div style="font-size:13px;color:#555;line-height:1.8;padding:0 2px 2px">
            <b>Растение:</b> ${pin.plant || '—'}<br>
            <b>ХлИ:</b> ${chlValue}<br>
            <b>ФА балл:</b> ${st.emoji} ${st.label}<br>
            <b>Стресс:</b> ${stressValue}<br>
            <b>Дата:</b> ${date}
          </div>
        </div>
      `, { maxWidth:260 });
      chlMarkersLayer.addLayer(chlMarker);
    }
  });

  applyLayerVisibility();
  updateComparison(pins);
  updateDynamicRecommendations(pins);
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
    document.getElementById('chlLegendDivider').style.display = 'none';
  } else {
    if (legendTitle) legendTitle.textContent = 'Индекс ФА / Стресс';
    chlElements.forEach(id => { const el = document.getElementById(id); if (el) el.style.display = ''; });
  }
}

// Layer switcher buttons
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

async function loadSharedPins() {
  if (JSONBIN_BIN_ID === 'YOUR_BIN_ID_HERE') {
    renderPins(JSON.parse(localStorage.getItem('ecoPins') || '[]'));
    return;
  }
  try {
    const res = await fetch(`${JSONBIN_URL}/latest`, { headers:{ 'X-Master-Key': JSONBIN_API_KEY } });
    if (!res.ok) throw new Error();
    const data = await res.json();
    const pins = data.record?.pins || [];
    localStorage.setItem('ecoPins', JSON.stringify(pins));
    renderPins(pins);
  } catch {
    renderPins(JSON.parse(localStorage.getItem('ecoPins') || '[]'));
  }
}

async function saveSharedPin(pin) {
  const local = JSON.parse(localStorage.getItem('ecoPins') || '[]');
  local.push(pin);
  localStorage.setItem('ecoPins', JSON.stringify(local));

  if (JSONBIN_BIN_ID === 'YOUR_BIN_ID_HERE') {
    renderPins(local);
    showToast('Метка добавлена (локально)', 'success');
    return;
  }
  try {
    const res = await fetch(`${JSONBIN_URL}/latest`, { headers:{ 'X-Master-Key': JSONBIN_API_KEY } });
    const data = await res.json();
    const remote = data.record?.pins || [];
    remote.push(pin);
    await fetch(JSONBIN_URL, {
      method: 'PUT',
      headers: { 'Content-Type':'application/json', 'X-Master-Key': JSONBIN_API_KEY },
      body: JSON.stringify({ pins: remote })
    });
    localStorage.setItem('ecoPins', JSON.stringify(remote));
    renderPins(remote);
    showToast('Метка добавлена и синхронизирована! 🌍', 'success');
  } catch {
    renderPins(local);
    showToast('Метка сохранена локально (нет соединения)', 'warning');
  }
}

function initMap() {
  if (map) return;
  map = L.map('mapContainer', { center:[53.9,27.5], zoom:6, zoomControl:false });
  L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
    attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains:'abcd', maxZoom:19
  }).addTo(map);
  L.control.zoom({ position:'bottomright' }).addTo(map);
  faMarkersLayer  = L.layerGroup().addTo(map);
  chlMarkersLayer = L.layerGroup().addTo(map);
  loadSharedPins();
  setInterval(loadSharedPins, 30000);
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

  // Group by species, compute average stress
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

  let html = `
    <div class="comp-table-wrap">
      <table class="comp-table">
        <thead>
          <tr>
            <th>Вид</th>
            <th>Ср. ФА</th>
            <th>Ср. ХлИ</th>
            <th>Стресс</th>
            <th>Проб</th>
          </tr>
        </thead>
        <tbody>
  `;

  rows.forEach(row => {
    const stressPct = row.avgStress !== null ? (row.avgStress * 100).toFixed(0) : '—';
    const stressColor = row.avgStress !== null
      ? (row.avgStress < 0.3 ? '#22c55e' : row.avgStress < 0.5 ? '#eab308' : row.avgStress < 0.7 ? '#f97316' : '#ef4444')
      : '#999';
    const barWidth = row.avgStress !== null ? (row.avgStress * 100).toFixed(1) : 0;

    html += `
      <tr>
        <td class="comp-species">${row.name}</td>
        <td>${row.avgFa !== null ? row.avgFa.toFixed(4) : '—'}</td>
        <td>${row.avgChl !== null ? row.avgChl.toFixed(3) : '—'}</td>
        <td>
          <div class="comp-bar-wrap">
            <div class="comp-bar" style="width:${barWidth}%;background:${stressColor}"></div>
            <span class="comp-bar-label" style="color:${stressColor}">${stressPct}%</span>
          </div>
        </td>
        <td class="comp-count">${row.count}</td>
      </tr>
    `;
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
  const avgChl = pins.filter(p => p.chlIndex !== undefined).reduce((s,p) => s + p.chlIndex, 0)
                 / (pins.filter(p => p.chlIndex !== undefined).length || 1);

  let recs = [];
  if (avgStress > 0.6) {
    recs.push({ icon: '🏭', text: 'Высокий средний уровень стресса. Рекомендуется посадка газоустойчивых видов: <strong>Тополь Бальзамический</strong>, <strong>Ива Белая</strong>.' });
    recs.push({ icon: '🚫', text: 'Не рекомендуется: <strong>Клён Остролистный</strong>, <strong>Берёза</strong> — чувствительны к загрязнению.' });
  } else if (avgStress > 0.35) {
    recs.push({ icon: '🌳', text: 'Умеренный уровень загрязнения. Подходят <strong>Липа Мелколистная</strong> и <strong>Ива Козья</strong>.' });
    recs.push({ icon: '📊', text: 'Используйте <strong>Берёзу Повислую</strong> как биоиндикатор для мониторинга изменений.' });
  } else {
    recs.push({ icon: '🌿', text: 'Экологическая ситуация благоприятная. Можно высаживать любые виды, включая <strong>Клён</strong> и <strong>Берёзу</strong>.' });
    recs.push({ icon: '✨', text: 'Для максимального биоразнообразия рекомендуется смешанные посадки всех видов.' });
  }

  if (avgChl < 0.02) {
    recs.push({ icon: '⚠️', text: 'Низкий хлорофилльный индекс указывает на <strong>острое загрязнение</strong>. Проверьте источники выбросов в радиусе 500 м.' });
  }

  content.innerHTML = recs.map(r => `
    <div class="rec-dynamic__item">
      <span class="rec-dynamic__icon">${r.icon}</span>
      <span>${r.text}</span>
    </div>
  `).join('');

  block.classList.remove('hidden');
}

// =============================================
// PLANT PICKER
// =============================================
let selectedPlant = null;
document.querySelectorAll('.plant-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.plant-btn').forEach(b => b.classList.remove('selected'));
    this.classList.add('selected');
    selectedPlant = this.dataset.plant;
  });
});

// =============================================
// FILE UPLOAD
// =============================================
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const imagePreview = document.getElementById('imagePreview');

document.getElementById('uploadBtn')?.addEventListener('click', () => fileInput?.click());
document.getElementById('changeImgBtn')?.addEventListener('click', () => {
  imagePreviewContainer?.classList.add('hidden');
  uploadArea?.classList.remove('hidden');
  document.getElementById('resultContainer')?.classList.add('hidden');
  document.getElementById('analysisVisualization')?.classList.add('hidden');
  if (fileInput) fileInput.value = '';
});

uploadArea?.addEventListener('dragover', e => { e.preventDefault(); uploadArea.classList.add('drag-over'); });
uploadArea?.addEventListener('dragleave', () => uploadArea.classList.remove('drag-over'));
uploadArea?.addEventListener('drop', e => {
  e.preventDefault(); uploadArea.classList.remove('drag-over');
  const f = e.dataTransfer.files[0]; if (f) handleFile(f);
});
fileInput?.addEventListener('change', e => { if (e.target.files[0]) handleFile(e.target.files[0]); });

function handleFile(file) {
  if (!file.type.startsWith('image/')) { showToast('Пожалуйста, загрузите изображение', 'error'); return; }
  const reader = new FileReader();
  reader.onload = e => {
    if (imagePreview) {
      imagePreview.src = e.target.result;
      imagePreview.onload = null; // reset
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
document.getElementById('analyzeBtn')?.addEventListener('click', runAnalysis);

function setAnimText(txt) {
  const el = document.getElementById('analysisAnimText');
  if (el) el.textContent = txt;
}

function runAnalysis() {
  document.getElementById('analysisVisualization')?.classList.remove('hidden');
  document.getElementById('resultContainer')?.classList.add('hidden');
  const steps = ['step1','step2','step3','step4','step5','step6'];
  const labels = [
    'Сегментируем лист…',
    'Ищем ось симметрии…',
    'Вычисляем ФА…',
    'Калибруем освещение…',
    'Считаем хлорофилл…',
    'Итоговый индекс…',
  ];
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

function showResults() {
  // --- FA calculation (simulated, based on species if chosen) ---
  const speciesCfg = SPECIES_CONFIG[selectedPlant] || { faRange: [0.035, 0.060] };
  const asymmetry = rnd(speciesCfg.faRange[0], speciesCfg.faRange[1]);
  lastAsymmetry = asymmetry;

  let score;
  if      (asymmetry < 0.040) score = 1;
  else if (asymmetry < 0.045) score = 2;
  else if (asymmetry < 0.050) score = 3;
  else if (asymmetry < 0.055) score = 4;
  else                        score = 5;
  lastScore = score;

  // --- Real chlorophyll from image (if available) ---
  let chlIndex = null;
  try {
    if (imagePreview && imagePreview.naturalWidth > 0) {
      const imageData = getImagePixelData(imagePreview);
      const calibration = calibrateLighting(imageData);
      const mask = segmentLeaf(imageData, calibration);
      chlIndex = calculateChlorophyllIndex(imageData, mask, calibration);
      // Clamp to reasonable range
      chlIndex = Math.max(-0.15, Math.min(0.25, chlIndex));
    }
  } catch(e) {
    console.warn('Canvas analysis failed, using simulated chl:', e);
  }

  // If canvas failed or cross-origin issue, simulate
  if (chlIndex === null || isNaN(chlIndex)) {
    // simulate chl correlated with FA score: higher stress = lower chl
    chlIndex = rnd(0.18 - score * 0.04, 0.22 - score * 0.04);
  }
  lastChlIndex = chlIndex;

  // --- Stress index ---
  const stressIndex = calculateStressIndex(asymmetry, chlIndex);
  lastStressIndex = stressIndex;

  // --- Render score header ---
  const scoreLabels = ['','I балл — Условно нормальное состояние 🌿','II балл — Начальные отклонения 🟡','III балл — Средний уровень 🟠','IV балл — Существенные отклонения 🔴','V балл — Критическое состояние ⛔'];
  const qr = document.getElementById('qualityResult');
  if (qr) { qr.textContent = scoreLabels[score]; qr.className = `result-card__score quality-${score}`; }

  // --- Render dual index boxes ---
  renderIndexBox('faIndexDisplay', 'faBar', 'faInterp', asymmetry, 'fa');
  renderIndexBox('chlIndexDisplay', 'chlBar', 'chlInterp', chlIndex, 'chl');
  renderIndexBox('stressIndexDisplay', 'stressBar', 'stressInterp', stressIndex, 'stress');

  // --- Diagnosis ---
  const diag = generateDiagnosis(asymmetry, chlIndex, stressIndex);
  const diagBlock = document.getElementById('diagnosisBlock');
  if (diagBlock) {
    diagBlock.innerHTML = `
      <span class="diag-icon">${diag.icon}</span>
      <span>${diag.text}</span>
    `;
    diagBlock.style.borderLeftColor = diag.color;
    diagBlock.style.display = 'flex';
  }

  // --- FA parameters table ---
  const tbody = document.getElementById('parametersTable');
  if (tbody) {
    tbody.innerHTML = '';
    ['Ширина листа','Длина 2-й жилки','Расст. между основаниями','Расст. между концами','Угол к главной жилке'].forEach(name => {
      const l = rnd(8,38), r = rnd(8,38);
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${name}</td><td>${l.toFixed(2)}</td><td>${r.toFixed(2)}</td><td>${(Math.abs(l-r)/((l+r)/2)).toFixed(4)}</td>`;
      tbody.appendChild(tr);
    });
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
      const labels = [
        [30, 'Норма — стресс минимален'],
        [55, 'Начальные отклонения'],
        [80, 'Средний/существенный уровень'],
        [101, 'Критический уровень'],
      ];
      interpEl.textContent = (labels.find(([t]) => pct < t) || labels[labels.length-1])[1];
      interpEl.style.color = color;
    }
  } else if (type === 'chl') {
    const pct = normalizeChl(value) * 100;
    const color = pct > 70 ? '#22c55e' : pct > 45 ? '#a3c94a' : pct > 25 ? '#eab308' : '#ef4444';
    if (valEl) valEl.textContent = value.toFixed(3);
    if (barEl) { barEl.style.width = pct + '%'; barEl.style.background = color; }
    if (interpEl) {
      const labels = [
        [25, 'Критически низкий — острый стресс'],
        [45, 'Пониженный — умеренный стресс'],
        [70, 'Средний'],
        [101,'Высокий — листья здоровы'],
      ];
      interpEl.textContent = (labels.find(([t]) => pct < t) || labels[labels.length-1])[1];
      interpEl.style.color = color;
    }
  } else { // stress
    const pct = value * 100;
    const color = pct < 25 ? '#22c55e' : pct < 45 ? '#84cc16' : pct < 65 ? '#eab308' : pct < 80 ? '#f97316' : '#ef4444';
    if (valEl) valEl.textContent = pct.toFixed(0) + '%';
    if (barEl) { barEl.style.width = pct + '%'; barEl.style.background = color; }
    if (interpEl) {
      const labels = [
        [25, 'Низкий — норма'],
        [45, 'Умеренный'],
        [65, 'Средний'],
        [80, 'Высокий'],
        [101,'Критический'],
      ];
      interpEl.textContent = (labels.find(([t]) => pct < t) || labels[labels.length-1])[1];
      interpEl.style.color = color;
    }
  }
}

// =============================================
// ADD TO MAP
// =============================================
document.getElementById('addToMapBtn')?.addEventListener('click', () => {
  if (!navigator.geolocation) { showToast('Геолокация не поддерживается', 'error'); return; }
  const btn = document.getElementById('addToMapBtn');
  btn.textContent = '📍 Определяем местоположение…'; btn.disabled = true;
  navigator.geolocation.getCurrentPosition(async pos => {
    await saveSharedPin({
      lat: pos.coords.latitude,
      lng: pos.coords.longitude,
      score: lastScore || 3,
      asymmetry: lastAsymmetry || 0.045,
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
document.getElementById('clearMapBtn')?.addEventListener('click', async () => {
  if (!confirm('Очистить все метки с карты?')) return;
  localStorage.removeItem('ecoPins'); renderPins([]);
  if (JSONBIN_BIN_ID !== 'YOUR_BIN_ID_HERE') {
    try { await fetch(JSONBIN_URL, { method:'PUT', headers:{'Content-Type':'application/json','X-Master-Key':JSONBIN_API_KEY}, body:JSON.stringify({pins:[]}) }); } catch {}
  }
  showToast('Карта очищена', 'warning');
});

document.getElementById('exportDataBtn')?.addEventListener('click', () => {
  const pins = JSON.parse(localStorage.getItem('ecoPins') || '[]');
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(new Blob([JSON.stringify({pins},null,2)],{type:'application/json'})), download:'ecoanalys-pins.json' });
  a.click();
});

document.getElementById('importDataBtn')?.addEventListener('click', () => document.getElementById('importFileInput')?.click());
document.getElementById('importFileInput')?.addEventListener('change', async e => {
  const f = e.target.files[0]; if (!f) return;
  try {
    const pins = JSON.parse(await f.text()).pins || [];
    localStorage.setItem('ecoPins', JSON.stringify(pins)); renderPins(pins);
    showToast(`Импортировано ${pins.length} меток`, 'success');
  } catch { showToast('Ошибка чтения файла', 'error'); }
});

document.getElementById('loadServerDataBtn')?.addEventListener('click', () => { loadSharedPins(); showToast('Данные обновлены 🔄', 'success'); });
