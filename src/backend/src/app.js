import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import cookieParser from 'cookie-parser'
import mongoSanitize from 'express-mongo-sanitize'
import rateLimit from 'express-rate-limit'

import { env } from './config/env.js'
import routes from './routes/index.js'
import { notFound, errorHandler } from './middleware/errorHandler.js'

const app = express()

app.use(helmet())
app.use(
  cors({
    origin: env.clientOrigin,
    credentials: true,
  })
)
app.use(compression())
app.use(express.json({ limit: '5mb' }))
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())
app.use(mongoSanitize())
app.use(morgan(env.nodeEnv === 'development' ? 'dev' : 'combined'))

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api', limiter)

app.use('/api', routes)

app.use(notFound)
app.use(errorHandler)

export default app
