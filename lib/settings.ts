import { Config, GetType, NoSqlType, SqlType } from "./types";
import db from "./db.json";

export class Settings {
  private type: Config["type"];
  constructor({ type }: Config) {
    this.type = type;
  }

  public get(): GetType {
    const sqlConfig = db.sql[this.type as SqlType];
    const nosqlConfig = db.nosql[this.type as NoSqlType];
    return {
      ...sqlConfig,
      ...nosqlConfig,
    };
  }
}
