import {
  userInfoQuery,
  streamListAllQuery,
  streamSearchQuery,
} from '@/speckleQueries'

export const APP_NAME = process.env.VUE_APP_SPECKLE_APP_NAME
export const SERVER_URL = process.env.VUE_APP_SPECKLE_SERVER_URL
export const TOKEN = `${APP_NAME}.AuthToken`
export const REFRESH_TOKEN = `${APP_NAME}.RefreshToken`
export const CHALLENGE = `${APP_NAME}.Challenge`

// Redirects to the Speckle server authentication page, using a randomly generated challenge. Challenge will be stored to compare with when exchanging the access code.
export const goToSpeckleAuthPage = () => {
  // Generate random challenge
  const challenge =
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)

  // Save challenge to localStorage
  localStorage.setItem(CHALLENGE, challenge)
  // Send user to auth page
  window.location = `${process.env.VUE_APP_SPECKLE_SERVER_URL}/authn/verify/${process.env.VUE_APP_SPECKLE_APP_ID}/${challenge}`
}

// Log out the current user. This removes the token/refreshToken pair.
export const speckleLogOut = () => {
  // Remove both token and refreshToken from localStorage
  localStorage.removeItem(TOKEN)
  localStorage.removeItem(REFRESH_TOKEN)
}

// Exchanges the provided access code with a token/refreshToken pair, and saves them to local storage.
export const exchangeAccessCode = async (accessCode) => {
  const res = await fetch(`${SERVER_URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      accessCode: accessCode,
      appId: process.env.VUE_APP_SPECKLE_APP_ID,
      appSecret: process.env.VUE_APP_SPECKLE_APP_SECRET,
      challenge: localStorage.getItem(CHALLENGE),
    }),
  })

  const data = await res.json()

  if (data.token) {
    // If retrieving the token was successful, remove challenge and set the new token and refresh token
    localStorage.removeItem(CHALLENGE)
    localStorage.setItem(TOKEN, data.token)
    localStorage.setItem(REFRESH_TOKEN, data.refreshToken)
  }
  return data
}

export const speckleFetch = async (query) => {
  const token = localStorage.getItem(TOKEN)
  if (token)
    try {
      const res = await fetch(`${SERVER_URL}/graphql`, {
        method: 'POST',
        headers: {
          Authorization: 'Bearer ' + token,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: query,
        }),
      })
      return await res.json()
    } catch (err) {
      console.error('API call failed', err)
    }
  else return Promise.reject('Not logged in.')
}

export const getUserData = () => speckleFetch(userInfoQuery())

export const searchStreams = (query) => speckleFetch(streamSearchQuery(query))

export const listAllStreams = () =>
  speckleFetch(streamListAllQuery()).then(
    (response) => response.data.streams.items
  )
