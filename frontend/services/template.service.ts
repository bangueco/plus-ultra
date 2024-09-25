import { template, } from "@/db/schema/template";
import { db } from "@/lib/drizzleClient";
import { eq } from "drizzle-orm";

const getAllTemplate = async () => {
  return await db.select().from(template)
}

const getTemplateById = async (templateId: number) => {
  return await db.select().from(template).where(eq(template.template_id, templateId))
}

const createTemplate = async (templateName: string) => {
  return await db.insert(template).values({
    template_name: templateName,
    custom: 1
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

const deleteAllTemplate = async () => {
  return await db.delete(template)
}

export default {
  getAllTemplate,
  getTemplateById,
  createTemplate,
  updateTemplate,
  deleteTemplate,
  deleteAllTemplate
}