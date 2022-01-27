import 'dotenv/config'
import express from 'express'
import cors from 'cors'

const app = express()

app.use(cors())
app.use(express.json())

// Initialise default modules, including rest api handlers
// const init = async () => import('./modules/index.js')
// init(app)

const init = async () =>
  import('./modules/index.js').then((modules) => {
    modules.init(app)
  })

init(app)

app.get('/', (req, res) => {
  res.json({
    message: 'Hello World…',
  })
})

const port = process.env.PORT || 4000
app.listen(port, () => {
  console.log(`listening on ${port}`)
})
