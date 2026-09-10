import app from './src/app.js'
import { connectDB } from './src/config/db.js'
import { env } from './src/config/env.js'
import { logger } from './src/utils/logger.js'

async function start() {
  try {
    await connectDB()
    app.listen(env.port, () => {
      logger.info(`Server running in ${env.nodeEnv} mode on port ${env.port}`)
      logger.info(`API base: http://localhost:${env.port}/api`)
    })
  } catch (err) {
    logger.error('Failed to start server:', err.message)
    process.exit(1)
  }
}

process.on('unhandledRejection', (err) => {
  logger.error('Unhandled rejection:', err)
  process.exit(1)
})

start()
