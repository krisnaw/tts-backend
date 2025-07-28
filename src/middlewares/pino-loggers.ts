import { pinoLogger } from "hono-pino";
import pino from "pino";

export function pinoLoggers() {
  return pinoLogger({
    pino: pino(
      {
        level: "info",
      },
      undefined,
    ),
    http: {
      reqId: () => crypto.randomUUID(),
    },
  });
}
