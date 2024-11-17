export type User = {
  id: number,
  username: string,
  email: string,
  birthdate: Date,
  accessToken: string,
  refreshToken: string,
  isEmailValid: boolean
}

export type UserPreferences = {
  darkMode: boolean,
  fitnessLevel: string,
  firstTime: boolean
}