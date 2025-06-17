const pageInitializers = {
    'home': async () => (await import('./pages/home.js')).initHomePage(),
    'produtos': async () => (await import('./pages/produtos.js')).initProductsPage(),
    'finalizarpedido': async () => (await import('./pages/finalizarpedido.js')).initCheckoutPage(),
};

const appContainer = document.getElementById('app-container');

async function loadPage(page) {
    try {
        // A CORREÇÃO ESTÁ AQUI: Removi a barra "/" do início do caminho.
        const response = await fetch(`src/pages/${page}.html`);
        
        if (!response.ok) throw new Error(`Página não encontrada: ${page}.html`);
        const content = await response.text();
        appContainer.innerHTML = content;
        
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${page}"]`);
        if (activeLink) activeLink.classList.add('active');

        if (pageInitializers[page]) {
            await pageInitializers[page]();
        }

    } catch (error) {
        console.error("Erro ao carregar a página:", error);
        appContainer.innerHTML = `<h1>Erro 404: ${page} não encontrada</h1>`;
    }
}

export function initRouter() {
    const handleLocation = () => {
        const page = location.hash.substring(1) || 'home';
        loadPage(page);
    };
    window.addEventListener('hashchange', handleLocation);
    handleLocation();
}