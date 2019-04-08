const Navigo = require('navigo');

const root = null;
const useHash = true; // Defaults to: false
const hash = '#!'; // Defaults to: '#'

const router = new Navigo(root, useHash, hash);
module.exports = router;