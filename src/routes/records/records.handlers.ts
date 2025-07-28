import {AppRouteHandler} from "@/lib/types";
import {CreateRecordsRoute, ListRecordsRoute} from "@/routes/records/records.routes";
import db from "@/db";
import {records} from "@/db/schema";
import * as HttpStatusCodes from "stoker/http-status-codes";

export const listRecords: AppRouteHandler<ListRecordsRoute> = async (c) => {
  const records = await db.query.records.findMany()
  return  c.json(records)
}

export const createRecords: AppRouteHandler<CreateRecordsRoute> = async (c) => {
  const record = c.req.valid("json")

  const [inserted] = await db.insert(records).values(record).returning()
  return c.json(inserted, HttpStatusCodes.OK)
}