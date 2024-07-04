import { Request, Response } from "express"
import userService from "../services/user.service"

const register = async (request: Request, response: Response) => {
  const {username, email, password} = request.body
  const user = await userService.registerUser(username, email, password)
  response.status(201).json(user)
}

// Export as an object

const userController = {
  register
}

export default userController