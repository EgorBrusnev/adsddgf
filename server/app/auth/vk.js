var passport = require('passport');
var vkStrategy = require('passport-vkontakte').Strategy;

var config = require('./oauth.js');
var init = require('./init');

passport.use(new vkStrategy({
	clientID:     config.vk.clientID, // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
    clientSecret: config.vk.clientSecret,
    callbackURL: config.vk.callbackURL
},function(accessToken, refreshToken, params, profile, done){
	return done(null,profile);

}));