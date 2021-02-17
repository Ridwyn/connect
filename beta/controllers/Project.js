let express = require('express')
let projectController = express.Router()
let Workspace = require(__appRoot+'/models/Workspace.js')
let Project = require(__appRoot+'/models/Project.js')
let Task = require(__appRoot+'/models/Task.js')
let User = require(__appRoot+'/models/User.js')



projectController.get('/form',async(req,res)=>{
    let data={};
    
    // Check db for found project to update
    if(req.query._id){
        let project = await Project.findById(req.query._id).lean().exec()
        let space=await Workspace.findById(project.workspace).lean().exec()
        space['all_statuses']=[...space.custom_statuses,space.default_statuses]
        data['space']=space
        project['current_status_template']=space.all_statuses.find((status_template)=>{
            return status_template._id.toString() === project.active_status_template.toString()
        })
        data['project']=project; 
        console.log(project['current_status_template'])
        console.log(project.active_status_template)
    }else{
        //New project display form
        let space=await Workspace.findById(req.query.space_id).lean().exec()
        space['all_statuses']=[...space.custom_statuses,space.default_statuses]
        data['space']=space
    }
    
 
    res.render('projectFormView', {'data':data});
})

projectController.post('/form',async (req,res)=>{
    
    // Update project
    if(req.body._id){
       Project.findByIdAndUpdate(req.body._id, req.body, {new:true,lean:true}, function (error,doc) {
           res.redirect(`/dashboard?space_id=${doc.workspace}&project_id=${doc._id}`);
        })        
    }else{
        // Create new project
        try {
            let new_project=new Project(req.body)
            new_project.created_by= req.signedCookies.user
            new_project.workspace= req.body.space_id
            new_project.usersAllowedToEdit= [req.signedCookies.user._id]
            new_project.usersAllowedToDelete= [req.signedCookies.user._id]
          let result= await new_project.save( )
          res.redirect(`/dashboard?space_id=${result.workspace}&project_id=${result._id}`);

        } catch (error) {
            console.log(error)
        }
    }

})

projectController.get('/delete', async(req,res)=>{
    try {
        let project=await Project.findById(req.query._id).lean().exec()
        let space_id=project.workspace
        // Delete Project
        Project.findByIdAndDelete(req.query._id).exec()
        await Task.remove({'workspace':space_id}).exec()
        res.redirect(`/dashboard?space_id=${space_id}`)
    } catch (error) {
        console.log(error);
    }

})









module.exports =  projectController;

