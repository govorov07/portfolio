/* *********************************************************
	Конфигурация путей для локальной и продакшен среды
********************************************************* */
const SITE_CONFIG = {
    // Используем уже определенный базовый путь или определяем сами
    basePath: window.SITE_BASE_PATH || (function() {
        return (window.location.hostname === '127.0.0.1' || 
                window.location.hostname === 'localhost') ? 
                '/' : '/portfolio/';
    })(),
    
    // Для обратной совместимости
    isLocal: window.location.hostname === '127.0.0.1' || 
             window.location.hostname === 'localhost'
};

// Обновляем глобальную переменную для consistency
window.SITE_BASE_PATH = SITE_CONFIG.basePath;

/* *********************************************************
	Функция для получения абсолютного пути
********************************************************* */
	// @param {string} relativePath - Относительный путь
	// @returns {string} Абсолютный путь

function getAbsolutePath(relativePath) {
    const cleanPath = relativePath.startsWith('/') ? relativePath.slice(1) : relativePath;
    return SITE_CONFIG.basePath + cleanPath;
}

/* *********************************************************
 * Функция для получения пути к корневым ресурсам (из assets)
********************************************************* */
	// @param {string} assetPath - Путь к ресурсу
	// @returns {string} Абсолютный путь к ресурсу

function getAssetPath(assetPath) {
    const cleanPath = assetPath.startsWith('/') ? assetPath.slice(1) : assetPath;
    return SITE_CONFIG.basePath + 'assets/' + cleanPath;
}

/* *********************************************************
 * Функция для создания полного URL
********************************************************* */
	// @param {string} path - Относительный путь
	// @returns {string} Полный URL

function loadScript(scriptPath) {
    return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = getAssetPath(scriptPath);
        script.onload = resolve;
        script.onerror = reject;
        document.head.appendChild(script);
    });
}

// Для отладки
console.log('🚀 Site config loaded:', {
    environment: SITE_CONFIG.isLocal ? 'Local' : 'Production',
    basePath: SITE_CONFIG.basePath,
    currentURL: window.location.href
});