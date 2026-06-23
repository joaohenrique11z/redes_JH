export function dijkstra(network, startId, endId) {
    const distances = {};
    const previous = {};
    const queue = [];

    network.forEach(router => {
        distances[router.id] = Infinity;
        previous[router.id] = null;
    });

    distances[startId] = 0;
    queue.push({ id: startId, distance: 0 });

    while (queue.length) {
        queue.sort((a, b) => a.distance - b.distance);
        const current = queue.shift();
        const router = network[current.id];

        if (!router.active) continue;
        if (current.id === endId) break;

        for (const neighbor of router.connections) {
            if (!neighbor.router.active) continue;
            const newDistance = distances[current.id] + neighbor.cost;
            if (newDistance < distances[neighbor.router.id]) {
                distances[neighbor.router.id] = newDistance;
                previous[neighbor.router.id] = current.id;
                queue.push({ id: neighbor.router.id, distance: newDistance });
            }
        }
    }

    const path = [];
    let current = endId;
    while (current !== null) {
        path.unshift(current);
        current = previous[current];
    }

    return {
        distance: distances[endId],
        path
    };
}
