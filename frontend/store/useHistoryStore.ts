import historyService from '@/services/history.service'
import historyExerciseService from '@/services/historyExercise.service'
import { SQLiteRunResult } from 'expo-sqlite'
import { create } from 'zustand'

type History = {
  history_id: number,
  template_name: string,
  elapsed_time: string,
  calories_burned: number,
  date: string
}

type HistoryExercise = {
  history_exercise_id: number,
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
  ) => Promise<SQLiteRunResult>
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

    const workoutDate = `${days[currentDate.getDay()]}, ${months[currentDate.getMonth()]} ${currentDate.getDate()}, ${currentDate.getFullYear()}`

    const newHistory = await historyService.createHistory(
      templateName,
      `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
      1000,
      workoutDate
    )

    set((state) => ({
      history: [
        ...state.history,
        {
          history_id: newHistory.lastInsertRowId,
          template_name: templateName,
          elapsed_time: `${hours}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`,
          calories_burned: 1000,
          date: workoutDate,
        },
      ],
    }))

    return newHistory
  }
}))