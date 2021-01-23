const mongoose = require('mongoose')
const userSchema = require('./User.js').schema
const workspaceSchema = require('./Workspace.js').schema
const statusSchema = require('./Status.js').schema
const Schema = mongoose.Schema

const projectSchema = new Schema({
  name: String,
  description: String,
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
  created_at:{ type: Date, default: Date.now },
  created_by:userSchema,
  statuses:[statusSchema]
})

module.exports = mongoose.model('Project', projectSchema)