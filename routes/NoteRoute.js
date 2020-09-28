const express = require('express')
const moment = require('moment')

const queryMDB = require('../helper/queryMDB')
const response = require('../helper/responses')
const jwt = require('../helper/jwt')

const clist = queryMDB.cList
const router = express.Router()
const dateNow = moment().format()

router.get('/:idUser/', jwt.authToken, async (req, res, next) => {
  const { _id } = req.payload
  const { idUser } = req.params
  try {
    if (idUser === _id) {
      await queryMDB.find(clist.notes, { userID: _id }).then((datas) => {
        res.status(200).json(response.set(200, 'Success fetch datas', datas))
      })
    } else {
      throw new Error('Unknown id with wrong token owner')
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
