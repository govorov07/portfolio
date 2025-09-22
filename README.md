knowledge-base/
├── 📁 assets/                          # Ресурсы
│   ├── 📁 fonts/                       # Шрифты
│   │   └── 📄 Atlassian-icons.ttf
│   ├── 📁 images/                      # Графические ресурсы
│   │   ├── 📁 diagrams/                # Изображения (диаграммы)
│   │   ├── 📁 icons/                   # Иконки
│   │   └── 📁 screenshots/             # Скриншоты
│   ├── 📁 scripts/                     # Скрипты
│   │   ├── 📁 tipuesearch/             # Плагин для поисковой системы
│   │   ├── 📄 app.js                   # JavaScript для сборки страниц
│   │   ├── 📄 jquery-3.2.1.min.js      # JavaScript-библиотека
│   │   └── 📄 split.min.js             # Утилита для создания разделяемых представлений с возможностью изменения размера
│   ├── 📁 styles/                      # Стили
│   │   ├── 📄 combined.css
│   │   ├── 📄 custom.css
│   │   └── 📄 inline_styles.css
│   └── 📁 templates/                   # HTML шаблоны
│       ├── 📁 components/              # Компоненты контента
│       │   ├── 📄 header.html
│       │   ├── 📄 note.html
│       │   ├── 📄 section.html
│       │   └── 📄 table.html
│       ├── 📄 base.html                # Базовый шаблон
│       ├── 📄 content.html             # Контент 
│       ├── 📄 navegation.html          # Навигация 
│       └── 📄 search.html              # Поиск 
├── 📁 data/
│   ├── 📄 structure.json               # Основная структура дерева
│   └── 📄 search-index.json            # Индекс для поиска
├── 📁 pages/                           # Все страницы базы знаний
│   ├── 📁 govorov/
│   │   ├── 📄 about_me.html
│   │   └── 📄 cv.html
│   ├── 📁 portofolio/
│   │   ├── 📁 api/
│   │   │   ├── 📄 getfilters.html
│   │   │   ├── 📄 postdays.html
│   │   │   └── 📄 postevents.html
│   │   ├── 📁 database/
│   │   │   ├── 📄 event_types_groups.html
│   │   │   ├── 📄 event_types.html
│   │   │   └── 📄 events_groups.html
│   │   ├── 📁 requirements/
│   │   │   └── 📄 rfilters.html
│   │   └── 📁 specifications/
│   │       └── 📄 sfilters.html
│   └── 📄 search.html                  # Страница результатов поиска
├── 📄 index.html                       # Главная страница с редиректом на страницу pages/govorov/about_me
└── 📄 README.md                        # Для репозитория GitHub