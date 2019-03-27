const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// const twit = require('twit');
// const config = require('./config.js');
// const Twitter = new twit(config);

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
exports.helloWorld = functions.https.onRequest((request, response) => {
 response.send(Twitter);
});
