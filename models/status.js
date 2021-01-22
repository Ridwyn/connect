const mongoose = require('mongoose')
const userSchema = require('./User.js')
const workspaceSchema = require('./Workspace.js')
const Schema = mongoose.Schema

const statusSchema = new Schema({
  status: String,
  oderindex: Number,
  color:String,
  type:String,
})

module.exports = mongoose.model('Status', statusSchema)