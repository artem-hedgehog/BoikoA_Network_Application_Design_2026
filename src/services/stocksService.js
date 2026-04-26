const fileService = require('./fileService');

let dataFilePath;

/**
 * Инициализация сервиса путём к файлу данных
 * @param {string} path 
 */
const init = (path) => {
    dataFilePath = path;
};

/**
 * Получение всех карточек с возможностью фильтрации по title
 * @param {string} title - опциональный параметр для фильтрации
 * @returns {Array} отфильтрованный массив карточек
 */
const findAll = (title) => {
    const stocks = fileService.readData(dataFilePath);
    if (title) {
        return stocks.filter(stock =>
            stock.title.toLowerCase().includes(title.toLowerCase())
        );
    }
    return stocks;
};

/**
 * Поиск карточки по id
 * @param {number} id 
 * @returns {object|null} карточка или null
 */
const findOne = (id) => {
    const stocks = fileService.readData(dataFilePath);
    return stocks.find(stock => stock.id === id) || null;
};

/**
 * Создание новой карточки
 * @param {object} stockData - данные { src, title, text }
 * @returns {object} созданная карточка с присвоенным id
 */
const create = (stockData) => {
    const stocks = fileService.readData(dataFilePath);
    const newId = stocks.length > 0 ? Math.max(...stocks.map(s => s.id)) + 1 : 1;
    const newStock = { id: newId, ...stockData };
    stocks.push(newStock);
    fileService.writeData(dataFilePath, stocks);
    return newStock;
};

/**
 * Обновление существующей карточки
 * @param {number} id 
 * @param {object} stockData - частичные данные для обновления
 * @returns {object|null} обновлённая карточка или null
 */
const update = (id, stockData) => {
    const stocks = fileService.readData(dataFilePath);
    const index = stocks.findIndex(s => s.id === id);
    if (index === -1) return null;
    stocks[index] = { ...stocks[index], ...stockData };
    fileService.writeData(dataFilePath, stocks);
    return stocks[index];
};

/**
 * Удаление карточки по id
 * @param {number} id 
 * @returns {boolean} true если удалено, false если не найдено
 */
const remove = (id) => {
    const stocks = fileService.readData(dataFilePath);
    const filtered = stocks.filter(s => s.id !== id);
    if (filtered.length === stocks.length) return false;
    fileService.writeData(dataFilePath, filtered);
    return true;
};

module.exports = { init, findAll, findOne, create, update, remove };