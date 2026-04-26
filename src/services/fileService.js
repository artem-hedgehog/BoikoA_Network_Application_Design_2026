const fs = require('fs');

/**
 * Чтение данных из JSON-файла
 * @param {string} filePath - путь к файлу
 * @returns {Array} массив объектов
 */
const readData = (filePath) => {
    try {
        const data = fs.readFileSync(filePath, 'utf8');
        return JSON.parse(data);
    } catch (err) {
        console.error('Ошибка чтения файла:', err);
        return [];
    }
};

/**
 * Запись данных в JSON-файл
 * @param {string} filePath - путь к файлу
 * @param {Array} data - массив для сохранения
 */
const writeData = (filePath, data) => {
    try {
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (err) {
        console.error('Ошибка записи файла:', err);
    }
};

module.exports = { readData, writeData };