export class Queue<T> {
  private queue: T[] = [];
  enqueue(task: T): void {
    this.queue.push(task);
  }
  dequeue(): T | undefined {
    return this.queue.shift();
  }
  isEmpty(): boolean {
    return this.queue.length === 0;
  }
}
