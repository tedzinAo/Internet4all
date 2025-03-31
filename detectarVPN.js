function detectarVPN() {
    const proxyTest = new Image();
    proxyTest.onload = proxyTest.onerror = function() {
        const tempo = new Date().getTime() - inicio;
        if (tempo < 50) {
            bloquearAcesso();
        }
    };
    const inicio = new Date().getTime();
    proxyTest.src = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_92x30dp.png";
}

function bloquearAcesso() {
    document.body.innerHTML = `
        <div style="text-align: center; padding: 20px;">
            <h1>Acesso Bloqueado!</h1>
            <p>Desative sua VPN ou Proxy para continuar.</p>
        </div>
    `;
}

detectarVPN();
