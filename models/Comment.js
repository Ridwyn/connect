const mongoose = require('mongoose')
const userSchema = require(__appRoot+'/models/User.js').schema
const taskSchema = require(__appRoot+'/models/Task.js').schema
const Schema = mongoose.Schema

const commentSchema = new Schema({
  comment: String,
  task:{type:Schema.Types.ObjectId, ref:'Task'},
  created_at:{ type: Date, default: Date.now },
  created_by:{type:Schema.Types.ObjectId, ref:'User'},
  canEdit:{type:Boolean, default:false},
  canDelete:{type:Boolean, default:false},
})


commentSchema.methods.checkCanEdit = function(user_id) {
  if(user_id.toString()===this.created_by._id.toString()){
    this.canEdit=true;
  }
    return this;
};
commentSchema.methods.checkCanDelete = function(user_id) {
  if(user_id.toString()===this.created_by._id.toString()){
    this.canDelete=true;
  }
    return this;
};

module.exports = mongoose.model('Comment', commentSchema)