var express = require('express')
var workspaceController = express.Router()
let Workspace = require('../models/Workspace.js')
let User = require('../models/User.js')
const mnemonicId = require('mnemonic-id');


workspaceController.get('/form',async(req,res)=>{
    let data={};
    if(req.query._id){
        let space = await Workspace.findById(req.query._id).lean().exec()
        data['space']=space; 
    }
 
    res.render('workspaceformView', {'data':data});
})

workspaceController.post('/form',async (req,res)=>{
    let result;
    // Update workspace
    if(req.body._id){
       Workspace.findByIdAndUpdate(req.body._id, req.body, {new:true,lean:true},function (error,doc) {
           console.log(doc);
           res.redirect('/dashboard');
        })        
    }else{
        // Create new workspace
        try {
            let new_workspace=new Workspace(req.body)
            new_workspace.owner= req.signedCookies.user
            new_workspace.join_code=mnemonicId.createUniqueNameId();
            new_workspace.members=[req.signedCookies.user];
            results=await new_workspace.save()
            console.log(result);
            res.redirect('/dashboard');
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

