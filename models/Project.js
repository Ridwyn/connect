const mongoose = require('mongoose')
const userSchema = require('./User.js').schema
const status_templateSchema = require('./Status_template').schema
const Schema = mongoose.Schema

const projectSchema = new Schema({
  name: String,
  description: String,
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
  created_at:{ type: Date, default: Date.now },
  created_by:userSchema,
  active_status_template:{ type: Schema.Types.ObjectId, ref: 'Status_template' }
})

module.exports = mongoose.model('Project', projectSchema)