export class Router {
    constructor(id, x, y) {
        this.id = id;
        this.x = x;
        this.y = y;
        this.active = true;
        this.connections = [];
    }
    connect(router, cost = 1) {
        this.connections.push({ router, cost });
    }
}
