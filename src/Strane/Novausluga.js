import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { TextField } from '@mui/material';
import Button from '@mui/material/Button';
import { collection, addDoc, getDocs } from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";
import './Novausluga.css'
import { Select, MenuItem } from "@mui/material";
import ImageUploaderComponent from './ImageUploaderComponent'; // Dodajte ovu liniju
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from "../firebase/firebaseconfig"; // Ako već nije dodato

const Novausluga = () => {
  const history = useHistory()
  const [uslugaList, setUslugaList] = useState([]);
  const [name, setName] = useState();
  const [cena, setCena] = useState();
  const [opis, setOpis] = useState();
  const [trajanje, setTrajanje] = useState();
  const [vrtsaUsluge, setVrstaUsluge] = useState("");
  const [frizeriList, setFrizeriList] = useState([]);
  const [frizer, setFrizer] = useState([]);
  const [slika, setSlika] = useState(null);
  const [podsetnik, setPodsetnik] = useState()

  useEffect(() => {
    async function fetchData() {
      try {
        const frizeriQuerySnapshot = await getDocs(collection(db, "FRizeri"));
        const frizeriData = frizeriQuerySnapshot.docs.map((doc) => doc.data().frizer.ime);
        console.log(frizeriData)
        setFrizeriList(frizeriData);
        const uslugeQuerySnapshot = await getDocs(collection(db, "KAtegorija"));
        const uslugaData = uslugeQuerySnapshot.docs.map((doc) => doc.data().kategorija);

        // Remove duplicates from the uslugaData array
        const uniqueUslugaData = [...new Set(uslugaData)];

        console.log(uniqueUslugaData);
        setUslugaList(uniqueUslugaData);

      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [frizer]);

  const slanjeUslugeBazi = async (event) => {
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
      const docRef = await addDoc(collection(db, "USluge"), {
        name,
        cena,
        opis,
        trajanje,
        podsetnik,
        vrtsaUsluge,
        slika: imageUrl, // Dodajte URL slike
        frizer,
      });

      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    history.push('/loginovan');
  };

  const nameHandler = (event) => {
    setName(event.target.value);
  }
  const cenaHandler = (event) => {
    setCena(event.target.value);
  }
  const opisHandler = (event) => {
    setOpis(event.target.value);
  }
  const trajanjeHandler = (event) => {
    setTrajanje(event.target.value);
  }

  // Dodajte funkciju za obradu odabira slike
  const handleImageUpload = (image) => {
    setSlika(image);
  };
  const podsetnikHandler = (event) =>{
    setPodsetnik(event.target.value)
  }

  return (
    <>
      <h1 className="naslov-novausluga">Nova usluga</h1>
      <div className="input-kontejner">
        <TextField value={name} onChange={nameHandler} label="Ime usluge" variant="outlined" className="input-polja" />
        <TextField value={cena} onChange={cenaHandler} label="Cena usluge" variant="outlined" className="input-polja" />
        <TextField value={trajanje} onChange={trajanjeHandler} label="Trajanje usluge" variant="outlined" className="input-polja" />
        <TextField value={podsetnik} onChange={podsetnikHandler} label="Podsetnik" variant="outlined" className="input-polja" />

        <TextField value={opis} onChange={opisHandler} label="Opis usluge" variant="outlined" className="input-polja" />

        {/* Dodajte komponentu za odabir slike */}
        <ImageUploaderComponent onImageUpload={handleImageUpload} />

        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select-vrsta"
          value={vrtsaUsluge}
          label="Vrsta usluge"
          onChange={(event) => setVrstaUsluge(event.target.value)}
        >
          {uslugaList.map((uslugeItem) => (
            <MenuItem key={uslugeItem} value={uslugeItem}>
              {uslugeItem}
            </MenuItem>
          ))}
        </Select>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={frizer}
          label="Frizer"
          onChange={(event) => setFrizer(event.target.value)}
        >
          {frizeriList.map((frizerItem) => (
            <MenuItem key={frizerItem} value={frizerItem}>
              {frizerItem}
            </MenuItem>
          ))}
        </Select>
        <Button variant="contained" onClick={slanjeUslugeBazi}>Dodaj</Button>
      </div>
    </>
  )
}

export default Novausluga;