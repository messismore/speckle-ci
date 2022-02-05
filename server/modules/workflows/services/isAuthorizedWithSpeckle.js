import { fetchSpeckleUserId } from '/app/modules/shared/speckleUtils.js'
import getBearerToken from '/app/modules/shared/getBearerToken.js'

const isAuthorizedWithSpeckle = async (req, res, next) => {
  try {
    // make sure it belongs to a user
    const json = await fetchSpeckleUserId(getBearerToken(req))

    // store user in req.locals
    res.locals.authorizedSpeckleUserId = json.data.data.user.id
    return next()
  } catch (error) {
    // if there is no token or Speckle didn't return a user Id we'll get a TypeError
    if (error instanceof TypeError) {
      error.status = 401
    }
    if (!error.status) error.status = 500
    next(error)
  }
}

export default isAuthorizedWithSpeckle
