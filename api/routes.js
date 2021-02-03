var express = require('express');
var app = express();

var auth = require('../auth/authentication.js')

//Projects
var project = require('./internal/Project.js')
app.use('/project',auth.checkApiToken,project)


module.exports= app