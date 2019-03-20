const app = (function(){

  let token;
  const root = null;
  const useHash = true; // Defaults to: false
  const hash = '#!'; // Defaults to: '#'
  const router = new Navigo(root, useHash, hash);

  const main =  document.querySelector('main');

  const rootDB = firebase.database().ref();
  const users = rootDB.child('users');

  const user = {
    uid: '',
    username: '',
    displayName: '',
    creationTime: '',
    photoURL: '',
    isAdmin: false,
  };

  router
    .on('/', init)
    .on('/admin', getTweets)
    .resolve();

  function init() {
    firebase.auth()
      .getRedirectResult()
        .then( result => {

          if (result.user !== null) {
            users.on('value', snapshot => {
              snapshot.forEach( user => {
                console.log(snapshot instanceof Object);
                console.log(user.key);
                if (user.key.indexOf(firebase.auth().currentUser.uid) === -1) {
                  console.log('no esta el usuario');
                  // saveUser(result);
                  // return;
                }
              });
            });
          }


          // console.log(result);
          // console.log(result.additionalUserInfo.isNewUser);
          // if(!result.additionalUserInfo.isNewUser) {
          // } else {
          //   console.log('usuario conocido');
          // }
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
          console.log('onAuthStateChanged', user);
          /**
           * !FIXME - extraer fuera
           */
          document.querySelector('#header-user--username').textContent = user.displayName;
          const img = document.createElement('IMG');
          img.setAttribute('src', user.photoURL);
          document.querySelector('.header-avatar').appendChild(img);
          document.querySelector('.header-user--logout button')
            .addEventListener('click', logOut, false);

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

          document.querySelector('#header-welcome').style.display = 'none';
          const template =
          `
          <div class="main-container">
            <div class="main-container--div">
              <button>login con twitter</button>
              <p><input type="checkbox" /> ¿Eres admin?</p>
            </div>
          </div>
          `;

          main.insertAdjacentHTML('afterbegin', template);
          document.querySelector('.main-container button')
            .addEventListener('click', loginByTwitter, false);

        }
      });
  }

  function loginByTwitter () {
    const provider = new firebase.auth.TwitterAuthProvider();

    firebase.auth()
      .signInWithRedirect(provider);
  }

  function logOut () {
    main.innerHTML = '';
    firebase.auth().signOut();
    router.navigate('/');
  }

  function saveUser(response) {
    user.uid = response.user.uid;
    user.username = response.additionalUserInfo.username;
    user.displayName = response.user.displayName;
    user.creationTime = response.user.metadata.a;
    user.photoURL = response.user.photoURL;
    users.child(user.uid).set(user);
  }

  /**
   * https://codepen.io/gtb104/pen/pztgH
   * @param {*} event
   */
  function limitChars (event) {
    // console.log(event.target.innerText.length);
    const text = event.target.innerText;

    if (event.keyCode !== 37 && event.keyCode !== 38 && event.keyCode !== 39 && event.keyCode !== 40) {
      if (text.length > 279) {
        const textarea = document.querySelector('#tweet');
        let textExtra = text.slice(0, 279);
        let newString = `${textExtra}<span class="tweet-error">${text.slice(279)}</span>`;
        event.target.innerHTML = newString;

        range = document.createRange();
        range.selectNodeContents(textarea);
        range.collapse(false);
        selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);

        document.querySelector('#send-tweet').disabled = true;
      } else {
        document.querySelector('#send-tweet').disabled = false;
      }
    }
  }

  function sendTweet () {
    const textArea = document.querySelector('#tweet').textContent;

    uid = firebase.auth().currentUser.uid;
    const user = users.child(uid);
    const tweets = user.child('tweets');
    const tweet = tweets.push();

    tweet.update({
      message: textArea,
      date: new Date().getTime(),
      published: false,
      rejected: true,
    });

    // textArea.textContent = '';

  }

  function myTweetsList() {

  }

  function getTweets () {

    let userToRender = [];

    users.on('value', (snapshot) => {

      snapshot.forEach((users => {
        let listUser = {};

        listUser.name = users.val().name;

        users.forEach(tweets => {
          listUser.tweet = [];
          if (tweets.key === 'tweets') {
            tweets.forEach(tweet => {
              listUser.tweet.push(
                {
                  id: tweet.key,
                  message: tweet.val().message,
                  published: tweet.val().published
                }
              );
            });
            userToRender.push(listUser);
            // console.log(userToRender);
          }
        });
      }));
      renderListTweets(userToRender);
    });

  }

  function renderListTweets (userToRender) {
    console.log(userToRender);

    let template;

    userToRender.forEach( group => {
      template = '<div class="">' +group.name + '</div>';
      template += '<div>';

      group.tweet.forEach( tweet => {
        template += '<div class="">' + tweet.message + '</div>';
        template += '<ul>';
        template += '<li class=""><button>publicar</button></li>';
        template += '<li class=""><button>rechazar</button></li>';
        template += '</ul>';
      });
      main.insertAdjacentHTML('afterbegin', template);
    });
  }

})();
