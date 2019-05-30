const notifications = require('./notifications');

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

function editTweet(event) {
  console.log(event);
  event.target.closest('.ows-user-tweets--tweet').style.opacity = 0.4;
  disabledButtons(event.target);
  // const ref = firebase.database().ref(`users/${event.currentTarget.firstElementChild.id}/tweets/`);
  // ref.child(event.target.id).remove();
}

function publishTweet(event) {
  const ref = firebase.database().ref(`users/${event.currentTarget.firstElementChild.dataset.id}/tweets/${event.target.parentElement.parentElement.id}`);
  ref.update({state: true});
  event.target.closest('.ows-user-tweets--tweet').style.opacity = 0.4;
  notifications.showNotifications(null, notifications.MESSAGE.STATE.PUBLISHED);
}

function rejectTweet(event) {
  const ref = firebase.database().ref(`users/${event.currentTarget.firstElementChild.dataset.id}/tweets/${event.target.parentElement.parentElement.id}`);
  ref.update({state: false});
  event.target.closest('.ows-user-tweets--tweet').style.opacity = 0.4;
  notifications.showNotifications(notifications.MESSAGE.STATE.REJECTED, null);
}

function disabledButtons(target) {
  // const elements = target.closest('.ows-user-tweets--buttons');
  Array.from(target.closest('.ows-user-tweets--buttons').children)
    .forEach(item => {
      item.firstElementChild.disabled = true;
    });
}

module.exports = {
  sendTweet,
  getMyTweets,
  editTweet,
  publishTweet,
  rejectTweet
};
