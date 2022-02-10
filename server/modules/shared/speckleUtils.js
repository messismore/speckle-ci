import createError from 'http-errors'
import axios from 'axios'
import {
  webhookTriggersQuery,
  userIdQuery,
  userStreamIdsQuery,
} from './speckleQueries.js'
import { registerWebhookMutation } from './speckleMutations.js'

const speckleFetch = async (token, query) => {
  if (!token) throw createError(403, 'Missing auth token')
  const response = await axios.post(
    `${process.env.SPECKLE_SERVER_URL}/graphql`,
    JSON.stringify({
      query: query,
    }),
    {
      headers: {
        Authorization: 'Bearer ' + token,
        'Content-Type': 'application/json',
      },
    }
  )

  return response
}

// Returns the user ID associated with a token
export const fetchSpeckleUserId = async ({ token }) =>
  speckleFetch(token, userIdQuery())

// Returns all stream IDs associated with a user
export const fetchSpeckleUserStreamIds = async ({ token, userId }) =>
  speckleFetch(token, userStreamIdsQuery({ userId: userId })).then((res) => {
    if (!res.data.data.user) throw createError('404', 'User not found')
    return res.data.data.user.streams.items.map((stream) => stream.id)
  })

// Returns webhook's triggers
export const fetchSpeckleWebhookTriggers = async ({
  token,
  streamId,
  webhookId,
}) =>
  speckleFetch(token, webhookTriggersQuery({ streamId, webhookId })).then(
    (res) => {
      if (!res.data.data.stream) throw createError('404', 'Stream not found')
      if (!res.data.data.stream.webhooks.items[0])
        throw createError('404', 'Webhook not found')

      return res.data.data.stream.webhooks.items.flatMap(
        (webhook) => webhook.triggers
      )
    }
  )

export const registerSpeckleWebhook = async ({
  token,
  streamId,
  url,
  description,
  triggers,
  secret = '',
  enabled = true,
}) =>
  speckleFetch(
    token,
    registerWebhookMutation({
      streamId,
      url,
      description,
      triggers,
      secret,
      enabled,
    })
  )
