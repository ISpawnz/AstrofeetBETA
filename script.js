let carrinho = [];


function adicionarAoCarrinho(nome, preco) {
    let itemExistente = carrinho.find(item => item.nome === nome);
    if (!itemExistente) {
        carrinho.push({ nome: nome, preco: preco, quantidade: 1 });
        document.getElementById(`quantidade-${nome}`).textContent = 1;
        atualizarCarrinho();
        alternarControles(nome, true);  
        abrirCarrinho();  
    }
}


function alterarQuantidade(nome, preco, quantidade) {
    let itemExistente = carrinho.find(item => item.nome === nome);
    if (itemExistente) {
        itemExistente.quantidade += quantidade;
        if (itemExistente.quantidade <= 0) {
            removerDoCarrinho(nome);
        } else {
            atualizarCarrinho();
            document.getElementById(`quantidade-${nome}`).textContent = itemExistente.quantidade;
        }
    }
}


function removerDoCarrinho(nome) {
    carrinho = carrinho.filter(item => item.nome !== nome);
    atualizarCarrinho();
    document.getElementById(`quantidade-${nome}`).textContent = 0;
    alternarControles(nome, false); 

    
    if (carrinho.length === 0) {
        fecharCarrinho();
    }
}


function alternarControles(none, mostrarControles) {
    const botaoAdicionar = document.querySelector(`#produto1 button`);
    const controlesQuantidade = document.querySelector(`#produto1 .controle-quantidade`);
    if (mostrarControles) {
        botaoAdicionar.classList.add('oculto');
        controlesQuantidade.classList.remove('oculto');
    } else {
        botaoAdicionar.classList.remove('oculto');
        controlesQuantidade.classList.add('oculto');
    }
}


    function alternarControles(none, mostrarControles) {
    const botaoAdicionar = document.querySelector(`#produto2 button`);
    const controlesQuantidade = document.querySelector(`#produto2 .controle-quantidade`);
    if (mostrarControles) {
        botaoAdicionar.classList.add('oculto');
        controlesQuantidade.classList.remove('oculto');
    } else {
        botaoAdicionar.classList.remove('oculto');
        controlesQuantidade.classList.add('oculto');
    }
}


function atualizarCarrinho() {
    let listaCarrinho = document.getElementById('listaCarrinho');
    listaCarrinho.innerHTML = '';

    let total = 0;
    carrinho.forEach(item => {
        let li = document.createElement('li');
        li.textContent = `${item.nome} - R$ ${item.preco.toFixed(2)} (Qtd: ${item.quantidade})`;
        listaCarrinho.appendChild(li);
        total += item.preco * item.quantidade;
    });

    document.getElementById('totalCarrinho').textContent = `Total: R$ ${total.toFixed(2)}`;
}


function abrirCarrinho() {
    document.querySelector('.carrinho').style.display = 'block';
}

function fecharCarrinho() {
    document.querySelector('.carrinho').style.display = 'none';
}


function finalizarCompra() {
    window.location.href = "finalizarPedido.html";
}

document.getElementById('carrinhoBtn').onclick = abrirCarrinho;
function filtrarProdutos() {
    const categoriaSelecionada = document.getElementById('categoria').value;
    const precoMaximo = parseFloat(document.getElementById('preco-maximo').value);

    const produtos = document.querySelectorAll('.produto');
    produtos.forEach(produto => {
        const categoriaProduto = produto.getAttribute('data-categoria');
        const precoProduto = parseFloat(produto.querySelector('p').textContent.replace('Preço: R$ ', '').replace(',', '.'));

        if (
            (categoriaSelecionada === 'todas' || categoriaProduto === categoriaSelecionada) &&
            (isNaN(precoMaximo) || precoProduto <= precoMaximo)
        ) {
            produto.style.display = 'block';
        } else {
            produto.style.display = 'none';
        }
    });
}

