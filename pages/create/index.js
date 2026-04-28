import { BackButtonComponent } from "../../components/back-button/index.js";
import { Notification } from "../../components/notification/index.js";
import { ajax } from "../../modules/ajax.js";
import { stockUrls } from "../../modules/stockUrls.js";

export class CreatePage {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return `
            <div class="container mt-3">
                <div class="card p-4" style="max-width: 600px; margin: 0 auto;">
                    <h3>Создание новой карточки</h3>
                    <div class="mb-3">
                        <label>Название (title)</label>
                        <input type="text" id="create-title" class="form-control">
                    </div>
                    <div class="mb-3">
                        <label>Описание (text)</label>
                        <textarea id="create-text" class="form-control" rows="3"></textarea>
                    </div>
                    <div class="mb-3">
                        <label>URL изображения (src)</label>
                        <input type="text" id="create-src" class="form-control">
                    </div>
                    <button id="create-submit" class="btn btn-success">Создать</button>
                </div>
            </div>
        `;
    }

    render() {
        this.parent.innerHTML = '';
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        const backButton = new BackButtonComponent(this.parent);
        backButton.render(() => window.location.hash = '/');

        document.getElementById('create-submit').addEventListener('click', () => {
            const title = document.getElementById('create-title').value;
            const text = document.getElementById('create-text').value;
            const src = document.getElementById('create-src').value;

            if (!title || !text || !src) {
                Notification.show('Заполните все поля', 'warning');
                return;
            }

            const newCard = { title, text, src };
            ajax.post(stockUrls.createStock(), newCard, (data, status) => {
                if (status === 201) {
                    Notification.show('Карточка создана', 'success');
                    window.location.hash = '/';
                } else {
                    Notification.show('Ошибка создания', 'danger');
                }
            });
        });
    }
}