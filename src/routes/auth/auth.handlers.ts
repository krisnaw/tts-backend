import {AppRouteHandler} from "@/lib/types";
import {ListRoute, RegisterRoute} from "@/routes/auth/auth.routes";
import db from "@/db";
import {users} from "@/db/schema";
import * as HttpStatusCodes from "stoker/http-status-codes";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const users = await db.query.users.findMany();
  return c.json(users);
};

export const register: AppRouteHandler<RegisterRoute> = async (c) => {
  const user = c.req.valid("json")
  const [inserted] = await db.insert(users).values(user).returning()
  return c.json(inserted, HttpStatusCodes.OK)
}