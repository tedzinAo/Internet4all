
async function detectarVPN() {
    try {
        const proxyTest = new Image();
        proxyTest.onload = proxyTest.onerror = function() {
            const tempo = new Date().getTime() - inicio;
            if (tempo < 50) {
                bloquearAcesso();
            }
        };
        const inicio = new Date().getTime();
        proxyTest.src = "https://www.google.com/images/branding/googlelogo/1x/googlelogo_light_color_92x30dp.png";

        // Verificação de IP usando API pública
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        if (data.org && /VPN|Proxy|Hosting/i.test(data.org)) {
            bloquearAcesso();
        }

        // Prevenção de rastreamento
        if (navigator.doNotTrack === "1") {
            bloquearAcesso();
        }

        // WebRTC Leak Detection
        const rtcConnection = new RTCPeerConnection({ iceServers: [] });
        rtcConnection.createDataChannel('');
        rtcConnection.createOffer().then(offer => rtcConnection.setLocalDescription(offer));
        rtcConnection.onicecandidate = event => {
            if (event && event.candidate && /[0-9]+\.[0-9]+\.[0-9]+\.[0-9]+/.test(event.candidate.candidate)) {
                if (!event.candidate.candidate.includes(data.ip)) {
                    bloquearAcesso();
                }
            }
        };
    } catch (error) {
        console.error("Erro ao detectar VPN:", error);
    }
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
            
