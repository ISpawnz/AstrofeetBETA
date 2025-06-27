const pageInitializers = {
    'home': {
        init: async () => (await import('./pages/home.js')).initHomePage(),
        cleanup: async () => (await import('./pages/home.js')).cleanupHomePage()
    },
    'produtos': {
        init: async () => (await import('./pages/produtos.js')).initProductsPage()
    },
    'finalizarpedido': {
        init: async () => (await import('./pages/finalizarpedido.js')).initCheckoutPage()
    },
    'login': {
        init: async () => (await import('./pages/login.js')).initLoginPage()
    },
};

const appContainer = document.getElementById('app-container');
let currentPageCleanup = null;

async function loadPage(page) {
    if (currentPageCleanup) {
        await currentPageCleanup();
        currentPageCleanup = null;
    }

    try {
        const response = await fetch(`src/pages/${page}.html`);
        if (!response.ok) throw new Error(`Página não encontrada: ${page}.html`);
        const content = await response.text();
        appContainer.innerHTML = content;
        
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        const activeLink = document.querySelector(`.nav-link[href="#${page}"]`);
        if (activeLink) activeLink.classList.add('active');

        const pageModule = pageInitializers[page];
        if (pageModule && pageModule.init) {
            await pageModule.init();
        }
        if (pageModule && pageModule.cleanup) {
            currentPageCleanup = pageModule.cleanup;
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
