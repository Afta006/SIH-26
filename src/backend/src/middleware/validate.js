import { validationResult } from 'express-validator'
import { ApiError } from '../utils/apiResponse.js'

/** Run after an array of express-validator checks to short-circuit on bad input. */
export const validate = (req, res, next) => {
  const result = validationResult(req)
  if (!result.isEmpty()) {
    throw new ApiError(422, 'Validation failed', result.array())
  }
  next()
}
