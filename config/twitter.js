//http://www.passportjs.org/packages/passport-twitter/
const passport = require('passport');
const TwitterStrategy = require('passport-twitter').Strategy;
const keys = require('./keys');

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
}, function (token, tokenSecret, profile, cb) {
    // In this example, the user's Twitter profile is supplied as the user
    // record.  In a production-quality application, the Twitter profile should
    // be associated with a user record in the application's database, which
    // allows for account linking and authentication with other identity
    // providers.
    console.log(profile);
    //return cb(null, {});
}));