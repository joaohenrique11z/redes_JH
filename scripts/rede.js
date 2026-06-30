import { network, createNetwork } from "./network.js";
import { randomFailures } from "./failures.js";
import { dijkstra } from "./pathfinder.js";

function hashString(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = (hash << 5) - hash + char;
        hash = hash & hash;
    }
    return Math.abs(hash);
}

export function camadaRede(segmentos) {
    if (!network || network.length === 0) {
        createNetwork();
        randomFailures(15);
    }
    
    const ativos = network.filter(router => router.active);
    let origem = 0;
    if (!ativos.find(r => r.id === origem)) {
        origem = ativos[0].id;
    }

    const pacotes = segmentos.map(segmento => {
        const ipDestino = segmento.dados.ipDestino || "8.8.8.8";
        
        const hash = hashString(ipDestino);
        let destino = ativos[hash % ativos.length].id;
        
        if (origem === destino) {
            destino = ativos[(hash + 1) % ativos.length].id;
        }

        const resultadoRota = dijkstra(network, origem, destino);

        return {
            ipOrigem: "192.168.0.1",
            ipDestino: ipDestino,
            protocoloRede: "IPv4",
            rotaCalculada: {
                origem: origem,
                destino: destino,
                caminho: resultadoRota.path,
                custo: resultadoRota.distance
            },
            dados: segmento
        };
    });
    
    console.log("CAMADA DE REDE", pacotes);
    return pacotes;
}
