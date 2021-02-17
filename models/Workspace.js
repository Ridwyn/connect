const mongoose = require('mongoose')
const userSchema = require('./User.js').schema
const statusSchema = require('./Status.js').schema
const status_templateSchema = require('./Status_template.js').schema
const Schema = mongoose.Schema

const workspaceSchema = new Schema({
  name: String,
  created_at:{ type: Date, default: Date.now },
  created_by:{ type : userSchema , required : true },
  join_code: { type : String ,  required : true },
  members:[{type: Schema.Types.ObjectId, ref: 'User'}],
  usersAllowedToEdit:[{type: Schema.Types.ObjectId, ref: 'User'}],
  usersAllowedToDelete:[{type: Schema.Types.ObjectId, ref: 'User'}],
  canEdit:{type:Boolean, default:false},
  canDelete:{type:Boolean, default:false},
  custom_statuses:[status_templateSchema],
  default_statuses:{type:Schema.Types.Mixed, default:{'_id':mongoose.Types.ObjectId(),'name':'basic',
  'statuses':
   [
    {'status':'Open','orderindex':0,'color':'#aeacb0','type':'basic'},
    {'status':'In progress','orderindex':1,'color':'#ff540d','type':'basic'},
    {'status':'Closed','orderindex':2,'color':'#67cb48','type':'basic'}
  ]}},

})

workspaceSchema.methods.checkCanEdit = function(user_id) {
  for (let i = 0; i < this.usersAllowedToEdit.length; i++) {
    if(user_id.toString()===this.usersAllowedToEdit[i].toString()){
      this.canEdit=true;
    }
  }
    return this;
};
workspaceSchema.methods.checkCanDelete = function(user_id) {
  for (let i = 0; i < this.usersAllowedToDelete.length; i++) {
    if(user_id.toString()===this.usersAllowedToDelete[i].toString()){
      this.canDelete=true;
    }
  }
    return this;
};

module.exports = mongoose.model('Workspace', workspaceSchema)