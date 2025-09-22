class PageBuilder {
    constructor() {
        this.templates = {};
        this.currentPage = null;
        this.templatesBasePath = 'assets/templates/'; // ✅ Правильный путь
        this.dataBasePath = 'data/'; // ✅ Путь к данным
        this.staticContent = document.getElementById('static-content');
        this.dynamicContent = document.getElementById('dynamic-content');
    }

    // Загрузка всех шаблонов
/**
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
**/
    async loadTemplates() {
        console.log('📁 Загружаем шаблоны...');
        
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

        for (const file of templateFiles) {
            try {
                const templateUrl = `${this.templatesBasePath}${file}`;
                console.log('📄 Загружаем шаблон:', templateUrl);
                
                const response = await fetch(templateUrl);
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status} - ${templateUrl}`);
                }
                
                this.templates[file] = await response.text();
                console.log('✅ Шаблон загружен:', file);
                
            } catch (error) {
                console.error(`❌ Ошибка загрузки шаблона ${file}:`, error);
                this.templates[file] = `<div class="error">Шаблон ${file} не загружен: ${error.message}</div>`;
            }
        }
    }

/** // Рендер шаблона с данными
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
*/
    // Простой рендерер без сложных конструкций
    renderTemplate(templateName, data = {}) {
        if (!this.templates[templateName]) {
            return `<div>Шаблон ${templateName} не найден</div>`;
        }

        let html = this.templates[templateName];
        
        // Замена простых переменных {{variable}}
        html = html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            // Для вложенных свойств типа page.title
            const value = this.getNestedValue(data, key);
            return value !== undefined ? value : '';
        });
        
        // Простая замена {{json data}}
        html = html.replace(/\{\{json (\w+)\}\}/g, (match, key) => {
            return JSON.stringify(data[key] || {});
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
            console.log('🏗️ Собираем страницу...');
            
            await this.loadTemplates();
            
            // Сначала просто попробуем отобразить базовый контент
            const contentHTML = this.renderTemplate('content.html', pageData);
            console.log('✅ Контент сгенерирован');
            
            const fullHTML = this.renderTemplate('base.html', {
                title: pageData.meta?.title || pageData.page?.title || 'Портфолио',
                content: contentHTML
            });
            
            console.log('✅ Полная страница сгенерирована');
            
            // Заменяем контент
            this.dynamicContent.innerHTML = fullHTML;
            this.staticContent.style.display = 'none';
            this.dynamicContent.style.display = 'block';
            
            console.log('✅ DOM обновлен');
            
            // Переинициализируем Split.js
            this.reinitializeScripts();
            
        } catch (error) {
            console.error('❌ Ошибка сборки страницы:', error);
            throw error;
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
        console.log('🔄 Переинициализация Split.js...');
        
        if (typeof Split !== 'undefined') {
            // Удаляем старый split если есть
            const sidebar = document.getElementById('sidebar');
            const content = document.getElementById('content');
            
            if (sidebar && content) {
                Split(['#sidebar', '#content'], {
                    sizes: [15, 85],
                    minSize: 100,
                    gutterSize: 8,
                    onDrag: function() {
                        console.log('📏 Размеры изменены');
                    }
                });
                console.log('✅ Split.js инициализирован');
            } else {
                console.error('❌ Элементы sidebar/content не найдены');
            }
        } else {
            console.error('❌ Split.js не загружен');
        }
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

    showLoading() {
        console.log('⏳ Показываем индикатор загрузки...');
    }
    
    // Показать ошибку
    showError(message) {
        console.error('💥 Показываем ошибку:', message);
        this.dynamicContent.innerHTML = `
            <div style="padding: 50px; text-align: center; color: #d00;">
                <h2>Ошибка</h2>
                <p>${message}</p>
                <button onclick="location.reload()">Перезагрузить</button>
            </div>
        `;
        this.staticContent.style.display = 'none';
        this.dynamicContent.style.display = 'block';
    }

    // Загрузка данных страницы
    async loadPage(pageId) {
        try {
            console.log('🚀 Начинаем загрузку страницы:', pageId);
            console.log(`Загрузка страницы: ${pageId}`);

            // Показываем загрузку
            this.showLoading();

            // Проверяем доступность данных
            const dataUrl = `${this.dataBasePath}pages/${pageId}.json`;
            console.log('📊 Загружаем данные из:', dataUrl);
            
            const response = await fetch(`${this.dataBasePath}pages/${pageId}.json`);
            if (!response.ok) throw new Error(`HTTP ${response.status} - ${dataUrl}`);
            
            const pageData = await response.json();
            console.log('✅ Данные загружены:', pageData);

            await this.buildPage(pageData);
            
            // Обновляем URL без перезагрузки
            window.history.pushState({ page: pageId }, '', `?page=${pageId}`);
            
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