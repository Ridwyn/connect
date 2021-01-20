var express = require('express')
var workspaceController = express.Router()


workspaceController.get('/form',(req,res)=>{
    res.render('workspaceform', {'name':'req.signedCookies.user.username'});
})

module.exports =  workspaceController;





module.exports=workspaceController