import React, { useState, useEffect } from "react";
import { TextField,  Button } from "@mui/material";
import {
  collection,
  addDoc,
  deleteDoc,
  updateDoc,
  doc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import "./Kategorijausluge.css";
import "./ErrorModal.css";
import { db } from "../firebase/firebaseconfig";
import Modal from "react-bootstrap/Modal";

const Kategorijausluge = () => {
  const [kategorija, setKategorija] = useState("");
  const [fbKategorije, setFbKategorije] = useState([]);
  const [izmenaKategorije, setIzmenaKategorije] = useState("");
  const [izmenaId, setIzmenaId] = useState(null);
  const [izmenaMode, setIzmenaMode] = useState(false);

  const [eventToDelete, setEventToDelete] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const getKategorije = async () => {
      try {
        const kategorijeSnapshot = await getDocs(collection(db, "KAtegorija"));
        const kategorijeData = kategorijeSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setFbKategorije(kategorijeData);
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    };
    getKategorije();
  }, []);

  const slanjeKategorijeBazi = async () => {
    try {
      await addDoc(collection(db, "KAtegorija"), { kategorija });
      setKategorija("");
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  const handleDeleting = async () => {
    if (eventToDelete) {
      // Dohvatite kategoriju koja se briše
      const categoryToDelete = fbKategorije.find((k) => k.id === eventToDelete.id);
  
      if (categoryToDelete) {
        // Obrišite kategoriju
        await deleteDoc(doc(db, "KAtegorija", eventToDelete.id));
  
        // Dohvatite sve usluge koje imaju vrstu usluge koja se podudara sa obrisanom kategorijom
        const servicesQuery = query(
          collection(db, "USluge"),
          where("vrtsaUsluge", "==", categoryToDelete.kategorija)
        );
  
        const servicesSnapshot = await getDocs(servicesQuery);
  
        // Iterirajte kroz usluge i obrišite ih
        for (const serviceDoc of servicesSnapshot.docs) {
          await deleteDoc(serviceDoc.ref);
        }
  
        // Ažurirajte stanje aplikacije
        const updatedEvents = fbKategorije.filter((ev) => ev.id !== eventToDelete.id);
        setFbKategorije(updatedEvents);
      }
    }
    setShowModal(false);
    setEventToDelete(null);
  };
  

  const handleCloseModal = () => {
    setShowModal(false);
    setEventToDelete(null);
  };

  const handleConfirmDelete = () => {
    handleDeleting();
  };

  const rejectEvent = (item) => {
    console.log(item);
    setEventToDelete(item);
    setShowModal(true);
  };
  

  const prikaziIzmenu = (id, kategorija) => {
    setIzmenaMode(true);
    setIzmenaId(id);
    setIzmenaKategorije(kategorija);
  };

  const sacuvajIzmenu = async () => {
    try {
      const kategorijaRef = doc(db, "KAtegorija", izmenaId);
      await updateDoc(kategorijaRef, { kategorija: izmenaKategorije });
      const novaKategorijaLista = fbKategorije.map((k) =>
        k.id === izmenaId ? { ...k, kategorija: izmenaKategorije } : k
      );
      setFbKategorije(novaKategorijaLista);
      setIzmenaKategorije("");
      setIzmenaId(null);
      setIzmenaMode(false);
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  const kategorijaHandler = (event) => {
    setKategorija(event.target.value);
  };

  const izmenaKategorijeHandler = (event) => {
    setIzmenaKategorije(event.target.value);
  };

  return (
    <>
      <div className="top">
        <div className="prvidiv">
          {izmenaMode ? (
            // Prikazi polje za izmenu kategorije
            <TextField
              value={izmenaKategorije}
              onChange={izmenaKategorijeHandler}
              label="Izmeni kategoriju"
              variant="outlined"
              className="novi-frizer-input-izmena"
            />
          ) : (
            // Prikazi polje za dodavanje kategorije
            <TextField
              value={kategorija}
              onChange={kategorijaHandler}
              label="Kategorija"
              variant="outlined"
              className="novi-frizer-input"
            />
          )}
          {izmenaMode ? (
            // Prikazi dugme za čuvanje izmene
            <Button variant="contained" onClick={sacuvajIzmenu}>
              Sačuvaj izmenu
            </Button>
          ) : (
            // Prikazi dugme za dodavanje kategorije
            <Button variant="contained" onClick={slanjeKategorijeBazi}>
              Dodaj kategoriju
            </Button>
          )}
        </div>

        <div>
          <h2>Kategorije</h2>
          <ul className="kategorijekartice">
            {fbKategorije.map((item) => (
              <li key={item.id}>
                {item.kategorija}
                <Button onClick={() => rejectEvent(item)}>Obriši</Button>
                <Button onClick={() => prikaziIzmenu(item.id, item.kategorija)}>Izmeni</Button>
              </li>
            ))}
          </ul>
        </div>
      </div>
      <Modal show={showModal} onHide={handleCloseModal} className="modal">
        <Modal.Header closeButton>
          <Modal.Title>Upozorenje</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-question">
          Da li ste sigurni da želite da obrišete projekat?
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            className="modal-button modal-button-cancel"
          >
            Otkaži
          </Button>
          <Button
            variant="primary"
            onClick={handleConfirmDelete}
            className="modal-button modal-button-delete"
          >
            Obriši
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Kategorijausluge;