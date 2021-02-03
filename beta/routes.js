var express = require('express');
var app = express();


// Authentication
var auth= require('../auth/authentication.js')
app.use('/loginpage',(req,res,next)=>{res.render('loginView',{layout:'homepage'})})
app.use('/login',auth.login)
app.use('/signuppage',(req,res,next)=>{res.render('signupView',{layout:'homepage'})})
app.use('/signup',auth.signup)
app.use('/logout',auth.logout)


// Home routes
var Home = require('./controllers/Home.js')
app.use('/home',Home)
app.use('/',Home)

// Dashboard
var Dashboard = require('./controllers/Dashboard.js');
app.use('/dashboard',auth.check, Dashboard)   

// Workspace
var Workspace=require('./controllers/Workspace.js')
app.use('/workspace',auth.check,Workspace)

// Projects
var Project=require('./controllers/Project.js')
app.use('/project',auth.check,Project)  


// Tasks
var Task = require('./controllers/Task.js');
app.use('/task',auth.check,Task)

// Status
var Status = require('./controllers/Status.js');
app.use('/status',auth.check,Status)





module.exports= app