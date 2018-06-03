

var ids = {
  facebook: {
    clientID: '1828626613818670',
    clientSecret: 'c6ee54d2fb48948658b7d82915df38c3',
    callbackURL: 'http://localhost:8080/auth/facebook/callback'
  },
  twitter: {
    consumerKey: 'bLwRntRl93S9JEpYDZ3JV4Xdb',
    consumerSecret: 'jrsRKqpRuUqFYaQVvxJXo4FCiwbJbQuG9fFZLBrZcgMlTS6LX4',
    callbackURL: "http://localhost:8080/auth/twitter/callback"
  },
  vk: {
    clientID:     '6210386', // VK.com docs call it 'API ID', 'app_id', 'api_id', 'client_id' or 'apiId'
    clientSecret: '9eDmxsmh2irQcKUBbAI2',
    callbackURL:  "http://localhost:8080/auth/vkontakte/callback"
  }
};

module.exports = ids;
