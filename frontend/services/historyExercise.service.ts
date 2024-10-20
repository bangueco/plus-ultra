import { historyExercise } from "@/db/schema/history";
import { db } from "@/lib/drizzleClient";

const createHistoryExercise = async (historyId: number, templateItemId: number, templateId: number, reps: number, weight: number) => {
  return await db.insert(historyExercise).values({
    history_id: historyId,
    template_item_id: templateItemId,
    template_id: templateId,
    reps,
    weight
  })
}

export default {
  createHistoryExercise
}