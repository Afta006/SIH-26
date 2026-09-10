import { Router } from 'express'
import authRoutes from './authRoutes.js'
import datasetRoutes from './datasetRoutes.js'
import jobRoutes from './jobRoutes.js'
import reconstructionRoutes from './reconstructionRoutes.js'
import argoRoutes from './argoRoutes.js'
import validationRoutes from './validationRoutes.js'
import publicRoutes from './publicRoutes.js'

const router = Router()

router.get('/health', (req, res) => res.json({ success: true, status: 'ok', time: new Date().toISOString() }))

router.use('/', publicRoutes)

router.use('/auth', authRoutes)
router.use('/datasets', datasetRoutes)
router.use('/jobs', jobRoutes)
router.use('/reconstructions', reconstructionRoutes)
router.use('/argo', argoRoutes)
router.use('/validations', validationRoutes)

export default router