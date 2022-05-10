import actions from '/app/modules/actions/index.js'
import mongoose from 'mongoose'
import { resolveInputs, resolveOptions } from './resolve.js'

const workflowRunSchema = new mongoose.Schema({
  runId: String,
  workflow: { type: mongoose.Types.ObjectId, ref: 'Workflow', required: true },
  createdAt: { type: Date, default: Date.now() },
  triggerEvent: {
    eventName: String,
    commit: {
      id: String,
      streamId: String,
      message: String,
      branchName: String,
    },
  },
  finishedAt: Date,
  status: {
    type: String,
    enum: ['pending', 'success', 'error'],
    default: 'pending',
  },
  report: { type: String },
})

// Run the Workflow
const runWorkflow = async ({ workflowRun, context }) => {
  let status
  workflowRun.results = {}

  try {
    // get the associated workflow
    await workflowRun.populate('workflow')
    workflowRun.context = context

    // perform each action in the recipe
    console.log('workflowRun: ', workflowRun)
    for (const step of workflowRun.workflow.recipe) {
      workflowRun.results = {
        ...workflowRun.results,
        [step.id]: await actions[step.action].run.bind(workflowRun)({
          inputs: {
            ...resolveOptions((step.options ??= []), workflowRun),
            ...resolveInputs((step.inputs ??= []), workflowRun),
          },
          context,
        }),
      }
    }
    status = 'success'
  } catch (error) {
    console.log(error)

    status = 'error'
  }

  console.log('RESULTS: ', await workflowRun.results)

  // We currently support only one report per workflow, so we get the last result that generated one and use that.
  const report = Object.values(workflowRun.results).reduce(
    (previous, current) => (current.report ||= previous),
    undefined
  )

  // Update the run with the result
  workflowRun.conclude({ status, report })
}

// Kick off a new workflow run
workflowRunSchema.statics.create = async function ({ workflow, context }) {
  const workflowRun = await this({
    workflow: workflow._id,
    triggerEvent: {
      eventName: context.trigger?.webhook?.event?.event_name,
      commit: context.commit,
    },
  })
  workflowRun.save((error) => {
    console.log(error)
    runWorkflow({ workflowRun, context })
  })
}

// Update the workflowRun with the results
workflowRunSchema.methods.conclude = async function ({ status, report }) {
  this.status = status
  this.report = report
  this.finishedAt = Date.now()
  this.save()
}

export default mongoose.model('WorkflowRun', workflowRunSchema)
