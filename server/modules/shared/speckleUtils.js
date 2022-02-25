import createError from 'http-errors'
import { GraphQLClient } from 'graphql-request'
import { UserId, UserStreamIds, WebhookTriggers } from './speckleQueries.js'
import { CreateWebhook, UpdateWebhook } from './speckleMutations.js'

const endpoint = `${process.env.SPECKLE_SERVER_URL}/graphql`

const graphQLClient = new GraphQLClient(endpoint)

const speckleFetch = async ({ token, query, variables = null }) => {
  if (!token) throw createError(403, 'Missing auth token')

  try {
    const data = await graphQLClient.request(query, variables, {
      Authorization: 'Bearer ' + token,
    })

    return data
  } catch (error) {
    // Handle 403
    if (
      error.response?.errors?.some(
        (error) => error.extensions.code === 'FORBIDDEN'
      )
    ) {
      error.status = 403
      error.message = 'No permission to access resource.'
    }
    // Handle 404
    if (
      error.response?.errors?.some((error) =>
        error.message.includes('not found')
      )
    ) {
      error.status = 404
      error.message = 'Resource not found'
    }
    // Handle 400
    if (
      error.response?.errors.some((error) =>
        error.message.includes('Cannot read properties of undefined')
      )
    ) {
      error.status = 400
      error.message = 'Bad request'
    }

    throw error
  }
}

// Returns the user ID associated with a token
export const fetchSpeckleUserId = async ({ token }) => {
  const data = await speckleFetch({ token, query: UserId })
  return data.user.id
}

// Returns all stream IDs associated with a user
export const fetchSpeckleUserStreamIds = async ({ token }) => {
  const data = await speckleFetch({
    token,
    query: UserStreamIds,
  })

  if (!data.streams?.items) {
    return []
  }

  return data.streams.items.map((stream) => stream.id)
}

// Returns webhook's triggers
export const fetchSpeckleWebhookTriggers = async ({
  token,
  streamId,
  webhookId,
}) => {
  const data = await speckleFetch({
    token,
    query: WebhookTriggers,
    variables: { streamId, webhookId },
  })

  // @TODO: We should probably make sure the webhook actually exists. At this time we're simply returning an empty array which is misleading

  return data.stream.webhooks.items.flatMap((webhook) => webhook.triggers)
}

export const registerSpeckleWebhook = async ({
  token,
  streamId,
  url,
  description,
  triggers,
  secret = '',
  enabled = true,
}) => {
  const data = await speckleFetch({
    token,
    query: CreateWebhook,
    variables: { streamId, url, description, triggers, secret, enabled },
  })
  return data.webhookCreate
}

// Sets webhook's triggers
export const setSpeckleWebhookTriggers = async ({
  token,
  streamId,
  webhookId,
  triggers,
}) => {
  const data = await speckleFetch({
    token,
    query: UpdateWebhook,
    variables: { streamId, webhookId, triggers },
  })

  if (!data?.webhookUpdate)
    throw new Error('Failed to set Speckle webhook triggers')

  return data.webhookUpdate
}
