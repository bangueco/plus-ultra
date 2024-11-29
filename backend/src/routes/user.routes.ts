import express from 'express'
import userController from '../controllers/user.controller'

const userRouter = express.Router()

userRouter.get('/email/status', userController.isEmailVerified)
userRouter.get('/email/verify', userController.verifyEmail)

export default userRouter