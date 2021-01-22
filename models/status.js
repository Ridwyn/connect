const mongoose = require('mongoose')
const userSchema = require('./User.js')
const workspaceSchema = require('./Workspace.js')
const Schema = mongoose.Schema

const statusSchema = new Schema({
  status: String,
  oderindex: Int32Array,
  color:String,
  type:String,
})

module.exports = mongoose.model('Status', statusSchema)