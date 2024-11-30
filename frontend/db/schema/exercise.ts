import { integer, sqliteTable, text } from 'drizzle-orm/sqlite-core';

export const exercise = sqliteTable('Exercise', {
  exercise_id: integer('id', {mode: "number"}).primaryKey({autoIncrement: true}).notNull(),
  name: text('name', {mode: "text"}).notNull(),
  muscle_group: text('muscle_group', {mode: "text"}).notNull(),
  equipment: text('equipment', {mode: "text"}).notNull(),
  custom: integer('custom', {mode: "number"}).default(0).notNull(),
  difficulty: text('difficulty', {mode: "text"}),
  instructions: text('instructions', {mode: "text"}),
  created_by: integer('created_by', {mode: "number"}).notNull(),
  video_id: text('video_id', {mode: "text"})
})