export enum ErrorLevel {
  CRITICAL = "Critical",
  WARNING = "Warning",
  INFO = "Info",
}
export interface opts {
  value?: boolean;
}
export type EXEC = (query: string, options?: opts) => Promise<void | string>;
