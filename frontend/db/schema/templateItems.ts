import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';
import { template } from './template';
import { exercise } from './exercise';

export const templateItem = sqliteTable('TemplateItem', {
  template_item_id: integer('template_item_id', {mode: "number"}).primaryKey({autoIncrement: true}).notNull(),
  template_item_name: text('template_item_name', {mode: "text"}).notNull(),
  muscle_group: text('muscle_group', {mode: "text"}).notNull(),
  template_id: integer('template_id', {mode: "number"}).notNull().references(() => template.template_id),
  exercise_id: integer('exercise_id', {mode: "number"}).notNull().references(() => exercise.exercise_id),
})