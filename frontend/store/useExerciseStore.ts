import exerciseService from '@/services/exercise.service'
import { ExerciseInfo } from '@/types/exercise'
import { SQLiteRunResult } from 'expo-sqlite'
import { create } from 'zustand'

type State = {
  exercise: Array<ExerciseInfo>
}

type Action = {
  fetchExercise: () => Promise<void>,
  addExercise: (exerciseName: string, muscleGroup: string, equipmentName: string, createdBy: string) => Promise<SQLiteRunResult>,
}

export const useExerciseStore = create<State & Action>((set) => ({
  exercise: [],
  fetchExercise: async () => {
    try {
      const exercises = await exerciseService.getAllExercise()
      set({exercise: exercises})
    } catch (error) {
      console.error(error)
    }
  },
  addExercise: async (exerciseName, muscleGroup, equipmentName, createdBy) => {
    const newExercise = await exerciseService.createExercise(exerciseName, muscleGroup, equipmentName, createdBy)

    set((state) => ({
      exercise: [...state.exercise, {
        exercise_id: newExercise.lastInsertRowId,
        name: exerciseName,
        muscle_group: muscleGroup,
        equipment: equipmentName,
        custom: 1,
        created_by: createdBy
      }]
    }))

    return newExercise
  },
}))