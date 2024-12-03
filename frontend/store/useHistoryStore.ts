import asyncStore from '@/lib/asyncStore'
import historyService from '@/services/history.service'
import historyExerciseService from '@/services/historyExercise.service'
import { SQLiteRunResult } from 'expo-sqlite'
import { create } from 'zustand'

type Preferences = {
  firstTime: boolean,
  darkMode: boolean,
  userFitnessLevel: string,
  height: number,
  weight: number
}

type History = {
  history_id: number,
  template_name: string,
  elapsed_time: string,
  calories_burned: number,
  date: string
}

type HistoryExercise = {
  history_id: number,
  template_item_id: number,
  template_id: number,
  reps: number,
  weight: number,
  exercise_name: string
}

type State = {
  history: Array<History>
  historyExercise: Array<HistoryExercise>
}

type Action = {
  fetchHistory: () => Promise<void>,
  fetchHistoryExercise: () => Promise<void>,
  addHistory: (
    templateName: string,
    hours: number,
    minutes: number,
    seconds: number
  ) => Promise<SQLiteRunResult | null>,
  addHistoryExercise: (
    lastInsertRowId: number,
    template_item_id: number,
    template_id: number,
    reps: number,
    weight: number,
    exercise_name: string
  ) => void
}

export const useHistoryStore = create<State & Action>((set) => ({
  history: [],
  historyExercise: [],
  fetchHistory: async () => {
    try {
      const data = await historyService.getAllHistory()
      set({history: data})
    } catch (error) {
      console.error(error)
    }
  },
  fetchHistoryExercise: async () => {
    try {
      const data = await historyExerciseService.getAllExerciseHistory()
      set({historyExercise: data})
    } catch (error) {
      console.error(error)
    }
  },
  addHistory: async (templateName, hours, minutes, seconds) => {

    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];

    const currentDate = new Date()

    const preference = await asyncStore.getItem('preferences')

    if (!preference) return null

    const parsedPreference: Preferences = JSON.parse(preference)

    let totalTimeInHours = hours + (minutes / 60) + (seconds / 3600);
    let caloriesBurned = 5 * parsedPreference.weight * totalTimeInHours;

    const workoutDate = `${days[currentDate.getDay()]}, ${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`

    const newHistory = await historyService.createHistory(
      templateName,
      `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      caloriesBurned,
      workoutDate
    )

    set((state) => ({
      history: [
        ...state.history,
        {
          history_id: newHistory.lastInsertRowId,
          template_name: templateName,
          elapsed_time: `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
          calories_burned: caloriesBurned,
          date: workoutDate,
        },
      ],
    }))

    return newHistory
  },
  addHistoryExercise: (lastInsertRowId, template_item_id, template_id, reps, weight, exercise_name) => {
      set((state) => ({
        historyExercise: [
          ...state.historyExercise,
          {
            history_id: lastInsertRowId,
            template_item_id,
            template_id,
            reps,
            weight,
            exercise_name
          }
        ]
      }))

      return
  },
}))