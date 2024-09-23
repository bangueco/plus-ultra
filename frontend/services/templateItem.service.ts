import { templateItem } from "@/db/schema/templateItems";
import { db } from "@/lib/drizzleClient";
import { eq } from "drizzle-orm";

type ExercisesItem = {
  exercise_id: number,
  item_name: string,
  muscleGroup: string
}

const getAllTemplateItemsById = async (templateId: number) => {
  return await db.select().from(templateItem).where(eq(templateItem.template_id, templateId))
}

const createTemplateItem = async (templateId: number, ...exercisesItem: Array<ExercisesItem>) => {
  return exercisesItem.map(async (exerciseItem) => {
    await db.insert(templateItem).values({
      template_item_name: exerciseItem.item_name,
      muscle_group: exerciseItem.muscleGroup,
      template_id: templateId,
      exercise_id: exerciseItem.exercise_id,
    })
  })
}

const deleteTemplateItem = async (templateItemId: number) => {
  return db.delete(templateItem).where(eq(templateItem.template_item_id, templateItemId))
}

const deleteItemsForTemplate = async (templateId: number) => {
  return db.delete(templateItem).where(eq(templateItem.template_id, templateId))
}

export default {
  getAllTemplateItemsById,
  createTemplateItem,
  deleteTemplateItem,
  deleteItemsForTemplate
}