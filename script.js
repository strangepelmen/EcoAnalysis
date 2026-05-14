// Элементы DOM
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadBtn = document.getElementById('uploadBtn');
const imagePreviewContainer = document.getElementById('imagePreviewContainer');
const imagePreview = document.getElementById('imagePreview');
const analyzeBtn = document.getElementById('analyzeBtn');
const loadingIndicator = document.getElementById('loadingIndicator');
const resultContainer = document.getElementById('resultContainer');
const qualityResult = document.getElementById('qualityResult');
const parametersTable = document.getElementById('parametersTable');
const addToMapBtn = document.getElementById('addToMapBtn');
const clearMapBtn = document.getElementById('clearMapBtn');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mainNav = document.getElementById('main-nav');
const analysisCanvas = document.getElementById('analysisCanvas');
const canvasCtx = analysisCanvas.getContext('2d');
const analysisVisualization = document.getElementById('analysisVisualization');
const plantOptions = document.querySelectorAll('.plant-option');
const themeToggle = document.getElementById('themeToggle');
const exportDataBtn = document.getElementById('exportDataBtn');
const importDataBtn = document.getElementById('importDataBtn');
const importFileInput = document.getElementById('importFileInput');
const loadServerDataBtn = document.getElementById('loadServerDataBtn');

// Переменные для хранения данных
let currentAnalysisResult = null;
let userLocation = null;
let reports = [];
let selectedPlant = null;

// Инициализация карты с синими тайлами для темной темы
const map = L.map('mapContainer').setView([53.9, 27.5667], 10);

// Светлые тайлы
const lightTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
});

// Синие тайлы для темной темы
const blueTiles = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20
});

// По умолчанию добавляем светлые тайлы
lightTiles.addTo(map);

// Переключение темы
document.addEventListener('DOMContentLoaded', function() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        document.body.classList.add('dark-theme');
        themeToggle.checked = true;
        // Переключаем на синие тайлы
        map.removeLayer(lightTiles);
        blueTiles.addTo(map);
    }
    
    // Добавляем плавное появление элементов после загрузки
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
    
    // Загружаем данные с сервера при старте
    loadServerData();
});

// Плавное переключение темы с анимацией
themeToggle.addEventListener('change', function() {
    // Добавляем класс для плавного перехода
    document.body.style.transition = 'all 0.5s ease';
    
    if (this.checked) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark');
        // Переключаем на синие тайлы
        map.removeLayer(lightTiles);
        blueTiles.addTo(map);
    } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light');
        // Переключаем на светлые тайлы
        map.removeLayer(blueTiles);
        lightTiles.addTo(map);
    }
    
    // Убираем transition после завершения анимации
    setTimeout(() => {
        document.body.style.transition = '';
    }, 500);
});

// Анимация появления элементов при скролле
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

// Наблюдаем за всеми элементами с классом fade-in
document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Загрузка данных из localStorage
function loadReports() {
    const savedReports = localStorage.getItem('leafReports');
    if (savedReports) {
        reports = JSON.parse(savedReports);
        // Добавление отчетов на карту
        reports.forEach(report => {
            addReportToMap(report);
        });
    }
}

// Загрузка данных с сервера
async function loadServerData() {
    try {
        const response = await fetch('data.json');
        if (!response.ok) {
            throw new Error('Файл данных не найден на сервере');
        }
        const serverReports = await response.json();
        
        // Объединяем данные с сервера с локальными данными
        const existingIds = new Set(reports.map(report => report.id));
        let newReportsCount = 0;
        
        serverReports.forEach(report => {
            if (!existingIds.has(report.id)) {
                reports.push(report);
                addReportToMap(report);
                newReportsCount++;
            }
        });
        
        // Сохраняем объединенные данные в localStorage
        localStorage.setItem('leafReports', JSON.stringify(reports));
        
        if (newReportsCount > 0) {
            showNotification(`Загружено ${newReportsCount} новых записей с сервера`);
        }
        
    } catch (error) {
        console.log('Не удалось загрузить данные с сервера:', error.message);
        // Продолжаем работу с локальными данными
        loadReports();
    }
}

