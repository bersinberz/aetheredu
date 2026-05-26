import { Request, Response } from 'express'
import jwt from 'jsonwebtoken'
import Admin from '../models/Admin'
import { AuthRequest } from '../middleware/auth'

const signToken = (id: string, role: string): string => {
  const secret = process.env.JWT_SECRET as string
  const expiresIn = process.env.JWT_EXPIRES_IN ?? '7d'
  return jwt.sign({ id, role }, secret, { expiresIn } as jwt.SignOptions)
}

// POST /api/auth/login
export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password } = req.body

  if (!email || !password) {
    res.status(400).json({ success: false, message: 'Email and password are required' })
    return
  }

  try {
    const admin = await Admin.findOne({ email }).select('+password')

    if (!admin || !(await admin.comparePassword(password))) {
      res.status(401).json({ success: false, message: 'Invalid email or password' })
      return
    }

    const id = (admin._id as { toString(): string }).toString()
    const token = signToken(id, admin.role)

    res.status(200).json({
      success: true,
      token,
      admin: {
        id,
        email: admin.email,
        name: admin.name,
        role: admin.role,
      },
    })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Login failed'
    res.status(500).json({ success: false, message })
  }
}

// GET /api/auth/me  (protected)
export const getMe = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const admin = await Admin.findById(req.adminId).select('-password')
    if (!admin) {
      res.status(404).json({ success: false, message: 'Admin not found' })
      return
    }
    res.status(200).json({ success: true, admin })
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Failed to fetch admin'
    res.status(500).json({ success: false, message })
  }
}
