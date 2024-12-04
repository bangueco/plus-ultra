import { Role, User } from "@/types/user";
import { create } from "zustand";
import * as SecureStore from "expo-secure-store"
import asyncStore from "@/lib/asyncStore";

type Preferences = {
  firstTime: boolean,
  darkMode: boolean,
  fitnessLevel: string,
  weight: number,
  height: number
}

type State = {
  user: User,
  preferences: Preferences
}

type Action = {
  getUserInfo: () => void,
  getUserPreferences: () => Promise<void>,
  logout: () => Promise<void>
}

export const useUserStore = create<State & Action>((set) => ({
  user: {id: 0, username: 'guest', email: '', accessToken: '', refreshToken: '', birthdate: new Date(), isEmailValid: false, role: 'USER', approved: false, trainerId: null},
  preferences: {darkMode: false, firstTime: false, fitnessLevel: "Beginner", weight: 0, height: 0},
  getUserPreferences: async () => {
    const preference = await asyncStore.getItem('preferences')

    if (!preference) return

    const parsedPreference: Preferences = JSON.parse(preference)
    return set({preferences: parsedPreference})
  },
  getUserInfo: () => {
    const userJson = SecureStore.getItem('user')

    if (!userJson) return

    const userData: User = JSON.parse(userJson)

    return set({user: userData})
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('user')
    return set({user: {id: 0, username: 'guest', email: '', accessToken: '', refreshToken: '', birthdate: new Date(), isEmailValid: false, role: 'USER', approved: false, trainerId: null}})
  }
}))