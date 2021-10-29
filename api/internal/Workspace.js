let express = require('express')
let spaceRouter = express.Router()
let Workspace = require(__appRoot+'/models/Workspace.js')
let Project = require(__appRoot+'/models/Project.js')
let Task = require(__appRoot+'/models/Task.js')
let User = require(__appRoot+'/models/User.js')

spaceRouter.get('/getall', async (req,res)=>{
    console.log(req.user._id)
    let spaces =await Workspace.find({'members':req.user._id}).exec()
    spaces.forEach(space => {
        space.checkCanEdit(req.user._id,function (err, doc) {
        })
        space.checkCanDelete(req.user._id,function (err, doc) {
        })
    });
    res.send(JSON.stringify(spaces))
    res.end()
})

module.exports= spaceRouter