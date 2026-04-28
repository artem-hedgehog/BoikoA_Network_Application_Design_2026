/**
 * Класс для генерации URL-адресов API
 */
class StockUrls {
    constructor() {
        // Базовый адрес бэкенда (ЛР4).
        // При необходимости поменять порт, если сервер запущен не на 3000.
        this.baseUrl = 'https://sturdy-couscous-97j9g5q9jpv4f6jp-3000.app.github.dev';
    }

    // Получение списка карточек (с возможной фильтрацией по title)
    getStocks(title = '') {
        let url = `${this.baseUrl}/stocks`;
        if (title) {
            // query-параметр title передаётся для фильтрации на сервере
            url += `?title=${encodeURIComponent(title)}`;
        }
        return url;
    }

    // Получение одной карточки по id
    getStockById(id) {
        return `${this.baseUrl}/stocks/${id}`;
    }

    // Создание новой карточки (POST)
    createStock() {
        return `${this.baseUrl}/stocks`;
    }

    // Обновление карточки (PATCH)
    updateStockById(id) {
        return `${this.baseUrl}/stocks/${id}`;
    }

    // Удаление карточки (DELETE)
    removeStockById(id) {
        return `${this.baseUrl}/stocks/${id}`;
    }
}

export const stockUrls = new StockUrls();