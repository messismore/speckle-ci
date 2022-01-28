import { fetchSpeckleUserId } from '/app/modules/shared/speckleUtils.js'

const isAuthorizedWithSpeckle = async (req, res, next) => {
  // clear our special header
  req.headers['authorized-speckle-user-id'] = ''
  // check if there is a token
  if (req.body.token) {
    // make sure it belongs to a user
    try {
      const json = await fetchSpeckleUserId(req.body.token)
      if (json.data.errors) {
        return res.status(401).send('Unauthorized')
      }

      if (json.data.data.user.id) {
        // add the user to the request header
        req.headers['authorized-speckle-user-id'] = json.data.data.user.id

        //console.log(json.data.data.user.id)
        return next()
      }
    } catch (err) {
      console.error(err)
      return res.status(500).send('Internal Server Error')
    }
  }

  // else deny request
  return res.status(400).send('Bad Request')
}

export default isAuthorizedWithSpeckle
