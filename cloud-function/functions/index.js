const functions = require('firebase-functions');
const admin = require('firebase-admin');
// admin.initializeApp();

const twit = require('twit');
const config = require('./config.js');
const Twitter = new twit(config);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions

exports.updateAndSendTweet = functions.database.ref('/users/{uid}/tweets/{id}')
  .onUpdate( (snapshot, context) => {
    console.log('snapshot', snapshot.before.child('message').val());
    // console.log('context', context);
    // console.log('yeap');
  });
