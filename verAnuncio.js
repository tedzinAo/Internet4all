// Script atualizado para verificar anúncios em uma página web
(function verificarAnuncios() {
    // Seleciona elementos relacionados a anúncios pelos IDs e classes comuns
    const anuncios = document.querySelectorAll("[id*='container-'], script[src*='adsbygoogle'], script[src*='tumblepoet'], script[src*='highperformanceformat']");

    if (anuncios.length === 0) {
        console.log('Nenhum anúncio encontrado.');
        return;
    }

    anuncios.forEach((anuncio, index) => {
        // Verifica se o elemento está visível
        const visivel = !!(anuncio.offsetWidth || anuncio.offsetHeight || anuncio.getClientRects().length);

        if (visivel) {
            console.log(`Anúncio ${index + 1} está ativo.`);
        } else {
            console.log(`Anúncio ${index + 1} não está ativo.`);
        }
    });
    })();
  
