import {asc, desc, eq} from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";
import {
  CreateRecordsRoute, GetRecordsByIdRoute,
  GetRecordsByUserIdRoute,
  ListRecordsRoute,
  RemoveRecordsRoute
} from "@/routes/records/records.routes";

import db from "@/db";
import { records } from "@/db/schema";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

export const listRecords: AppRouteHandler<ListRecordsRoute> = async (c) => {
  const items = await db.query.records.findMany({
    orderBy: [desc(records.createdAt)],
  });
  return c.json(items);
};

export const getRecordByUserId: AppRouteHandler<GetRecordsByUserIdRoute> = async (c) => {
  const {userId} = await c.req.valid("param");

  const items = await db.query.records.findMany({
    orderBy: [desc(records.createdAt)],
    where(fields, operators) {
      return operators.eq(records.userId, Number(userId))
    },
  });

  if (!items) {
    return c.json(
        {
          message: HttpStatusPhrases.NOT_FOUND,
        },
        HttpStatusCodes.NOT_FOUND
    )
  }
  return c.json(items, HttpStatusCodes.OK)
}

export const getRecordById: AppRouteHandler<GetRecordsByIdRoute> = async (c) => {
  const {id} = await c.req.valid("param");

  const record = await db.query.records.findFirst({
    orderBy: [desc(records.createdAt)],
    where(fields, operators) {
      return operators.eq(fields.id, id);
    },
  });

  if (!record) {
    return c.json(
        {
          message: HttpStatusPhrases.NOT_FOUND,
        },
        HttpStatusCodes.NOT_FOUND
    )
  }
  return c.json(record, HttpStatusCodes.OK)
}

export const createRecords: AppRouteHandler<CreateRecordsRoute> = async (c) => {
  const record = c.req.valid("json");

  // Check if the users exist
  const user = await db.query.users.findFirst({
    where(fields, operators) {
      return operators.eq(fields.id, record.userId);
    },
  });

  if (!user) {
    return c.json(
        {
          message: 'Invalid user id'
        },
        HttpStatusCodes.UNPROCESSABLE_ENTITY
    )
  }

  const [inserted] = await db.insert(records).values(record).returning();
  return c.json(inserted, HttpStatusCodes.OK);
};

export const removeRecords: AppRouteHandler<RemoveRecordsRoute> = async (c) => {
  const { id } = c.req.valid("param");

  await db.delete(records).where(eq(records.id, id));

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
