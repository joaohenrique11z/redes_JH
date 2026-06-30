export function camadaTransporte(dadosSessao) {
    let portaDest = 80;
    const proto = dadosSessao.protocolo;
    
    if (proto === "HTTPS") portaDest = 443;
    else if (proto === "SMTP") portaDest = 587;
    else if (proto === "FTP") portaDest = 21;
    else if (proto === "HTTP" || proto === "WEBSOCKET") portaDest = 80;

    const portaOrig = Math.floor(Math.random() * (65535 - 49152 + 1)) + 49152;

    const segmentos = [
        {
            packetId: crypto.randomUUID(),
            portaOrigem: portaOrig,
            portaDestino: portaDest,
            protocoloTransporte: "TCP",
            sequencia: 1,
            dados: dadosSessao
        }
    ];
    console.log("CAMADA DE TRANSPORTE", segmentos);
    return segmentos;
}
