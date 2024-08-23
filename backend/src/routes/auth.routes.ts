import express from 'express'
import authController from '../controllers/auth.controller'

import validate from '../middlewares/validate'

const authRouter = express.Router()

authRouter.post('/register', validate.userRegistration, authController.register)

authRouter.post('/login', validate.userAuthentication, authController.login)
                          
export default authRouter