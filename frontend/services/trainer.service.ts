import { Trainer } from "@/types/user"
import axios from "axios"
const baseURL = process.env.EXPO_PUBLIC_API_URL

const getAllTrainers = async () => {
  const request = await axios.get(`${baseURL}/user/trainers`)
  return request.data
}

export default {
  getAllTrainers
}