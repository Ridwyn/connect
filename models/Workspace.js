const mongoose = require('mongoose')
const userSchema = require('./User.js').schema
const statusSchema = require('./Status.js').schema
const Schema = mongoose.Schema

const workspaceSchema = new Schema({
  name: String,
  created_at:{ type: Date, default: Date.now },
  owner:{ type : userSchema , required : true },
  join_code: { type : String , unique : true, required : true },
  members:[userSchema],
  custom_statuses:[{status_type:[statusSchema]}],
  default_statuses:{type:Schema.Types.Mixed,default:{'basic':
  [
    {'status':'Open','orderindex':0,'color':'#aeacb0','type':'basic'},
    {'status':'In progress','orderindex':1,'color':'#ff540d','type':'basic'},
    {'status':'Closed','orderindex':2,'color':'#67cb48','type':'basic'}
  ]
  }}

})
module.exports = mongoose.model('Workspace', workspaceSchema)