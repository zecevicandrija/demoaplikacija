import { db } from "./firebaseConfig.js";
import fetch from "node-fetch";

const sendReminders = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Postavi vreme na ponoć za upoređivanje

  try {
    // Proveri dokumente u kolekciji sa današnjim datumom
    const remindersSnapshot = await db
      .collection("ZAkazivanje")
      .where("reminderDate", "==", today.toISOString()) // Koristi ISO string za upit
      .get();

    if (remindersSnapshot.empty) {
      console.log("Nema podsetnika za slanje danas.");
      return;
    }

    remindersSnapshot.forEach(async (doc) => {
      const { brojKorisnika, imeKorisnika, reminderDate } = doc.data();

      console.log(
        `Podsećamo ${imeKorisnika} (${brojKorisnika}) o terminu zakazanom za ${new Date(
          reminderDate
        ).toDateString()}`
      );

      // Pozivanje SMS API-ja za slanje podsetnika
      try {
        const smsResponse = await fetch("https://backend-server-t7cq.onrender.com/api/send-sms", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            to: brojKorisnika,
            message: `Postovani ${imeKorisnika}, podsećamo vas na termin zakazan za ${new Date(
              reminderDate
            ).toDateString()}.`,
            from: "SMSAgent",
            type: "INFO",
          }),
        });

        if (smsResponse.ok) {
          console.log(`Podsetnik za ${imeKorisnika} poslat uspešno.`);
        } else {
          console.error(
            `Greška prilikom slanja podsetnika za ${imeKorisnika}:`,
            await smsResponse.json()
          );
        }
      } catch (smsError) {
        console.error("Greška prilikom slanja SMS-a:", smsError);
      }
    });
  } catch (error) {
    console.error("Greška prilikom pristupa bazi podataka:", error);
  }
};

export default sendReminders;
