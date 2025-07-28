import {createRoute} from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import {jsonContent, jsonContentRequired} from "stoker/openapi/helpers";
import {z} from "zod";
import {insertRecordsSchema, insertUsersSchema, selectRecordsSchema} from "@/db/schema";
import {createErrorSchema} from "stoker/openapi/schemas";
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

export const createRecords = createRoute({
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

export type ListRecordsRoute = typeof listRecords;
export type CreateRecordsRoute = typeof createRecords;