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
};

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
};

function editTweet(event) {
  console.log(event);
  const ref = firebase.database().ref(`users/${event.currentTarget.firstElementChild.id}/tweets/`);
  ref.child(event.target.id).remove();

};

function publishTweet(event) {
  const ref = firebase.database().ref(`users/${event.currentTarget.firstElementChild.id}/tweets/${event.target.id}`);
  ref.update({state: true});
  event.target.style.border = '1px solid green';
  notifications.showNotifications(null, notifications.MESSAGE.STATE.PUBLISHED);
};

function rejectTweet(event) {
  const ref = firebase.database().ref(`users/${event.currentTarget.firstElementChild.id}/tweets/${event.target.id}`);
  ref.update({state: false});
  event.target.style.border = '1px solid red';
  notifications.showNotifications(notifications.MESSAGE.STATE.REJECTED, null);
};

module.exports = {
  sendTweet,
  getMyTweets,
  editTweet,
  publishTweet,
  rejectTweet
};
