let express = require('express')
let taskController = express.Router()
let Task = require('../models/Task.js');
let Status = require('../models/Status.js');
let multer  = require('multer');
let Workspace = require('../models/Workspace.js');
let Project = require('../models/Project.js');
var upload = multer({ dest: 'uploads/' })

taskController.get('/form',async (req,res)=>{
    let data={};
    // Check db for found task to update
    if(req.query._id){
        let task = await Task.findById(req.query._id).populate('workspace').populate('project').lean().exec()
        data['task']=task; 
        let space =task.workspace
        let project =task.project
        space['all_statuses']=[...space.custom_statuses,space.default_statuses]

        data['active_status_template']=space.all_statuses.find((status_template)=>{
            return status_template._id.toString() === project.active_status_template.toString()
        });
    }else{
        data['space_id']=req.query.space_id
        data['project_id']=req.query.project_id
        data['user_id']=req.signedCookies.user._id
        let space =await Workspace.findById(req.query.space_id).lean().exec()
        let project =await Project.findById(req.query.project_id).lean().exec()
        space['all_statuses']=[...space.custom_statuses,space.default_statuses]

        data['active_status_template']=space.all_statuses.find((status_template)=>{
            return status_template._id.toString() === project.active_status_template.toString()
        });
    }
    res.render('taskFormView', {'data':data});
})

taskController.post('/form',upload.any(),async (req,res)=>{
    // Update project
    if(req.body._id){
        // parse statuse value before insert
        req.body.status=new Status(JSON.parse(req.body.status))       
        Task.findByIdAndUpdate(req.body._id, req.body, {new:true,lean:true}, function (error,doc) {
            res.redirect(`/dashboard?space_id=${doc.workspace}&project_id=${doc.project}`);
         })        
     }else{
         // Create new project
         try {
            new Status(JSON.parse(req.body.status))   
             let new_task=new Task(req.body)
             new_task.created_by= req.signedCookies.user
             new_task.workspace= req.body.space_id
             new_task.project= req.body.project_id
             console.log(new_task)
            await new_task.save( )
           res.redirect(`/dashboard?space_id=${req.body.space_id}&project_id=${req.body.project_id}`);
 
         } catch (error) {
             console.log(error)
         }
     }
 
 })
 
 taskController.get('/delete', async(req,res)=>{
     try {
         let task=await Task.findById(req.query._id).lean().exec()
         let space_id=task.workspace
         let project_id=task.project
         // Delete Project
         Task.findByIdAndDelete(req.query._id).exec()
         res.redirect(`/dashboard?space_id=${space_id}&project_id=${project_id}`)
     } catch (error) {
         console.log(error);
     }
})


module.exports =  taskController;
