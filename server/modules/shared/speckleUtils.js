import axios from 'axios'
import { userIdQuery } from './speckleQueries.js'
import { registerWebhookMutation } from './speckleMutations.js'

const speckleFetch = async (token, query) => {
  const request = await axios.post(
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

  return request
}

export const fetchSpeckleUserId = async (token) =>
  speckleFetch(token, userIdQuery())

export const speckleRegisterWebhook = async (
  token,
  streamId,
  url,
  description = '',
  triggers,
  secret = '',
  enabled = true
) =>
  speckleFetch(
    token,
    registerWebhookMutation(streamId, url, description, triggers)
  )
