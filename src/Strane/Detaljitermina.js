import React from "react";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { db } from "../firebase/firebaseconfig";
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
      const god = izabraneUsluge.datum.getFullYear();
      const mes = izabraneUsluge.datum.getMonth() + 1;
      const dan = izabraneUsluge.datum.getDate();
      const datum = `${god}.${mes}.${dan}`;
      
      // Dodavanje termina u Firestore bazu
      const docRef = await addDoc(collection(db, "ZAkazivanje"), {
        izabraneUsluge,
        imeKorisnika,
        brojKorisnika,
        registarskaTablica,
        datum,
        cena,
        podsetnikVrednost  // Broj dana nakon kog treba poslati SMS
      });
  
      // Slanje SMS poruke
      

      var myHeaders = new Headers();
myHeaders.append("Content-Type", "application/json");
myHeaders.append("Authorization", "EIVtX3IXREwa5NDcJ9NAZrnlEgnF3e5bsCSQvPWR8kyTJVCXKZFTbSEqAlv9O2Qj6xIkUROST3Bfz4juYtXHhUTH2Qk8fa67rQ65BugmOfwU9M113lSMSGBp5lfZBhwK");


var raw = JSON.stringify({
  "to": [
    brojKorisnika
  ],
  "message": `Poštovani ${imeKorisnika}, vaš termin je uspešno zakazan za ${formatiranDatum} u ${pocetakTerminaValue}h.`,
  "from": "SMSAgent",
  "type": "INFO"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://api.smsagent.rs/v1/sms/bulk", requestOptions)
  .then(response => response.text())
  .then(result => console.log(result))
  .catch(error => console.log('error', error));

    // Prikaz uspešne poruke
    const overlay = document.createElement("div");
    overlay.className = "alert-overlay";

    const alertBox = document.createElement("div");
    alertBox.className = "alert-box";

    const title = document.createElement("div");
    title.className = "alert-title";
    title.textContent = "Zakazan!";

    const message = document.createElement("div");
    message.className = "alert-message";
    message.textContent = "Vaš termin je uspešno zakazan i SMS je poslat!";

    const closeButton = document.createElement("button");
    closeButton.className = "alert-button";
    closeButton.textContent = "Zatvori";
    closeButton.addEventListener("click", () => {
      document.body.removeChild(overlay);
    });

    alertBox.appendChild(title);
    alertBox.appendChild(message);
    alertBox.appendChild(closeButton);
    overlay.appendChild(alertBox);

    document.body.appendChild(overlay);
  
      console.log("Document written with ID: ", docRef.id);
      history.push("/loginovan");
  
    } catch (e) {
      console.error("Greška pri zakazivanju:", e);
  
      // Prikaz greške
      const overlayError = document.createElement("div");
      overlayError.className = "alert-overlay";
  
      const alertBoxError = document.createElement("div");
      alertBoxError.className = "alert-box";
  
      const titleError = document.createElement("div");
      titleError.className = "alert-title";
      titleError.textContent = "Greška!";
  
      const messageError = document.createElement("div");
      messageError.className = "error-message";
      messageError.textContent = "Došlo je do greške, termin nije zakazan.";
  
      const closeButtonError = document.createElement("button");
      closeButtonError.className = "alert-button";
      closeButtonError.textContent = "Zatvori";
      closeButtonError.addEventListener("click", () => {
        document.body.removeChild(overlayError);
      });
  
      alertBoxError.appendChild(titleError);
      alertBoxError.appendChild(messageError);
      alertBoxError.appendChild(closeButtonError);
      overlayError.appendChild(alertBoxError);
  
      document.body.appendChild(overlayError);
    }
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