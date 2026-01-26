 function mostrarSecao(idDaSecao) {
 
  const secoes = document.querySelectorAll('.conteudo');


  secoes.forEach(secao => {
    secao.style.display = 'none';
  });
  const secaoParaMostrar = document.getElementById(idDaSecao);
  secaoParaMostrar.style.display = 'block';
 }