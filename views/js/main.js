function changeViewStructure(){
    console.log("hello")
     // Change the structure either list view or board view for tasks
  document.getElementById('structureBtns').addEventListener("click",(e)=>{
    
   let structure  = document.getElementById('#structure');
 
   if(e.target.id=='boardview' && structure.classList.contains('flex-column')){
     data="flex-row"
     structure.classList.replace('flex-column',data)
     console.log(e.target.id)
   }else if(e.target.id=='listview' &&  structure.classList.contains('flex-row')){
     data="flex-column"
     structure.classList.replace('flex-row',data)
     console.log(e.target.id)
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


document.addEventListener("DOMContentLoaded", () => {
//    navtemplate();
   // Had to call method twice due to js event propagatio to eliminate cicking twice to activate
   changeViewStructure();
   addStatus;
   removeStatus;
//    changeViewStructure();
});