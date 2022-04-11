let express = require('express')
let projectRouter = express.Router()
let Workspace = require(__appRoot+'/models/Workspace.js')
let Project = require(__appRoot+'/models/Project.js')
let Task = require(__appRoot+'/models/Task.js')
let User = require(__appRoot+'/models/User.js')

projectRouter.get('/getList/:space_id', async (req,res)=>{
    let projects
    try {
        let loggedInUser=await User.findOne({'token':req.headers.authorization}).lean().exec()
        projects=await Project.find({'workspace':req.params.space_id}).populate('workspace').exec();

        projects.map(async(project)=>{
            project.checkCanEdit(loggedInUser._id,function (err, doc) {
            })
            project.checkCanDelete(loggedInUser._id,function (err, doc) {
            })
        });
        res.status(200)
        res.json(projects)
        res.end()
    } catch (error) {
        res.status(404)
        res.end();
    }


})

projectRouter.get('/getItem/:project_id/', async (req,res)=>{
  try {
    let loggedInUser=await User.findOne({'token':req.headers.authorization}).lean().exec()
    let project=await Project.findById(req.params.project_id).exec();
    // Handle checks for access level
     project.checkCanEdit(loggedInUser._id,function (err, doc) {})
     project.checkCanDelete(loggedInUser._id,function (err, doc) {})
    res.json(project)
    res.end()
  } catch (e) {
    console.log(e);
    res.status(404)
    res.end();
  }

})

projectRouter.post('/saveForm',async (req,res)=>{
    let loggedInUser=await User.findOne({'token':req.headers.authorization}).lean().exec()


    // Update project
    if(req.body._id){
      try {
        Project.findByIdAndUpdate(req.body._id, req.body, {new:true,lean:true},function (error,doc) {
         res.status(200)
         res.json(doc);
         res.end()
         })
      } catch (e) {
        console.log(e);
      }

    }else{
        // Create new project
        try {
            let space=await Workspace.findById(req.body.space_id).exec()
            let new_project=new Project(req.body)
            new_project.created_by= loggedInUser
            new_project.workspace= req.body.space_id
            new_project.usersAllowedToEdit= [loggedInUser._id]
            new_project.usersAllowedToDelete= [loggedInUser._id]
            new_project.active_status_template= req.body.active_status_template || space.default_statuses._id

            let result= await new_project.save( )
            res.status(200)
            res.json(JSON.stringify(result));
            res.end()
        } catch (error) {
          console.log(e);
          res.status(404)
          res.end();
        }
    }

})


projectRouter.post('/deleteItem/:project_id', async(req,res)=>{
    try {
        let project=await Project.findById(req.params.project_id).lean().exec()
        let space_id=project.workspace

        // Delete Project
        Project.findByIdAndDelete(req.params.project_id).exec()
        await Task.remove({'workspace':space_id}).exec()
        res.status(200)
        res.json({})
        res.end()
    } catch (error) {
        res.status(404)
        res.end();
    }

})

module.exports= projectRouter
