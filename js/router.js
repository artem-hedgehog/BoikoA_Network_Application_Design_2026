import { MainPage } from './pages/MainPage.js';
import { ProductPage } from './pages/ProductPage.js';
import { CalculatorPage } from './pages/CalculatorPage.js';


import { TasksPage } from './pages/TasksPage.js';

// внутри функции route:



const root = document.getElementById('root');

function route() {
    const hash = window.location.hash.slice(1) || '/';
    if (hash === '/') {
        const mainPage = new MainPage(root);
        mainPage.render();
    } else if (hash.startsWith('product/')) {
        const id = parseInt(hash.split('/')[1]);
        if (isNaN(id)) {
            root.innerHTML = '<div class="alert alert-danger">Неверный ID товара</div>';
            return;
        }
        const productPage = new ProductPage(root, id);
        productPage.render();
    } else if (hash === 'calculator') {
        const calcPage = new CalculatorPage(root);
        calcPage.render();
    } else if (hash === 'tasks') {
    const tasksPage = new TasksPage(root);
    tasksPage.render();
    } else {
        root.innerHTML = '<div class="alert alert-danger">Страница не найдена</div>';
    }
}

window.addEventListener('hashchange', route);
window.addEventListener('load', route);
