import { initializeApp } from "firebase/app";
import {getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, 
        onAuthStateChanged} from "firebase/auth";
import {getDatabase, ref, set, get, child, onValue} from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyBTlT6pccCoqye9oid5wsrA9OsWQ1WJY8Y",
  authDomain: "shopez-test-2.firebaseapp.com",
  projectId: "shopez-test-2",
  storageBucket: "shopez-test-2.firebasestorage.app",
  messagingSenderId: "349171276435",
  appId: "1:349171276435:web:49890552920fdcb1424b66"
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const database = getDatabase(app);

export {app, auth, database, createUserWithEmailAndPassword, signInWithEmailAndPassword, 
    signOut, onAuthStateChanged, ref, set, get, child,onValue};
