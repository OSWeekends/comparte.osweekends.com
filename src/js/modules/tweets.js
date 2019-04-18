const notifications = require('./notifications');

module.exports = function sendTweet () {
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

module.exports = function getMyTweets () {

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

module.exports = function editTweet(event) {
  console.log(event);
  const ref = firebase.database().ref(`users/${event.currentTarget.firstElementChild.id}/tweets/`);
  ref.child(event.target.id).remove();

};

module.exports = function publishTweet(event) {
  const ref = firebase.database().ref(`users/${event.currentTarget.firstElementChild.id}/tweets/${event.target.id}`);
  ref.update({state: true});
  event.target.style.border = '1px solid green';
  notifications.showNotifications(null, notifications.MESSAGE.STATE.PUBLISHED);
};

module.exports = function rejectTweet(event) {
  const ref = firebase.database().ref(`users/${event.currentTarget.firstElementChild.id}/tweets/${event.target.id}`);
  ref.update({state: false});
  event.target.style.border = '1px solid red';
  notifications.showNotifications(notifications.MESSAGE.STATE.REJECTED, null);
};

module.exports = function getAllTweets () {
  document.querySelector('main').innerHTML = '';
  users.once('value', (snapshot) => {

    let allTweets = [];
    let tweetsByUser = {
      id: '',
      name: '',
      tweets: []
    };

    snapshot.forEach(user => {
      tweetsByUser.id = user.val().uid;
      tweetsByUser.name = user.val().username;

      user.forEach(key => {
        if (key.key === 'tweets') {

          key.forEach( tweet => {
            tweetsByUser.tweets.push(
              {
                id: tweet.key,
                date: tweet.val().date,
                message: tweet.val().message,
                state: tweet.val().state
              }
            );
          });
        }

      });
      allTweets.push(tweetsByUser);

    });
    renderAllTweets(allTweets);
  });
};