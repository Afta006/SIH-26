import asyncHandler from 'express-async-handler'
import bcrypt from 'bcryptjs'
import User from '../models/User.js'
import { ok, created, ApiError } from '../utils/apiResponse.js'
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens.js'

const REFRESH_COOKIE = 'refreshToken'

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 7 * 24 * 60 * 60 * 1000,
}

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, role } = req.body

  const existing = await User.findOne({ email: email.toLowerCase() })
  if (existing) throw new ApiError(409, 'An account with this email already exists.')

  // Only allow self-registering as researcher/viewer; admin accounts are seeded/promoted separately.
  const safeRole = role === 'viewer' ? 'viewer' : 'researcher'

  const user = await User.create({ name, email, password, role: safeRole })

  const accessToken = signAccessToken(user)
  const refreshToken = signRefreshToken(user)
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10)
  await user.save()

  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions)
  created(res, { user: user.toSafeObject(), accessToken })
})

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body

  const user = await User.findOne({ email: email.toLowerCase() }).select('+password')
  if (!user || !(await user.comparePassword(password))) {
    throw new ApiError(401, 'Invalid email or password.')
  }

  const accessToken = signAccessToken(user)
  const refreshToken = signRefreshToken(user)
  user.refreshTokenHash = await bcrypt.hash(refreshToken, 10)
  await user.save()

  res.cookie(REFRESH_COOKIE, refreshToken, cookieOptions)
  ok(res, { user: user.toSafeObject(), accessToken })
})

export const refresh = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE]
  if (!token) throw new ApiError(401, 'Missing refresh token.')

  let decoded
  try {
    decoded = verifyRefreshToken(token)
  } catch {
    throw new ApiError(401, 'Invalid or expired refresh token.')
  }

  const user = await User.findById(decoded.sub).select('+refreshTokenHash')
  if (!user || !user.refreshTokenHash || !(await bcrypt.compare(token, user.refreshTokenHash))) {
    throw new ApiError(401, 'Refresh token no longer valid.')
  }

  const accessToken = signAccessToken(user)
  ok(res, { accessToken })
})

export const logout = asyncHandler(async (req, res) => {
  const token = req.cookies?.[REFRESH_COOKIE]
  if (token) {
    try {
      const decoded = verifyRefreshToken(token)
      await User.findByIdAndUpdate(decoded.sub, { $unset: { refreshTokenHash: 1 } })
    } catch {
      // ignore invalid token on logout
    }
  }
  res.clearCookie(REFRESH_COOKIE, cookieOptions)
  ok(res, { loggedOut: true })
})

export const getMe = asyncHandler(async (req, res) => {
  ok(res, { user: req.user.toSafeObject() })
})
