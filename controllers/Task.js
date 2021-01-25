let express = require('express')
let taskController = express.Router()
let Task = require('../models/Task.js');
let multer  = require('multer');
var upload = multer({ dest: 'uploads/' })

taskController.get('/form',async (req,res)=>{
    let data={};
    // Check db for found task to update
    if(req.query._id){
        let task = await Task.findById(req.query._id).lean().exec()
        data['task']=task; 
    }
    data['space_id']=req.query.space_id
    data['project_id']=req.query.project_id
    data['user_id']=req.signedCookies.user._id
 
    res.render('taskFormView', {'data':data});
})

taskController.post('/form',upload.any(),async (req,res)=>{
    // Update project
    if(req.body._id){
        Task.findByIdAndUpdate(req.body._id, req.body, {new:true,lean:true}, function (error,doc) {
            res.redirect(`/dashboard?space_id=${doc.workspace}&project_id=${doc.project}`);
         })        
     }else{
         // Create new project
         try {
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
