

class Routes {
    
   static async init(app){
    

    var Task = require('../controllers/Task.js');
    app.use('/task',Task)

    var Dashboard = require('../controllers/Dashboard.js');
    app.use('/dashboard',Dashboard)
    

        

    // NOT found error
    app.use(function(req, res, next){
        res.status(404).render('404_error_template', {layout: 'error'});
    });

    }

}


module.exports= Routes