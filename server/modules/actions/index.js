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
  createCommit: {
    name: 'Create Commit',
    description: 'Commit data to a Speckle Branch.',
    icon: 'mdi-timeline-check-outline',
    options: [
      {
        type: 'SELECT',
        id: 'stream',
        label: 'Stream',
        choices: '$streams',
      },
      {
        type: 'SELECT',
        id: 'branch',
        label: 'Branch',
        choices: '$branches',
      },
    ],
  },
}

export default actions
