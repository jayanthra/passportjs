//https://github.com/jaredhanson/passport-google-oauth2
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const keys = require('./keys');
const User = require('../models/user');

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id).then((user) => {
        done(null, user);
    });
});

passport.use(
    new GoogleStrategy({
        clientID: keys.google.clientID,
        clientSecret: keys.google.clientSecret,
        callbackURL: '/auth/google/redirect'
    }, (accessToken, refreshToken, profile, done) => {     
      
         User.findOne({googleId: profile.id}).then((currentUser) => {
            if(currentUser){
                console.log('user exists: ', currentUser);
                done(null, currentUser);
            } else {
                new User({
                    googleId: profile.id,
                    username: profile.displayName,
                    profileImage : profile.photos[0].value,
                    socialNetwork : 'google'
                }).save().then((newUser) => {
                    console.log('new user created: ', newUser);
                    done(null, newUser);
                });        
            }
        });
    })
);