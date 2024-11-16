import React, { useState } from "react";
import { Button, TextField } from "@mui/material";
import { collection, addDoc } from "firebase/firestore";
import { storage } from "../firebase/firebaseconfig";
import { db } from "../firebase/firebaseconfig";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useHistory } from "react-router-dom";
import "./NoviFrizer.css";

const NoviFrizer = () => {
  const history = useHistory();
  const [ime, setIme] = useState("");
  const [slika, setSlika] = useState(null);

  const slanjeFrizeraBazi = async () => {
    try {
      // Učitaj sliku u Firebase Storage
      let imageUrl = null;
      if (slika) {
        const storageRef = ref(storage, `images/${slika.name}`);
        await uploadBytes(storageRef, slika);

        // Dobijanje URL-a slike
        const downloadURL = await getDownloadURL(storageRef);
        imageUrl = downloadURL;
      }

      // Dodaj podatke u Firestore
      const docRef = await addDoc(collection(db, "FRizeri"), {
        frizer: {
          ime: ime,
          slika: imageUrl,
        },
      });

      console.log("Dokument napisan s ID-om: ", docRef.id);
    } catch (e) {
      console.error("Greška pri dodavanju dokumenta: ", e);
    }
    history.push("/Odabrirfrizera");
  };

  const imeHandler = (event) => {
    setIme(event.target.value);
  };

  const slikaHandler = (event) => {
    if (event.target.files && event.target.files[0]) {
      setSlika(event.target.files[0]);
    }
  };

  return (
    <>
      <h1 className="novifrizer-naslov">Novi Frizer</h1>
      <div className="dodajfrizera-kontejner">
        <TextField
          value={ime}
          onChange={imeHandler}
          label="Ime"
          variant="outlined"
          className="novi-frizer-input"
        />
        <input
          type="file"
          accept="image/*"
          onChange={slikaHandler}
          className="novi-frizer-input"
        />
        <Button variant="contained" onClick={slanjeFrizeraBazi}>
          Dodaj
        </Button>
      </div>
    </>
  );
};

export default NoviFrizer;
