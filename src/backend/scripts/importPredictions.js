import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mongoose from 'mongoose'
import { connectDB } from '../src/config/db.js'
import Prediction from '../src/models/Prediction.js'

const __dirname = path.dirname(fileURLToPath(import.meta.url))

async function run() {
  const filePath = path.join(__dirname, '..', 'data', 'predictions.json')

  if (!fs.existsSync(filePath)) {
    console.error(
      `No file found at ${filePath}\n` +
      'Put predictions.json (from Colab) in backend/data/ first.'
    )
    process.exit(1)
  }

  const raw = fs.readFileSync(filePath, 'utf-8')
  const records = JSON.parse(raw)

  console.log(`Loaded ${records.length} records from predictions.json`)

  await connectDB()

  const docs = records.map((r) => ({
    date: r.date,
    location: {
      type: 'Point',
      coordinates: [r.lon, r.lat],
    },
    depths: r.depths,
    predicted_temp: r.predicted_temp,
    actual_temp: r.actual_temp,
  }))

  console.log('Clearing existing predictions...')
  await Prediction.deleteMany({})

  console.log('Inserting new predictions...')
  const BATCH_SIZE = 2000
  for (let i = 0; i < docs.length; i += BATCH_SIZE) {
    const batch = docs.slice(i, i + BATCH_SIZE)
    await Prediction.insertMany(batch)
    console.log(`Inserted ${Math.min(i + BATCH_SIZE, docs.length)} / ${docs.length}`)
  }

  console.log('Import complete.')
  await mongoose.disconnect()
  process.exit(0)
}

run().catch((err) => {
  console.error('Import failed:', err)
  process.exit(1)
})
