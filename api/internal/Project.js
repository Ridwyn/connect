let express = require('express')
let projectRouter = express.Router()
let Workspace = require(__appRoot+'/models/Workspace.js')
let Project = require(__appRoot+'/models/Project.js')
let Task = require(__appRoot+'/models/Task.js')
let User = require(__appRoot+'/models/User.js')

projectRouter.get('/getall', async (req,res)=>{
    console.log(req.user._id)
    let spaces =await Workspace.find({'members':req.user._id}).lean().exec()
    let space_ids= spaces.map(space=>{
        return space._id;
    })
    let projects=[]
    for (let i = 0; i < space_ids.length; i++) {
        let found_projects= await Project.find({'workspace':space_ids[i]}).lean().exec()
        projects.push(...found_projects)       
    }
    res.send(projects)
    res.end()
})

module.exports= projectRouter