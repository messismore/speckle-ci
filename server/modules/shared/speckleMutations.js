import gql from 'graphql-tag'

export const CreateWebhook = gql`
  mutation CreateWebhook(
    $streamId: String!
    $url: String!
    $description: String
    $triggers: [String]!
    $secret: String
    $enabled: Boolean
  ) {
    webhookCreate(
      webhook: {
        streamId: $streamId
        url: $url
        description: $description
        triggers: $triggers
        secret: $secret
        enabled: $enabled
      }
    )
  }
`
export const UpdateWebhook = gql`
  mutation UpdateWebhook(
    $streamId: String!
    $webhookId: String!
    $triggers: [String]!
  ) {
    webhookUpdate(
      webhook: { streamId: $streamId, id: $webhookId, triggers: $triggers }
    )
  }
`
