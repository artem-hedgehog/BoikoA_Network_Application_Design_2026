export class ProductComponent {
    constructor(parent) {
        this.parent = parent;
    }

    getHTML(data) {
        return `
            <div class="card mb-3" style="max-width: 800px; margin: 20px auto;">
                <div class="row g-0">
                    <div class="col-md-5">
                        <img src="${data.src}" class="img-fluid rounded-start" alt="${data.title}">
                    </div>
                    <div class="col-md-7">
                        <div class="card-body">
                            <h5 class="card-title">${data.title}</h5>
                            <p class="card-text">${data.text}</p>
                            <div class="mt-3">
                                <button id="edit-btn" class="btn btn-warning">✏️ Редактировать</button>
                                <button id="delete-btn" class="btn btn-danger">🗑 Удалить</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    render(data, editCallback, deleteCallback) {
        this.parent.insertAdjacentHTML('beforeend', this.getHTML(data));
        document.getElementById('edit-btn')?.addEventListener('click', () => editCallback(data));
        document.getElementById('delete-btn')?.addEventListener('click', () => deleteCallback(data.id));
    }
}