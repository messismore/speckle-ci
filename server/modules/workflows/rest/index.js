import createError from 'http-errors'
import { Router } from 'express'
import getBearerToken from '/app/modules/shared/getBearerToken.js'
import isAuthorizedWithSpeckle from '../services/isAuthorizedWithSpeckle.js'
import Workflow from '../services/workflows.js'
import setResponseErrorCode from './setResponseErrorCode.js'

const router = Router()

router.use(isAuthorizedWithSpeckle)

router.get('/', async (req, res, next) => {
  try {
    const workflows = await Workflow.findByUserId({
      token: getBearerToken(req),
      userId: req.query.userId,
    })
    res.json(workflows)
  } catch (error) {
    setResponseErrorCode(error)
    next(error)
  }
})

router.post('/', async (req, res, next) => {
  try {
    await Workflow.create({
      token: getBearerToken(req),
      streamId: req.body.streamId,
      name: req.body.name,
      triggers: req.body.triggers,
    })
    res.status(200).json('OK')
  } catch (error) {
    setResponseErrorCode(error)
    next(error)
  }
})

router.get('/:workflowId', async (req, res, next) => {
  try {
    const workflow = await Workflow.findOne({
      _id: req.params.workflowId,
    })
      .select('-__v') // don't return version key https://mongoosejs.com/docs/guide.html#versionKey
      .exec()

    const triggers = await workflow.fetchTriggers({
      token: getBearerToken(req),
    })

    res.json({ ...workflow.toJSON(), triggers })
  } catch (error) {
    setResponseErrorCode(error)
    next(error)
  }
})

router.patch('/:workflowId', (req, res, next) =>
  next(createError(501, 'Not Implemented'))
)

router.delete('/:workflowId', (req, res, next) =>
  next(createError(501, 'Not Implemented'))
)

export default router
