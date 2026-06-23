import { network } from "./network.js";

const canvas = document.querySelector("#networkCanvas");
const ctx = canvas ? canvas.getContext("2d") : null;

// ======================
// IMAGENS DOS ROTEADORES
// ======================
const routerOK = new Image();
routerOK.src = "./assets/router-green.png";

const routerFail = new Image();
routerFail.src = "./assets/router-red.png";

// ======================
// IMAGEM DO PACOTE
// ======================
const packet = new Image();
packet.src = "./assets/packet.png";

packet.onload = () => { console.log("Pacote carregado com sucesso!"); };
packet.onerror = () => { console.error("Erro ao carregar packet.png"); };

// ======================
// DESENHAR REDE
// ======================
export function drawNetwork() {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Conexões
    network.forEach(router => {
        router.connections.forEach(link => {
            ctx.beginPath();
            ctx.moveTo(router.x, router.y);
            ctx.lineTo(link.router.x, link.router.y);
            ctx.strokeStyle = "rgba(255,255,255,.15)";
            ctx.lineWidth = 1;
            ctx.stroke();
        });
    });

    // Roteadores
    network.forEach(router => {
        const image = router.active ? routerOK : routerFail;
        ctx.drawImage(image, router.x - 15, router.y - 15, 30, 30);
    });
}

// ======================
// DESENHAR ROTA
// ======================
export function drawRoute(path, origem, destino) {
    if (!ctx || !path || path.length < 2) return;

    // Linha da rota
    ctx.beginPath();
    const firstRouter = network[path[0]];
    ctx.moveTo(firstRouter.x, firstRouter.y);

    for (let i = 1; i < path.length; i++) {
        const router = network[path[i]];
        ctx.lineTo(router.x, router.y);
    }
    ctx.strokeStyle = "#00ffff";
    ctx.lineWidth = 5;
    ctx.stroke();
    ctx.lineWidth = 1;

    // Origem
    const origemRouter = network[origem];
    ctx.beginPath();
    ctx.arc(origemRouter.x, origemRouter.y, 18, 0, Math.PI * 2);
    ctx.fillStyle = "lime";
    ctx.fill();

    // Destino
    const destinoRouter = network[destino];
    ctx.beginPath();
    ctx.arc(destinoRouter.x, destinoRouter.y, 18, 0, Math.PI * 2);
    ctx.fillStyle = "red";
    ctx.fill();
}

// ======================
// UTILITÁRIO
// ======================
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ======================
// ANIMAÇÃO DO PACOTE
// ======================
export async function animatePacket(path, origem, destino) {
    if (!path || path.length < 2) {
        console.warn("Nenhuma rota encontrada.");
        return;
    }

    for (let i = 0; i < path.length - 1; i++) {
        const start = network[path[i]];
        const end = network[path[i + 1]];
        await animateSegment(start, end, path, origem, destino);
    }
}

// ======================
// MOVIMENTO SUAVE
// ======================
async function animateSegment(start, end, path, origem, destino) {
    const frames = 80;
    for (let frame = 0; frame <= frames; frame++) {
        const progress = frame / frames;
        const x = start.x + (end.x - start.x) * progress;
        const y = start.y + (end.y - start.y) * progress;

        drawNetwork();
        drawRoute(path, origem, destino);

        // ======================
        // DESENHAR PACOTE
        // ======================
        if (packet.complete && packet.naturalWidth > 0) {
            ctx.drawImage(packet, x - 25, y - 25, 50, 50);
        } else {
            // Fallback
            ctx.beginPath();
            ctx.arc(x, y, 12, 0, Math.PI * 2);
            ctx.fillStyle = "yellow";
            ctx.fill();
        }

        await sleep(15);
    }
}
