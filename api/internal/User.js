let express = require('express')
let userRouter = express.Router()
let Workspace = require(__appRoot+'/models/Workspace.js')
let Project = require(__appRoot+'/models/Project.js')
let Task = require(__appRoot+'/models/Task.js')
let User = require(__appRoot+'/models/User.js')

userRouter.get('/getProfile', async (req,res)=>{
    let loggedInUser=await User.findOne({'token':req.headers.authorization}).lean().exec()
    res.json(loggedInUser)
    res.end()
})

userRouter.get('/getItem/:space_id/', async (req,res)=>{
    let loggedInUser=await User.findOne({'token':req.headers.authorization}).lean().exec()
    let space=await Workspace.findById(req.params.space_id).exec();
    // Handle checks for access level
     space.checkCanEdit(loggedInUser._id,function (err, doc) {})
     space.checkCanDelete(loggedInUser._id,function (err, doc) {})
    res.json(space)
    res.end()
})

module.exports= userRouter