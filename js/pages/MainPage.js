// js/pages/MainPage.js
import { ajax } from '../modules/ajax.js';
import { stockUrls } from '../modules/stockUrls.js';
import { Notification } from '../components/Notification.js';
import { ProductCard } from '../components/ProductCard.js';

export class MainPage {
    constructor(container) {
        this.container = container;
        this.filterText = '';
        this.sortOrder = null;
    }

    injectStyles() {
        if (document.getElementById('mainpage-styles')) return;
        const style = document.createElement('style');
        style.id = 'mainpage-styles';
        style.textContent = `
            .page-title {
                margin-bottom: 24px;
                font-size: 28px;
                font-weight: 500;
                color: #242424;
            }
            .controls {
                display: flex;
                gap: 10px;
                margin-bottom: 20px;
                align-items: center;
                flex-wrap: wrap;
            }
            .controls input {
                flex: 1;
                padding: 10px;
                border: 1px solid #ccc;
                border-radius: 8px;
                min-width: 150px;
            }
            .controls button {
                padding: 10px 16px;
                border: none;
                border-radius: 8px;
                cursor: pointer;
                color: white;
            }
            .product-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
                gap: 24px;
            }
        `;
        document.head.appendChild(style);
    }

    render() {
        this.injectStyles();
        this.container.innerHTML = `
            <h1 class="page-title">Главная страница</h1>
            <div class="controls">
                <input type="text" id="filter-input" placeholder="Фильтр по названию...">
                <button id="copy-first-btn" style="background-color: #28a745;">📋 Копировать первую</button>
                <button id="sort-asc-btn" style="background-color: #28a745;">А-Я</button>
                <button id="sort-desc-btn" style="background-color: #28a745;">Я-А</button>
            </div>
            <div id="product-grid" class="product-grid"></div>
        `;
        this.attachEvents();
        this.loadProducts();
    }

    attachEvents() {
        const filterInput = document.getElementById('filter-input');
        const copyBtn = document.getElementById('copy-first-btn');
        const sortAscBtn = document.getElementById('sort-asc-btn');
        const sortDescBtn = document.getElementById('sort-desc-btn');

        if (filterInput) {
            filterInput.addEventListener('input', (e) => {
                this.filterText = e.target.value;
                this.loadProducts();
            });
        }
        if (copyBtn) {
            copyBtn.addEventListener('click', () => this.copyFirstProduct());
        }
        if (sortAscBtn) {
            sortAscBtn.addEventListener('click', () => {
                this.sortOrder = 'asc';
                this.loadProducts();
            });
        }
        if (sortDescBtn) {
            sortDescBtn.addEventListener('click', () => {
                this.sortOrder = 'desc';
                this.loadProducts();
            });
        }
    }

    loadProducts() {
        const url = stockUrls.getStocks(this.filterText);
        ajax.get(url, (data, status) => {
            if (status === 200 && Array.isArray(data)) {
                this.renderProducts(data);
            } else {
                Notification.show('Ошибка загрузки товаров', 'danger');
                const grid = document.getElementById('product-grid');
                if (grid) grid.innerHTML = '<div class="alert alert-danger">Не удалось загрузить данные</div>';
            }
        });
    }

    renderProducts(products) {
        const grid = document.getElementById('product-grid');
        if (!grid) return;

        let sorted = [...products];

        if (this.sortOrder === 'asc') {
            sorted.sort((a, b) => a.title.localeCompare(b.title, 'ru', { sensitivity: 'base' }));
        } else if (this.sortOrder === 'desc') {
            sorted.sort((a, b) => b.title.localeCompare(a.title, 'ru', { sensitivity: 'base' }));
        }
        
        grid.innerHTML = '';
        if (sorted.length === 0) {
            grid.innerHTML = '<div class="alert alert-info">Товары не найдены</div>';
            return;
        }

        sorted.forEach(product => {
            const card = new ProductCard(grid);
            card.render(product, () => this.loadProducts());
        });
    }

    copyFirstProduct() {
        ajax.get(stockUrls.getStocks(), (data, status) => {
            if (status === 200 && data && data.length > 0) {
                const first = data[0];
                const copyData = {
                    src: first.src,
                    title: first.title + ' (копия)',
                    text: first.text
                };
                ajax.post(stockUrls.createStock(), copyData, (newData, createStatus) => {
                    if (createStatus === 201) {
                        Notification.show('Карточка скопирована', 'success');
                        this.loadProducts();
                    } else {
                        Notification.show('Ошибка копирования', 'danger');
                    }
                });
            } else {
                Notification.show('Нет карточек для копирования', 'warning');
            }
        });
    }
}