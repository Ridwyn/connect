const WebSocket = require('ws');
const User = require(__appRoot+'/models/User.js');
const Task = require(__appRoot+'/models/Task.js');
const _users_connected = require(__appRoot+'/models/_Users_connected.js');

const WEBSOCKETCLIENTS={}

const wss1 = new WebSocket.Server({ noServer:true});
wss1.on('connection', async function connection(ws, request) {
    console.log("connection estblish on wss1");
    const baseURL = 'https://' + request.headers.host + '/';
    const reqUrl = new URL(request.url,baseURL);
    let user_id=reqUrl.searchParams.get('user_id');
     ws.id=user_id;
    WEBSOCKETCLIENTS[user_id]=ws
    // Fetch db and save current connected id
    let users_connected = await _users_connected.findOne({'websocket':'websocket'}).exec();
    users_connected.users.push(user_id)
    await users_connected.save()


    ws.on('message',(_task)=>{
     let task =JSON.parse(_task)
     wss1.clients.forEach(async function each(client) {
       let fnd=false;
       for (let i = 0; i < task.assignees.length; i++) {
         if (task.assignees.indexOf(client.id.toString())!==-1) {
           fnd=true
         }
       }
       if ( client.readyState === WebSocket.OPEN && fnd) { 
           if (fnd) {
           let tasks= await Task.find({ 'assignees' :  client.id}).lean().exec();
             client.send(`assigned tasks:`+JSON.stringify(tasks));
           }
         } 
     });
        
    });
    ws.on('close', ()=> {
        let user_ids=[];
        this.clients.forEach(c=>{
            user_ids.push(c.id)
        })
        // Remove id from db
       _users_connected.findOneAndUpdate({'websocket':'websocket'},{'users':user_ids},{new:true,lean:true}, function (error,doc) {
        console.log('removed socket')
        });
   })
    
   });


//    Make connected ids persistent store on mongodb

   module.exports=wss1