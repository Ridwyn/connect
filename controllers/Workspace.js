var express = require('express')
var workspaceController = express.Router()
let Workspace = require('../models/Workspace.js')
let User = require('../models/User.js')
const mnemonicId = require('mnemonic-id');


workspaceController.get('/form',(req,res)=>{
    console.log('from get route')
    
    console.log(req.body);
    res.render('workspaceformView', {'data':'req.signedCookies.user.username'});
})

workspaceController.post('/form',async (req,res)=>{
    console.log('from post route');
    let new_workspace=new Workspace(req.body)
    new_workspace.owner= req.signedCookies.user
    new_workspace.join_code=mnemonicId.createUniqueNameId();
    new_workspace.members=[req.signedCookies.user];
    try {
        let results=await new_workspace.save()
        console.log(results)
        res.cookie('workspace',results.toJSON(), { signed: true }).render('dashboardView');
    } catch (error) {
        
    }
    
})




module.exports =  workspaceController;

