module.exports = {
  set: (code, massage, datas) => {
    datas ? datas : null
    return {
      status: code,
      massage: massage,
      data: datas
    }
  }
}
