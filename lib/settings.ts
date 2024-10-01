import { Config, NoSqlTypes, SqlTypes } from "./types";
import db from "./db.json";
export namespace Settings {
  export class Main {
    private static type: Config["type"];
    static create({ type }: Config): ReturnType<typeof Main.get> {
      this.type = type;
      return Main.get();
    }
    static get() {
      const sqlConfig = db.sql[this.type as SqlTypes];
      const nosqlConfig = db.nosql[this.type as NoSqlTypes];
      return {
        ...sqlConfig,
        ...nosqlConfig,
      };
    }
  }
}
