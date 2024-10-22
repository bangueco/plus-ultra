import { ExerciseInfo } from "@/types/exercise";
import exerciseService from "./exercise.service";
import { EquipmentExercises } from "@/types/equipment";

const getExercisesFromEquipment = async (equipment_name: string): Promise<EquipmentExercises> => {
  const exercisesOfEquipment: Array<ExerciseInfo> = await exerciseService.getAllExerciseByEquipment(equipment_name)

  const exercises: Array<ExerciseInfo> = exercisesOfEquipment.map(exercise => {
    return {
      exercise_id: exercise.exercise_id,
      name: exercise.name,
      instructions: exercise.instructions,
      difficulty: exercise.difficulty,
      custom: exercise.custom,
      equipment: exercise.equipment,
      created_by: exercise.created_by,
      muscle_group: exercise.muscle_group
    }
  })

  return {
    equipment_name: equipment_name,
    exercises: exercises
  }
}

export {
  getExercisesFromEquipment
}