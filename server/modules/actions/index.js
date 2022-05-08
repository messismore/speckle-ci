import calculateCarbon from './services/calculateCarbon.js'
import checkoutCommit from './services/checkoutCommit.js'
import checkSetback from './services/checkSetback.js'
import dummy from './services/dummy.js'
import webRequest from './services/webRequest.js'

export const init = async (app) => {
  console.log('Initialising actions ')
}

export const finalize = async () => {
  console.log('Finalising actions')
}

const actions = {
  calculateCarbon,
  checkoutCommit,
  checkSetback,
  dummy,
  webRequest,
}

export default actions
