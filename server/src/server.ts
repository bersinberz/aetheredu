import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connectDB from './config/db'
import authRoutes from './routes/auth.routes'

const app = express()
const PORT = process.env.PORT ?? 5000

// ── Middleware ──
app.use(cors({
  origin: process.env.CLIENT_URL ?? 'http://localhost:5173',
  credentials: true,
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Routes ──
app.use('/api/auth', authRoutes)

// ── Health check ──
app.get('/api/health', (_req, res) => {
  res.json({ success: true, message: 'Server is running', timestamp: new Date() })
})

// ── 404 handler ──
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// ── Start ──
const start = async () => {
  await connectDB()
  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`)
  })
}

start()
