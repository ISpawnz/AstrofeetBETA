export function createProductCard(produto) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.dataset.id = produto.id;
    
    const ratingStars = '★'.repeat(Math.round(produto.avaliacao)) + '☆'.repeat(5 - Math.round(produto.avaliacao));
    
    card.innerHTML = `
        <div class="card-image-container">
            <img src="${produto.imagem}" alt="${produto.nome}" class="card-image">
        </div>
        <div class="card-content">
            <span class="card-brand">${produto.marca}</span>
            <h3 class="card-title">${produto.nome}</h3>
            <div class="card-rating">${ratingStars} <span>(${produto.avaliacao})</span></div>
            <p class="card-price">R$ ${produto.preco.toFixed(2).replace('.', ',')}</p>
            <button class="cta-button add-to-cart-btn">Adicionar à Nave</button>
        </div>`;
        
    return card;
}