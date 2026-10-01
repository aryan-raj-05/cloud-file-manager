import { config } from "./config.js";

export const logger = {
  info(...params: any[]) {
    if (config.NODE_ENV !== "test") {
      console.log(...params);
    }
  },

  error(...params: any[]) {
    if (config.NODE_ENV !== "test") {
      console.error(...params);
    }
  },
};
