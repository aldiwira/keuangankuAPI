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
          password: cryptPass,
          createdAt: moment().format(),
          updatedAt: moment().format()
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
      { $set: { updatedAt: moment().format() } }
    )
    if (userData) {
      const authPass = await encrypt.auth(password, userData.password)
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

router.put('/edit', jwt.authToken, async (req, res, next) => {
  const { username, email } = req.body
  const { _id } = req.payload
  try {
    const filter = {
      _id: _id
    }
    const update = {
      $set: { username, email, updateAt: moment().format() }
    }
    await queryMDB.edit(clist.users, filter, update).then((datas) => {
      if (datas) {
        res.status(200).json(response.set(200, 'Success change profil', datas))
      } else {
        throw new Error('Failed unknown user id not found')
      }
    })
  } catch (error) {
    next(error)
  }
})

router.post('/changePassword', jwt.authToken, async (req, res, next) => {
  const { oldPassword, newPassword } = req.body
  const { _id } = req.payload
  try {
    const userDatas = await queryMDB.find(clist.users, {
      _id: _id
    })
    if (userDatas) {
      const checkPass = await encrypt.auth(oldPassword, userDatas.password)
      if (checkPass) {
        const newCryptedPass = await encrypt.sign(newPassword)
        await queryMDB
          .edit(
            clist.users,
            { _id: _id },
            {
              $set: {
                _id: _id,
                password: newCryptedPass,
                updatedAt: moment().format()
              }
            }
          )
          .then((datas) => {
            res
              .status(200)
              .json(response.set(200, 'Success change password account', datas))
          })
      } else {
        throw new Error('Wrong old password account')
      }
    } else {
      throw new Error('User ID not found')
    }
  } catch (error) {
    next(error)
  }
})

router.get('/', jwt.authToken, async (req, res, next) => {
  const { _id } = req.payload
  try {
    await queryMDB
      .edit(
        clist.users,
        { _id: _id },
        { $set: { updatedAt: moment().format() } }
      )
      .then((datas) => {
        if (datas) {
          res
            .status(200)
            .json(response.set(200, 'Success fetch user data', datas))
        } else {
          throw new Error('Failed unknown user id not found')
        }
      })
  } catch (error) {
    next(error)
  }
})

router.delete('/destroy', jwt.authToken, async (req, res, next) => {
  const { _id } = req.payload
  try {
    const available = await queryMDB.find(clist.users, { _id: _id })
    if (available) {
      await queryMDB.delete(clist.notes, { userID: _id })
      await queryMDB.delete(clist.users, { _id: _id }).then((datas) => {
        res
          .status(200)
          .json(response.set(200, 'Success destory user data', false))
      })
    } else {
      throw new Error('User and data not found')
    }
  } catch (err) {
    next(err)
  }
})

module.exports = router
