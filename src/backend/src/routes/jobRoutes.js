import { Router } from 'express'
import {
  listJobs,
  getJob,
  startPreprocessing,
  runEmbedding,
  runReconstruction,
  runValidationJob,
} from '../controllers/jobController.js'
import { protect, authorize } from '../middleware/auth.js'

const router = Router()

router.use(protect)

router.get('/', listJobs)
router.get('/:id', getJob)

router.post('/preprocessing', authorize('admin', 'researcher'), startPreprocessing)
router.post('/embedding', authorize('admin', 'researcher'), runEmbedding)
router.post('/reconstruction', authorize('admin', 'researcher'), runReconstruction)
router.post('/validation', authorize('admin', 'researcher'), runValidationJob)

export default router
