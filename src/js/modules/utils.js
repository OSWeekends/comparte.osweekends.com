const router = require('./variables');

const rootDB = firebase.database().ref();
const users = rootDB.child('users');

function goToAdmin(event) {
  if (event.target.checked) {
    router.navigate(`/admin`);
  }
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

function loginByTwitter () {
  const provider = new firebase.auth.TwitterAuthProvider();

  firebase.auth()
    .signInWithRedirect(provider);
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
    const adorableImg = `https://api.adorable.io/avatars/48/${user.email}`
    document.querySelector('#header-user--username').textContent = 'ADMIN';
    document.querySelector('header #header-welcome .header-avatar img').setAttribute('src', adorableImg);
    // document.querySelector('.header-avatar').appendChild(img);
    document.querySelector('.header-user--logout button')
      .addEventListener('click', logOut, false);
  }
}

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

function logOut () {
  document.querySelector('main').innerHTML = '';
  firebase.auth().signOut();
  router.navigate('/');
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

module.exports = {
  goToAdmin,
  login,
  loginByTwitter,
  getMyTweets,
  toggleHeader,
  limitChars,
  sendTweet
}