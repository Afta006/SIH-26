import jwt from 'jsonwebtoken'
import asyncHandler from 'express-async-handler'
import { env } from '../config/env.js'
import { ApiError } from '../utils/apiResponse.js'
import User from '../models/User.js'

export const protect = asyncHandler(async (req, res, next) => {
  const header = req.headers.authorization || ''
  const token = header.startsWith('Bearer ') ? header.slice(7) : null

  if (!token) throw new ApiError(401, 'Not authenticated. Missing bearer token.')

  let decoded
  try {
    decoded = jwt.verify(token, env.jwt.secret)
  } catch {
    throw new ApiError(401, 'Invalid or expired token.')
  }

  const user = await User.findById(decoded.sub)
  if (!user) throw new ApiError(401, 'User for this token no longer exists.')

  req.user = user
  next()
})

export const authorize =
  (...roles) =>
  (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
      throw new ApiError(403, `Role '${req.user?.role}' is not permitted to perform this action.`)
    }
    next()
  }
