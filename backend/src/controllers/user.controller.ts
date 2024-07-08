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

const login = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const {username, password} = request.body
    const user = await userService.loginUser(username, password)
    return response.status(200).json({token: user})
  } catch (error) {
    return next(error)
  }
}

// Export as an object

const userController = {
  register,
  login
}

export default userController