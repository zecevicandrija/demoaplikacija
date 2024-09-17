// TabelaUsluga.js

import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import Button from "@mui/material/Button";
import Modal from "react-bootstrap/Modal";
import MenuItem from "@mui/material/MenuItem";
import { Select } from "@mui/material";
import "react-bootstrap/dist/react-bootstrap.min.js";
import { db } from "../firebase/firebaseconfig";
import "./Usluge.css";

const Usluga = () => {
  const [usluge, setUsluge] = useState([]);
  const [eventToDelete, setEventToDelete] = useState(null); //ovo
  const [showModal, setShowModal] = useState(false);
  const [frizeriList, setFrizeriList] = useState([]);
  const [frizer, setFrizer] = useState([]);
  const [selectedFrizer, setSelectedFrizer] = useState("");
  const history = useHistory();

  useEffect(() => {
    async function fetchData() {
      try {
        await fetchUsluge();
      } catch (error) {
        console.error("Greška pri dohvatanju podataka:", error);
      }
    }

    fetchData();
  }, [selectedFrizer]);

  useEffect(() => {
    async function fetchData() {
      try {
        const frizeriQuerySnapshot = await getDocs(collection(db, "Frizeri"));
        const frizeriData = frizeriQuerySnapshot.docs.map((doc) => doc.data().frizer.ime);
        console.log(frizeriData);
        setFrizeriList(frizeriData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [frizer]);

  async function fetchUsluge() {
    try {
      const collectionRef = collection(db, "Usluge");
      const snapshot = await getDocs(collectionRef);
      const uslugeData = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((item) => !selectedFrizer || item.frizer === selectedFrizer);
      setUsluge(uslugeData);
    } catch (error) {
      console.error("Error fetching usluge:", error);
    }
  }

  const handleDeleting = async () => { //ovo
    if (eventToDelete) {
      await deleteDoc(doc(db, "Usluge", eventToDelete.id));
      const updatedEvents = usluge.filter((ev) => ev.id !== eventToDelete.id);
      setUsluge(updatedEvents);
    }
    setShowModal(false);
    setEventToDelete(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEventToDelete(null);
  };

  const handleConfirmDelete = () => { //ovo
    handleDeleting();
  };

  const rejectEvent = (item) => { //ovo
    console.log(item);
    setEventToDelete(item);
    setShowModal(true);
  };

  const handleEdit = (selectedUsluga) => {
    history.push("/Editusluge", selectedUsluga);
  };

  return (
    <div>
      <h2 className="tabelanaslov">Tabela Usluga</h2>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={selectedFrizer}
        label="Frizer"
        onChange={(event) => setSelectedFrizer(event.target.value)}
      >
        <MenuItem key="all" value="">
          Sve Opštine
        </MenuItem>
        {frizeriList.map((frizerItem) => (
          <MenuItem key={frizerItem} value={frizerItem}>
            {frizerItem}
          </MenuItem>
        ))}
      </Select>

      <div className="dodajuslugucontainer">
        <Button variant="contained" onClick={() => history.push("/Novausluga")}>
          dodaj uslugu
        </Button>
      </div>

      <div className="service-container">
        {usluge.map((item) => (
          <div className="service-card" key={item.id}>
            <div className="card-text">
              <h3 className="ime-usluge">{item.name}</h3>
              <p className="opis-usluge">{item.opis}</p>
              <div className="vrednost-usluge">
                <p>{item.cena}rsd</p>
              </div>
              <p>{item.vrsteUsluga}</p>
              <p>{item.frizer}</p>
              <img src={item.slika} alt="slika5" className="slika1" />
              <div className="uslugedugmad">
              <Button onClick={() => handleEdit(item)} variant="contained" className="logged-in-button">
                Edit
              </Button>
              <Button onClick={() => rejectEvent(item)} variant="contained" className="logged-in-button"> {/*ovo */}
                Delete
              </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      <Modal show={showModal} onHide={handleCloseModal} className="modal"> {/*ceo modal */}
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
    </div>
  );
};

export default Usluga;