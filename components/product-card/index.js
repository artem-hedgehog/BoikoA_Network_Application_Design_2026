import { Notification } from '../notification/index.js';

export class ProductCardComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="card" style="width: 300px; margin: 10px; position: relative;">
                <img src="${data.src}" class="card-img-top" alt="${data.title}" style="height: 200px; object-fit: cover;">
                <div class="card-body">
                    <h5 class="card-title">${data.title}</h5>
                    <p class="card-text">${data.text.substring(0, 80)}...</p>
                    <button class="btn btn-primary detail-btn" data-id="${data.id}">Подробнее</button>
                </div>
                <button class="delete-card-btn" data-id="${data.id}" style="position: absolute; top: 10px; right: 10px; background: red; color: white; border: none; border-radius: 20px; cursor: pointer;">✕</button>
            </div>
        `;
    }

    addListeners(detailListener, deleteListener) {
        const detailBtn = this.parent.querySelector(`.detail-btn[data-id="${this.lastId}"]`);
        if (detailBtn) detailBtn.addEventListener('click', detailListener);
        const deleteBtn = this.parent.querySelector(`.delete-card-btn[data-id="${this.lastId}"]`);
        if (deleteBtn) deleteBtn.addEventListener('click', deleteListener);
    }

    render(data, detailListener, deleteListener) {
        this.lastId = data.id;
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
        this.addListeners(detailListener, () => deleteListener(data.id));
    }
}