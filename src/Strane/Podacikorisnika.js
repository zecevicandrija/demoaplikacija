import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from "react-router-dom";
import "./Podacikorisnika.css";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import BackButton from "./Dugmenazad";
import { collection, getDocs,  } from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";

const Podacikorisnika = () => {
  const history = useHistory();
  const location = useLocation();
  const izabraneUsluge = location.state;

  const [imeKorisnika, setImeKorisnika] = useState("");
  const [brojKorisnika, setBrojKorisnika] = useState("+3816");
  const [selectedClient, setSelectedClient] = useState(null);
  const [registarskaTablica, setRegistarskaTablica] = useState("");

  const [clients, setClients] = useState([]);
  const [autocompleteInputText, setAutocompleteInputText] = useState("");

  useEffect(() => {
    const fetchClients = async () => {
      const clientsCollection = collection(db, "Klijenti");
      const clientsSnapshot = await getDocs(clientsCollection);
      const clientsData = clientsSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data().Klijent,
      }));
      setClients(clientsData);
    };

    fetchClients();
  }, []);

  const slanjekorisnika = () => {
    const imeToSend = selectedClient ? selectedClient.ime : imeKorisnika;
    const brojToSend = selectedClient ? selectedClient.brojTelefona : brojKorisnika;

    history.push("/Detaljitermina", {
      izabraneUsluge,
      imeKorisnika: imeToSend,
      brojKorisnika: brojToSend,
      registarskaTablica,
    });
  };

  return (
    <>
      <div className="conteiner3">
        <p className="tekst3">
          Ostavite nam Vaše kontakt podatke kako bismo potvrdili rezervaciju.
        </p>
      </div>
      <div className="conteiner1">
        <div className="text-input-container">
          <p className="text1">Ime:</p>
          <Autocomplete
             freeSolo  // Ova opcija omogućava unos teksta koji nije deo ponuđenih opcija
             inputValue={autocompleteInputText}
             onInputChange={(event, newInputText) => {
               setAutocompleteInputText(newInputText); // Ažuriraj novo stanje unesenog teksta
             }}
            onChange={(event, newValue) => {
              setSelectedClient(newValue);
              setImeKorisnika(newValue ? newValue.ime : "");
              setBrojKorisnika(newValue ? newValue.brojTelefona : "");
            }}
            options={clients}
            getOptionLabel={(option) => option.ime}
            renderInput={(params) => (
              <TextField
                {...params}
                value={imeKorisnika}
                onChange={(e) => setImeKorisnika(e.target.value)}
                label="Ime"
                className="input1"
              />
            )}
          />
        </div>
        <div className="text-input-container">
          <p className="text2">Broj telefona:</p>
          <TextField
            className="input2"
            type="tel"
            value={brojKorisnika}
            onChange={(e) => setBrojKorisnika(e.target.value)}
          />
        </div>
        <div className="text-input-container">
          <p className="text2">Registarska tablica:</p>
          <TextField
            className="input2"
            value={registarskaTablica}
            onChange={(e) => setRegistarskaTablica(e.target.value)}
            label="Registarska tablica"
            variant="outlined"
          />
        </div>
      </div>
      <div className="podacikorisnikadugmad">
          <Button className="zavrsite" onClick={slanjekorisnika} variant="contained">
            Dalje
          </Button>
      
        <BackButton className="podacidugmenazad">Nazad</BackButton>
      </div>
    </>
  );
};

export default Podacikorisnika;