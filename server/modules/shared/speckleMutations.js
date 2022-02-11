export const registerWebhookMutation = ({
  streamId,
  url,
  description,
  triggers,
  secret = '',
  enabled = true,
}) => `mutation {
  webhookCreate(webhook: {
    streamId: ${JSON.stringify(streamId)},
    url: ${JSON.stringify(url)},
    description: ${JSON.stringify(description)},
    triggers: ${JSON.stringify(triggers)},
    secret: ${JSON.stringify(secret)},
    enabled: ${JSON.stringify(enabled)},
  })
}`

export const setWebhookTriggers = ({
  streamId,
  webhookId,
  triggers,
}) => `mutation {
  webhookUpdate(
    webhook: {
      streamId: ${JSON.stringify(streamId)},
      id: ${JSON.stringify(webhookId)},
      triggers: ${JSON.stringify(triggers)}}
  )
}`
