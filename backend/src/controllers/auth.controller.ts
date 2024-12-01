import { NextFunction, Request, Response } from "express"
import userService from "../services/user.service"
import { HttpStatusCode } from "../utils/http"
import { ValidationError } from "../utils/error"
import { hashPassword, verifyPassword } from "../utils/lib/hashing"
import { generateAccessToken, generateEmailToken, generateRefreshToken } from "../utils/lib/token"
import emailService from "../services/email.service"
import { User } from "@prisma/client"

const register = async (request: Request, response: Response, next: NextFunction) => {
  try {
    const {username, email, password, birthdate, role} = request.body as User

    const isUsernameExist = await userService.findByUsername(username)
    const isEmailExist = await userService.findByEmail(email)

    const birthDate = new Date(birthdate)

    const today = new Date()
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (isUsernameExist) throw new ValidationError(HttpStatusCode.BAD_REQUEST, 'username', 'Username is already taken.')
    if (isEmailExist) throw new ValidationError(HttpStatusCode.BAD_REQUEST, 'email', 'Email is already taken.')
    
    if (monthDifference < 0 || (monthDifference === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 15) {
      throw new ValidationError(HttpStatusCode.BAD_REQUEST, 'birthdate', 'You must be over 15 years old.')
    }

    const hashedPassword = await hashPassword(password)
    const emailToken = generateEmailToken(email)

    emailService.sendVerificationEmail(email, emailToken, username)

    const user = await userService.createUser(username, email, hashedPassword, birthDate, false, emailToken, role)
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
      birthdate: isUsernameExist.birthdate,
      isEmailValid: isUsernameExist.isEmailValid,
      role: isUsernameExist.role,
      trainerId: isUsernameExist.trainerId
    })
  } catch (error) {
    return next(error)
  }
}

export default {
  register,
  login
}