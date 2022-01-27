import { Router } from 'express'
import isAuthorized from '../services/isAuthorized.js'

const router = Router()

router.use(isAuthorized)

router.get('/', (req, res) => {
  // we check the token and
  res.status(501).json('Not Implemented')
})

export default router
