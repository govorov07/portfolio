class NavigationManager {
    constructor() {
        this.currentPath = window.location.pathname;
        this.init();
    }

    init() {
        console.log('🧭 Инициализация навигации для:', this.currentPath);
        
        // Ждем полной загрузки DOM
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.processNavigation());
        } else {
            setTimeout(() => this.processNavigation(), 100);
        }
    }

    processNavigation() {
        const navigation = document.getElementById('navigation');
        if (!navigation) {
            console.warn('⚠️ Элемент навигации не найден');
            return;
        }

        this.highlightCurrentPage();
        this.setupNavigationEvents();
    }

    highlightCurrentPage() {
        const links = document.querySelectorAll('#navigation a');
        let activeLink = null;

        links.forEach(link => {
            const href = link.getAttribute('href');
            
            if (href === this.currentPath) {
                activeLink = link;
                this.makeLinkActive(link);
            }
        });

        if (activeLink) {
            this.expandToActiveLink(activeLink);
            this.scrollToActiveLink(activeLink);
        } else {
            console.log('📄 Текущая страница не найдена в навигации');
        }
    }

    makeLinkActive(link) {
        // Сохраняем оригинальный текст для возможности восстановления
        if (!link.dataset.originalText) {
            link.dataset.originalText = link.innerHTML;
        }

        // Добавляем индикатор текущей страницы
        link.innerHTML = `▶ ${link.dataset.originalText}`;
        
        // Стилизация
        link.classList.add('nav-active');
        link.style.pointerEvents = 'none';
        link.style.cursor = 'default';
        
        // Сохраняем href на случай если понадобится восстановить
        if (!link.dataset.originalHref) {
            link.dataset.originalHref = link.getAttribute('href');
        }
        link.removeAttribute('href');
    }

    expandToActiveLink(activeLink) {
        let parent = activeLink.closest('li');
        let depth = 0;

        while (parent && depth < 15) { // Защита от зацикливания
            const checkbox = parent.querySelector('input[type="checkbox"]');
            if (checkbox) {
                checkbox.checked = true;
                parent.classList.add('nav-expanded');
                
                // Добавляем анимацию
                const ul = parent.querySelector('ul');
                if (ul) {
                    ul.style.maxHeight = ul.scrollHeight + 'px';
                }
            }
            
            parent = parent.parentElement.closest('li');
            depth++;
        }
    }

    scrollToActiveLink(activeLink) {
        setTimeout(() => {
            try {
                activeLink.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center',
                    inline: 'nearest'
                });
            } catch (e) {
                // Fallback для старых браузеров
                activeLink.scrollIntoView(true);
            }
        }, 500);
    }

    setupNavigationEvents() {
        // Обработка кликов по категориям для анимации
        const checkboxes = document.querySelectorAll('#navigation input[type="checkbox"]');
        
        checkboxes.forEach(checkbox => {
            checkbox.addEventListener('change', function() {
                const ul = this.nextElementSibling;
                if (ul && ul.tagName === 'UL') {
                    if (this.checked) {
                        ul.style.maxHeight = ul.scrollHeight + 'px';
                    } else {
                        ul.style.maxHeight = '0';
                    }
                }
            });
        });

        // Плавная анимация для всех списков
        const uls = document.querySelectorAll('#navigation ul');
        uls.forEach(ul => {
            ul.style.transition = 'max-height 0.3s ease-in-out';
            ul.style.overflow = 'hidden';
            
            if (ul.querySelector('.nav-active')) {
                ul.style.maxHeight = ul.scrollHeight + 'px';
            } else {
                ul.style.maxHeight = '0';
            }
        });
    }
}

// Автоматическая инициализация при загрузке
if (typeof NavigationManager === 'undefined') {
    window.NavigationManager = NavigationManager;
}

// Инициализация когда DOM готов
function initNavigation() {
    try {
        new NavigationManager();
        console.log('✅ Навигация успешно инициализирована');
    } catch (error) {
        console.error('❌ Ошибка инициализации навигации:', error);
    }
}

// Разные способы инициализации в зависимости от готовности DOM
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initNavigation);
} else {
    setTimeout(initNavigation, 100);
}