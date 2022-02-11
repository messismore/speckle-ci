import createError from 'http-errors'
import mongoose from 'mongoose'
import {
  fetchSpeckleWebhookTriggers,
  fetchSpeckleUserStreamIds,
  registerSpeckleWebhook,
  setSpeckleWebhookTriggers,
} from '/app/modules/shared/speckleUtils.js'
import areValidSpeckleTriggers from './areValidSpeckleWebhookTriggers.js'

const recipes = {
  logRun: function (context) {
    console.log('Running workflow! ', context)
  },
}

const workflowSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: String,
  webhookId: { type: String, required: true },
  streamId: { type: String, required: true },
  speckleAuthToken: { type: String, required: true },
  recipe: { type: String, default: 'logRun' },
  createdAt: { type: Date, default: Date.now() },
  updatedAt: Date,
})

workflowSchema.statics.findByUserId = async function ({ token, userId }) {
  return this.find({
    streamId: await fetchSpeckleUserStreamIds({ token: token, userId: userId }),
  })
    .select('-__v') // don't return version key https://mongoosejs.com/docs/guide.html#versionKey
    .exec()
}

// Create Workflow
workflowSchema.statics.create = async function ({
  token,
  streamId,
  name,
  triggers,
  recipe,
}) {
  if (!areValidSpeckleTriggers(triggers))
    throw createError(400, 'Unknown trigger')

  const port = await import('/app/server.js').then(
    (module) => module.default.address().port
  )

  const webhookId = await registerSpeckleWebhook({
    token,
    streamId,
    url: `https://${process.env.APP_SERVER_URL}:${port}/webhooks`,
    description: `Workflow ${name}`,
    triggers,
  }).then((res) => res.data.data.webhookCreate)

  const workflow = await new this({
    name,
    webhookId,
    streamId,
    speckleAuthToken: token,
    recipe,
  }).save()

  return workflow
}

// We don't store triggers, since they can be changed over at Speckle
workflowSchema.methods.fetchTriggers = async function ({ token }) {
  return fetchSpeckleWebhookTriggers({
    token,
    streamId: this.streamId,
    webhookId: this.webhookId,
  })
}

workflowSchema.methods.setTriggers = async function ({ token, triggers }) {
  if (!areValidSpeckleTriggers(triggers))
    throw createError(400, 'Unknown trigger')

  return setSpeckleWebhookTriggers({
    token,
    streamId: this.streamId,
    webhookId: this.webhookId,
    triggers,
  })
}

// Update Workflow
workflowSchema.methods.update = async function ({
  token,
  name,
  description,
  webhookId,
  streamId,
  triggers,
  recipe,
}) {
  console.log(token, name, description, webhookId, streamId, triggers, recipe)
  throw new Error('Not implemented yet')
}

// Delete Workflow
workflowSchema.methods.delete = async function ({ token }) {
  console.log(token)
  throw new Error('Not implemented yet')
}

// Run Workflow
workflowSchema.methods.run = async function () {
  if (!this.recipe)
    throw new Error(`Workflow ${this.name} has no configured actions.`)

  recipes[this.recipe](this)
}

export default mongoose.model('Workflow', workflowSchema)
