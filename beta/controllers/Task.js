let express = require('express')
let taskController = express.Router()
let Task = require(__appRoot+'/models/Task.js');
let Status = require(__appRoot+'/models/_Status.js');
let Workspace = require(__appRoot+'/models/Workspace.js');
let Project = require(__appRoot+'/models/Project.js');
let Comment = require(__appRoot+'/models/Comment.js');
let multer  = require('multer');
var upload = multer({ dest: 'uploads/' })

taskController.get('/form',async (req,res)=>{
    let data={};

    let path={ 
        path: 'workspace',
        populate: {
          path: 'members',
          model: 'User'
        } 
     }
    // Check db for found task to update
    if(req.query._id){
        let task = await Task.findById(req.query._id).populate({ 
            path: 'workspace',
            populate: {
              path: 'members',
              model: 'User'
            } 
         }).populate('project').populate('assignees').lean().exec()
        data['task']=task; 
        let space =task.workspace
        let project =task.project
        let comments = await Comment.find({'task':task._id}).populate('created_by').exec()
        comments.forEach(comment => {
            comment.checkCanEdit(req.signedCookies.user._id,function (err, doc) {
            })
            comment.checkCanDelete(req.signedCookies.user._id,function (err, doc) {
            })
        });
        
        space['all_statuses']=[...space.custom_statuses,space.default_statuses]
        data['active_status_template']=space.all_statuses.find((status_template)=>{
            return status_template._id.toString() === project.active_status_template.toString()
        });
        data['comments']=comments.map(comment=>{return comment.toJSON()})
        data['space']=space
    }else{
        let space =await Workspace.findById(req.query.space_id).populate('members').lean().exec()
        let project =await Project.findById(req.query.project_id).lean().exec()
        data['space_id']=req.query.space_id
        data['project_id']=req.query.project_id
        data['user_id']=req.signedCookies.user._id
        space['all_statuses']=[...space.custom_statuses,space.default_statuses]
        data['active_status_template']=space.all_statuses.find((status_template)=>{
            return status_template._id.toString() === project.active_status_template.toString()
        });

        data['space']=space
        data['project']=project
    }
 
    res.render('taskFormView', {'data':data});
})

taskController.post('/form',upload.any(),async (req,res)=>{
    // Update project
    if(req.body._id){
        if(req.body.assignees){
            let task = await Task.findById(req.body._id).exec()
            req.body.assignees=task.assignees.concat(req.body.assignees)
            req.body.assignees=Array.from(new Set(req.body.assignees.map(String)))
        }
        // parse statuse value before insert
        req.body.status=new Status(JSON.parse(req.body.status))
        Task.findByIdAndUpdate(req.body._id, req.body, {new:true,lean:true}, function (error,doc) {
            res.redirect(`/task/form?_id=${doc._id}`);
         })        
     }else{
         // Create new project
         try {
            req.body.status= new Status(JSON.parse(req.body.status))   
             let new_task=new Task(req.body)
             new_task.created_by= req.signedCookies.user
             new_task.workspace= req.body.space_id
             new_task.project= req.body.project_id
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
         await Task.findByIdAndDelete(req.query._id).exec()
         res.redirect(`/dashboard?space_id=${space_id}&project_id=${project_id}`)
     } catch (error) {
         console.log(error);
     }
})

taskController.get('/remove_assignee', async(req,res)=>{
    let task = await  Task.findById(req.query.task_id).exec()
    task.assignees.pull(req.query.assignee_id)
    task.save()
    res.redirect(`/task/form?_id=${req.query.task_id}`)
})

taskController.post('/comment', async(req,res)=>{
    let new_comment=new Comment(req.body)
    new_comment.task=req.body.task_id
    new_comment.created_by=req.signedCookies.user._id
    new_comment.save()
    res.redirect(`/task/form?_id=${req.body.task_id}`)
})
taskController.get('/comment/delete', async(req,res)=>{
    let comment = await Comment.findById(req.query._id).lean().exec()
    let task = await Task.findById(comment.task).lean().exec()
    await Comment.findByIdAndDelete(req.query._id).exec()
    res.redirect(`/task/form?_id=${task._id}`)
})


module.exports =  taskController;
