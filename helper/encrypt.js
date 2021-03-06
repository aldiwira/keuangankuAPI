const bcrypt = require('bcrypt')

module.exports = {
  sign: async (password) => {
    return await bcrypt.hashSync(password, 8)
  },
  auth: async (password, encrpyted) => {
    return await bcrypt.compareSync(password, encrpyted)
  }
}
