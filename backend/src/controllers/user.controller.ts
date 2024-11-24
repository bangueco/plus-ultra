import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/error";
import userService from "../services/user.service";
import { HttpStatusCode } from "../utils/http";
import personalRecordService from "../services/personalRecord.service";
import { PersonalRecord } from "@prisma/client";

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

const getPersonalRecord = async (request: Request, response: Response, next: NextFunction) => {
  const userId = request.query.userId

  try {
    if (!userId) throw new ApiError(HttpStatusCode.BAD_REQUEST, "Invalid user id!")

    const user = await userService.findById(Number(userId))

    if (!user) throw new ApiError(HttpStatusCode.BAD_REQUEST, "User not found!")

    const userPersonalRecords = await personalRecordService.findByUserId(user.id)

    return response.status(HttpStatusCode.OK).json(userPersonalRecords)
  } catch (error) {
    return next(error)
  }
}

const newPersonalRecord = async (request: Request, response: Response, next: NextFunction) => {

  const { exercise_name, set, reps, weight, userId } = request.body as PersonalRecord

  try {
    if (!exercise_name || !set || !reps || !weight || !userId) {
      throw new ApiError(HttpStatusCode.BAD_REQUEST, "Some fields are required.")
    }

    const newRecord = personalRecordService.createNewRecord(userId, exercise_name, reps, set, weight)

    return response.status(HttpStatusCode.OK).json(newRecord)

  } catch (error) {
    return next(error)
  }

}

export default {
  isEmailVerified, verifyEmail, getPersonalRecord, newPersonalRecord
}