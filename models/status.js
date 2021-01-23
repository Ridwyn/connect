const mongoose = require('mongoose')
const userSchema = require('./User.js').schema
const workspaceSchema = require('./Workspace.js').schema
const Schema = mongoose.Schema

const statusSchema = new Schema({
  status: String,
  oderindex: Number,
  color:String,
  type:String,
})

module.exports = mongoose.model('Status', statusSchema)