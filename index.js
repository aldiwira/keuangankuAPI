const Express = require('express')
const pjson = require('./package.json')

const App = Express()
const port = 3000 || process.env.port

App.get('/', async (req, res) => {
  const AppTest = {
    App: `${pjson.name}`,
    Version: `${pjson.version}`,
  }
  res.json(AppTest)
})

App.listen(port, () => {
  console.log('Running at 3000')
})
