// PULL all data in here from store

var express = require('express')
var dashboardController = express.Router()
let Workspace = require('../models/Workspace.js')
let Project = require('../models/Project.js')
let Task = require('../models/Task.js')
let User = require('../models/User.js')


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
            data['current_space']=space;
            data['projects']=projects;
        }
        // Project id to fetch product task
        if (req.query.project_id) {
            let project=await Project.findById(req.query.project_id).lean().exec();
            let tasks=await Task.find({'project':req.query.project_id}).lean().exec();
            data['current_project']=project
            data['tasks']=tasks
        }

        res.render('dashboardView', {'data':data});
    } catch (error) {
        console.log(error);
    } 
})




module.exports =  dashboardController;
