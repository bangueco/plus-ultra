import { exerciseSets } from "@/db/schema/exerciseSets";
import { db } from "@/lib/drizzleClient"
import { eq } from "drizzle-orm"

const getAllExerciseSets = async () => {
  return await db.select().from(exerciseSets)
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

const updateReps = async (templateItemId: number, reps: number) => {
  return await db.update(exerciseSets).set({
    reps
  }).where(eq(exerciseSets.template_item_id, templateItemId))
}

const updateWeight = async (templateItemId: number, weight: number) => {
  return await db.update(exerciseSets).set({
    weight
  }).where(eq(exerciseSets.template_item_id, templateItemId))
}

const deleteExerciseSetByExerciseId = async (exerciseSetId: number) => {
  return await db.delete(exerciseSets).where(eq(exerciseSets.exercise_set_id, exerciseSetId))
}

export default {
  getAllExerciseSets,
  getAllExerciseSetsByTemplateId,
  addExerciseSet,
  updateReps,
  updateWeight,
  deleteExerciseSetByExerciseId
}