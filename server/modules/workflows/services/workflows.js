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
  url,
  triggers,
}) {
  if (!triggers.every((trigger) => TRIGGERS.includes(trigger))) {
    const error = new Error()
    error.status = 400
    error.message = 'Unknown trigger'
    throw error
  }

  const webhookId = await speckleRegisterWebhook(
    token,
    streamId,
    url,
    `Workflow '${name}'`,
    triggers
  ).then((res) => res.data.data.webhookCreate)

  const workflow = await new this({
    webhookId: webhookId,
    streamId: streamId,
  }).save()

  return workflow
}

export default mongoose.model('Workflow', workflowSchema)
