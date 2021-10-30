let User=require('../models/User.js')
var jwt = require('jsonwebtoken');

let secret =process.env.JWT_SECRET
class Authentication {
    static async login (req, res,next) {
      let email = req.body.email;
      let password = req.body.password;
      // For the given username fetch user from DB
     let found_user= await User.findOne({'email':email}).exec()
  
        if (found_user) {
            if (email === found_user.email && password === found_user.password) {
                let token = jwt.sign(JSON.parse(JSON.stringify(found_user)),secret); 
                found_user.token=token;
                await found_user.save()
                if (req.baseUrl.indexOf('api')===-1) {
                    res.cookie('user',JSON.parse(JSON.stringify(found_user)), { signed: true })
                    res.cookie("token" ,encodeURIComponent(token))
                    res.redirect("/dashboard")  
                }else{
                    res.json(found_user)
                }
                          
            } else {
                //For incorrect user credentials
                if (req.baseUrl.indexOf('api')===-1) {
                    res.render("loginView",{layout:'homepage','errorMsg':'Incorrect email or passowrd'})
                }else{
                    res.status(401).json({'errorMsg':'Incorrect email or passowrd'})
                }
            }
            }else{
                 //For user not Found
                 if (req.baseUrl.indexOf('api')===-1) {
                    res.render("loginView",{layout:'homepage', 'errorMsg':'Create an Account'})
                }else{
                    res.status(401).json({'errorMsg':'Create an Account'})
                }
        } 
    }
    static async signup(req,res,next){
        const new_user=new User(req.body);
        let a = await new_user.save()
        res.cookie('user', new_user.toJSON(), { signed: true }).redirect('/dashboard')
    }
    static async check (req, res,next) {
        let found_user= await User.findOne({'token':req.cookies.token}).exec()
        if(found_user){
           next();
        }else{
            res.status(401).render('404_error_template', {layout: 'error','errorMsg':'Unauthorised User please signin'});
        }
    }
    static async checkApiToken (req, res,next) {
        let token=req.headers.authorization || req.signedCookies.token
        let found_user= await User.findOne({'token':token}).exec()

        jwt.verify(token, secret, (err, data) => {
            if (err) {
                return res.sendStatus(403);
            }
            if (!found_user) {
                return res.sendStatus(403);
            }
            req.user = data;
            next();
        });
          
    }

    static async logout(req,res,next){
        let token=req?.signedCookies?.user?.token ||req?.headers?.authorization
        let found_user= await User.findOne({'token':token}).exec()

        console.log(found_user)
        if(found_user){
            found_user.token='';
            await found_user.save()
            // Check if is a api call
            if (req.baseUrl.indexOf('api')===-1) {
                res.cookie('user', '', {expires: new Date(0)})
                res.cookie('token','',{expires: new Date(0)})
                .redirect('/home')
            }else{
                res.sendStatus(200)
            }
        }else{
            res.sendStatus(200);
        }
    }
    
    static async apiTokenExpire(req,res,next){
        let token=req.query.token || req.body.token
        let found_user= await User.findOne({'token':token}).exec()
        found_user.token='';
        await found_user.save()
        res.status(200);
        res.end()
    }
  }

  module.exports= Authentication