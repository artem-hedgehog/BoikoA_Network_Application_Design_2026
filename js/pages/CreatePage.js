// js/pages/CreatePage.js (упрощённая версия)
import { ajax } from '../modules/ajax.js';
import { stockUrls } from '../modules/stockUrls.js';
import { Notification } from '../components/Notification.js';
import { BackButton } from '../components/BackButton.js';

export class CreatePage {
    constructor(container) {
        this.container = container;
    }

    render() {
        this.container.innerHTML = `
            <div id="back-button-container"></div>
            <div class="card p-4" style="max-width: 600px; margin: 0 auto;">
                <h2>Создание новой карточки</h2>
                <div class="mb-3">
                    <label class="form-label">Название (title)</label>
                    <input type="text" id="create-title" class="form-control">
                </div>
                <div class="mb-3">
                    <label class="form-label">Описание (text)</label>
                    <textarea id="create-text" class="form-control" rows="3"></textarea>
                </div>
                <div class="mb-3">
                    <label class="form-label">URL изображения (src)</label>
                    <input type="text" id="create-src" class="form-control">
                </div>
                <button id="create-submit" class="btn btn-success">Создать</button>
            </div>
        `;

        const backContainer = document.getElementById('back-button-container');
        const backButton = new BackButton(backContainer, () => {
            window.location.hash = '/';
        });
        backButton.render();

        document.getElementById('create-submit').addEventListener('click', () => {
            const newCard = {
                title: document.getElementById('create-title').value,
                text: document.getElementById('create-text').value,
                src: document.getElementById('create-src').value
            };
            if (!newCard.title || !newCard.src) {
                Notification.show('Заполните все поля', 'warning');
                return;
            }
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