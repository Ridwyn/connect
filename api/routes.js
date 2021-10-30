var express = require('express');
var app = express();

var auth = require(__appRoot+'/auth/authentication.js')

//Authentications
app.use('/login',auth.login)
app.use('/signup',auth.signup)
app.use('/logout',auth.logout)

//Projects
var project = require('./internal/Project.js')
app.use('/project',auth.checkApiToken,project)

//Spaces
var space = require('./internal/Workspace.js')
app.use('/space',auth.checkApiToken,space)

//Spaces
var task = require('./internal/Task.js')
app.use('/task',auth.checkApiToken,task)


module.exports= app