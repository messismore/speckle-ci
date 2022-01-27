import axios from 'axios'
import { userIdQuery } from './speckleQueries.js'

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
    console.error('API call to Speckle failed', err)
  }
}

export const fetchSpeckleUserId = async (token) =>
  speckleFetch(token, userIdQuery())
