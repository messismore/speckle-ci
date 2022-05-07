import calculateCarbon from './services/calculateCarbon.js'
import checkoutCommit from './services/checkoutCommit.js'
import dummy from './services/dummy.js'
import webRequest from './services/webRequest.js'

export const init = async (app) => {
  console.log('Initialising actions ')
}

export const finalize = async () => {
  console.log('Finalising actions')
}

const actions = {
  dummy,
  checkoutCommit,
  calculateCarbon,
  webRequest,
}

export default actions
