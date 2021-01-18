// PULL all data in here from store


var express = require('express')
var taskController = express.Router()

taskController.get('/',(req,res)=>{
    res.render('taskview', {'name':'John'});

})


module.exports =  taskController;
