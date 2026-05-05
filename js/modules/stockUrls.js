// js/modules/stockUrls.js
export class StockUrls {
    constructor() {
        this.baseUrl = 'https://sturdy-couscous-97j9g5q9jpv4f6jp-3000.app.github.dev';
    }
    getStocks(title = '') {
        let url = `${this.baseUrl}/stocks`;
        if (title) url += `?title=${encodeURIComponent(title)}`;
        return url;
    }
    getStockById(id) {
        return `${this.baseUrl}/stocks/${id}`;
    }
    createStock() {
        return `${this.baseUrl}/stocks`;
    }
    updateStock(id) {
        return `${this.baseUrl}/stocks/${id}`;
    }
    deleteStock(id) {
        return `${this.baseUrl}/stocks/${id}`;
    }
}

export const stockUrls = new StockUrls();