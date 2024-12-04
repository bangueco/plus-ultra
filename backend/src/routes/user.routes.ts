import express from 'express'
import userController from '../controllers/user.controller'

const userRouter = express.Router()

userRouter.get('/', userController.findUser)
userRouter.get('/email/status', userController.isEmailVerified)
userRouter.get('/email/verify', userController.verifyEmail)
userRouter.get('/trainers', userController.getTrainers)
userRouter.post('/trainers/join', userController.joinTrainer)
userRouter.post('/trainers/leave', userController.leaveTrainer)
userRouter.post('/trainers/approve', userController.approveClient)
userRouter.post('/trainers/cancel', userController.cancelClient)

export default userRouter