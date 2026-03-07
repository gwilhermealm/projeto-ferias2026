   import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
    import { getAuth, signInWithEmailAndPassword, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";



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
    const auth = getAuth(app);


    

    
    window.fazerLogin = async function() {
    const email = document.getElementById('email').value; 
    const senha = document.getElementById('senha-input').value;
    const btn = document.querySelector('#section-login button');


    if (!senha && !email ) return alert("Digite todos os dados de acesso!");

    btn.innerText = "Autenticando...";
    btn.disabled = true;

    try {
        // O Firebase valida a senha nos servidores dele
        await signInWithEmailAndPassword(auth, email, senha);
        window.location.href = "adm.html"
    
    } catch (error) {
        alert("Acesso negado: " + error.message);
        btn.innerText = "Entrar";
        btn.disabled = false;
    }
}

    window.alternarVisualizacao = function() {
        const senhaInput = document.getElementById('senha-input');
        const toggleIcon = document.getElementById('toggle-password');
        
        if (senhaInput.type === 'password') {
            senhaInput.type = 'text';
            toggleIcon.innerText = '🙈';
        } else {
            senhaInput.type = 'password';
            toggleIcon.innerText = '👁️';
        }
}
