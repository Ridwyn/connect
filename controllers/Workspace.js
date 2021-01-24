var express = require('express')
var workspaceController = express.Router()
let Workspace = require('../models/Workspace.js')
let Default_Status = require('../models/Default_status.js')
const mnemonicId = require('mnemonic-id');


workspaceController.get('/form',async(req,res)=>{
    let data={};
    if(req.query._id){
        let space = await Workspace.findById(req.query._id).lean().exec()
        data['space']=space; 
    }
    data['default_statuses']= await Default_Status.find().lean().exec();
    console.log( data['default_statuses'])
 
    res.render('workspaceFormView', {'data':data});
})

workspaceController.post('/form',async (req,res)=>{
    let result;
    // Update workspace
    if(req.body._id){
       Workspace.findByIdAndUpdate(req.body._id, req.body, {new:true,lean:true},function (error,doc) {
           console.log(doc);
           res.redirect(`/dashboard?space_id=${req.body._id}`);
        })        
    }else{
        // Create new workspace
        try {
            let new_workspace=new Workspace(req.body)
            new_workspace.created_by= req.signedCookies.user
            new_workspace.join_code=mnemonicId.createUniqueNameId();
            new_workspace.members=[req.signedCookies.user];
            results=await new_workspace.save()
            console.log(result);
            res.redirect(`/dashboard?space_id=${results._id}`);
        } catch (error) {
            
        }
    }

})

workspaceController.get('/delete', async(req,res)=>{
    try {
        Workspace.findByIdAndDelete(req.query._id).exec()
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error);
    }

})





module.exports =  workspaceController;

