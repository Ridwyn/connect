let express = require('express')
let taskRouter = express.Router()
let Workspace = require(__appRoot+'/models/Workspace.js')
let Project = require(__appRoot+'/models/Project.js')
let Task = require(__appRoot+'/models/Task.js')
let User = require(__appRoot+'/models/User.js')

taskRouter.get('/getList/:project_id', async (req,res)=>{
    console.log(req.query)
    let loggedInUser=await User.findOne({'token':req.headers.authorization}).lean().exec()
    let tasks=await Task.find({'project':req.params.project_id}).lean().exec();
    res.json(tasks)
    res.end()
})

taskRouter.get('/getItem/:task_id/', async (req,res)=>{
    let loggedInUser=await User.findOne({'token':req.headers.authorization}).lean().exec()
    let task=await Task.findById(req.params.task_id).lean().exec();
    res.json(task)
    res.end()
})
taskRouter.post('/newTask', async(req,res)=>{

    let new_task=new Task(req.body)             
    await new_task.save()
    res.json(new_task)
    res.end()
})

module.exports= taskRouter