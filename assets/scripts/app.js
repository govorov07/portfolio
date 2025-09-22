class PageBuilder {
    constructor() {
        this.templates = {};
        this.currentPage = null;
    }

    // Загрузка всех шаблонов
    async loadTemplates() {
        const templateFiles = [
            'base.html', 'sidebar.html', 'search.html', 
            'navigation.html', 'content.html',
            'components/header.html', 'components/table.html',
            'components/note.html', 'components/section.html'
        ];

        for (const file of templateFiles) {
            try {
                const response = await fetch(`templates/${file}`);
                this.templates[file] = await response.text();
            } catch (error) {
                console.error(`Ошибка загрузки шаблона ${file}:`, error);
            }
        }
    }

    // Рендер шаблона с данными
    renderTemplate(templateName, data = {}) {
        let html = this.templates[templateName];
        
        // Простая система шаблонов с заменой {{переменных}}
        html = html.replace(/\{\{(\w+)\}\}/g, (match, key) => {
            return data[key] || '';
        });

        // Обработка частичных шаблонов {{> partial}}
        html = html.replace(/\{\{> (\S+)\}\}/g, (match, partialName) => {
            return this.templates[`${partialName}.html`] || '';
        });

        // Обработка блоков {{#each}}...{{/each}}
        html = html.replace(/\{\{#each (\w+)\}\}(.*?)\{\{\/each\}\}/gs, (match, arrayName, content) => {
            const array = data[arrayName] || [];
            return array.map(item => {
                return content.replace(/\{\{(\w+)\}\}/g, (m, key) => {
                    return item[key] || '';
                });
            }).join('');
        });

        return html;
    }

    // Сборка полной страницы
    async buildPage(pageData) {
        await this.loadTemplates();
        
        // Собираем сайдбар
        const sidebarHTML = this.renderTemplate('sidebar.html');
        
        // Собираем контент
        const contentHTML = this.renderTemplate('content.html', pageData);
        
        // Собираем базовую страницу
        const fullHTML = this.renderTemplate('base.html', {
            title: pageData.title,
            sidebar: sidebarHTML,
            content: contentHTML
        });

        document.write(fullHTML);
        document.close();
    }

    // Загрузка данных страницы
    async loadPage(pageId) {
        try {
            const response = await fetch(`data/pages/${pageId}.json`);
            const pageData = await response.json();
            this.buildPage(pageData);
        } catch (error) {
            console.error('Ошибка загрузки страницы:', error);
        }
    }
}

// 📊 Пример данных для страницы (`data/pages/main.json`)
const pageData = {
    title: "SSM - Soft Systems Methodology by Checkland",
    pageTitle: "SSM - Soft Systems Methodology by Checkland",
    sections: [
        {
            header: {
                anchor: "Bookmark2",
                number: "1",
                title: "Введение"
            },
            table: {
                rows: [
                    {
                        label: "Ответственный за тех.реализацию продукта",
                        content: `<p><a href="#">Сергей Бульдяев</a></p>`
                    },
                    {
                        label: "Ответственный за документ", 
                        content: `<p>Системный аналитик <a href="#">Рустам Алиев</a></p>`
                    },
                    {
                        label: "Тема",
                        content: "<p>Методология SSM (Soft Systems Methodology)</p>"
                    }
                ]
            }
        },
        {
            header: {
                anchor: "Bookmark4", 
                number: "2",
                title: "Общее описание"
            },
            paragraphs: [
                "<strong>SSM</strong> – структурированный и систематический подход к сложным и часто «неоднозначным» проблемам...",
                "Soft Systems Methodology состоит из следующих этапов:"
            ],
            table: {
                rows: [
                    {
                        label: "Введение в проблемную ситуацию",
                        content: "<p><em>Уясни суть проблемы</em></p><p>Нужно посмотреть на проблему и собрать информацию...</p>"
                    },
                    // ... остальные строки таблицы
                ]
            },
            note: {
                text: "Этапы не обязательно следуют в линейной последовательности, их можно пропускать, уточнять или повторять в зависимости от особенностей ситуации."
            }
        }
    ]
};

// 🚀 Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    const pageBuilder = new PageBuilder();
    
    // Определяем текущую страницу из URL
    const urlParams = new URLSearchParams(window.location.search);
    const pageId = urlParams.get('page') || 'main';
    
    pageBuilder.loadPage(pageId);
});