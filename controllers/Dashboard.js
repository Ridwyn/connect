// PULL all data in here from store

var express = require('express')
var dashboardController = express.Router()
let Workspace = require('../models/Workspace.js')
let User = require('../models/User.js')


dashboardController.get('/',async (req,res)=>{
    try {
        let data={}   
        // Find all workspace for currently lgged member
        let spaces=await Workspace.find({ 'members' :  req.signedCookies.user }).lean().exec();
        data['user']=req.signedCookies.user;
        data['spaces']=spaces
        data['projects']=spaces
        res.render('dashboardView', {'data':data});
    } catch (error) {
        console.log(error);
    } 
    
    
})

module.exports =  dashboardController;
