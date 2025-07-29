import { eq } from "drizzle-orm";
import * as HttpStatusCodes from "stoker/http-status-codes";

import type { AppRouteHandler } from "@/lib/types";
import type { CreateRecordsRoute, ListRecordsRoute, RemoveRecordsRoute } from "@/routes/records/records.routes";

import db from "@/db";
import { records } from "@/db/schema";

export const listRecords: AppRouteHandler<ListRecordsRoute> = async (c) => {
  const records = await db.query.records.findMany();
  return c.json(records);
};

export const createRecords: AppRouteHandler<CreateRecordsRoute> = async (c) => {
  const record = c.req.valid("json");

  const [inserted] = await db.insert(records).values(record).returning();
  return c.json(inserted, HttpStatusCodes.OK);
};

export const removeRecords: AppRouteHandler<RemoveRecordsRoute> = async (c) => {
  const { id } = c.req.valid("param");

  await db.delete(records).where(eq(records.id, id));

  return c.body(null, HttpStatusCodes.NO_CONTENT);
};
