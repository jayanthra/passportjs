//http://www.passportjs.org/packages/passport-facebook/
const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;
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


passport.use(new FacebookStrategy({
    clientID: keys.facebook.clientID,
    clientSecret: keys.facebook.clientSecret,
    callbackURL: '/auth/facebook/redirect'
}, function (accessToken, refreshToken, profile, done) {   
    
    User.findOne({facebookId: profile.id}).then((currentUser) => {
        if(currentUser){
            console.log('user exists: ', currentUser);
            done(null, currentUser);
        } else {
            new User({
                facebookId: profile.id,
                username: profile.displayName,
                profileImage : profile.profileUrl? profile.profileUrl : "",
                socialNetwork : 'facebook'
            }).save().then((newUser) => {
                console.log('new user created: ', newUser);
                done(null, newUser);
            });         
        }
    });
}));