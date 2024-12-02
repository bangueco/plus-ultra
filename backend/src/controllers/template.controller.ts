import { NextFunction, Request, Response } from "express";
import templateService from "../services/template.service";
import { ApiError } from "../utils/error";
import { HttpStatusCode } from "../utils/http";
import { Difficulty } from "@prisma/client";

type TemplateItemProps = {
  exercise_id: number
  item_name: string,
  muscleGroup: string
}

type TemplateProps = {
  template_name: string
  custom: number
  difficulty: Difficulty
  creatorId: number
  templateItems: Array<TemplateItemProps>
}

const findTemplateById = async (request: Request, response: Response, next: NextFunction) => {
  const { id } = request.params

  try {
    if (!id) throw new ApiError(HttpStatusCode.BAD_REQUEST, "Template id is not specified!")

    const template = await templateService.findTemplateById(Number(id))

    if (!template) throw new ApiError(HttpStatusCode.NOT_FOUND, "Template not found!")

      return response.status(HttpStatusCode.OK).json(template)
  } catch (error) {
    return next(error)
  }
}

const findTemplatesByCreator = async (request: Request, response: Response, next: NextFunction) => {
  const { id } = request.params

  try {
    if (!id) throw new ApiError(HttpStatusCode.BAD_REQUEST, "Creator id is not specified!")

    const templateCreator = await templateService.findTemplatesByCreatorId(Number(id))

    if (!templateCreator) throw new ApiError(HttpStatusCode.NOT_FOUND, "Creator not found!")

    return response.status(HttpStatusCode.OK).json(templateCreator)
  } catch (error) {
    return next(error)
  }
}

const findTemplateItemByTemplateId = async (request: Request, response: Response, next: NextFunction) => {
  const { id } = request.params

  try {
    if (!id) throw new ApiError(HttpStatusCode.BAD_REQUEST, "Template id is not specified!")

    const templateItems = await templateService.findTemplateItemsByTemplateId(Number(id))

    if (!templateItems) throw new ApiError(HttpStatusCode.NOT_FOUND, "Creator not found!")

      return response.status(HttpStatusCode.OK).json(templateItems)
  } catch (error) {
    return next(error)
  }
}

const createTemplate = async (request: Request, response: Response, next: NextFunction) => {

  const { template_name, custom, difficulty, creatorId, templateItems } = request.body as TemplateProps

  try {
    if (!template_name || !custom || !difficulty || !creatorId || !templateItems) throw new ApiError(HttpStatusCode.BAD_REQUEST, "Some fields are required!")

    if (!Array.isArray(templateItems)) throw new ApiError(HttpStatusCode.BAD_REQUEST, "templateItems field must be an array!")

    const newTemplate = await templateService.createTemplate(template_name, custom, difficulty, creatorId)
    templateItems.map(async (item) => {
      await templateService.createTemplateItem(item.item_name, item.muscleGroup, newTemplate.template_id, item.exercise_id)
    })

    return response.status(HttpStatusCode.OK).json({message: "Workout template created successfully!"})
  } catch (error) {
    return next(error)
  }
}

export default {
  findTemplateById, findTemplatesByCreator, findTemplateItemByTemplateId, createTemplate
}