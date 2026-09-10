import { Router } from 'express'
import { getMeta, getPredict, getResults } from '../controllers/publicController.js'

// Deliberately NOT using `router.use(protect)` here, unlike every other
// route file in this project — the frontend has no login flow at all, so
// these three endpoints must stay open.
const router = Router()

router.get('/meta', getMeta)
router.get('/predict', getPredict)
router.get('/results', getResults)

export default router
