import { getProducts, incrementLikes } from '../storage.js';
import { Notification } from '../components/Notification.js';
import { BackButton } from '../components/BackButton.js';

export class ProductPage {
    constructor(container, productId) {
        this.container = container;
        this.productId = productId;
    }

    injectStyles() {
        if (document.getElementById('product-page-styles')) return;
        const style = document.createElement('style');
        style.id = 'product-page-styles';
        style.textContent = `
            .product-page {
                display: grid;
                grid-template-columns: 1fr 1fr;
                gap: 48px;
            }
            .product-page__gallery img {
                width: 100%;
                border-radius: 16px;
                border: 1px solid #eee;
            }
            .product-page__title {
                font-size: 32px;
                margin-bottom: 16px;
                color: #242424;
            }
            .product-page__rating {
                margin-bottom: 24px;
                color: #ffb800;
            }
            .product-page__price {
                margin-bottom: 24px;
            }
            .product-page__add-to-cart {
                background-color: #b62ccb;
                color: white;
                border: none;
                padding: 14px 32px;
                border-radius: 8px;
                font-size: 16px;
                font-weight: 600;
                cursor: pointer;
                margin-bottom: 24px;
                transition: background-color 0.5s ease;
            }
            .product-page__add-to-cart:hover {
                background-color: #7b3ac9;
            }
            .product-page__description {
                line-height: 1.6;
                color: #242424;
            }
            .like-btn {
                transition: transform 0.2s;
                background: none;
                border: 1px solid #ccc;
                border-radius: 20px;
                padding: 8px 16px;
                cursor: pointer;
                font-size: 16px;
            }
            .like-btn:hover {
                transform: scale(1.05);
                background-color: #ffeeee !important;
            }
            .like-btn:active {
                transform: scale(0.95);
            }
        `;
        document.head.appendChild(style);
    }

    render() {
        this.injectStyles();
        const products = getProducts();
        const product = products.find(p => p.id === this.productId);
        if (!product) {
            this.container.innerHTML = '<div class="alert alert-danger">Товар не найден</div>';
            return;
        }
        this.container.innerHTML = `
            <div id="back-button-container"></div>
            <div class="product-page">
                <div class="product-page__gallery">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <div class="product-page__info">
                    <h1 class="product-page__title">${product.name} (${product.brand})</h1>
                    <div class="product-page__rating">★ ${product.rating} (${product.reviews} отзывов)</div>
                    <div class="product-page__price price">
                        <span class="price__first-row">
                            <ins class="price__lower-price">${product.price.toLocaleString()} ₽</ins>
                            <del>${product.oldPrice.toLocaleString()} ₽</del>
                            <span class="percentage-sale">−${product.discount}%</span>
                        </span>
                    </div>

                    <button class="product-page__add-to-cart">Добавить в корзину</button>
                    <div class="like-container" style="margin: 20px 0;">
                        <button id="like-button" class="like-btn">
                            ❤️ Лайк (<span id="like-count">${product.likes || 0}</span>)
                        </button>
                    </div>
                    <p class="product-page__description">${product.description}</p>
                </div>
            </div>
        `;

        // Обработчик для кнопки лайка
        const likeBtn = document.getElementById('like-button');
        const likeSpan = document.getElementById('like-count');

        likeBtn.addEventListener('click', () => {
            const newLikes = incrementLikes(product.id);
            if (newLikes !== null) {
                likeSpan.textContent = newLikes;
                Notification.show(`❤️ Вы поставили лайк! Теперь ${newLikes}`, 'info');
                product.likes = newLikes;
            }
        });


        const backContainer = document.getElementById('back-button-container');
        const backButton = new BackButton(backContainer, () => {
            window.location.hash = '/';
        });
        backButton.render();
        Notification.show(`Открыта карточка товара: ${product.name}`, 'info');
    }
}
