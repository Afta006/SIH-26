import { logger } from '../utils/logger.js'

export const notFound = (req, res, next) => {
  res.status(404)
  next(new Error(`Route not found: ${req.method} ${req.originalUrl}`))
}

// eslint-disable-next-line no-unused-vars
export const errorHandler = (err, req, res, next) => {
  const status = err.status || res.statusCode !== 200 ? res.statusCode : 500
  const finalStatus = status && status !== 200 ? status : 500

  if (finalStatus >= 500) {
    logger.error(err.stack || err.message)
  }

  res.status(finalStatus).json({
    success: false,
    message: err.message || 'Internal server error',
    ...(err.details ? { details: err.details } : {}),
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {}),
  })
}
