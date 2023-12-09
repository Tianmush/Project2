const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getTweets', mid.requiresLogin, controllers.Tweet.getTweets);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/uchatpanel', mid.requiresLogin, controllers.Tweet.uchatpanelPage);
  app.post('/uchatpanel', mid.requiresLogin, controllers.Tweet.makeTweet);

  app.get('/getUserData', mid.requiresLogin, controllers.Tweet.getUserData);

  app.get('/searchUser', mid.requiresLogin, controllers.Tweet.searchUser);

  app.post('/addFriend/:friendId', mid.requiresLogin, controllers.Tweet.addFriend);


  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
