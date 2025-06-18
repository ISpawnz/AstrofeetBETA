import { todosOsProdutos } from '../api.js';

let carouselInterval;

function createPromoCarouselItem(produto) {
    const item = document.createElement('a');
    item.href = '#produtos';
    item.className = 'promo-carousel-item';
    
    item.innerHTML = `
        <img src="${produto.imagem}" alt="${produto.nome}">
        <div class="promo-item-details">
            <span class="brand">${produto.marca}</span>
            <span class="name">${produto.nome}</span>
        </div>
    `;
    return item;
}

function setupPromoPopup() {
    const popupContainer = document.getElementById('promo-popup-container');
    if (!popupContainer) return;

    const carouselContainer = document.getElementById('popup-product-carousel');
    const closeButton = document.getElementById('close-promo-popup');
    const viewAllButton = document.getElementById('promo-popup-cta');

    const produtosDestaque = todosOsProdutos.slice(0, 3);
    carouselContainer.innerHTML = '';
    
    produtosDestaque.forEach(produto => {
        carouselContainer.appendChild(createPromoCarouselItem(produto));
    });

    const slides = carouselContainer.querySelectorAll('.promo-carousel-item');
    let currentIndex = 0;

    function showSlide(index) {
        slides.forEach((slide, i) => {
            slide.classList.remove('active');
            if (i === index) {
                slide.classList.add('active');
            }
        });
    }

    const startCarousel = () => {
        showSlide(currentIndex);
        carouselInterval = setInterval(() => {
            currentIndex = (currentIndex + 1) % slides.length;
            showSlide(currentIndex);
        }, 3500);
    };

    const stopCarousel = () => {
        clearInterval(carouselInterval);
    };

    const showPopup = () => {
        popupContainer.classList.add('show');
        startCarousel();
    };

    const hidePopup = () => {
        popupContainer.classList.add('hide');
        sessionStorage.setItem('promoShown', 'true');
        stopCarousel();
    };
    
    closeButton.addEventListener('click', hidePopup);
    viewAllButton.addEventListener('click', hidePopup);

    if (!sessionStorage.getItem('promoShown')) {
        setTimeout(showPopup, 2000);
    }
}

export function initHomePage() {
    setupPromoPopup();
}