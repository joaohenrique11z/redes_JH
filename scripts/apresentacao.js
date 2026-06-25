export function camadaApresentacao(dados) {
    // Camada de Apresentação: Responsável pela tradução, compressão e criptografia
    const payload = {
        codificacao: "UTF-8",
        criptografia: "Base64 (Simulação)",
        dadosBrutos: dados,
        dadosFormatados: btoa(unescape(encodeURIComponent(dados)))
    };
    console.log("CAMADA DE APRESENTAÇÃO", payload);
    return payload;
}
