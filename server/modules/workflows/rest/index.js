import { Router } from 'express'
import getBearerToken from '/app/modules/shared/getBearerToken.js'
import isAuthorizedWithSpeckle from '../services/isAuthorizedWithSpeckle.js'
import Workflow from '../services/workflows.js'

const router = Router()

router.use(isAuthorizedWithSpeckle)

router.get('/', (req, res) => {
  console.log('501')
  res.status(501).json('Not Implemented')
})

router.post('/', async (req, res, next) => {
  try {
    const token = getBearerToken(req)

    await Workflow.create({
      token: token,
      streamId: req.query.streamId,
      name: req.query.name,
      url: req.query.url,
      // req.query.triggers will either be String or Array<String>
      triggers: [].concat(req.query.triggers),
    })
    res.status(200).json('OK')
  } catch (error) {
    console.log(error)
    error.status = error.response.status ? error.response.status : 500
    next(error)
  }
})

export default router
