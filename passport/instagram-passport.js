const passport = require('passport');
const keys = require('../config/key');
const User = require('../models/user');
const InstagramStrategy = require('passport-instagram').Strategy;


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

  passport.use(new InstagramStrategy({
    clientID: keys.InstagramClientID,
    clientSecret: keys.InstagramClientSecret,
    callbackURL: "https://localhost:3002/auth/instagram/callback",
    proxy:true
  },
  (accessToken, refreshToken, profile, done) => {
   console.log(profile);
   User.findOne({instagram:profile.id})
   .then((user) => {
     if(user){
       done(null, user);
     }else{
       const newUsr = {
         instagram : profile.id,
         fullname : profile.username,
         firstname : profile.username.substring(0,5)     
       }
       new User(newUsr).save()
       .then((user) => {
         done(null,user);
       }) 
     }
   }).catch((err) => {
     console.log(err);
   })

  }
));