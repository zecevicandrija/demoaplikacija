const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

// Inicijalizacija Firebase Admin SDK
admin.initializeApp();

exports.sendReminderSMS = functions.pubsub.schedule("every 24 hours").onRun(async (context) => {
  const db = admin.firestore();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  try {
    const remindersSnapshot = await db
      .collection("Zakazivanje")
      .where("reminderDate", "==", today)
      .get();

    if (remindersSnapshot.empty) {
      console.log("Nema podsetnika za slanje danas.");
      return;
    }

    remindersSnapshot.forEach(async (doc) => {
      const { brojKorisnika, imeKorisnika, reminderDate } = doc.data();
      const message = `Postovani ${imeKorisnika}, podsecamo vas na termin zakazan za ${new Date(
        reminderDate
      ).toDateString()}.`;

      try {
        await fetch("http://localhost:5000/api/send-sms", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ to: brojKorisnika, message, from: "SMSAgent", type: "INFO" }),
        });
        console.log(`SMS poslat korisniku: ${brojKorisnika}`);
      } catch (error) {
        console.error("Greška pri slanju SMS-a:", error);
      }
    });
  } catch (error) {
    console.error("Greška pri pristupu Firestore bazi:", error);
  }
});
