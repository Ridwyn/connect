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
document.addEventListener("DOMContentLoaded", () => {
//    navtemplate();
   // Had to call method twice due to js event propagatio to eliminate cicking twice to activate
   changeViewStructure();
//    changeViewStructure();
});