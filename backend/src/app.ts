import express from 'express'
import cors from 'cors'

import userRouter from './routes/user.routes'
import errorHandler from './middlewares/errorHandler'
import equipmentRouter from './routes/equipment.routes'
import requestLogger from './middlewares/requestLogger'

const app = express()

app.use(express.json())
app.use(cors())
app.use(requestLogger)

// Routes
app.use('/api/user', userRouter)
app.use('/api/equipment', equipmentRouter)

// Middlewares
app.use(errorHandler)

export default app