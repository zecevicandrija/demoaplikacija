const functions = require("firebase-functions");
const admin = require("firebase-admin");
const fetch = require("node-fetch");

admin.initializeApp();
const db = admin.firestore();

exports.posaljiSMSPodsetnik = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  const today = new Date();
  
  // Dohvati sve termine iz Firestore kolekcije
  const zakazaniTermini = await db.collection("ZAkazivanje").get();
  const poruke = []; // Lista poruka za slanje

  zakazaniTermini.forEach((doc) => {
    const podaci = doc.data();
    const datumZakazivanja = new Date(podaci.datum);
    const podsetnikVrednost = podaci.podsetnikVrednost;

    const razlikaUDanima = Math.floor((today - datumZakazivanja) / (1000 * 60 * 60 * 24));
    if (razlikaUDanima >= podsetnikVrednost) {
      const imeKorisnika = podaci.imeKorisnika;
      const brojKorisnika = podaci.brojKorisnika;
      const frizerValue = podaci.izabraneUsluge.frizer;
      const registarskaTablica = podaci.registarskaTablica;

      const smsText = registarskaTablica
        ? `Poštovani ${imeKorisnika}, vreme je da ponovo odradite baždarenje tahografa u AMSS ${frizerValue}. za ${registarskaTablica}.`
        : `Poštovani ${imeKorisnika}, vreme je da ponovo odradite baždarenje tahografa u AMSS ${frizerValue}.`;

      poruke.push({
        phone: brojKorisnika,
        message: smsText,
        senderId: "SMSAgent" // Prilagodi po potrebi
      });
    }
  });

  if (poruke.length > 0) {
    const smsHeaders = {
      "Authorization": "EIVtX3IXREwa5NDcJ9NAZrnlEgnF3e5bsCSQvPWR8kyTJVCXKZFTbSEqAlv9O2Qj6xIkUROST3Bfz4juYtXHhUTH2Qk8fa67rQ65BugmOfwU9M113lSMSGBp5lfZBhwK", // Zameni sa pravim tokenom
      "Content-Type": "application/json"
    };

    const smsBody = {
      messages: poruke
    };

    try {
      const response = await fetch('https://api.smsagent.rs/v1/sms/bulk', {
        method: "POST",
        headers: smsHeaders,
        body: JSON.stringify(smsBody)
      });

      const result = await response.json();
      console.log("Rezultat slanja SMS-a:", result);
    } catch (error) {
      console.error("Greška prilikom slanja SMS-a:", error);
    }
  }

  return null;
});
