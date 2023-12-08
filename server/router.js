const controllers = require('./controllers');
const mid = require('./middleware');

const router = (app) => {
  app.get('/getDomos', mid.requiresLogin, controllers.Tweet.getDomos);

  app.get('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
  app.post('/login', mid.requiresSecure, mid.requiresLogout, controllers.Account.login);

  app.post('/signup', mid.requiresSecure, mid.requiresLogout, controllers.Account.signup);

  app.get('/logout', mid.requiresLogin, controllers.Account.logout);

  app.get('/maker', mid.requiresLogin, controllers.Tweet.makerPage);
  app.post('/maker', mid.requiresLogin, controllers.Tweet.makeTweet);

  app.delete('/deleteDomo', controllers.Tweet.deleteDomo);

  app.get('/', mid.requiresSecure, mid.requiresLogout, controllers.Account.loginPage);
};

module.exports = router;
