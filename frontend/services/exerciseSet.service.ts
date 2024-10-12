import { exerciseSets } from "@/db/schema/exerciseSets";
import { db } from "@/lib/drizzleClient"
import { eq } from "drizzle-orm"

const getAllExerciseSets = async () => {
  return await db.select().from(exerciseSets)
}

const getExerciseSetById = async (id: number) => {
  return await db.select().from(exerciseSets).where(eq(exerciseSets.exercise_set_id, id))
}

const getAllExerciseSetsByTemplateId = async (templateId: number) => {
  return await db.select().from(exerciseSets).where(eq(exerciseSets.template_id, templateId))
}

const addExerciseSet = async (reps: number, weight: number, item_id: number, template_id: number) => {
  return await db.insert(exerciseSets).values({
    reps,
    weight,
    template_item_id: item_id,
    template_id
  })
}

const updateReps = async (exerciseSetId: number, reps: number) => {
  return await db.update(exerciseSets).set({
    reps
  }).where(eq(exerciseSets.exercise_set_id, exerciseSetId))
}

const updateWeight = async (exerciseSetId: number, weight: number) => {
  return await db.update(exerciseSets).set({
    weight
  }).where(eq(exerciseSets.exercise_set_id, exerciseSetId))
}

const deleteExerciseSetByExerciseId = async (exerciseSetId: number) => {
  return await db.delete(exerciseSets).where(eq(exerciseSets.exercise_set_id, exerciseSetId))
}

export default {
  getAllExerciseSets,
  getExerciseSetById,
  getAllExerciseSetsByTemplateId,
  addExerciseSet,
  updateReps,
  updateWeight,
  deleteExerciseSetByExerciseId
}