export enum ErrorLevel {
  CRITICAL = "Critical",
  WARNING = "Warning",
  INFO = "Info",
}
export interface opts {
  value?: boolean;
}
export type ExecFunction = (query: string, options?: opts) => Promise<void | string>;
