import { Router } from 'express'
import { getGridByDate, getTimeSeriesAtPoint } from '../controllers/reconstructionController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/grid', getGridByDate)
router.get('/timeseries', getTimeSeriesAtPoint)

export default router
