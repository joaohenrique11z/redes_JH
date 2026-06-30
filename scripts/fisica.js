import md5 from 'https://esm.sh/md5@2';

export function camadaFisica(quadros) {
    const resultados = quadros.map(quadro => {
        const { crc, ...quadroBase } = quadro;
        const calculado = md5(JSON.stringify(quadroBase));
        const semPerda = calculado === crc;
        
        const bitstream = JSON.stringify(quadro)
            .split("")
            .map(char => char.charCodeAt(0).toString(2).padStart(8, "0"))
            .join(" ");

        return {
            status: semPerda ? "A transmissão ocorreu sem perda de dados." : "Erro: Perda ou corrupção de dados na transmissão.",
            binario: bitstream,
            dadosOriginais: quadro
        };
    });

    console.log("CAMADA FÍSICA", resultados);
    return resultados;
}
