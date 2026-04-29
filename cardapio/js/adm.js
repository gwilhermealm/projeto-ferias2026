import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
    // Adicionado o signOut e onAuthStateChanged
    import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

    const firebaseConfig = {
        apiKey: "AIzaSyBPM9a1TOTiIblsvgMFInpMVUvvA3BNAuc",
        authDomain: "bc-cardapio.firebaseapp.com",
        databaseURL: "https://bc-cardapio-default-rtdb.firebaseio.com",
        projectId: "bc-cardapio",
        storageBucket: "bc-cardapio.firebasestorage.app",
        messagingSenderId: "510752314447",
        appId: "1:510752314447:web:9e7f43305130d9d834463a"
    };

    const app = initializeApp(firebaseConfig);
    const db = getDatabase(app);
    const auth = getAuth(app);

    onAuthStateChanged(auth, (user) => {
        if (!user) {
            // Se não tiver usuário, chuta de volta para o login
            window.location.href = "login-adm.html";
        }
    });

    // Função de Salvar Preços
    window.salvarPrecos = async function() {
    // 1. Abre um modal único com os 3 campos
    const { value: formValues } = await Swal.fire({
        title: 'Atualizar Preço',
        html: `
            <select id="swal-categoria" class="swal2-select" style="display: flex; margin: 10px auto; width: 80%;">
                <option value="" disabled selected>Selecione a Categoria</option>
                <option value="hamburgers">1 - Hambúrguer</option>
                <option value="arabe">2 - Pão Árabe</option>
                <option value="bebidas">3 - Bebida</option>
                <option value="batatas">5 - Batata</option>
            </select>
            <input id="swal-id" class="swal2-input" placeholder="Digite o ID do item" style="width: 80%;">
            <input id="swal-preco" type="number" step="0.01" class="swal2-input" placeholder="Digite o novo preço" style="width: 80%;">
        `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonText: 'Salvar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        // 2. Validação antes de fechar o modal
        preConfirm: () => {
            const categoria = document.getElementById('swal-categoria').value;
            const idProduto = document.getElementById('swal-id').value;
            const novoPreco = document.getElementById('swal-preco').value;

            if (!categoria || !idProduto || !novoPreco) {
                Swal.showValidationMessage('Por favor, preencha todos os campos!');
                return false;
            }
            return { categoria, idProduto, novoPreco };
        }
    });

    // 3. Se o usuário preencheu tudo e clicou em "Salvar"
    if (formValues) {
        const { categoria, idProduto, novoPreco } = formValues;

        try {
            // Mostra um alerta de "Carregando..." enquanto salva no banco
            Swal.fire({
                title: 'Salvando...',
                text: 'Atualizando o banco de dados',
                allowOutsideClick: false,
                didOpen: () => {
                    Swal.showLoading();
                }
            });

            // Salva no Firebase
            await set(ref(db, `cardapio/${categoria}/${idProduto}/preco`), parseFloat(novoPreco).toFixed(2));

            // Mostra alerta de Sucesso
            Swal.fire({
                icon: 'success',
                title: 'Sucesso!',
                text: 'Preço atualizado com sucesso!',
                timer: 2000,
                showConfirmButton: false
            });

        } catch (err) {
            // Mostra alerta de Erro
            Swal.fire({
                icon: 'error',
                title: 'Erro ao salvar',
                text: err.message
            });
        }
    }
};
    
    window.fazerLogout = async function() {
        try {
            await signOut(auth);
           
        } catch (error) {
            alert("Erro ao sair: " + error.message);
        }
    };

    window.mudarAba = function(aba) {
    // 1. Atualiza a classe 'active' nos botões do menu lateral
    const botoes = document.querySelectorAll('.nav-item');
    botoes.forEach(botao => botao.classList.remove('active'));
    
    // Encontra o botão clicado e adiciona a classe 'active'
    const botaoClicado = Array.from(botoes).find(b => b.getAttribute('onclick').includes(aba));
    if (botaoClicado) botaoClicado.classList.add('active');

    // 2. Elementos que vão mudar o conteúdo
    const titulo = document.getElementById('titulo-pagina');
    const contentArea = document.querySelector('.content-area');

    // 3. Renderiza o conteúdo de acordo com a aba selecionada
    if (aba === 'resumo') {
        titulo.innerText = 'Adicionar item';
        contentArea.innerHTML = `
           <div class="dashboard-card">
                <h3>Cadastrar Produto no Cardápio</h3>
                <p>Preencha os dados abaixo para adicionar um novo item ao Smoky One.</p>
                
                <div class="form-group">
                    <label for="nome-item">Nome do Item</label>
                    <input type="text" id="nome-item" placeholder="Ex: Bacon Burger Especial">
                </div>

                <div class="form-group">
                    <label for="desc-item">Descrição</label>
                    <textarea id="desc-item" placeholder="Detalhes do item, ingredientes, etc..."></textarea>
                </div>

                <div class="form-group">
                    <label for="preco-item">Preço (R$)</label>
                    <input type="number" id="preco-item" step="0.01" placeholder="0.00">
                </div>

             <div class="form-group">
                    <label>Foto do Produto</label>
                    <div class="upload-container" onclick="document.getElementById('foto-item').click()">
                        <span id="upload-label">📸 Clique para selecionar ou arraste a imagem</span>
                        <input type="file" id="foto-item" accept="image/*" style="display: none;" onchange="previewImagem(event)">
                        <img id="preview-img" src="#" alt="Preview" style="display: none; max-width: 100%; border-radius: 8px; margin-top: 10px;">
                    </div>
                </div>

                <button class="btn-acao">Salvar Item</button>
            </div>
        `;
    } else if (aba === 'comandas') {
       titulo.innerText = 'Impressão de Comandas';
        contentArea.innerHTML = `
            <div class="dashboard-card">
                <h3>Imprimir Pedido (WhatsApp)</h3>
                <p>Cole abaixo o texto do pedido enviado pelo cliente:</p>
                <textarea id="texto-pedido" class="textarea-comanda" placeholder="Cole o pedido aqui..."></textarea>
                <button onclick="imprimirComanda()" class="btn-print">🖨️ Imprimir Comanda</button>
            </div>
        `;
    } else if (aba === 'produtos') {
        titulo.innerText = 'Gerenciamento de Produtos';
        contentArea.innerHTML = `
            <div class="dashboard-card">
                <h3>Adicionar / Editar Produtos</h3>
                <p>Cadastre novos itens, altere fotos ou mude os preços do cardápio do Smoky One.</p>
                <br>
                <button onclick="salvarPrecos()" style="background-color: var(--success); color: white; padding: 12px; border: none; border-radius: 8px; cursor: pointer; font-weight: bold;">
                    Atualizar Preço Rápido (Prompt)
                </button>
            </div>
        `;
    }
};


window.imprimirComanda = function() {
    const texto = document.getElementById('texto-pedido').value;
    if (!texto.trim()) {
        alert("Por favor, cole um pedido para imprimir.");
        return;
    }

    const printArea = document.getElementById('printable-area');
    // Formata o texto para manter as quebras de linha
    printArea.innerHTML = `
        <div class="ticket-header">
            <h2>Cardapio ONLINE</h2>
            <p>PEDIDO DE VENDA</p>
            <p>----------------------------</p>
        </div>
        <pre>${texto}</pre>
        <div class="ticket-footer">
            <p>----------------------------</p>
            <p>Obrigado pela preferência!</p>
        </div>
    `;

    window.print();
};