
const variables = require('./modules/variables');
const init = require('./modules/login');
const loginByEmail = require('./modules/login');
const getAllTweets = require('./modules/tweets');

variables.router
  .on('/', init)
  .on('/admin', loginByEmail)
  .on('/admin-tweets', getAllTweets)
  .resolve();
