const passport = require('passport');
const googleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user.js');
const keys = require('../config/key.js');


passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, user) {
      done(err, user);
    });
  });

passport.use(new googleStrategy({
    clientID: keys.GoogleClientID,
    clientSecret: keys.GoogleClientSecret,
    callbackURL: "/auth/google/callback",
    proxy:true
  },
  (accessToken, refreshToken, profile, done) => {
   console.log(profile);
   User.findOne({
       google: profile.id
   }).then((user) => {
       if(user){
           done(null,user)
       }else{
           const newUser = {
               google : profile.id,
               fullname : profile.displayName,
               lastname : profile.name.familyName,
               firstname : profile.name.givenName,
               image : profile.photos[0].value,
               email : profile.emails[0].value
           }
            new User(newUser).save()
            .then((user)=> {
                   done(null,user); 
            })
       }
   })
  }
));