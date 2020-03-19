//load modules
const express = require('express');
const Handlebars = require('handlebars');
const exphbs = require('express-handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');


 
const mongoose = require('mongoose');
const passport = require('passport');
const session = require("express-session");
const bodyParser = require("body-parser");
const cookieParser = require('cookie-parser');

//load the config where the mongodb connection string is set
const mykeys = require('./config/key.js');
//user collec
const User = require('./models/user');

require('./passport/google-passport');
require('./passport/facebook-passport');
require('./passport/instagram-passport');
var https = require('https');

//link helper functions
const {
  ensureAuthentication,
  ensureGuest
} = require('./helpers/auth');


//initialize application
const app = express();

//https
var fs = require('fs');
var sslserverport = 3002;

var httpsOptions = {
  key: fs.readFileSync('./key.pem'),
  cert: fs.readFileSync('./cert.pem')
};
https.createServer(httpsOptions, app).listen(sslserverport);


  
  app.use(cookieParser());
  app.use(bodyParser.urlencoded({ extended: false }));
  app.use(bodyParser.json());
  app.use(session({ secret: 'keyboard cat',
                    resave:true,
                    saveUninitialized:true
 }));
  app.use(passport.initialize());
  app.use(passport.session());

  //set global variables for user
  app.use((req, res, next) =>{
      res.locals.user = req.user || null;
      next();
  });

//setup template engine
app.engine('handlebars',exphbs({
    defaultLayout:'main',
    handlebars: allowInsecurePrototypeAccess(Handlebars)
}));

app.set('view engine','handlebars');

//set up static files to server css, js, images
app.use(express.static('public'));


mongoose.Promise = global.Promise;
//connect to remote db
mongoose.connect(mykeys.MongoURI, 
    {
    useNewUrlParser:true, useUnifiedTopology:true 
    } 
    )
.then( () => {
    console.log('Connected to remote dbase Online Dating App');
})
.catch( (err) => {
    console.log(err);
}
);

//set port environment variable
var port = process.env.PORT||3001;

app.listen(port,()=>{
    console.log('Server running on port ' + port);
});

//handle home route
app.get('/', ensureGuest, (req,res) => {
 
  res.render('home.handlebars');

});

//handle about route
app.get('/about',(req, res) => {
    res.render('about');
});

//Google auth
app.get('/auth/google',
  passport.authenticate('google', { 
      scope: ['profile', 'email'] 
    }));

app.get('/auth/google/callback', 
  passport.authenticate('google', { 
      failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/profile');
  });

//Facebook routes
app.get('/auth/facebook',
  passport.authenticate('facebook' , {
    scope:'email'
  }));

app.get('/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/profile');
  });

//Handle Instagram route
  app.get('/auth/instagram',
  passport.authenticate('instagram', { scope: 'user_profile'}
  ));

  app.get('/auth/instagram/callback', 
  passport.authenticate('instagram', { failWithError:true, 
                                       failureRedirect: '/' }),
  (req, res) => {
    // Successful authentication, redirect home.
    res.redirect('/profile');
  });


app.get('/profile', ensureAuthentication, (req,res) =>  {
    User.findById({_id:req.user._id
    }).then((user) => {
        res.render('profile', {
            user:user
        });
    })
    
});

//Handle Email POST
app.post('/addEmail', (req,res)=>{
  const email = req.body.email;
  User.findById({_id : req.user._id})
  .then((user) => {
    user.email = email;
    user.save()
    .then(() => {
      res.redirect('/profile');
    });
  });

});

//logout user
app.get('/logout', (req,res) => {
    req.logout();
    res.redirect('/');
});
