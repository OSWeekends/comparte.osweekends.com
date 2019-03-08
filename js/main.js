const app = (function(){

  const root = null;
  const useHash = true; // Defaults to: false
  const hash = '#!'; // Defaults to: '#'
  const router = new Navigo(root, useHash, hash);

  var provider = new firebase.auth.TwitterAuthProvider();

  router
    .on('/', init)
    .resolve();

  function init () {
    firebase.auth()
      .signInWithPopup(provider)
      .then( result => {
        // This gives you a the Twitter OAuth 1.0 Access Token and Secret.
        // You can use these server side with your app's credentials to access the Twitter API.
        const token = result.credential.accessToken;
        const secret = result.credential.secret;
        // The signed-in user info.
        const user = result.user;
        // ...
      }).catch( error => {
        // Handle Errors here.
        const errorCode = error.code;
        const errorMessage = error.message;
        // The email of the user's account used.
        const email = error.email;
        // The firebase.auth.AuthCredential type that was used.
        const credential = error.credential;
        // ...
      });
  }

})();