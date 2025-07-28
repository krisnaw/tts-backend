import {AppRouteHandler} from "@/lib/types";
import {ListRoute} from "@/routes/auth/auth.routes";
import db from "@/db";

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const users = await db.query.users.findMany();
  return c.json(users);
};