import admin from "firebase-admin";

// Učitaj JSON iz environment varijable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://demoprojekat1.firebaseio.com",
});

const db = admin.firestore();

export { db };
