export class Header {
    constructor(container) {
        this.container = container;
    }

    injectStyles() {
        if (document.getElementById('header-styles')) return;
        const style = document.createElement('style');
        style.id = 'header-styles';
        style.textContent = `
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            body {
                font-family: 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
                background-color: #f8f8f8;
                color: #242424;
                min-height: 100vh;
            }
            .wrapper {
                display: flex;
                flex-direction: column;
                min-height: 100vh;
            }
            .main {
                flex: 1;
                background-color: white;
                padding: 24px 0;
            }
            .main__container, .footer__container, .header__container {
                max-width: 1280px;
                margin: 0 auto;
                padding: 0 16px;
            }
            .header {
                background: linear-gradient(97.26deg, #ed3cca 0.49%, #df34d2 14.88%, #d02bd9 29.27%, #bf22e1 43.14%, #ae1ae8 57.02%, #9a10f0 70.89%, #8306f7 84.76%, #7c1af8 99.15%);
                background-blend-mode: overlay;
                color: #FFFFFF;
                padding: 8px 0;
                position: relative;
                box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
            .header::before {
                content: '';
                position: absolute;
                top: 0;
                left: 0;
                right: 0;
                bottom: 0;
                background: rgba(0,0,0,0.05);
                pointer-events: none;
            }
            .header__top {
                display: flex;
                justify-content: space-between;
                align-items: center;
                padding-bottom: 8px;
                border-bottom: 1px solid rgba(255,255,255,0.2);
                margin-bottom: 8px;
                font-size: 13px;
            }
            .simple-menu {
                list-style: none;
                display: flex;
                gap: 24px;
            }
            .simple-menu__link {
                color: rgba(255,255,255,0.8);
                text-decoration: none;
                cursor: pointer;
            }
            .simple-menu__link:hover { color: #FFFFFF; }
            .header__balance-block { color: rgba(255,255,255,0.8); }
            .header__bottom {
                display: flex;
                align-items: center;
                gap: 24px;
            }
            .nav-element {
                display: flex;
                align-items: center;
                gap: 12px;
            }
            .logo svg {
                fill: #FFFFFF;
                width: 216px;
                height: 58px;
                display: block;
            }
            .burger {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
            }
            .search-catalog {
                flex-grow: 1;
                display: flex;
                background-color: white;
                border-radius: 8px;
                overflow: hidden;
            }
            .search-catalog__input {
                flex-grow: 1;
                border: none;
                padding: 12px 16px;
                font-size: 14px;
                outline: none;
            }
            .search-catalog__btn {
                background-color: #ffd83d;
                border: none;
                width: 60px;
                font-size: 18px;
                cursor: pointer;
            }
            .search-catalog__btn:hover { background-color: #f3cd35; }
            .navbar-pc {
                display: flex;
                gap: 20px;
                color: white;
            }
            .navbar-pc__link {
                color: white;
                text-decoration: none;
                font-size: 13px;
                text-align: center;
                display: flex;
                flex-direction: column;
                align-items: center;
            }
            .navbar-pc__icon {
                font-size: 22px;
                margin-bottom: 4px;
            }
        `;
        document.head.appendChild(style);
    }

