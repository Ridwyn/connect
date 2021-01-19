

class Routes {
    
   static async init(app){
    var auth= require('../auth/authentication.js')
    app.use('/loginpage',(req,res,next)=>{res.render('login')})
    app.use('/login',auth.login)
    app.use('/logout',auth.logout)



    var Dashboard = require('../controllers/Dashboard.js');
    app.use('/dashboard',auth.check, Dashboard)   
    
    var Task = require('../controllers/Task.js');
    app.use('/task',auth.check,Task)

        

    // NOT found error
    app.use(function(req, res, next){
        res.status(404).render('404_error_template', {layout: 'error','errorMsg':'Sorry no Page found'});
    });

    }

}


module.exports= Routes