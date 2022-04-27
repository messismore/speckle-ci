import checkoutCommit from './services/checkoutCommit.js'
import dummy from './services/dummy.js'

export const init = async (app) => {
  console.log('Initialising actions ')
}

export const finalize = async () => {
  console.log('Finalising actions')
}

const actions = {
  dummy,
  checkoutCommit,
}

export default actions
