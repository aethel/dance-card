import app from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { GeoFirestore } from "geofirestore";
const config = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DB_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_APP,
  messagingSenderId: process.env.REACT_APP_MESSAGE_SENDER
};

class Firebase {
  constructor() {
    app.initializeApp(config);
    this.auth = app.auth();
    this.db = app.firestore();
    this.firestoreRef = app.firestore;
    this.geofirestore = new GeoFirestore(this.db);
  }

  doCreateUserWithEmailAndPassword = (email, password) =>
    this.auth.createUserWithEmailAndPassword(email, password);
  doSignInWithEmailAndPassword = (email, password) =>
    this.auth.signInWithEmailAndPassword(email, password);
  doSignOut = () => this.auth.signOut();
  doPasswordReset = email => this.auth.sendPasswordResetEmail(email);
  doPasswordUpdate = password => this.auth.currentUser.updatePassword(password);
  // users = () => this.db.collection("users");
  // user = uid => this.db.doc(`users/${uid}`);
  geoUsers = () => this.geofirestore.collection("users");
  geoPoint = (latitude, longitude) =>
  new this.firestoreRef.GeoPoint(latitude, longitude);
  chats = () => this.db.collection("chats");
  chat = (cid) => this.db.doc(`users/${cid}`);
}

export default Firebase;
