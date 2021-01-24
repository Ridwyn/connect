const mongoose = require('mongoose')
const userSchema = require('./User.js').schema
const taskSchema = require('./Task.js').schema
const Schema = mongoose.Schema

const commentSchema = new Schema({
  text: String,
  task:{type:Schema.Types.ObjectId, ref:'Task'},
  created_at:{ type: Date, default: Date.now },
  created_by:userSchema,
})

module.exports = mongoose.model('Comment', commentSchema)