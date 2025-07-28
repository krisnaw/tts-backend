import { pinoLogger } from "hono-pino";
import pino from "pino";
// import PinoPretty from "pino-pretty";

// import env from "@/env";

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
