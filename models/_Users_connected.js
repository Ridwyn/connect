const mongoose = require('mongoose')
const userSchema = require(__appRoot+'/models/User.js').schema
const Schema = mongoose.Schema

const _user_connectedSchema = new Schema({
  websocket:String,  
  users: [{type: Schema.Types.ObjectId, ref: 'User' }],
  date_created:{type:Date, default:Date.now}
})


module.exports = mongoose.model('_User_connected', _user_connectedSchema)