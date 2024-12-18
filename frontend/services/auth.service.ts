import { Role } from "@/types/user"
import axios from "axios"
const baseURL = process.env.EXPO_PUBLIC_API_URL

// Having an undefined parameters here is fine, as the backend will check it anyway and throw an error message

const register = async (username: string | undefined, email: string | undefined, password: string | undefined, birthdate: Date | undefined, role: Role | undefined) => {
  const request = await axios.post(`${baseURL}/auth/register`, {username, email, password, birthdate, role})
  return request.data
}

const login = async (username: string | undefined, password: string | undefined) => {
  const request = await axios.post(`${baseURL}/auth/login`, {username, password})
  return request.data
}

const isEmailValid = async (username: string) => {
  const request = await axios.get(`${baseURL}/user/email/status?username=${username}`)
  return request.data
}

const getUser = async (userId: number) => {
  const request = await axios.get(`${baseURL}/user?userId=${userId}`)
  return request.data
}

export default {
  register,
  login, isEmailValid, getUser
}