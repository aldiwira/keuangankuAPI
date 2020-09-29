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

router.post('/:idUser/initial', jwt.authToken, async (req, res, next) => {
  const { _id } = req.payload
  const { idUser } = req.params
  try {
    const bodyNotes = {
      userID: _id,
      noteDatas: [],
      createdAt: dateNow,
      updatedAt: dateNow
    }
    if (idUser === _id) {
      const available = await queryMDB.find(clist.notes, { userID: _id })
      if (available) {
        throw new Error('Notes was available')
      } else {
        await queryMDB.insert(clist.notes, bodyNotes).then((datas) => {
          res
            .status(201)
            .json(response.set(201, 'Success create initial notes', datas))
        })
      }
    } else {
      throw new Error('Unknown id with wrong token owner')
    }
  } catch (error) {
    next(error)
  }
})

router.post('/:idUser/sync', jwt.authToken, async (req, res, next) => {
  const { _id } = req.params
  const { idUser } = req.payload
  const { noteDatas } = req.body
  try {
    if (_id === idUser) {
      throw new Error('Unknown id with wrong token owner')
    } else {
      await queryMDB
        .edit(
          clist.notes,
          { userID: _id },
          { $set: { noteDatas: noteDatas, updatedAt: dateNow } }
        )
        .then((datas) => {
          res.status(200).json(response.set(200, 'Success sync data', datas))
        })
    }
  } catch (error) {
    next(error)
  }
})

module.exports = router
