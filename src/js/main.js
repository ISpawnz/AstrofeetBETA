import { initRouter } from './router.js';
import { initCart, closeCart } from './cart.js';
import { initUI } from './ui.js';

function app() {
    initCart();
    initUI({ closeCart });
    initRouter();
}

document.addEventListener('DOMContentLoaded', app);