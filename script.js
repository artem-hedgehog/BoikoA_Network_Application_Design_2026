// script.js
// script.js

// --- 1. ЛОГИКА ДЛЯ ПОДВАЛА (О НАС) ---
document.addEventListener('DOMContentLoaded', function() {
    const aboutLink = document.getElementById('about-link');
    if (aboutLink) {
        aboutLink.addEventListener('click', function(event) {
            event.preventDefault(); // Отменяем переход по ссылке
            alert('Бойко Артём, группа ИУ5-46Б');
        });
    }
});

// --- 2. ЛОГИКА ДЛЯ КАЛЬКУЛЯТОРА (обновленная) ---
// Проверяем, что мы находимся на странице калькулятора, прежде чем искать его кнопки.
if (document.getElementById('result')) {
    const resultElement = document.getElementById('result');
    let currentInput = '0';      // Текущее число на экране (для вычислений)
    let expression = '';         // Переменная для отображения всей строки
    let previousInput = '';      // Предыдущее число для операции
    let operator = '';           // Выбранная операция (+, -, *, /)
    let shouldResetScreen = false; // Флаг, нужно ли сбросить экран при следующем вводе

    // Функция для обновления экрана
    function updateScreen(value) {
        resultElement.textContent = value;
    }

    // Функция для обработки нажатия на цифры и точку
    function handleDigit(digit) {
        if (shouldResetScreen) {
            currentInput = '';
            expression = '';      // Очищаем выражение, если начинаем новое вычисление
            shouldResetScreen = false;
        }

        // Добавляем цифру в выражение для отображения
        expression += digit;

        // Формируем текущее число для вычислений
        if (digit === '.' && currentInput.includes('.')) {
            return; // Не даем поставить две точки
        }
        if (currentInput === '0' && digit !== '.') {
            currentInput = digit; // Заменяем начальный ноль
        } else {
            currentInput += digit;
        }

        // Показываем на экране всю последовательность (выражение)
        updateScreen(expression);
    }

    // Функция для обработки операторов (+, -, *, /)
    function handleOperator(op) {
        // Если оператор уже выбран, вычисляем предыдущее действие перед новым
        if (operator && !shouldResetScreen) {
            calculate();
        }

        previousInput = currentInput;
        operator = op;

        // Добавляем символ операции в выражение
        // Используем символ '×' для красоты, чтобы соответствовать кнопке "x"
        const displayOp = (op === '*') ? '×' : op;
        expression += displayOp;

        shouldResetScreen = true; // Следующее нажатие цифры начнет новое число
        updateScreen(expression); // Показываем выражение с оператором
    }

    // Функция для выполнения вычисления
    function calculate() {
        if (!operator || shouldResetScreen) {
            return; // Нет операции для выполнения
        }

        let result;
        const prev = parseFloat(previousInput);
        const current = parseFloat(currentInput);

        if (isNaN(prev) || isNaN(current)) {
            result = 'Error';
        } else {
            switch (operator) {
                case '+':
                    result = prev + current;
                    break;
                case '-':
                    result = prev - current;
                    break;
                case '*':
                case 'x': // Обрабатываем символ 'x' как умножение
                    result = prev * current;
                    break;
                case '/':
                    if (current === 0) {
                        result = 'Error'; // Деление на ноль
                    } else {
                        result = prev / current;
                    }
                    break;
                default:
                    return;
            }
        }

        // Округляем результат до 10 знаков, чтобы избежать длинных дробей
        if (typeof result === 'number' && !Number.isInteger(result)) {
            result = parseFloat(result.toFixed(10));
        }

        // Показываем результат
        currentInput = result.toString();
        expression = result.toString(); // После вычисления показываем только результат
        operator = '';
        shouldResetScreen = true;
        updateScreen(expression);
    }

    // Функция для очистки (C)
    function clearAll() {
        currentInput = '0';
        expression = '';      // Очищаем выражение
        previousInput = '';
        operator = '';
        shouldResetScreen = false;
        updateScreen('0');    // Показываем 0
    }

    // Функция для смены знака (+/-)
    function changeSign() {
        if (currentInput !== '0' && currentInput !== 'Error') {
            currentInput = (parseFloat(currentInput) * -1).toString();
            // Для простоты показываем измененное число
            expression = currentInput;
            updateScreen(expression);
        }
    }

    // Функция для процента (%)
    function percent() {
        if (currentInput !== 'Error') {
            currentInput = (parseFloat(currentInput) / 100).toString();
            // Для простоты показываем процент от числа
            expression = currentInput;
            updateScreen(expression);
        }
    }

    // --- НАЗНАЧЕНИЕ ОБРАБОТЧИКОВ ДЛЯ КНОПОК ---
    // Цифры
    document.querySelectorAll('[id^="btn_digit_"]').forEach(button => {
        button.addEventListener('click', () => handleDigit(button.textContent));
    });

    // Операторы (+, -, x, /)
    document.getElementById('btn_op_plus').addEventListener('click', () => handleOperator('+'));
    document.getElementById('btn_op_minus').addEventListener('click', () => handleOperator('-'));
    document.getElementById('btn_op_mult').addEventListener('click', () => handleOperator('*'));
    document.getElementById('btn_op_div').addEventListener('click', () => handleOperator('/'));

    // Равно
    document.getElementById('btn_op_equal').addEventListener('click', () => calculate());

    // Очистка
    document.getElementById('btn_op_clear').addEventListener('click', () => clearAll());

    // Смена знака
    document.getElementById('btn_op_sign').addEventListener('click', () => changeSign());

    // Процент
    document.getElementById('btn_op_percent').addEventListener('click', () => percent());

    // --- НОВАЯ ЧАСТЬ: ОБРАБОТКА НАЖАТИЙ КЛАВИШ С КЛАВИАТУРЫ ---

    // Добавляем обработчик событий клавиатуры на весь документ
    document.addEventListener('keydown', function(event) {

        // Получаем нажатую клавишу
        const key = event.key;

        // Предотвращаем стандартное поведение браузера для клавиш, которые мы обрабатываем
        // (чтобы, например, при нажатии на цифры они не вводились еще куда-то)

        // Обработка цифр (0-9)
        if (key >= '0' && key <= '9') {
            event.preventDefault();
            handleDigit(key);
        }

        // Обработка точки (.)
        else if (key === '.') {
            event.preventDefault();
            handleDigit('.');
        }

        // Обработка операторов
        else if (key === '+') {
            event.preventDefault();
            handleOperator('+');
        }
        else if (key === '-') {
            event.preventDefault();
            handleOperator('-');
        }
        else if (key === '*') {
            event.preventDefault();
            handleOperator('*');
        }
        else if (key === '/') {
            event.preventDefault();
            handleOperator('/');
        }

        // Обработка Enter или = (вычисление результата)
        else if (key === 'Enter' || key === '=') {
            event.preventDefault();
            calculate();
        }

        // Обработка Escape или Delete (очистка)
        else if (key === 'Escape' || key === 'Delete' || key === 'c' || key === 'C') {
            event.preventDefault();
            clearAll();
        }

    });

} // Конец проверки на наличие калькулятора


