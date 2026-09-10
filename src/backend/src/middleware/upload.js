import multer from 'multer'
import path from 'node:path'
import fs from 'node:fs'

const uploadDir = path.resolve('uploads')
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true })

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const unique = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    cb(null, `${unique}${path.extname(file.originalname)}`)
  },
})

// Satellite/ocean data commonly comes as NetCDF (.nc), HDF5 (.h5/.hdf), CSV, or zipped archives.
const allowedExt = new Set(['.nc', '.h5', '.hdf', '.hdf5', '.csv', '.zip', '.tif', '.tiff'])

export const uploadDataset = multer({
  storage,
  limits: { fileSize: 500 * 1024 * 1024 }, // 500MB
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase()
    if (allowedExt.has(ext)) cb(null, true)
    else cb(new Error(`Unsupported file type: ${ext}`))
  },
})
