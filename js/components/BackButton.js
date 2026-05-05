export class BackButton {
    constructor(container, onClick) {
        this.container = container;
        this.onClick = onClick;
    }

    injectStyles() {
        if (document.getElementById('back-button-styles')) return;
        const style = document.createElement('style');
        style.id = 'back-button-styles';
        style.textContent = `
            .back-button {
                display: inline-block;
                margin-bottom: 24px;
                color: #6E00D1;
                text-decoration: none;
                cursor: pointer;
                font-size: 16px;
            }
            .back-button:hover {
                text-decoration: underline;
            }
        `;
        document.head.appendChild(style);
    }

    render() {
        this.injectStyles();
        const btn = document.createElement('a');
        btn.className = 'back-button';
        btn.innerHTML = '← На главную';
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            if (this.onClick) this.onClick();
        });
        this.container.appendChild(btn);
    }
}