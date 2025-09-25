// navigation-manager.js - простой и рабочий вариант
class NavigationManager {
    constructor() {
        console.log('🚀 NavigationManager создан');
        this.currentPath = window.location.pathname;
        this.init();
    }

    init() {
        console.log('📍 Текущий путь:', this.currentPath);
        console.log('🔍 Ищем навигацию...');
        
        const nav = document.getElementById('navigation');
        if (!nav) {
            console.error('❌ Навигация не найдена!');
            return;
        }
        
        console.log('✅ Навигация найдена');
        this.highlightCurrentPage();
    }

    highlightCurrentPage() {
        const links = document.querySelectorAll('#navigation a');
        console.log('🔗 Найдено ссылок:', links.length);
        
        let activeLinkFound = false;
        
        links.forEach(link => {
            console.log('Проверяем ссылку:', link.href);
            
            if (link.getAttribute('href') === this.currentPath) {
                console.log('✅ Найдена активная страница!');
                activeLinkFound = true;
                
                // Делаем ссылку неактивной
                link.classList.add('current-page');
                link.style.pointerEvents = 'none';
                link.style.color = '#666';
                link.style.fontWeight = 'bold';
                
                // Раскрываем дерево
                this.expandToActiveLink(link);
            }
        });
        
        if (!activeLinkFound) {
            console.log('⚠️ Активная страница не найдена в навигации');
        }
    }

    expandToActiveLink(activeLink) {
        console.log('🌳 Раскрываем дерево навигации...');
        
        let element = activeLink;
        let depth = 0;
        
        while (element && depth < 10) {
            if (element.tagName === 'LI') {
                const checkbox = element.querySelector('input[type="checkbox"]');
                if (checkbox) {
                    console.log('📂 Найден чекбокс, раскрываем...');
                    checkbox.checked = true;
                }
            }
            
            element = element.parentElement;
            depth++;
            
            if (element && element.id === 'navigation') break;
        }
        
        console.log('✅ Дерево раскрыто');
    }
}

// Делаем класс доступным глобально
window.NavigationManager = NavigationManager;
console.log('✅ NavigationManager загружен и доступен');