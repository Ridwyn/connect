const WebSocket = require('ws');
// const jwt = require('jsonwebtoken');
var ObjectId = require('mongodb').ObjectID;
const token_generate = require('../helpers/token_generate') 
const User = require(__appRoot+'/models/User.js');
const Task = require(__appRoot+'/models/Task.js');
const _users_connected = require(__appRoot+'/models/_Users_connected.js');

const WEBSOCKETCLIENTS={}

const wss1 = new WebSocket.Server({ noServer:true});
wss1.on('connection', async function connection(ws, request) {
    const baseURL = 'https://' + request.headers.host + '/';
    const reqUrl = new URL(request.url,baseURL);
    let token =reqUrl.searchParams.get('token')
    // terminate connection if no user_id was supplied
    if(!token){
        ws.terminate()
    }

    let _id=token_generate.decode({_id:token})
    // Have to strip quotes from string due to JSON Stringify in token generate
    _id=_id.split('"').join('')
    ws.user_id=_id
        
    // Fetch db and save current connected id
    let users_connected = await _users_connected.findOne({'websocket':'websocket'}).exec();
    users_connected.users.push(ws.user_id)
    await users_connected.save()

    // 
    ws.on('message',async(_data)=>{
    let res =JSON.parse(_data)
    console.log(res.action)
    if(res.action=='ASSIGNEE_ADD'){
        let task = res.data
        let hashAssignees= new Set(task.assignees.map((assignee)=>(assignee.toString())))
        wss1.clients.forEach(async function each(client) {
            let fnd=false;
            if (hashAssignees.has(client.user_id.toString())) {
                fnd=true;
            }
            
            if ( client.readyState === WebSocket.OPEN && fnd) { 
                // let assignedtasks= await Task.find({ 'assignees' :  client.user_id}).lean().exec();
                let fndtask= await Task.findById(task._id).lean().exec();
                client.send(JSON.stringify({action:'ASSIGNEE_ADD',data:[fndtask]}));
            } 
        });
     }
     if(res.action==='ASSIGNEE_REMOVE'){
        let task= res.data
        wss1.clients.forEach(async function each(client) {
           let fnd=false;
           if (task.assignee_id===client.user_id.toString()) {
               fnd=true;
           }
           
           if ( client.readyState === WebSocket.OPEN && fnd) { 
               // let tasks= await Task.find({ 'assignees' :  client.user_id}).lean().exec();
               let fndtask= await Task.findById(task.task_id).lean().exec();
               client.send(JSON.stringify({action:'ASSIGNEE_REMOVE',data:[fndtask]}));
           } 
        });
     }
     if(res.action=='TASK_UPDATE'){
         
        let task= await Task.findById(res.data._id).populate('updated_by').lean().exec();
        let hashAssignees= new Set(task.assignees.map((assignee)=>(assignee.toString())))        
        wss1.clients.forEach(async function each(client) {
           let fnd=false;
           if (hashAssignees.has(client.user_id.toString())) {
               fnd=true;
           }
           
           if ( client.readyState === WebSocket.OPEN && fnd) {
               client.send(JSON.stringify({action:'TASK_UPDATE',data:[task]}));
           } 
        });
     }

        
    });
    ws.on('close', ()=> {
        let user_ids=[];
        this.clients.forEach(c=>{
            user_ids.push(c.user_id)
        })
        // Remove id from db
       _users_connected.findOneAndUpdate({'websocket':'websocket'},{'users':user_ids},{new:true,lean:true}, function (error,doc) {
        });
   })
    
});


//    Make connected ids persistent store on mongodb

   module.exports=wss1