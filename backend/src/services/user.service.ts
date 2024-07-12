import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import config from "../utils/config"

const prisma = new PrismaClient()

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
  if (!credentials) throw new Error('Username does not exists.')

  const match = await bcrypt.compare(password, credentials.password)

  if (!match) throw new Error('Invalid password.')

  return jwt.sign({data: credentials.id}, config.secretKey, {expiresIn: 100})
}

// Export as an object

const userService = {
  registerUser,
  loginUser
}

export default userService