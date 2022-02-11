import mongoose from 'mongoose'
export const init = () => {
  mongoose
    .connect(process.env.DB_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .catch((err) => {
      console.error('error: ' + err.stack)
      process.exit(1)
    })
  mongoose.connection.on('open', () => {
    console.log('Connected to database')
  })
}

export default init
