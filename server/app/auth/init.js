var passport = require('passport');


module.exports = function() {

  passport.serializeUser(function(user, done) {
    done(null, user);
  });

  passport.deserializeUser(function(user, done) {
    done(null,user);
  });
};
