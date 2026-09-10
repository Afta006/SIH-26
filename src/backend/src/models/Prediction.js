import mongoose from 'mongoose'

/**
 * Matches predictions.json exactly (see scripts/importPredictions.js).
 * Kept deliberately separate from the existing Reconstruction model —
 * that one only stores a single `profile`, with no ground-truth
 * comparison value, which the frontend's live demo needs (predicted vs
 * actual/GLORYS side by side).
 */
const predictionSchema = new mongoose.Schema({
  date: {
    type: String, // "YYYY-MM-DD"
    required: true,
    index: true,
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      required: true,
      default: 'Point',
    },
    coordinates: {
      type: [Number], // GeoJSON order: [longitude, latitude]
      required: true,
    },
  },
  depths: {
    type: [Number],
    required: true,
  },
  predicted_temp: {
    type: [Number],
    required: true,
  },
  actual_temp: {
    type: [Number],
    required: true,
  },
})

predictionSchema.index({ location: '2dsphere' })

export default mongoose.model('Prediction', predictionSchema)
