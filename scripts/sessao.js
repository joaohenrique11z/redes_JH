export function camadaSessao(dadosApresentacao) {
    const payload = {
        sessaoId: crypto.randomUUID(),
        status: "ESTABELECIDA",
        token: dadosApresentacao.jwtToken,
        ipDestino: dadosApresentacao.ipResolvido,
        protocolo: dadosApresentacao.protocolo,
        dados: dadosApresentacao
    };
    console.log("CAMADA DE SESSÃO", payload);
    return payload;
}
