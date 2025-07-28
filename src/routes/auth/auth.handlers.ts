import {AppRouteHandler} from "@/lib/types";
import {ListRoute, LoginRoute, RegisterRoute} from "@/routes/auth/auth.routes";
import db from "@/db";
import {users} from "@/db/schema";
import * as HttpStatusCodes from "stoker/http-status-codes";
import bcrypt from "bcrypt"

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const users = await db.query.users.findMany();
  return c.json(users);
};

export const register: AppRouteHandler<RegisterRoute> = async (c) => {
  const user = c.req.valid("json")

  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(user.password, saltRounds);

  const [inserted] = await db.insert(users).values({
    ...user,
    password: hashedPassword
  }).returning()

  return c.json(inserted, HttpStatusCodes.OK)
}

export const login: AppRouteHandler<LoginRoute> = async (c) => {
  const user = c.req.valid("json")
  return c.json()
}