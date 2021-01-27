// PULL all data in here from store

var express = require('express')
var dashboardController = express.Router()
let Workspace = require('../models/Workspace.js')
let Project = require('../models/Project.js')
let Task = require('../models/Task.js')
let User = require('../models/User.js')
let Status = require('../models/Status.js')
let DStatus = require('../models/Default_status.js')


dashboardController.get('/:space_id?:project_id?',async (req,res)=>{
    try {
        let data={}   
        // Find all workspace for currently lgged member
        let spaces=await Workspace.find({ 'members' :  req.signedCookies.user }).lean().exec();
        data['user']=req.signedCookies.user;
        data['spaces']=spaces

        // Space id to fetch space projects
        if (req.query.space_id) {
            let space=await Workspace.findById(req.query.space_id).lean().exec();
            let projects=await Project.find({'workspace':space}).lean().exec();
            space['all_statuses']=[...space.custom_statuses,space.default_statuses]
            data['current_space']=space;
            data['projects']=projects;
        }
        // Project id to fetch product task
        if (req.query.project_id) {
            let project=await Project.findById(req.query.project_id).lean().exec();
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
                            console.log( )
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
