let User=require('../models/User.js')
class Authentication {
    static async login (req, res,next) {
      let email = req.body.email;
      let password = req.body.password;
      // For the given username fetch user from DB
     let found_user= await User.findOne({'email':email}).exec()
  
      if (found_user) {
        if (email === found_user.email && password === found_user.password) {
            res.cookie('user',found_user.toJSON(), { signed: true })
            .redirect("/dashboard")
        } else {
            res.render("loginView",{layout:'homepage','errorMsg':'Incorrect email or passowrd'})
            }
        }else{
                res.render("loginView",{layout:'hompage', 'errorMsg':'Create an Account'})
            } 
    }
    static async signup(req,res,next){
        const new_user=new User(req.body);
        let a = await new_user.save()
        res.cookie('user', new_user.toJSON(), { signed: true }).redirect('/dashboard')
    }
    static async check (req, res,next) {
        if(req.signedCookies.user){
            next()
        }else{
            res.status(401).render('404_error_template', {layout: 'error','errorMsg':'Unauthorised User please signin'});
        }
    }

    static async logout(req,res,next){
        res.cookie('user', '', {expires: new Date(0)})
        .redirect('/home')
    }
  }

  module.exports= Authentication