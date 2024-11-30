export enum Role {
  USER,
  TRAINER
}

export type User = {
  id: number,
  username: string,
  email: string,
  birthdate: Date,
  accessToken: string,
  refreshToken: string,
  isEmailValid: boolean
  role: Role
}

export type Trainer = {
  id: number,
  username: string
  email: string,
  isEmailvalid: boolean,
  role: Role,
  clients: Array<User>
}

export type UserPreferences = {
  darkMode: boolean,
  fitnessLevel: string,
  firstTime: boolean
}