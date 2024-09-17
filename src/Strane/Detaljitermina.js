import React from "react";
import { useLocation } from "react-router-dom";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { db } from "../firebase/firebaseconfig";
import { collection, addDoc } from "firebase/firestore";
import "./Detaljitermina.css"
import BackButton from "./Dugmenazad";

const Detaljitermina = () => {
 
  const history = useHistory();
  const location = useLocation();
  const podaci = location.state;
  const { izabraneUsluge, imeKorisnika, brojKorisnika,registarskaTablica } = podaci;
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
console.log(cena)
  const usluge = izabraneUsluge.usluge || {};
  let ukupnoTrajanje = 0;
  const imeSvihUsluga = [];
  for (const [usluga, trajanje] of Object.entries(usluge)) {
    ukupnoTrajanje += parseInt(trajanje);
    imeSvihUsluga.push(`${usluga}`);
  }
  
  

  const handleZakazi = async () => {
    history.push('/loginovan')
    try
    { 
      const god = izabraneUsluge.datum.getFullYear();
      const mes = izabraneUsluge.datum.getMonth() + 1;
      const dan = izabraneUsluge.datum.getDate();
      const datum = `${god}.${mes}.${dan}`
      const docRef = await addDoc
      (collection
        (db, "Zakazivanje"), 
      {
        izabraneUsluge, imeKorisnika, brojKorisnika,registarskaTablica, datum,cena
    });
  //   (collection
  //     (db, "messages"), 
  //   {
  //     body:`Postovani ${imeKorisnika}, vas termin je zakazan za ${formatiranDatum} kod frizera ${frizerValue}.`,
  //     from:"+17076570783",
  //     to:`${brojKorisnika}`
  // });

  
   // Display success message
   const overlay = document.createElement("div");
   overlay.className = "alert-overlay";

   const alertBox = document.createElement("div");
   alertBox.className = "alert-box";

   const title = document.createElement("div");
   title.className = "alert-title";
   title.textContent = "Zakazan!";

   const message = document.createElement("div");
   message.className = "alert-message";
   message.textContent = "Vaš termin je uspešno zakazan!";

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
   // Display error message
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
        <p><b>Mesto: </b> {frizerValue}</p>
        <p><b>Početak termina: </b>{pocetakTerminaValue}h</p>
        <p><b>Datum: </b> {formatiranDatum}</p>
      </div>
     
    </div>
    <button onClick={handleZakazi} className="dugmezazakazivanje">Zakaži</button>
    </div>
    <BackButton>Nazad</BackButton>
  </>
);
};

export default Detaljitermina;