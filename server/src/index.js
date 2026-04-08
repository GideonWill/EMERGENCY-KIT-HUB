import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { connectDb } from './config/db.js'
import { handleStripeWebhook } from './controllers/paymentController.js'

import authRoutes from './routes/authRoutes.js'
import userRoutes from './routes/userRoutes.js'
import productRoutes from './routes/productRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import paymentRoutes from './routes/paymentRoutes.js'
import subscriptionRoutes from './routes/subscriptionRoutes.js'
import appointmentRoutes from './routes/appointmentRoutes.js'

const requiredEnv = ['MONGODB_URI', 'JWT_SECRET']
for (const key of requiredEnv) {
  if (!process.env[key]) {
    console.error(`FATAL: Missing environment variable ${key}. Copy server/.env.example to server/.env`)
    process.exit(1)
  }
}

const app = express()

app.use(
  cors({
    origin: process.env.CLIENT_URL || true,
    credentials: true,
  })
)

/** Stripe webhook must receive raw body */
app.post('/api/payments/webhook', express.raw({ type: 'application/json' }), handleStripeWebhook)

app.use(express.json({ limit: '1mb' }))

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
