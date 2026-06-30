export function camadaRede(segmentos) {
    // Camada de Rede: Endereçamento IP e Roteamento Lógico
    const pacotes = segmentos.map(segmento => ({
        ipOrigem: "192.168.0.1",
        ipDestino: "8.8.8.8",
        protocolo: "IPv4",
        dados: segmento
    }));
    console.log("CAMADA DE REDE", pacotes);
    return pacotes;
}
