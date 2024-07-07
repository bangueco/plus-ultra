import { PrismaClient } from "@prisma/client"
import bcrypt from 'bcrypt'

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

// Export as an object

const userService = {
  registerUser
}

export default userService