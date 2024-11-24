import { historyExercise } from "@/db/schema/history";
import { db } from "@/lib/drizzleClient";

const getAllExerciseHistory = async () => {
  return await db.select().from(historyExercise)
}

const createHistoryExercise = async (historyId: number, templateItemId: number, templateId: number, reps: number, weight: number, exerciseName: string) => {
  return await db.insert(historyExercise).values({
    history_id: historyId,
    template_item_id: templateItemId,
    exercise_name: exerciseName,
    template_id: templateId,
    reps,
    weight
  })
}

export default {
  getAllExerciseHistory, createHistoryExercise
}