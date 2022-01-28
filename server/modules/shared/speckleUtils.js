import axios from 'axios'
import { userIdQuery } from './speckleQueries.js'
import { registerWebhookMutation } from './speckleMutations.js'

const speckleFetch = async (token, query) => {
  try {
    return await axios.post(
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
  } catch (err) {
    console.error('API call to Speckle failed', err.response.data)
  }
}

export const fetchSpeckleUserId = async (token) =>
  speckleFetch(token, userIdQuery())

export const speckleRegisterWebhook = async (token, streamId, url, triggers) =>
  speckleFetch(token, registerWebhookMutation(streamId, url, triggers))
