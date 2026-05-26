import { Router } from 'express'
import { login, getMe } from '../controllers/auth.controller'
import { protect } from '../middleware/auth'

const router = Router()

// POST /api/auth/login
router.post('/login', login)

// GET /api/auth/me  (protected)
router.get('/me', protect, getMe)

export default router
