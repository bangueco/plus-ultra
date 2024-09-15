import express from 'express'
import cors from 'cors'
import helmet from 'helmet'

import authRouter from './routes/auth.routes'
import errorHandler from './middlewares/errorHandler'
import equipmentRouter from './routes/equipment.routes'

const app = express()

// Middlewares
app.use(express.json())
app.use(cors())
app.use(helmet())

// Routes
app.use('/api/auth', authRouter)
app.use('/api/equipment', equipmentRouter)

// Middlewares
app.use(errorHandler)

export default app