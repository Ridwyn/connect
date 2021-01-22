const mongoose = require('mongoose')
const userSchema = require('./User.js')
const Schema = mongoose.Schema

const workspaceSchema = new Schema({
  name: String,
  created_at:{ type: Date, default: Date.now },
  created_by:userSchema,
  members:[userSchema]
})
module.exports = mongoose.model('Workspace', workspaceSchema)