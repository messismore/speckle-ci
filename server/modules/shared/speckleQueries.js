import gql from 'graphql-tag'

export const BranchLastCommitMessage = gql`
  query BranchNames($streamId: String!, $branchName: String!) {
    stream(id: $streamId) {
      branch(name: $branchName) {
        commits(limit: 1) {
          items {
            message
          }
        }
      }
    }
  }
`

export const UserId = gql`
  query UserId {
    user {
      id
    }
  }
`

export const UserStreamIds = gql`
  query UserStreamIds {
    streams(limit: 50) {
      items {
        id
      }
    }
  }
`

export const WebhookTriggers = `query WebhookTriggers($streamId: String!,
$webhookId: String!) {
  stream(id: $streamId) {
    webhooks(id: $webhookId) {
      items {
        triggers
      }
    }
  }
}`
