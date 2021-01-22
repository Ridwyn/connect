// PULL all data in here from store

var express = require('express')
var dashboardController = express.Router()


dashboardController.get('/',(req,res)=>{
    res.render('dashboardView', {'user':req.signedCookies.user});
})

module.exports =  dashboardController;
