import { createRoute } from "@hono/zod-openapi";

import { createRouter } from "@/lib/create-app";
import {z} from "zod";

const MessageSchema = z.object({
  message: z.string().openapi({
    example: "TTS API",
  }),
});

const router = createRouter()
  .openapi(createRoute({
    tags: ["Index"],
    method: "get",
    path: "/",
    responses: {
      200: {
        description: "TTS API Index",
        content: {
          "application/json": {
            schema: MessageSchema,
          },
        },
      },
    },

  }), (c) => {
    return c.json({
      message: "TTS API",
    }, 200);
  });

export default router;
