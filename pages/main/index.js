import { ProductCardComponent } from "../../components/product-card/index.js";
import { Notification } from "../../components/notification/index.js";
import { ajax } from "../../modules/ajax.js";
import { stockUrls } from "../../modules/stockUrls.js";

export class MainPage {
    constructor(parent) {
        this.parent = parent;
        this.currentFilter = '';
    }

    getHTML() {
        return `
            <div class="container mt-3">
                <div class="row mb-3">
                    <div class="col">
                        <input type="text" id="filter-input" class="form-control" placeholder="Фильтр по названию...">
                    </div>
                </div>
                <div id="main-page" class="d-flex flex-wrap justify-content-center"></div>
            </div>
        `;
    }

    get pageRoot() {
        return document.getElementById('main-page');
    }

    async render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());

        const filterInput = document.getElementById('filter-input');
        filterInput.addEventListener('input', (e) => {
            this.currentFilter = e.target.value;
            this.loadData();
        });

        await this.loadData();
    }

    loadData() {
        const url = stockUrls.getStocks(this.currentFilter);
        ajax.get(url, (data, status) => {
            if (status === 200 && Array.isArray(data)) {
                this.renderData(data);
            } else {
                Notification.show('Ошибка загрузки данных', 'danger');
            }
        });
    }

    renderData(products) {
        const container = this.pageRoot;
        container.innerHTML = '';
        if (products.length === 0) {
            container.innerHTML = '<div class="alert alert-info">Нет карточек</div>';
            return;
        }
        products.forEach(product => {
            const card = new ProductCardComponent(container);
            card.render(
                product,
                (e) => this.goToProduct(product.id),
                (id) => this.deleteProduct(id)
            );
        });
    }

    goToProduct(id) {
        window.location.hash = `product/${id}`;
    }

    deleteProduct(id) {
        const url = stockUrls.removeStockById(id);
        ajax.delete(url, (data, status) => {
            if (status === 204) {
                Notification.show('Карточка удалена', 'success');
                this.loadData();
            } else {
                Notification.show('Ошибка удаления', 'danger');
            }
        });
    }
}