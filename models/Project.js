const mongoose = require('mongoose')
const userSchema = require('./User.js').schema
const status_templateSchema = require('./Status_template').schema
const Schema = mongoose.Schema

const projectSchema = new Schema({
  name: String,
  description: String,
  usersAllowedToEdit:[{type: Schema.Types.ObjectId, ref: 'User'}],
  usersAllowedToDelete:[{type: Schema.Types.ObjectId, ref: 'User'}],
  canEdit:{type:Boolean, default:false},
  canDelete:{type:Boolean, default:false},
  workspace: { type: Schema.Types.ObjectId, ref: 'Workspace' },
  created_at:{ type: Date, default: Date.now },
  created_by:userSchema,
  active_status_template:{ type: Schema.Types.ObjectId, ref: 'Status_template' }
})

projectSchema.methods.checkCanEdit = function(user_id) {
  for (let i = 0; i < this.usersAllowedToEdit.length; i++) {
    if(user_id.toString()===this.usersAllowedToEdit[i].toString()){
      this.canEdit=true;
    }
  }
    return this;
};
projectSchema.methods.checkCanDelete = function(user_id) {
  for (let i = 0; i < this.usersAllowedToDelete.length; i++) {
    if(user_id.toString()===this.usersAllowedToDelete[i].toString()){
      this.canDelete=true;
    }
  }
    return this;
};

module.exports = mongoose.model('Project', projectSchema)