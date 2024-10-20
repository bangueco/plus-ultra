import historyService from '@/services/history.service'
import { SQLiteRunResult } from 'expo-sqlite'
import { create } from 'zustand'

type HistoryExercise = {
  history_id: number,
  template_name: string,
  elapsed_time: string,
  calories_burned: number,
  date: string
}

type State = {
  history: Array<HistoryExercise>
}

type Action = {
  fetchHistory: () => void,
  addHistory: (
    templateName: string,
    hours: number,
    minutes: number,
    seconds: number
  ) => Promise<SQLiteRunResult>
}

export const useHistoryStore = create<State & Action>((set) => ({
  history: [],
  fetchHistory: async () => {
    try {
      const data = await historyService.getAllHistory()
      set({history: data})
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