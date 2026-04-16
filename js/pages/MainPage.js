import { getProducts, copyFirstProduct, deleteProductById } from '../storage.js';
import { Notification } from '../components/Notification.js';
import { ProductCard } from '../components/ProductCard.js';

export class MainPage {
    constructor(container) {
        this.container = container;
        this.filterText = '';
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
            }
            .controls .search-catalog__input {
                flex: 1;
            }
            .product-grid {
                display: grid;
                grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
                gap: 24px;
            }
            .alert {
                padding: 12px;
                border-radius: 8px;
                background-color: #f8f9fa;
                color: #0c5460;
                border: 1px solid #bee5eb;
            }
        `;
        document.head.appendChild(style);
    }

    render() {
        this.injectStyles();
        this.container.innerHTML = `
            <h1 class="page-title">Главная страница</h1>
            <div class="controls">
                <button id="copy-first-btn" style="background-color: #28a745; border: none; padding: 10px 20px; border-radius: 8px; color: white; cursor: pointer;">📋 Копировать первую</button>
            </div>
            <div id="product-grid" class="product-grid"></div>
        `;
        this.attachEvents();
        this.renderProducts();
    }

    attachEvents() {
        const filterInput = document.getElementById('filter-input');
        const copyBtn = document.getElementById('copy-first-btn');
        if (filterInput) {
            filterInput.addEventListener('input', (e) => {
                this.filterText = e.target.value;
                this.renderProducts();
            });
        }
        if (copyBtn) {
            copyBtn.addEventListener('click', () => {
                const copy = copyFirstProduct();
                if (copy) {
                    Notification.show(`Скопирована карточка "${copy.name}"`, 'success');
                    this.renderProducts();
                }
            });
        }
    }

    renderProducts() {
        const grid = document.getElementById('product-grid');
        if (!grid) return;
        let products = getProducts();
        if (this.filterText) {
            products = products.filter(p => p.name.toLowerCase().includes(this.filterText.toLowerCase()));
        }
        grid.innerHTML = '';
        if (products.length === 0) {
            grid.innerHTML = '<div class="alert alert-info">Товары не найдены</div>';
            return;
        }
        products.forEach(product => {
            const card = new ProductCard(grid);
            card.render(product, (id) => {
                const deleted = deleteProductById(id);
                if (deleted) {
                    Notification.show(`Удалён товар "${deleted.name}"`, 'danger');
                    this.renderProducts();
                }
            });
        });
    }
}
