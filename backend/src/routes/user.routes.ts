import express from 'express'
import userController from '../controllers/user.controller'

const userRouter = express.Router()

userRouter.post('/email/status', userController.isEmailVerified)

export default userRouter