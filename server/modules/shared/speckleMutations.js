export const registerWebhookMutation = (streamId, url, triggers) => `mutation {
  webhookCreate(webhook: {
    streamId: ${JSON.stringify(streamId)},
    url: ${JSON.stringify(url)},
    triggers: ${JSON.stringify(triggers)},
  })
}`
