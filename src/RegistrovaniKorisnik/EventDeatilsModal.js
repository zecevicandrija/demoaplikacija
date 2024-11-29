import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './EventDetailsModal.css';

const EventDetailsModal = ({ event, onClose }) => {
  if (!event) {
    return null; 
  }

 
  console.log('Event received in modal:', event);

  const usluge = event.izabraneUsluge && event.izabraneUsluge.usluge ? event.izabraneUsluge.usluge : {};
  console.log('Usluge object:', usluge);

  let ukupnoTrajanje = 0;
  for (const [usluga, trajanje] of Object.entries(usluge)) {
    console.log(`Service: ${usluga}, Duration: ${trajanje}`);
    ukupnoTrajanje += parseInt(trajanje) || 0; 
  }

  console.log('Total duration:', ukupnoTrajanje);



  const handlePrintReceipt = async () => {
    const receiptDetails = {
      uslugeString: event.uslugeString || "Nepoznate usluge",
      frizer: event.frizer || "Nepoznati radnik",
      start: event.start ? event.start.toISOString() : new Date().toISOString(),
      minuti: event.minuti || 0,
    };
  
    console.log("Podaci poslati serveru za štampanje:", receiptDetails);
  
    try {
      const response = await fetch("http://localhost:5000/api/print-receipt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(receiptDetails),
      });
  
      if (response.ok) {
        alert("Račun je uspešno odštampan!");
      } else {
        const errorDetails = await response.json();
        console.error("Greška na serveru:", errorDetails);
        alert("Došlo je do greške prilikom štampanja.");
      }
    } catch (error) {
      console.error("Greška u komunikaciji sa serverom:", error);
      alert("Nije moguće poslati zahtev za štampanje.");
    }
  };
  
  return (
    <Modal show={!!event} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title className='moasmds'>Detalji Termina</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="vertical-line3"></div>
        <div>
          <p className='tekstmodala'>
            <strong>Korisnik:</strong> {event.imeKorisnika}
          </p>
          <p className='tekstmodala'>
            <strong>Telefon:</strong> {event.brojKorisnika}
          </p>
          <p className='tekstmodala'>
            <strong>Tablice:</strong> {event.registarskaTablica}
          </p>
          <p className='tekstmodala'>
            <strong>Usluge:</strong> {event.uslugeString}
          </p>
          <p className='tekstmodala'>
            <strong>Radnik:</strong> {event.frizer}
          </p>
          <p className='tekstmodala'>
            <strong>Trajanje:</strong> {event.minuti}min
          </p>
          <p className='tekstmodala'>
            <strong>Datum i Vreme:</strong>{" "}
            {event.start.toLocaleDateString("sr-Latn-RS", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}{" "}
            u{" "}
            {event.start.toLocaleTimeString("sr-RS", {
              hour: "2-digit",
              minute: "2-digit",
            })}h
          </p>
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose} className='zatvoridugmee'>
          Zatvori
        </Button>
        <Button className="modal-button print-button" onClick={handlePrintReceipt}>
            Račun
          </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventDetailsModal;
