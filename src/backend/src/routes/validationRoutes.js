import { Router } from 'express'
import { listValidationResults, getValidationResult } from '../controllers/validationController.js'
import { protect } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/', listValidationResults)
router.get('/:id', getValidationResult)

export default router
