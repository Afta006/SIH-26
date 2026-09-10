import dotenv from 'dotenv'
dotenv.config()

const num = (val, fallback) => (val === undefined ? fallback : Number(val))

export const env = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: num(process.env.PORT, 5000),
  clientOrigin: process.env.CLIENT_ORIGIN || 'http://localhost:5173',

  mongoUri: process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/sih_ocean_pipeline',

  jwt: {
    secret: process.env.JWT_SECRET || 'dev_only_secret_change_me',
    expiresIn: process.env.JWT_EXPIRES_IN || '15m',
    refreshSecret: process.env.JWT_REFRESH_SECRET || 'dev_only_refresh_secret_change_me',
    refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '7d',
  },

  admin: {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'ChangeMe123!',
    name: process.env.ADMIN_NAME || 'Admin',
  },

  mlService: {
    url: process.env.ML_SERVICE_URL || 'http://localhost:8000',
    timeoutMs: num(process.env.ML_SERVICE_TIMEOUT_MS, 30000),
  },

  gridResolutionDeg: num(process.env.GRID_RESOLUTION_DEG, 0.25),

  defaultRegion: {
    latMin: num(process.env.REGION_LAT_MIN, 0),
    latMax: num(process.env.REGION_LAT_MAX, 25),
    lonMin: num(process.env.REGION_LON_MIN, 50),
    lonMax: num(process.env.REGION_LON_MAX, 100),
  },
}
