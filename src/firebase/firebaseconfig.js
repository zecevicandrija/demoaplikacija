import { getAuth } from '@firebase/auth'

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyBbT71IAPmqiM6xUvC3b97uFZY3zgSeaUs",
  authDomain: "novi-248ee.firebaseapp.com",
  projectId: "novi-248ee",
  storageBucket: "novi-248ee.appspot.com",
  messagingSenderId: "442685719725",
  appId: "1:442685719725:web:2c987078115e30ba3cb224",
  measurementId: "G-FQPEJZDESH"
};

const app = initializeApp(firebaseConfig);
  // Initialize Firestore and get a reference to the service
  const db = getFirestore(app);
  const storage = getStorage(app); // Initialize storage and export it
  export { db, storage, getAuth};