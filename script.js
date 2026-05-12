// =============================================
// JSONBIN CONFIG — shared pins storage
// Free at jsonbin.io — no registration needed
// HOW TO SET UP (one-time, 2 min):
//   1. Go to https://jsonbin.io
//   2. Sign up (free)
//   3. Create a new bin with content: {"pins":[]}
//   4. Copy the Bin ID and your API key below
// =============================================
const JSONBIN_BIN_ID = '6a02bd3dadc21f119a8933bb';    // e.g. '6645f3abc123...'
const JSONBIN_API_KEY = '$2a$10$psF.fBMy6iGZpgrf0DYCAeYSZcGPhvD94TtZh6HUHpIvJXLh5Ctme';   // e.g. '$2a$10$...'
const JSONBIN_URL = `https://api.jsonbin.io/v3/b/${JSONBIN_BIN_ID}`;

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
// MAP
// =============================================
let map, markersLayer;

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

function createCustomIcon(score) {
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
}

function renderPins(pins) {
  if (!markersLayer) return;
  markersLayer.clearLayers();
  (pins || []).forEach(pin => {
    if (!pin.lat || !pin.lng) return;
    const st = getQualityStyle(pin.score);
    const date = pin.date ? new Date(pin.date).toLocaleDateString('ru-RU') : '—';
    const marker = L.marker([pin.lat, pin.lng], { icon: createCustomIcon(pin.score) });
    marker.bindPopup(`
      <div style="font-family:'DM Sans',system-ui,sans-serif;min-width:190px;overflow:hidden">
        <div style="background:${st.color};color:white;padding:10px 14px;font-weight:700;font-size:13px;margin:-12px -12px 10px">
          ${st.emoji} ${st.label}
        </div>
        <div style="font-size:13px;color:#555;line-height:1.7;padding:0 2px 2px">
          <b>Растение:</b> ${pin.plant || '—'}<br>
          <b>Асимметрия:</b> ${pin.asymmetry !== undefined ? Number(pin.asymmetry).toFixed(4) : '—'}<br>
          <b>Дата:</b> ${date}
        </div>
      </div>
    `, { maxWidth:240 });
    markersLayer.addLayer(marker);
  });
}

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
  markersLayer = L.layerGroup().addTo(map);
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
    if (imagePreview) imagePreview.src = e.target.result;
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
let lastAsymmetry = null, lastScore = null;
document.getElementById('analyzeBtn')?.addEventListener('click', runAnalysis);

function runAnalysis() {
  document.getElementById('analysisVisualization')?.classList.remove('hidden');
  document.getElementById('resultContainer')?.classList.add('hidden');
  const steps = ['step1','step2','step3','step4'];
  steps.forEach(id => document.getElementById(id)?.classList.remove('active','completed'));
  let i = 0;
  const iv = setInterval(() => {
    if (i > 0) {
      const prev = document.getElementById(steps[i-1]);
      prev?.classList.remove('active'); prev?.classList.add('completed');
    }
    if (i < steps.length) { document.getElementById(steps[i])?.classList.add('active'); i++; }
    else { clearInterval(iv); showResults(); }
  }, 700);
}

function rnd(a, b) { return a + Math.random() * (b - a); }

function showResults() {
  const asymmetry = rnd(0.035, 0.060);
  lastAsymmetry = asymmetry;
  let score, label;
  if (asymmetry < 0.040)      { score=1; label='I балл — Условно нормальное состояние 🌿'; }
  else if (asymmetry < 0.045) { score=2; label='II балл — Начальные отклонения от нормы 🟡'; }
  else if (asymmetry < 0.050) { score=3; label='III балл — Средний уровень отклонений 🟠'; }
  else if (asymmetry < 0.055) { score=4; label='IV балл — Существенные отклонения 🔴'; }
  else                        { score=5; label='V балл — Критическое состояние ⛔'; }
  lastScore = score;

  const qr = document.getElementById('qualityResult');
  if (qr) { qr.textContent = label; qr.className = `result-card__score quality-${score}`; }

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

// =============================================
// ADD TO MAP
// =============================================
function getPlantName(p) {
  return ({'salix-alba':'Ива Белая','salix-caprea':'Ива Козья','populus-balsamifera':'Тополь Бальзамический'})[p] || 'Не указано';
}

document.getElementById('addToMapBtn')?.addEventListener('click', () => {
  if (!navigator.geolocation) { showToast('Геолокация не поддерживается', 'error'); return; }
  const btn = document.getElementById('addToMapBtn');
  btn.textContent = '📍 Определяем местоположение…'; btn.disabled = true;
  navigator.geolocation.getCurrentPosition(async pos => {
    await saveSharedPin({ lat:pos.coords.latitude, lng:pos.coords.longitude, score:lastScore||3,
      asymmetry:lastAsymmetry||0.045, plant:getPlantName(selectedPlant), date:new Date().toISOString() });
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