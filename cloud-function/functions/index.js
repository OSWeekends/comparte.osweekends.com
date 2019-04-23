const functions = require('firebase-functions');
const admin = require('firebase-admin');
// admin.initializeApp();

const twit = require('twit');
const config = require('./config.js');
const Twitter = new twit(config);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

/**
 * @description envia tweet
 */
exports.updateAndSendTweet = functions.database.ref('/users/{uid}/tweets/{id}')
  .onUpdate( (snapshot, context) => {
    if (snapshot.after.child('state').val() === true) {
      console.log('enviando tweet -->', snapshot.before.child('message').val());
    }
  });
