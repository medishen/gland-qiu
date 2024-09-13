import { Queue } from "./";
import { exec } from "child_process";
import { promisify } from "util";
import { RateLimit } from "../rate";

const execPromise = promisify(exec);

export class TaskManager {
  private queue: Queue<string> = new Queue();
  private rateLimiter: RateLimit;
  private isProcessing: boolean = false;

  constructor(rateLimit: RateLimit) {
    this.rateLimiter = rateLimit;
  }
  async exec(cmd: string): Promise<string> {
    return await this.executeTask(cmd);
  }
  enqueue(task: string): void {
    this.queue.enqueue(task);
    if (!this.isProcessing) {
      this.processQueue();
    }
  }

  private async processQueue(): Promise<void> {
    this.isProcessing = true;

    while (!this.queue.isEmpty()) {
      const task = this.queue.dequeue();
      if (task) {
        if (!this.rateLimiter.isAllowed()) {
          await this.rateLimiter.waitForAvailability();
        }
        await this.executeTask(task);
      }
    }
    this.isProcessing = false;
    if (this.queue.isEmpty()) {
      process.exit(0); // Clean exit
    }
  }

  private async executeTask(cmd: string): Promise<string> {
    const { stdout, stderr } = await execPromise(cmd);
    if (stderr) {
      if (stderr.includes("ERROR 1064")) {
        throw new Error(
          "SQL Syntax Error: Please check your SQL query for syntax issues."
        );
      }
      throw new Error(`Command execution failed with error: ${stderr}`);
    }
    return stdout;
  }
}
