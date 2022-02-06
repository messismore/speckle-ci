import createError from 'http-errors'
import { Router } from 'express'
import getBearerToken from '/app/modules/shared/getBearerToken.js'
import isAuthorizedWithSpeckle from '../services/isAuthorizedWithSpeckle.js'
import Workflow from '../services/workflows.js'

const router = Router()

router.use(isAuthorizedWithSpeckle)

router.get('/', (req, res, next) => next(createError(501, 'Not Implemented')))

router.post('/', async (req, res, next) => {
  try {
    const token = getBearerToken(req)

    await Workflow.create({
      token: token,
      streamId: req.body.streamId,
      name: req.body.name,
      // req.query.triggers will either be String or Array<String>
      triggers: [].concat(req.body.triggers),
    })
    res.status(200).json('OK')
  } catch (error) {
    if (!error.status) {
      error.status =
        error.response && error.response.status ? error.response.status : 500
    }

    next(error)
  }
})

router.get('/:workflowId', (req, res, next) => {
  next(Workflow.findByUserId({ token: getBearerToken(req) }))
})

router.patch('/:workflowId', (req, res, next) =>
  next(createError(501, 'Not Implemented'))
)

router.delete('/:workflowId', (req, res, next) =>
  next(createError(501, 'Not Implemented'))
)

export default router
