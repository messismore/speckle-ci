import { Router } from 'express'
import actions from '../index.js'

const router = Router()

router.get('/', async (req, res, next) => {
  try {
    res.send(Object.entries(actions).map(([k, v]) => ({ action: k, ...v })))
  } catch (error) {
    next(error)
  }
})

export default router
