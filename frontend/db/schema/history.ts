import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const history = sqliteTable("History", {
  history_id: integer('history_id', {mode: 'number'}).primaryKey().notNull(),
  template_name: text('template_name', {mode: 'text'}).notNull(),
  elapsed_time: text('elapsed_time', {mode: 'text'}).notNull(),
  calories_burned: integer('calories_burned', {mode: 'number'}).notNull(),
  date: text('date', {mode: 'text'}).notNull()
})

export const historyExercise = sqliteTable("HistoryExercise", {
  history_exercise_id: integer('history_exercise_id', {mode: 'number'}).primaryKey().notNull(),
  history_id: integer('history_id', {mode: 'number'}).notNull().references(() => history.history_id),
  exercise_id: integer('exercise_id', {mode: 'number'}).notNull(),
  sets: integer('sets', {mode: 'number'}).notNull(),
  reps: integer('reps', {mode: 'number'}).notNull(),
  weight: integer('weight', {mode: 'number'}).notNull()
})