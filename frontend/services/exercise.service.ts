import { exercise } from "@/db/schema/exercise"
import { db } from "@/lib/drizzleClient"
import { eq } from "drizzle-orm"

const getAllExercise = async () => {
  return await db.select().from(exercise)
}

const getExerciseById = async (id: number) => {
  return await db.select().from(exercise).where(eq(exercise.exercise_id, id))
}

const getExerciseByMuscleGroup = async (muscleGroup: string) => {
  return await db.select().from(exercise).where(eq(exercise.exercise_muscle_group, muscleGroup))
}

const createExercise = async (exerciseName: string, exerciseMuscleGroup: string, exerciseEquipment: string) => {
  return await db.insert(exercise).values({
    exercise_name: exerciseName,
    exercise_muscle_group: exerciseMuscleGroup,
    exercise_equipment: exerciseEquipment
  })
}

const editExercise = async (exerciseId: number, exerciseName: string, exerciseMuscleGroup: string, exerciseEquipment: string) => {
  return await db.update(exercise).set({
    exercise_name: exerciseName,
    exercise_muscle_group: exerciseMuscleGroup,
    exercise_equipment: exerciseEquipment
  }).where(eq(exercise.exercise_id, exerciseId))
}

const deleteExercise =  async (exerciseId: number) => {
  return await db.delete(exercise).where(eq(exercise.exercise_id, exerciseId))
}

export default {
  getAllExercise,
  getExerciseById,
  getExerciseByMuscleGroup,
  createExercise,
  editExercise,
  deleteExercise
}