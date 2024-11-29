export class EventEmitter {
    constructor() {
        this.callbacks = [];
    }

    subscribe(callback) {
        this.callbacks.push(callback);
        return () =>
            (this.callbacks = this.callbacks.filter((cb) => cb !== callback));
    }

    emit(data) {
        this.callbacks.forEach((cb) => cb(data));
    }
}
