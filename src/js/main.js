const Navigo = require('navigo');
const init = require('./modules/init');
const loginByEmail = require('./modules/loginByEmail');
const getAllTweets = require('./modules/getAllTweets');

const root = null;
const useHash = true; // Defaults to: false
const hash = '#!'; // Defaults to: '#'
const router = new Navigo(root, useHash, hash);


router
  .on('/', init)
  .on('/admin', loginByEmail)
  .on('/admin-tweets', getAllTweets)
  .resolve();
