

class Routes {
    
   static async init(app){
    var auth= require('../auth/authentication.js')
    app.use('/loginpage',(req,res,next)=>{res.render('loginView',{layout:'homepage'})})
    app.use('/login',auth.login)
    app.use('/signuppage',(req,res,next)=>{res.render('signupView',{layout:'homepage'})})
    app.use('/signup',auth.signup)
    app.use('/logout',auth.logout)

    var Home = require('../controllers/Home.js')
    app.use('/home',Home)
    app.use('/',Home)

    var Dashboard = require('../controllers/Dashboard.js');
    app.use('/dashboard',auth.check, Dashboard)   

    var Workspace=require('../controllers/Workspace.js')
    app.use('/workspace',auth.check,Workspace)

    var Project=require('../controllers/Project.js')
    app.use('/project',auth.check,Project)  

    var Task = require('../controllers/Task.js');
    app.use('/task',auth.check,Task)



    // NOT found error
    app.use(function(req, res, next){
        res.status(404).render('404_error_template', {layout: 'error','errorMsg':'Sorry no Page found'});
    });

    }

}


module.exports= Routes