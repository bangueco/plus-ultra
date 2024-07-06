import { NextFunction, Request, Response } from "express"
import userService from "../services/user.service"

const register = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const {username, email, password} = request.body
    const user = await userService.registerUser(username, email, password)
    return response.status(201).json(user)
  } catch (error) {
    return next(error)
  }
}

// Export as an object

const userController = {
  register
}

export default userController