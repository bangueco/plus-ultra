import { exercise } from "@/db/schema/exercise"
import { db } from "@/lib/drizzleClient"
import { eq } from "drizzle-orm"

const getAllExercise = async () => {
  return await db.select().from(exercise)
}

const getExerciseById = async (id: number) => {
  return await db.select().from(exercise).where(eq(exercise.exercise_id, id))
}

const getAllExerciseByEquipment = async (equipmentName: string) => {
  return await db.select().from(exercise).where(eq(exercise.equipment, equipmentName))
}

const getExerciseByCreatorId = async (creatorId: number) => {
  return await db.select().from(exercise).where(eq(exercise.created_by, creatorId))
}

const createExercise = async (exerciseName: string, exerciseMuscleGroup: string, exerciseEquipment: string, createdBy: number, youtubeLink: string, description: string, difficulty: string) => {
  return await db.insert(exercise).values({
    name: exerciseName,
    muscle_group: exerciseMuscleGroup,
    equipment: exerciseEquipment,
    custom: 1,
    created_by: createdBy,
    video_id: youtubeLink,
    difficulty: difficulty,
    instructions: description
  })
}

const editExercise = async (exerciseId: number, exerciseName: string, exerciseMuscleGroup: string, exerciseEquipment: string, youtubeLink: string, description: string, difficulty: string) => {
  return await db.update(exercise).set({
    name: exerciseName,
    muscle_group: exerciseMuscleGroup,
    equipment: exerciseEquipment,
    video_id: youtubeLink,
    difficulty: difficulty,
    instructions: description
  }).where(eq(exercise.exercise_id, exerciseId))
}

const deleteExercise =  async (exerciseId: number) => {
  return await db.delete(exercise).where(eq(exercise.exercise_id, exerciseId))
}

const deleteAllExercise = async () => {
  return await db.delete(exercise)
}

export default {
  getAllExercise,
  getExerciseById,
  getAllExerciseByEquipment,
  createExercise,
  editExercise,
  deleteExercise,
  deleteAllExercise,
  getExerciseByCreatorId
}