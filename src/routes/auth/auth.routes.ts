import { createRoute } from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent, jsonContentRequired } from "stoker/openapi/helpers";
import { createErrorSchema } from "stoker/openapi/schemas";
import { z } from "zod";

import { insertUsersSchema, loginUserSchema, selectUsersSchema } from "@/db/schema";
import { notFoundSchema } from "@/lib/constants";

const tags = ["Auth"];

export const list = createRoute({
  path: "/users",
  method: "get",
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.array(selectUsersSchema),
      "The list of users",
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
      "The user to register",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
        z.object({
          user: selectUsersSchema,
          token: z.string(),
        }),
      "The created user",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(insertUsersSchema),
      "The validation error(s)",
    ),
  },
});

export const login = createRoute({
  path: "/login",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(
      loginUserSchema,
      "The user to login",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
      z.object({
        user: selectUsersSchema,
        token: z.string(),
      }),
      "Login success",
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
      notFoundSchema,
      "Not found",
    ),
    [HttpStatusCodes.UNAUTHORIZED]: jsonContent(
      z.object({
        message: z.string(),
      }),
      "Invalid password",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
      createErrorSchema(loginUserSchema),
      "The validation error(s)",
    ),
  },
});

export const samplePost = createRoute({
  path: "/samplepost",
  method: "post",
  tags,
  responses: {

    [HttpStatusCodes.OK]: jsonContent(
        selectUsersSchema,
        "Login success",
    ),

    [HttpStatusCodes.NOT_FOUND]: jsonContent(
        notFoundSchema,
        "Task not found",
    ),
  }
})

export type ListRoute = typeof list;
export type RegisterRoute = typeof register;
export type LoginRoute = typeof login;
export type SamplePostRoute = typeof samplePost;
