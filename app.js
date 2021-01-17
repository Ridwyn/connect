var express = require('express');
var bodyParser = require('body-parser');
var handlebars  = require('express-handlebars');
const path = require('path');


var app = express();

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



// NEEDED TO IMPORT CSS
app.use(express.static(__dirname+"/views/layouts"));

const port = 3000;

//Sets our app to use the handlebars engine
app.set('view engine', 'hbs');
//Sets handlebars configurations (we will go through them later on)
app.engine('hbs', handlebars({
    extname: '.hbs',
    layoutsDir: __dirname + '/views/layouts',
}));



// app.listen(port, () => console.log(`App listening to port ${port}`));

const PORT = process.env.PORT || '3000';
const start = async() => {
	try{
        // 
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
// Create authentication
// Connect with mongoDB
// Start model structure
// implement simple task