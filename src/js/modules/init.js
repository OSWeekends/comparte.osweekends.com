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
        router.navigate('/');
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

        main.insertAdjacentHTML('afterbegin', template);
        document.querySelector('.main-container button')
          .addEventListener('click', loginByTwitter, false);
        document.querySelector('#admin-checkbox')
          .addEventListener('click', goToAdmin, false);
      }
    });
}