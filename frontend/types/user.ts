export type User = {
  id: number,
  username: string,
  email: string,
  age: number,
  accessToken: string,
  refreshToken: string
}

export type UserPreferences = {
  darkMode: boolean,
  fitnessLevel: string,
  firstTime: boolean
}