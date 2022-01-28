import { Router } from 'express'
import isAuthorizedWithSpeckle from '../services/isAuthorizedWithSpeckle.js'
import { createWorkflow } from '../services/workflows.js'

const router = Router()

router.use(isAuthorizedWithSpeckle)

router.get('/', (req, res) => {
  res.status(501).json('Not Implemented')
})

router.post('/', (req, res) => {
  try {
    const token = req.headers.authorization.trim().split(' ')[1]

    createWorkflow(token, req.query.streamId, req.query.url, [
      ...req.query.triggers,
    ])
    res.status(200).json('OK')
  } catch (err) {
    console.log(err)
    res.status(500).json('Internal Server Error')
  }
})

export default router
