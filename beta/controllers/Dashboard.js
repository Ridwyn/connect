// PULL all data in here from store

var express = require('express')
var dashboardController = express.Router()
let Workspace = require(__appRoot+'/models/Workspace.js')
let Project = require(__appRoot+'/models/Project.js')
let Task = require(__appRoot+'/models/Task.js')
let User = require(__appRoot+'/models/User.js')
// let Status = require(__appRoot+'/models/Status.js')
// let DStatus = require(__appRoot+'/models/Default_status.js')


dashboardController.get('/:space_id?:project_id?',async (req,res)=>{
    try {
        let data={}   
        // Find all workspace for currently lgged member
        let spaces=await Workspace.find({ 'members' :  req.signedCookies.user._id }).exec();
        spaces.forEach(space => {
            space.checkCanEdit(req.signedCookies.user._id,function (err, doc) {
            })
            space.checkCanDelete(req.signedCookies.user._id,function (err, doc) {
            })
        });
        data['user']=req.signedCookies.user;
        data['spaces']=spaces.map(space=>{return space.toJSON()})
        data['assigned_tasks']=await Task.find({ 'assignees' :  req.signedCookies.user._id }).lean().exec();

        console.log(spaces)
        // Space id to fetch space projects
        if (req.query.space_id) {
            let space=await Workspace.findById(req.query.space_id).exec();
            // Handle checks for access level
            space.checkCanEdit(req.signedCookies.user._id,function (err, doc) {})
            space.checkCanDelete(req.signedCookies.user._id,function (err, doc) {})
            space=space.toJSON()
            space['all_statuses']=[...space.custom_statuses,space.default_statuses]

            let projects=await Project.find({'workspace':req.query.space_id}).populate().exec();
            
            data['current_space']=space;
            data['projects']=projects.map(project=>{
                project.checkCanEdit(req.signedCookies.user._id,function (err, doc) {
                })
                project.checkCanDelete(req.signedCookies.user._id,function (err, doc) {
                })
                let active_status_template=space.all_statuses.find((status_template)=>{
                    return status_template._id.toString() === project.active_status_template.toString()
                });
                return Object.assign(project.toJSON(),{'template':active_status_template})
                
            });
        }
        // Project id to fetch product task
        if (req.query.project_id) {
            let project=await Project.findById(req.query.project_id).exec();
            project.checkCanEdit(req.signedCookies.user._id,function (err, doc) {})
            project.checkCanDelete(req.signedCookies.user._id,function (err, doc) {})
            project=project.toJSON()
            let tasks=await Task.find({'project':req.query.project_id}).lean().exec();
            let space =await Workspace.findById(req.query.space_id).lean().exec();
            data['tasks']=tasks
            data['current_project']=project
            space['all_statuses']=[...space.custom_statuses,space.default_statuses]
            // Match the right status template
            let active_status_template=space.all_statuses.find((status_template)=>{
                return status_template._id.toString() === project.active_status_template.toString()
            });
            
            // Manipulating tasks array to store each task in coressponding status for Templating 
            data['current_project']['active_status_template']=active_status_template;
            data['active_status_template']=active_status_template;
            let sData=active_status_template['statuses']
            for (let j = 0; j < sData.length; j++) {
                sData[j]['tasks']=[]
            }
                for (let i = 0; i < tasks.length; i++) {
                    for (let j = 0; j < sData.length; j++) {
                        if (tasks[i].status.status.toString() === sData[j].status.toString() ) {
                            sData[j]['tasks'].push(tasks[i])
                        }
                    }
                    
                }
            // Storing tasks this way for easy templating purposes
            data['current_project']['active_status_template']['statuses']=sData
        }

        data['project_id']=req.query.project_id
        data['space_id']=req.query.space_id

        
        res.render('dashboardView', {'data':data});
    } catch (error) {
        console.log(error);
    } 
})




module.exports =  dashboardController;
