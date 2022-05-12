import routes from './rest/index.js'
/* Actions */
import calculateCarbon from './services/calculateCarbon.js'
import checkoutCommit from './services/checkoutCommit.js'
import checkSetback from './services/checkSetback.js'
import dummy from './services/dummy.js'
import getValue from './services/getValue.js'
import webRequest from './services/webRequest.js'

export const init = async (app) => {
  console.log('Initialising actions ')
  app.use('/actions/', routes)
}

export const finalize = async () => {
  console.log('Finalising actions')
}

const actions = {
  calculateCarbon,
  checkoutCommit,
  checkSetback,
  dummy,
  getValue,
  webRequest,
}

export default actions
