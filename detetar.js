function detectarVPN() {
    const proxyTest = new Image();
    proxyTest.onload = proxyTest.onerror = function() {
        const tempo = new Date().getTime() - inicio;
        if (tempo < 50) bloquearAcesso("Latência suspeita detectada");
    };
    const inicio = new Date().getTime();
    proxyTest.src = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_92x30dp.png";

    // Prevenção de Rastreamento
    if (navigator.doNotTrack === "1") bloquearAcesso("Prevenção de rastreamento ativada");

    // WebRTC Leak Detection
    verificarWebRTC();
}

function verificarWebRTC() {
    if (typeof RTCPeerConnection === 'undefined') return;
    const peer = new RTCPeerConnection({ iceServers: [] });
    peer.createDataChannel("");
    peer.createOffer().then(offer => peer.setLocalDescription(offer));

    peer.onicecandidate = event => {
        if (!event.candidate) return;
        const ip = event.candidate.candidate.split(' ')[4];
        if (ip.startsWith("10.") || ip.startsWith("172.") || ip.startsWith("192.168.")) {
            bloquearAcesso("IP local detectado via WebRTC");
        }
        peer.close();
    };
}

function bloquearAcesso(motivo) {
    document.body.innerHTML = `
        <div style="text-align: center; padding: 20px; background-color: #f8d7da; color: #721c24;">
            <h1>Acesso Bloqueado!</h1>
            <p>${motivo}</p>
            <p>Desligue a VPN ou desabilite o Proxy</p>
            <button onclick="location.reload()">Tentar Novamente</button>
        </div>
    `;
}

detectarVPN();
                           
