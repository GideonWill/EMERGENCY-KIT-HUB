import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import { rateLimit } from 'express-rate-limit'
import { connectDb } from './config/db.js'
import { handlePaystackWebhook } from './controllers/paymentController.js'

import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import subscriptionRoutes from './routes/subscriptionRoutes.js'
import appointmentRoutes from './routes/appointmentRoutes.js'
import paystackRoutes from './routes/paystackRoutes.js'
import uploadRoutes from './routes/uploadRoutes.js'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const requiredEnv = ['DATABASE_URL', 'JWT_SECRET']
for (const key of requiredEnv) {
  if (!process.env[key]) {
    throw new Error(`FATAL: Missing environment variable ${key}. Set it in Vercel Dashboard or copy server/.env.example to server/.env`)
  }
}

const app = express()

// Security headers
app.use(helmet())

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 1000, // Increased for admin dashboard usage
  standardHeaders: true,
  legacyHeaders: false,
})
app.use('/api/', limiter)

// Request logger
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`${req.method} ${req.url} ${res.statusCode} - ${duration}ms`)
  })
  next()
})

app.use(
  cors({
    origin: true,
    credentials: true,
  })
)

// Global body parsers
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), handlePaystackWebhook)
app.use(express.json({ limit: '1mb' }))
app.use(express.urlencoded({ extended: true }))

app.get('/api/health', (req, res) => {
  res.json({ success: true, message: 'ok', ts: new Date().toISOString() })
})

app.use('/api/auth', authRoutes)
app.use('/api/users', userRoutes)
app.use('/api/products', productRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/payments', paymentRoutes)
app.use('/api/subscriptions', subscriptionRoutes)
app.use('/api/appointments', appointmentRoutes)
app.use('/api/admin/paystack', paystackRoutes)
app.use('/api/upload', uploadRoutes)

// Serve uploaded files from disk (local dev only; production uses Vercel Blob CDN URLs)
if (!process.env.VERCEL) {
  const uploadsPath = path.join(path.dirname(__dirname), 'uploads')
  app.use('/uploads', express.static(uploadsPath))
}

app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Not found' })
})

app.use((err, req, res, _next) => {
  console.error(err)
  const status = err.status || err.statusCode || 500
  res.status(status).json({
    success: false,
    message: err.message || 'Server error',
  })
})

// Export for Vercel Serverless Functions
export default app

// Only start listening when running locally (not on Vercel)
if (!process.env.VERCEL) {
  const port = Number(process.env.PORT) || 5000
  connectDb()
    .then(() => {
      app.listen(port, () => {
        console.log(`API listening on http://localhost:${port}`)
      })
    })
    .catch((e) => {
      console.error('Database connection failed', e)
      process.exit(1)
    })
}
