const stocksService = require('../services/stocksService');

/**
 * GET /stocks
 * Получение всех карточек (с фильтром по title)
 */
const getAllStocks = (req, res) => {
    const { title } = req.query;
    const stocks = stocksService.findAll(title);
    res.json(stocks);
};

/**
 * GET /stocks/:id
 * Получение одной карточки по id
 */
const getStockById = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const stock = stocksService.findOne(id);
    if (!stock) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }
    res.json(stock);
};

/**
 * POST /stocks
 * Создание новой карточки
 */
const createStock = (req, res) => {
    const { src, title, text } = req.body;
    // Валидация: все поля обязательны
    if (!src || !title || !text) {
        return res.status(400).json({ error: 'Не все поля заполнены (src, title, text)' });
    }
    const newStock = stocksService.create({ src, title, text });
    res.status(201).json(newStock);
};

/**
 * PATCH /stocks/:id
 * Обновление карточки (частичное)
 */
const updateStock = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const updated = stocksService.update(id, req.body);
    if (!updated) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }
    res.json(updated);
};

/**
 * DELETE /stocks/:id
 * Удаление карточки
 */
const deleteStock = (req, res) => {
    const id = parseInt(req.params.id, 10);
    const success = stocksService.remove(id);
    if (!success) {
        return res.status(404).json({ error: 'Карточка не найдена' });
    }
    res.status(204).send(); // No Content
};

module.exports = {
    getAllStocks,
    getStockById,
    createStock,
    updateStock,
    deleteStock
};