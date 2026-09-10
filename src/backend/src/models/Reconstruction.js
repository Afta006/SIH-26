import mongoose from 'mongoose'

const depthValueSchema = new mongoose.Schema(
  {
    depth: { type: Number, required: true }, // meters
    temperature: { type: Number, required: true }, // deg C
    uncertainty: { type: Number }, // optional model uncertainty estimate
  },
  { _id: false }
)

/**
 * A single grid-cell, single-day subsurface temperature profile produced by
 * the deep learning reconstruction model, at the standardized daily / 0.25deg
 * output resolution.
 */
const reconstructionSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    resolutionDeg: { type: Number, default: 0.25 },
    profile: { type: [depthValueSchema], required: true },
    modelVersion: { type: String, required: true, default: 'reconstruction-v1' },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    isMock: { type: Boolean, default: false }, // true if produced by the fallback mock generator
  },
  { timestamps: true }
)

reconstructionSchema.index({ date: 1, lat: 1, lon: 1, modelVersion: 1 }, { unique: true })

export default mongoose.model('Reconstruction', reconstructionSchema)
