import createError from 'http-errors'
import mongoose from 'mongoose'
import { speckleRegisterWebhook } from '/app/modules/shared/speckleUtils.js'

const TRIGGERS = [
  'branch_create',
  'branch_delete',
  'branch_update',
  'commit_create',
  'commit_delete',
  'commit_update',
  'stream_delete',
  'stream_update',
  'commit_receive',
  'stream_permissions_add',
  'stream_permissions_remove',
]

const workflowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  webhookId: { type: String, required: true },
  streamId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: Date,
})

// Create Workflow
workflowSchema.statics.create = async function ({
  token,
  streamId,
  name,
  triggers,
}) {
  if (!triggers.every((trigger) => TRIGGERS.includes(trigger)))
    throw createError(400, 'Unknown trigger')

  const port = await import('/app/server.js').then(
    (module) => module.default.address().port
  )

  const webhookId = await speckleRegisterWebhook({
    token: token,
    streamId: streamId,
    url: `https://${process.env.APP_SERVER_URL}:${port}/webhooks`,
    description: `Workflow ${name}`,
    triggers: triggers,
  }).then((res) => res.data.data.webhookCreate)

  const workflow = await new this({
    name: name,
    webhookId: webhookId,
    streamId: streamId,
  }).save()

  return workflow
}

export default mongoose.model('Workflow', workflowSchema)
