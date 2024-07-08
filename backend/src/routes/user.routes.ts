import express from 'express'
import userController from '../controllers/user.controller'

import { validateUserRegistration } from '../middlewares/userValidation'

const userRouter = express.Router()

userRouter.post('/register', validateUserRegistration, userController.register)

userRouter.post('/login', userController.login)

export default userRouter