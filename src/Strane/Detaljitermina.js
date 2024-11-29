import React from "react";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { db } from "../firebase/firebaseconfig.js";
import { collection, addDoc } from "firebase/firestore";
import "./Detaljitermina.css"
import BackButton from "./Dugmenazad";
import { ListItem } from "@mui/material";

const Detaljitermina = () => {
 
  const history = useHistory();
  const location = useLocation();
  const podaci = location.state;
  const { izabraneUsluge, imeKorisnika, brojKorisnika,registarskaTablica, podsetnik } = podaci;
  console.log(podaci)
  console.log("izabrane usluge:", izabraneUsluge);
  const pocetakTerminaValue = izabraneUsluge.pocetakTermina.value; //.value
  const frizerValue = izabraneUsluge.frizer;
  const datumValue = izabraneUsluge.datum;
  const formatiranDatum = datumValue.toDateString();
  //const trajanjeValue = izabraneUsluge.usluge.name;
  const odabraneUsluge = izabraneUsluge.usluge
  console.log('korisnik je odabrao:', odabraneUsluge)
 
const cena = izabraneUsluge.cena
console.log(Number(cena))
  const usluge = izabraneUsluge.usluge || {};
  let ukupnoTrajanje = 0;
  const imeSvihUsluga = [];
  for (const [usluga, trajanje] of Object.entries(usluge)) {
    ukupnoTrajanje += parseInt(trajanje);
    imeSvihUsluga.push(`${usluga}`);
  }
  
  const podsetnikVrednost = izabraneUsluge.podsetnik // Podsetnik u minutima
  console.log('pods:', izabraneUsluge.podsetnik);

  const handleZakazi = async () => {
    try {
      // Extract necessary details from selected services
      const appointmentDate = izabraneUsluge.datum; // Appointment date
      const reminderDays = podsetnikVrednost || 1; // Default reminder to 1 day if not provided
  
      // Calculate reminder date
      const reminderDate = new Date(appointmentDate);
      reminderDate.setDate(reminderDate.getDate() + reminderDays);
  
      // Format the date for storage
      const formattedAppointmentDate = `${appointmentDate.getFullYear()}-${appointmentDate.getMonth() + 1}-${appointmentDate.getDate()}`;
  
      // Save appointment and reminder details in Firestore
      const docRef = await addDoc(collection(db, "ZAkazivanje"), {
        izabraneUsluge,
        imeKorisnika,
        brojKorisnika,
        registarskaTablica,
        datum: formattedAppointmentDate,
        reminderDate: reminderDate.toISOString(), // Save as ISO string for easier date comparison
        cena,
        podsetnikVrednost, // Reminder days
      });
  
      // Send immediate confirmation SMS
      const smsResponse = await fetch("http://localhost:5000/api/send-sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          to: brojKorisnika,
          message: `Postovani ${imeKorisnika}, vas termin je uspesno zakazan za ${formattedAppointmentDate} u ${pocetakTerminaValue}h.`,
          from: "SMSAgent",
          type: "INFO",
        }),
      });
  
      if (!smsResponse.ok) {
        console.error("Greška prilikom slanja SMS-a potvrde:", await smsResponse.json());
      }
  
      // Show success alert
      showAlert("Zakazan!", "Vaš termin je uspešno zakazan i SMS je poslat!");
  
      // Redirect to another page
      history.push("/loginovan");
  
    } catch (error) {
      console.error("Greška pri zakazivanju:", error);
  
      // Show error alert
      showAlert("Greška!", "Došlo je do greške, termin nije zakazan.");
    }
  };
  
  // Helper function to show alert
  const showAlert = (title, message) => {
    const overlay = document.createElement("div");
    overlay.className = "alert-overlay";
  
    const alertBox = document.createElement("div");
    alertBox.className = "alert-box";
  
    const titleElement = document.createElement("div");
    titleElement.className = "alert-title";
    titleElement.textContent = title;
  
    const messageElement = document.createElement("div");
    messageElement.className = "alert-message";
    messageElement.textContent = message;
  
    const closeButton = document.createElement("button");
    closeButton.className = "alert-button";
    closeButton.textContent = "Zatvori";
    closeButton.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });
  
    alertBox.appendChild(titleElement);
    alertBox.appendChild(messageElement);
    alertBox.appendChild(closeButton);
    overlay.appendChild(alertBox);
  
    document.body.appendChild(overlay);
  };
  
  
  


    
return (
  <>
  <div className="center-content">
    <div className="user-data-card">
      <div className="user-info">
        <p><b>Vaše ime: </b> {imeKorisnika}</p>
        <p><b>Vaš broj: </b> {brojKorisnika}</p>
      </div>
      <div className="vertical-line3"></div>

      <div className="service-info">
        <p><b>Usluge: </b> {imeSvihUsluga.join(", ")}</p>
        {/* <p><b>Cena: </b>{izabraneUsluge.cena}</p> */}
        <p><b>Tablica: </b>{registarskaTablica}</p>

      </div>
      <div className="vertical-line3"></div>

      <div className="other-info">
        <p><b>Trajanje: </b>{ukupnoTrajanje}min</p>
        <p><b>Radnik: </b> {frizerValue}</p>
        <p><b>Početak termina: </b>{pocetakTerminaValue}h</p>
        <p><b>Datum: </b> {formatiranDatum}</p>
        {/* <p><b>Podsetnik: </b>na {podsetnikVrednost} dana</p> */}
      </div>
    </div>
    <button onClick={handleZakazi} className="dugmezazakazivanje">Zakaži</button>
    </div>
    <BackButton>Nazad</BackButton>
  </>
);
};

export default Detaljitermina;