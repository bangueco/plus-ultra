import { history } from "@/db/schema/history";
import { db } from "@/lib/drizzleClient";

const getAllHistory = async () => {
  return await db.select().from(history)
}

const deleteAllHistory = async () => {
  return await db.delete(history)
}

const createHistory = async (templateName: string, elapsedTime: string, caloriesBurned: number, date: string) => {
  return await db.insert(history).values({
    template_name: templateName,
    elapsed_time: elapsedTime,
    calories_burned: caloriesBurned,
    date
  })
}

export default {
  getAllHistory, deleteAllHistory, createHistory
}