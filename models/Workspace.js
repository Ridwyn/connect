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
  members:[userSchema],
  custom_statuses:[status_templateSchema],
  default_statuses:{type:Schema.Types.Mixed, default:{'_id':mongoose.Types.ObjectId(),'name':'basic',
  'statuses':
   [
    {'status':'Open','orderindex':0,'color':'#aeacb0','type':'basic'},
    {'status':'In progress','orderindex':1,'color':'#ff540d','type':'basic'},
    {'status':'Closed','orderindex':2,'color':'#67cb48','type':'basic'}
  ]}},

})
module.exports = mongoose.model('Workspace', workspaceSchema)