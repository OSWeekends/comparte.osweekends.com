const tweets = require('./tweets');

module.exports = function getAllTweets () {
  document.querySelector('main').innerHTML = '';

  const rootDB = firebase.database().ref();
  const users = rootDB.child('users');

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
            // if (tweet.val().state === '') {
              tweetsByUser.tweetId = tweet.key;
              tweetsByUser.tweetDate = tweet.val().date;
              tweetsByUser.tweetMessage = tweet.val().message;
              tweetsByUser.tweetState = tweet.val().state;
              tweetsByUser.userId = userId;
              tweetsByUser.userName = userName;
              tweetsByUser.userImage = userImage;

              allTweets.unshift(Object.assign({}, tweetsByUser));
            // }
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
  if (userToRender && userToRender.length) {
    userToRender.forEach( tweet => {
      let template = '<div class="ows-user-tweets--tweet" data-id=' + tweet.userId + '>';
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
              template += '<ul class="ows-user-tweets--buttons" id='+ tweet.tweetId +'>';
                template += '<li class="ows-btn-actions"><button name="editTweet" class="btn">editar</button></li>';
                template += '<li class="ows-btn-actions"><button name="publishTweet" class="btn">publicar</button></li>';
                template += '<li class="ows-btn-actions"><button name="rejectTweet" class="btn">rechazar</buttonet.tweetId></li>';
              template += '</ul>';
            template += '</div>';
          template += '</div>';

      document.querySelector('main').insertAdjacentHTML('afterbegin', template);
    });

    document.querySelector('main').addEventListener('click', (event) => {
      if (event.target.tagName === 'BUTTON' && event.target.name === 'editTweet') {
        tweets.editTweet(event);
      } else if (event.target.tagName === 'BUTTON' && event.target.name === 'publishTweet') {
        tweets.publishTweet(event);
      } else if (event.target.tagName === 'BUTTON' && event.target.name === 'rejectTweet') {
        tweets.rejectTweet(event);
      }
    }, false);
  } else {
    let template = '<div class="ows-user-notweets">No tenemos ningún tweet nuevo &#128546;</div>';
    document.querySelector('main').insertAdjacentHTML('afterbegin', template);
  }
}
