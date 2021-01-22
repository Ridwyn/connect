// PULL all data in here from store

var express = require('express')
var dashboardController = express.Router()
let Workspace = require('../models/Workspace.js')
let User = require('../models/User.js')


dashboardController.get('/',async (req,res)=>{
    try {
        let data={}   
        // Find all workspace for currently lgged member
        let found_spaces=await Workspace.find({ 'members' :  req.signedCookies.user }).lean().exec();
        console.log(found_spaces)
        data['user']=req.signedCookies.user;
        data['found_spaces']=found_spaces
        res.render('dashboardView', {'data':data});
    } catch (error) {
        console.log(error);
    } 
    
    
})

module.exports =  dashboardController;
