import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import authRouter from './routes/auth.routes'
import errorHandler from './middlewares/errorHandler'
import equipmentRouter from './routes/equipment.routes'
import userRouter from './routes/user.routes'
import templateRouter from './routes/template.routes'

const app = express()

// Middlewares
app.use(express.json())
app.use(cors())
app.use(helmet())

// Routes
app.use('/api/auth', authRouter)
app.use('/api/equipment', equipmentRouter)
app.use('/api/user', userRouter)
app.use('/api/template', templateRouter)

// Middlewares
app.use(errorHandler)

export default app