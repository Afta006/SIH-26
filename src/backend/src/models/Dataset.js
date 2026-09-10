import mongoose from 'mongoose'

const datasetSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    source: {
      type: String,
      required: true,
      enum: ['INSAT-3D', 'OCEANSAT-2', 'OCEANSAT-3', 'MODIS-Aqua', 'MODIS-Terra', 'ERA5', 'OTHER'],
    },
    variable: {
      type: String,
      required: true,
      enum: ['SST', 'SSS', 'SSHA', 'CHLOROPHYLL', 'WIND_STRESS', 'OTHER'],
      // SST=sea surface temp, SSS=sea surface salinity, SSHA=sea surface height anomaly
    },
    region: {
      latMin: { type: Number, required: true },
      latMax: { type: Number, required: true },
      lonMin: { type: Number, required: true },
      lonMax: { type: Number, required: true },
    },
    dateRange: {
      start: { type: Date, required: true },
      end: { type: Date, required: true },
    },
    spatialResolutionDeg: { type: Number, default: 0.25 },
    temporalResolution: { type: String, enum: ['daily', 'weekly', 'monthly'], default: 'daily' },
    filePath: { type: String }, // path/URL of uploaded raw file, if any
    status: {
      type: String,
      enum: ['raw', 'preprocessing', 'preprocessed', 'failed'],
      default: 'raw',
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
    uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

datasetSchema.index({ source: 1, variable: 1, 'dateRange.start': 1, 'dateRange.end': 1 })

export default mongoose.model('Dataset', datasetSchema)
