import { exec } from "child_process";
import { promisify } from "util";
import { Cache } from "./cache";
import * as fs from "fs/promises";
import { logger } from "./helper";
import { Encryption } from "./encryption";
import { Sanitizer } from "./sanitize";
export namespace CLI {
  const caching = new Cache<string, string>();
  const execPromise = promisify(exec);
  export class CONFIG {
    static type: "pg" | "mysql" | "mariadb" = "pg";
    static primary: string = "";
    static databaseName?: string;
    static configure(
      t: "pg" | "mysql" | "mariadb",
      primary: string,
      databaseName?: string
    ) {
      this.type = t;
      this.primary = Encryption.encrypt(primary);
      this.databaseName = databaseName;
      if (databaseName) {
        this.createDatabase();
      }
    }
    static async createDatabase() {
      const createDbCommand = this.getCreateDbCommand();
      await CLI.execute(createDbCommand);
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
      let isFile = false;
      try {
        const stats = await fs.lstat(query);
        isFile = stats.isFile();
      } catch (err: any) {
        if (err.code !== "ENOENT") {
          throw err;
        }
      }

      if (!caching.has("base")) {
        caching.set("base", CONFIG.get());
      }
      const base = caching.get("base");

      if (!isFile) {
        query = Sanitizer.input(query);
      }
      const useDbCommand = `USE ${this.databaseName};`;
      const command: string = isFile
        ? `${base} -e "${useDbCommand}" < ${query}`
        : `${base} -e "${useDbCommand} ${query}"`;

      return await CLI.execute(command);
    }
    static getCreateDbCommand(): string {
      const base = this.get();
      switch (this.type) {
        case "pg":
          return `${base} -c "CREATE DATABASE ${this.databaseName};"`;
        case "mysql":
        case "mariadb":
          return `${base} -e "CREATE DATABASE IF NOT EXISTS ${this.databaseName};"`;
        default:
          throw new Error("Unsupported database type");
      }
    }
  }
  export async function execute(cmd: string): Promise<string> {
    if (caching.has(cmd)) {
      return caching.get(cmd)!;
    }

    try {
      console.log("Executing command:", cmd);
      const { stdout, stderr } = await execPromise(cmd);
      if (stderr) {
        logger.log(`Error executing command: ${cmd}`, "error");
        if (stderr.includes("ERROR 1064")) {
          throw new Error(
            "SQL Syntax Error: Please check your SQL query for syntax issues."
          );
        }
        throw new Error(`Command execution failed with error: ${stderr}`);
      }
      caching.set(cmd, stdout);
      return stdout;
    } catch (err: any) {
      if (err.code === "ENOENT") {
        logger.log("Command execution failed: File not found", "error");
        throw new Error(
          "File not found. Please ensure the file path is correct."
        );
      }
      throw new Error(`${err.message}`);
    }
  }
}
