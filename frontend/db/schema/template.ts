import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const template = sqliteTable('Template', {
  template_id: integer('template_id', {mode: "number"}).primaryKey({autoIncrement: true}).notNull(),
  template_name: text('template_name', {mode: "text"}).notNull(),
  custom: integer('custom', {mode: "number"}).default(0),
  created_by: integer('created_by', {mode: "number"}).notNull(),
})