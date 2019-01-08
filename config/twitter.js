//http://www.passportjs.org/packages/passport-twitter/
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
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

var trustProxy = false;
if (process.env.DYNO) {
    // Apps on heroku are behind a trusted proxy
    trustProxy = true;
}

passport.use(new TwitterStrategy({
    consumerKey: keys.twitter.consumerKey,
    consumerSecret: keys.twitter.consumerSecret,
    callbackURL: '/auth/twitter/redirect',
    proxy: trustProxy
}, function (token, tokenSecret, profile, done) {
   
    User.findOne({twitterId: profile.id}).then((currentUser) => {
        if(currentUser){
            console.log('user exists: ', currentUser);
            done(null, currentUser);
        } else {
            new User({
                twitterId: profile.id,
                username: profile.displayName,
                profileImage : profile.photos[0].value,
                socialNetwork : 'twitter'
            }).save().then((newUser) => {
                console.log('new user created: ', newUser);
                done(null, newUser);
            });         
        }
    });
}));