import { Router } from "./router.js";

export const network = [];

export function createNetwork() {
    network.length = 0;
    const total = 100;

    for (let i = 0; i < total; i++) {
        network.push(new Router(i, Math.random() * 900, Math.random() * 500));
    }

    for (let i = 0; i < total - 1; i++) {
        network[i].connect(network[i + 1], 1);
        network[i + 1].connect(network[i], 1);
    }

    for (let i = 0; i < total; i++) {
        const current = network[i];
        for (let j = 0; j < 3; j++) {
            const randomIndex = Math.floor(Math.random() * total);
            if (randomIndex !== i) {
                current.connect(network[randomIndex], Math.floor(Math.random() * 10) + 1);
            }
        }
    }
}
