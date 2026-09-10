import { Router } from 'express'
import { body } from 'express-validator'
import {
  createArgoObservation,
  bulkImportArgo,
  listArgoObservations,
  deleteArgoObservation,
} from '../controllers/argoController.js'
import { protect, authorize } from '../middleware/auth.js'
import { validate } from '../middleware/validate.js'

const router = Router()

router.use(protect)

router.get('/', listArgoObservations)

router.post(
  '/',
  authorize('admin', 'researcher'),
  [
    body('floatId').notEmpty(),
    body('date').isISO8601(),
    body('lat').isFloat({ min: -90, max: 90 }),
    body('lon').isFloat({ min: -180, max: 180 }),
    body('profile').isArray({ min: 1 }),
  ],
  validate,
  createArgoObservation
)

router.post('/bulk', authorize('admin', 'researcher'), bulkImportArgo)
router.delete('/:id', authorize('admin'), deleteArgoObservation)

export default router
