const express = require('express')

const queryMDB = require('../helper/queryMDB')
const { sign } = require('../helper/encrypt')
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

module.exports = router
