import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthRequest extends Request {
  adminId?: string
  adminRole?: string
}

interface JwtPayload {
  id: string
  role: string
  iat: number
  exp: number
}

export const protect = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Not authorized — no token' })
    return
  }

  const token = authHeader.split(' ')[1]

  try {
    const secret = process.env.JWT_SECRET as string
    const decoded = jwt.verify(token, secret) as JwtPayload
    req.adminId = decoded.id
    req.adminRole = decoded.role
    next()
  } catch {
    res.status(401).json({ success: false, message: 'Not authorized — invalid token' })
  }
}

export const requireSuperAdmin = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void => {
  if (req.adminRole !== 'superadmin') {
    res.status(403).json({ success: false, message: 'Access denied — superadmin only' })
    return
  }
  next()
}
