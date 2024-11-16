import React, { useState } from "react";
import { TextField } from '@mui/material';
import { useLocation, useHistory } from "react-router-dom";
import Button from '@mui/material/Button';
import { updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";
import './Editfrizera.css'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from "../firebase/firebaseconfig";

import ImageUploaderComponent from './ImageUploaderComponent';



const Editfrizera = ({ selectedFrizer }) => {
  const history = useHistory();
  const location = useLocation();
  const podaci = location.state;
  console.log(podaci);

  const initialFrizer = {
    id: podaci.id,
    novoIme: podaci.frizer.ime,
    novaSlika: podaci.frizer.slika
  };

  const [frizer, setFrizer] = useState(initialFrizer);


  const handleImageUpload = (image) => {
    setFrizer((prevFrizer) => ({
      ...prevFrizer,
      novaSlika: image,
    }));
  };

  const uploadImageToStorage = async (imageFile) => {
    try {
      // Kreiranje referenci na Storage
      const storageRef = ref(storage, `images/${frizer.novoIme}`); // Postavite odgovarajuću putanju
console.log(`images/${frizer.novoIme}`)
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



  const slanjeFrizeraBazi = async () => {
    try {
      if (!frizer.id) {
        console.error("Document ID not found.");
        return;
      }

      let imageUrl = frizer.novaSlika;
      if (frizer.novaSlika instanceof File) {
        imageUrl = await uploadImageToStorage(frizer.novaSlika);
      }

      const updatedFrizer = {
        frizer: {
          ime: frizer.novoIme,
          slika: imageUrl,
        },
      };

      await updateDoc(doc(db, "FRizeri", frizer.id), updatedFrizer);
      console.log("Dokument uspešno ažuriran.");
      history.push('./Odabrirfrizera');
    } catch (e) {
      console.error("Greška pri ažuriranju dokumenta: ", e);
    }
  };

  const handleFrizerChange = (event) => {
    const { name, value } = event.target;
    setFrizer((prevFrizer) => ({
      ...prevFrizer,
      [name]: value
    }));
  };

  return (
    <>
      <h1 className="frizer-naslov">Edit frizera</h1>
      <div className="frizer-kontejner">
        <TextField
          value={frizer.novoIme || ""}
          name="novoIme"
          onChange={handleFrizerChange}
          label="Ime"
          variant="outlined"
          className="frizer-polje"
        />
        {/* <TextField
          value={frizer.novaSlika || ""}
          name="novaSlika"
          onChange={handleFrizerChange}
          label="Slika"
          variant="outlined"
          className="frizer-polje"
        /> */}
        <ImageUploaderComponent onImageUpload={handleImageUpload} />

        <Button variant="contained" onClick={slanjeFrizeraBazi}>
          Sačuvaj promene
        </Button>
      </div>
    </>
  );
};

export default Editfrizera;