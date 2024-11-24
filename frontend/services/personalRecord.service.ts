import axios from "axios"
const baseURL = process.env.EXPO_PUBLIC_API_URL

const newRecord = async (exerciseName: string, set: number, weight: number, reps: number, userId: number) => {
  const request = await axios.post(`${baseURL}/user/personal-record`, {exercise_name: exerciseName, set, weight, reps, userId})
  return request.data
}

export default {
  newRecord
}