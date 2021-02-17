var express = require('express')
var statusController = express.Router()
let Workspace = require(__appRoot+'/models/Workspace.js')
let Default_Status = require(__appRoot+'/models/Default_status.js')
let Status = require(__appRoot+'/models/_Status.js')
let Status_template = require(__appRoot+'/models/Status_template.js')
const mnemonicId = require('mnemonic-id');
const mongoose = require('mongoose');


statusController.get('/form',async(req,res)=>{
    let data={};
    if(req.query._id){
        let space = await Workspace.findOne({'custom_statuses._id':req.query._id}).lean().exec()
        for (let i = 0; i < space.custom_statuses.length; i++) {
            if(space.custom_statuses[i]._id==req.query._id){
                space['custom_status']=space.custom_statuses[i]
                data['space']=space
                console.log(space);
            }
        }
    }else{
        data['default_statuses']= await Default_Status.find().lean().exec();
        data['space']= await Workspace.findById(req.query.space_id).lean().exec()
    }
    
 
 
    res.render('statusFormView', {'data':data});
})

statusController.post('/form',async (req,res)=>{
    console.log(req.body)
    console.log(Array.isArray(req.body.status))
    
    let result;
        try {
            let space = await  Workspace.findById(req.body.space_id).exec()
            if(req.body._id && req.body.space_id){
                console.log(req.body)
                // Remove status_template in array if found using id
                // space.custom_statuses.pull({'_id':req.body._id})
                // await space.save()

                let statuses=[]
                if(Array.isArray(req.body.status)){
                    let names=req.body.status
                    let colors=req.body.color                    
                    for (let i = 0; i < names.length; i++) {
                        let status = new Status()
                        status.status=names[i];
                        status.color=colors[i];
                        status.orderindex=i;
                        status.type=req.body.template_name;
                        statuses.push(status) 
                    }
                }else{
                    let status = new Status()
                        status.status=req.body.status;
                        status.color=req.body.color;
                        status.orderindex=0;
                        status.type=req.body.template_name;
                    statuses.push(status) 
                }


                // Create template for status
                let status_template= new Status_template();
                status_template.name=req.body.template_name
                status_template.statuses=statuses;


                Workspace.update( { "_id" : req.body.space_id, "custom_statuses._id": req.body._id },
                 { "$set": { "custom_statuses.$.statuses": statuses,"custom_statuses.$.name": req.body.template_name}}, 
                 function(err, doc) { console.log(doc)
                    res.redirect(`/dashboard?space_id=${space._id}`)
                 })
            }else{
            
             // Create new custom_status for workspace
            let statuses=[]
                if(Array.isArray(req.body.status)){
                    let names=req.body.status
                    let colors=req.body.color                    
                    for (let i = 0; i < names.length; i++) {
                        let status = new Status()
                        status.status=names[i];
                        status.color=colors[i];
                        status.orderindex=i;
                        status.type=req.body.template_name;
                        statuses.push(status) 
                    }
                }else{
                    let status = new Status()
                        status.status=req.body.status;
                        status.color=req.body.color;
                        status.orderindex=0;
                        status.type=req.body.template_name;
                    statuses.push(status) 
                }


            // Create template for status
            let status_template= new Status_template();
            status_template.name=req.body.template_name
            status_template.statuses=statuses;

            space.custom_statuses.push(status_template)
            await space.save()
            res.redirect(`/dashboard?space_id=${space._id}`)
            }
        } catch (error) {
            console.log(error);
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

