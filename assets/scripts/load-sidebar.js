// Загрузка и вставка сайдбара
async function loadSidebar() {
	try {
		// Используем относительный путь для шаблона
		const response = await fetch('../templates/sidebar.html');

		if (!response.ok) {
			throw new Error(`HTTP error! status: ${response.status}`);
		}
		
		const sidebarHTML = await response.text();
		
		// Создаем временный контейнер для парсинга HTML
		const tempDiv = document.createElement('div');
		tempDiv.innerHTML = sidebarHTML;

		// Извлекаем отдельные элементы из шаблона
		const sidebarToggle = tempDiv.querySelector('#sidebarToggle');
		const sidebarOverlay = tempDiv.querySelector('#sidebarOverlay');
		const sidebar = tempDiv.querySelector('#sidebar');
		const desktopSidebarToggle = tempDiv.querySelector('#desktopSidebarToggle');

		// Вставляем элементы в нужные контейнеры
		if (sidebarToggle) {
			document.body.insertBefore(sidebarToggle, document.body.firstChild);
		}

		if (sidebarOverlay) {
			if (sidebarToggle) {
				document.body.insertBefore(sidebarOverlay, sidebarToggle.nextSibling);
			} else {
				document.body.insertBefore(sidebarOverlay, document.body.firstChild);
			}
		}

		const container = document.querySelector('.container');
		if (sidebar && container) {
			container.insertBefore(sidebar, container.firstChild);
		}

		const mainContent = document.querySelector('.main-content');
		if (desktopSidebarToggle && mainContent) {
			mainContent.insertBefore(desktopSidebarToggle, mainContent.firstChild);
		}
		
		// Обрабатываем ссылки с data-path атрибутами
		processSidebarLinks();
		
		// Автоматически определяем активную страницу
		setActivePage();
		
		// Инициализируем функциональность сайдбара
		initSidebar();

		console.log('✅ Sidebar loaded successfully from:', sidebarPath);
	} catch (error) {
		console.error('❌ Error loading sidebar:', error);
	}
}

// Обработка ссылок с data-path атрибутами
function processSidebarLinks() {
	const links = document.querySelectorAll('a[data-path]');
	
	links.forEach(link => {
		const relativePath = link.getAttribute('data-path');
		
		// Используем функцию из config.js или fallback
		if (typeof getAbsolutePath === 'function') {
			link.href = getAbsolutePath(relativePath);
		} else {
			// Fallback для случая, когда config.js не загружен
			console.warn('Config not loaded, using relative paths');
			// Простая логика для относительных путей (может потребовать доработки)
			link.href = relativePath;
		}
	});
}

// Автоматическое определение активной страницы
function setActivePage() {
	const currentPath = window.location.pathname;
	
	// Убираем активный класс у всех ссылок
	document.querySelectorAll('.tree-link').forEach(link => {
		link.classList.remove('active');
	});
	
	// Находим ссылку на текущую страницу и делаем её активной
	const links = document.querySelectorAll('.tree-link');
	let currentLink = null;
	
	links.forEach(link => {
		try {
			const linkPath = new URL(link.href, window.location.origin).pathname;
			
			// Сравниваем пути, учитывая возможные различия в слешах
			const normalizePath = (path) => path.replace(/\/+/g, '/').replace(/\/$/, '');
			
			if (normalizePath(linkPath) === normalizePath(currentPath)) {
				currentLink = link;
				link.classList.add('active');
			}
		} catch (e) {
			console.warn('Error processing link:', link.href, e);
		}
	});
	
	// Автоматически раскрываем родительские папки для активной страницы
	if (currentLink) {
		let parentFolder = currentLink.closest('.tree-children');
		while (parentFolder) {
			parentFolder.classList.remove('collapsed');
			const toggle = parentFolder.previousElementSibling?.querySelector('.tree-toggle');
			if (toggle) {
				toggle.classList.remove('collapsed');
				toggle.textContent = '▼'; // Раскрытое состояние
			}
			parentFolder = parentFolder.parentElement?.closest('.tree-children');
		}
	}
}

