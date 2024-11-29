export class EventEmitter<T = any> {
    private callbacks: Array<(data: T) => void>;

    constructor() {
        this.callbacks = [];
    }

    subscribe(callback: (data: T) => void): () => void {
        this.callbacks.push(callback);
        return () => {
            this.callbacks = this.callbacks.filter((cb) => cb !== callback);
        };
    }

    emit(data: T): void {
        this.callbacks.forEach((cb) => cb(data));
    }
}