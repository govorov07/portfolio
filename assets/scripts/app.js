class PageBuilder {
    constructor() {
        this.templates = {};
        this.currentPage = null;
        this.templatesBasePath = 'assets/templates/'; // ✅ Правильный путь
        this.dataBasePath = 'data/'; // ✅ Путь к данным
    }

    // Загрузка всех шаблонов
    async loadTemplates() {
        const templateFiles = [
            'base.html', 
            'sidebar.html', 
            'search.html', 
            'navigation.html', 
            'content.html',
            'components/header.html', 
            'components/table.html',
            'components/note.html', 
            'components/section.html'
        ];

        const loadPromises = templateFiles.map(async (file) => {
            try {
                const response = await fetch(`${this.templatesBasePath}${file}`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                this.templates[file] = await response.text();
            } catch (error) {
                console.error(`Ошибка загрузки шаблона ${file}:`, error);
                this.templates[file] = `<div class="error">Шаблон ${file} не загружен</div>`;
            }
        });

        await Promise.all(loadPromises);
    }

    // Рендер шаблона с данными
    renderTemplate(templateName, data = {}) {
        if (!this.templates[templateName]) {
            console.error(`Шаблон ${templateName} не найден`);
            return `<div class="error">Шаблон ${templateName} не найден</div>`;
        }

        let html = this.templates[templateName];
        
        // Обработка блоков {{#each}}...{{/each}} - ДОЛЖНА БЫТЬ ПЕРВОЙ
        html = html.replace(/\{\{#each (\w+)\}\}(.*?)\{\{\/each\}\}/gs, (match, arrayName, content) => {
            const array = data[arrayName] || [];
            if (!Array.isArray(array)) {
                console.warn(`{{#each ${arrayName}}} - не массив`);
                return '';
            }
            return array.map(item => {
                return content.replace(/\{\{([^{}]+)\}\}/g, (m, key) => {
                    return this.getNestedValue(item, key.trim()) || '';
                });
            }).join('');
        });

        // Обработка частичных шаблонов {{> partial}}
        html = html.replace(/\{\{> ([^{}]+)\}\}/g, (match, partialName) => {
            const templateKey = `${partialName.trim()}.html`;
            return this.templates[templateKey] || `<!-- Шаблон ${partialName} не найден -->`;
        });

        // Замена простых переменных {{variable}}
        html = html.replace(/\{\{([^{}]+)\}\}/g, (match, key) => {
            return this.getNestedValue(data, key.trim()) || '';
        });

        return html;
    }

    // Вспомогательная функция для получения вложенных свойств
    getNestedValue(obj, path) {
        return path.split('.').reduce((current, key) => {
            return current && current[key] !== undefined ? current[key] : '';
        }, obj);
    }

    // Сборка полной страницы
    async buildPage(pageData) {
        try {
            await this.loadTemplates();
            
            // Собираем компоненты
            const sidebarHTML = this.renderTemplate('sidebar.html', pageData);
            const contentHTML = this.renderTemplate('content.html', pageData);
            
            // Собираем базовую страницу
            const fullHTML = this.renderTemplate('base.html', {
                ...pageData,
                sidebar: sidebarHTML,
                content: contentHTML
            });

            // ✅ Безопасная замена контента
            this.replacePageContent(fullHTML);
            
        } catch (error) {
            console.error('Ошибка сборки страницы:', error);
            this.showError('Ошибка загрузки страницы');
        }
    }

    // Безопасная замена контента страницы
    replacePageContent(html) {
        document.documentElement.innerHTML = html;
        
        // Переинициализация скриптов после замены контента
        this.reinitializeScripts();
    }

    // Переинициализация скриптов
    reinitializeScripts() {
        // Инициализация Split.js
        if (typeof Split !== 'undefined') {
            Split(['#sidebar', '#content'], {
                sizes: [15, 85],
                minSize: 100
            });
        }

        // Инициализация обработчиков событий
        this.initializeEventHandlers();
    }

    // Инициализация обработчиков событий
    initializeEventHandlers() {
        // Обработка кликов по навигации
        document.addEventListener('click', (e) => {
            const link = e.target.closest('[data-page]');
            if (link) {
                e.preventDefault();
                const pageId = link.getAttribute('data-page');
                this.loadPage(pageId);
            }

            // Обработка раскрытия/сворачивания дерева
            if (e.target.type === 'checkbox') {
                const parentLi = e.target.closest('li');
                if (parentLi) {
                    parentLi.classList.toggle('expanded', e.target.checked);
                }
            }
        });
    }

    // Показать ошибку
    showError(message) {
        document.body.innerHTML = `
            <div style="padding: 20px; text-align: center; color: #d00;">
                <h2>Ошибка</h2>
                <p>${message}</p>
                <button onclick="location.reload()">Перезагрузить</button>
            </div>
        `;
    }

    // Загрузка данных страницы
    async loadPage(pageId) {
        try {
            console.log(`Загрузка страницы: ${pageId}`);
            
            const response = await fetch(`${this.dataBasePath}pages/${pageId}.json`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            const pageData = await response.json();
            await this.buildPage(pageData);
            
            // Обновляем URL без перезагрузки
            window.history.pushState({}, '', `?page=${pageId}`);
            
        } catch (error) {
            console.error('Ошибка загрузки страницы:', error);
            this.showError(`Страница "${pageId}" не найдена`);
        }
    }
}

// 🚀 Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const pageBuilder = new PageBuilder();
    
    // Обработка кнопок назад/вперед
    window.addEventListener('popstate', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const pageId = urlParams.get('page') || 'main';
        pageBuilder.loadPage(pageId);
    });
    
    // Определяем текущую страницу из URL
    const urlParams = new URLSearchParams(window.location.search);
    const pageId = urlParams.get('page') || 'main';
    
    pageBuilder.loadPage(pageId);
});

// Пример упрощенных данных для тестирования
const samplePageData = {
    title: "Говоров Андрей Сергеевич - Портфолио",
    pageTitle: "Обо мне",
    sections: [
        {
            header: {
                anchor: "about",
                number: "1",
                title: "Основная информация"
            },
            table: {
                rows: [
                    {
                        label: "Имя",
                        content: "<p>Андрей Говоров</p>"
                    },
                    {
                        label: "Специализация", 
                        content: "<p>Системный аналитик</p>"
                    }
                ]
            }
        }
    ]
};