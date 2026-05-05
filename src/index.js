const express = require('express');
const path = require('path');
const cors = require('cors');
const stocksRouter = require('./routes/stocks');
const stocksService = require('./services/stocksService');

const app = express();
const PORT = 3000;

app.use(cors());

const DATA_FILE_PATH = path.join(__dirname, 'data', 'stocks.json');


stocksService.init(DATA_FILE_PATH);


app.use(express.json());


app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    next();
});


app.use('/stocks', stocksRouter);

app.get('/', (req, res) => {
  res.send('Express сервер работает!');
});


app.listen(PORT, () => {
    console.log(`Сервер запущен на http://localhost:${PORT}`);
});

app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type');
    res.sendStatus(204);
});