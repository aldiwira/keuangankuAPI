require('dotenv')
const Express = require('express')
const pjson = require('./package.json')
const { db } = require('./db')

const App = Express()
const port = 3000 || process.env.port
const envStat = process.env.NODE_ENV

App.get('/', async (req, res) => {
  const AppTest = {
    App: `${pjson.name}`,
    Version: `${pjson.version}`
  }
  res.json(AppTest)
})

db.then(() => {
  console.log(envStat === 'development' ? 'Connected' : null)
})

App.listen(port, () => {
  console.log(envStat + ' Running at 3000')
})
