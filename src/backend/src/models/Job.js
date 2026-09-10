import mongoose from 'mongoose'

const jobSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      required: true,
      enum: ['preprocessing', 'embedding', 'reconstruction', 'validation'],
    },
    status: {
      type: String,
      enum: ['pending', 'running', 'completed', 'failed'],
      default: 'pending',
    },
    dataset: { type: mongoose.Schema.Types.ObjectId, ref: 'Dataset' },
    params: { type: mongoose.Schema.Types.Mixed, default: {} },
    result: { type: mongoose.Schema.Types.Mixed, default: {} },
    error: { type: String },
    startedAt: { type: Date },
    finishedAt: { type: Date },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
)

export default mongoose.model('Job', jobSchema)
