// js/pages/ProductPage.js
import { ajax } from '../modules/ajax.js';
import { stockUrls } from '../modules/stockUrls.js';
import { Notification } from '../components/Notification.js';
import { BackButton } from '../components/BackButton.js';

export class ProductPage {
    constructor(container, productId) {
        this.container = container;
        this.productId = productId;
        this.product = null;
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
            .product-page__text {
                line-height: 1.6;
                color: #242424;
                margin: 20px 0;
            }
            .action-buttons {
                display: flex;
                gap: 16px;
                margin-top: 20px;
            }
            .edit-form {
                margin-top: 30px;
                padding: 20px;
                border: 1px solid #ddd;
                border-radius: 12px;
            }
        `;
        document.head.appendChild(style);
    }

    render() {
        this.injectStyles();
        this.container.innerHTML = `
            <div id="back-button-container"></div>
            <div id="product-content">Загрузка...</div>
        `;

        const backContainer = document.getElementById('back-button-container');
        const backButton = new BackButton(backContainer, () => {
            window.location.hash = '/';
        });
        backButton.render();

        this.loadProduct();
    }

    loadProduct() {
        const url = stockUrls.getStockById(this.productId);
        ajax.get(url, (data, status) => {
            if (status === 200 && data) {
                this.product = data;
                this.renderProductDetails();
            } else {
                document.getElementById('product-content').innerHTML = '<div class="alert alert-danger">Карточка не найдена</div>';
            }
        });
    }

    renderProductDetails() {
        const product = this.product;
        const container = document.getElementById('product-content');
        container.innerHTML = `
            <div class="product-page">
                <div class="product-page__gallery">
                    <img src="${product.src}" alt="${product.title}">
                </div>
                <div class="product-page__info">
                    <h1 class="product-page__title">${product.title}</h1>
                    <p class="product-page__text">${product.text}</p>
                    <div class="action-buttons">
                        <button id="edit-product-btn" class="btn btn-warning">✏️ Редактировать</button>
                        <button id="delete-product-btn" class="btn btn-danger">🗑 Удалить</button>
                    </div>
                    <div id="edit-form-container"></div>
                </div>
            </div>
        `;

        document.getElementById('edit-product-btn').addEventListener('click', () => this.showEditForm());
        document.getElementById('delete-product-btn').addEventListener('click', () => this.deleteProduct());
    }

    showEditForm() {
        const product = this.product;
        const formContainer = document.getElementById('edit-form-container');
        formContainer.innerHTML = `
            <div class="edit-form">
                <h5>Редактирование</h5>
                <div class="mb-2">
                    <label>Название</label>
                    <input type="text" id="edit-title" class="form-control" value="${product.title}">
                </div>
                <div class="mb-2">
                    <label>Текст описания</label>
                    <textarea id="edit-text" class="form-control" rows="3">${product.text}</textarea>
                </div>
                <div class="mb-2">
                    <label>URL изображения</label>
                    <input type="text" id="edit-src" class="form-control" value="${product.src}">
                </div>
                <button id="save-edit-btn" class="btn btn-primary">Сохранить</button>
            </div>
        `;
        document.getElementById('save-edit-btn').addEventListener('click', () => this.saveEdit());
    }

    saveEdit() {
        const updated = {
            title: document.getElementById('edit-title').value,
            text: document.getElementById('edit-text').value,
            src: document.getElementById('edit-src').value
        };
        const url = stockUrls.updateStock(this.product.id);
        ajax.patch(url, updated, (data, status) => {
            if (status === 200) {
                Notification.show('Карточка обновлена', 'success');
                this.loadProduct(); // перезагрузить страницу
            } else {
                Notification.show('Ошибка обновления', 'danger');
            }
        });
    }

    deleteProduct() {
        if (confirm('Удалить карточку?')) {
            const url = stockUrls.deleteStock(this.product.id);
            ajax.delete(url, (data, status) => {
                if (status === 204) {
                    Notification.show('Товар удалён', 'success');
                    window.location.hash = '/';
                } else {
                    Notification.show('Ошибка удаления', 'danger');
                }
            });
        }
    }
}