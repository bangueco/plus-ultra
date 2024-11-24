import express from 'express'
import userController from '../controllers/user.controller'

const userRouter = express.Router()

userRouter.get('/email/status', userController.isEmailVerified)
userRouter.get('/email/verify', userController.verifyEmail)
userRouter.get('/personal-record', userController.getPersonalRecord)
userRouter.post('/personal-record', userController.newPersonalRecord)

export default userRouter