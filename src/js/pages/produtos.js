import { todosOsProdutos } from '../api.js';
import { addToCart } from '../cart.js';
import { createProductCard } from '../shared/productCard.js';

export function initProductsPage() {
    const state = {
        produtos: todosOsProdutos,
        filtros: { busca: '', marcas: [], categorias: [], tamanho: null, precoMin: 0, precoMax: 500 },
        ordenacao: 'relevancia'
    };

    const DOMElements = {
        gradeProdutos: document.getElementById('grade-produtos'),
        productCount: document.getElementById('product-count'),
        filtroMarcasContainer: document.getElementById('filtro-marcas'),
        filtroCategoriasContainer: document.getElementById('filtro-categorias'),
        filtroTamanhosContainer: document.getElementById('filtro-tamanhos'),
        limparFiltrosBtn: document.getElementById('limpar-filtros-btn'),
        searchInput: document.getElementById('search-input'),
        sortBySelect: document.getElementById('sort-by'),
        priceInputs: document.querySelectorAll(".price-input input"),
        rangeInputs: document.querySelectorAll(".range-input input"),
        rangeProgress: document.querySelector(".slider .progress"),
    };

    function aplicarFiltrosEOrdenar() {
        let produtosFiltrados = [...state.produtos].filter(p => {
            return (p.nome.toLowerCase().includes(state.filtros.busca.toLowerCase())) &&
                   (state.filtros.marcas.length === 0 || state.filtros.marcas.includes(p.marca)) &&
                   (state.filtros.categorias.length === 0 || state.filtros.categorias.includes(p.categoria)) &&
                   (!state.filtros.tamanho || p.tamanhos.includes(state.filtros.tamanho)) &&
                   (p.preco >= state.filtros.precoMin && p.preco <= state.filtros.precoMax);
        });

        switch(state.ordenacao){
            case 'menor-preco': produtosFiltrados.sort((a,b) => a.preco - b.preco); break;
            case 'maior-preco': produtosFiltrados.sort((a,b) => b.preco - a.preco); break;
            case 'avaliacao': produtosFiltrados.sort((a,b) => b.avaliacao - a.avaliacao); break;
        }

        renderizarProdutos(produtosFiltrados);
    }

    function renderizarProdutos(produtos) {
        DOMElements.gradeProdutos.innerHTML = '';
        DOMElements.productCount.textContent = `Exibindo ${produtos.length} de ${state.produtos.length} produtos`;

        if (produtos.length === 0) {
            DOMElements.gradeProdutos.innerHTML = '<p class="empty-message">Nenhum foguete encontrado com esses critérios.</p>';
            return;
        }
        produtos.forEach(p => DOMElements.gradeProdutos.appendChild(createProductCard(p)));
    }

    function renderizarFiltros() {
        const marcas = [...new Set(state.produtos.map(p => p.marca))];
        const categorias = [...new Set(state.produtos.map(p => p.categoria))];
        const tamanhos = [...new Set(state.produtos.flatMap(p => p.tamanhos))].sort((a, b) => a - b);
        
        DOMElements.filtroMarcasContainer.innerHTML = marcas.map(m => `<label><input type="checkbox" name="marca" value="${m}"> ${m}</label>`).join('');
        DOMElements.filtroCategoriasContainer.innerHTML = categorias.map(c => `<label><input type="checkbox" name="categoria" value="${c}"> ${c}</label>`).join('');
        DOMElements.filtroTamanhosContainer.innerHTML = tamanhos.map(t => `<button class="size-button" data-tamanho="${t}">${t}</button>`).join('');
    }

    function setupEventListeners() {
        DOMElements.gradeProdutos.addEventListener('click', e => {
            if (e.target.closest('.add-to-cart-btn')) {
                addToCart(e.target.closest('.product-card').dataset.id);
            }
        });
        
        DOMElements.searchInput.addEventListener('input', e => { state.filtros.busca = e.target.value; aplicarFiltrosEOrdenar(); });
        DOMElements.sortBySelect.addEventListener('change', e => { state.ordenacao = e.target.value; aplicarFiltrosEOrdenar(); });

        DOMElements.filtroMarcasContainer.addEventListener('change', e => {
            if (e.target.type === 'checkbox') {
                state.filtros.marcas = Array.from(DOMElements.filtroMarcasContainer.querySelectorAll('input:checked')).map(cb => cb.value);
                aplicarFiltrosEOrdenar();
            }
        });

        DOMElements.filtroCategoriasContainer.addEventListener('change', e => {
             if (e.target.type === 'checkbox') {
                state.filtros.categorias = Array.from(DOMElements.filtroCategoriasContainer.querySelectorAll('input:checked')).map(cb => cb.value);
                aplicarFiltrosEOrdenar();
            }
        });

        DOMElements.filtroTamanhosContainer.addEventListener('click', e => {
            if(e.target.classList.contains('size-button')) {
                const tamanho = parseInt(e.target.dataset.tamanho);
                if (state.filtros.tamanho === tamanho) {
                    state.filtros.tamanho = null;
                    e.target.classList.remove('active');
                } else {
                    DOMElements.filtroTamanhosContainer.querySelector('.active')?.classList.remove('active');
                    state.filtros.tamanho = tamanho;
                    e.target.classList.add('active');
                }
                aplicarFiltrosEOrdenar();
            }
        });

        DOMElements.rangeInputs.forEach(input => {
            input.addEventListener("input", () => {
                let minVal = parseInt(DOMElements.rangeInputs[0].value);
                let maxVal = parseInt(DOMElements.rangeInputs[1].value);

                if (maxVal - minVal < 10) {
                    if (input.className.includes("range-min")) {
                        DOMElements.rangeInputs[0].value = maxVal - 10;
                    } else {
                        DOMElements.rangeInputs[1].value = minVal + 10;
                    }
                    return; 
                }
                
                DOMElements.priceInputs[0].value = minVal;
                DOMElements.priceInputs[1].value = maxVal;
                DOMElements.rangeProgress.style.left = (minVal / DOMElements.rangeInputs[0].max) * 100 + "%";
                DOMElements.rangeProgress.style.right = 100 - (maxVal / DOMElements.rangeInputs[1].max) * 100 + "%";
                
                state.filtros.precoMin = minVal;
                state.filtros.precoMax = maxVal;
                aplicarFiltrosEOrdenar();
            });
        });

        DOMElements.limparFiltrosBtn.addEventListener('click', () => {
            state.filtros = { busca: '', marcas: [], categorias: [], tamanho: null, precoMin: 0, precoMax: 500 };
            state.ordenacao = 'relevancia';
            
            document.querySelectorAll('#filtro-marcas input, #filtro-categorias input').forEach(cb => cb.checked = false);
            document.querySelectorAll('#filtro-tamanhos .size-button').forEach(btn => btn.classList.remove('active'));
            DOMElements.searchInput.value = '';
            DOMElements.sortBySelect.value = 'relevancia';

            DOMElements.priceInputs[0].value = 0;
            DOMElements.priceInputs[1].value = 500;
            DOMElements.rangeInputs[0].value = 0;
            DOMElements.rangeInputs[1].value = 500;
            DOMElements.rangeProgress.style.left = "0%";
            DOMElements.rangeProgress.style.right = "0%";
            
            aplicarFiltrosEOrdenar();
        });
    }
    
    renderizarFiltros();
    aplicarFiltrosEOrdenar();
    setupEventListeners();
}