import express from 'express'
import path from 'path'
import cors from 'cors'
import helmet from 'helmet'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import logger from './config/logger.js'
import { errorHandler, notFound } from './middleware/errorHandler.js'
import { apiLimiter } from './middleware/rateLimiter.js'

import authRoutes from './routes/authRoutes.js'
import serviceRoutes from './routes/serviceRoutes.js'
import galleryRoutes from './routes/galleryRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import quoteRoutes from './routes/quoteRoutes.js'
import contactRoutes from './routes/contactRoutes.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/* Security headers only. No CSP */
app.use(
  helmet({
    crossOriginEmbedderPolicy: false
  })
)

/* Static resources */
app.use('/resources', express.static(path.join(__dirname, 'Resources')))

/* CORS. Allow frontend to talk to backend */
app.use(
  cors({
    origin: true,
    credentials: true
  })
)

/* Preflight */
app.options('*', cors())

/* Body parsers */
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))

/* Rate limiting */
app.use('/api', apiLimiter)

/* Health check */
app.get('/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Server is running',
    timestamp: new Date().toISOString()
  })
})

/* API routes */
app.use('/api/auth', authRoutes)
app.use('/api/services', serviceRoutes)
app.use('/api/gallery', galleryRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/quotes', quoteRoutes)
app.use('/api/contact', contactRoutes)

/* Root */
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Secure Backend API',
    version: '1.0.0'
  })
})

/* Errors */
app.use(notFound)
app.use(errorHandler)

/* Start */
app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`)
})

process.on('unhandledRejection', err => {
  logger.error('Unhandled Promise Rejection', err)
  process.exit(1)
})

export default app
