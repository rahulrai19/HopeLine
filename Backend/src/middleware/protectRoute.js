import jwt from 'jsonwebtoken'
import { verifyToken } from '../utils/jwtUtils.js'

export function protectRoute(req, res, next) {
  const header = req.headers.authorization || ''
  const [, token] = header.split(' ')
  if (!token) return res.status(401).json({ message: 'Unauthorized' })
  try {
    const decoded = verifyToken(token, process.env.JWT_SECRET || 'dev_secret')
    req.user = decoded
    next()
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}


