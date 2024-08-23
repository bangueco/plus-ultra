import { exercisesDatabase } from "@/database";

interface Exercises {
  id: number
  name: string
}

const getExercisesFromEquipment = async(equipment_name: string) => {
  const exercisesOfEquipment = await exercisesDatabase.db.getAllAsync<Exercises>(`SELECT id, name FROM exercise WHERE equipment="${equipment_name}";`)

  const exercises = exercisesOfEquipment.map(exercise => {
    return {
      id: exercise.id, 
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