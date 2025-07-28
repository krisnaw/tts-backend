import {createRoute} from "@hono/zod-openapi";
import * as HttpStatusCodes from "stoker/http-status-codes";
import {z} from "zod";
import {selectUsersSchema} from "@/db/schema";
import { jsonContent } from "stoker/openapi/helpers";
const tags = ["Auth"];

const MessageSchema = z.object({
  message: z.string().openapi({
    example: "TTS API",
  }),
});

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