const jwt = require('jsonwebtoken')
const moment = require('moment')
const key = 'private-key'
module.exports = {
  signToken: (id) => {
    return new Promise((resolve, reject) => {
      jwt.sign({ _id: id, createdAt: moment().format() }, key, (err, token) => {
        resolve(token)
        reject(err)
      })
    })
  },
  authToken: (req, res, next) => {
    const headertoken = req.headers.authorization
    const token = headertoken ? headertoken.split(' ')[1] : undefined
    try {
      if (token) {
        jwt.verify(token, key, (err, decode) => {
          if (err) {
            throw new Error(err)
          } else {
            req.payload = decode
            next()
          }
        })
      } else {
        throw new Error('Invalid Signature')
      }
    } catch (error) {
      next(error)
    }
  }
}
