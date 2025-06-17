const DOMElements = {
    get overlay() { return document.getElementById('overlay'); },
    get toastContainer() { return document.getElementById('toast-container'); },
    get assistente() { return document.getElementById('assistente-flutuante'); },
    get modalAjuda() { return document.getElementById('modal-ajuda'); },
    get fecharModalAjudaBtn() { return document.getElementById('fechar-modal-ajuda'); }
};

export function showToast(message) {
    const toast = document.createElement('div');
    toast.className = 'toast show';
    toast.textContent = message;
    DOMElements.toastContainer.appendChild(toast);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 500);
    }, 3000);
}

function openHelpModal() {
    DOMElements.modalAjuda.classList.remove('oculto');
    DOMElements.overlay.classList.remove('oculto');
}

function closeHelpModal() {
    DOMElements.modalAjuda.classList.add('oculto');
    if (!document.querySelector('.cart-sidebar.open')) {
        DOMElements.overlay.classList.add('oculto');
    }
}

export function initUI({ closeCart }) {
    DOMElements.assistente.addEventListener('click', openHelpModal);
    DOMElements.fecharModalAjudaBtn.addEventListener('click', closeHelpModal);
    
    DOMElements.overlay.addEventListener('click', () => {
        closeCart();
        closeHelpModal();
    });

    document.querySelectorAll('.help-option').forEach(button => {
        button.addEventListener('click', (e) => {
            const numeroWhatsApp = "553183024952";
            const mensagem = encodeURIComponent(e.target.dataset.message);
            window.open(`https://wa.me/${numeroWhatsApp}?text=${mensagem}`, '_blank');
            closeHelpModal();
        });
    });
}