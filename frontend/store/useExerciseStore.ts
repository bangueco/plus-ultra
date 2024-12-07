import exerciseService from '@/services/exercise.service'
import { ExerciseInfo } from '@/types/exercise'
import { SQLiteRunResult } from 'expo-sqlite'
import { create } from 'zustand'

type State = {
  exercise: Array<ExerciseInfo>
}

type Action = {
  fetchExercise: (userId: number) => Promise<void>,
  addExercise: (exerciseName: string, muscleGroup: string, equipmentName: string, createdBy: number, youtubeLink: string, description: string, difficulty: string) => Promise<SQLiteRunResult>,
  removeExercise: (id: number) => Promise<void>
}

export const useExerciseStore = create<State & Action>((set) => ({
  exercise: [],
  fetchExercise: async (userId: number) => {
    try {
      const defaultExercises = await exerciseService.getExerciseByCreatorId(0)
      const userExercises = await exerciseService.getExerciseByCreatorId(userId)
      set({exercise: [...defaultExercises, ...userExercises]})
    } catch (error) {
      console.error(error)
    }
  },
  addExercise: async (exerciseName, muscleGroup, equipmentName, createdBy, youtubeLink, description, difficulty) => {
    const newExercise = await exerciseService.createExercise(exerciseName, muscleGroup, equipmentName, createdBy, youtubeLink, description, difficulty)

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
  removeExercise: async (id: number) => {
    const deleteExercise = await exerciseService.deleteExercise(id)

    set((state) => ({
      exercise: [...state.exercise.filter(e => e.exercise_id !== id)]
    }))
  }
}))