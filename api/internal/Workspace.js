const express = require('express')
const spaceRouter = express.Router()
const Workspace = require(__appRoot+'/models/Workspace.js')
const Project = require(__appRoot+'/models/Project.js')
const Task = require(__appRoot+'/models/Task.js')
const User = require(__appRoot+'/models/User.js')
const StatusTemplate = require(__appRoot+'/models/Status_template')
const mnemonicId = require('mnemonic-id');

spaceRouter.get('/getList', async (req,res)=>{
  try {
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
  } catch (e) {
    console.log(e);
    res.status(404)
    res.end(); 
  }

})

spaceRouter.get('/getItem/:space_id/', async (req,res)=>{
  try {
    let loggedInUser=await User.findOne({'token':req.headers.authorization}).lean().exec()
    let space=await Workspace.findById(req.params.space_id).exec();
    // Handle checks for access level
     space.checkCanEdit(loggedInUser._id,function (err, doc) {})
     space.checkCanDelete(loggedInUser._id,function (err, doc) {})
    res.json(space)
    res.end()
  } catch (e) {
    console.log(e);
    res.status(404)
    res.end();
  }

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
          console.log(error);
          res.status(404)
          res.end();
        }
    }

})

spaceRouter.post('/joinSpace', async(req,res)=>{

  try {
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

  } catch (e) {
    console.log(e);
    res.status(404)
    res.end();
  }


})
spaceRouter.post('/leaveSpace', async(req,res)=>{
  try {
    const space= await Workspace.findById(req.body.space_id).lean().exec();
    const members ={members:space.members.filter(id=>(String(id ))!= String(req.body.user_id))};

    Workspace.findByIdAndUpdate(req.body.space_id, members, {new:true,lean:true}, function (error,doc) {
        res.status(200)
        res.json({})
        res.end()
     })
  } catch (e) {
    console.log(e);
    res.status(404)
    res.end();
  }


})
spaceRouter.post('/deleteItem', async(req,res)=>{
  try {
    let space_id=req.body.space_id
   await  Workspace.findByIdAndDelete(req.body.space_id).exec()
    await Project.remove({'workspace':space_id}).exec()
    await Task.remove({'workspace':space_id}).exec()
    res.status(200)
    res.json({})
    res.end()
  } catch (e) {
    console.log(e);
    res.status(404)
    res.end();
  }

})

spaceRouter.post('/custom_statuses', async(req,res)=>{
  try {
    let loggedInUser=await User.findOne({'token':req.headers.authorization}).lean().exec()
    let space = await Workspace.findOne({'_id':req.body.space_id.trim()}).exec()
    let [custom_status]=space.custom_statuses.filter(({_id})=>(String(_id ))== String(req.body.custom_status._id))

    if (custom_status) {
      console.log(custom_status);
      console.log('found');
      const index=  space.custom_statuses.findIndex(({_id})=>(String(_id)==String(custom_status._id)));
      space.custom_statuses.splice(index,1,req.body.custom_status)
      await space.save();
      res.status(200);
      res.json({});
      res.end();
    }
    if (!custom_status) {
       custom_status = new StatusTemplate(req.body.custom_status);
      let a =space.custom_statuses.push(custom_status);
        let b = await space.save();
        console.log(b);
        res.status(200)
              res.json(b)
              res.end()}

    } catch (e) {
    console.log(e);
    res.status(404)
    res.end();
  }


})

module.exports= spaceRouter
