import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/error";
import userService from "../services/user.service";
import { HttpStatusCode } from "../utils/http";
import { Role } from "@prisma/client";

const isEmailVerified = async (request: Request, response: Response, next: NextFunction) => {

  const username = request.query.username

  try {
    if (!username) throw new ApiError(HttpStatusCode.BAD_REQUEST, "Username is not specified!")

    const user = await userService.findByUsername(String(username))

    if (!user) throw new ApiError(HttpStatusCode.NOT_FOUND, "User not found.")

    if (user.isEmailValid) return response.status(HttpStatusCode.OK).json({verified: true})
    if (!user.isEmailValid) return response.status(HttpStatusCode.OK).json({verified: false})
  } catch (error) {
    return next(error)
  }
}

const verifyEmail = async (request: Request, response: Response, next: NextFunction) => {

  const emailToken = request.query.emailToken
  const username = request.query.username

  try {
    if (!username) throw new ApiError(HttpStatusCode.BAD_REQUEST, "Invalid username!")
    if (!emailToken) throw new ApiError(HttpStatusCode.BAD_REQUEST, "Invalid email token verification!")

    const user = await userService.findByUsername(String(username))

    if (!user) throw new ApiError(HttpStatusCode.BAD_REQUEST, "Username not found!")

    if (user.emailToken === String(emailToken)) {
      await userService.updateUser(user.id, {isEmailValid: true})
      return response.status(HttpStatusCode.OK).json({message: "Email is now verified!"})
    } else {
      return response.status(HttpStatusCode.BAD_REQUEST).json({message: "Cannot verify email."})
    }

  } catch (error) {
    return next(error)
  }
}

const getTrainers = async (_request: Request, response: Response, next: NextFunction) => {
  try {
    const trainers = await userService.findAllTrainer()
    return response.status(HttpStatusCode.OK).json(trainers)
  } catch (error) {
    return next(error)
  }
}

const findUser = async (request: Request, response: Response, next: NextFunction) => {

  const userId = request.query.userId

  try {
    if (!userId) throw new ApiError(HttpStatusCode.BAD_REQUEST, "User id is not specified!")
    
    const user = await userService.findById(Number(userId))

    if (!user) throw new ApiError(HttpStatusCode.BAD_REQUEST, "User not found!")

    return response.status(HttpStatusCode.OK).json(user)
  } catch (error) {
    return next(error)
  }
}

const joinTrainer = async (request: Request, response: Response, next: NextFunction) => {

  const { userId, trainerId } = request.body

  try {

    if (!userId) throw new ApiError(HttpStatusCode.BAD_REQUEST, "User id is not specified!")
    if (!trainerId) throw new ApiError(HttpStatusCode.BAD_REQUEST, "Trainer id is not specified!")

    const trainer = await userService.findById(trainerId)
    const user = await userService.findById(userId)

    if (!trainer) throw new ApiError(HttpStatusCode.BAD_REQUEST, "Trainer not found!")
    if (!user) throw new ApiError(HttpStatusCode.BAD_REQUEST, "User not found!")

    if (user.trainerId) throw new ApiError(HttpStatusCode.BAD_REQUEST, "You already have a trainer!")
    if (trainer.role === Role.USER) throw new ApiError(HttpStatusCode.BAD_REQUEST, "Trainer id does not have a trainer role!")

    const assignTrainerToUser = await userService.setTrainerId(userId, trainerId)

    return response.status(HttpStatusCode.OK).json({id: assignTrainerToUser.id, username: assignTrainerToUser.username, role: assignTrainerToUser.role, trainerId: assignTrainerToUser.trainerId})
  } catch (error) {
    return next(error)
  }
}

const leaveTrainer = async (request: Request, response: Response, next: NextFunction) => {

  const { userId } = request.body

  try {

    if (!userId) throw new ApiError(HttpStatusCode.BAD_REQUEST, "User id is not specified!")

    const user = await userService.findById(userId)

    if (!user) throw new ApiError(HttpStatusCode.BAD_REQUEST, "User not found!")

    if (!user.trainerId) throw new ApiError(HttpStatusCode.BAD_REQUEST, "You are not assigned to any trainer!")

    const removeTrainerToUser = await userService.setTrainerId(userId, null)

    return response.status(HttpStatusCode.OK).json({id: removeTrainerToUser.id, username: removeTrainerToUser.username, role: removeTrainerToUser.role, trainerId: removeTrainerToUser.trainerId})
  } catch (error) {
    return next(error)
  }

}

export default {
  isEmailVerified, verifyEmail, getTrainers, findUser, joinTrainer, leaveTrainer
}