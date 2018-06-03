var passport = require('passport');
var TwitterStrategy = require('passport-twitter').Strategy;


var config = require('./oauth.js');
var init = require('./init');
var database = require('./controllers/db.js');

passport.use(new TwitterStrategy({
    consumerKey: config.twitter.consumerKey,
    consumerSecret: config.twitter.consumerSecret,
    callbackURL: config.twitter.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("profile.displayName: ");
    console.log(profile.photos[0].value);

    var abcde = [];
    var str = profile.displayName.split(' ');
    console.log(str[0]);
    console.log(str[1]);
    var obj ={"email": profile.id,"name":str[0],"surname":str[1],"password":"********","photo": profile.photos[0].value,"status":"Enable"};
    abcde.push(obj);
    return done(null,abcde);
  }

));

init();


module.exports = passport;
