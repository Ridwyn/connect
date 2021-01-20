const mongoose = require('mongoose')
const userSchema = require('./User')
const projectSchema = require('./Project.js')
const workspaceSchema = require('./Workspace.js')
const Schema = mongoose.Schema

const taskSchema = new Schema({
  name: String,
  description: String,
  due_date:Date,
  start_closed:Date,
  date_closed:Date,
  time_spent:Date,
  time_estimate:Date,
  created_at:{ type: Date, default: Date.now },
  created_by:userSchema,
  priority:String,
  assignees:[userSchema],
  project:projectSchema,
  workspace:workspaceSchema,
  status:{status}
})

module.exports = mongoose.model('Task', taskSchema)