const express = require('express')
const moment = require('moment')

const queryMDB = require('../helper/queryMDB')
const jwt = require('../helper/jwt')
const encrypt = require('../helper/encrypt')
const response = require('../helper/responses')
const router = express.Router()
const clist = queryMDB.cList

router.post('/register', async (req, res, next) => {
  const { username, email, password } = req.body
  const cryptPass = await encrypt.sign(password)
  try {
    const userData = await queryMDB.find(clist.users, {
      $or: [{ username: username }, { email: email }]
    })
    if (userData) {
      throw new Error('User was available')
    } else {
      const tokenJWT = await jwt.signToken(userData._id)
      await queryMDB
        .insert(clist.users, {
          username,
          email,
          cryptPass,
          createdAt: moment().format(),
          updateAt: moment().format()
        })
        .then((datas) => {
          res.status(201).json(
            response.set(201, 'Success create new user', {
              userDatas: userData,
              jwtToken: tokenJWT
            })
          )
        })
    }
  } catch (error) {
    next(error)
  }
})

router.post('/login', async (req, res, next) => {
  const { username, email, password } = req.body
  try {
    const userData = await queryMDB.edit(
      clist.users,
      {
        $or: [{ username: username }, { email: email }]
      },
      { $set: { updateAt: moment().format() } }
    )
    if (userData) {
      const authPass = await encrypt.auth(password, userData.cryptPass)
      if (authPass) {
        const tokenJWT = await jwt.signToken(userData._id)
        res.status(200).json(
          response.set(200, 'Success logged account', {
            userDatas: userData,
            jwtToken: tokenJWT
          })
        )
      } else {
        throw new Error('Wrong password account')
      }
    } else {
      throw new Error('Wrong username or email and password account')
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
