import {createRoute} from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import {jsonContent, jsonContentRequired} from "stoker/openapi/helpers";
import {z} from "zod";
import {insertRecordsSchema, insertUsersSchema, selectRecordsSchema} from "@/db/schema";
import {createErrorSchema, IdParamsSchema} from "stoker/openapi/schemas";
import {notFoundSchema} from "@/lib/constants";

const tags = ['Records']

export const listRecords = createRoute({
  path: '/records',
  method: 'get',
  tags,
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
        z.array(selectRecordsSchema),
        "List of records"
    )
  }
})

export const create = createRoute({
  path: "/records",
  method: "post",
  tags,
  request: {
    body: jsonContentRequired(
        insertRecordsSchema,
        "Create records"
    )
  },
  responses: {
    [HttpStatusCodes.OK]: jsonContent(
        selectRecordsSchema,
        "Record found"
    ),
    [HttpStatusCodes.UNPROCESSABLE_ENTITY]: jsonContent(
        createErrorSchema(insertUsersSchema),
        "The validation error(s)",
    ),
  }
})

export const remove = createRoute({
  path: "/records/{id}",
  method: "delete",
  tags,
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
  }
})

export type ListRecordsRoute = typeof listRecords;
export type CreateRecordsRoute = typeof create;
export type RemoveRecordsRoute = typeof remove;