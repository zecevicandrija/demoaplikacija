import React, { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import { useLocation, useHistory } from "react-router-dom";
import "./Termini.css";
import { cloneDeep } from "lodash";
import {
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import {
  generisiOpcijePon,
  generisiOpcijeUto,
  generisiOpcijeSre,
  generisiOpcijeCet,
  generisiOpcijePet,
  generisiOpcijeSub,
  generisiOpcijeNed,
} from "./Pocetneopcije";
import { db } from "../firebase/firebaseconfig";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";

const Termini = () => {
  const history = useHistory();
  const location = useLocation();

   // Extract necessary data from location.state
   const {
    selectedDate,
    frizer,
    radnoVreme,
    korak,
    usluge,
    cena,
    trajanjeTermina,
  } = location.state || {};

   // Declare hooks at the top level, before any returns
   const [pocetakTermina, setPocetkaTermina] = useState(null);
   const [datum, setDatum] = useState(selectedDate || new Date());
   const [naseOpcije, setNaseOpcije] = useState([]);
   const [showModal, setShowModal] = useState(false);
 
   useEffect(() => {
     postaviDatum(datum);
     // eslint-disable-next-line react-hooks/exhaustive-deps
   }, [datum]);

  // Handle missing data
  if (
    !radnoVreme ||
    !usluge ||
    !frizer ||
    !selectedDate ||
    !korak ||
    !trajanjeTermina
  ) {
    console.error("Missing required data in Termini.js");
    return <div>Došlo je do greške. Molimo pokušajte ponovo.</div>;
  }



  const slanjeterminabazi = () => {
    history.push("/Podacikorisnika", {
      pocetakTermina: {
        label: pocetakTermina,
        value: pocetakTermina,
        slobodan: true,
      },
      datum,
      usluge,
      frizer,
      cena,
      trajanjeTermina,
    });
  };

  async function postaviDatum(event) {
    setDatum(event);

    // Generate initial options based on the day and working hours
    let lokalneOpcije = [];

    const dayOfWeek = event.getDay(); // 0 = Sunday, 1 = Monday, etc.

    const dayMapping = {
      1: "ponedeljak",
      2: "utorak",
      3: "sreda",
      4: "cetvrtak",
      5: "petak",
      6: "subota",
      0: "nedelja",
    };

    const dayKey = dayMapping[dayOfWeek];
    const dayRadnoVreme = radnoVreme[dayKey];

    if (!dayRadnoVreme || dayRadnoVreme.neradan) {
      // If the day is not defined or is a non-working day, no available options
      setNaseOpcije([]);
      return;
    }

    const pocetak = parseInt(dayRadnoVreme.pocetak);
    const kraj = parseInt(dayRadnoVreme.kraj);

    if (isNaN(pocetak) || isNaN(kraj)) {
      // Invalid working hours
      setNaseOpcije([]);
      return;
    }

    // Generate options based on the day
    switch (dayKey) {
      case "ponedeljak":
        lokalneOpcije = cloneDeep(generisiOpcijePon(pocetak, kraj, korak));
        break;
      case "utorak":
        lokalneOpcije = cloneDeep(generisiOpcijeUto(pocetak, kraj, korak));
        break;
      case "sreda":
        lokalneOpcije = cloneDeep(generisiOpcijeSre(pocetak, kraj, korak));
        break;
      case "cetvrtak":
        lokalneOpcije = cloneDeep(generisiOpcijeCet(pocetak, kraj, korak));
        break;
      case "petak":
        lokalneOpcije = cloneDeep(generisiOpcijePet(pocetak, kraj, korak));
        break;
      case "subota":
        lokalneOpcije = cloneDeep(generisiOpcijeSub(pocetak, kraj, korak));
        break;
      case "nedelja":
        lokalneOpcije = cloneDeep(generisiOpcijeNed(pocetak, kraj, korak));
        break;
      default:
        lokalneOpcije = [];
    }

    // Fetch existing appointments for the selected date and hairdresser
    const q = query(
      collection(db, "Zakazivanje"),
      where("izabraneUsluge.datum", "==", datum.toDateString()),
      where("izabraneUsluge.frizer", "==", frizer)
    );

    const querySnapshot = await getDocs(q);

    // Mark all options as available initially
    lokalneOpcije.forEach((opcija) => {
      opcija.slobodan = true;
    });

    // Process booked appointments
    querySnapshot.forEach((doc) => {
      let nasObjekat = doc.data();
      let bookedServices = nasObjekat.izabraneUsluge.usluge;
      let ukupnoMinuta = 0;

      Object.keys(bookedServices).forEach((item) => {
        if (bookedServices[item] !== false) {
          ukupnoMinuta += Number(bookedServices[item]);
        }
      });

      let bookedPocetakTermina = nasObjekat.izabraneUsluge.pocetakTermina.value;
      if (bookedPocetakTermina) {
        let [sat, minuti] = bookedPocetakTermina.split(":").map(Number);
        let pocetniDatum = new Date(0, 0, 0, sat, minuti);
        let krajnjiDatum = new Date(0, 0, 0, sat, minuti + ukupnoMinuta);

        lokalneOpcije = lokalneOpcije.map((item) => {
          if (item.vreme >= pocetniDatum && item.vreme < krajnjiDatum) {
            return { ...item, slobodan: false };
          }
          return item;
        });
      }
    });

    // Calculate appointment duration
    let brojKoraka = Math.ceil(trajanjeTermina / korak);

    let nasNiz = cloneDeep(lokalneOpcije);

    nasNiz.forEach((opcija, indeks) => {
      let ostaje = true;
      for (let i = indeks; i < indeks + brojKoraka; i++) {
        if (nasNiz[i] === undefined || nasNiz[i].slobodan === false) {
          ostaje = false;
          break;
        }
      }
      opcija.slobodan = ostaje;
    });

    setNaseOpcije(lokalneOpcije.filter((opcija) => opcija.slobodan === true));
  }

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleKlikDugmeta = (item) => {
    setPocetkaTermina(item.value);
    setShowModal(true);
  };

  return (
    <>
      <div className="big-container">
        <div className="small-container">
          <h1 className="terminitekst">Termini:</h1>
          <p className="terminipritisnite">
            Pritisnite na dugme termina koji želite odabrati.
          </p>
          {/* If you want to allow date change, include the calendar */}
          {/* <MyCalendar onPostavi={postaviDatum} mojDatum={datum} className="calendar" locale="en-EN" /> */}
        </div>
        <div className="small-container">
          <div className="buttons-container">
            {naseOpcije.length === 0 && <p>Nema slobodnih termina</p>}
            {naseOpcije.map((item, index) => (
              <div className="flex-item" key={index}>
                <hr className="linija"></hr>
                <button
                  className="button-option"
                  onClick={() => handleKlikDugmeta(item)}
                >
                  {item.label}
                </button>
              </div>
            ))}
          </div>
          <Modal show={showModal} onHide={handleCloseModal} className="modal">
            <Modal.Header>
              <Modal.Title>
                Pritisnite 'Dalje' ako ste odabrali željeni termin.
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="modal-question">
              Termin: {pocetakTermina}h
            </Modal.Body>
            <Modal.Footer>
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                className="modal-button-promeni"
              >
                Promeni
              </Button>
              <Button
                variant="primary"
                onClick={slanjeterminabazi}
                className="modal-button-dalje"
              >
                Dalje
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      </div>
    </>
  );
};

export default Termini;
