function loginByTwitter () {
  const provider = new firebase.auth.TwitterAuthProvider();

  firebase.auth()
    .signInWithRedirect(provider);
}