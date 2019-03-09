const app = (function(){

  const root = null;
  const useHash = true; // Defaults to: false
  const hash = '#!'; // Defaults to: '#'
  const router = new Navigo(root, useHash, hash);

  const main =  document.querySelector('main');

  router
    .on('/', init)
    .resolve();

  function init() {
    firebase.auth()
      .getRedirectResult()
        .then( result => {
          if (result.credential) {
            console.log('result', result.credential);
            // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
            // You can use these server side with your app's credentials to access the Twitter API.
            const token = result.credential.accessToken;
            const secret = result.credential.secret;
            // ...
          }
          // The signed-in user info.
          const user = result.user;
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

    firebase.auth().onAuthStateChanged( user => {
      if (user) {
        console.log('user', user);
        main.textContent = 'estás logueado';
        const button =
        `
          <button>log out</button>
        `;
        main.insertAdjacentHTML('beforeend', button);
        document.querySelector('button').addEventListener('click', logOut, false);
      } else {
        const template =
        `
        <div class="login-container">
          <button>login con twitter</button>
          <p><input type="checkbox" /> ¿Eres admin?</p>
        </div>
        `;

        main.insertAdjacentHTML('afterbegin', template);
        document.querySelector('button').addEventListener('click', loginByTwitter, false);
      }
    })
  }

  function loginByTwitter () {
    const provider = new firebase.auth.TwitterAuthProvider();

    firebase.auth()
      .signInWithRedirect(provider);
  }

  function logOut () {
    firebase.auth().signOut();
  }

})();