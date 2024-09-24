import { Cache } from "./cache";
import { RateLimit } from "./rate";
import { TaskManager } from "./queue/TaskManager";
import * as fs from "fs/promises";
import { opts } from "./types";
import { ExecFunction } from "./types/index";

export class Qiu {
  private caching = new Cache<string, string>();
  private rateLimiter = new RateLimit(500, 10000);
  private manager = new TaskManager(this.rateLimiter);
  private type: "pg" | "mysql" | "mariadb";
  private primary: string = "";
  private name?: string;
  constructor(type: "pg" | "mysql" | "mariadb", primary: string) {
    this.primary = primary;
    this.type = type;
  }

  use = (name: string): void => {
    this.name = name;
  };

  private get = (): string => {
    switch (this.type) {
      case "pg":
        return `psql ${this.primary}`;
      case "mysql":
      case "mariadb":
        return `${this.type === "mysql" ? "mysql" : "mariadb"} ${this.primary}`;
      default:
        throw new Error("Unsupported database type");
    }
  };

  private build = (q: string, b: string, f: boolean): string => {
    if (this.type === "pg") {
      const use = this.name ? `\\c ${this.name}; ` : "";
      if (f) {
        return `${b} -f ${q}`;
      } else {
        return `${b} -c "${use}${q}"`;
      }
    } else {
      const use = this.name ? `USE ${this.name}; ` : "";
      return f ? `${b} < ${q}` : `${b} -e "${use}${q}"`;
    }
  };

  exec = async (query: string, options: opts = {}): Promise<void | string> => {
    const { value = false } = options;

    const isFileQuery = query.endsWith(".sql");
    if (isFileQuery) {
      try {
        await fs.lstat(query);
      } catch (err: any) {
        if (err.code === "ENOENT") {
          throw new Error("File not found.");
        }
      }
    }
    if (!this.caching.has("base")) {
      this.caching.set("base", this.get());
    }
    const base = this.caching.get("base");
    const command = this.build(query, base!, isFileQuery);
    if (!value) {
      this.manager.enqueue(command);
    } else {
      return await this.manager.exec(command);
    }
  };
}
export { ExecFunction };
