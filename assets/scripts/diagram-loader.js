// Функция для переключения увеличения
function toggleZoom(button) {
    const container = button.closest('.diagram-container');
    const img = container.querySelector('.plantuml-diagram');
    
    if (img.classList.contains('zoomed')) {
        img.classList.remove('zoomed');
        button.textContent = 'Увеличить';
    } else {
        img.classList.add('zoomed');
        button.textContent = 'Уменьшить';
    }
}

// Модальное окно для просмотра
function openModal(imgSrc) {
    const modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = `
        <span class="close">&times;</span>
        <img class="modal-content" src="${imgSrc}">
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    // Закрытие по клику
    modal.querySelector('.close').onclick = function() {
        document.body.removeChild(modal);
    };
    
    // Закрытие по клику вне изображения
    modal.onclick = function(event) {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    };
}

// Автоматическая подгрузка диаграмм
document.addEventListener('DOMContentLoaded', function() {
    // Добавляем обработчики для всех диаграмм
    document.querySelectorAll('.plantuml-diagram').forEach(img => {
        // Двойной клик для открытия в модальном окне
        img.ondblclick = function() {
            openModal(this.src);
        };
        
        // Заголовок при наведении
        img.title = 'Двойной клик для увеличения';
    });
    
    // Ленивая загрузка для улучшения производительности
    if ('IntersectionObserver' in window) {
        const lazyLoader = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    lazyLoader.unobserve(img);
                }
            });
        });
        
        document.querySelectorAll('.plantuml-diagram[data-src]').forEach(img => {
            lazyLoader.observe(img);
        });
    }
});