let express = require('express')
let projectRouter = express.Router()
let Workspace = require('../../models/Workspace.js')
let Project = require('../../models/Project.js')
let Task = require('../../models/Task.js')
let User = require('../../models/User.js')

projectRouter.get('/getall',(req,res)=>{
    res.send({name:'123'})
    res.end()
})

module.exports= projectRouter