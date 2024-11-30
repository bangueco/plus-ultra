import { Role } from '@prisma/client'
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

const createUser = async (username: string, email: string, password: string, birthdate: Date, isEmailValid: boolean, emailToken: string, role: Role) => {
  return await prisma.user.create({data: {username, email, password, birthdate, isEmailValid, emailToken, role}})
}

const updateUser = async (id: number, data: Record<string, any>) => {
  return await prisma.user.update({
    where: {id},
    data
  })
}

export default {
  findById,
  findByUsername,
  findByEmail,
  createUser,
  updateUser
}