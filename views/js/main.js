function parseCookie(cookie){
  var obj= Object.fromEntries(document.cookie.split(/; */).map(c => {
    const [ key, v ] = c.split('=', 2);
    return [ key, decodeURIComponent(v) ];
  }));
   return obj
 }

function changeViewStructure(){
  let structureBtns=document.getElementById('structureBtns')
  if (!structureBtns) {
    return
  }
  // Change the structure either list view or board view for tasks
  structureBtns.addEventListener("click",(e)=>{
    
   let structure  = document.getElementById('#structure');
 
   if(e.target.id=='boardview' && structure.classList.contains('flex-column')){
     data="flex-row"
     structure.classList.replace('flex-column',data)
   }else if(e.target.id=='listview' &&  structure.classList.contains('flex-row')){
     data="flex-column"
     structure.classList.replace('flex-row',data)
   }else{
     structure.classList.add('flex-row')
   }
  
 })
  }

function addStatus() {
    let sContainer= document.getElementById('#statusContainer')
    var labelStatus = document.createElement("label");
    labelStatus.innerHTML='Status:'
    var inputStatus= document.createElement("input");
    inputStatus.setAttribute("type", "text");
    inputStatus.setAttribute("name", "[status]");
    inputStatus.setAttribute("placeholder", "Enter status");
    var labelColor = document.createElement("label");
    labelColor.innerHTML='Color: '
    var inputColor = document.createElement("input");
    inputColor.setAttribute("name", "[color]");
    inputColor.setAttribute("data-jscolor", "{format:'hex',backgroundColor: '#333'}");
    var spanDelete = document.createElement("span");
    spanDelete.setAttribute("onclick", "removeStatus(this)");
    spanDelete.innerHTML='<i class="fas fa-times text-danger p-2" data-bs-toggle="tooltip" data-bs-placement="bottom" title="Remove Status></i>'
 
    var div = document.createElement("div");
    div.appendChild(labelStatus);
    // div.appendChild (document.createTextNode (" "));
    div.appendChild(inputStatus);
    // div.appendChild (document.createTextNode (" "));
    div.appendChild(labelColor);   
    // div.appendChild (document.createTextNode (" "));
    div.appendChild(inputColor);
    // div.appendChild (document.createTextNode (" "));
    div.appendChild(spanDelete);

    sContainer.appendChild(div)

    var myPicker = new JSColor(inputColor, {format:'hex',backgroundColor: '#333'});
    myPicker.show()
}

function removeStatus(el) {
  el.parentElement.remove()
}

function addActiveLi(li){
  // Select all list items 
  var listItems = li.parentElement.children; 
  // Remove 'active' tag for all list items 
  for (let i = 0; i < listItems.length; i++) { 
      listItems[i].classList.remove("active"); 
  } 
  
  // Add 'active' tag for currently selected item 
  li.classList.add("active"); 
}

function changeSelectColor(el) {
  el.style.color = el.options[el.selectedIndex].style.color;
}

 let ws_action ={
  'ASSIGNEE_ADD':(tasks,el)=>{
    let li= tasks.map((task)=>{
        return`
          <li class="my-2 d-flex flex-row justify-content-between" style="min-width: 100px;">
          <a class="button d-inline m-1 p-1 " href="/task/form?_id=${task._id}">${task.name}</a>
          <span class="badge m-1 p-1" style="background-color:${task.status.color}">${task.status.status}</span>
          </li>
        `}).join('');
      el.innerHTML+=li;

      // Then fire notification
      let notifications=tasks.map((task)=>{
        return {'text':`You been assigned ${task.name}`,'time':task.updated_at}
      })

      toastNotification(notifications).then(notificationsEl=>{
        notificationsEl.innerHTML='';
      })
  },
  'ASSIGNEE_REMOVE':(tasks)=>{
    let notifications=tasks.map((task)=>{
      return {'text':`You been unassigned from ${task.name}`,'time':task.updated_at}
    })

    toastNotification(notifications).then(notificationsEl=>{
      notificationsEl.innerHTML='';
    })
  },
  'TASK_UPDATE':(tasks)=>{
    let notifications=tasks.map((task)=>{
      return {'text':`${task.updated_by.name} edited ${task.name}`,'time':task.updated_at}
    })

    toastNotification(notifications).then(notificationsEl=>{
      notificationsEl.innerHTML='';
    })
  }
}



