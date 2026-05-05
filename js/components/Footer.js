export class Footer {
    constructor(container) {
        this.container = container;
    }

    injectStyles() {
        if (document.getElementById('footer-styles')) return;
        const style = document.createElement('style');
        style.id = 'footer-styles';
        style.textContent = `
            .footer {
                background-color: #d3d4dd;
                color: #242424;
                padding: 40px 0;
                font-size: 13px;
                position: relative;
            }
            .footer__nav {
                display: grid;
                grid-template-columns: repeat(4, 1fr);
                gap: 32px;
                margin-bottom: 40px;
            }
            .footer__header {
                color: #242424;
                font-size: 16px;
                margin-bottom: 16px;
            }
            .footer__list {
                list-style: none;
            }
            .footer__item {
                margin-bottom: 8px;
            }
            .footer__item a {
                color: #242424;
                text-decoration: none;
            }
            .footer__item a:hover { color: #6E00D1; }
            .footer__add-info {
                border-top: 1px solid rgba(0,0,0,0.1);
                padding-top: 24px;
                text-align: center;
            }
        `;
        document.head.appendChild(style);
    }

    render() {
        this.injectStyles();
        this.container.innerHTML = `
            <footer class="footer">
                <div class="footer__container">
                    <div class="footer__nav">
                        <section class="footer__list-wrap">
                            <h2 class="footer__header">Покупателям</h2>
                            <ul class="footer__list">
                                <li class="footer__item"><a href="#">Частые вопросы</a></li>
                                <li class="footer__item"><a href="#">Покупать как бизнес</a></li>
                                <li class="footer__item"><a href="#">Доставка по клику</a></li>
                            </ul>
                        </section>
                        <section class="footer__list-wrap">
                            <h2 class="footer__header">Продавцам</h2>
                            <ul class="footer__list">
                                <li class="footer__item"><a href="#">Продавать товары</a></li>
                                <li class="footer__item"><a href="#">Открыть пункт выдачи</a></li>
                                <li class="footer__item"><a href="#">Предложить помещение</a></li>
                            </ul>
                        </section>
                        <section class="footer__list-wrap">
                            <h2 class="footer__header">Компания</h2>
                            <ul class="footer__list">
                                <li class="footer__item"><a href="#" id="about-link">О нас</a></li>
                                <li class="footer__item"><a href="#">Контакты</a></li>
                                <li class="footer__item"><a href="#">Вакансии</a></li>
                            </ul>
                        </section>
                    </div>
                    <div class="footer__add-info">
                        <p class="footer__copyrights">© 2026 WB Копия</p>
                    </div>
                </div>
            </footer>
        `;
    }
}