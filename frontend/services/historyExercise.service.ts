import { historyExercise } from "@/db/schema/history";
import { db } from "@/lib/drizzleClient";

const createHistoryExercise = async (historyId: number, exerciseId: number, sets: number, reps: number, weight: number) => {
  return await db.insert(historyExercise).values({
    history_id: historyId,
    exercise_id: exerciseId,
    sets,
    reps,
    weight
  })
}

export default {
  createHistoryExercise
}