import {AppRouteHandler} from "@/lib/types";
import {ListRoute, LoginRoute, RegisterRoute} from "@/routes/auth/auth.routes";
import db from "@/db";
import {users} from "@/db/schema";
import * as HttpStatusCodes from "stoker/http-status-codes";
import bcrypt from "bcrypt"
import * as HttpStatusPhrases from "stoker/http-status-phrases";
import {varchar} from "drizzle-orm/pg-core";

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
  const data = c.req.valid("json");

  if (!data.password) {
    return c.json(
        {
          message: HttpStatusPhrases.NOT_FOUND,
        },
        HttpStatusCodes.NOT_FOUND,
    );
  }

  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.email, data.email);
    },
  })

  if (!user) {
    return c.json(
        {
          message: HttpStatusPhrases.NOT_FOUND,
        },
        HttpStatusCodes.NOT_FOUND,
    );
  }

  // Verify password
  const isPasswordValid =  bcrypt.compare(data.password, user.password);

  if (!isPasswordValid) {
    return c.json(
        {
          message: HttpStatusPhrases.NOT_FOUND,
        },
        HttpStatusCodes.NOT_FOUND,
    );
  }



  return c.json()
}