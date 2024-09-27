export enum ErrorLevel {
  CRITICAL = "Critical",
  WARNING = "Warning",
  INFO = "Info",
}
export interface opts {
  value?: boolean;
  isFile?: boolean;
}
export type ExecFunction = (
  query: string,
  options?: opts
) => Promise<void | string>;
export interface getType {
  [key: string]: {
    run_query: string;
    file: string;
  };
}
export interface GetType {
  run_query: string;
  file: string;
}
export type DatabaseSqlType = "mysql" | "postgresql" | "sqlserver" | "oracle";
export interface Config {
  type: DatabaseSqlType;
  connect: string;
}
export interface DBConfig {
  sql: {
    [key in DatabaseSqlType]: {
      run_query: string;
      file: string;
    };
  };
}
