import { initStorage } from './storage.js';
import { Header } from './components/Header.js';
import { Footer } from './components/Footer.js';
import './legacy/commonHandlers.js';
import './router.js';

initStorage();

const headerContainer = document.getElementById('header');
const footerContainer = document.getElementById('footer');
const header = new Header(headerContainer);
header.render();
const footer = new Footer(footerContainer);
footer.render();
