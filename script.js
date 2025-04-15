document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const novaListaBtn = document.getElementById('nova-lista');
    const nomeListaInput = document.getElementById('nome-lista-input');
    const nomeListaAtiva = document.getElementById('nome-lista-ativa');
    const novoItemInput = document.getElementById('novo-item');
    const adicionarItemBtn = document.getElementById('adicionar-item');
    const itensLista = document.getElementById('itens-lista');
    const salvarListaBtn = document.getElementById('salvar-lista');
    const limparListaBtn = document.getElementById('limpar-lista');
    const compartilharListaBtn = document.getElementById('compartilhar-lista');
    const listasContainer = document.querySelector('.listas-container');
    
    // Variáveis de estado
    let listaAtual = {
        nome: 'Nova Lista',
        itens: [],
        data: new Date()
    };
    
    let listasSalvas = JSON.parse(localStorage.getItem('listasCompras')) || [];
    
    // Funções
    function atualizarListaAtiva() {
        nomeListaAtiva.textContent = listaAtual.nome;
        nomeListaInput.value = listaAtual.nome;
        
        itensLista.innerHTML = '';
        listaAtual.itens.forEach((item, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item}</span>
                <button class="remover-item" data-index="${index}">×</button>
            `;
            itensLista.appendChild(li);
        });
        
        // Adiciona eventos aos botões de remover
        document.querySelectorAll('.remover-item').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                listaAtual.itens.splice(index, 1);
                atualizarListaAtiva();
            });
        });
    }
    
    function salvarLista() {
        listaAtual.nome = nomeListaInput.value || 'Lista sem nome';
        listaAtual.data = new Date();
        
        // Verifica se já existe uma lista com esse nome
        const indexExistente = listasSalvas.findIndex(lista => lista.nome === listaAtual.nome);
        
        if (indexExistente !== -1) {
            listasSalvas[indexExistente] = {...listaAtual};
        } else {
            listasSalvas.push({...listaAtual});
        }
        
        localStorage.setItem('listasCompras', JSON.stringify(listasSalvas));
        carregarListasSalvas();
        alert('Lista salva com sucesso!');
    }
    
    function carregarListasSalvas() {
        listasContainer.innerHTML = '';
        listasSalvas.forEach(lista => {
            const div = document.createElement('div');
            div.className = 'lista-salva';
            div.innerHTML = `
                <h3>${lista.nome}</h3>
                <p>${lista.itens.length} itens</p>
                <p>${new Date(lista.data).toLocaleDateString()}</p>
            `;
            
            div.addEventListener('click', function() {
                listaAtual = {...lista};
                atualizarListaAtiva();
            });
            
            listasContainer.appendChild(div);
        });
    }
    
    function limparLista() {
        if (confirm('Tem certeza que deseja limpar a lista atual?')) {
            listaAtual = {
                nome: 'Nova Lista',
                itens: [],
                data: new Date()
            };
            atualizarListaAtiva();
        }
    }
    
    function compartilharLista() {
        if (listaAtual.itens.length === 0) {
            alert('Adicione itens à lista antes de compartilhar!');
            return;
        }
        
        const texto = `Lista de Compras: ${listaAtual.nome}\n\n${listaAtual.itens.join('\n')}`;
        
        if (navigator.share) {
            navigator.share({
                title: listaAtual.nome,
                text: texto
            }).catch(err => {
                console.error('Erro ao compartilhar:', err);
                copiarParaAreaTransferencia(texto);
            });
        } else {
            copiarParaAreaTransferencia(texto);
        }
    }
    
    function copiarParaAreaTransferencia(texto) {
        navigator.clipboard.writeText(texto).then(() => {
            alert('Lista copiada para a área de transferência!');
        }).catch(err => {
            console.error('Erro ao copiar:', err);
            // Fallback para dispositivos mais antigos
            const textarea = document.createElement('textarea');
            textarea.value = texto;
            document.body.appendChild(textarea);
            textarea.select();
            document.execCommand('copy');
            document.body.removeChild(textarea);
            alert('Lista copiada para a área de transferência!');
        });
    }
    
    // Event Listeners
    novaListaBtn.addEventListener('click', limparLista);
    
    adicionarItemBtn.addEventListener('click', function() {
        const novoItem = novoItemInput.value.trim();
        if (novoItem) {
            listaAtual.itens.push(novoItem);
            novoItemInput.value = '';
            atualizarListaAtiva();
        }
    });
    
    novoItemInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            adicionarItemBtn.click();
        }
    });
    
    salvarListaBtn.addEventListener('click', salvarLista);
    limparListaBtn.addEventListener('click', limparLista);
    compartilharListaBtn.addEventListener('click', compartilharLista);
    
    nomeListaInput.addEventListener('change', function() {
        listaAtual.nome = this.value || 'Lista sem nome';
        nomeListaAtiva.textContent = listaAtual.nome;
    });
    
    // Inicialização
    carregarListasSalvas();
    atualizarListaAtiva();
});