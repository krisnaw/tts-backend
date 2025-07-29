import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";
import {
  CreateRecordsRoute,
  GetRecordsByUserIdRoute,
  ListRecordsRoute,
  RemoveRecordsRoute
} from "@/routes/records/records.routes";

import db from "@/db";
import { records } from "@/db/schema";
import * as HttpStatusPhrases from "stoker/http-status-phrases";

export const listRecords: AppRouteHandler<ListRecordsRoute> = async (c) => {
  const records = await db.query.records.findMany();
  return c.json(records);
};

export const getRecordByUserId: AppRouteHandler<GetRecordsByUserIdRoute> = async (c) => {
  const {id} = await c.req.valid("param");

  const records = await db.query.records.findMany({
    where(fields, operators) {
      return operators.eq(fields.userId, id);
    },
  });

  if (!records) {
    return c.json(
        {
          message: HttpStatusPhrases.NOT_FOUND,
        },
        HttpStatusCodes.NOT_FOUND
    )
  }
  return c.json(records, HttpStatusCodes.OK)
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
