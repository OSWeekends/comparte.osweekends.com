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
    .on('/admin', getAllTweets)
    .resolve();

  function init() {
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
          console.log('onAuthStateChanged', user);
          getMyTweets();
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
    const textArea = document.querySelector('#tweet');

    uid = firebase.auth().currentUser.uid;
    const user = users.child(uid);
    const tweets = user.child('tweets');
    const tweet = tweets.push();

    tweet.update({
      message: textArea.textContent,
      date: new Date().getTime(),
      published: false,
      rejected: true,
    });

    textArea.textContent = '';

    getMyTweets();
  }

  function getMyTweets () {

    users.on('value', (snapshot) => {

      snapshot.forEach(user => {
        let myTweets = [];
        user.forEach(key => {

          if (key.key === 'tweets') {

            key.forEach( tweet => {

              myTweets.push(
                {
                  date: tweet.val().date,
                  message: tweet.val().message,
                  published: tweet.val().published
                }
              );
            });

            renderMyTweets(myTweets);
          }

        });

      });

    });
  }

  function renderMyTweets (myTweets) {
    console.log(myTweets);
    let template = '<div class="container-tweets">';
    template += '<ul>';
      myTweets.forEach(tweet => {
        template += '<li>';
        template += '<div>';
        template += '<p>Fecha: ' + new Date(tweet.date).toLocaleString() + '</p>';
        template += '<p>' + tweet.message + '</p>';
        template += '<p>Estado: ' + isTweetPublished(tweet.published) + '</p>';
        template += '</div>';
        template += '</li>';
      });
    template += '</ul>';
    template += '</div>';

    document.querySelector('.main-container').insertAdjacentHTML('afterend', template);

  }

  function isTweetPublished (state) {
    return (state) ? 'publicado!' : 'no publicado';
  }

  function getAllTweets () {
    users.on('value', (snapshot) => {

      let allTweets = [];
      let tweetsByUser = {
        name: '',
        tweets: []
      };

      snapshot.forEach(user => {
        tweetsByUser.name = user.val().username;

        user.forEach(key => {
          if (key.key === 'tweets') {

            key.forEach( tweet => {
              tweetsByUser.tweets.push(
                {
                  date: tweet.val().date,
                  message: tweet.val().message,
                  published: tweet.val().published
                }
              );
            });
          }

        });
        allTweets.push(tweetsByUser);

      });
      renderAllTweets(allTweets);

    });
  }

  function renderAllTweets (userToRender) {
    let template;

    userToRender.forEach( group => {
      template = '<div class="">' +group.name + '</div>';
      template += '<div>';

      group.tweets.forEach( tweet => {
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
