import { User } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import { ApiError } from "../utils/error";
import userService from "../services/user.service";
import { HttpStatusCode } from "../utils/http";

const isEmailVerified = async (request: Request, response: Response, next: NextFunction) => {

  const { id } = request.body as User

  try {
    if (!id) throw new ApiError(HttpStatusCode.BAD_REQUEST, "User id is not specified!")

    const user = await userService.findById(id)

    if (!user) throw new ApiError(HttpStatusCode.NOT_FOUND, "User not found.")

    if (user.isEmailValid) return response.status(HttpStatusCode.OK).json({verified: true})
    if (!user.isEmailValid) return response.status(HttpStatusCode.OK).json({verified: false})
  } catch (error) {
    return next(error)
  }
}

export default {
  isEmailVerified
}