async function saveTask(el) {
  let url=`https://connect-task-mangement.herokuapp.com/task/form`
  if (window.location.hostname==='localhost') {
    url=`http:///localhost:3000/task/form`
  }
 
  let formData = new FormData(el)
  let data={}
  if(window.location.search.includes('?_id=')){
    data.updated_by=parseCookie(document.cookie).token
  }else{
    let reqUrl= new URL(window.location.href)
    data.workspace=reqUrl.searchParams.get('space_id');
    data.project=reqUrl.searchParams.get('project_id');
    data.created_by=parseCookie(document.cookie).token;
  }
  
  for(var pair of formData.entries()) {
    data[pair[0]]=pair[1]
    if (pair[0]==="assignees") {
      data[pair[0]]=[...formData.getAll(pair[0])]
    }
 }


  await axios({ method: 'post', url ,data });
  websocketCheck().then(socket=>{
    if(data.assignees){
      socket.send(JSON.stringify({action:'ASSIGNEE_ADD',data:data}))
    }
    if(data.updated_by){
      socket.send(JSON.stringify({action:'TASK_UPDATE',data:data}))
    }
    setTimeout(location.reload(),5500);
  })

}

async function removeAssignee(assignee_id,task_id){
  let data={assignee_id,task_id}
  let url=`https://connect-task-mangement.herokuapp.com/task/remove_assignee?assignee_id=${assignee_id}&task_id=${task_id}`
  if (window.location.hostname==='localhost') {
    url=`http:///localhost:3000/task/remove_assignee?assignee_id=${assignee_id}&task_id=${task_id}`
  }
  await axios({ method: 'get', url});

  await websocketCheck();
  let socket =await websocketCheck();
  socket.send(JSON.stringify({action:'ASSIGNEE_REMOVE',data:data}));
  location.reload();
}


function websocketInit({max,start,interval,timeout}) { 
  if (!document.__socket) {
    document.__socket=  new WebSocket(`ws://${window.location.host}/ws/task?token=${parseCookie(document.cookie).token}`); 
  }

  document.__socket.addEventListener('open',(event)=>{
    console.log("Connected")
    if (timeout) {
      clearTimeout(timeout)
    }
  })

  document.__socket.addEventListener('message',(event)=>{
    console.log("message")
    let res = JSON.parse(event.data)
    if (res.action==='ASSIGNEE_ADD') {
      ws_action.ASSIGNEE_ADD(res.data,document.getElementById("#assigned_tasks_list"))
    }else if(res.action==='ASSIGNEE_REMOVE'){
      ws_action.ASSIGNEE_REMOVE(res.data,document.getElementById("#assigned_tasks_list"))
    }else if(res.action==='TASK_UPDATE'){
      ws_action.TASK_UPDATE(res.data)
    }

  })

  document.__socket.addEventListener('error', function (event) {
    console.log('Error ocurred .Reconnecting....');
    document.__socket.close()
  })

  document.__socket.addEventListener('close', (event) => {
    console.log('The connection has been closed successfully.Reconnecting....');
    timeout= setTimeout(()=>{
        console.log(`Reconnecting.... in ${start}ms`)
        document.__socket=null
        websocketInit({max,start,interval})
      },Math.min(max,(start+=interval)))
  });

}

function websocketCheck(){
 return new Promise((resolve,reject) => {
      if (document.__socket && document.__socket.readyState===1) {
        resolve(document.__socket)
      }else{
       reject()
      }
      
  })
}

function toastNotification(notifications) {
  // Show notification
  let notificationEl = document.getElementById("#toast_notifications");
  notificationEl.innerHTML+=notifications.map((notification)=>{
    return`
         <div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
          <div class="toast-header">
            <img src="../images/connect_logo.png" class="rounded me-2" style="width: 20px;" alt="...">
            <strong class="me-auto">Connect</strong>
            <small class="text-muted">${moment(notification.time).fromNow()}</small>
            <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
          </div>
          <div class="toast-body">
           ${notification.text}
          </div>
        </div>`;
  }).join('');
  
    $(document).ready(function() {
      $(".toast").toast('show');
    });
    

    return new Promise(resolve => {
      setTimeout(()=>{
        resolve(notificationEl)
       },3000)
    })
}





document.addEventListener("DOMContentLoaded", () => {
  document.__socket=null
   // Had to call method twice due to js event propagatio to eliminate cicking twice to activate
   changeViewStructure();
   addStatus;
   removeStatus;
   addActiveLi;
   websocketInit({max:10000,start:2000,interval:2000,timeout:null})
});