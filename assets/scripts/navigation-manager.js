class NavigationManager {
	constructor() {
		// Получаем идентификатор текущей страницы
		this.currentPageId = this.getCurrentPageId();

		// Инициализируем навигацию
		this.init();
	}

	/** ----------------------------------------------- **/
	/**	Определяем ID текущей страницы на основе URL	**/
	/** ----------------------------------------------- **/
	getCurrentPageId() {
		const currentPath = window.location.pathname;
		console.log('📍 Текущий путь:', currentPath);

		// Соответствие путей и идентификаторов страниц
		const pageMap = {
			// Страницы автора
			'/portfolio/pages/govorov/about.html': 'about',
			'/portfolio/pages/govorov/cv.html': 'cv',

			// Требования
			'/portfolio/pages/portofolio/requirements/rfilters.html': 'rfilters',

			// Спецификации
			'/portfolio/pages/portofolio/specifications/sfilters.html': 'sfilters',

			// База данных
			'/portfolio/pages/portofolio/database/events_groups.html': 'events_groups',
			'/portfolio/pages/portofolio/database/event_types.html': 'event_types',
			'/portfolio/pages/portofolio/database/event_types_groups.html': 'event_types_groups',

			// API
			'/portfolio/pages/portofolio/api/postevents.html': 'postevents',
			'/portfolio/pages/portofolio/api/getfilters.html': 'getfilters',
			'/portfolio/pages/portofolio/api/postdays.html': 'postdays'
		};

		const pageId = pageMap[currentPath];
		console.log('🎯 ID текущей страницы:', pageId);
		return pageId;
	}

	/** ----------------------------------------------- **/
	/**	Основная инициализация							**/
	/** ----------------------------------------------- **/
	init() {
		if (!this.currentPageId) {
			console.log('⚠️ Не удалось определить текущую страницу');
			return;
		}

		console.log('🚀 Инициализация навигации для страницы:', this.currentPageId);

		// Находим элемент текущей страницы
		const activePageElement = this.findActivePageElement();
		if (!activePageElement) {
			console.log('❌ Элемент страницы не найден:', this.currentPageId);
			return;
		}

		// Делаем ссылку неактивной
		this.deactivateLink(activePageElement);

		// Раскрываем дерево навигации
		this.expandNavigationTree(activePageElement);

		// Прокручиваем к активному элементу
		this.scrollToActiveElement(activePageElement);
	}

	/** ----------------------------------------------- **/
	/**	Находим элемент страницы по data-page атрибуту	**/
	/** ----------------------------------------------- **/
	findActivePageElement() {
		const selector = `[data-page="${this.currentPageId}"]`;
		const element = document.querySelector(selector);

		if (!element) {
			console.log('❌ Не найден элемент с селектором:', selector);

			// Попробуем найти по ссылке (fallback)
			const currentPath = window.location.pathname;
			const linkElement = document.querySelector(`a[href="${currentPath}"]`);
			if (linkElement) {
				console.log('✅ Найден элемент по ссылке');
				return linkElement.closest('li');
			}
		}

		return element;
	}

	/** ----------------------------------------------- **/
	/**	Делаем ссылку текущей страницы неактивной		**/
	/** ----------------------------------------------- **/
	deactivateLink(pageElement) {
		const link = pageElement.querySelector('a');
		if (!link) {
			console.log('❌ Ссылка не найдена в элементе');
			return;
		}

		console.log('🔗 Деактивируем ссылку:', link.href);

		// Добавляем класс для стилизации
		link.classList.add('nav-active');

		// Убираем href чтобы ссылка не была кликабельной
		link.removeAttribute('href');

		// Добавляем title для пояснения
		link.title = 'Текущая страница';

		// Оборачиваем в span для семантики
		const span = document.createElement('span');
		span.className = 'nav-current-page';
		span.innerHTML = link.innerHTML;
		link.parentNode.replaceChild(span, link);
	}

	/** ----------------------------------------------- **/
	/**	Раскрываем дерево навигации до текущей страницы	**/
	/** ----------------------------------------------- **/
	expandNavigationTree(activePageElement) {
		console.log('🌳 Раскрываем дерево навигации...');

		let currentElement = activePageElement;
		let depth = 0;

		// Поднимаемся вверх по дереву и раскрываем все родительские элементы
		while (currentElement && depth < 10) { // Защита от бесконечного цикла
			depth++;

			// Если это элемент списка (li)
			if (currentElement.tagName === 'LI') {
				console.log(`📂 Обрабатываем элемент уровня ${depth}:`, currentElement);

				// Находим чекбокс в этом элементе
				const checkbox = currentElement.querySelector('input[type="checkbox"]');
				if (checkbox) {
					console.log('✅ Найден чекбокс, раскрываем...');
					checkbox.checked = true;
					currentElement.classList.add('nav-expanded');
				}

				// Находим родительский UL и затем родительский LI
				const parentUl = currentElement.parentElement;
				if (parentUl && parentUl.tagName === 'UL') {
					currentElement = parentUl.parentElement;
				} else {
					currentElement = currentElement.parentElement;
				}
			} else {
				currentElement = currentElement.parentElement;
			}

			// Останавливаемся когда дошли до корневого элемента навигации
			if (!currentElement || currentElement.id === 'navigation') {
				console.log('🏁 Достигнут корень навигации');
				break;
			}
		}

		console.log(`✅ Дерево раскрыто на ${depth} уровней`);
	}

	/** ----------------------------------------------- **/
	/**	Прокручиваем навигацию к активному элементу		**/
	/** ----------------------------------------------- **/
	scrollToActiveElement(activePageElement) {
		setTimeout(() => {
			activePageElement.scrollIntoView({
				behavior: 'smooth',
				block: 'center',
				inline: 'nearest'
			});
		}, 300);
	}
}