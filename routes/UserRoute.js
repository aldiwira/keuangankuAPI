const express = require('express')

const queryMDB = require('../helper/queryMDB')
const { sign, auth } = require('../helper/encrypt')
const response = require('../helper/responses')
const router = express.Router()
const clist = queryMDB.cList

router.post('/register', async (req, res, next) => {
  let { username, email, password } = req.body
  let cryptPass = await sign(password)
  try {
    const userData = await queryMDB.find(clist.users, {
      $or: [{ username: username }, { email: email }]
    })
    if (userData) {
      throw new Error('User was available')
    } else {
      await queryMDB
        .insert(clist.users, { username, email, cryptPass })
        .then((datas) => {
          res
            .status(201)
            .json(response.set(201, 'Success create new user', datas))
        })
    }
  } catch (error) {
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  let { username, email, password } = req.body
  try {
    const userData = await queryMDB.find(clist.users, {
      $or: [{ username: username }, { email: email }]
    })
    if (userData) {
      const authPass = await auth(password, userData.cryptPass)
      if (authPass) {
        res
          .status(200)
          .json(response.set(200, 'Success logged account', userData))
      } else {
        throw new Error('Wrong password')
      }
    } else {
      throw new Error('Wrong username or email and password')
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
