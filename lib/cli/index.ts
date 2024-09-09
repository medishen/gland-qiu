import { exec } from "child_process";
import path from "path";
import { promisify } from "util";
import { Cache } from "../helper/cache";
import * as fs from "fs/promises";
import { logger } from "../helper";
import { Encryption } from "../encryption";
import { Sanitizer } from "../sanitize";
export namespace CLI {
  const caching = new Cache<string, string>();
  const execPromise = promisify(exec);
  export class CONFIG {
    static type: "pg" | "mysql" | "mariadb" = "pg";
    static primary: string = "";
    static configure(t: "pg" | "mysql" | "mariadb", primary: string) {
      this.type = t;
      this.primary = Encryption.encrypt(primary);
    }
    static get(): string {
      var dec = Encryption.decrypt(this.primary);
      switch (this.type) {
        case "pg":
          return `psql ${dec} "`;
        case "mysql":
          return `mysql ${dec}`;
        case "mariadb":
          return `mariadb ${dec}`;
        default:
          throw new Error("Unsupported database type");
      }
    }
    static async run(query: string): Promise<any> {
      const stats = await fs.lstat(query);
      const isFile = stats.isFile();
      if (!caching.has("base")) {
        caching.set("base", CONFIG.get());
      }
      const base = caching.get("base");
      if (!isFile) {
        query = Sanitizer.input(query);
      }

      let command: string = isFile
        ? `${base} < "${query}"`
        : `${base} -e "${query}"`;

      return await CLI.execute(command);
    }
  }
  export async function execute(cmd: string): Promise<string> {
    if (caching.has(cmd)) {
      return caching.get(cmd)!;
    }
    try {
      const { stdout, stderr } = await execPromise(cmd);

      if (stderr) {
        logger.log("Command execution failed with error", "error");
        throw new Error(stderr);
      }
      caching.set(cmd, stdout);
      return stdout;
    } catch (err: any) {
      throw new Error(`Command execution failed: ${err.message}`);
    }
  }
}