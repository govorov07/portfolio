async function loadSidebar() {
	try {
		const sidebarPath = '../assets/templates/sidebar.html';							// Используем относительный путь для шаблона
		const response = await fetch(sidebarPath);										// Загружаем шаблон сайдбара
		if (!response.ok) {																// Проверяем успешность ответа
			throw new Error(`HTTP error! status: ${response.status}`);					// Если ошибка, выбрасываем исключение
		}

		const sidebarHTML = await response.text();										// Получаем HTML шаблона сайдбара

		const tempDiv = document.createElement('div');									// Создаем временный контейнер для парсинга HTML
		tempDiv.innerHTML = sidebarHTML;												// Вставляем HTML в временный контейнер

		// Извлекаем элемент сайдбара из временного контейнера
		const sidebarToggle = tempDiv.querySelector('#sidebarToggle');
		const sidebarOverlay = tempDiv.querySelector('#sidebarOverlay');
		const sidebar = tempDiv.querySelector('#sidebar');
		const desktopSidebarToggle = tempDiv.querySelector('#desktopSidebarToggle');

		// Вставляем элементы в нужные контейнеры
		if (sidebarToggle) {															// Проверяем наличие элемента перед вставкой
			document.body.insertBefore(sidebarToggle, document.body.firstChild);		// Вставляем сайдбар в начало body
		}

		if (sidebarOverlay) {															// Проверяем наличие элемента перед вставкой
			if (sidebarToggle) {														// Если сайдбар вставлен, вставляем оверлей после него
				document.body.insertBefore(sidebarOverlay, sidebarToggle.nextSibling);	// Вставляем оверлей сразу после сайдбара
			} else {																	// Если сайдбар не вставлен, вставляем оверлей в начало body
				document.body.insertBefore(sidebarOverlay, document.body.firstChild);	// Вставляем оверлей в начало body
			}
		}

		const container = document.querySelector('.container');							// Находим контейнер для основного контента
		if (sidebar && container) {														// Проверяем наличие элементов перед вставкой
			container.insertBefore(sidebar, container.firstChild);						// Вставляем сайдбар в начало контейнера
		}

		const mainContent = document.querySelector('.main-content');					// Находим основной контент
		if (desktopSidebarToggle && mainContent) {										// Проверяем наличие элементов перед вставкой
			mainContent.insertBefore(desktopSidebarToggle, mainContent.firstChild);		// Вставляем десктопный переключатель в начало основного контента
		}

		setActivePage();																// Вызываем функцию для установки активной страницы
		initSidebar();																	// Вызываем функцию для инициализации сайдбара

		console.log('✅ Sidebar loaded successfully from:', sidebarPath);	
	} catch (error) {
		console.error('❌ Error loading sidebar:', error);
		return;
	}
}

// Автоматическое определение активной страницы
function setActivePage() {																// Функция для установки активной страницы в сайдбаре
	const currentPath = window.location.pathname;										// Получаем текущий путь страницы

	// Убираем активный класс у всех ссылок
	document.querySelectorAll('#sidebar .tree-link').forEach(link => {					// Проходим по всем ссылкам в сайдбаре
		link.classList.remove('active');												// Убираем класс 'active'
	});

	// Находим ссылку на текущую страницу и делаем её активной
	const links = document.querySelectorAll('.tree-link');								// Получаем все ссылки в сайдбаре
	let currentLink = null;																// Переменная для хранения текущей ссылки

	links.forEach(link => {																// Проходим по всем ссылкам
		try {																			// Обрабатываем возможные ошибки
			const linkPath = new URL(link.href, window.location.origin).pathname;		// Получаем путь ссылки

			// Сравниваем пути, учитывая возможные различия в слешах
			const normalizePath = (path) => path.replace(/\/+/g, '/').replace(/\/$/, '');	// Функция для нормализации пути

			if (normalizePath(linkPath) === normalizePath(currentPath)) {				// Сравниваем нормализованные пути
				currentLink = link;														// Если совпадают, сохраняем ссылку
				link.classList.add('active');											// Добавляем класс 'active' к текущей ссылке
			}
		} catch (e) {																	// Обработка ошибок при парсинге URL
			console.warn('Error processing link:', link.href, e);						// Выводим предупреждение в консоль	
		}
	});

	// Автоматически раскрываем родительские папки для активной страницы
	if (currentLink) {																	// Если найдена текущая ссылка
		let parentFolder = currentLink.closest('.tree-children');						// Находим ближайший родительский элемент с классом 'tree-children'
		while (parentFolder) {															// Пока есть родительский элемент
			parentFolder.classList.remove('collapsed');									// Убираем класс 'collapsed' для раскрытия папки
			const toggle = parentFolder.previousElementSibling?.querySelector('.tree-toggle');	// Находим переключатель папки
			if (toggle) {																// Если переключатель найден
				toggle.classList.remove('collapsed');									// Убираем класс 'collapsed' у переключателя
				toggle.textContent = '▼';												// Устанавливаем текст для раскрытого состояния
			}
			parentFolder = parentFolder.parentElement?.closest('.tree-children');		// Переходим к следующему родительскому элементу
		}
	}
}

