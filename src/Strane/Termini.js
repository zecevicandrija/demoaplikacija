import React, { useState, useEffect } from "react";
import "react-calendar/dist/Calendar.css";
import { useLocation, useHistory } from "react-router-dom";
import "./Termini.css";
import { cloneDeep } from "lodash";
import { collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";
import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import { getAuth } from "firebase/auth"; // For getting the logged-in user
import {
  generisiOpcijePon,
  generisiOpcijeUto,
  generisiOpcijeSre,
  generisiOpcijeCet,
  generisiOpcijePet,
  generisiOpcijeSub,
  generisiOpcijeNed,
} from "./Pocetneopcije";

const Termini = () => {
  const history = useHistory();
  const location = useLocation();

  // Učitavanje podataka iz location.state
  const { selectedDate, usluge, cena, trajanjeTermina, podsetnik, frizeriradnovreme } = location.state || {};
  console.log("Location state:", location.state);

  const [pocetakTermina, setPocetkaTermina] = useState(null);
  const [datum, setDatum] = useState(selectedDate || new Date());
  const [naseOpcije, setNaseOpcije] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [korak, setKorak] = useState(null); // Step (interval)
  const [radnoVreme, setRadnoVreme] = useState(null); // Working hours for the center
  const [frizer, setFrizer] = useState(null); // The center for the logged-in user

  // Fetching the working hours and frizer from frizeriradnovreme
  useEffect(() => {
    if (frizeriradnovreme) {
      setRadnoVreme(frizeriradnovreme.radnoVreme);
      setFrizer(frizeriradnovreme.frizer);
      setKorak(frizeriradnovreme.korak);
    }
  }, [frizeriradnovreme]);

  useEffect(() => {
    if (datum && radnoVreme && korak) {
      postaviDatum(datum);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [datum, radnoVreme, korak]);

  // Proveri nedostaju li potrebni podaci
  if (!radnoVreme) console.error("RadnoVreme is missing");
  if (!usluge) console.error("Usluge is missing");
  if (!frizer) console.error("Frizer is missing");
  if (!selectedDate) console.error("SelectedDate is missing");
  if (!korak) console.error("Korak is missing");
  if (!trajanjeTermina) console.error("TrajanjeTermina is missing");

  if (!radnoVreme || !usluge || !frizer || !selectedDate || !korak || !trajanjeTermina) {
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
      podsetnik,
    });
  };

  async function postaviDatum(event) {
    setDatum(event);

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
      setNaseOpcije([]);
      return;
    }

    const pocetak = parseInt(dayRadnoVreme.pocetak);
    const kraj = parseInt(dayRadnoVreme.kraj);

    if (isNaN(pocetak) || isNaN(kraj)) {
      setNaseOpcije([]);
      return;
    }

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

    // Upit ka Firestore da nam da usluge za izabrani datum
    const q = query(
      collection(db, "ZAkazivanje"),
      where("izabraneUsluge.datum", "==", event),
      where("izabraneUsluge.frizer", "==", frizer)
    );

    const querySnapshot = await getDocs(q);

    lokalneOpcije.forEach((opcija) => {
      opcija.slobodan = true;
    });

    querySnapshot.forEach((doc) => {
      let nasObjekat = doc.data();
      let pom = nasObjekat.izabraneUsluge.usluge;
      let ukupnoMinuta = 0;

      Object.keys(pom).forEach((item) => {
        if (pom[item] !== false) {
          ukupnoMinuta += Number(pom[item]);
        }
      });

      let pocetakTermina = nasObjekat.izabraneUsluge.pocetakTermina.value;
      if (pocetakTermina) {
        let satMinut = pocetakTermina.split(":");
        let sat = +satMinut[0];
        let minuti = +satMinut[1];
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

    let trajanjeMojeUsluge = 0;
    Object.keys(usluge).forEach((item) => {
      if (usluge[item] !== false) {
        trajanjeMojeUsluge += Number(usluge[item]);
      }
    });

    let brojKoraka = Math.ceil(trajanjeMojeUsluge / korak);

    let nasNiz = cloneDeep(lokalneOpcije);
    console.log(lokalneOpcije);
    nasNiz.forEach((opcija, indeks) => {
      let ostaje = true;
      for (let i = indeks; i < indeks + brojKoraka; i++) {
        if (nasNiz[i] === undefined || nasNiz[i].slobodan === false) {
          ostaje = false;
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
    console.log(item.value);
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
