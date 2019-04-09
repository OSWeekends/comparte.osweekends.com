if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('./sw.js')
      .then(register => console.log('SW regitrado!'))
      .catch(error => console.log(error));
  });
}

const app = (function(){

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
    .on('/admin', loginByEmail)
    .on('/admin-tweets', getAllTweets)
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
          if (user.uid === '8TCSD9FPoTh2RqDwq98cZQhMuIn2') {
            toggleHeader(user);
            return;
          }

          getMyTweets();
          toggleHeader(user);

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
            .addEventListener('keyup', limitChars, false);

          document.querySelector('#main-container--tweet-send-tweet')
            .addEventListener('click', sendTweet, false);


        } else {
          router.navigate('/');
          document.querySelector('header').style.display = 'none';
          document.querySelector('footer').style.display = 'none';
          document.querySelector('main').innerHTML = '';
          const template =
          `
          <div class="main-container">
            <div class="main-container--div">
              <div class="main-container--div--logo">
                <img src="./../src/img/icons/icon-72x72.png" />
              </div>
              <button class="main-container--div--btn-twitter">Login con Twitter</button>
              <p id="admin-checkbox"><a href="/#!/admin">¿Eres admin?</a></p>
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

  function goToAdmin(event) {
    if (event.target.checked) {
      router.navigate(`/admin`);
    }
  }

  function toggleHeader(user) {
    if (user.uid !== '8TCSD9FPoTh2RqDwq98cZQhMuIn2') {
      document.querySelector('header #header-welcome').style.display = 'flex';
      document.querySelector('#header-user--username').textContent = user.displayName;
      document.querySelector('header #header-welcome .header-avatar img').setAttribute('src', user.photoURL);
      // document.querySelector('.header-avatar').appendChild(img);
      document.querySelector('.header-user--logout button')
        .addEventListener('click', logOut, false);
    } else {
      document.querySelector('header #header-welcome').style.display = 'flex';
      const adorableImg = `https://api.adorable.io/avatars/48/${user.email}`;
      document.querySelector('#header-user--username').textContent = 'ADMIN';
      document.querySelector('header #header-welcome .header-avatar img').setAttribute('src', adorableImg);
      // document.querySelector('.header-avatar').appendChild(img);
      document.querySelector('.header-user--logout button')
        .addEventListener('click', logOut, false);
    }
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
      state: '',
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

              myTweets.unshift(
                {
                  date: tweet.val().date,
                  message: tweet.val().message,
                  state: tweet.val().state
                }
              );
            });

            renderMyTweets(myTweets);
          }

        });

      });

    });
  }

  //////////////////////////////////////////////

  function renderMyTweets (myTweets) {
    if (document.querySelector('.container-tweets')) {
      document.querySelector('.container-tweets').innerHTML = '';
    }

    let template = '<div class="container-tweets">';
    template += '<ul>';
      myTweets.forEach(tweet => {
        template += '<li>';
        template += '<p>' + tweet.message + '</p>';
          template += '<div class="container-tweets-details">';
            template += '<div class="container-tweets-details-date">' + new Date(tweet.date).toLocaleString() + '</div>';
            template += '<div class="container-tweets-details-state"><span class="container-tweets-details-state-">Estado:</span> ' + isTweetPublished(tweet.state) + '</div>';
          template += '</div>';
        template += '</li>';
      });
    template += '</ul>';
    template += '</div>';

    document.querySelector('.main-container').insertAdjacentHTML('afterend', template);

  }

  function isTweetPublished (state) {
    if (state === '') {
      return 'Pendiente';
    } else if (state === true) {
      return 'Aprobado';
    } else if (state === false) {
      return 'Rechazado';
    }
  }

  function getAllTweets () {
    document.querySelector('main').innerHTML = '';

    users.once('value', (snapshot) => {
      let userId;
      let userName;
      let userImage;
      let allTweets = [];
      let tweetsByUser = {
        tweetId: '',
        tweetDate: '',
        tweetMessage: '',
        tweetState: '',
        userId: '',
        userName: '',
        userImage: ''
      };

      snapshot.forEach(user => {
        userId = user.val().uid;
        userName = user.val().username;
        userImage = user.val().photoURL;

        user.forEach(key => {
          if (key.key === 'tweets') {
            key.forEach( tweet => {
              tweetsByUser.tweetId = tweet.key;
              tweetsByUser.tweetDate = tweet.val().date;
              tweetsByUser.tweetMessage = tweet.val().message;
              tweetsByUser.tweetState = tweet.val().state;
              tweetsByUser.userId = userId;
              tweetsByUser.userName = userName;
              tweetsByUser.userImage = userImage;
              // console.log(tweetsByUser);
              allTweets.unshift(Object.assign({}, tweetsByUser));
            });
          }
        });
      });
      // console.log(allTweets);
      renderAllTweets(allTweets);
    });
  }

  function renderAllTweets (userToRender) {
    document.querySelector('header').style.display = 'flex';

    console.log(userToRender);

    userToRender.forEach( tweet => {
      let template = '<div class="ows-user-tweets--tweet">';
        template += '<div class="ows-user-tweets--image">';
          template += '<img src="' + tweet.userImage + '" class="ows-user-tweets--image">';
          template += '</img>';
        template += '</div>';
        template += '<div class="ows-user-tweets--details">';
          template += '<div class="ows-user-tweets--date-user">';
            template += '<div class="ows-user-tweets--date">' + new Date(tweet.tweetDate).toLocaleString() + '</div>';
            template += '<div class="ows-user-tweets--user">@' + tweet.userName + '</div>';
          template += '</div>';
          template += '<div class="ows-user-tweets--message">' + tweet.tweetMessage + '</div>';
          template += '<ul class="ows-user-tweets--buttons">';
            template += '<li class="ows-btn-actions"><button id='+ tweet.tweetId +' name="editTweet" class="btn">editar</button></li>';
            template += '<li class="ows-btn-actions"><button id='+ tweet.tweetId +' name="publishTweet" class="btn">publicar</button></li>';
            template += '<li class="ows-btn-actions"><button id='+ tweet.tweetId +' name="rejectTweet" class="btn">rechazar</button></li>';
          template += '</ul>';
        template += '</div>';
      template += '</div>';

      // template += '</div>';
      main.insertAdjacentHTML('afterbegin', template);
    });

    document.querySelector('main').addEventListener('click', (event) => {
      if (event.target.tagName === 'BUTTON' && event.target.name === 'editTweet') {
        editTweet(event);
      } else if (event.target.tagName === 'BUTTON' && event.target.name === 'publishTweet') {
        publishTweet(event);
      } else if (event.target.tagName === 'BUTTON' && event.target.name === 'rejectTweet') {
        rejectTweet(event);
      }

    }, false);
  }

  function editTweet(event) {
    console.log(event);
    const ref = firebase.database().ref(`users/${event.currentTarget.firstElementChild.id}/tweets/`);
    ref.child(event.target.id).remove();

  }

  function publishTweet(event) {
    const ref = firebase.database().ref(`users/${event.currentTarget.firstElementChild.id}/tweets/${event.target.id}`);
    ref.update({state: true});
    event.target.style.border = '1px solid green';
  }

  function rejectTweet(event) {
    const ref = firebase.database().ref(`users/${event.currentTarget.firstElementChild.id}/tweets/${event.target.id}`);
    ref.update({state: false});
    event.target.style.border = '1px solid red';
  }

  function loginByEmail() {
    document.querySelector('header #header-welcome').style.display = 'none';
    document.querySelector('main').innerHTML = '';
    let template = '';
    template =
    `
    <div class="main-container">
      <div class="main-container--div">
        <div class="main-container--div--logo">
          <img src="./../src/img/icons/icon-72x72.png" />
        </div>

        <div id="ows-login">
          <input id="login-email" type="text" placeholder="correo electrónico"/>
          <input id="login-password" type="password" placeholder="contraseña"/>
          <a href="#" id="login-login">ENTRAR</a>
        </div>
      </div>
    </div>
    `;

    document.querySelector('main').insertAdjacentHTML('afterbegin', template);
    document.querySelector('#login-login').addEventListener('click', login, false);

  }

  function login () {

    const email = document.querySelector('#login-email').value;
    const password = document.querySelector('#login-password').value;

    firebase.auth().signInWithEmailAndPassword(email, password)
      .then(data => {
        router.navigate(`/admin-tweets/`);
      })
      .catch(error => {
        console.log(error);
      });
  }

})();
