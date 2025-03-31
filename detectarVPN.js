async function detectarVPN() {
    try {
        // 1. Teste de Latência
        const proxyTest = new Image();
        const inicio = new Date().getTime();
        proxyTest.src = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_92x30dp.png";
        
        proxyTest.onload = proxyTest.onerror = async function() {
            const tempo = new Date().getTime() - inicio;
            if (tempo < 50) {
                bloquearAcesso("Conexão suspeita/VPN detectada!");
            } else {
                // 2. Verificação de IP usando API pública
                await verificarIP();
            }
        };
    } catch (error) {
        bloquearAcesso("Erro ao verificar VPN/Proxy");
    }
}

// Verificação de IP usando API pública
async function verificarIP() {
    try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();

        if (data.org && (data.org.includes("VPN") || data.org.includes("Proxy") || data.org.includes("Cloudflare"))) {
            bloquearAcesso("VPN ou Proxy detectado!");
        }
    } catch (error) {
        console.log("Falha ao verificar IP");
    }
}

function bloquearAcesso(mensagem) {
    document.body.innerHTML = `
        <div id="block" style="text-align: center; padding: 20px;">
            <h1>Acesso Bloqueado!
                Desligue a VPN
            </h1>
            
            <p>${mensagem}</p>
            <button onclick="location.reload()">Tentar Novamente</button>
        </div>
    `;
}

// Executa a função ao carregar a página
detectarVPN();
