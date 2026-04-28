import { HeaderComponent } from "./components/header/index.js";
import { MainPage } from "./pages/main/index.js";
import { ProductPage } from "./pages/product/index.js";
import { CreatePage } from "./pages/create/index.js";

const root = document.getElementById('root');
const headerContainer = document.getElementById('header');

function route() {
    const hash = window.location.hash.slice(1) || '/';
    let page = null;

    if (hash === '/' || hash === '') {
        page = new MainPage(root);
    } else if (hash.startsWith('product/')) {
        const id = parseInt(hash.split('/')[1], 10);
        page = new ProductPage(root, id);
    } else if (hash === 'create') {
        page = new CreatePage(root);
    } else {
        root.innerHTML = '<div class="alert alert-danger">Страница не найдена</div>';
        return;
    }

    page.render();
}

window.addEventListener('hashchange', route);
window.addEventListener('load', () => {
    const header = new HeaderComponent(headerContainer);
    header.render(
        () => window.location.hash = '/',
        () => window.location.hash = 'create'
    );
    route();
});