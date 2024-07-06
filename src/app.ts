import express from 'express'
import cors from 'cors'

import userRouter from './routes/user.routes'
import errorHandler from './middlewares/errorHandler'

const app = express()

app.use(express.json())
app.use(cors())

// Routes
app.use('/api/user', userRouter)

// Middlewares
app.use(errorHandler)

export default app