// PULL all data in here from store


var express = require('express')
var taskController = express.Router()

taskController.get('/',async (req,res)=>{
    res.render('taskView', {'name':'John'});

})

taskController.get('/form',async (req,res)=>{
    res.render('taskformView')
})


module.exports =  taskController;
