const mongoose = require('mongoose')
const Schema = mongoose.Schema

const statusSchema = new Schema({
  status: String,
  oderindex: Number,
  color:String,
  type:String,
})

module.exports = mongoose.model('status', statusSchema)