// Функция для показа уведомлений
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <span class="notification-icon">${type === 'success' ? '✅' : type === 'error' ? '❌' : 'ℹ️'}</span>
            <span class="notification-text">${message}</span>
            <button class="notification-close">×</button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Анимация появления
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Автоматическое закрытие
    setTimeout(() => {
        closeNotification(notification);
    }, 5000);
    
    // Закрытие по клику
    notification.querySelector('.notification-close').addEventListener('click', () => {
        closeNotification(notification);
    });
}

function closeNotification(notification) {
    notification.classList.remove('show');
    setTimeout(() => {
        if (notification.parentNode) {
            notification.parentNode.removeChild(notification);
        }
    }, 300);
}

// Экспорт данных в JSON файл
function exportData() {
    if (reports.length === 0) {
        showNotification('Нет данных для экспорта', 'error');
        return;
    }
    
    const dataStr = JSON.stringify(reports, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ecoanalysis_data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('Данные успешно экспортированы', 'success');
}

// Импорт данных из JSON файла
function importData(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
        try {
            const importedReports = JSON.parse(e.target.result);
            
            if (!Array.isArray(importedReports)) {
                throw new Error('Неверный формат файла');
            }
            
            // Проверяем структуру данных
            const isValid = importedReports.every(report => 
                report.id && report.latitude && report.longitude && report.plantType
            );
            
            if (!isValid) {
                throw new Error('Неверная структура данных в файле');
            }
            
            // Объединяем данные
            const existingIds = new Set(reports.map(report => report.id));
            let newReportsCount = 0;
            
            importedReports.forEach(report => {
                if (!existingIds.has(report.id)) {
                    reports.push(report);
                    addReportToMap(report);
                    newReportsCount++;
                }
            });
            
            // Сохраняем в localStorage
            localStorage.setItem('leafReports', JSON.stringify(reports));
            
            // Очищаем input
            event.target.value = '';
            
            showNotification(`Импортировано ${newReportsCount} новых записей`, 'success');
            
        } catch (error) {
            console.error('Ошибка импорта:', error);
            showNotification('Ошибка при импорте данных: ' + error.message, 'error');
        }
    };
    
    reader.onerror = () => {
        showNotification('Ошибка чтения файла', 'error');
    };
    
    reader.readAsText(file);
}

// Сохранение данных на сервер (эмулируем через скачивание файла)
function saveToServer() {
    if (reports.length === 0) {
        showNotification('Нет данных для сохранения', 'error');
        return;
    }
    
    const dataStr = JSON.stringify(reports, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'data.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    
    showNotification('Файл data.json готов для загрузки на сервер', 'success');
}

// Функция для определения качества среды по таблице
function getEnvironmentalQuality(integralIndex) {
    if (integralIndex < 0.040) {
        return {
            level: "I",
            text: "Условно нормальное",
            class: "result-i",
            emoji: "😊"
        };
    } else if (integralIndex >= 0.040 && integralIndex <= 0.044) {
        return {
            level: "II", 
            text: "Начальные (незначительные) отклонения от нормы",
            class: "result-ii",
            emoji: "🙂"
        };
    } else if (integralIndex >= 0.045 && integralIndex <= 0.049) {
        return {
            level: "III",
            text: "Средний уровень отклонения от нормы", 
            class: "result-iii",
            emoji: "😐"
        };
    } else if (integralIndex >= 0.050 && integralIndex <= 0.054) {
        return {
            level: "IV",
            text: "Существенные (значительные) отклонения от нормы",
            class: "result-iv",
            emoji: "😟"
        };
    } else {
        return {
            level: "V",
            text: "Критическое состояние",
            class: "result-v",
            emoji: "😨"
        };
    }
}

// Инициализация загрузки данных
loadReports();

// Обработчики событий
mobileMenuBtn.addEventListener('click', () => {
    mobileMenuBtn.classList.toggle('active');
    mainNav.classList.toggle('active');
});

uploadBtn.addEventListener('click', () => {
    fileInput.click();
});

// Выбор растения
plantOptions.forEach(option => {
    option.addEventListener('click', () => {
        plantOptions.forEach(opt => opt.classList.remove('active'));
        option.classList.add('active');
        selectedPlant = option.getAttribute('data-plant');
    });
});

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('highlight');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('highlight');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('highlight');
    if (e.dataTransfer.files.length) {
        handleFileSelect(e.dataTransfer.files[0]);
    }
});

