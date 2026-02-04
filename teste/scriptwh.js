
document.getElementById('meuFormulario').addEventListener('submit', function(e) {
    e.preventDefault(); // Impede o recarregamento da página

    // 1. Pegar os valores dos campos
    const nome = document.getElementById('nome').value;
    const mensagem = document.getElementById('mensagem').value;
    const telefone = "5585997897202"; // Coloque seu número com DDD (apenas números)

    // 2. Formatar a mensagem
    const texto = `Olá! Meu nome é *${nome}*.\n\n*Mensagem:* ${mensagem}`;
    
    // 3. Criar a URL do WhatsApp
    // Usamos o 'api.whatsapp.com' para maior compatibilidade entre PC e Celular
    const url = `https://api.whatsapp.com/send?phone=${telefone}&text=${encodeURIComponent(texto)}`;

    // 4. Abrir em uma nova aba
    window.open(url, '_blank');
});