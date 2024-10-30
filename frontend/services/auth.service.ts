import axios from "axios"
const baseURL = process.env.EXPO_PUBLIC_API_URL

// Having an undefined parameters here is fine, as the backend will check it anyway and throw an error message

const register = async (username: string | undefined, email: string | undefined, password: string | undefined, birthdate: Date | undefined) => {
  const request = await axios.post(`${baseURL}/auth/register`, {username, email, password, birthdate})
  return request.data
}

const login = async (username: string | undefined, password: string | undefined) => {
  const request = await axios.post(`${baseURL}/auth/login`, {username, password})
  return request.data
}

export default {
  register,
  login
}