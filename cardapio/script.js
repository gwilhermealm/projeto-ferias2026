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

    // usamos o método .push() para guardar o objeto no array
    carrinho.push(novoItem);
   
   const totalItens = carrinho.reduce((acumulador, item) => acumulador + item.quantidade, 0);
    cardcout.innerText = totalItens;
   
   
    

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
  const total = localStorage.getItem('totalpag');
  const tpedido = document.getElementById('t-pedido');
  if (tpedido && total !== null) tpedido.innerText = `R$ ${Number(total).toFixed(2)}`;
});