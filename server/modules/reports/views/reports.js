import { Router } from 'express'
import WorkflowRun from '/app/modules/workflows/services/workflowRuns.js'

const router = Router()

router.get('/:workflowRunId', async (req, res, next) => {
  try {
    const report = WorkflowRun.findById(req.params.workflowRunId, 'report')
      .exec()
      .then((doc) => doc.report)
    res.send(await report)
  } catch (error) {
    next(error)
  }
})

export default router
