import { createConnection, Socket } from "net";
import { Config } from "./types";

export class Pool {
  private pool: Socket[] = [];
  private activeConnections: number = 0;
  private waitingQueue: (() => void)[] = [];
  private connectionTimeout: number = 100;
  private idleTimeout: number = 3000;

  constructor(
    private maxConnections: number,
    private connection: string,
    private type: Config["type"]
  ) {}

  async get(): Promise<Socket> {
    if (this.pool.length > 0) {
      return this.pool.pop()!;
    }
    if (this.activeConnections < this.maxConnections) {
      return this.create();
    }
    return new Promise<Socket>((resolve) => {
      this.waitingQueue.push(async () => {
        resolve(await this.get());
      });
    });
  }

  private create(): Socket {
    this.activeConnections++;

    let h: string, p: number;
    if (["mysql", "postgresql", "sqlserver", "oracle"].includes(this.type)) {
      const host = this.connection.match(/-h\s+([^\s]+)/);
      const port = this.connection.match(/-p\s+(\d+)/);
      h = host ? host[1].trim() : "localhost";
      p = port ? Number(port[1].trim()) : 3306;
    } else if (this.type === "redis") {
      const [host, port] = this.connection.split(":");
      h = host;
      p = +port;
    }

    if (isNaN(p!) || p! < 0 || p! >= 65536) {
      throw new RangeError("Port should be >= 0 and < 65536");
    }

    const socket = createConnection({ host: h!, port: p! });

    socket.on("error", (err) => {
      console.error("Connection error:", err);
      this.activeConnections--;
      this.processQueue();
    });

    socket.setTimeout(this.connectionTimeout, () => {
      socket.destroy();
      this.activeConnections--;
      this.processQueue();
      this.close();
    });

    return socket;
  }

  add(connection: Socket): void {
    if (!connection.destroyed) {
      this.pool.push(connection);
      setTimeout(() => this.removeIdleConnection(connection), this.idleTimeout);
    }
    this.processQueue();
  }

  private removeIdleConnection(connection: Socket) {
    const index = this.pool.indexOf(connection);
    if (index > -1) {
      connection.end();
      this.pool.splice(index, 1);
      this.activeConnections--;
    }
  }

  private processQueue(): void {
    if (
      this.waitingQueue.length > 0 &&
      this.activeConnections < this.maxConnections
    ) {
      const nextTask = this.waitingQueue.shift();
      if (nextTask) {
        nextTask();
      }
    }
  }

  close(): void {
    while (this.pool.length > 0) {
      const connection = this.pool.pop();
      if (connection) {
        connection.end();
      }
    }
    this.activeConnections = 0;
  }
}
