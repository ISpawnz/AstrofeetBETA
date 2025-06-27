import { initRouter } from './router.js';
import { initCart, closeCart } from './cart.js';
import { initUI } from './ui.js';
import { initLoginModal } from './pages/login.js';

function app() {
    initCart();
    initUI({ closeCart });
    initLoginModal();
    initRouter();
}

document.addEventListener('DOMContentLoaded', app);
