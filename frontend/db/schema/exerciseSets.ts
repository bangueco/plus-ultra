import { integer, sqliteTable } from 'drizzle-orm/sqlite-core';
import { templateItem } from './templateItems';
import { template } from './template';

export const exerciseSets = sqliteTable('ExerciseSet', {
  exercise_set_id: integer('exercise_sets_id', {mode: "number"}).primaryKey({autoIncrement: true}).notNull(),
  reps: integer('reps', {mode: "number"}).notNull(),
  weight: integer('weight', {mode: "number"}).notNull(),
  template_item_id: integer('template_item_id', {mode: "number"}).notNull().references(() => templateItem.template_id),
  template_id: integer('template_id', {mode: "number"}).notNull().references(() => template.template_id),
})