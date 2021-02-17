const mongoose = require('mongoose')
const Schema = mongoose.Schema

const defaultstatusSchema = new Schema({
  status: String,
  oderindex: Number,
  color:String,
  type:String,
})

module.exports = mongoose.model('default_statuses', defaultstatusSchema)