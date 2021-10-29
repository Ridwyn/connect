let express = require('express')
let projectRouter = express.Router()
let Workspace = require(__appRoot+'/models/Workspace.js')
let Project = require(__appRoot+'/models/Project.js')
let Task = require(__appRoot+'/models/Task.js')
let User = require(__appRoot+'/models/User.js')

projectRouter.get('/getList', async (req,res)=>{
    let loggedInUser=await User.findOne({'token':req.headers.authorization}).lean().exec()
    let projects=await Project.find({'workspace':req.query.space_id}).populate().exec();
    projects.map(project=>{
        project.checkCanEdit(loggedInUser._id,function (err, doc) {
        })
        project.checkCanDelete(loggedInUser._id,function (err, doc) {
        })
    }); 
    res.send(projects)
    res.end()
})

module.exports= projectRouter