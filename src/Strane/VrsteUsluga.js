import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import "./VrsteUsluga.css";
import Button from "@mui/material/Button";
import { db } from "../firebase/firebaseconfig";
import "../RegistrovaniKorisnik/ErrorModal.css";
import { collection, getDocs, query } from "firebase/firestore";
import BackButton from "./Dugmenazad";
import Slider from "@mui/material/Slider";
import Typography from "@mui/material/Typography";

const VrsteUsluga = ({ isLoggedIn }) => {
  const history = useHistory();
  const location = useLocation();
  
  const frizeriradnovreme = location.state || {};
  const {
    frizer = '',
    krajRadnogVremena = '',
    pocetakRadnogVremena = '',
    korak = 30,
    radnoVreme = {},
    selectedDate = new Date(),
  } = frizeriradnovreme;
  
  console.log(frizeriradnovreme);

  const [fbUsluge, setFbUsluge] = useState([]);
  const [usluge, setUsluge] = useState({});
  const [jeUslugaOdabrana, setJeUslugaOdabrana] = useState(false);
  const [cena, setCena] = useState(0);
  const [trajanjeTermina, setTrajanjeTermina] = useState(15);

  useEffect(() => {
    async function fetchData() {
      const q = query(collection(db, "Usluge"));
      const querySnapshot = await getDocs(q);
      let uslugesafirenbase = [];
      querySnapshot.forEach((doc) => {
        let obj = { ...doc.data(), id: doc.id };
        uslugesafirenbase.push(obj);
        console.log(obj);
      });
      setFbUsluge(uslugesafirenbase);
    }
    fetchData();
  }, [frizer]);

  const uncheckUsluga = (selectedUsluga) => {
    const updatedUsluge = { ...usluge };
    delete updatedUsluge[selectedUsluga.vrtsaUsluge];
    setUsluge(updatedUsluge);
    setCena(0);
    setJeUslugaOdabrana(Object.keys(updatedUsluge).length > 0);
  };

  const handleSliderChange = (event, newValue) => {
    setTrajanjeTermina(newValue);
  };

  const slanjeuslugebaziHandler = async () => {
    const objzaslanje = {};
    for (const [key, obj] of Object.entries(usluge)) {
      objzaslanje[obj.naziv] = trajanjeTermina;
      console.log(key);
    }
    history.push("/Zakazitermin", {
      usluge: objzaslanje,
      krajRadnogVremena,
      pocetakRadnogVremena,
      korak,
      radnoVreme,
      frizer,
      cena,
      trajanjeTermina,
      selectedDate,
    });
  };

  const izabraneUslugeHandler = (event, item) => {
    console.log("event.target.checked:", event.target.checked);
    console.log("item.cena:", item.cena);
    console.log("Trenutna cena:", cena);
    if (!item) {
      console.error("Item nije definisan");
      return;
    }

    const dataIme = event.target.getAttribute("data-ime");
    const novaCena = event.target.checked ? cena + +item.cena : cena + item.cena;
    setCena(novaCena);

    setUsluge({
      ...usluge,
      [event.target.name]: {
        naziv: dataIme,
        trajanje: trajanjeTermina,
        cena: item.cena,
      },
    });

    setJeUslugaOdabrana(Object.keys(usluge).length >= 0);
  };

  console.log(cena);

  return (
    <div>
      <div className="uslugecentar">
        <h1 className="usluge">Usluge</h1>
      </div>
      <div className="pazljivocentar">
        <div className="pazljivo">
          Pažljivo pročitajte opis usluga pre odabira i prelaska na naredni korak. Možete izabrati jednu ili više usluga.
        </div>
      </div>
      <div className="slider-container">
        <Typography id="discrete-slider" gutterBottom>
          Trajanje termina (min)
        </Typography>
        <Slider
          value={trajanjeTermina}
          onChange={handleSliderChange}
          aria-labelledby="discrete-slider"
          valueLabelDisplay="auto"
          step={5}
          marks
          min={15}
          max={120}
        />
      </div>

      <div className="centriranje">
        {fbUsluge
          .filter((item) => item.frizer === frizer)
          .map((item) => {
            const isChecked = Object.entries(usluge).some(
              (arr) => arr[1].naziv === item.name
            );

            return (
              <div className="service-card" key={item.id}>
                <div className="card-text">
                  <h3 className="ime-usluge">{item.name}</h3>
                  <p className="opis-usluge">{item.opis}</p>
                  <div className="vrednost-usluge"></div>
                  <img src={item.slika} alt="slika5  " className="slika1" />
                  <p>{item.vrsteUsluga}</p>
                  <label>
                    <input
                      data-ime={item.name}
                      type="checkbox"
                      name={item.vrtsaUsluge}
                      id={item.id}
                      value={item.trajanje}
                      onChange={(event) => izabraneUslugeHandler(event, item)}
                      checked={isChecked}
                      className="cekbox"
                    />
                  </label>

                  {isChecked && (
                    <Button
                      onClick={() => uncheckUsluga(item)}
                      variant="contained"
                      className="logged-in-button"
                    >
                      Poništi
                    </Button>
                  )}
                  <div className="kartica-dugmad2"></div>
                </div>
              </div>
            );
          })}
      </div>

      <div className="kraj">
        {jeUslugaOdabrana && (
          <button className="zakazitermin" onClick={slanjeuslugebaziHandler}>
            Zakaži termin
          </button>
        )}
      </div>
      <BackButton>Nazad</BackButton>
    </div>
  );
};

export default VrsteUsluga;
