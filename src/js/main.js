const router = require('./modules/navigo');
const init = require('./modules/init');
const loginByEmail = require('./modules/loginByEmail');
const getAllTweets = require('./modules/getAllTweets');

router
  .on('/', init)
  .on('/admin', loginByEmail)
  .on('/admin-tweets', getAllTweets)
  .resolve();
