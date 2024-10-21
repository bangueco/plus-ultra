import prisma from '../utils/lib/prismaClient'

const findById = async (id: number) => {
  return await prisma.user.findUnique({where: {id}})
}

const findByUsername = async (username: string) => {
  return await prisma.user.findUnique({where: {username}})
}

const findByEmail = async (email: string) => {
  return await prisma.user.findUnique({where: {email}})
}

const createUser = async (username: string, email: string, password: string, age: number) => {
  return await prisma.user.create({data: {username, email, password, age}})
}

export default {
  findById,
  findByUsername,
  findByEmail,
  createUser
}