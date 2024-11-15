import express from 'express'
import exerciseController from '../controllers/exercise.controller'

const exerciseRouter = express.Router()

exerciseRouter.get('/:id', exerciseController.getExercisesByUser)
exerciseRouter.post('/create-user', exerciseController.createUserExercise)


export default exerciseRouter