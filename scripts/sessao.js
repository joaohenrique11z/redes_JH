export function camadaSessao(dados) {
    // Camada de Sessão: Estabelece, gerencia e finaliza sessões (diálogos)
    const payload = {
        sessaoId: "SESS-" + Math.floor(Math.random() * 1000000),
        status: "ESTABELECIDA",
        token: Math.random().toString(36).substring(2, 10),
        dados: dados
    };
    console.log("CAMADA DE SESSÃO", payload);
    return payload;
}
