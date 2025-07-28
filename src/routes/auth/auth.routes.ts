import {createRoute} from "@hono/zod-openapi";
import {z} from "zod";
import {insertUsersSchema, selectUsersSchema} from "@/db/schema";
import * as HttpStatusCodes from "stoker/http-status-codes";
import {jsonContent, jsonContentRequired} from "stoker/openapi/helpers";
import {createErrorSchema} from "stoker/openapi/schemas";
const tags = ["Auth"];

export const list = createRoute({
  path: "/users",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
        z.array(selectUsersSchema),
        "The list of tasks",
    ),
  },
});

export const register = createRoute({
  path: "/register",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(
        insertUsersSchema,
        "Success, user created",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
        selectUsersSchema,
        "Success, user created"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
        createErrorSchema(insertUsersSchema),
        "The validation error(s)",
    ),
  }
})

export type ListRoute = typeof list;
export type RegisterRoute = typeof register;