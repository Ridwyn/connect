var express = require('express')
var workspaceController = express.Router()


workspaceController.get('/form',(req,res)=>{
    console.log('from get route')
    console.log(req.body);
    res.render('workspaceform', {'data':'req.signedCookies.user.username'});
})

workspaceController.post('/form',(req,res)=>{
    console.log('from post route');
    console.log(req.body);
    res.render('workspaceform', {'data':'req.signedCookies.user.username'});
})

module.exports =  workspaceController;

