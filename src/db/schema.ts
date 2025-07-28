import {integer, numeric, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";
import {relations} from "drizzle-orm";

export const users = pgTable("users", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  name: varchar({length: 255}).notNull(),
  email: varchar({length: 255}).notNull().unique(),
  password: text().notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow()
});

export const selectUsersSchema = createSelectSchema(users).omit({
  password: true,
})

export const insertUsersSchema = createInsertSchema(users)
    .required({
      name: true,
      email: true,
      password: true,
    })
    .omit({
      id: true,
      createdAt: true,
      updatedAt: true,
    })

export const loginUserSchema = insertUsersSchema.partial()
    .omit({
      name: true,
    })
    .required({
      email: true,
      password: true
    })

export const records = pgTable("records", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  content: text().notNull(),
  pitch: numeric('pitch', { precision: 5, scale: 2 }).default('1.0').notNull(), // Default 1.0, range 0.0 to 2.0
  volume: numeric('volume', { precision: 5, scale: 2 }).default('1.0').notNull(), // Default 1.0, range 0.0 to 1.0
  rate: numeric('rate', { precision: 5, scale: 2 }).default('1.0').notNull(),
  voice: text().notNull(),
  userId: integer('user_id').notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow()
})

export const recordsRelations = relations(records, ({ one }) => ({
  author: one(users, {
    fields: [records.userId],
    references: [users.id],
  }),
}));

export const selectRecordsSchema = createSelectSchema(records);
export const insertRecordsSchema = createInsertSchema(records);