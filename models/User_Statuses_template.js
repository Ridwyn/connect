const mongoose = require('mongoose')
const statusSchema = require(__appRoot+'/models/_Status.js').schema
const StatusTemplateSchema = require(__appRoot+'/models/Status_template.js').schema
const Schema = mongoose.Schema

const userStatusTemplateSchema = new Schema({
  name:String,
  statuses:[StatusTemplateSchema],
  created_by:{type: Schema.Types.ObjectId, ref: 'User' },
  default_statuses:{type:Schema.Types.Mixed, default:{'_id':mongoose.Types.ObjectId(),'name':'basic',
  'statuses':
   [
    {'status':'Open','orderindex':0,'color':'#aeacb0','type':'basic'},
    {'status':'In progress','orderindex':1,'color':'#ff540d','type':'basic'},
    {'status':'Closed','orderindex':2,'color':'#67cb48','type':'basic'}
  ]}},
})

module.exports = mongoose.model('user_statuses_template', userStatusTemplateSchema)