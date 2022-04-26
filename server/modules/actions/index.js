import dummy from './services/dummy.js'

export const init = async (app) => {
  console.log('Initialising actions ')
}

export const finalize = async () => {
  console.log('Finalising actions')
}

const actions = {
  dummy,
}

export default actions
