export function camadaTransporte(dados) {
    // Camada de Transporte: Segmentação, controle de fluxo e portas (TCP/UDP)
    const segmentos = [
        {
            portaOrigem: Math.floor(Math.random() * 10000) + 40000,
            portaDestino: 80,
            protocolo: "TCP",
            sequencia: 1,
            dados: dados
        }
    ];
    console.log("CAMADA DE TRANSPORTE", segmentos);
    return segmentos;
}
