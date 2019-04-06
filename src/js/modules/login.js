const variables = require('./variables');

module.exports = function init() {
  firebase.auth()
    .getRedirectResult()
      .then( result => {

        if (result.user !== null) {
          if (result.additionalUserInfo.isNewUser){
            saveUser(result);
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
          toggleHeader(user);
          return;
        }

        getMyTweets();
        toggleHeader(user);

        const template =
        `
          <div class="main-container">
            <div class="main-container--div">
              <div class="main-textarea">
                <div id="tweet" name="tweet" placeholder="tu tweet..." contentEditable="true"></div>
              </div>

              <button id="send-tweet">Enviar tweet</button>
            </div>
          </div>
        `;

        main.insertAdjacentHTML('afterbegin', template);
        document.querySelector('#tweet')
          .addEventListener('keyup', limitChars, false);

        document.querySelector('#send-tweet')
          .addEventListener('click', sendTweet, false);


      } else {
        variables.router.navigate('/');
        document.querySelector('#header-welcome').style.display = 'none';
        document.querySelector('main').innerHTML = '';
        const template =
        `
        <div class="main-container">
          <div class="main-container--div">
            <button>login con twitter</button>
            <label for="admin-checkbox" ><input type="checkbox" id="admin-checkbox" /> ¿Eres admin?</label>
          </div>
        </div>
        `;

        variables.main.insertAdjacentHTML('afterbegin', template);
        document.querySelector('.main-container button')
          .addEventListener('click', loginByTwitter, false);
        document.querySelector('#admin-checkbox')
          .addEventListener('click', goToAdmin, false);
      }
    });
};

module.exports = function loginByTwitter () {
  const provider = new firebase.auth.TwitterAuthProvider();

  firebase.auth()
    .signInWithRedirect(provider);
};

module.exports = function logOut () {
  main.innerHTML = '';
  firebase.auth().signOut();
  variables.router.navigate('/');
};

module.exports = function login () {
  const email = document.querySelector('#login-email').value;
  const password = document.querySelector('#login-password').value;

  firebase.auth().signInWithEmailAndPassword(email, password)
    .then(data => {
      variables.router.navigate(`/admin-tweets/`);
    })
    .catch(error => {
      console.log(error);
    });
};

module.exports = function loginByEmail() {
  document.querySelector('header #header-welcome').style.display = 'none';
  document.querySelector('main').innerHTML = '';
  let template = '';
  template =
  `
  <div id="ows-login">
    <input id="login-email" type="text" placeholder="correo electrónico"/>
    <input id="login-password" type="password" placeholder="contraseña"/>
    <a href="#" id="login-login">entrar</a>
  </div>
  `;

  document.querySelector('main').insertAdjacentHTML('afterbegin', template);
  document.querySelector('#login-login').addEventListener('click', module.exports.login, false);
};