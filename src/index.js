const express = require('express');
const path = require('path');
const stocksRouter = require('./routes/stocks');
const stocksService = require('./services/stocksService');

const app = express();
const PORT = 3000;

// Путь к JSON-файлу с данными
const DATA_FILE_PATH = path.join(__dirname, 'data', 'stocks.json');

// Инициализация сервиса
stocksService.init(DATA_FILE_PATH);

// Middleware для парсинга JSON тела запроса
app.use(express.json());

// Логгирующий middleware (для отладки)
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});

// Подключение маршрутов для /stocks
app.use('/stocks', stocksRouter);

// Обработка 404 – не найден маршрут
app.use((req, res) => {
    res.status(404).json({ error: 'Маршрут не найден' });
});

// Глобальный обработчик ошибок (для синхронных и асинхронных ошибок)
app.use((err, req, res, next) => {
    console.error('Ошибка сервера:', err);
    res.status(500).json({ error: 'Внутренняя ошибка сервера' });
});

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});