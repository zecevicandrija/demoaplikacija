import { db } from "./firebaseConfig.js";

const sendReminders = async () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Postavi vreme na ponoć za upoređivanje

  try {
    // Proveri dokumente u kolekciji sa današnjim datumom
    const remindersSnapshot = await db
      .collection("ZAkazivanje")
      .where("reminderDate", "==", today)
      .get();

    if (remindersSnapshot.empty) {
      console.log("Nema podsetnika za slanje danas.");
      return;
    }

    remindersSnapshot.forEach(async (doc) => {
      const { brojKorisnika, imeKorisnika, reminderDate } = doc.data();
      console.log(
        `Podsecamo ${imeKorisnika} (${brojKorisnika}) o terminu zakazanom za ${new Date(
          reminderDate
        ).toDateString()}`
      );
    });
  } catch (error) {
    console.error("Greška prilikom pristupa bazi podataka:", error);
  }
};

export default sendReminders;
