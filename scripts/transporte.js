export function camadaTransporte(dados) {
    const texto = JSON.stringify(dados);
    const tamanhoSegmento = 50;
    const segmentos = [];

    for (let i = 0; i < texto.length; i += tamanhoSegmento) {
        segmentos.push({
            sequencia: segmentos.length + 1,
            dados: texto.slice(i, i + tamanhoSegmento)
        });
    }

    console.log("CAMADA DE TRANSPORTE", segmentos);
    return segmentos;
}
