/* *********************************************************
	Конфигурация путей для локальной и продакшен среды
********************************************************* */
const SITE_CONFIG = {
	// Определяем среду выполнения
	isLocal: window.location.hostname === '127.0.0.1' || 
			window.location.hostname === 'localhost' ||
			window.location.hostname === '0.0.0.0',
	
	// Базовые пути для разных сред
	basePath: null, // Инициализируем ниже
	rootPath: null
};

// Устанавливаем базовые пути в зависимости от среды
if (SITE_CONFIG.isLocal) {
	SITE_CONFIG.basePath = '/';
	SITE_CONFIG.rootPath = '/';
} else {
	SITE_CONFIG.basePath = '/portfolio/';
	SITE_CONFIG.rootPath = '/portfolio/';
}

/* *********************************************************
	Функция для получения абсолютного пути
********************************************************* */
	// @param {string} relativePath - Относительный путь
	// @returns {string} Абсолютный путь

function getAbsolutePath(relativePath) {
	// Убираем начальный слеш если есть
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

function getFullUrl(path) {
	return window.location.origin + getAbsolutePath(path);
}

// Для отладки
console.log('Site config loaded:', {
	environment: SITE_CONFIG.isLocal ? 'Local' : 'Production',
	basePath: SITE_CONFIG.basePath,
	currentHost: window.location.hostname
});