    render() {
        this.injectStyles();
        this.container.innerHTML = `
            <header class="header">
                <div class="header__container">
                    <div class="header__top">
                        <ul class="simple-menu">
                            <li class="simple-menu__item"><span class="simple-menu__link">Москва</span></li>
                            <li class="simple-menu__item"><a href="#" class="simple-menu__link">Работа в WB</a></li>
                            <li class="simple-menu__item"><a href="#" class="simple-menu__link">Для бизнеса</a></li>
                            <li class="simple-menu__item"><a href="#" class="simple-menu__link" id="calc-nav-link">Калькулятор</a></li>
                            <li class="simple-menu__item"><a href="#tasks" class="simple-menu__link">Задачи</a></li>
                            <li class="simple-menu__item"><a href="#" class="simple-menu__link">Авиабилеты</a></li>
                            <li class="simple-menu__item"><span class="simple-menu__link">RUB</span></li>
                        </ul>
                        <div class="header__balance-block">0 баллов</div>
                    </div>
                    <div class="header__bottom">
                        <div class="nav-element">
                            <a href="#" class="logo" id="home-logo">
                                <svg width="150" height="38" viewBox="0 0 216 58" fill="#000">
                                    <path d="M201.056 24.85c0-1.35 1.841-2.439 4.253-2.439 2.516 0 5.084 1.194 6.821 3.14l3.139-3.84c-2.983-2.648-6.018-4.023-9.804-4.023-4.721 0-9.596 2.18-9.596 7.162 0 6.125 5.29 6.566 9.596 6.93 2.412.18 4.539.363 4.539 1.946 0 1.712-2.438 2.49-4.591 2.49-2.49 0-5.187-1.063-7.158-3.425l-3.346 3.556c2.671 3.27 6.536 4.697 10.322 4.697 4.747 0 9.96-2.258 9.96-7.422 0-5.84-5.343-6.41-9.441-6.825-2.568-.26-4.694-.493-4.694-1.947Zm-23.861 1.454c.856-2.154 2.697-3.4 5.42-3.4 2.749 0 4.383 1.323 5.084 3.4h-10.504Zm5.68-8.616c-6.484 0-11.698 5.06-11.698 11.704 0 6.254 4.617 11.652 11.412 11.652 4.098 0 7.418-1.973 9.778-5.346l-3.579-3.036c-1.271 1.946-3.553 3.088-6.277 3.088-2.775 0-5.654-2.076-5.887-5.139h16.936v-1.816c-.026-6.41-4.409-11.107-10.686-11.107Zm-66.345 0c-6.484 0-11.697 5.06-11.697 11.704 0 6.254 4.617 11.652 11.412 11.652 4.098 0 7.418-1.973 9.778-5.346l-3.579-3.036c-1.271 1.946-3.553 3.088-6.277 3.088-2.775 0-5.654-2.076-5.887-5.139h16.936v-1.816c-.026-6.41-4.409-11.107-10.686-11.107Zm46.815 22.551h5.187V18.492h-5.187V40.24Zm2.593-32.335c-2.1 0-3.89 1.765-3.89 3.97 0 2.18 1.738 3.79 3.994 3.79 2.205 0 3.813-1.557 3.813-3.711-.026-2.206-1.79-4.049-3.917-4.049ZM90.75 17.662c-2.438 0-4.642.727-6.51 1.998V8.164h-5.187v21.228c0 6.461 5.265 11.652 11.671 11.652 6.458 0 11.749-5.164 11.749-11.704-.026-6.514-5.213-11.678-11.723-11.678Zm-26.973.363c-5.784.597-10.505 5.58-10.505 11.523 0 6.28 5.37 11.548 11.646 11.548 6.25 0 11.645-5.268 11.645-11.548 0-2.673-.96-5.139-2.516-7.085L62.532 8.19h-6.718l7.963 9.835ZM23.576 30.871l-4.747-12.379H15.2l-4.773 12.379-4.772-12.379H0l8.351 21.8h3.631l5.006-12.976 5.058 12.975h3.63l8.326-21.799h-5.628l-4.798 12.379Zm111.55-7.422v-4.957h-5.187V40.24h5.187v-9.186c0-4.464 4.773-7.189 9.519-7.189v-5.372h-.519c-4.02 0-6.925 1.454-9 4.957Zm16.47 0v-4.957h-5.187V40.24h5.187v-9.186c0-4.464 4.772-7.189 9.518-7.189v-5.372h-.518c-3.995 0-6.899 1.454-9 4.957ZM45.414 40.239H50.6V8.19h-5.187v32.05Zm19.53-4.386c-3.58 0-6.484-2.88-6.484-6.461 0-3.607 2.904-6.488 6.458-6.488 3.605 0 6.536 2.88 6.536 6.488 0 3.581-2.931 6.461-6.51 6.461Zm25.78 0a6.471 6.471 0 0 1-6.484-6.487c0-3.555 2.775-6.462 6.51-6.462s6.51 2.907 6.51 6.436c0 3.685-2.957 6.513-6.536 6.513Zm-54.31 4.386h5.187V18.492h-5.187V40.24Zm2.542-32.335c-2.101 0-3.865 1.765-3.865 3.997 0 2.258 1.842 3.789 3.865 3.789 2.256 0 3.968-1.869 3.968-3.893-.026-2.05-1.816-3.893-3.968-3.893Zm71.894 18.4c.882-2.154 2.698-3.4 5.395-3.4 2.775 0 4.461 1.323 5.161 3.4H110.85Z"></path>
                                </svg>
                            </a>
                            <button class="burger" type="button">☰</button>
                        </div>
                        <div class="search-catalog">
                            <input class="search-catalog__input" type="search" placeholder="Найти на Wildberries">
                            <button class="search-catalog__btn" type="button">🔍</button>
                        </div>
                        <div class="navbar-pc">
                            <a href="#" class="navbar-pc__link"><span class="navbar-pc__icon">📍</span><p>Заказы</p></a>
                            <a href="#" class="navbar-pc__link"><span class="navbar-pc__icon">❤️</span><p>Избранное</p></a>
                            <a href="#" class="navbar-pc__link"><span class="navbar-pc__icon">👤</span><p>Профиль</p></a>
                            <a href="#" class="navbar-pc__link"><span class="navbar-pc__icon">🛒</span><p>Корзина</p></a>
                        </div>
                    </div>
                </div>
            </header>
        `;
        // Добавляем обработчики навигации (через хэш)
        const homeLogo = document.getElementById('home-logo');
        const calcNavLink = document.getElementById('calc-nav-link');
        if (homeLogo) {
            homeLogo.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.hash = '/';
            });
        }
        if (calcNavLink) {
            calcNavLink.addEventListener('click', (e) => {
                e.preventDefault();
                window.location.hash = 'calculator';
            });
        }
    }
}
