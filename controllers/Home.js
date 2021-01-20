

var express = require('express')
var homeController = express.Router()


homeController.get('/',(req,res)=>{
    res.render('home', {layout:'homepage','name':'req.signedCookies.user.username'});
})

module.exports =  homeController;



module.exports=homeController