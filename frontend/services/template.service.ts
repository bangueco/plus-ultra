import { template, } from "@/db/schema/template";
import { db } from "@/lib/drizzleClient";
import { TemplateItemProps } from "@/types/templates";
import { eq } from "drizzle-orm";
import axios from "axios";
const baseURL = process.env.EXPO_PUBLIC_API_URL

const getAllTemplate = async () => {
  return await db.select().from(template)
}

const getTemplateById = async (templateId: number) => {
  return await db.select().from(template).where(eq(template.template_id, templateId))
}

const findTemplateByCreator = async (creator: number) => {
  return await db.select().from(template).where(eq(template.created_by, creator))
}

const createTemplate = async (templateName: string, custom: boolean, creator: number) => {
  return await db.insert(template).values({
    template_name: templateName,
    custom: custom ? 1 : 0,
    created_by: creator
  })
}

const findTrainerTemplateById = async (id: number) => {
  const request = await axios.get(`${baseURL}/template/${id}`)
  return request
}

const findTrainerTemplateItemById = async (id: number) => {
  const request = await axios.get(`${baseURL}/template/item/${id}`)
  return request
}

const findTemplatesByCreator = async (creatorId: number) => {
  const request = await axios.get(`${baseURL}/template/creator/${creatorId}`)
  return request
}

const createTrainerTemplate = async (templateName: string, custom: number, difficulty: string, creatorId: number, templateItems: Array<TemplateItemProps>) => {
  const request = await axios.post(`${baseURL}/template/create`, {template_name: templateName, custom, difficulty, creatorId, templateItems})
  return request
}

const updateTemplate = async (templateId: number, templateName: string) => {
  return await db.update(template).set({
    template_name: templateName
  }).where(eq(template.template_id, templateId))
}

const updateTrainerTemplate = async (templateId: number, templateName: string, custom: number, difficulty: string, creatorId: number) => {
  const request = await axios.patch(`${baseURL}/template/update`, {templateId, template_name: templateName, custom, difficulty, creatorId})
  return request
}

const createTrainerItem = async (templateId: number, templateItems: Array<TemplateItemProps>) => {
  const request = await axios.post(`${baseURL}/template/create/item`, {templateId, templateItems})
  return request
}

const deleteTemplate = async (templateId: number) => {
  return await db.delete(template).where(eq(template.template_id, templateId))
}

const deleteTrainerTemplate = async (templateId: number) => {
  const request = await axios.delete(`${baseURL}/template/${templateId}`)
  return request
}

const deleteTrainerItemTemplate = async (templateId: number) => {
  const request = await axios.delete(`${baseURL}/template/item/delete/${templateId}`)
  return request
}

const deleteAllTemplate = async () => {
  return await db.delete(template)
}

export default {
  getAllTemplate,
  getTemplateById,
  createTemplate,
  findTemplatesByCreator,
  createTrainerTemplate,
  updateTemplate,
  deleteTemplate,
  deleteTrainerTemplate,
  deleteAllTemplate,
  findTrainerTemplateById,
  findTrainerTemplateItemById,
  updateTrainerTemplate,
  deleteTrainerItemTemplate,
  createTrainerItem,
  findTemplateByCreator
}