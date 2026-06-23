export function camadaSessao(dados) {
    const sessao = {
        sessionId: crypto.randomUUID(),
        inicioSessao: new Date().toISOString(),
        dados
    };
    console.log("CAMADA DE SESSÃO", sessao);
    return sessao;
}
