const { getCollection } = require('../db')

const findCollection = (collection) => {
  return getCollection(collection)
}

module.exports = {
  insert: (collection, datas) => {
    const col = findCollection(collection)
    return col.insert(datas)
  },
  find: (collection, filter) => {
    const col = findCollection(collection)
    if (filter) {
      return col.findOne(filter)
    } else {
      return col.find()
    }
  },
  edit: (collection, filter, update) => {
    const col = findCollection(collection)
    return col.findOneAndUpdate(filter, update)
  },
  delete: (collection, filter) => {
    const col = findCollection(collection)
    return col.findOneAndDelete(filter)
  },
  cList: {
    users: 'users',
    notes: 'notes'
  }
}
