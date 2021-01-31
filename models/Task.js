const mongoose = require('mongoose')
const userSchema = require('./User').schema
const statusSchema = require('./Status.js').schema
const commentSchema = require('./Comment.js').schema
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
  assignees:[{type: Schema.Types.ObjectId, ref: 'User' }],
  project:{type: Schema.Types.ObjectId, ref: 'Project' },
  workspace:{type: Schema.Types.ObjectId, ref: 'Workspace' },
  comments:[{type: Schema.Types.ObjectId, ref: 'Comment' }],
  status:statusSchema
})

module.exports = mongoose.model('Task', taskSchema)