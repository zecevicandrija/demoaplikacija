import { getAuth } from '@firebase/auth'

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";


const firebaseConfig = {
  apiKey: "AIzaSyCFsEZ8PXgWtPvIsDMSYMisgs-ogydg980",
  authDomain: "demoprojekat1.firebaseapp.com",
  projectId: "demoprojekat1",
  storageBucket: "demoprojekat1.firebasestorage.app",
  messagingSenderId: "250092830663",
  appId: "1:250092830663:web:f5cea4b14877a5aa8163e2",
  measurementId: "G-3RTM9LJVS6"
};

const app = initializeApp(firebaseConfig);
  // Initialize Firestore and get a reference to the service
  const db = getFirestore(app);
  const storage = getStorage(app); // Initialize storage and export it
  export { db, storage, getAuth};