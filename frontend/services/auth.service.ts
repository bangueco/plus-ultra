import axios from "axios"
const baseURL = process.env.EXPO_PUBLIC_API_URL

// Having an undefined parameters here is fine, as the backend will check it anyway and throw an error message

const register = async (username: string | undefined, email: string | undefined, password: string | undefined) => {
  const request = await axios.post(`${baseURL}/user/register`, {username, email, password})
  return request.data
}

const login = async (username: string | undefined, password: string | undefined) => {
  const request = await axios.post(`${baseURL}/user/login`, {username, password})
  return request.data
}

export default {
  register,
  login
}