// Инициализация функциональности сайдбара
function initSidebar() {																// Функция для инициализации функциональности сайдбара
	const sidebar = document.getElementById('sidebar');									// Находим элемент сайдбара
	const sidebarToggle = document.getElementById('sidebarToggle');						// Находим элемент переключателя сайдбара
	const desktopSidebarToggle = document.getElementById('desktopSidebarToggle');		// Находим элемент десктопного переключателя сайдбара
	const sidebarClose = document.getElementById('sidebarClose');						// Находим элемент закрытия сайдбара
	const sidebarOverlay = document.getElementById('sidebarOverlay');					// Находим элемент оверлея сайдбара
	const container = document.querySelector('.container');								// Находим контейнер основного контента
	const collapseAll = document.getElementById('collapseAll');							// Находим элемент "Свернуть все"

	// Создаём overlay для мобильного сайдбара, если его нет
	if (!sidebarOverlay && document.getElementById('sidebarOverlay') === null) {		// Проверяем наличие оверлея
		const overlay = document.createElement('div');									// Создаем новый div элемент
		overlay.id = 'sidebarOverlay';													// Устанавливаем id для оверлея
		overlay.className = 'sidebar-overlay';											// Устанавливаем класс для оверлея
		document.body.appendChild(overlay);												// Добавляем оверлей в тело документа
	}

	// Функция для открытия сайдбара
	function openSidebar() {
		if (sidebar) sidebar.classList.add('active');									// Добавляем класс 'active' к сайдбару
		if (document.getElementById('sidebarOverlay')) {								// Проверяем наличие оверлея
			document.getElementById('sidebarOverlay').classList.add('active');			// Добавляем класс 'active' к оверлею
		}
		document.body.style.overflow = 'hidden';										// Блокируем прокрутку страницы
	}

	// Функция для закрытия сайдбара
	function closeSidebar() {
		if (sidebar) sidebar.classList.remove('active');								// Убираем класс 'active' у сайдбара
		if (document.getElementById('sidebarOverlay')) {								// Проверяем наличие оверлея
			document.getElementById('sidebarOverlay').classList.remove('active');		// Убираем класс 'active' у оверлея
		}
		document.body.style.overflow = '';												// Восстанавливаем прокрутку страницы
	}

	// Функция для переключения состояния сайдбара
	function toggleSidebar() {
		if (window.innerWidth <= 768) {													// Проверяем ширину окна для мобильного устройства
			// На мобильных устройствах переключаем сайдбар
			if (sidebar && sidebar.classList.contains('active')) {						// Если сайдбар активен
				closeSidebar();															// Закрываем сайдбар
			} else {																	// Если сайдбар неактивен
				openSidebar();															// Открываем сайдбар
			}
		} else {
			// На десктопах просто переключаем класс активного состояния
			if (container) container.classList.toggle('collapsed');						// Переключаем класс 'collapsed' у контейнера
			if (sidebar) sidebar.classList.toggle('collapsed');							// Переключаем класс 'collapsed' у сайдбара
		}
	}

	// Обработчики событий для элементов управления сайдбаром
	if (sidebarToggle) {																// Проверяем наличие переключателя сайдбара
		sidebarToggle.addEventListener('click', toggleSidebar);							// Добавляем обработчик клика для переключения сайдбара
	}

	if (desktopSidebarToggle) {															// Проверяем наличие десктопного переключателя сайдбара
		desktopSidebarToggle.addEventListener('click', toggleSidebar);					// Добавляем обработчик клика для переключения сайдбара на десктопе
	}

	if (sidebarClose) {																	// Проверяем наличие элемента закрытия сайдбара
		sidebarClose.addEventListener('click', closeSidebar);							// Добавляем обработчик клика для закрытия сайдбара
	}

	if (document.getElementById('sidebarOverlay')) {									// Проверяем наличие оверлея сайдбара
		document.getElementById('sidebarOverlay').addEventListener('click', closeSidebar); // Добавляем обработчик клика для закрытия сайдбара при клике на оверлей
	}

	// Закрытие сайдбара при нажатии клавиши Escape
	document.addEventListener('keydown', function(e) {
		if (e.key === 'Escape') {														// Проверяем, была ли нажата клавиша Escape
			closeSidebar();																// Закрываем сайдбар
		}
	});

	// Управление сворачиванием/разворачиванием папок
	const treeToggles = document.querySelectorAll('.tree-toggle');						// Находим все элементы переключателей папок
	const treeFolders = document.querySelectorAll('.tree-folder');						// Находим все папки в дереве

	treeToggles.forEach(toggle => {														// Проходим по всем переключателям папок
		toggle.addEventListener('click', function(e) {									// Добавляем обработчик клика для каждого переключателя
			e.stopPropagation();														// Останавливаем всплытие события
			const children = this.closest('.tree-item').querySelector('.tree-children');	// Находим дочерние элементы папки
			if (children) {																// Если дочерние элементы найдены
				children.classList.toggle('collapsed');									// Переключаем класс 'collapsed' у дочерних элементов
				this.classList.toggle('collapsed');										// Переключаем класс 'collapsed' у переключателя
				// Обновляем текст переключателя в зависимости от состояния
				if (children.classList.contains('collapsed')) {							// Если папка свернута
					this.textContent = '▶';												// Устанавливаем текст для свернутого состояния
				} else {																// Если папка развернута
					this.textContent = '▼';												// Устанавливаем текст для развернутого состояния
				}
			}
		});
	});

	treeFolders.forEach(folder => {														// Проходим по всем папкам
		folder.addEventListener('click', function() {									// Добавляем обработчик клика для каждой папки
			const toggle = this.querySelector('.tree-toggle');							// Находим переключатель папки
			const children = this.closest('.tree-item').querySelector('.tree-children');// Находим дочерние элементы папки
			if (children && toggle) {													// Если дочерние элементы и переключатель найдены
				children.classList.toggle('collapsed');									// Переключаем класс 'collapsed' у дочерних элементов
				toggle.classList.toggle('collapsed');									// Переключаем класс 'collapsed' у переключателя
				// Обновляем текст переключателя в зависимости от состояния
				if (children.classList.contains('collapsed')) {							// Если папка свернута
					toggle.textContent = '▶';											// Устанавливаем текст для свернутого состояния
				} else {																// Если папка развернута
					toggle.textContent = '▼';											// Устанавливаем текст для развернутого состояния
				}
			}
		});
	});

	// Обработчик для кнопки "Свернуть все"
	if (collapseAll) {																	// Проверяем наличие кнопки "Свернуть все"
		collapseAll.addEventListener('click', function() {								// Добавляем обработчик клика для кнопки
			const allChildren = document.querySelectorAll('.tree-children');			// Находим все дочерние элементы папок
			const allToggles = document.querySelectorAll('.tree-toggle');				// Находим все переключатели папок

			allChildren.forEach(children => {											// Проходим по всем дочерним элементам
				children.classList.add('collapsed');									// Добавляем класс 'collapsed' для сворачивания папок
			});

			allToggles.forEach(toggle => {												// Проходим по всем переключателям
				toggle.classList.add('collapsed');										// Добавляем класс 'collapsed' для переключателей
				toggle.textContent = '▶';												// Устанавливаем текст для свернутого состояния
			});
		});
	}

	// Автоматическое закрытие сайдбара на мобильных устройствах при клике на ссылку
	const treeLinks = document.querySelectorAll('.tree-link');							// Находим все ссылки в дереве
	treeLinks.forEach(link => {															// Проходим по всем ссылкам
		link.addEventListener('click', function() {										// Добавляем обработчик клика для каждой ссылки
			if (window.innerWidth <= 768) {												// Проверяем ширину окна для мобильного устройства
				closeSidebar();															// Закрываем сайдбар
			}
		});
	});

	// Адаптация сайдбара при изменении размера окна
	window.addEventListener('resize', function() {										// Добавляем обработчик события изменения размера окна
		if (window.innerWidth > 768) {													// Если ширина окна больше 768px (десктоп)
			// Восстанавливаем прокрутку страницы и закрываем мобильный сайдбар
			closeSidebar();																// Закрываем сайдбар
			if (container) container.classList.remove('collapsed');						// Убираем класс 'collapsed' у контейнера
			if (sidebar) sidebar.classList.remove('collapsed');							// Убираем класс 'collapsed' у сайдбара
		}
	});
}

// Загружаем сайдбар при загрузке страницы
document.addEventListener('DOMContentLoaded', loadSidebar);								// Вызываем функцию загрузки сайдбара при загрузке DOMContentLoaded