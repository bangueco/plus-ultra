import { Role, User } from "@/types/user";
import { create } from "zustand";
import * as SecureStore from "expo-secure-store"

type State = {
  user: User
}

type Action = {
  getUserInfo: () => void,
  logout: () => Promise<void>
}

export const useUserStore = create<State & Action>((set) => ({
  user: {id: 0, username: 'guest', email: '', accessToken: '', refreshToken: '', birthdate: new Date(), isEmailValid: false, role: Role.USER, trainerId: null},
  getUserInfo: () => {
    const userJson = SecureStore.getItem('user')

    if (!userJson) return

    const userData: User = JSON.parse(userJson)

    return set({user: userData})
  },
  logout: async () => {
    await SecureStore.deleteItemAsync('user')
    return set({user: {id: 0, username: 'guest', email: '', accessToken: '', refreshToken: '', birthdate: new Date(), isEmailValid: false, role: Role.USER, trainerId: null}})
  }
}))