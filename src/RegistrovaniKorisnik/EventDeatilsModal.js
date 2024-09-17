import React from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import './EventDetailsModal.css';

const EventDetailsModal = ({ event, onClose }) => {
  if (!event) {
    return null; // If no event, don't render the modal
  }

  return (
    <Modal show={!!event} onHide={onClose}>
      <Modal.Header closeButton>
        <Modal.Title className='moasmds'>Detalji Termina</Modal.Title>
      </Modal.Header>
      <Modal.Body>
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
            <strong>Frizer:</strong> {event.frizer}
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
          {/* Add more details as needed */}
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={onClose}>
          Zatvori
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EventDetailsModal;
