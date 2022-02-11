import { Router } from 'express'
import isAuthorizedWithSpeckle from '../services/isAuthorizedWithSpeckle.js'

const router = Router()

router.use(isAuthorizedWithSpeckle)

router.get('/', (req, res) => {
  res.status(501).json('Not Implemented')
})

export default router
