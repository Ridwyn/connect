var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var handlebars  = require('express-handlebars');
var morgan = require('morgan')
var cors = require('cors');
require('dotenv').config()

const mongoose = require('mongoose')


var app = express();


// CookieParser Secret
var secret=process.env.COOKIEPARSER_SECRET;

// Response time logging
app.use(morgan('dev'))

//Cors
app.use(cors());
app.options('*', cors());

// set JSON size limit
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({limit: '1mb', extended: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser(secret))

// NEEDED TO IMPORT CSS
app.use(express.static(__dirname+"/views"));

const port = 3000;

//Sets our app to use the handlebars engine
app.set('view engine', 'hbs');
//Sets handlebars configurations (we will go through them later on)
app.engine('hbs', handlebars({
    extname: '.hbs',
    layoutsDir: __dirname + '/views/layouts',
    helpers:require('./helpers/handlebars.js'),
    // ...implement newly added insecure prototype access
    // handlebars: allowInsecurePrototypeAccess(Handlebars),
}));



// app.listen(port, () => console.log(`App listening to port ${port}`));

const PORT = process.env.PORT || '3000';
const start = async() => {
	try{
    // CONNECT TO MONGODB
    const url = process.env.MONGODB_URL;
    await mongoose.connect(url, { 
      useNewUrlParser: true,
      useUnifiedTopology: true, 
      useCreateIndex:true,
      useFindAndModify:false ,
      })
    const db = mongoose.connection
    db.once('open', _ => {
      console.log('Database connected:', url)
    })
    
    db.on('error', err => {
      console.error('connection error:', err)
    })

      // Starting routing
      var beta = require('./beta/routes')
      app.use('/',beta)

      var api = require('./api/routes')
      app.use('/api',api)

      // NOT found error
      app.use(function(req, res, next){
        res.status(404).render('404_error_template', {layout: 'error','errorMsg':'Sorry no Page found'});
        });
        
      // app.listen(PORT, () => console.log(`App initialised, and listening on port ${PORT}`));
      
      // Use node https and attach express to use server timeout
      let server = require('http').createServer(app);    

      server.listen(PORT, () => console.log(`App initialised, and listening on port ${PORT}`));
      server.timeout=6000
      console.log(server.timeout);
	}catch(error){
		console.log(error);
	}
};
start();

// To do
// Create authentication  ##done
// Connect with mongoDB   ##done
// Start model structure   ##done
// Implement workspace crud ##done
// implement project crud ###done 
// implement simple task ##done
// Add custom statuses to project ##done
// Add status to task ##done
// Display task on dashoard ##done
// Implemet status feature ##done
// implement members join  ##done
//Implement unjoin from workspace ##done
//implement Access level canEdit, canDelete on Project and Workspace ##done
//implement task text editor for description ##done
// Implement assignee of task    ##done
// Implement due date of task    ##done
//implement task comments   ##done

//implement push notification update when a comment is made, task created etc


// Implement click on workspace and disyplay all task 
//Implement notes personal for users
// implement git database to asve attachment from task
// Implement createing a new repo
// implement creating files and folders to repo
// implement updating files and folders of repo
// implementing deletting files and folders
// implementing creating a master branch and feature branches etc feature A ref
// implement merging branches,

