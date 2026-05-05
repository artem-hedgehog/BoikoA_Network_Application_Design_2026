// Обработчик "О нас"
document.addEventListener('DOMContentLoaded', () => {
    const aboutLink = document.getElementById('about-link');
    if (aboutLink) {
        aboutLink.addEventListener('click', (e) => {
            e.preventDefault();
            alert('Бойко Артём, группа ИУ5-46Б');
        });
    }
});

// Обработчик "В корзину" (делегирование)
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('order-link') || e.target.classList.contains('product-page__add-to-cart')) {
        e.preventDefault();
        alert('Товар добавлен в корзину (демо-режим)');
    }
});