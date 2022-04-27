import { Router } from 'express'
import Workflow from '/app/modules/workflows/services/workflows.js'

const router = Router()

router.post('/', async (req, res, next) => {
  res.status(200).send()

  try {
    const payload = JSON.parse(req.body.payload)
    const workflow = await Workflow.findOne({
      webhookId: payload.webhook.id,
    }).exec()

    const context = {
      serverUrl: payload.server.canonicalUrl,
      streamId: payload.streamId,
      trigger: { webhook: payload },
      commit: payload.event.data.commit,
    }

    workflow.run(context)
  } catch (error) {
    console.log(error)
  }
})

export default router
