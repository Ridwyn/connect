var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var handlebars  = require('express-handlebars');
var morgan = require('morgan')

const mongoose = require('mongoose')





var app = express();
var secret='123'

// Response ime logging
app.use(morgan('dev'))

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
    helpers:require('./helpers/handlebars.js')
}));



// app.listen(port, () => console.log(`App listening to port ${port}`));

const PORT = process.env.PORT || '3000';
const start = async() => {
	try{
    // CONNECT TO MONGODB
    const url = "mongodb+srv://ridwyn97:ridwyn97@realmcluster.ukvwr.mongodb.net/connect-app?retryWrites=true&w=majority";
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
        var routes = require('./routes/routes.js');
        routes.init(app)
		app.listen(PORT, () => console.log(`App initialised, and listening on port ${PORT}`));
        app.timeout=60000;
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
// Display task on dashoard
// Implemet status feature
// Implement priority feature
// implement members join