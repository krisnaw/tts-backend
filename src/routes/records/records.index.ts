import { jwt } from "hono/jwt";

import { JWT_SECRET } from "@/lib/constants";
import { createRouter } from "@/lib/create-app";

import * as handlers from "./records.handlers";
import * as routes from "./records.routes";

const security = [{ BearerAuth: [] }];

const router = createRouter();

// Add JWT auth middleware
router.use("/*", jwt({
  secret: JWT_SECRET,
}));

// Register component for auth
router.openAPIRegistry.registerComponent("securitySchemes", "Bearer", {
  type: "http",
  scheme: "bearer",
  bearerFormat: "JWT",
  description: "Bearer token authentication using JWT",
});

router.openapi(routes.listRecords, handlers.listRecords)
  .openapi(routes.create, handlers.createRecords)
  .openapi(routes.remove, handlers.removeRecords);

export default router;
