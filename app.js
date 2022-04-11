const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const handlebars  = require('express-handlebars');
const WebSocket = require('ws');
const morgan = require('morgan')
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const { Server } = require("socket.io");


const mongoose = require('mongoose')


const app = express();

global.__appRoot=path.resolve(__dirname);


// Response time logging
app.use(morgan('dev'))

//Cors
app.use(cors());
app.options('*', cors());

// set JSON size limit
app.use(bodyParser.json({limit: '1mb'}));
app.use(bodyParser.urlencoded({limit: '1mb', extended: true}));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser(process.env.COOKIEPARSER_SECRET))


// NEEDED TO IMPORT CSS
app.use(express.static(__dirname+"/views"));

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


const PORT = process.env.PORT || '4000';
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
      console.log('Database connected:')
    })

    db.on('error', err => {
      console.error('connection error:', err)
    })

      // Starting routing
      const beta = require('./beta/routes')
      app.use('/',beta)

      const api = require('./api/routes')
      app.use('/api',api)



      // NOT found error
      app.use(function(req, res, next){
        res.status(404).render('404_error_template', {layout: 'error','errorMsg':'Sorry no Page found'});
        });

      const server = require('http').createServer(app);

			// USING SOCKET IO TO CREAT WebSocketconst io = new Server(httpServer, { /* options */ });
			const io = new Server(server, { });
				io.on("connection", (socket) => {
					socket.emit("success", {'suceess':'sucess'});
					console.log(socket);
				});

      const task_websockets = require('./sockets/task.js')
      server.on('upgrade', function upgrade(request, socket, head) {
				try {
					const pathname = request.url;
					if (pathname.includes('/ws/task')) {
						task_websockets.handleUpgrade(request, socket, head, function done(ws) {
							task_websockets.emit('connection', ws, request);
						});
					}else{
						socket.destroy()
					}
				} catch (e) {
					console.log(e);
				}


      });

      server.listen(PORT, () => console.log(`App initialised, and listening on port ${PORT}`));

			process.on('uncaughtException', function (err) {
				server.close(() => {console.log('Process terminated')});
				process.exit(0);
			});
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

//implement push notification update when a comment is made, task created etc using websockets
//long polling heavy on server and lead to rapid increase of server
//so we offload it with websockets and emit ##done

//Bug on updating the notification itmes for tasks
// upload to heroku and test on live server


// Implement click on workspace and disyplay all task
//Implement notes personal for users
// implement git database to asve attachment from task
// Implement createing a new repo
// implement creating files and folders to repo
// implement updating files and folders of repo
// implementing deletting files and folders
// implementing creating a master branch and feature branches etc feature A ref
// implement merging branches,
//implement reference extension for importing references from my extension. i.e excite haravrd references
