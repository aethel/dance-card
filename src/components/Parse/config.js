import Parse from 'parse';

const appId = process.env.REACT_APP_API_KEY;
const jsId = process.env.REACT_APP_JS_ID;
const serverUrl = process.env.REACT_APP_SERVER_URL;

class ParseBackend {
  constructor() {
    Parse.initialize(appId, jsId);
    Parse.serverUrl = serverUrl;
  }

  getCollection = collectionName => Parse.Object.extend(collectionName);
  //   doCreateUserWithEmailAndPassword = (email, password) =>
  //     this.auth.createUserWithEmailAndPassword(email, password);
  //   doSignInWithEmailAndPassword = (email, password) =>
  //     this.auth.signInWithEmailAndPassword(email, password);
  //   doSignOut = () => this.auth.signOut();
  //   doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
  //   doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);
}

export default ParseBackend;
