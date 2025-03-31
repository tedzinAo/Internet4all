// Script atualizado para verificar anúncios e exibir mensagem de erro
(function verificarAnuncios() {
    // Seleciona elementos relacionados a anúncios
    const anuncios = document.querySelectorAll("[id*='container-'], script[src*='adsbygoogle'], script[src*='tumblepoet'], script[src*='highperformanceformat']");

    if (anuncios.length === 0) {
        exibirMensagemErro();
        return;
    }

    let anunciosAtivos = false;

    anuncios.forEach((anuncio, index) => {
        const visivel = !!(anuncio.offsetWidth || anuncio.offsetHeight || anuncio.getClientRects().length);

        if (visivel) {
            console.log(`Anúncio ${index + 1} está ativo.`);
            anunciosAtivos = true;
        } else {
            console.log(`Anúncio ${index + 1} não está ativo.`);
        }
    });

    if (!anunciosAtivos) exibirMensagemErro();

    function exibirMensagemErro() {
        document.body.innerHTML = `
            <div style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; background: white; color: red; display: flex; flex-direction: column; align-items: center; justify-content: center; font-size: 20px;">
                <h1>Há um problema!</h1>
                <p>Tente desligar a VPN e use dados móveis.</p>
                <button onclick="location.reload()">Tentar Novamente</button>
            </div>
        `;
    }
})();
