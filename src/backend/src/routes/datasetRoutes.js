import { Router } from 'express'
import { body } from 'express-validator'
import {
  createDataset,
  listDatasets,
  getDataset,
  updateDatasetStatus,
  deleteDataset,
} from '../controllers/datasetController.js'
import { protect, authorize } from '../middleware/auth.js'
import { uploadDataset } from '../middleware/upload.js'
import { validate } from '../middleware/validate.js'

const router = Router()

router.use(protect)

router.get('/', listDatasets)
router.get('/:id', getDataset)

router.post(
  '/',
  authorize('admin', 'researcher'),
  uploadDataset.single('file'),
  [
    body('name').notEmpty(),
    body('source').notEmpty(),
    body('variable').notEmpty(),
    body('dateRange.start').isISO8601(),
    body('dateRange.end').isISO8601(),
  ],
  validate,
  createDataset
)

router.patch('/:id/status', authorize('admin', 'researcher'), updateDatasetStatus)
router.delete('/:id', authorize('admin'), deleteDataset)

export default router
