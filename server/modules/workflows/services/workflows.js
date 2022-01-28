import { speckleRegisterWebhook } from '/app/modules/shared/speckleUtils.js'

export const createWorkflow = async (token, name, streamId, triggers) => {
  const res = await speckleRegisterWebhook(token, name, streamId, triggers)
}
