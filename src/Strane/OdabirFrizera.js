import React, { useState, useEffect } from "react";
import { useLocation, useHistory } from 'react-router-dom';
import Button from '@mui/material/Button';
import './Odabirfrizera.css';
import { db } from "../firebase/firebaseconfig";
import { collection, getDocs, deleteDoc, doc, query } from "firebase/firestore";
import Modal from "react-bootstrap/Modal";
import sdfsdfdsfwr from "../images/sdfsdfdsfwr.jpg";

const OdabriFrizera = ({ isLoggedIn }) => {
  const history = useHistory();
  const location = useLocation(); // <-- Add this line
  const [frizer, setFrizer] = useState(null);
  const [fbFrizer, setFbFrizer] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [radnoVreme, setRadnoVreme] = useState("");
  const [korak, setKorak] = useState("");
  const [jeFrizerOznacen, setJeFrizerOznacen] = useState(false);

  const { selectedDate } = location.state || {}; // Now 'location' is defined
  console.log(jeFrizerOznacen);

  useEffect(() => {
    async function fetchData() {
      const q = query(collection(db, "FRizeri"));

      const querySnapshot = await getDocs(q);
      let frizerisafirebasesa = [];
      querySnapshot.forEach((doc) => {
        let obj = { ...doc.data(), id: doc.id };
        frizerisafirebasesa.push(obj);
      });

      setFbFrizer(frizerisafirebasesa);
      console.log(frizerisafirebasesa);
    }
    fetchData();
  }, []);

  const izabranFrizerHandler = (event) => {
    const selectedFrizerName = event.target.checked ? event.target.name : null;
    setFrizer(selectedFrizerName);

    setJeFrizerOznacen(event.target.checked);

    // Find selected hairdresser's working hours
    const selectedFrizer = fbFrizer.find((item) => item.frizer.ime === selectedFrizerName);
    if (selectedFrizer && selectedFrizer.frizer) {
      setRadnoVreme(selectedFrizer.frizer.radnoVreme);
      setKorak(selectedFrizer.frizer.korak || "");
    } else {
      setRadnoVreme("");
    }

    console.log("Odabrani frizer:", selectedFrizerName);
    console.log("Korak:", korak);
    console.log("Radno vreme", selectedFrizer && selectedFrizer.frizer ? selectedFrizer.frizer.radnoVreme : "");
  };

  const daljeHandler = () => {
    history.push('/VrsteUsluga', { frizer, radnoVreme, korak, selectedDate });
  };
  

  const handleEdit = (frizer) => {
    history.push("/Editfrizera", frizer);
  };

  const handleDeleting = async () => {
    if (eventToDelete) {
      await deleteDoc(doc(db, "FRizeri", eventToDelete.id));
      const updatedEvents = fbFrizer.filter((ev) => ev.id !== eventToDelete.id);
      setFbFrizer(updatedEvents);
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

  return (
    <>
      <img src={sdfsdfdsfwr} className="slikapozadina" alt="POZADINAA"></img>

      {isLoggedIn && (
        <Button variant="contained" className="dodajfrizeradugme" onClick={() => { history.push("/Novifrizer"); }}>
          Dodaj Centar
        </Button>
      )}
      <div className="centriranje-div">
        {fbFrizer.map((item) => {
          return (
            <div className="kartica-container" key={item.id}>
              <label className="kartica">
                <p className="ime-usluge1">{item.frizer.ime}</p>
                <img className="slika-frizera" src={item.frizer.slika} alt="slika5 " />
                <input
                  type="checkbox"
                  checked={frizer === item.frizer.ime}
                  name={item.frizer.ime}
                  onChange={izabranFrizerHandler}
                  className="cekbox"
                />
                <div className="kartica-dugmad">
                  {isLoggedIn && (
                    <Button onClick={() => handleEdit(item)} variant="contained">
                      Edit
                    </Button>
                  )}
                  {isLoggedIn && (
                    <Button onClick={() => rejectEvent(item)} variant="contained">
                      Delete
                    </Button>
                  )}
                </div>
              </label>
            </div>
          );
        })}
      </div>

      <div className="dugme1-container">
        {frizer !== null && (
          <button
            variant="contained"
            onClick={daljeHandler}
            className="dugme1"
            disabled={frizer === null}
          >
            Dalje
          </button>
        )}
      </div>
      <Modal show={showModal} onHide={handleCloseModal} className="modal">
        <Modal.Header closeButton>
          <Modal.Title>Upozorenje</Modal.Title>
        </Modal.Header>
        <Modal.Body className="modal-question">
          Da li ste sigurni da želite da obrišete centar?
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

export default OdabriFrizera;
