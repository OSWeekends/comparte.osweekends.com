// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('./sw.js')
//       .then(register => console.log('SW regitrado!'))
//       .catch(error => console.log(error));
//   });
// }

const router = require('./modules/variables');
const init = require('./modules/init');
const loginByEmail = require('./modules/loginByEmail');
const getAllTweets = require('./modules/getAllTweets');

router
  .on('/', init)
  .on('/admin', loginByEmail)
  .on('/admin-tweets', getAllTweets)
  .resolve();
