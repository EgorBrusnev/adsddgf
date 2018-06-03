var passport = require('passport');
var facebookStrategy = require('passport-facebook').Strategy;

var config = require('./oauth.js');
var init = require('./init');
var database = require('./controllers/db.js');

passport.use(new facebookStrategy({
    clientID: config.facebook.clientID,
    clientSecret: config.facebook.clientSecret,
    callbackURL: config.facebook.callbackURL
  },
  function(accessToken, refreshToken, profile, done) {
    console.log("profile.displayName: ");
    console.log(profile);

    // var abcde = [];
    // var str = profile.displayName.split(' ');
    // console.log(str[0]);
    // console.log(str[1]);
    // var obj ={"email": profile.id,"name":str[0],"surname":str[1],"password":"********","photo": profile.photos[0].value,"status":"Enable"};
    // abcde.push(obj);
    // return done(null,abcde);

  }
));

init();

module.exports = passport;