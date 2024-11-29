import admin from "firebase-admin";

// Parsiranje JSON-a iz environment varijable
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);

// Popravka `private_key` da ima ispravan PEM format
serviceAccount.private_key = serviceAccount.private_key.replace(/\\n/g, "\n");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://demoprojekat1.firebaseio.com",
});

const db = admin.firestore();

export { db };
