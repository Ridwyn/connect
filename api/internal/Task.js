let express = require('express')
let taskRouter = express.Router()
let Workspace = require(__appRoot+'/models/Workspace.js')
let Project = require(__appRoot+'/models/Project.js')
let Task = require(__appRoot+'/models/Task.js')
let User = require(__appRoot+'/models/User.js')




taskRouter.post('/deleteItem/:task_id', async (req,res)=>{
  try {
    // let space_id=req.body.space_id
    await Task.remove({'_id':req.params.task_id}).exec()
    res.status(200)
    res.json({})
    res.end()
  } catch (e) {
    console.log(e);
    res.status(404)
    res.end();
  }

})
taskRouter.get('/search', async (req,res)=>{
  try {
    let loggedInUser=await User.findOne({'token':req.headers.authorization}).lean().exec();

    const term = req.query.term || '';
    const regex = new RegExp( term, 'i' )

    const allTasks=  await Task.find({ "name" : regex }).populate('workspace').populate('project').lean().exec()

    // Filter where user belongs to space of the tasks
    const currentUserTaskSpace=  allTasks.filter((task)=>(task.workspace.members.toString().includes(String (loggedInUser._id))))

    console.log(currentUserTaskSpace);
    console.log(allTasks.length);
    console.log(loggedInUser._id);
    console.log(allTasks[0].workspace.members.toString().includes(loggedInUser._id));

    res.status(200)
    res.json(currentUserTaskSpace)
    res.end()
  } catch (e) {
    console.log(e);
    res.status(404)
    res.end();
  }

})

taskRouter.get('/getList/:project_id', async (req,res)=>{
  try {
    let loggedInUser=await User.findOne({'token':req.headers.authorization}).lean().exec()
    let tasks=await Task.find({'project':req.params.project_id}).populate('created_by').lean().exec();
    res.json(tasks)
    res.end()
  } catch (e) {
    console.log(e);
    res.status(404)
    res.end();
  }

})

taskRouter.get('/getItem/:task_id/', async (req,res)=>{
  try {

    let loggedInUser=await User.findOne({'token':req.headers.authorization}).lean().exec()
    let task=await Task.findById(req.params.task_id).populate('assignees').exec();
    res.json(task)
    res.end()


  } catch (e) {
    console.log(e);
    res.status(404)
    res.end();
  }

})

taskRouter.post('/saveTask', async(req,res)=>{
  try {
    let loggedInUser=await User.findOne({'token':req.headers.authorization}).lean().exec()
    if (req.body._id) {
        req.body.members.push(req.body.created_by)
        Task.findByIdAndUpdate(req.body._id, req.body, {new:true,lean:true}, function (error,doc) {
          console.log(doc.members);
            res.json(doc)
            res.end()
         })
    }else{
        const body = req.body;
        body.members=[loggedInUser._id]
        let new_task=new Task(body)
        await new_task.save()
        res.json(new_task)
        res.end()
    }

  } catch (e) {
    console.log(e);
    res.status(404)
    res.end();
  }

})

module.exports= taskRouter
