import { ProductComponent } from "../../components/product/index.js";
import { BackButtonComponent } from "../../components/back-button/index.js";
import { Notification } from "../../components/notification/index.js";
import { ajax } from "../../modules/ajax.js";
import { stockUrls } from "../../modules/stockUrls.js";

export class ProductPage {
    constructor(parent, id) {
        this.parent = parent;
        this.id = id;
    }

    getHTML() {
        return `<div id="product-page" class="container mt-3"></div>`;
    }

    get pageRoot() {
        return document.getElementById('product-page');
    }

    render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        const backButton = new BackButtonComponent(this.pageRoot);
        backButton.render(() => window.location.hash = '/');

        this.loadData();
    }

    loadData() {
        const url = stockUrls.getStockById(this.id);
        ajax.get(url, (data, status) => {
            if (status === 200 && data) {
                this.renderData(data);
            } else {
                this.pageRoot.innerHTML = '<div class="alert alert-danger">Карточка не найдена</div>';
            }
        });
    }

    renderData(product) {
        const productComp = new ProductComponent(this.pageRoot);
        productComp.render(
            product,
            (item) => this.showEditForm(item),
            (id) => this.deleteProduct(id)
        );
    }

    showEditForm(product) {
        // Создаём форму редактирования
        const formHtml = `
            <div class="card mt-3 p-3">
                <h5>Редактирование карточки</h5>
                <div class="mb-2">
                    <label>Название</label>
                    <input type="text" id="edit-title" class="form-control" value="${product.title}">
                </div>
                <div class="mb-2">
                    <label>Текст</label>
                    <textarea id="edit-text" class="form-control">${product.text}</textarea>
                </div>
                <div class="mb-2">
                    <label>Ссылка на изображение</label>
                    <input type="text" id="edit-src" class="form-control" value="${product.src}">
                </div>
                <button id="save-edit-btn" class="btn btn-primary">Сохранить</button>
            </div>
        `;
        this.pageRoot.insertAdjacentHTML('beforeend', formHtml);
        document.getElementById('save-edit-btn').addEventListener('click', () => {
            const updated = {
                title: document.getElementById('edit-title').value,
                text: document.getElementById('edit-text').value,
                src: document.getElementById('edit-src').value
            };
            const url = stockUrls.updateStockById(product.id);
            ajax.patch(url, updated, (data, status) => {
                if (status === 200) {
                    Notification.show('Карточка обновлена', 'success');
                    // перезагружаем страницу
                    window.location.hash = `product/${product.id}`;
                } else {
                    Notification.show('Ошибка обновления', 'danger');
                }
            });
        });
    }

    deleteProduct(id) {
        const url = stockUrls.removeStockById(id);
        ajax.delete(url, (data, status) => {
            if (status === 204) {
                Notification.show('Карточка удалена', 'success');
                window.location.hash = '/';
            } else {
                Notification.show('Ошибка удаления', 'danger');
            }
        });
    }
}