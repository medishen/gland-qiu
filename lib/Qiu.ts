import { Cache } from "./cache";
import { RateLimit } from "./rate";
import { TaskManager } from "./queue/TaskManager";
import { Config, opts, UnifiedDBConfig } from "./types";
import { ExecFunction } from "./types/index";
import { Settings } from "./settings";
export class Qiu {
  private caching = new Cache<string, string>();
  private rateLimiter = new RateLimit(500, 10000);
  private manager = new TaskManager(this.rateLimiter);
  private type: Config["type"];
  private connect: Config["connect"];
  constructor({ connect, type }: Config) {
    this.connect = connect;
    this.type = type;
    this.initializeBase();
  }
  private initializeBase(): void {
    if (!this.caching.has("base")) {
      this.caching.set("base", this.connect!);
    }
  }
  private getTypeDb(): UnifiedDBConfig {
    const settings = Settings.Main.create({
      connect: this.connect,
      type: this.type,
    });
    return settings;
  }

  private build({
    base,
    isFile,
    query,
  }: {
    query: string;
    base: string;
    isFile: boolean;
  }): string {
    const { file, run_query } = this.getTypeDb();
    if (isFile) {
      return `${base} ${file.replace("{file}", query)}`;
    }
    if (["mysql", "postgresql", "sqlserver", "oracle"].includes(this.type)) {
      return `${this.connect} ${run_query.replace("{query}", query)}`;
    } else {
      return `${base} ${run_query.replace("{query}", query)}`;
    }
  }
  exec = async (query: string, options: opts = {}): Promise<void | string> => {
    const { value = false, isFile = false } = options;
    const base = this.caching.get("base");
    const cmd = this.build({ base: base!, isFile, query });
    const result = await this.manager.exec(cmd);
    if (value) {
      return result;
    }
  };
}
export { ExecFunction };
