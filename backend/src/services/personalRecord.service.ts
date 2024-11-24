import prisma from "../utils/lib/prismaClient";

const findByUserId = async (id: number) => {
  return await prisma.personalRecord.findMany({where: {userId: id}})
}

const createNewRecord = async (userId: number, exerciseName: string, reps: number, set: number, weight: number) => {
  return await prisma.personalRecord.create({data: {
    userId,
    exercise_name: exerciseName,
    reps,
    set,
    weight
  }})
}

export default {
  findByUserId, createNewRecord
}