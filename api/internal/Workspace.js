const express = require('express')
const spaceRouter = express.Router()
const Workspace = require(__appRoot+'/models/Workspace.js')
const Project = require(__appRoot+'/models/Project.js')
const Task = require(__appRoot+'/models/Task.js')
const User = require(__appRoot+'/models/User.js')
const mnemonicId = require('mnemonic-id');

spaceRouter.get('/getList', async (req,res)=>{
    let loggedInUser=await User.findOne({'token':req.headers.authorization}).lean().exec()
    let spaces =await Workspace.find({'members':req.user._id}).populate('members').exec();
    spaces.forEach(space => {
        space.checkCanEdit(loggedInUser._id,function (err, doc) {
        })
        space.checkCanDelete(loggedInUser._id,function (err, doc) {
        })
        space.checkCanLeave(loggedInUser._id,function (err, doc) {
        })
    });


    res.json(JSON.stringify(spaces))
    res.end()
})

spaceRouter.get('/getItem/:space_id/', async (req,res)=>{
    let loggedInUser=await User.findOne({'token':req.headers.authorization}).lean().exec()
    let space=await Workspace.findById(req.params.space_id).exec();
    // Handle checks for access level
     space.checkCanEdit(loggedInUser._id,function (err, doc) {})
     space.checkCanDelete(loggedInUser._id,function (err, doc) {})
    res.json(space)
    res.end()
})

spaceRouter.post('/saveForm',async (req,res)=>{
    let loggedInUser=await User.findOne({'token':req.headers.authorization}).lean().exec()


    // Update workspace
    if(req.body._id){
       Workspace.findByIdAndUpdate(req.body._id, req.body, {new:true,lean:true},function (error,doc) {
        res.status(200)
        res.json(doc);
        res.end()
        })
    }else{
        // Create new workspace
        try {
            let new_workspace=new Workspace(req.body)
            new_workspace.created_by= loggedInUser
            new_workspace.join_code=mnemonicId.createUniqueNameId();
            new_workspace.members=[loggedInUser._id];
            new_workspace.usersAllowedToEdit=[loggedInUser._id];
            new_workspace.usersAllowedToDelete=[loggedInUser._id];
            results=await new_workspace.save()
            res.status(200)
            res.json(JSON.stringify(new_workspace));
            res.end()
        } catch (error) {

        }
    }

})

spaceRouter.post('/joinSpace', async(req,res)=>{
  let space = await Workspace.findOne({'join_code':req.body.join_code.trim()}).exec()
//   Check if the user is in the space already before adding them
    let userInSpace= space.members.find(member=>{
        return String(member._id) === String(req.body.user_id)
    })
    // If user not in space add them and return json data
    if(!userInSpace){
        space.members.push(req.body.user_id);
        space.usersAllowedToLeave.push(req.body.user_id);

        let data= await space.save();
        res.status(200);
        res.json(data);
        res.end();
    }
    if (userInSpace) {
      res.status(200)
      res.json(space)
      res.end()
    }

})
spaceRouter.post('/leaveSpace', async(req,res)=>{
    const space= await Workspace.findById(req.body.space_id).lean().exec();
    const members ={members:space.members.filter(id=>(String(id ))!= String(req.body.user_id))};

    Workspace.findByIdAndUpdate(req.body.space_id, members, {new:true,lean:true}, function (error,doc) {
        res.status(200)
        res.json({})
        res.end()
     })


})
spaceRouter.post('/deleteItem', async(req,res)=>{
    let space_id=req.body.space_id
   await  Workspace.findByIdAndDelete(req.body.space_id).exec()
    await Project.remove({'workspace':space_id}).exec()
    await Task.remove({'workspace':space_id}).exec()
    res.status(200)
    res.json({})
    res.end()
})

module.exports= spaceRouter
