import { getCartContents } from '../cart.js';

export function initCheckoutPage() {
    const cartItems = getCartContents();
    const itemsContainer = document.getElementById('checkout-items');
    const totalContainer = document.getElementById('checkout-total');
    
    if (!itemsContainer || !totalContainer) return;

    if (cartItems.length === 0) {
        itemsContainer.innerHTML = "<p>Seu carrinho está vazio.</p>";
        totalContainer.innerHTML = "";
        return;
    }

    let total = 0;
    itemsContainer.innerHTML = '';
    cartItems.forEach(item => {
        const itemTotal = item.preco * item.quantidade;
        total += itemTotal;
        itemsContainer.innerHTML += `
            <div class="checkout-item" style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                <span>${item.quantidade}x ${item.nome}</span>
                <span>R$ ${itemTotal.toFixed(2)}</span>
            </div>
        `;
    });

    totalContainer.innerHTML = `<hr style="margin: 1rem 0;"><strong style="display: flex; justify-content: space-between; font-size: 1.2em;"><span>Total:</span> <span>R$ ${total.toFixed(2)}</span></strong>`;
}