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
}