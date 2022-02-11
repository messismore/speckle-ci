import routes from './rest/index.js'

export const init = async (app) => {
  console.log('Initialising workflows ')
  app.use('/workflows/', routes)
}
export const finalize = async () => {
  console.log('Finalising workflows')
}
