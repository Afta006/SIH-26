import mongoose from 'mongoose'

const depthValueSchema = new mongoose.Schema(
  {
    depth: { type: Number, required: true },
    temperature: { type: Number, required: true },
    salinity: { type: Number },
  },
  { _id: false }
)

/**
 * A single ARGO float profile: one float, one cycle/date, one location,
 * with a vertical profile of temperature (and optionally salinity).
 * Used as ground truth to validate the reconstruction model.
 */
const argoObservationSchema = new mongoose.Schema(
  {
    floatId: { type: String, required: true, index: true },
    cycleNumber: { type: Number },
    date: { type: Date, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    profile: { type: [depthValueSchema], required: true },
    source: { type: String, default: 'ARGO' },
    importedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: true }
)

argoObservationSchema.index({ date: 1, lat: 1, lon: 1 })

export default mongoose.model('ArgoObservation', argoObservationSchema)
