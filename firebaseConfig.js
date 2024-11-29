import admin from "firebase-admin";

// Putanja do Firebase privatnog ključa
const serviceAccount = require("./service-firebase.json");


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://demoprojekat1.firebaseio.com",
});

const db = admin.firestore();

export { db };
