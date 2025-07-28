import { pinoLogger } from "hono-pino";
import pino from "pino";
import pretty from "pino-pretty";
export function pinoLoggers() {
  return pinoLogger({
    pino: pino(
      {
        level: "info",
      },
      pretty()
    ),
    http: {
      referRequestIdKey: crypto.randomUUID().toString()
    },
  });
}