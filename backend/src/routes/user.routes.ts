import express from 'express'
import userController from '../controllers/user.controller'

import validate from '../middlewares/validate'

const userRouter = express.Router()

userRouter.post('/register', validate.userRegistration, userController.register)

userRouter.post('/login', validate.userAuthentication, userController.login)
                          
export default userRouter