import trainerService from "@/services/trainer.service"
import { Trainer } from "@/types/user"
import { create } from "zustand"

type State = {
  trainer: Array<Trainer>
}

type Action = {
  fetchTrainers: () => Promise<void>
}

export const useTrainerStore = create<State & Action>((set) => ({
  trainer: [],
  fetchTrainers: async () => {
    try {
      const trainers = await trainerService.getAllTrainers()
      return set({trainer: trainers})
    } catch (error) {
      console.error(error)
    }
  }
}))