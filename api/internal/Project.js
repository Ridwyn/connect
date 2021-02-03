let express = require('express')
let projectRouter = express.Router()
let Workspace = require('../../models/Workspace.js')
let Project = require('../../models/Project.js')
let Task = require('../../models/Task.js')
let User = require('../../models/User.js')

projectRouter.get('/getall', async (req,res)=>{
    let spaces =await Workspace.find({'members._id':req.user._id}).lean().exec()
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