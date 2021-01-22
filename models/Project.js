const mongoose = require('mongoose')
const userSchema = require('./User.js')
const workspaceSchema = require('./Workspace.js')
const statusSchema = require('./Status.js')
const Schema = mongoose.Schema

const projectSchema = new Schema({
  name: String,
  description: String,
  workspace:workspaceSchema,
  created_at:{ type: Date, default: Date.now },
  created_by:userSchema,
  statuses:[statusSchema]
})

module.exports = mongoose.model('Project', projectSchema)