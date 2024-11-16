import React, { useState, useEffect } from "react";
import { useHistory, useLocation } from "react-router-dom";
import Button from "@mui/material/Button";
import { db } from "../firebase/firebaseconfig";
import { collection, getDocs, query } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import "./VrsteUsluga.css";

const VrsteUsluga = () => {
  const history = useHistory();
  const location = useLocation();
  const frizeriradnovreme = location.state || {};
  const { selectedDate = new Date() } = frizeriradnovreme;
  console.log(frizeriradnovreme)

  const [fbUsluge, setFbUsluge] = useState([]);
  const [usluge, setUsluge] = useState({});
  const [jeUslugaOdabrana, setJeUslugaOdabrana] = useState(false);
  const [cena, setCena] = useState(0);
  const [frizer, setCenter] = useState(null); // The center associated with the logged-in user

  useEffect(() => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (user) {
      const userEmail = user.email;
      //console.log(user);
      // Map user email to center
      if (userEmail === "korisnik@demo.com") {
        setCenter("Korisnik1");
      } else if (userEmail === "sombor@amss.com") {
        setCenter("Centar Sombor");
      }
    }
  }, []);

  useEffect(() => {
    async function fetchData() {
      const q = query(collection(db, "USluge"));
      const querySnapshot = await getDocs(q);
      let uslugesafirenbase = [];
      querySnapshot.forEach((doc) => {
        let obj = { ...doc.data(), id: doc.id };
        uslugesafirenbase.push(obj);
      });
      setFbUsluge(uslugesafirenbase);
    }
    fetchData();
  }, [frizer]); // Fetch services once the center is set

  const uncheckUsluga = (selectedUsluga) => {
    const updatedUsluge = { ...usluge };
    delete updatedUsluge[selectedUsluga.vrtsaUsluge];
    setUsluge(updatedUsluge);
    setCena(0);
    setJeUslugaOdabrana(Object.keys(updatedUsluge).length > 0);
  };

  const slanjeuslugebaziHandler = async () => {
    const objzaslanje = {};
    let podsetnik = null; // Podsetnik za izabranu uslugu
    for (const [key, obj] of Object.entries(usluge)) {
      objzaslanje[obj.naziv] = obj.trajanje; // Use trajanje from the selected service
      console.log(key);
      podsetnik = obj.podsetnik; // Postavi podsetnik iz izabrane usluge
    }
    
    history.push("/Zakazitermin", {
      usluge: objzaslanje,
      trajanjeTermina: objzaslanje,
      frizer,
      cena,
      selectedDate,
      podsetnik,
      frizeriradnovreme
    });
  };

  const izabraneUslugeHandler = (item) => {
    const isChecked = !!usluge[item.vrtsaUsluge];
    const novaCena = isChecked ? cena - item.cena : cena + item.cena;

    const updatedUsluge = isChecked
      ? { ...usluge }
      : {
          ...usluge,
          [item.vrtsaUsluge]: {
            naziv: item.name,
            trajanje: item.trajanje,
            cena: item.cena,
            podsetnik: item.podsetnik,
          },
        };

    if (isChecked) {
      delete updatedUsluge[item.vrtsaUsluge];
    }

    setCena(novaCena);
    setUsluge(updatedUsluge);
    setJeUslugaOdabrana(Object.keys(updatedUsluge).length > 0);
  };

  //console.log(fbUsluge);
  return (
    <div>
      {frizer && (
        <>
          <div className="centriranje">
            {fbUsluge
              .filter((item) => item.frizer === frizer) // Filter services by the user's center
              .map((item) => {
                const isChecked = Object.entries(usluge).some(
                  (arr) => arr[1].naziv === item.name
                );

                return (
                  <div
                    className={`service-card ${isChecked ? "selected" : ""}`}
                    key={item.id}
                    onClick={() => izabraneUslugeHandler(item)} // Now the whole card is clickable
                  >
                    <div className="card-text">
                      <h3 className="ime-usluge">{item.name}</h3>
                      <p className="opis-usluge">{item.opis}</p>
                      <img src={item.slika} alt="slika5" className="slika1" />
                      <label>
                        <input
                          data-ime={item.name}
                          type="checkbox"
                          name={item.vrtsaUsluge}
                          id={item.id}
                          value={item.trajanje}
                          checked={isChecked}
                          className="cekbox"
                          readOnly
                        />
                      </label>

                      {isChecked && (
                        <Button
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent triggering card's onClick
                            uncheckUsluga(item);
                          }}
                          variant="contained"
                          className="logged-in-button"
                        >
                          Poništi
                        </Button>
                      )}
                    </div>
                  </div>
                );
              })}
          </div>

          <div className="kraj">
            {jeUslugaOdabrana && (
              <button
                className="zakazitermin"
                onClick={slanjeuslugebaziHandler}
              >
                Zakaži termin
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default VrsteUsluga;
