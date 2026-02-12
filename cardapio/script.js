 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getDatabase, ref, onValue } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";
let carrinho = JSON.parse(localStorage.getItem('pedido')) || []
 window.carrinho=carrinho

const firebaseConfig = {
  apiKey: "AIzaSyBPM9a1TOTiIblsvgMFInpMVUvvA3BNAuc",
  authDomain: "bc-cardapio.firebaseapp.com",
  databaseURL: "https://bc-cardapio-default-rtdb.firebaseio.com",
  projectId: "bc-cardapio",
  storageBucket: "bc-cardapio.firebasestorage.app",
  messagingSenderId: "510752314447",
  appId: "1:510752314447:web:9e7f43305130d9d834463a",
  measurementId: "G-KMHRFWF9JK"
};

const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

const cardapioRef = ref(db, 'cardapio/');
// Esta função fica "vigiando" o Firebase
// Esta função fica "vigiando" o Firebase
onValue(cardapioRef, (snapshot) => {
    const dados = snapshot.val();
    if (!dados) return;

    const categorias = ['hamburgers', 'arabe', 'batatas', 'bebidas'];

    categorias.forEach(categoria => {
        if (dados[categoria]) {
            Object.keys(dados[categoria]).forEach(id => {
                const item = dados[categoria][id];
                const elementoPreco = document.getElementById(`id-${id}`);
                
                if (elementoPreco) {
                    let valorExibir = "";

                    // Se o item for um objeto { preco: "15.00" } ou { hamburguer: "18.00" }
                    if (typeof item === 'object' && item !== null) {
                        // Prioriza a chave 'preco', depois 'hamburguer', senão pega o primeiro valor que achar
                        valorExibir = item.preco || item.hamburguer || Object.values(item)[0];
                    } else {
                        // Se for apenas o valor direto "15.00"
                        valorExibir = item;
                    }

                    // Garante que o valor seja tratado como número para formatar com 2 casas decimais
                    const num = parseFloat(valorExibir);
                    elementoPreco.innerText = !isNaN(num) ? num.toFixed(2) : valorExibir;
                }
            });
        }
    });
});




 
 let cardcout=document.getElementById('cart-count')
 const btnFinalizar=document.getElementById('btn-finalizar')


 
//funçao mostrar seçao
 window.mostrarSecao = function mostrarSecao(idDaSecao) {
 
  const secoes = document.querySelectorAll('.conteudo');


  secoes.forEach(secao => {
    secao.style.display = 'none';
  });
  const secaoParaMostrar = document.getElementById(idDaSecao);
  secaoParaMostrar.style.display = 'block';
 }
 
//atualizar interface do carrinho
window.adicionarAoCarrinho = function adicionarAoCarrinho(nomeItem, precoItemOriginal, idDoElemento) {
       let horaAtual = new Date().getHours();
       console.log('Hora atual:', horaAtual);
       //valida se a loja esta aberta ou fechada - funçao so funciona das 18hrs as 00hrs
  if(horaAtual >= 18 && horaAtual < 24){

    const elementoPreco = document.getElementById(idDoElemento);
    let precoFinal = precoItemOriginal;

    if (elementoPreco) {
        const textoPreco = elementoPreco.innerText.replace('R$', '').replace(',', '.').trim();
        const precoNumerico = parseFloat(textoPreco);
        if (!isNaN(precoNumerico)) {
            precoFinal = precoNumerico;
        }
    }

    const novoItem = {
        idUnique: Date.now() + Math.random(), 
        idOriginal: idDoElemento,
        nome: nomeItem,
        preco: precoFinal,
        quantidade: 1 
    };

    // Adiciona ao array local
    carrinho.push(novoItem);
    
    // Salva no localStorage
    localStorage.setItem('pedido', JSON.stringify(carrinho));
    
    // Atualiza a interface
    window.atualizarInterfaceCarrinho();
} else {
   Swal.fire("A loja está fechada. Aceitamos pedidos das 18h às 00h.");
} 
}

window.removerDoCarrinho = function(index) {
    window.carrinho.splice(index, 1);
    window.atualizarInterfaceCarrinho();
};




