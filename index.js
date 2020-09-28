require('dotenv')
const express = require('express')
const pjson = require('./package.json')
const helmet = require('helmet')
const cors = require('cors')
const { db } = require('./db')
const { userRoute, noteRoute } = require('./routes')

const app = express()
const port = 3000 || process.env.port
const envStat = process.env.NODE_ENV

//middleware
app.use(helmet())
app.use(cors())
app.use(express.json())
app.get('/', async (req, res) => {
  const AppTest = {
    App: `${pjson.name}`,
    Version: `${pjson.version}`
  }
  res.json(AppTest)
})

app.use('/users', userRoute)
app.use('/notes', noteRoute)

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status)
  } else {
    res.status(500)
  }
  res.json({
    code: error.status ? error.status : 500,
    message: error.message,
    data: false
  })
})

//check data
db.then(() => {
  console.log(envStat === 'development' ? 'Connected' : null)
})

app.listen(port, () => {
  console.log(envStat + ' Running at 3000')
})
