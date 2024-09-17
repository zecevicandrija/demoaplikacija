import React, { useState } from "react";
import { TextField } from "@mui/material";
import { useHistory,useLocation,} from "react-router-dom/cjs/react-router-dom.min";
import Button from "@mui/material/Button";
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";
import './Editusluge.css'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import ImageUploaderComponent from './ImageUploaderComponent'; // Dodajte ovu liniju
import { storage } from "../firebase/firebaseconfig"; // Ako već nije dodato

;

const Editusluge = ({ selectedUsluga }) => {
  const location = useLocation();
  const podaci = location.state;
  const history = useHistory();
  console.log(podaci);
  

  const initialUsluga = {
    id: podaci.id,
    novoIme: podaci.name,
    novaCena: podaci.cena,
    noviOpis: podaci.opis,
    novaVrstaUsluge: podaci.vrstaUsluge,
    novoTrajanje: podaci.trajanje,
    novaSlika: podaci.slika,
    noviFrizer: podaci.frizer
  };

  const [usluga, setUsluga] = useState(initialUsluga);

  const handleImageUpload = (image) => {
    setUsluga((prevUsluga) => ({
      ...prevUsluga,
      novaSlika: image,
    }));
  };
  
  const uploadImageToStorage = async (imageFile) => {
    try {
      // Kreiranje referenci na Storage
      const storageRef = ref(storage, `images/${usluga.novoIme}`); // Postavite odgovarajuću putanju
  
      // Prenos slike
      const snapshot = await uploadBytes(storageRef, imageFile);
  
      // Dobijanje URL-a slike
      const downloadURL = await getDownloadURL(snapshot.ref);
  
      return downloadURL;
    } catch (error) {
      console.error('Greška pri prenosu slike:', error);
      throw error;
    }
  };
  

  const slanjeUslugeBazi = async () => {
    try {
      if (!usluga.id) {
        console.error("Document ID not found.");
        return;
      }
  
      let imageUrl = usluga.novaSlika;
      if (usluga.novaSlika instanceof File) {
        imageUrl = await uploadImageToStorage(usluga.novaSlika);
      }
  
      const updatedUsluga = {
        name: usluga.novoIme,
        cena: usluga.novaCena,
        opis: usluga.noviOpis,
        trajanje: usluga.novoTrajanje,
        slika: imageUrl,
      };
  
      await updateDoc(doc(db, "Usluge", usluga.id), updatedUsluga);
      console.log("Dokument uspešno ažuriran.");
      history.push("./Odabrirfrizera");
    } catch (e) {
      console.error("Greška pri ažuriranju dokumenta: ", e);
  };
    history.push("./Odabrirfrizera");
  };

  const handleUslugaChange = (event) => {
    const { name, value } = event.target;
    setUsluga((prevUsluga) => ({
      ...prevUsluga,
      [name]: value,
    }));
  };

return(
    <>
      <h1 className="naslov-editusluga">Edit usluge</h1>
      <div className="edit-kontejner">
      <TextField
        value={usluga.novoIme || ""}
        name="novoIme"
        onChange={handleUslugaChange}
        label="Ime"
        variant="outlined"
        className="edit-polja"
      />
      <TextField
        value={usluga.novaCena || ""}
        name="novaCena"
        onChange={handleUslugaChange}
        label="Cena"
        variant="outlined"
        className="edit-polja"
      />
      <TextField
        value={usluga.noviOpis || ""}
        name="noviOpis"
        onChange={handleUslugaChange}
        label="Opis"
        variant="outlined"
        className="edit-polja"
      />
      <ImageUploaderComponent onImageUpload={handleImageUpload} />
      <Button   variant="contained" onClick={slanjeUslugeBazi}>
        Sačuvaj promene
      </Button>
      </div>
    </>
  );
};

export default Editusluge;