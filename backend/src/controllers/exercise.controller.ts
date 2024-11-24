import { NextFunction, Request, Response } from "express";
import { Exercise } from "@prisma/client";
import exerciseService from "../services/exercise.service";
import { ApiError } from "../utils/error";
import { HttpStatusCode } from "../utils/http";

const getExercisesByUser = async (request: Request, response: Response, next: NextFunction) => {

  const id = request.params.id

  const userId = Number(id);

  try {
    const exercisesByUser = await exerciseService.findByUser(userId)

    if (!exercisesByUser) throw new ApiError(HttpStatusCode.BAD_REQUEST, "Unknown username")

    return response.status(HttpStatusCode.OK).json(exercisesByUser)
  } catch (error) {
    return next(error)
  }
}

const createUserExercise = async (request: Request, response: Response, next: NextFunction) => {
  const { exercise_id, name, muscle_group, equipment, custom, created_by } = request.body as Exercise

  try {
    if (!exercise_id || !name || !muscle_group || !equipment || !custom || !created_by) throw new ApiError(HttpStatusCode.BAD_REQUEST, "Some fields are required.")

    const newExercise = await exerciseService.createUserExercise(exercise_id, name, muscle_group, equipment, custom, created_by)
    return response.status(HttpStatusCode.OK).json(newExercise)
  } catch (error) {
    return next(error)
  }
}

const createExercise = async (request: Request, response: Response, next: NextFunction) => {
  const { name, muscle_group, equipment, custom, created_by, instructions, difficulty } = request.body as Exercise

  try {

    if (!name || !muscle_group || !equipment || !custom || !created_by || !instructions || !difficulty) {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, "Some fields are required.")
    }

    const newExercise = await exerciseService.createExercise(name, muscle_group, equipment, custom, created_by, difficulty, instructions)
    return response.status(HttpStatusCode.OK).json(newExercise)
  } catch (error) {
    return next(error)
  }
}

const updateUserExercise = async (request: Request, response: Response, next: NextFunction) => {
  const { name, muscle_group, equipment, created_by, exercise_id } = request.body as Exercise

  try {
    if ( !exercise_id || !name || !muscle_group || !equipment || !created_by) throw new ApiError(HttpStatusCode.BAD_REQUEST, "Some fields are required.")

    const updateExercise = await exerciseService.updateUserExercise(exercise_id, name, muscle_group, equipment, created_by)
    return response.status(HttpStatusCode.OK).json(updateExercise)
  } catch (error) {
    return next(error)
  }
}

const deleteUserExercise = async (request: Request, response: Response, next: NextFunction) => {
  const { exercise_id } = request.body as Exercise

  try {
    if ( !exercise_id ) throw new ApiError(HttpStatusCode.BAD_REQUEST, "Some fields are required.")

    const updateExercise = await exerciseService.deleteUserExercise(exercise_id)
    return response.status(HttpStatusCode.OK).json(updateExercise)
  } catch (error) {
    return next(error)
  }
}

export default {
  getExercisesByUser, createUserExercise, createExercise, updateUserExercise, deleteUserExercise
}