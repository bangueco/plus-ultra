import { Difficulty } from "@prisma/client";
import prisma from "../utils/lib/prismaClient";

const findTemplateById = async (id: number) => {
  return await prisma.template.findUnique({where: {template_id: id}})
}

const findTemplatesByCreatorId = async (creatorId: number) => {
  return await prisma.template.findMany({where: {creatorId}})
}

const findTemplateItemsByTemplateId = async (templateId: number) => {
  return await prisma.templateItem.findMany({where: {template_id: templateId}})
}

const createTemplate = async (templateName: string, custom: number, difficulty: Difficulty, creatorId: number) => {
  return await prisma.template.create({data: {
    template_name: templateName,
    custom,
    difficulty,
    creatorId
  }})
}

const createTemplateItem = async (templateItemName: string, muscleGroup: string, templateId: number, exerciseId: number) => {
  return await prisma.templateItem.create({
    data: {
      template_item_name: templateItemName,
      muscle_group: muscleGroup,
      template_id: templateId,
      exercise_id: exerciseId
    }
  })
}

const deleteTemplate = async (id: number) => {
  await prisma.templateItem.deleteMany({where: {template_id: id}})
  return await prisma.template.delete({where: {template_id: id}})
}

const deleteTemplateItem = async (id: number) => {
  return await prisma.templateItem.delete({where: {template_item_id: id}})
}

export default {
  findTemplateById, findTemplatesByCreatorId, findTemplateItemsByTemplateId, createTemplate, createTemplateItem, deleteTemplate, deleteTemplateItem
}