import { PrismaClient, User } from "@prisma/client"
import bcrypt from 'bcrypt'

const prisma = new PrismaClient()

const registerUser = async (username: string, email: string, password: string): Promise<User | Error> => {
  try {
    const newUser = await prisma.user.create({
      data: {
        username: username,
        email: email,
        password: bcrypt.hashSync(password, 10)
      }
    })
    return newUser
  } catch (error) {
    return error as Error
  }
}

// Export as an object

const userService = {
  registerUser
}

export default userService