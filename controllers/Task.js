// PULL all data in here from store

class TaskController {
    static async taskView(req,res){
        res.render('taskview', {'name':'John'});
    }
//   static async register(req, res) {
//     try {
//       let payload = await AccountStore.register(req);
//       res.send(payload);
//     } catch(exception) {
//       res.status(500).send(exception)
//     }
//   }


//   static async getAll(req, res) {
//     try {
//       let payload = await AccountStore.getAllUsers(req);
//       res.send(payload);
//     } catch(exception) {
//       res.status(500).send(exception)
//     }
//   }
}

module.exports =  TaskController;
