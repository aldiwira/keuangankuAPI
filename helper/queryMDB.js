const { getCollection } = require('../db')

const findCollection = (collection) => {
  return getCollection(collection)
}

module.exports = {
  insert: async (collection, datas) => {
    const col = await findCollection(collection)
    return await col.insert(datas)
  },
  find: async (collection, filter) => {
    const col = await findCollection(collection)
    if (filter) {
      return await col.findOne(filter)
    } else {
      return await col.find()
    }
  },
  edit: async (collection, filter, update) => {
    const col = await findCollection(collection)
    return await col.findOneAndUpdate(filter, update)
  },
  delete: async (collection, filter) => {
    const col = await findCollection(collection)
    return await col.findOneAndDelete(filter)
  },
  cList: {
    users: 'users',
    notes: 'notes'
  }
}
