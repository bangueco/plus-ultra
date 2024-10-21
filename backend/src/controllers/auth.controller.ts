import { NextFunction, Request, Response } from "express"
import userService from "../services/user.service"
import { HttpStatusCode } from "../utils/http"
import { ValidationError } from "../utils/error"
import { hashPassword, verifyPassword } from "../utils/lib/hashing"
import { generateAccessToken, generateRefreshToken } from "../utils/lib/token"

const register = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const {username, email, password, age} = request.body

    const isUsernameExist = await userService.findByUsername(username)
    const isEmailExist = await userService.findByEmail(email)

    if (isUsernameExist) throw new ValidationError(HttpStatusCode.BAD_REQUEST, 'username', 'Username is already taken.')
    if (isEmailExist) throw new ValidationError(HttpStatusCode.BAD_REQUEST, 'email', 'Email is already taken.')
    if (typeof age !== 'number') throw new ValidationError(HttpStatusCode.BAD_REQUEST, "age", "Age is not a valid number")
    
    const hashedPassword = await hashPassword(password)

    const user = await userService.createUser(username, email, hashedPassword, age)
    return response.status(HttpStatusCode.CREATED).json(user)
  } catch (error) {
    return next(error)
  }
}

const login = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const {username, password} = request.body

    const isUsernameExist = await userService.findByUsername(username)

    if (!isUsernameExist) throw new ValidationError(HttpStatusCode.BAD_REQUEST, 'username', 'Username does not exist.')
    
    const isPasswordMatch = await verifyPassword(password, isUsernameExist.password)

    if (!isPasswordMatch) throw new ValidationError(HttpStatusCode.BAD_REQUEST, 'password', 'Wrong password.')

    const accessToken = generateAccessToken(isUsernameExist.id, username)
    const refreshToken = generateRefreshToken(isUsernameExist.id, username)

    return response.status(HttpStatusCode.OK).json({
      id: isUsernameExist.id,
      email: isUsernameExist.email,
      username: isUsernameExist.username,
      accessToken,
      refreshToken,
      age: isUsernameExist.age
    })
  } catch (error) {
    return next(error)
  }
}

export default {
  register,
  login
}