import templateService from "@/services/template.service"
import trainerService from "@/services/trainer.service"
import { TemplateTrainerProps } from "@/types/templates"
import { Trainer } from "@/types/user"
import { create } from "zustand"
import { useUserStore } from "./useUserStore"
import { AxiosError } from "axios"
import authService from "@/services/auth.service"

type State = {
  trainer: Array<Trainer>
  trainerTemplate: Array<TemplateTrainerProps>
}

type Action = {
  fetchTrainers: () => Promise<void>
  fetchTrainerTemplates: (id: number) => Promise<void>
}

export const useTrainerStore = create<State & Action>((set) => ({
  trainer: [],
  trainerTemplate: [],
  fetchTrainers: async () => {
    try {
      const trainers = await trainerService.getAllTrainers()
      return set({trainer: trainers})
    } catch (error) {
      console.error(error)
    }
  },
  fetchTrainerTemplates: async (id: number) => {
    try {
      const trainerTemplate = await templateService.findTemplatesByCreator(id)
      const extractedData: Array<TemplateTrainerProps> = trainerTemplate.data
      const generalTemplates = extractedData
      return set({trainerTemplate: [...generalTemplates]})
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error(error.response?.data)
      }
    }
  }
}))