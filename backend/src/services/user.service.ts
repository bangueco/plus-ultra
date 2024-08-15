import prisma from '../utils/prismaClient'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from "../utils/config"
import { ApiError } from '../utils/error'
import { HttpStatusCode } from '../utils/http'

const registerUser = async (username: string, email: string, password: string) => {
  const newUser = await prisma.user.create({
    data: {
      username: username,
      email: email,
      password: bcrypt.hashSync(password, 10)
    }
  })
  return newUser
}

const loginUser = async (username: string, password: string) => {
  const credentials = await prisma.user.findFirst({where: {username}})
  
  // Verify if username exists.
  if (!credentials) throw new ApiError(HttpStatusCode.NOT_FOUND, 'Username does not exists.')

  const match = await bcrypt.compare(password, credentials.password)

  if (!match) throw new ApiError(HttpStatusCode.NOT_FOUND, 'Invalid password.')

  return jwt.sign({data: credentials.id}, config.secretKey)
}

export default {
  registerUser,
  loginUser
}