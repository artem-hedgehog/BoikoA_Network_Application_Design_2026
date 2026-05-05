// js/components/ProductCard.js
import { ajax } from '../modules/ajax.js';
import { stockUrls } from '../modules/stockUrls.js';
import { Notification } from './Notification.js';

export class ProductCard {
    constructor(container) {
        this.container = container;
    }

    injectStyles() {
        if (document.getElementById('product-card-styles')) return;
        const style = document.createElement('style');
        style.id = 'product-card-styles';
        style.textContent = `
            .product-card {
                border-radius: 12px;
                overflow: hidden;
                transition: box-shadow 0.2s;
                background-color: white;
                border: 1px solid #eee;
                position: relative;
            }
            .product-card:hover { box-shadow: 0 4px 20px rgba(0,0,0,0.08); }
            .product-card__link {
                text-decoration: none;
                color: inherit;
                display: block;
                padding: 12px;
            }
            .product-card__img-wrap {
                aspect-ratio: 1/1;
                background-color: #f0f0f0;
                border-radius: 8px;
                overflow: hidden;
                margin-bottom: 12px;
            }
            .product-card__img-wrap img {
                width: 100%;
                height: 100%;
                object-fit: cover;
                display: block;
            }
            .product-card__title {
                font-size: 16px;
                font-weight: 600;
                margin: 8px 0;
                color: #242424;
            }
            .product-card__text {
                font-size: 14px;
                color: #6c757d;
                margin-bottom: 12px;
                line-height: 1.4;
                height: 2.8em;
                overflow: hidden;
            }
            .product-card__button {
                background-color: #b62ccb;
                color: white;
                border: none;
                padding: 8px 16px;
                border-radius: 20px;
                font-size: 13px;
                cursor: pointer;
                width: 100%;
            }
            .delete-card-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                background: red;
                color: white;
                border: none;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                cursor: pointer;
                z-index: 10;
            }
        `;
        document.head.appendChild(style);
    }

    render(product, onProductDeleted) {
        this.injectStyles();
        const card = document.createElement('article');
        card.className = 'product-card';
        card.dataset.id = product.id;
        card.innerHTML = `
            <a href="#" class="product-card__link" data-id="${product.id}">
                <div class="product-card__img-wrap">
                    <img src="${product.src}" alt="${product.title}">
                </div>
                <div class="product-card__title">${product.title}</div>
                <div class="product-card__text">${product.text.substring(0, 80)}...</div>
            </a>
            <button class="delete-card-btn" data-id="${product.id}">✕</button>
        `;

        const deleteBtn = card.querySelector('.delete-card-btn');
        deleteBtn.addEventListener('click', async (e) => {
            e.preventDefault();
            e.stopPropagation();
            const url = stockUrls.deleteStock(product.id);
            ajax.delete(url, (data, status) => {
                if (status === 204) {
                    Notification.show('Товар удалён', 'success');
                    if (onProductDeleted) onProductDeleted(product.id);
                } else {
                    Notification.show('Ошибка удаления', 'danger');
                }
            });
        });

        const link = card.querySelector('.product-card__link');
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = `product/${product.id}`;
        });

        this.container.appendChild(card);
    }
}