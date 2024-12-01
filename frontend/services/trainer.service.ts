import { Trainer } from "@/types/user"
import axios from "axios"
const baseURL = process.env.EXPO_PUBLIC_API_URL

const getAllTrainers = async () => {
  const request = await axios.get(`${baseURL}/user/trainers`)
  return request.data
}

const joinTrainer = async (userId: number, trainerId: number | null) => {
  const request = await axios.post(`${baseURL}/user/trainers/join`, {userId, trainerId})
  return request
}

const leaveTrainer = async (userId: number) => {
  const request = await axios.post(`${baseURL}/user/trainers/leave`, {userId})
  return request
}

export default {
  getAllTrainers, joinTrainer, leaveTrainer
}