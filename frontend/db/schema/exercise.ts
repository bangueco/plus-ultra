import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const exercise = sqliteTable('Exercise', {
  exercise_id: integer('id', {mode: "number"}).primaryKey({autoIncrement: true}).notNull(),
  exercise_name: text('name', {mode: "text"}).notNull(),
  exercise_muscle_group: text('muscleGroup', {mode: "text"}).notNull(),
  exercise_equipment: text('equipment', {mode: "text"}).notNull(),
  exercise_custom: integer('custom', {mode: "number"}),
  exercise_instructions: text('instructions', {mode: "text"}),
})