import {createRoute} from "@hono/zod-openapi";
import {z} from "zod";
import {selectUsersSchema} from "@/db/schema";
import * as HttpStatusCodes from "stoker/http-status-codes";
import { jsonContent } from "stoker/openapi/helpers";
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

export type ListRoute = typeof list;