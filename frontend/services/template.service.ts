import { NewTemplateItem } from "@/types/templates";
import { template, } from "@/db/schema/template";
import { db } from "@/lib/drizzleClient";
import { templateItem } from "@/db/schema/templateItems";
import { eq } from "drizzle-orm";

const getAllTemplate = async () => {
  return await db.select().from(template)
}

const createTemplate = async (templateInfo: NewTemplateItem) => {
  await db.transaction(async (tx) => {
    const newTemplate = await tx.insert(template).values({
      template_name: templateInfo.template_name,
      custom: 1
    })
    templateInfo.exercises.map(async exercise => {
      await tx.insert(templateItem).values({
        template_item_name: templateInfo.template_name,
        muscle_group: exercise.muscleGroup,
        template_id: newTemplate.lastInsertRowId,
        exercise_id: exercise.exercise_id
      })
    })
  })
}

const updateTemplate = async (templateId: number, templateName: string) => {
  return await db.update(template).set({
    template_name: templateName
  }).where(eq(template.template_id, templateId))
}

const deleteTemplate = async (templateId: number) => {
  return await db.delete(template).where(eq(template.template_id, templateId))
}

export default {
  getAllTemplate,
  createTemplate,
  updateTemplate,
  deleteTemplate
}