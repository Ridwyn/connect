let express = require('express')
let spaceRouter = express.Router()
let Workspace = require(__appRoot+'/models/Workspace.js')
let Project = require(__appRoot+'/models/Project.js')
let Task = require(__appRoot+'/models/Task.js')
let User = require(__appRoot+'/models/User.js')

spaceRouter.get('/getList', async (req,res)=>{
    let loggedInUser=await User.findOne({'token':req.headers.authorization}).lean().exec()
    let spaces =await Workspace.find({'members':req.user._id}).exec()
    console.log(loggedInUser)
    spaces.forEach(space => {
        space.checkCanEdit(loggedInUser._id,function (err, doc) {
        })
        space.checkCanDelete(loggedInUser._id,function (err, doc) {
        })
    });
    res.send(JSON.stringify(spaces))
    res.end()
})

spaceRouter.get('/getItem', async (req,res)=>{
    let space=await Workspace.findById(req.query.space_id).exec();
    // Handle checks for access level
     space.checkCanEdit(req.signedCookies.user._id,function (err, doc) {})
     space.checkCanDelete(req.signedCookies.user._id,function (err, doc) {})
    res.send(JSON.stringify(space))
    res.end()
})

module.exports= spaceRouter