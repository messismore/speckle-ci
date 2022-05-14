import createError from 'http-errors'
import { Router } from 'express'
import getBearerToken from '/app/modules/shared/getBearerToken.js'
import isAuthorizedWithSpeckle from '../services/isAuthorizedWithSpeckle.js'
import Workflow from '../services/workflows.js'
import WorkflowRuns from '../services/workflowRuns.js'
import setResponseErrorCode from './setResponseErrorCode.js'
import actions from '/app/modules/actions/index.js'

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
      ...req.body,
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

    // ugly hack, for now…
    res.json({
      ...workflow.toJSON(),
      recipe: workflow.toJSON().recipe.map((step) => ({
        name: actions[step.action].name,
        icon: actions[step.action].icon,
        ...step,
      })),
      triggers,
    })
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

router.get('/:workflowId/runs', async (req, res, next) => {
  try {
    const runs = await WorkflowRuns.find({
      workflow: req.params.workflowId,
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .exec()
    res.json(runs)
  } catch (error) {
    setResponseErrorCode(error)
    next(error)
  }
})

export default router
