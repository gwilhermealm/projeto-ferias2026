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
        let categoriaPrompt = prompt("Categoria (1-Hamb, 2-Pão Árabe, 3-Bebida, 5-Batata):");
        const categoriasMap = { '1': 'hamburgers', '2': 'arabe', '3': 'bebidas', '5': 'batatas' };
        
        let categoria = categoriasMap[categoriaPrompt];
        if (!categoria) return alert("Categoria inválida!");

        let idProduto = prompt("Digite o ID do item:");
        let novoPreco = prompt("Digite o novo preço:");

        if (idProduto && novoPreco) {
            try {
                await set(ref(db, `cardapio/${categoria}/${idProduto}/preco`), parseFloat(novoPreco).toFixed(2));
                alert("Preço atualizado com sucesso!");
            } catch (err) {
                alert("Erro ao salvar: " + err.message);
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