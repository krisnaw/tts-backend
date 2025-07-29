import { OpenAPIHono } from "@hono/zod-openapi";
import { config } from "dotenv";
import { expand } from "dotenv-expand";
import { notFound, onError } from "stoker/middlewares";
import { defaultHook } from "stoker/openapi";

import { pinoLoggers } from "@/middlewares/pino-loggers";

import type { AppBindings, AppOpenAPI } from "./types";

;

expand(config());

export function createRouter() {
  return new OpenAPIHono<AppBindings>({
    strict: false,
    defaultHook,
  });
}

export default function createApp() {
  const app = createRouter();

  app.use(pinoLoggers());

  app.notFound(notFound);
  app.onError(onError);
  return app;
}

export function createTestApp(router: AppOpenAPI) {
  const testApp = createApp();
  testApp.route("/", router);
  return testApp;
}
