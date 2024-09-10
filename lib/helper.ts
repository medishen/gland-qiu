import { Factory } from "@medishn/gland-logger";
const logger = new Factory({
  level: "info",
  transports: ["console"],
  timestampFormat: "locale",
});
export { logger };
