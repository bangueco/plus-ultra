import exerciseService from "./exercise.service";

interface Exercises {
  id: number
  name: string
}

const getExercisesFromEquipment = async(equipment_name: string) => {
  const exercisesOfEquipment = await exerciseService.getAllExerciseByEquipment(equipment_name)

  const exercises = exercisesOfEquipment.map(exercise => {
    return {
      id: exercise.exercise_id,
      title: exercise.name
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