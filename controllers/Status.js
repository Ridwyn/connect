var express = require('express')
var statusController = express.Router()
let Workspace = require('../models/Workspace.js')
let Default_Status = require('../models/Default_status.js')
let Status = require('../models/Status.js')
let Status_template = require('../models/Status_template.js')
const mnemonicId = require('mnemonic-id');


statusController.get('/form',async(req,res)=>{
    let data={};
    if(req.query._id){
        let status = await Status.findById(req.query._id).lean().exec()
        data['status']=status; 
    }
    data['default_statuses']= await Default_Status.find().lean().exec();
    data['space_id']= req.query.space_id
    console.log( data['default_statuses'])
 
    res.render('statusFormView', {'data':data});
})

statusController.post('/form',async (req,res)=>{
    console.log(req.body)
    console.log(Array.isArray(req.body.status))
    
    let result;
    // Update workspace
    if(req.body._id){
    //    Status.findByIdAndUpdate(req.body._id, req.body, {new:true,lean:true},function (error,doc) {
    //        console.log(doc);
    //        res.redirect(`/dashboard?space_id=${req.body._id}`);
    //     })        
    }else{
        // Create new workspace
        try {
            let statuses=[]
                if(Array.isArray(req.body.status)){
                    let names=req.body.status
                    let colors=req.body.color
                    for (let i = 0; i < names.length; i++) {
                        let status = new Status({'status':names[i],'color':colors[i],'orderindex':i,'type':req.body.template_name})
                        status.name=names[i];
                        status.color=colors[i];
                        status.orderindex=i;
                        status.type=req.body.template_name;
                        statuses.push(status) 
                    }
                    console.log(statuses)
                }

            let status_template= new Status_template();
            status_template.name=req.body.template_name
            status_template.statuses=statuses
            console.log(status_template);
            Workspace.findByIdAndUpdate(req.body.space_id, {'custom_statuses':status_template}, 
            {new:true,lean:true},function (error,doc) {
                       console.log(doc);
                       res.redirect(`/dashboard?space_id=${doc._id}`);
                })
        } catch (error) {
            
        }
    }

})

statusController.get('/delete', async(req,res)=>{
    try {
        Workspace.findByIdAndDelete(req.query._id).exec()
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error);
    }

})





module.exports =  statusController;

