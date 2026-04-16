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
                aspect-ratio: 2/3;
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
            .product-card__price { margin-bottom: 8px; }
            .price__first-row {
                display: flex;
                align-items: baseline;
                gap: 8px;
                flex-wrap: wrap;
            }
            .price__lower-price {
                font-size: 20px;
                font-weight: 650;
                color: #242424;
                text-decoration: none;
            }
            .price del {
                color: #a0a0a0;
                font-size: 14px;
            }
            .percentage-sale {
                color: #ff4444;
                background-color: #ffeeee;
                padding: 2px 6px;
                border-radius: 4px;
                font-size: 12px;
                font-weight: 600;
            }
            .product-card__brand-wrap {
                font-size: 14px;
                font-weight: 400;
                color: #333;
                margin-bottom: 12px;
                line-height: 1.4;
                height: 2.8em;
                overflow: hidden;
            }
            .product-card__bottom-wrap {
                display: flex;
                justify-content: space-between;
                align-items: center;
                border-top: 1px solid #f0f0f0;
                padding-top: 12px;
                margin-top: 8px;
            }
            .product-card__rating-wrap {
                display: flex;
                align-items: center;
                gap: 4px;
                font-size: 13px;
            }
            .rating {
                font-weight: 600;
                color: #6E00D1;
            }
            .product-card__count { color: #a0a0a0; }
            .order-link {
                background-color: #b62ccb;
                color: white;
                padding: 6px 16px;
                border-radius: 20px;
                font-size: 13px;
                font-weight: 500;
                transition: background-color 0.5s ease;
                cursor: pointer;
            }
            .order-link:hover { background-color: #7b3ac9; }
            .delete-card-btn {
                position: absolute;
                top: 10px;
                right: 10px;
                background: red;
                color: white;
                border: none;
                border-radius: 20px;
                padding: 5px 10px;
                cursor: pointer;
                z-index: 10;
            }
        `;
        document.head.appendChild(style);
    }

    render(product, onDelete) {
        this.injectStyles();
        const card = document.createElement('article');
        card.className = 'product-card';
        card.dataset.id = product.id;
        card.innerHTML = `
            <a href="#" class="product-card__link" data-id="${product.id}">
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
            <div class="product-card__likes" style="display: flex; align-items: center; gap: 5px; padding: 8px 12px; border-top: 1px solid #f0f0f0;">
                <span style="font-size: 14px;">❤️</span>
                <span class="likes-count" style="font-weight: bold;">${product.likes || 0}</span>
                <span style="color: #666; font-size: 12px;">лайков</span>
            </div>
            <button class="delete-card-btn" data-id="${product.id}">✕ Удалить</button>
        `;
        const deleteBtn = card.querySelector('.delete-card-btn');
        deleteBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            onDelete(product.id);
        });
        const link = card.querySelector('.product-card__link');
        link.addEventListener('click', (e) => {
            e.preventDefault();
            window.location.hash = `product/${product.id}`;
        });
        this.container.appendChild(card);
    }
}
