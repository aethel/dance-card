import app from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';

const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DB_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_APP,
  messagingSenderId: process.env.REACT_APP_MESSAGE_SENDER
};
// const config = {
//   apiKey: "AIzaSyDNm6RFbwjlkKnY83gzR1eCru6GtPVz8CE",
//   authDomain: "dancecard-50c3f.firebaseapp.com",
//   databaseURL: "https://dancecard-50c3f.firebaseio.com",
//   projectId: "dancecard-50c3f",
//   storageBucket: "dancecard-50c3f.appspot.com",
//   messagingSenderId: "368875192319"
// };

class Firebase {
  constructor() {
    console.log(config);
    
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.firestore();
    this.firestoreRef = app.firestore;
  }

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);
  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);
  doSignOut = () => this.auth.signOut();
  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);
  users = () => this.db.collection('users');
  user = uid => this.db.users().doc(`${uid}`);
  geoPoint = (latitude,longitude) => new this.firestoreRef.GeoPoint(latitude,longitude)
}

export default Firebase;
