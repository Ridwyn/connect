const mongoose = require('mongoose')
const statusSchema = require(__appRoot+'/models/_Status.js').schema
const Schema = mongoose.Schema

const statusTemplateSchema = new Schema({
  name:String,
  statuses:[statusSchema],
})

module.exports = mongoose.model('status_template', statusTemplateSchema)