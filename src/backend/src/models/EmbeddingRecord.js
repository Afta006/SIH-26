import mongoose from 'mongoose'

/**
 * Stores the latent embedding produced by the satellite embedding engine
 * for a given grid cell + date, learned from surface observations
 * (SST, SSS, SSHA, chlorophyll, wind stress, etc).
 */
const embeddingRecordSchema = new mongoose.Schema(
  {
    date: { type: Date, required: true },
    lat: { type: Number, required: true },
    lon: { type: Number, required: true },
    vector: { type: [Number], required: true }, // latent embedding
    modelVersion: { type: String, required: true, default: 'embedding-v1' },
    sourceDatasets: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dataset' }],
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job' },
  },
  { timestamps: true }
)

embeddingRecordSchema.index({ date: 1, lat: 1, lon: 1, modelVersion: 1 }, { unique: true })

export default mongoose.model('EmbeddingRecord', embeddingRecordSchema)
