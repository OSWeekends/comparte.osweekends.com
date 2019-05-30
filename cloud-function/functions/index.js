const functions = require('firebase-functions');
const admin = require('firebase-admin');
// admin.initializeApp();

const Twit = require('twit');
const config = require('./config.js');

var twitter = new Twit({
  consumer_key:         config.consumer_key,
  consumer_secret:      config.consumer_secret,
  access_token:         config.access_token,
  access_token_secret:  config.access_token_secret,
  timeout_ms:           60*1000,  // optional HTTP request timeout to apply to all requests.
  strictSSL:            true,     // optional - requires SSL certificates to be valid.
});

/**
 * @description envia tweet
 */
exports.updateAndSendTweet = functions.database.ref('/users/{uid}/tweets/{id}')
  .onUpdate( (snapshot, context) => {
    if (snapshot.after.child('state').val() === true) {
      console.log('enviando tweet -->', snapshot.before.child('message').val());

      twitter.post('statuses/update', {
        status: snapshot.before.child('message').val()
      }, (err, data) => {
        if (err) {
          console.log(error);
          return;
        }
        console.log(data);
      });
    }
  });
