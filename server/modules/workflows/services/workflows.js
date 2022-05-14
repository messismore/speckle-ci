import createError from 'http-errors'
import mongoose from 'mongoose'
import {
  fetchSpeckleWebhookTriggers,
  fetchSpeckleUserStreamIds,
  registerSpeckleWebhook,
  setSpeckleWebhookTriggers,
} from '/app/modules/shared/speckleUtils.js'
import areValidSpeckleTriggers from './areValidSpeckleWebhookTriggers.js'
import meetsRunConditions from './meetsRunConditions.js'
import WorkflowRun from './workflowRuns.js'

const stepSchema = new mongoose.Schema({
  instanceId: { type: String, required: true },
  action: { type: String, required: true },
  inputs: { type: Map, of: [String] },
  options: { type: Map, of: String },
})

const workflowSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    webhookId: { type: String, required: true },
    streamId: { type: String, required: true },
    speckleAuthToken: { type: String },
    conditions: { branches: { type: [String] }, apps: { type: [String] } },
    recipe: {
      type: [stepSchema],
    },
    createdAt: { type: Date, default: Date.now() },
    updatedAt: Date,
  },
  { toJSON: { virtuals: true } },
  { toObject: { virtuals: true } }
)

workflowSchema.virtual('runs', {
  ref: 'WorkflowRun',
  localField: '_id',
  foreignField: 'workflow',
})

workflowSchema.virtual('lastRun', {
  ref: 'WorkflowRun',
  localField: '_id',
  foreignField: 'workflow',
  justOne: true,
  options: { sort: { createdAt: -1 }, limit: 1 },
})

workflowSchema.statics.findByUserId = async function ({ token, userId }) {
  return this.find({
    streamId: await fetchSpeckleUserStreamIds({ token: token, userId: userId }),
  })
    .select(['-recipe', '-speckleAuthToken', '-__v']) // don't return version key https://mongoosejs.com/docs/guide.html#versionKey
    .populate('lastRun', ['createdAt', 'finishedAt', 'status', 'triggerEvent'])
    .exec()
}

// Create Workflow
workflowSchema.statics.create = async function ({
  token,
  streamId,
  name,
  triggers,
  conditions,
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
  })

  return new this({
    name,
    webhookId,
    streamId,
    speckleAuthToken: token,
    conditions,
    recipe,
  }).save()
}

// We don't store triggers since they can be changed over at Speckle
workflowSchema.methods.fetchTriggers = async function ({ token }) {
  return fetchSpeckleWebhookTriggers({
    token,
    streamId: this.streamId,
    webhookId: this.webhookId,
  })
}

workflowSchema.methods.setTriggers = async function ({ token, triggers }) {
  if (!areValidSpeckleTriggers(triggers))
    throw createError(400, 'Illegal trigger')

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
  conditions,
  recipe,
}) {
  console.log(
    token,
    name,
    description,
    webhookId,
    streamId,
    triggers,
    conditions,
    recipe
  )
  throw new Error('Not implemented yet')
}

// Delete Workflow
workflowSchema.methods.delete = async function ({ token }) {
  console.log(token)
  throw new Error('Not implemented yet')
}

// Run Workflow
workflowSchema.methods.run = async function (context) {
  if (!this.recipe)
    throw new Error(`Workflow ${this.name} has no configured actions.`)

  // Branch names that start with 🤖 are created by Speckle Actions and thus ignored as triggers
  if (/^🤖/u.test(context.commit.branchName)) {
    console.log(
      `${context.commit.branchName} belongs to Speckle Actions, ignored.`
    )
    return
  }

  if (!meetsRunConditions({ context, conditions: this.conditions })) {
    console.log(`Workflow does not meet conditions: ${this.conditions}`)
    return
  }

  context.token = this.speckleAuthToken

  return WorkflowRun.create({ workflow: this, context })
}

export default mongoose.model('Workflow', workflowSchema)
