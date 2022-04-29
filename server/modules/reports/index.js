import routes from './views/reports.js'
export const init = async (app) => {
  console.log('Initialising reports ')
  app.use('/reports/', routes)
}
export const finalize = async () => {
  console.log('Finalising reports')
}
