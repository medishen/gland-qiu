import { Cache } from "./cache";
import { RateLimit } from "./rate";
import { TaskManager } from "./queue/TaskManager";
import { Config, DatabaseSqlType, DBConfig, opts } from "./types";
import { ExecFunction, GetType } from "./types/index";
import dbTypes from "./db.json";
export class Qiu {
  private caching = new Cache<string, string>();
  private rateLimiter = new RateLimit(500, 10000);
  private manager = new TaskManager(this.rateLimiter);
  private type: DatabaseSqlType;
  private connect: Config["connect"];
  private dbConfig = dbTypes as DBConfig;
  constructor({ connect, type }: Config) {
    this.connect = connect;
    this.type = type;
    this.initializeBase();
  }
  private initializeBase(): void {
    if (!this.caching.has("base")) {
      this.caching.set("base", this.connect);
    }
  }
  private getTypeDb(): GetType {
    return this.dbConfig.sql[this.type];
  }
  private build(query: string, base: string, isFile: boolean): string {
    const { file, run_query } = this.getTypeDb();
    if (isFile) {
      return `${base} ${file.replace("{file}", query)}`;
    } else {
      return `${base} ${run_query.replace("{query}", query)}`;
    }
  }
  exec = async (query: string, options: opts = {}): Promise<void | string> => {
    const { value = false, isFile = false } = options;
    const base = this.caching.get("base");
    const command = this.build(query, base!, isFile);
    const result = await this.manager.exec(command);
    if (value) {
      return result;
    }
  };
  close(): void {
    this.manager.close();
  }
}
export { ExecFunction };
