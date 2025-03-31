
async function detectarVPN() {
    try {
        const isLatenciaSuspeita = await verificarLatencia();
        const isIpSuspeito = await verificarIP();
        const isWebRTCSuspeito = await verificarWebRTC();

        if (isLatenciaSuspeita || isIpSuspeito || isWebRTCSuspeito) {
            bloquearAcesso("VPN ou Proxy detectado!");
        }
    } catch (error) {
        bloquearAcesso("Erro ao verificar VPN/Proxy");
    }
}

// Verificação de latência
function verificarLatencia() {
    return new Promise((resolve) => {
        const proxyTest = new Image();
        const inicio = new Date().getTime();
        proxyTest.src = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_92x30dp.png";

        proxyTest.onload = proxyTest.onerror = function () {
            const tempo = new Date().getTime() - inicio;
            resolve(tempo < 50);
        };
    });
}

// Verificação de IP usando API pública
async function verificarIP() {
    try {
        const response = await fetch("https://ipapi.co/json/");
        const data = await response.json();
        return data.org && (data.org.includes("VPN") || data.org.includes("Proxy") || data.org.includes("Cloudflare") || data.org.includes("Data Center"));
    } catch {
        return false;
    }
}

// Verificação de WebRTC
function verificarWebRTC() {
    return new Promise((resolve) => {
        const peerConnection = new RTCPeerConnection({ iceServers: [] });
        peerConnection.createDataChannel("");
        peerConnection.createOffer().then(offer => peerConnection.setLocalDescription(offer));
        peerConnection.onicecandidate = (event) => {
            if (event && event.candidate && event.candidate.candidate.includes("relay")) {
                resolve(true);
            }
        };
        setTimeout(() => resolve(false), 2000);
    });
}

// Bloquear acesso
function bloquearAcesso(mensagem) {
    document.body.innerHTML = `
        <style>
            .bloqueio-vpn {
                position: fixed;
                top: 0; left: 0;
                width: 100%;
                height: 100%;
                background: #000000d9;
                color: white;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                font-family: Arial, sans-serif;
            }
        </style>
        <div class="bloqueio-vpn">
            <h1>Acesso Bloqueado!</h1>
            <p>${mensagem}</p>
            <button onclick="location.reload()">Tentar Novamente</button>
        </div>
    `;
}

// Executar detecção
detectarVPN();
