import axios from "axios"
const baseURL = 'http://localhost:3000/api/user'

// Having an undefined parameters here is fine, as the backend will check it anyway and throw an error message

const register = async (username: string | undefined, email: string | undefined, password: string | undefined) => {
  const request = await axios.post(`${baseURL}/register`, {username, email, password})
  return request.data
}

const login = async (username: string | undefined, password: string | undefined) => {
  const request = await axios.post(`${baseURL}/login`, {username, password})
  return request.data
}

export default {
  register,
  login
}