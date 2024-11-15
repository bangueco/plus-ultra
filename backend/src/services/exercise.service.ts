import prisma from "../utils/lib/prismaClient";

const findByUser = async (id: number) => {
  return await prisma.exercise.findMany({where: {created_by: id}})
}

const createUserExercise = async ( exerciseId: number, exerciseName: string, exerciseMuscleGroup: string, exerciseEquipment: string, custom: number, createdBy: number) => {
  return await prisma.exercise.create({
    data: {
      exercise_id: exerciseId,
      name: exerciseName,
      muscle_group: exerciseMuscleGroup,
      custom,
      equipment: exerciseEquipment,
      created_by: createdBy
    }
  })
}

const createExercise = async (exerciseName: string, exerciseMuscleGroup: string, exerciseEquipment: string, custom: number, createdBy: number, difficulty: string | null, instructions: string | null) => {
  return await prisma.exercise.create({
    data: {
      name: exerciseName,
      muscle_group: exerciseMuscleGroup,
      custom,
      instructions,
      difficulty,
      equipment: exerciseEquipment,
      created_by: createdBy
    }
  })
}

const updateUserExercise = async (id: number, exerciseName: string, exerciseMuscleGroup: string, exerciseEquipment: string, createdBy: number) => {
  const record = await prisma.exercise.findFirst({
    where: { exercise_id: id }
  })
  if (record) {
    return await prisma.exercise.update({
      where: { id: record.id },
      data: {
        name: exerciseName,
        muscle_group: exerciseMuscleGroup,
        custom: 1,
        equipment: exerciseEquipment,
        created_by: createdBy
      },
    })
  } else {
    return
  }
}

const deleteUserExercise = async (id: number) => {
  const record = await prisma.exercise.findFirst({
    where: { exercise_id: id }
  })
  if (record) {
    return await prisma.exercise.delete({
      where: { id: record.id }
    })
  } else {
    return
  }
}

export default {
  findByUser, createUserExercise, createExercise, updateUserExercise, deleteUserExercise
}