// --- 3. ЛОГИКА ДЛЯ КНОПКИ "В КОРЗИНУ" ---
document.addEventListener('click', function(e) {
    // Если клик был по кнопке "В корзину" на карточке товара
    if (e.target.classList.contains('order-link') || e.target.classList.contains('product-page__add-to-cart')) {
        e.preventDefault();
        alert('Товар добавлен в корзину (демо-режим)');
    }
});


// ----- Компонент уведомлений (Bootstrap Toasts) -----
const ToastComponent = {
    show(message, type = 'primary') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toastId = 'toast-' + Date.now();
        const toastHtml = `
            <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true" data-bs-delay="3000">
                <div class="d-flex">
                    <div class="toast-body">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', toastHtml);
        const toastEl = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
        toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    }
};

// ----- Мок-коллекция (тема "кошки" – мягкие игрушки) -----
const defaultProducts = [
    {
        id: 1,
        name: "Мягкая игрушка Котик аниме",
        brand: "Бренд 1",
        price: 2239,
        oldPrice: 6990,
        discount: 66,
        rating: 4.9,
        reviews: 14,
        image: "https://trend-opt.ru/image/cache/catalog/2024g/to-103998/myagkaya-igrushka-kotik-anime-1000x1000.jpg",
        description: "Очаровательный аниме-кот. Мягкий, приятный на ощупь, станет лучшим другом."
    },
    {
        id: 2,
        name: "Кот-акула",
        brand: "Бренд 2",
        price: 1173,
        oldPrice: 3537,
        discount: 65,
        rating: 4.8,
        reviews: 63,
        image: "https://catalog-cdn.detmir.st/media/mfd5lm-e2i7PFYdXMp17y3adK6vQsLNkwOOnFUqTwCY=.jpeg",
        description: "Игрушка кот в образе акулы. Идеально для обнимашек."
    },
    {
        id: 3,
        name: "Котик-подушка",
        brand: "Бренд 3",
        price: 669,
        oldPrice: 1015,
        discount: 32,
        rating: 4.9,
        reviews: 173,
        image: "https://trend-opt.ru/image/cache/catalog/2023g/to-102756/myagkaya-igrushka-kot-akula-20sm-1000x1000.jpg",
        description: "Мягкая игрушка-подушка в виде кота. Спать с ним одно удовольствие."
    }
];

// Инициализация localStorage
function initStorage() {
    if (!localStorage.getItem('products')) {
        localStorage.setItem('products', JSON.stringify(defaultProducts));
    }
}
initStorage();

// Получить все товары
function getProducts() {
    return JSON.parse(localStorage.getItem('products')) || [];
}

// Сохранить товары
function saveProducts(products) {
    localStorage.setItem('products', JSON.stringify(products));
}

// Добавить копию первой карточки
function copyFirstProduct() {
    const products = getProducts();
    if (products.length === 0) return null;
    const first = products[0];
    const newId = Date.now();
    const copy = {
        ...first,
        id: newId,
        name: first.name + " (копия)",
        reviews: 0
    };
    products.push(copy);
    saveProducts(products);
    ToastComponent.show(`Скопирована карточка "${first.name}"`, 'success');
    return copy;
}

// Удалить товар по id
function deleteProductById(id) {
    let products = getProducts();
    const deleted = products.find(p => p.id === id);
    if (!deleted) return false;
    products = products.filter(p => p.id !== id);
    saveProducts(products);
    ToastComponent.show(`Удалён товар "${deleted.name}"`, 'danger');
    return true;
}

// ----- Рендер карточек на главной странице -----
function renderProductCards(filterText = '') {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    let products = getProducts();
    if (filterText) {
        products = products.filter(p => p.name.toLowerCase().includes(filterText.toLowerCase()));
    }

    if (products.length === 0) {
        grid.innerHTML = '<div class="alert alert-info">Товары не найдены</div>';
        return;
    }

    grid.innerHTML = '';
    products.forEach(product => {
        const card = document.createElement('article');
        card.className = 'product-card';
        card.dataset.id = product.id;
        card.innerHTML = `
            <a href="product.html?id=${product.id}" class="product-card__link">
                <div class="product-card__top-wrap">
                    <div class="product-card__img-wrap">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                </div>
                <div class="product-card__middle-wrap">
                    <div class="product-card__price price">
                        <span class="price__first-row">
                            <ins class="price__lower-price">${product.price.toLocaleString()} ₽</ins>
                            <del>${product.oldPrice.toLocaleString()} ₽</del>
                            <span class="percentage-sale">−${product.discount}%</span>
                        </span>
                    </div>
                    <h2 class="product-card__brand-wrap">${product.brand} / ${product.name}</h2>
                </div>
                <div class="product-card__bottom-wrap">
                    <div class="product-card__rating-wrap">
                        <span class="rating">${product.rating}</span>
                        <span class="product-card__count">${product.reviews} отзывов</span>
                    </div>
                    <div class="product-card__order-wrap">
                        <span class="order-link">В корзину</span>
                    </div>
                </div>
            </a>
            <button class="delete-card-btn" data-id="${product.id}" style="position: absolute; top: 10px; right: 10px; background: red; color: white; border: none; border-radius: 20px; padding: 5px 10px; cursor: pointer;">✕ Удалить</button>
        `;
        grid.appendChild(card);
    });

    // Добавляем обработчики удаления (после рендера)
    document.querySelectorAll('.delete-card-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const id = parseInt(btn.dataset.id);
            if (deleteProductById(id)) {
                renderProductCards(filterText);
            }
        });
    });
}

// ----- Инициализация главной страницы -----
function initMainPage() {
    const filterInput = document.getElementById('filter-input');
    const copyBtn = document.getElementById('copy-first-btn');

    if (filterInput) {
        filterInput.addEventListener('input', (e) => {
            renderProductCards(e.target.value);
        });
    }

    if (copyBtn) {
        copyBtn.addEventListener('click', () => {
            copyFirstProduct();
            renderProductCards(filterInput ? filterInput.value : '');
        });
    }

    renderProductCards('');
}

// ----- Инициализация страницы товара -----
function initProductPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const id = parseInt(urlParams.get('id'));
    const products = getProducts();
    const product = products.find(p => p.id === id);

    if (!product) {
        document.getElementById('product-page').innerHTML = '<div class="alert alert-danger">Товар не найден</div>';
        return;
    }

    // Заполняем элементы
    document.getElementById('product-img').src = product.image;
    document.getElementById('product-img').alt = product.name;
    document.getElementById('product-title').textContent = `${product.name} (${product.brand})`;
    document.getElementById('product-rating').innerHTML = `★ ${product.rating} (${product.reviews} отзывов)`;
    document.getElementById('product-price').textContent = `${product.price.toLocaleString()} ₽`;
    document.getElementById('product-old-price').textContent = `${product.oldPrice.toLocaleString()} ₽`;
    document.getElementById('product-sale').textContent = `−${product.discount}%`;
    document.getElementById('product-description').textContent = product.description;

    // Уведомление о загрузке страницы
    ToastComponent.show(`Открыта карточка товара: ${product.name}`, 'info');
}

// ----- Определяем, какая страница загружена -----
if (document.getElementById('product-grid')) {
    // Это главная страница
    initMainPage();
} else if (document.getElementById('product-page')) {
    // Это страница товара
    initProductPage();
}
