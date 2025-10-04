# Стили для статусных чипов (СОГЛАСОВАНО/НА СОГЛАСОВАНИИ):
1. СОГЛАСОВАНО      -   .status-approved
2. НА СОГЛАСОВАНИИ  -   .status-pending

# Стили для Jira
## Стили для Jira issue
1. ОПУБЛИКОВАНО -   зеленый     -   .jira-status-published
2. В РАБОТЕ     -   синий       -   .jira-status-in-progress
3. ВЫПОЛНЕНО    -   зеленый     -   .jira-status-done
4. К ВЫПОЛНЕНИЮ -   серый       -   .jira-status-todo
5. НА РЕВЬЮ     -   оранжевый   -   .jira-status-review

## Дополнительные стили для статусов Jira (можно использовать для других задач)
Мини-версия для встраивания в текст:
- .jira-issue-mini
- .jira-issue-mini:hover
- .jira-issue-mini .jira-icon
- .jira-issue-mini .jira-status

# Ключевые особенности макросов Confluence
## Цветовое кодирование
- .confluence-macro.info    -   Информация      💡  -   синий       (#0052CC)
- .confluence-macro.warning -   Предупреждение  ⚠️  -   оранжевый   (#FF8B00)
- .confluence-macro.note    -   Примечание      📝  -   фиолетовый  (#6554C0)
- .confluence-macro.tip     -   Подсказка       🔧  -   зеленый     (#00875A)
- .confluence-macro.success -   Успех           xx  -   зеленый     (#00875A)
- .confluence-macro.error   -   Ошибка          xx  -   красный     (#DE350B)

## Дополнительные возможности
- Дополнительные типы (success, error)
- Поддержка кода внутри макросов
- Ссылки и форматирование текста
- Плавные анимации при взаимодействии