// Инициализация функциональности сайдбара
function initSidebar() {
	// Управление сайдбаром
	const sidebar = document.getElementById('sidebar');
	const sidebarToggle = document.getElementById('sidebarToggle');
	const desktopSidebarToggle = document.getElementById('desktopSidebarToggle');
	const sidebarClose = document.getElementById('sidebarClose');
	const sidebarOverlay = document.getElementById('sidebarOverlay');
	const container = document.querySelector('.container');
	const collapseAll = document.getElementById('collapseAll');

	// Создаем overlay если его нет
	if (!sidebarOverlay && document.getElementById('sidebarOverlay') === null) {
		const overlay = document.createElement('div');
		overlay.id = 'sidebarOverlay';
		overlay.className = 'sidebar-overlay';
		document.body.appendChild(overlay);
	}

	// Функции для управления сайдбаром
	function openSidebar() {
		if (sidebar) sidebar.classList.add('active');
		if (document.getElementById('sidebarOverlay')) {
			document.getElementById('sidebarOverlay').classList.add('active');
		}
		document.body.style.overflow = 'hidden';
	}

	function closeSidebar() {
		if (sidebar) sidebar.classList.remove('active');
		if (document.getElementById('sidebarOverlay')) {
			document.getElementById('sidebarOverlay').classList.remove('active');
		}
		document.body.style.overflow = '';
	}

	function toggleSidebar() {
		if (window.innerWidth <= 768) {
			// На мобильных - открываем/закрываем overlay
			if (sidebar && sidebar.classList.contains('active')) {
				closeSidebar();
			} else {
				openSidebar();
			}
		} else {
			// На десктопе - сворачиваем/разворачиваем
			if (container) container.classList.toggle('collapsed');
			if (sidebar) sidebar.classList.toggle('collapsed');
		}
	}

	// Обработчики событий
	if (sidebarToggle) {
		sidebarToggle.addEventListener('click', toggleSidebar);
	}

	if (desktopSidebarToggle) {
		desktopSidebarToggle.addEventListener('click', toggleSidebar);
	}

	if (sidebarClose) {
		sidebarClose.addEventListener('click', closeSidebar);
	}

	// Overlay обработчик
	const overlay = document.getElementById('sidebarOverlay');
	if (overlay) {
		overlay.addEventListener('click', closeSidebar);
	}

	// Закрытие сайдбара при нажатии ESC
	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape') {
			closeSidebar();
		}
	});

	// Управление сворачиванием папок
	const treeToggles = document.querySelectorAll('.tree-toggle');
	const treeFolders = document.querySelectorAll('.tree-folder');

	treeToggles.forEach((toggle) => {
		toggle.addEventListener('click', function(e) {
			e.stopPropagation();
			const children = this.closest('.tree-item').querySelector('.tree-children');
			if (children) {
				children.classList.toggle('collapsed');
				this.classList.toggle('collapsed');
				// Меняем иконку
				this.textContent = this.classList.contains('collapsed') ? '▶' : '▼';
			}
		});
	});

	treeFolders.forEach(folder => {
		folder.addEventListener('click', function() {
			const toggle = this.querySelector('.tree-toggle');
			const children = this.closest('.tree-item').querySelector('.tree-children');
			if (children && toggle) {
				children.classList.toggle('collapsed');
				toggle.classList.toggle('collapsed');
				toggle.textContent = toggle.classList.contains('collapsed') ? '▶' : '▼';
			}
		});
	});

	// Кнопка "Свернуть все"
	if (collapseAll) {
		collapseAll.addEventListener('click', function() {
			const allChildren = document.querySelectorAll('.tree-children');
			const allToggles = document.querySelectorAll('.tree-toggle');
			
			allChildren.forEach(children => {
				children.classList.add('collapsed');
			});
			
			allToggles.forEach(toggle => {
				toggle.classList.add('collapsed');
				toggle.textContent = '▶';
			});
		});
	}

	// Автоматическое закрытие сайдбара на мобильных при клике на ссылку
	const treeLinks = document.querySelectorAll('.tree-link');
	treeLinks.forEach(link => {
		link.addEventListener('click', function() {
			if (window.innerWidth <= 768) {
				closeSidebar();
			}
		});
	});

	// Адаптивное поведение при изменении размера окна
	window.addEventListener('resize', function() {
		if (window.innerWidth > 768) {
			// На десктопе - убираем overlay и восстанавливаем стандартное состояние
			closeSidebar();
			if (container) container.classList.remove('collapsed');
			if (sidebar) sidebar.classList.remove('collapsed');
		}
	});
}

// Загружаем сайдбар при загрузке страницы
document.addEventListener('DOMContentLoaded', loadSidebar);

// Делаем функции глобальными для использования в sidebar.html
window.processSidebarLinks = processSidebarLinks;
window.setActivePage = setActivePage;