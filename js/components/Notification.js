export const Notification = {
    show(message, type = 'primary') {
        const container = document.getElementById('toast-container');
        if (!container) return;
        const toastId = 'toast-' + Date.now();
        const toastHtml = `
            <div id="${toastId}" class="toast align-items-center text-white bg-${type} border-0" role="alert" aria-live="assertive" aria-atomic="true" data-bs-autohide="true" data-bs-delay="3000">
                <div class="d-flex">
                    <div class="toast-body">${message}</div>
                    <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast" aria-label="Закрыть"></button>
                </div>
            </div>
        `;
        container.insertAdjacentHTML('beforeend', toastHtml);
        const toastEl = document.getElementById(toastId);
        const toast = new bootstrap.Toast(toastEl);
        toast.show();
        toastEl.addEventListener('hidden.bs.toast', () => toastEl.remove());
    },
    injectStyles() {
        if (document.getElementById('notification-styles')) return;
        const style = document.createElement('style');
        style.id = 'notification-styles';
        style.textContent = `
            #toast-container {
                position: fixed;
                bottom: 0;
                right: 0;
                padding: 1rem;
                z-index: 1100;
            }
        `;
        document.head.appendChild(style);
    }
};
Notification.injectStyles();
