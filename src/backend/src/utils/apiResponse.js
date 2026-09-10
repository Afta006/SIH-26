export const ok = (res, data, meta = undefined, status = 200) =>
  res.status(status).json({ success: true, data, ...(meta ? { meta } : {}) })

export const created = (res, data) => ok(res, data, undefined, 201)

export class ApiError extends Error {
  constructor(status, message, details = undefined) {
    super(message)
    this.status = status
    this.details = details
  }
}