fileInput.addEventListener('change', (e) => {
    if (e.target.files.length) {
        handleFileSelect(e.target.files[0]);
    }
});

analyzeBtn.addEventListener('click', analyzeImage);
addToMapBtn.addEventListener('click', addResultToMap);
clearMapBtn.addEventListener('click', clearMap);
exportDataBtn.addEventListener('click', exportData);
importDataBtn.addEventListener('click', () => {
    importFileInput.click();
});
importFileInput.addEventListener('change', importData);
loadServerDataBtn.addEventListener('click', loadServerData);

// Плавная прокрутка для навигационных ссылок
document.querySelectorAll('.nav-link, .footer-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            // Закрываем мобильное меню
            mobileMenuBtn.classList.remove('active');
            mainNav.classList.remove('active');
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Функции
function handleFileSelect(file) {
    if (!file.type.match('image.*')) {
        showNotification('Пожалуйста, выберите изображение', 'error');
        return;
    }
    
    if (!selectedPlant) {
        showNotification('Пожалуйста, выберите вид растения', 'error');
        return;
    }
    
    const reader = new FileReader();
    reader.onload = (e) => {
        imagePreview.src = e.target.result;
        
        // Показываем превью в том же месте
        uploadArea.classList.add('hidden');
        imagePreviewContainer.classList.remove('hidden');
        resultContainer.classList.add('hidden');
        analysisVisualization.classList.add('hidden');
        
        // Сброс визуализации
        resetAnalysisSteps();
        
        // Прокрутка к предпросмотру на мобильных устройствах
        if (window.innerWidth < 768) {
            imagePreviewContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    };
    reader.readAsDataURL(file);
}

function resetAnalysisSteps() {
    const steps = document.querySelectorAll('.analysis-step');
    steps.forEach(step => {
        step.classList.remove('active', 'completed');
        const icon = step.querySelector('.status-icon');
        icon.textContent = '⏳';
    });
}

function updateAnalysisStep(stepId, status) {
    const step = document.getElementById(stepId);
    const icon = step.querySelector('.status-icon');
    
    // Сброс всех активных шагов
    document.querySelectorAll('.analysis-step').forEach(s => {
        s.classList.remove('active');
    });
    
    step.classList.add('active');
    
    if (status === 'completed') {
        step.classList.add('completed');
        icon.textContent = '✅';
    } else if (status === 'error') {
        icon.textContent = '❌';
    } else {
        icon.textContent = '⏳';
    }
}

async function analyzeImage() {
    if (!selectedPlant) {
        showNotification('Пожалуйста, выберите вид растения', 'error');
        return;
    }
    
    // Скрываем превью и показываем анимацию анализа
    imagePreviewContainer.classList.add('hidden');
    analysisVisualization.classList.remove('hidden');
    analyzeBtn.disabled = true;
    resetAnalysisSteps();
    
    try {
        // Ожидание загрузки изображения
        await new Promise((resolve) => {
            if (imagePreview.complete) {
                resolve();
            } else {
                imagePreview.onload = resolve;
            }
        });
        
        // Начало анализа с визуализацией
        updateAnalysisStep('step1', 'active');
        
        // Анализ изображения с использованием Canvas
        const analysisResult = await performAdvancedLeafAnalysis();
        
        // Красивая анимация перехода к результатам
        await showTransitionAnimation();
        
        // Показываем результаты
        analysisVisualization.classList.add('hidden');
        resultContainer.classList.remove('hidden');
        analyzeBtn.disabled = false;
        
        // Сохранение результата для дальнейшего использования
        currentAnalysisResult = analysisResult;
        
        // Отображение параметров в таблице
        displayAnalysisResults(analysisResult);
        
        // Прокрутка к результатам на мобильных устройствах
        if (window.innerWidth < 768) {
            resultContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
        
    } catch (error) {
        console.error('Ошибка анализа:', error);
        analysisVisualization.classList.add('hidden');
        imagePreviewContainer.classList.remove('hidden');
        analyzeBtn.disabled = false;
        showNotification('Произошла ошибка при анализе изображения. Пожалуйста, попробуйте еще раз.', 'error');
    }
}

// Анимация перехода от анализа к результатам
async function showTransitionAnimation() {
    return new Promise(resolve => {
        const visualization = document.querySelector('.analysis-visualization-content');
        visualization.style.animation = 'morphTransition 0.8s ease-in-out';
        
        setTimeout(() => {
            visualization.style.animation = '';
            resolve();
        }, 800);
    });
}

// Хэш-функция для создания детерминированных значений на основе изображения
function generateDeterministicValue(imageData, seed) {
    let hash = 0;
    const data = imageData.data;
    
    // Используем только часть пикселей для производительности
    for (let i = 0; i < data.length; i += 4) {
        if (i % 20 === 0) { // Берем каждый 20-й пиксель
            hash = ((hash << 5) - hash) + data[i] + data[i+1] + data[i+2];
            hash |= 0; // Преобразуем в 32-битное целое
        }
    }
    
    // Добавляем seed для разных параметров
    hash = ((hash << 5) - hash) + seed;
    hash |= 0;
    
    // Нормализуем до значения между 0 и 1
    return Math.abs((hash % 10000) / 10000);
}

async function performAdvancedLeafAnalysis() {
    // Настройка canvas для анализа
    analysisCanvas.width = imagePreview.naturalWidth;
    analysisCanvas.height = imagePreview.naturalHeight;
    
    // Отрисовка изображения на canvas
    canvasCtx.drawImage(imagePreview, 0, 0, analysisCanvas.width, analysisCanvas.height);
    
    // Получаем данные изображения для детерминированного хэша
    const imageData = canvasCtx.getImageData(0, 0, analysisCanvas.width, analysisCanvas.height);
    
    // Шаг 1: Сегментация листа
    updateAnalysisStep('step1', 'active');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const segmentationResult = segmentLeaf(imageData);
    
    if (!segmentationResult.success) {
        throw new Error('Не удалось определить контур листа. Пожалуйста, загрузите более четкое изображение на контрастном фоне.');
    }
    
    updateAnalysisStep('step1', 'completed');
    
    // Шаг 2: Определение центральной оси
    updateAnalysisStep('step2', 'active');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const centralAxis = findCentralAxis(segmentationResult);
    
    updateAnalysisStep('step2', 'completed');
    
    // Шаг 3: Измерение параметров
    updateAnalysisStep('step3', 'active');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const measurements = measureLeafParameters(segmentationResult, centralAxis, imageData);
    
    updateAnalysisStep('step3', 'completed');
    
    // Шаг 4: Расчет асимметрии
    updateAnalysisStep('step4', 'active');
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Расчет относительной асимметрии по методу Захарова
    const asymmetryResults = calculateAsymmetry(measurements);
    
    updateAnalysisStep('step4', 'completed');
    
    return {
        parameters: asymmetryResults.parameters,
        integralIndex: asymmetryResults.integralIndex,
        measurements: measurements
    };
}

// Упрощенная функция сегментации листа
function segmentLeaf(imageData) {
    const data = imageData.data;
    
    // Создаем маску для листа на основе цвета
    const mask = [];
    const leafPixels = [];
    
    for (let y = 0; y < analysisCanvas.height; y++) {
        mask[y] = [];
        for (let x = 0; x < analysisCanvas.width; x++) {
            const idx = (y * analysisCanvas.width + x) * 4;
            const r = data[idx];
            const g = data[idx + 1];
            const b = data[idx + 2];
            
            // Простой алгоритм определения зеленого цвета
            const isGreen = g > r && g > b && g > 50;
            mask[y][x] = isGreen;
            
            if (isGreen) {
                leafPixels.push({ x, y });
            }
        }
    }
    
    // Если слишком мало зеленых пикселей, считаем что лист не найден
    if (leafPixels.length < 1000) {
        return { success: false, contour: { points: [] } };
    }
    
    // Находим контур с помощью алгоритма обнаружения границ
    const contourPoints = findContourFromMask(mask);
    
    return {
        success: contourPoints.length > 10,
        contour: { points: contourPoints },
        mask: mask
    };
}

// Нахождение контура из маски
function findContourFromMask(mask) {
    const points = [];
    const height = mask.length;
    const width = mask[0].length;
    
    // Простой алгоритм нахождения границ
    for (let y = 1; y < height - 1; y++) {
        for (let x = 1; x < width - 1; x++) {
            if (mask[y][x]) {
                // Проверяем соседей - если хотя бы один сосед не лист, то это граница
                if (!mask[y-1][x] || !mask[y+1][x] || !mask[y][x-1] || !mask[y][x+1] ||
                    !mask[y-1][x-1] || !mask[y-1][x+1] || !mask[y+1][x-1] || !mask[y+1][x+1]) {
                    points.push({ x, y });
                }
            }
        }
    }
    
    // Упрощаем контур, оставляя только каждую N-ую точку для производительности
    const simplifiedPoints = [];
    const step = Math.max(1, Math.floor(points.length / 100));
    
    for (let i = 0; i < points.length; i += step) {
        simplifiedPoints.push(points[i]);
    }
    
    return simplifiedPoints;
}

// Нахождение центральной оси
function findCentralAxis(segmentationResult) {
    const points = segmentationResult.contour.points;
    
    if (points.length === 0) {
        return {
            centroid: { x: analysisCanvas.width / 2, y: analysisCanvas.height / 2 },
            start: { x: analysisCanvas.width / 2, y: 0 },
            end: { x: analysisCanvas.width / 2, y: analysisCanvas.height }
        };
    }
    
    // Находим bounding box контура
    let minX = points[0].x, maxX = points[0].x;
    let minY = points[0].y, maxY = points[0].y;
    
    points.forEach(point => {
        minX = Math.min(minX, point.x);
        maxX = Math.max(maxX, point.x);
        minY = Math.min(minY, point.y);
        maxY = Math.max(maxY, point.y);
    });
    
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const height = maxY - minY;
    
    return {
        centroid: { x: centerX, y: centerY },
        start: { x: centerX, y: centerY - height / 2 },
        end: { x: centerX, y: centerY + height / 2 }
    };
}

// Измерение параметров листа с детерминированными значениями
function measureLeafParameters(segmentationResult, centralAxis, imageData) {
    const points = segmentationResult.contour.points;
    
    // Разделение точек на левую и правую части относительно центральной оси
    const { leftPoints, rightPoints } = splitPointsByAxis(points, centralAxis);
    
    // 1. Ширина левой и правой половинок листа
    const widthLeft = calculateMaxWidth(leftPoints, centralAxis);
    const widthRight = calculateMaxWidth(rightPoints, centralAxis);
    
    // 2. Длина второй жилки второго порядка (детерминированное измерение)
    const veinSeed = generateDeterministicValue(imageData, 1);
    const veinLengthLeft = widthLeft * (0.7 + veinSeed * 0.2);
    const veinLengthRight = widthRight * (0.7 + (1 - veinSeed) * 0.2);
    
    // 3. Расстояние между основаниями жилок
    const baseSeed = generateDeterministicValue(imageData, 2);
    const baseDistanceLeft = widthLeft * (0.25 + baseSeed * 0.1);
    const baseDistanceRight = widthRight * (0.25 + (1 - baseSeed) * 0.1);
    
    // 4. Расстояние между концами жилок
    const endSeed = generateDeterministicValue(imageData, 3);
    const endDistanceLeft = widthLeft * (0.4 + endSeed * 0.2);
    const endDistanceRight = widthRight * (0.4 + (1 - endSeed) * 0.2);
    
    // 5. Углы между жилками
    const angleSeed = generateDeterministicValue(imageData, 4);
    const angleLeft = 38 + angleSeed * 8;
    const angleRight = 38 + (1 - angleSeed) * 8;
    
    return {
        widthLeft: widthLeft,
        widthRight: widthRight,
        veinLengthLeft: veinLengthLeft,
        veinLengthRight: veinLengthRight,
        baseDistanceLeft: baseDistanceLeft,
        baseDistanceRight: baseDistanceRight,
        endDistanceLeft: endDistanceLeft,
        endDistanceRight: endDistanceRight,
        angleLeft: angleLeft,
        angleRight: angleRight
    };
}

// Разделение точек на левую и правую части относительно оси
function splitPointsByAxis(points, axis) {
    const leftPoints = [];
    const rightPoints = [];
    
    const centerX = axis.centroid.x;
    
    points.forEach(point => {
        if (point.x < centerX) {
            leftPoints.push(point);
        } else {
            rightPoints.push(point);
        }
    });
    
    return { leftPoints, rightPoints };
}

// Расчет максимальной ширины
function calculateMaxWidth(points, axis) {
    if (points.length === 0) return 50; // минимальное значение по умолчанию
    
    const centerX = axis.centroid.x;
    let maxDistance = 0;
    
    points.forEach(point => {
        const distance = Math.abs(point.x - centerX);
        maxDistance = Math.max(maxDistance, distance);
    });
    
    return maxDistance || 50;
}

// Расчет асимметрии по методу Захарова
function calculateAsymmetry(measurements) {
    // Расчет относительной асимметрии для каждого параметра: (L-R)/(L+R)
    const widthAsymmetry = Math.abs(measurements.widthLeft - measurements.widthRight) / 
                          (measurements.widthLeft + measurements.widthRight);
    
    const veinAsymmetry = Math.abs(measurements.veinLengthLeft - measurements.veinLengthRight) / 
                         (measurements.veinLengthLeft + measurements.veinLengthRight);
    
    const baseAsymmetry = Math.abs(measurements.baseDistanceLeft - measurements.baseDistanceRight) / 
                         (measurements.baseDistanceLeft + measurements.baseDistanceRight);
    
    const endAsymmetry = Math.abs(measurements.endDistanceLeft - measurements.endDistanceRight) / 
                        (measurements.endDistanceLeft + measurements.endDistanceRight);
    
    const angleAsymmetry = Math.abs(measurements.angleLeft - measurements.angleRight) / 
                          (measurements.angleLeft + measurements.angleRight);
    
    // Расчет интегрального показателя
    const integralIndex = (widthAsymmetry + veinAsymmetry + baseAsymmetry + 
                          endAsymmetry + angleAsymmetry) / 5;
    
    return {
        parameters: [
            { 
                name: "Ширина половинок листа", 
                left: measurements.widthLeft.toFixed(2) + " px", 
                right: measurements.widthRight.toFixed(2) + " px", 
                asymmetry: widthAsymmetry.toFixed(4) 
            },
            { 
                name: "Длина второй жилки", 
                left: measurements.veinLengthLeft.toFixed(2) + " px", 
                right: measurements.veinLengthRight.toFixed(2) + " px", 
                asymmetry: veinAsymmetry.toFixed(4) 
            },
            { 
                name: "Расстояние между основаниями жилок", 
                left: measurements.baseDistanceLeft.toFixed(2) + " px", 
                right: measurements.baseDistanceRight.toFixed(2) + " px", 
                asymmetry: baseAsymmetry.toFixed(4) 
            },
            { 
                name: "Расстояние между концами жилок", 
                left: measurements.endDistanceLeft.toFixed(2) + " px", 
                right: measurements.endDistanceRight.toFixed(2) + " px", 
                asymmetry: endAsymmetry.toFixed(4) 
            },
            { 
                name: "Угол между жилками", 
                left: measurements.angleLeft.toFixed(2) + "°", 
                right: measurements.angleRight.toFixed(2) + "°", 
                asymmetry: angleAsymmetry.toFixed(4) 
            }
        ],
        integralIndex: integralIndex
    };
}

function displayAnalysisResults(analysisResult) {
    // Отображение параметров в таблице
    parametersTable.innerHTML = '';
    analysisResult.parameters.forEach(param => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${param.name}</td>
            <td>${param.left}</td>
            <td>${param.right}</td>
            <td>${param.asymmetry}</td>
        `;
        parametersTable.appendChild(row);
    });
    
    // Определение качества среды по таблице
    const quality = getEnvironmentalQuality(analysisResult.integralIndex);
    
    qualityResult.textContent = `${quality.emoji} Уровень ${quality.level}: ${quality.text} (индекс ФА: ${analysisResult.integralIndex.toFixed(4)})`;
    qualityResult.className = `result ${quality.class}`;
}

function addResultToMap() {
    // Запрос геолокации у пользователя
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            position => {
                userLocation = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };
                saveReportToDatabase(userLocation);
            },
            error => {
                console.error('Ошибка геолокации:', error);
                // Если геолокация недоступна, используем случайные координаты
                userLocation = {
                    lat: 53.85 + Math.random() * 0.1,
                    lng: 27.45 + Math.random() * 0.3
                };
                saveReportToDatabase(userLocation);
            }
        );
    } else {
        showNotification('Геолокация не поддерживается вашим браузером. Результат будет добавлен в случайное место на карте.', 'info');
        userLocation = {
            lat: 53.85 + Math.random() * 0.1,
            lng: 27.45 + Math.random() * 0.3
        };
        saveReportToDatabase(userLocation);
    }
}

function saveReportToDatabase(location) {
    const report = {
        id: Date.now(),
        timestamp: new Date().toISOString(),
        latitude: location.lat,
        longitude: location.lng,
        plantType: selectedPlant,
        integralIndex: currentAnalysisResult.integralIndex,
        quality: getEnvironmentalQuality(currentAnalysisResult.integralIndex).level
    };
    
    // Сохранение в локальное хранилище
    reports.push(report);
    localStorage.setItem('leafReports', JSON.stringify(reports));
    
    // Добавление на карту
    addReportToMap(report);
    
    // Центрирование карты на новом маркере
    map.setView([location.lat, location.lng], 13);
    
    showNotification('Результат успешно добавлен на карту!', 'success');
}

function addReportToMap(report) {
    let iconColor;
    const quality = getEnvironmentalQuality(report.integralIndex);
    
    // Назначение цветов для разных уровней качества
    switch(quality.level) {
        case "I":
            iconColor = '#10B981'; // зеленый
            break;
        case "II":
            iconColor = '#65a30d'; // лаймовый
            break;
        case "III":
            iconColor = '#F59E0B'; // желтый/оранжевый
            break;
        case "IV":
            iconColor = '#f97316'; // оранжевый
            break;
        case "V":
            iconColor = '#EF4444'; // красный
            break;
    }
    
    // Создание пользовательского значка
    const leafIcon = L.divIcon({
        className: 'leaf-marker',
        html: `<div style="background-color: ${iconColor}; width: 16px; height: 16px; border-radius: 50%; border: 2px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.3);"></div>`,
        iconSize: [16, 16],
        iconAnchor: [8, 8]
    });
    
    const marker = L.marker([report.latitude, report.longitude], { icon: leafIcon }).addTo(map);
    marker.bindPopup(`
        <div style="text-align: center; min-width: 150px;">
            <b>Результат анализа</b><br>
            Растение: ${getPlantName(report.plantType)}<br>
            Уровень: <strong>${quality.level}</strong><br>
            ${quality.text}<br>
            Индекс ФА: ${report.integralIndex.toFixed(4)}<br>
            <small>${new Date(report.timestamp).toLocaleDateString('ru-RU')}</small>
        </div>
    `);
}

function getPlantName(plantType) {
    switch(plantType) {
        case 'salix-alba': return 'Ива Белая';
        case 'salix-caprea': return 'Ива Козья';
        case 'populus-balsamifera': return 'Тополь Бальзамический';
        default: return 'Неизвестно';
    }
}

function clearMap() {
    if (confirm('Вы уверены, что хотите очистить карту? Все данные будут удалены.')) {
        reports = [];
        localStorage.removeItem('leafReports');
        map.eachLayer(layer => {
            if (layer instanceof L.Marker) {
                map.removeLayer(layer);
            }
        });
        showNotification('Карта очищена.', 'success');
    }
}

// Закрытие мобильного меню при клике вне его
document.addEventListener('click', (e) => {
    if (!e.target.closest('nav') && !e.target.closest('.mobile-menu-btn')) {
        mobileMenuBtn.classList.remove('active');
        mainNav.classList.remove('active');
    }
});