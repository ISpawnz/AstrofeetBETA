import { todosOsProdutos } from './api.js';
import { showToast } from './ui.js';

let carrinho = [];

const DOMElements = {
    get carrinhoSidebar() { return document.getElementById('carrinho'); },
    get fecharCarrinhoBtn() { return document.getElementById('fecharCarrinho'); },
    get listaCarrinho() { return document.getElementById('listaCarrinho'); },
    get totalCarrinhoEl() { return document.getElementById('totalCarrinho'); },
    get cartCount() { return document.getElementById('cart-count'); },
    get finalizarCompraBtn() { return document.getElementById('finalizar-compra-btn'); },
    get overlay() { return document.getElementById('overlay'); }
};

function saveAndRender() {
    localStorage.setItem('astrofeetCarrinho', JSON.stringify(carrinho));
    renderCart();
}

function renderCart() {
    const { listaCarrinho, totalCarrinhoEl, cartCount, finalizarCompraBtn } = DOMElements;
    if (!listaCarrinho) return;

    listaCarrinho.innerHTML = '';
    finalizarCompraBtn.disabled = carrinho.length === 0;

    if (carrinho.length === 0) {
        listaCarrinho.innerHTML = '<p class="cart-empty-message">Seu foguete está vazio.</p>';
    } else {
        carrinho.forEach(item => {
            const itemEl = document.createElement('div');
            itemEl.className = 'cart-item';
            itemEl.innerHTML = `<img src="${item.imagem}" alt="${item.nome}" class="cart-item-img"><div class="cart-item-details"><p class="cart-item-name">${item.nome}</p><p class="cart-item-price">R$ ${item.preco.toFixed(2)}</p><div class="cart-item-quantity"><button class="quantity-btn diminuir" data-id="${item.id}">-</button><span>${item.quantidade}</span><button class="quantity-btn aumentar" data-id="${item.id}">+</button></div></div><button class="cart-item-remove" data-id="${item.id}">&times;</button>`;
            listaCarrinho.appendChild(itemEl);
        });
    }
    const total = carrinho.reduce((acc, item) => acc + (item.preco * item.quantidade), 0);
    totalCarrinhoEl.textContent = `R$ ${total.toFixed(2)}`;
    cartCount.textContent = carrinho.reduce((acc, item) => acc + item.quantidade, 0);
}

function handleQuantityChange(produtoId, change) {
    const item = carrinho.find(item => item.id === produtoId);
    if (item) {
        item.quantidade += change;
        if (item.quantidade <= 0) {
            carrinho = carrinho.filter(i => i.id !== produtoId);
            showToast(`${item.nome} ejetado da nave.`);
        }
        saveAndRender();
    }
}

export function addToCart(produtoId) {
    const produto = todosOsProdutos.find(p => p.id === produtoId);
    if (!produto) return;
    
    const itemExistente = carrinho.find(item => item.id === produtoId);
    
    if (itemExistente) {
        itemExistente.quantidade++;
    } else {
        carrinho.push({ ...produto, quantidade: 1 });
        openCart();
    }
    
    showToast(`${produto.nome} adicionado à nave!`);
    saveAndRender();
}

export function getCartContents() {
    return [...carrinho];
}

export function openCart() {
    DOMElements.carrinhoSidebar.classList.add('open');
    DOMElements.overlay.classList.remove('oculto');
}

export function closeCart() {
    DOMElements.carrinhoSidebar.classList.remove('open');
    if (!document.querySelector('.help-modal:not(.oculto)')) {
        DOMElements.overlay.classList.add('oculto');
    }
}

export function initCart() {
    carrinho = JSON.parse(localStorage.getItem('astrofeetCarrinho')) || [];
    renderCart();

    document.getElementById('carrinhoBtn').addEventListener('click', (event) => {
        event.preventDefault();
        openCart();
    });

    DOMElements.fecharCarrinhoBtn.addEventListener('click', closeCart);
    
    DOMElements.listaCarrinho.addEventListener('click', e => {
        const id = e.target.dataset.id;
        if (!id) return;
        if (e.target.classList.contains('aumentar')) handleQuantityChange(id, 1);
        if (e.target.classList.contains('diminuir')) handleQuantityChange(id, -1);
        if (e.target.classList.contains('cart-item-remove')) handleQuantityChange(id, -Infinity);
    });
    
    DOMElements.finalizarCompraBtn.addEventListener('click', () => {
        location.hash = '#finalizarpedido'; 
        closeCart();
    });
}