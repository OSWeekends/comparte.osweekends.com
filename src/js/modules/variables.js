const Navigo = require('navigo');

// module.exports.main =  document.querySelector('main');

// const rootDB = firebase.database().ref();
// module.exports.users = rootDB.child('users');

const root = null;
const useHash = true; // Defaults to: false
const hash = '#!'; // Defaults to: '#'
module.exports.router = new Navigo(root, useHash, hash);