import routes from './rest/index.js'
export const init = async (app) => {
  console.log('Initialising webhooks ')
  app.use('/webhooks/', routes)
}
export const finalize = async () => {
  console.log('Finalising webhooks')
}
