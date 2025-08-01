import {createRoute} from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import {jsonContent, jsonContentRequired} from "stoker/openapi/helpers";
import {createErrorSchema, IdParamsSchema} from "stoker/openapi/schemas";
import {z} from "zod";

import {insertRecordsSchema, insertUsersSchema, selectRecordsSchema} from "@/db/schema";
import {notFoundSchema} from "@/lib/constants";

const tags = ["Records"];
const security = [{BearerAuth: []}];

export const listRecords = createRoute({
  path: "/records",
  method: "get",
  tags,
  security,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
        z.array(selectRecordsSchema),
        "List of records",
    ),
  },
});


const userIdSchema = z.object({
  userId: z
      .string()
      .min(1)
      .openapi({
        param: {
          name: 'userId',
          in: 'path',
        },
        example: '1',
      }),
})


export const getRecordsByUserId = createRoute({
  path: "/records/{userId}",
  method: "get",
  tags,
  request: {
    params: userIdSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
        z.array(selectRecordsSchema),
        "List of records belong to user"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
        notFoundSchema,
        "Record not found",
    ),
  }
})



export const getRecordsById = createRoute({
  path: "/record/{id}",
  method: "get",
  tags,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
        selectRecordsSchema,
        "Record"
    ),
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
        notFoundSchema,
        "Record not found",
    ),
  }
})

export const create = createRoute({
  path: "/records",
  method: "post",
  tags,
  security,
  request: {
    body: jsonContentRequired(
        insertRecordsSchema,
        "Create records",
    ),
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
        selectRecordsSchema,
        "Record found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
        z.object({
          message: z.string(),
        }),
        "The validation error(s)",
    ),
  },
});

export const remove = createRoute({
  path: "/records/{id}",
  method: "delete",
  tags,
  security,
  request: {
    params: IdParamsSchema,
  },
  responses: {
    [HttpStatusCodes.NO_CONTENT]: {
      description: "Task deleted",
    },
    [HttpStatusCodes.NOT_FOUND]: jsonContent(
        notFoundSchema,
        "Record not found",
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
        createErrorSchema(IdParamsSchema),
        "Invalid id error",
    ),
  },
});

export type ListRecordsRoute = typeof listRecords;
export type GetRecordsByUserIdRoute = typeof getRecordsByUserId;
export type GetRecordsByIdRoute = typeof getRecordsById;
export type CreateRecordsRoute = typeof create;
export type RemoveRecordsRoute = typeof remove;
