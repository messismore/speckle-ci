import createError from 'http-errors'
import axios from 'axios'
import { userIdQuery, userStreamIdsQuery } from './speckleQueries.js'
import { registerWebhookMutation } from './speckleMutations.js'

const speckleFetch = async (token, query) => {
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

export const fetchSpeckleUserId = async ({ token }) =>
  speckleFetch(token, userIdQuery())

export const fetchSpeckleUserStreamIds = async ({ token, userId }) =>
  speckleFetch(token, userStreamIdsQuery({ userId: userId })).then((res) => {
    if (!res.data.data.user) throw createError('404', 'User not found')
    return res.data.data.user.streams.items.map((stream) => stream.id)
  })

export const registerSpeckleWebhook = async ({
  token,
  streamId,
  url,
  description,
  triggers,
  secret,
  enabled = true,
}) =>
  speckleFetch(
    token,
    registerWebhookMutation(
      streamId,
      url,
      description,
      triggers,
      secret,
      enabled
    )
  )
