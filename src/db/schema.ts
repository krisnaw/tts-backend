import {integer, pgTable, text, timestamp, varchar} from "drizzle-orm/pg-core";
import {createInsertSchema, createSelectSchema} from "drizzle-zod";

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

export const recorder = pgTable("recorder", {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  content: text().notNull(),
  createdAt: timestamp().defaultNow(),
  updatedAt: timestamp().defaultNow()
})