window.abrirFecharCarrinho = function abrirFecharCarrinho(){
    const horaAtual = new Date().getHours();

 if(horaAtual >= 18 && horaAtual < 24){
    const carLateral=document.getElementById('carrinho-lateral')
     //alterar classe do carinho lateral
     carLateral.classList.toggle('cart-open')
     carLateral.classList.toggle('cart-close')

}else {
    Swal.fire("A loja está fechada. Aceitamos pedidos das 18h às 00h.");
}
}
window.atualizarInterfaceCarrinho = function atualizarInterfaceCarrinho() {
    const containerItens = document.getElementById('carrinho-itens');
    const totalElemento = document.getElementById('cart-total');
    const cartCount = document.getElementById('cart-count'); // Elemento do contador
    
    containerItens.innerHTML = '';
    let valorTotal = 0;
    let totalItens = 0;

    if (carrinho.length === 0) {
        containerItens.innerHTML = '<p style="text-align: center; padding: 20px;">Carrinho vazio</p>';
        totalElemento.innerText = 'R$ 0,00';
        if (cartCount) cartCount.innerText = '0';
        localStorage.setItem('totalpag', '0');
        localStorage.setItem('pedido', JSON.stringify([]));
        return;
    }

    carrinho.forEach((item, index) => {
        valorTotal += item.preco * item.quantidade;
        totalItens += item.quantidade;

        containerItens.innerHTML += `
            <div class="item-carrinho" style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                <div>
                    <p><strong>${item.nome}</strong></p>
                    <p><small>R$ ${item.preco.toFixed(2)}</small></p>
                </div>
                <button onclick="removerDoCarrinho(${index})" style="width: auto; color: red; margin: 0; background: none; cursor: pointer;">Remover</button>
            </div>
        `;
    });
    
    totalElemento.innerText = `R$ ${valorTotal.toFixed(2)}`;
    if (cartCount) cartCount.innerText = totalItens; // Atualiza o número no ícone 🛒
    localStorage.setItem('totalpag', String(valorTotal.toFixed(2)));
    localStorage.setItem('pedido', JSON.stringify(carrinho));
}

//finalizar pedido ir para o pagamento


 //parte pagamento
 document.addEventListener('DOMContentLoaded', () => {
    //atualiza o status da loja 
    statusloja()
  const bairro = document.getElementById('bairro');
  const tpedido = document.getElementById('t-pedido');
  let txEntrega=document.getElementById('tx-entrega')

  
  let total = Number(localStorage.getItem('totalpag')) || 0;

  // mostra subtotal inicial
  if (tpedido) tpedido.innerText = `R$ ${total.toFixed(2)}`;

  // função para recalcular com taxa de entrega
  function atualizarTotalComTaxa() {
    let totalComTaxa = total;
    const bairroValor = bairro ? bairro.value : null;
   

    if (bairroValor === "bairro1") {
      totalComTaxa += 2.00;
      txEntrega.innerHTML=`+2,00`
    } else if (bairroValor === "bairro2") {
      totalComTaxa += 4.00;
      txEntrega.innerHTML=`+4,00`
    } else if (bairroValor === "bairro3") {
      totalComTaxa += 6.00;
        txEntrega.innerHTML=`+6,00`
    }

    if (tpedido){
        tpedido.innerText = `R$ ${totalComTaxa.toFixed(2)}`;
        localStorage.setItem('totalpag', String(totalComTaxa.toFixed(2)))
    }
  }

  // calcula inicialmente (caso já haja uma seleção)
  atualizarTotalComTaxa();

  // atualiza quando o usuário mudar o bairro
  if (bairro) {
    bairro.addEventListener('change', atualizarTotalComTaxa);
  }

});



//confirmar pedido
window.confirmarPedido = function confirmarPedido(){
    
    // usa optional chaining para evitar exceção caso o elemento não exista
    let formaDePagamento = document.getElementById('metodo-pagamento')?.value || '';
    let veriBairro = document.getElementById('bairro')?.value || ''
    let endereco = document.getElementById('endereco')?.value || ''
    let nome = document.getElementById('nome')?.value || ''
    
    // autenticação dos campos
   if (formaDePagamento && nome && endereco && veriBairro) {
      alert('Pedido confirmado');
      enviarPedido()
   } else {
     alert('Preencha todos os campos');
   }
}

