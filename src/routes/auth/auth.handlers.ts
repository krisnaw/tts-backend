import { sign } from "hono/jwt";
import * as HttpStatusCodes from "stoker/http-status-codes";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

import type { AppRouteHandler } from "@/lib/types";
import type { ListRoute, LoginRoute, RegisterRoute } from "@/routes/auth/auth.routes";

import db from "@/db";
import { users } from "@/db/schema";
import { JWT_SECRET } from "@/lib/constants";
import { scrypt, randomBytes, timingSafeEqual } from 'node:crypto';
import { promisify } from 'node:util';

export const list: AppRouteHandler<ListRoute> = async (c) => {
  const users = await db.query.users.findMany({
    columns: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  return c.json(users);
};
const scryptAsync = promisify(scrypt);

async function hashPassword(password: string) {
  const salt = randomBytes(32);
  const derivedKey = await scryptAsync(password, salt, 64);
  // @ts-ignore
  return salt.toString('hex') + ':' + derivedKey.toString('hex');
}

// Verify a password
async function verifyPassword(password: string, hash: string) {
  const [saltHex, keyHex] = hash.split(':');
  const salt = Buffer.from(saltHex, 'hex');
  const originalKey = Buffer.from(keyHex, 'hex');
  const derivedKey = await scryptAsync(password, salt, 64);

  // @ts-ignore
  return timingSafeEqual(originalKey, derivedKey);
}

export const register: AppRouteHandler<RegisterRoute> = async (c) => {
  const user = c.req.valid("json");

  // const saltRounds = 10;
  // const hashedPassword = await bcrypt.hash(user.password, saltRounds);

  const hashedPassword = await hashPassword(user.password);

  const [inserted] = await db.insert(users).values({
    ...user,
    password: hashedPassword,
  }).returning();

  const payload = {sub: inserted.email, role: "user", exp: Math.floor(Date.now() / 1000) + (60 * 60)}

  // Sign the JWT with the secret key
  const token = await sign(payload, JWT_SECRET);

  // Remove password from the result
  const { password, ...userWithoutPassword } = inserted;
  const responses = {user: userWithoutPassword, token};

  return c.json(responses, HttpStatusCodes.OK);
};

export const login: AppRouteHandler<LoginRoute> = async (c) => {
  const data = c.req.valid("json");

  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.email, data.email.trim());
    },
  });

  if (!user) {
    return c.json(
      {
        message: HttpStatusPhrases.NOT_FOUND,
      },
      HttpStatusCodes.NOT_FOUND,
    );
  }

  // Verify password
  // const isPasswordValid = bcrypt.compare(data.password, user.password);
  const isPasswordValid = verifyPassword(data.password, user.password)

  if (!isPasswordValid) {
    return c.json(
      {
        message: "Invalid password",
      },
      HttpStatusCodes.UNAUTHORIZED,
    );
  }

  const payload = {sub: user.email, role: "user", exp: Math.floor(Date.now() / 1000) + (60 * 60)};

  // Sign the JWT with the secret key
  const token = await sign(payload, JWT_SECRET);

  // Remove password from the result
  const { password, ...userWithoutPassword } = user;

  const responses = {user: userWithoutPassword, token: token};

  return c.json(responses, HttpStatusCodes.OK);
};
