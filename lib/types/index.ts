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
export interface UnifiedDBConfig {
  run_query: string;
  file: string;
}
export type SqlTypes = "mysql" | "postgresql" | "sqlserver" | "oracle";
export type NoSqlTypes = "redis";
export type DBTypes = SqlTypes | NoSqlTypes;
export interface Config {
  type: DBTypes;
  connect: string;
}
export type DBConfig = {
  sql: Record<SqlTypes, UnifiedDBConfig>;
  nosql: Record<NoSqlTypes, NoSqlTypes>;
};