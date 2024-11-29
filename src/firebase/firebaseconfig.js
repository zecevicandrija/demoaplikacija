import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "@firebase/auth";
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
const db = getFirestore(app);
const storage = getStorage(app);
const auth = getAuth(app);

export { db, storage, auth };
