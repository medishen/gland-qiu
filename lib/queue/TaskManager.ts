import { Queue } from "./";
import { exec } from "child_process";
import { promisify } from "util";
import { RateLimit } from "../rate";
const execPromise = promisify(exec);

export class TaskManager {
  private queue: Queue<{
    cmd: string;
    resolve: (value: string) => void;
    reject: (reason: any) => void;
  }> = new Queue();
  private rateLimiter: RateLimit;
  private isProcessing: boolean = false;
  private shouldTerminate: boolean = false;

  constructor(rateLimit: RateLimit) {
    this.rateLimiter = rateLimit;
  }

  exec(cmd: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.shouldTerminate) {
        console.warn("Cannot enqueue tasks after close has been called.");
        reject(new Error("TaskManager has been closed."));
        return;
      }
      this.queue.enqueue({ cmd, resolve, reject });

      if (!this.isProcessing) {
        this.processQueue();
      }
    });
  }

  private async processQueue(): Promise<void> {
    this.isProcessing = true;

    while (!this.queue.isEmpty()) {
      const task = this.queue.dequeue();
      if (task) {
        const { cmd, resolve, reject } = task;

        if (!this.rateLimiter.isAllowed()) {
          await this.rateLimiter.waitForAvailability();
        }

        try {
          const result = await this.executeTask(cmd);
          resolve(result);
        } catch (error) {
          reject(error);
        }
      }
    }

    this.isProcessing = false;
  }

  private async executeTask(cmd: string): Promise<string> {
    const { stdout } = await execPromise(cmd);
    return stdout;
  }

  close(): void {
    if (this.isProcessing || !this.queue.isEmpty()) {
      console.log("Waiting for the remaining tasks to finish...");
    }
    this.shouldTerminate = true;
  }
}
