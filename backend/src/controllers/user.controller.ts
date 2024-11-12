import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/error";
import userService from "../services/user.service";

const isEmailVerified = async (request: Request, response: Response, next: NextFunction) => {

  const { id } = request.body as User

  try {
    if (!id) throw new ApiError(400, "User id is not specified!")

    const user = await userService.findById(id)

    if (!user) throw new ApiError(404, "User not found.")

    if (user.isEmailValid) {
      return response.status(200).json({message: "The user's email is verified!"})
    } else {
      return response.status(400).json({message: "The user's email is not verified!"})
    }
  } catch (error) {
    return next(error)
  }
}

export default {
  isEmailVerified
}