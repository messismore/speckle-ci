import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import connect from './db/mongodb.js'

connect()

const app = express()

app.use(cors())
app.use(express.json())

// Initialise default modules, including rest api handlers
const init = async () =>
  import('./modules/index.js').then(async (modules) => {
    await modules.init(app)
  })

await init(app)

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const error = new Error()
  error.status = 404
  error.message = 'Not found'
  next(error)
})

// handle error
app.use((err, req, res, next) => {
  res.status(err.status || 500)
  // only provide error in development
  res.json(req.app.get('env') === 'development' ? err : {})
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`listening on ${port}`)
})
