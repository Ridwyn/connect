class Authentication {
    static async loginPage(res,req){
        res.render('login')
    }
    static async login (req, res,next) {
      let username = req.body.email;
      let password = req.body.password;
      // For the given username fetch user from DB
      let mockedUsername = 'salihouridwyn@gmail.com';
      let mockedPassword = 'a';
  
      if (username && password) {
        if (username === mockedUsername && password === mockedPassword) {
            res.cookie('user', {username,password,loggedIn:true}, { signed: true })
            .redirect("/dashboard")
        } else {
            res.render("login",{layout:'homepage','errorMsg':'Incorrect username or passowrd'})
            }
        }
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