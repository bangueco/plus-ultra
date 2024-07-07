import axios from "axios"
const baseURL = 'http://192.168.100.4:3000/api/user/register'

const register = async (username: string, email: string, password: string) => {
  const request = await axios.post(baseURL, {username, email, password})
  return request.data
}

export default {
  register
}