//enviar pedido por whatsapp
window.enviarPedido = function enviarPedido() {
    const telefone = "5585997897202" //telefone que vai ser enviado pedido
    let pedidosalvo=localStorage.getItem('pedido')
    let valorpedido=localStorage.getItem('totalpag')
    const mensagem = document.getElementById('mensagem')?.value|| ''

    

    
    //formatar mensagem pedido
    let produtosPedido =JSON.parse(pedidosalvo)
    let pedidoformatado = produtosPedido.map(item => {
        return `${item.quantidade}x ${item.nome} - R$ ${item.preco}`
    }).join('\n')
   

   let formaDePagamento = document.getElementById('metodo-pagamento')?.value || '';
    let veriBairro = document.getElementById('bairro')?.value || ''
    let endereco = document.getElementById('endereco')?.value || ''
    let nome = document.getElementById('nome')?.value || ''
   
  const texto = `ola! Meu nome é *${nome}*\n*ENDEREÇO:*${endereco}\n*BAIROO:* ${veriBairro}\n\n*PEDIDO* ${pedidoformatado}\n\n *VALOR TOTAL:*${valorpedido} \n \n *forma de pagamento* ${formaDePagamento}\n \n *OBSERVAÇÔES*${mensagem}`

const urlWaMe = `https://wa.me/${telefone}?text=${encodeURIComponent(texto)}`;

window.open(urlWaMe, '_blank');
localStorage.clear()
}
//funçao atuaçizar preços

//funçao mostrar seçao pagamento retirada ou entrega
window.retiradaEntrega = function(idsDaSecao) {
    // 1. Esconde as duas seções primeiro
    document.getElementById('pg-entrega').style.display = 'none';
    document.getElementById('pg-retirada').style.display = 'none';

    // 2. Mostra apenas a que foi clicada
    const secaoParaMostrar = document.getElementById(idsDaSecao);
    if (secaoParaMostrar) {
        secaoParaMostrar.style.display = 'block';
    }
}


//enviar pedido retirada
window.enviarPedidoRetirada = function enviarPedidoRetirada() {
    const telefone = "5585997897202" //telefone que vai ser enviado pedido
    let pedidosalvo=localStorage.getItem('pedido')
    let valorpedido=localStorage.getItem('totalpag')
    const mensagem = document.getElementById('mensagemRetirada')?.value|| ''
 

    

    
    //formatar mensagem pedido
    let produtosPedido =JSON.parse(pedidosalvo)
    let pedidoformatado = produtosPedido.map(item => {
        return `${item.quantidade}x ${item.nome} - R$ ${item.preco}`
    }).join('\n')
       
       let nome = document.getElementById('nomeRetirada')?.value || ''
       let formaDePagamento = document.getElementById('metodo-pagamentoRetirada')?.value || '';

   
    const texto = `ola! Meu nome é *${nome}*\n\n*PEDIDO* ${pedidoformatado}\n\n *VALOR TOTAL:*${valorpedido} \n \n *forma de pagamento* ${formaDePagamento}\n \n *OBSERVAÇÔES*${mensagem}`

    const urlWaMe = `https://wa.me/${telefone}?text=${encodeURIComponent(texto)}`;

    window.open(urlWaMe, '_blank');
    localStorage.clear()
    
  
}


window.confirmarPedidoRetirada = function confirmarPedidoRetirada(){
      let formaDePagamento = document.getElementById('metodo-pagamentoRetirada')?.value || '';
      let nome = document.getElementById('nomeRetirada')?.value || ''
   
  if (formaDePagamento && nome) {
      alert('Pedido confirmado');
      enviarPedidoRetirada()
   } else {
     alert('Preencha todos os campos');
   }
}

window.statusloja = function statusloja(){
    let status = document.getElementById('status');
    let horaAtual = new Date().getHours();

    if(horaAtual >= 0 && horaAtual < 18){
       status.innerText = 'loja fechada ⛔';
       status.style.backgroundColor = 'red';
    } else if (horaAtual >= 23 && horaAtual < 24){
         status.innerText = 'loja fecha em breve 00 hrs ⚠️ ';
         status.style.backgroundColor = 'orange';


}
}


