const router = require('./navigo');
const utils = require('./utils');
const notifications = require('./notifications');

const main =  document.querySelector('main');

function init() {
  firebase.auth()
    .getRedirectResult()
      .then( result => {

        if (result.user !== null) {
          if (result.additionalUserInfo.isNewUser){
            utils.saveUser(result);
          } else {
            console.log('ya está en la base de datos');
          }
        }
      }).catch( error => {
        console.log('error', error);
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential;
        // ...
      });

  firebase.auth()
    .onAuthStateChanged( user => {
      if (user) {
        if (user.uid === '8TCSD9FPoTh2RqDwq98cZQhMuIn2') {
          utils.toggleHeader(user);
          return;
        }

        utils.getMyTweets();
        utils.toggleHeader(user);

        const template =
        `
          <div class="main-container">
            <div class="main-container--tweet">
              <div class="main-textarea">
                <div id="tweet" name="tweet" placeholder="tu tweet..." contentEditable="true"></div>
              </div>

              <button id="main-container--tweet-send-tweet">Enviar tweet</button>
            </div>
          </div>
        `;

        main.insertAdjacentHTML('afterbegin', template);
        document.querySelector('#tweet')
          .addEventListener('keyup', utils.limitChars, false);

        document.querySelector('#main-container--tweet-send-tweet')
          .addEventListener('click', utils.sendTweet, false);


      } else {
        router.navigate('/');
        document.querySelector('header').style.display = 'none';
        document.querySelector('footer').style.display = 'none';
        document.querySelector('main').innerHTML = '';
        const template =
        `
        <div class="main-container home">
          <div class="main-container--div">
            <div class="main-container--div--logo">
              <img src="img/icons/icon-72x72.png" />
            </div>
            <button class="main-container--div--btn-twitter">Login con Twitter</button>
            <p id="admin-checkbox"><a href="/#!/admin">¿Eres admin?</a></p>
          </div>
        </div>
        `;

        main.insertAdjacentHTML('afterbegin', template);
        document.querySelector('.main-container button')
          .addEventListener('click', utils.loginByTwitter, false);
        document.querySelector('#admin-checkbox')
          .addEventListener('click', utils.goToAdmin, false);
      }
    });
}

module.exports = init;