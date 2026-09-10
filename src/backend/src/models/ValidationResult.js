import mongoose from 'mongoose'

const perDepthMetricSchema = new mongoose.Schema(
  {
    depth: { type: Number, required: true },
    rmse: { type: Number, required: true },
    mae: { type: Number, required: true },
    bias: { type: Number, required: true },
    correlation: { type: Number },
    pairCount: { type: Number, required: true },
  },
  { _id: false }
)

const validationResultSchema = new mongoose.Schema(
  {
    modelVersion: { type: String, required: true },
    dateRange: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
    },
    region: {
      latMin: Number,
      latMax: Number,
      lonMin: Number,
      lonMax: Number,
    },
    matchToleranceKm: { type: Number, default: 25 },
    overall: {
      rmse: Number,
      mae: Number,
      bias: Number,
      correlation: Number,
      pairCount: Number,
    },
    perDepth: { type: [perDepthMetricSchema], default: [] },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

export default mongoose.model('ValidationResult', validationResultSchema)
