export function camadaEnlace(segmentos) {
    const quadros = segmentos.map(segmento => ({
        macOrigem: "AA:BB:CC:DD:EE:01",
        macDestino: "AA:BB:CC:DD:EE:99",
        segmento
    }));

    console.log("CAMADA DE ENLACE", quadros);
    return quadros;
}
