import mongoose from 'mongoose'
import { env } from './env.js'

export const connectDB = async () => {
  mongoose.set('strictQuery', true)

  const conn = await mongoose.connect(env.mongoUri)

  console.log(`[db] MongoDB connected: ${conn.connection.host}/${conn.connection.name}`)

  mongoose.connection.on('error', (err) => {
    console.error('[db] connection error:', err.message)
  })
  mongoose.connection.on('disconnected', () => {
    console.warn('[db] disconnected')
  })

  return conn
}
