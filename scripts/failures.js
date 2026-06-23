import { network } from "./network.js";

export function randomFailures(count = 15) {
    network.forEach(router => {
        router.active = Math.random() > 0.15;
    });
}
