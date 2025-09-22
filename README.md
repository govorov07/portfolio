knowledge-base/
├── 📄 index.html                       # Главная страница
├── 📁 pages/                           # Все страницы базы знаний
│   ├── 📁 getting-started/             # Раздел
│   │   ├── 📄 introduction.md          # Статья в Markdown
│   │   ├── 📄 installation.md
│   │   └── 📄 _meta.json               # Метаданные раздела
│   ├── 📁 api/
│   │   ├── 📁 endpoints/
│   │   │   ├── 📄 users.md
│   │   │   └── 📄 articles.md
│   │   └── 📄 _meta.json
│   ├── 📁 tutorials/
│   │   ├── 📄 first-steps.md
│   │   ├── 📄 advanced.md
│   │   └── 📄 _meta.json
│   └── 📄 _tree.json                   # Общая древовидная структура
├── 📁 assets/
│   ├── 📁 styles/
│   │   ├── 📄 combined.css
│   │   ├── 📄 custom.css
│   │   ├── 📄 inline_styles.css
│   │   └── 📄 markdown.css             # Стили для Markdown
│   ├── 📁 scripts/
│   │   ├── 📁 tipuesearch/             # Плагин для поисковой системы
│   │   ├── 📄 jquery-3.2.1.min.js      # JavaScript-библиотека
│   │   ├── 📄 split.min.js             # Утилита для создания разделяемых представлений с возможностью изменения размера
│   │   └── 📄 markdown-parser.js       # Парсер Markdown
│   ├── 📁 images/
│   │   ├── 📁 screenshots/
│   │   ├── 📁 diagrams/
│   │   └── 📁 icons/
│   └── 📁 templates/                   # HTML шаблоны
│       ├── 📄 page.html
│       ├── 📄 sidebar.html
│       └── 📄 breadcrumbs.html
├── 📁 data/
│   ├── 📄 structure.json               # Основная структура дерева
│   ├── 📄 search-index.json            # Индекс для поиска
│   └── 📁 content/                     # Альтернатива pages/
├── 📁 docs/                            # Документация проекта
└── 📄 config.json                      # Настройки базы знаний
