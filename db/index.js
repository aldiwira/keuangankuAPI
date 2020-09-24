const env = process.env.NODE_ENV
const cdb = require('./config.db.json')[env]
const monk = require('monk')

const db = monk(cdb.url + cdb.database)

const getCollection = (collection) => {
  return db.get(collection)
}

module.exports = { db, getCollection }
