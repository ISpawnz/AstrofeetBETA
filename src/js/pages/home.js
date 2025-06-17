import { todosOsProdutos } from '../api.js';
import { addToCart } from '../cart.js';
import { createProductCard } from '../shared/productCard.js';

export function initHomePage() {
    const gradeDestaques = document.getElementById('grade-destaques');
    if (!gradeDestaques) return;

    const produtosDestaque = todosOsProdutos.slice(0, 3);
    gradeDestaques.innerHTML = '';
    produtosDestaque.forEach(produto => {
        gradeDestaques.appendChild(createProductCard(produto));
    });

    gradeDestaques.addEventListener('click', e => {
        const button = e.target.closest('.add-to-cart-btn');
        if (button) {
            const card = e.target.closest('.product-card');
            if (card) {
                addToCart(card.dataset.id);
            }
        }
    });

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('.animate-on-scroll').forEach(el => observer.observe(el));
}