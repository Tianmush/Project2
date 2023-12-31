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
  app.get('/getAllUsers', mid.requiresLogin, controllers.Tweet.getAllUsers);
 
  app.post('/addFriend', mid.requiresLogin, controllers.Friend.addFriend);
  app.get('/getFriends', mid.requiresLogin, controllers.Friend.getFriends); // Add this line

  // Add these two lines for selecting and deleting friends
  app.post('/selectFriend/:friendId', mid.requiresLogin, controllers.Friend.selectFriend);
  app.delete('/deleteFriend/:friendId', mid.requiresLogin, controllers.Friend.deleteFriend);

  app.get('/getTweetsForFriend/:friendId', mid.requiresLogin, controllers.Tweet.getTweetsForFriend);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
