import { connectDB } from '../src/config/db.js'
import { env } from '../src/config/env.js'
import User from '../src/models/User.js'
import mongoose from 'mongoose'

async function run() {
  await connectDB()

  const existing = await User.findOne({ email: env.admin.email.toLowerCase() })
  if (existing) {
    console.log(`Admin user already exists: ${existing.email}`)
  } else {
    const admin = await User.create({
      name: env.admin.name,
      email: env.admin.email,
      password: env.admin.password,
      role: 'admin',
    })
    console.log(`Admin user created: ${admin.email} (password from ADMIN_PASSWORD env var)`)
  }

  await mongoose.disconnect()
  process.exit(0)
}

run().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})
