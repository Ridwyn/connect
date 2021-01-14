
class Routes {

   static async init(app){
        var Dashboard = require('../controllers/Dashboard.js');
        app.use('/dashboard', Dashboard.home);

        var Task = require('../controllers/Task.js');
        app.use('/task', Task.taskView);


        // NOT found error
        app.use(function(req, res, next){
            res.status(404).render('404_error_template', {layout: 'error'});
        });

    }
}


module.exports= Routes