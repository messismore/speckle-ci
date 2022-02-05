import { Router } from 'express'
import getBearerToken from '/app/modules/shared/getBearerToken.js'
import isAuthorizedWithSpeckle from '../services/isAuthorizedWithSpeckle.js'
import { createWorkflow } from '../services/workflows.js'

const router = Router()

router.use(isAuthorizedWithSpeckle)

router.get('/', (req, res) => {
  console.log('501')
  res.status(501).json('Not Implemented')
})

router.post('/', async (req, res, next) => {
  try {
    const token = getBearerToken(req)

    await createWorkflow({
      token: token,
      streamId: req.query.streamId,
      name: req.query.name,
      url: req.query.url,
      triggers: [...req.query.triggers],
    })
    res.status(200).json('OK')
  } catch (err) {
    res.status(err.status ? err.status : 500)
    next(err)
  }
})

export default router
