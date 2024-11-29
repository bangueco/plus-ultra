import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/error";
import userService from "../services/user.service";
import { HttpStatusCode } from "../utils/http";

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

export default {
  isEmailVerified, verifyEmail
}