var express = require('express')
var workspaceController = express.Router()
let Workspace = require('../models/Workspace.js')
let User = require('../models/User.js')
let Default_Status = require('../models/Default_status.js')
let Task = require('../models/Task.js')
let Project = require('../models/Project.js')
let mnemonicId = require('mnemonic-id');
let emailTemplate = require('../helpers/emailTemplate');

const nodemailer = require("nodemailer");


workspaceController.get('/form',async(req,res)=>{
    let data={};
    if(req.query._id){
        let space = await Workspace.findById(req.query._id).lean().exec()
        data['space']=space; 
    }
    data['default_statuses']= await Default_Status.find().lean().exec();
 
    res.render('workspaceFormView', {'data':data});
})

workspaceController.post('/form',async (req,res)=>{
    let result;
    // Update workspace
    if(req.body._id){
       Workspace.findByIdAndUpdate(req.body._id, req.body, {new:true,lean:true},function (error,doc) {
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
            res.redirect(`/dashboard?space_id=${results._id}`);
        } catch (error) {
            
        }
    }

})

workspaceController.get('/delete', async(req,res)=>{
    try {
        let space_id=req.query._id
        Workspace.findByIdAndDelete(req.query._id).exec()
        await Project.remove({'workspace':space_id}).exec()
        await Task.remove({'workspace':space_id}).exec()
        res.redirect('/dashboard')
    } catch (error) {
        console.log(error);
    }

})

workspaceController.get('/invite',async(req,res)=>{
    let data={};
    data['space_id']=req.query._id;
    data['user']=req.signedCookies.user;
    res.render('inviteFormView',{'data':data})
})

workspaceController.post('/invite',async(req,res)=>{

    let user={email:"connect0440@outlook.com", pass:"ConnectPms44"}


    let space = await Workspace.findById(req.body.space_id).lean().exec()
    let mail={
        subject: `Connect! Join ${req.body.inviter_name}  on ${space.name}`,
        from :'connect0440@outlook.com',
        to:req.body.invitees.split(' ').join(", "),
        html:emailTemplate('#',space.join_code),
    }


    // process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";
    let transporter = nodemailer.createTransport({
        service: "Outlook",
        auth: {
            user:user.email,
            pass: user.pass
        },
        tls:{
            rejectUnauthorized:false
        }
    });
    
    let info = await transporter.sendMail(mail);
    console.log(info);
    res.redirect('/dashboard')
})

workspaceController.get('/join',async (req,res)=>{
    let data={}
    data['user']=req.signedCookies.user
    res.render('joinFormView',{'data':data})
})
workspaceController.post('/join', async(req,res)=>{
    let data={}
    let user= await User.findById(req.body.user_id).exec()
    let space= await Workspace.findOne({'join_code':req.body.join_code.trim()}).exec()
    let userInSpace= space.members.find(member=>{
        return member._id.toString() === user._id.toString()
    })
    console.log(userInSpace)
    if(!userInSpace){
        space.members.push(user)
        await space.save()
        res.redirect('/dashboard')
    }else{
        data['errorMsg']='Already a Memebr of this Workspace';
        res.render('joinFormView',{'data':data})
    }
    

    
})




module.exports =  workspaceController;

