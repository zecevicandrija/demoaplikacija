import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './EventDetailsModal.css';

const EventDetailsModal = ({ event, onClose }) => {
  if (!event) {
    return null; // If no event, don't render the modal
  }

  // Log event structure to debug where the issue is
  console.log('Event received in modal:', event);

  // Attempt to reference izabraneUsluge and usluge
  const usluge = event.izabraneUsluge && event.izabraneUsluge.usluge ? event.izabraneUsluge.usluge : {};
  console.log('Usluge object:', usluge);

  // Calculate the total duration
  let ukupnoTrajanje = 0;
  for (const [usluga, trajanje] of Object.entries(usluge)) {
    console.log(`Service: ${usluga}, Duration: ${trajanje}`);
    ukupnoTrajanje += parseInt(trajanje) || 0; // Fallback to 0 if invalid
  }

  console.log('Total duration:', ukupnoTrajanje);

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
      </Modal.Footer>
    </Modal>
  );
};

export default EventDetailsModal;
