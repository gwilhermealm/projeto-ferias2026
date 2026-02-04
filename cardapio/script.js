 let cardcout=document.getElementById('cart-count')
 const btnFinalizar=document.getElementById('btn-finalizar')


 
 let carrinho=[ ]
 
//atualizar interface do carrinho
function atualizarInterfaceCarrinho() {
    const containerItens = document.getElementById('carrinho-itens');
    const totalElemento = document.getElementById('cart-total');
    
    
    containerItens.innerHTML = '';
    
    let valorTotal = 0;

  
    carrinho.forEach((item, index) => {
        valorTotal += item.preco * item.quantidade;

        // Cria o HTML para cada item
        containerItens.innerHTML += `
            <div class="item-carrinho" style="display: flex; justify-content: space-between; margin-bottom: 10px; border-bottom: 1px solid #eee; padding-bottom: 5px;">
                <div>
                    <p><strong>${item.nome}</strong></p>
                    <p><small>R$ ${item.preco.toFixed(2)} x ${item.quantidade}</small></p>
                </div>
                <button onclick="removerDoCarrinho(${index})" style="width: auto; color: red; margin: 0; background: none; cursor: pointer;">Remover</button>
            </div>
        `
    });
   
    
    totalElemento.innerText = `R$ ${valorTotal.toFixed(2)}`;
    localStorage.setItem('totalpag', String(valorTotal))
    // salva o pedido completo (array de itens) em uma única chave
    localStorage.setItem('pedido', JSON.stringify(carrinho));

    // Se o carrinho ficar vazio, volta o texto informativo
    if (carrinho==[] ) {
        containerItens.innerHTML = '<p style="text-align: center; padding: 20px;">Carrinho vazio</p>';
    }
    
}
//funçao para remover o iten do carrinho
function removerDoCarrinho(index) {
    
    carrinho.splice(index, 1);

  
    const totalItens = carrinho.reduce((acumulador, item) => acumulador + item.quantidade, 0);
    cardcout.innerText = totalItens;

 
    atualizarInterfaceCarrinho();
}

 
 function mostrarSecao(idDaSecao) {
 
  const secoes = document.querySelectorAll('.conteudo');


  secoes.forEach(secao => {
    secao.style.display = 'none';
  });
  const secaoParaMostrar = document.getElementById(idDaSecao);
  secaoParaMostrar.style.display = 'block';
 }


function adicionarAoCarrinho(nomeItem, precoItem) {
 const novoItem = {
        nome: nomeItem,
        preco: precoItem,
        quantidade: 1 
    };

    // se já existe um item igual, apenas incrementa a quantidade
    const existente = carrinho.find(item => item.nome === nomeItem && item.preco === precoItem);
    if (existente) {
        existente.quantidade += 1;
    } else {
        carrinho.push(novoItem);
    }
    
   const totalItens = carrinho.reduce((acumulador, item) => acumulador + item.quantidade, 0);
   if (cardcout) cardcout.innerText = totalItens;

   // salva o pedido atualizado
   localStorage.setItem('pedido', JSON.stringify(carrinho));

   //chamar funçao para preencher carrinho
   atualizarInterfaceCarrinho()
}
function abrirFecharCarrinho(){
    const carLateral=document.getElementById('carrinho-lateral')
     //alterar classe do carinho lateral
     carLateral.classList.toggle('cart-open')
     carLateral.classList.toggle('cart-close')

}


//finalizar pedido ir para o pagamento


 //parte pagamento
 document.addEventListener('DOMContentLoaded', () => {
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
function confirmarPedido(){
    
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
function enviarPedido() {
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