// components/back-button/index.js

export class BackButtonComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML() {
        return `<button id="back-button" class="btn btn-outline-secondary back-button">← Назад</button>`;
    }

    addListeners(listener) {
        const btn = document.getElementById('back-button');
        if (btn) btn.addEventListener('click', listener);
    }

    render(listener) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML());
        this.addListeners(listener);
    }
}