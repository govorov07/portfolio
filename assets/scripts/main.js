// main.js - основной скрипт для всех страниц
class PortfolioApp {
    constructor() {
        this.init();
    }

    init() {
        console.log('🎯 Портфолио приложение инициализировано');
        
        this.initNavigation();
        this.initSplitPanel();
        this.setupGlobalEvents();
    }

    initNavigation() {
        // Ждем немного чтобы NavigationManager был доступен
        setTimeout(() => {
            if (typeof NavigationManager !== 'undefined') {
                new NavigationManager();
            } else {
                console.warn('NavigationManager не доступен, используем fallback');
                this.fallbackNavigation();
            }
        }, 50);
    }

    fallbackNavigation() {
        const currentPath = window.location.pathname;
        const activeLink = document.querySelector(`#navigation a[href="${currentPath}"]`);
        
        if (activeLink) {
            activeLink.style.fontWeight = 'bold';
            activeLink.style.color = '#0052cc';
        }
    }

    initSplitPanel() {
        if (typeof Split !== 'undefined') {
            setTimeout(() => {
                const sidebar = document.getElementById('sidebar');
                const content = document.getElementById('content');
                
                if (sidebar && content) {
                    Split(['#sidebar', '#content'], {
                        sizes: [15, 85],
                        minSize: [200, 400],
                        gutterSize: 8,
                        onDrag: () => console.log('📏 Размер панелей изменен')
                    });
                }
            }, 100);
        }
    }

    setupGlobalEvents() {
        // Обработка ошибок
        window.addEventListener('error', (e) => {
            console.error('Global error:', e.error);
        });

        // Сохранение состояния при перезагрузке
        window.addEventListener('beforeunload', () => {
            // Можно сохранить состояние навигации в localStorage
        });
    }
}

// Автоматическая инициализация
document.addEventListener('DOMContentLoaded', () => {
    new PortfolioApp();
});