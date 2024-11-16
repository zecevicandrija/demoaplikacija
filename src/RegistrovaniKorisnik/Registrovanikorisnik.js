import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  query,
  where,
  updateDoc,
} from "firebase/firestore";
import { Select, MenuItem } from "@mui/material";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { db } from "../firebase/firebaseconfig";
import "./Registrovanikorisnik.css";
import EventDetailsModal from "./EventDeatilsModal";
import { useHistory } from "react-router-dom";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Uvoz CSS-a za kalendar

const Registrovanikorisnik = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [frizeriList, setFrizeriList] = useState([]);
  const [frizer, setFrizer] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [eventToDelete, setEventToDelete] = useState(null);
  const [editUserData, setEditUserData] = useState(null);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [prikaziModal, setPrikaziModal] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const history = useHistory();

  // Dodate nove state promenljive za novi kalendar
  const [currentMonthCalendar, setCurrentMonthCalendar] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());


  useEffect(() => {
    async function fetchData() {
      try {
        const frizeriQuerySnapshot = await getDocs(collection(db, "FRizeri"));
        const frizeriData = frizeriQuerySnapshot.docs.map(
          (doc) => doc.data().frizer.ime
        );
        setFrizeriList(frizeriData);

        let q = collection(db, "ZAkazivanje");

        if (frizer !== "") {
          q = query(q, where("izabraneUsluge.frizer", "==", frizer));
        }

        const querySnapshot = await getDocs(q);
        const pocetniNiz = [];
        querySnapshot.forEach((doc) => {
          let obj = { ...doc.data(), id: doc.id };
          pocetniNiz.push(obj);
        });

        const noviNiz = pocetniNiz.map((item) => {
          let pom = item.izabraneUsluge.usluge;
          let uslugeString = "";
          let ukupnoMinuta = 0;
          Object.keys(pom).forEach((item) => {
            if (pom[item] !== false) {
              uslugeString = uslugeString + " " + item;
              ukupnoMinuta = ukupnoMinuta + Number(pom[item]);
            }
          });

          let vreme = "";
          if (
            item.izabraneUsluge.pocetakTermina &&
            item.izabraneUsluge.pocetakTermina.value
          ) {
            vreme = item.izabraneUsluge.pocetakTermina.value;
            if (typeof vreme === "string") {
              vreme = vreme.split(":");
            }
          }

          let sat = Number(vreme[0]);
          let min = Number(vreme[1]);
          const pocetniDatum = item.izabraneUsluge.datum.toDate();
          pocetniDatum.setHours(sat, min);
          const krajnjiDatum = new Date(pocetniDatum);
          krajnjiDatum.setMinutes(pocetniDatum.getMinutes() + ukupnoMinuta);

          let obj = {
            title: `Korisnik: ${item.imeKorisnika}, Telefon: ${item.brojKorisnika}, Tablice: ${item.registarskaTablica}, Usluge: ${uslugeString}, Frizer: ${item.izabraneUsluge.frizer}`,
            start: pocetniDatum,
            end: krajnjiDatum,
            minuti: ukupnoMinuta,
            id: item.id,
            imeKorisnika: item.imeKorisnika,
            brojKorisnika: item.brojKorisnika,
            registarskaTablica: item.registarskaTablica,
            uslugeString,
            frizer: item.izabraneUsluge.frizer,
          };
          return obj;
        });

        // Filter out past events
        const today = new Date();
        today.setHours(0, 0, 0, 0); // Set time to midnight for accurate comparison

        const filteredNoviNiz = noviNiz.filter((event) => event.start >= today);

        setMyEvents(filteredNoviNiz);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    fetchData();
  }, [frizer]);

  const handleEditUser = (event) => {
    setEditUserData({
      id: event.id,
      imeKorisnika: event.imeKorisnika,
      brojKorisnika: event.brojKorisnika,
      registarskaTablica: event.registarskaTablica,
      uslugeString: event.uslugeString,
      frizer: event.frizer,
    });
    setShowModal(true);
  };

  const handleEditUserData = async (e) => {
    e.preventDefault();

    try {
      if (editUserData && editUserData.id) {
        const docRef = doc(db, "ZAkazivanje", editUserData.id);

        await updateDoc(docRef, {
          imeKorisnika: editUserData.imeKorisnika,
          brojKorisnika: editUserData.brojKorisnika,
          registarskaTablica: editUserData.registarskaTablica,
        });

        setMyEvents((prevEvents) => {
          return prevEvents.map((event) =>
            event.id === editUserData.id
              ? {
                  ...event,
                  title: `Korisnik: ${editUserData.imeKorisnika}, Telefon: ${editUserData.brojKorisnika}, Tablice: ${editUserData.registarskaTablica}, Usluge: ${editUserData.uslugeString}, Frizer: ${editUserData.frizer}`,
                  imeKorisnika: editUserData.imeKorisnika,
                  brojKorisnika: editUserData.brojKorisnika,
                  registarskaTablica: editUserData.registarskaTablica,
                }
              : event
          );
        });

        setShowModal(false);
        setEditUserData(null);
      } else {
        console.error("Invalid or missing data for update.");
      }
    } catch (error) {
      console.error("Error updating user data:", error);
    }
  };

  const handleDeleting = async () => {
    if (eventToDelete && eventToDelete.id) {
      await deleteDoc(doc(db, "ZAkazivanje", eventToDelete.id));

      const updatedEvents = myEvents.filter((ev) => ev.id !== eventToDelete.id);
      setMyEvents(updatedEvents);
    }
    setShowModal(false);
    setEventToDelete(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEventToDelete(null);
    setEditUserData(null);
    setPrikaziModal(false);
  };

  const rejectEvent = (event) => {
    setEventToDelete(event);
    setShowModal(true);
  };

  const handleEventClick = (event) => {
    setSelectedEvent(event);
    setPrikaziModal(true);
  };

  const nextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    );
  };

  const prevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    );
  };

  const generateCalendar = () => {
    const daysInMonth = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth() + 1,
      0
    ).getDate();

    const calendar = [];

    const today = new Date();
    let startDay = 1;

    // Adjust start day if current month is the present month
    if (
      currentMonth.getFullYear() === today.getFullYear() &&
      currentMonth.getMonth() === today.getMonth()
    ) {
      startDay = today.getDate();
    }

    for (let day = startDay; day <= daysInMonth; day++) {
      calendar.push(
        new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day)
      );
    }

    return calendar;
  };

  const calendar = generateCalendar();

  const handleZakaziClick = (date) => {
    //console.log('Navigating to VrsteUsluga with selectedDate:', date);
    history.push('/Odabrirfrizera', { selectedDate: date });
  };

  // Disable previous month button if current month is the present month
  const today = new Date();
  const isPrevMonthDisabled =
    currentMonth.getFullYear() === today.getFullYear() &&
    currentMonth.getMonth() === today.getMonth();


    // Funkcije za novi kalendar
  const generateSimpleCalendar = (year, month) => {
    const firstDayOfMonth = new Date(year, month, 1);
    let firstDayIndex = firstDayOfMonth.getDay(); // 0 (Sunday) to 6 (Saturday)
    firstDayIndex = (firstDayIndex + 6) % 7; // Adjust so that Monday is 0

    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const calendar = [];
    let week = [];
    let dayCounter = 1;

    // Fill empty slots before first day of month
    for (let i = 0; i < firstDayIndex; i++) {
      week.push(null);
    }

    // Fill the rest of the month
    while (dayCounter <= daysInMonth) {
      if (week.length === 7) {
        calendar.push(week);
        week = [];
      }

      week.push(new Date(year, month, dayCounter++));
    }

    // Fill the last week
    while (week.length < 7) {
      week.push(null);
    }
    calendar.push(week);

    return calendar;
  };

    const onDateChange = (date) => {
      setSelectedDate(date);
      history.push('/VrsteUsluga', { selectedDate: date });
    };
    

  return (
    <div className="container">
      {/* Novi kalendar na vrhu stranice */}
      {/* <div className="novikalendar">
      <Calendar
        onChange={onDateChange}
        value={selectedDate}
        minDate={new Date()}  // This will disable all past dates
      />
      </div> */}
      {/* <img src={grb324} className='pozadina' alt="grb"></img> */}
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={frizer}
        label="Frizer"
        onChange={(event) => setFrizer(event.target.value)}
        className="select-frizer"
      >
        <MenuItem key="all" value="">
          Sve Lokacije
        </MenuItem>
        {frizeriList.map((frizerItem) => (
          <MenuItem key={frizerItem} value={frizerItem}>
            {frizerItem}
          </MenuItem>
        ))}
      </Select>

      <div className="calendar-header">
        <button
          onClick={prevMonth}
          className="month-button"
          disabled={isPrevMonthDisabled}
        >
          {"<"}
        </button>
        <h2>
          {currentMonth.toLocaleString("sr-Latn-RS", {
            month: "long",
            year: "numeric",
          })}
        </h2>
        <button onClick={nextMonth} className="month-button">
          {">"}
        </button>
      </div>

      <div className="calendar-grid">
        {calendar.map((date, index) => (
          <div key={index} className="calendar-cell">
            <div className="date-number">{date.getDate()}.</div>
            {/* Day name inside each cell */}
            <div className="day-name-mobile">
              {date.toLocaleDateString("sr-Latn-RS", { weekday: "long" })}
            </div>
            <div className="events-list">
              <button
                className="kalendarzakazivanje"
                onClick={() => handleZakaziClick(date)}
              >
                Zakaži
              </button>
              {myEvents
                .filter(
                  (event) => event.start.toDateString() === date.toDateString()
                )
                .map((event) => (
                  <div key={event.id} className="event-item">
                    <span onClick={() => handleEventClick(event)}>
                      {event.imeKorisnika} -{" "}
                      {event.start.toLocaleTimeString("sr-Latn-RS", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}h
                    </span>
                    <div className="event-actions">
                      <button
                        className="event-button"
                        onClick={() => handleEventClick(event)}
                      >
                        Pregled
                      </button>
                      <button
                        className="event-button edit"
                        onClick={() => handleEditUser(event)}
                      >
                        Izmeni
                      </button>
                      <button
                        className="event-button delete"
                        onClick={() => rejectEvent(event)}
                      >
                        Obriši
                      </button>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <Modal show={showModal} onHide={handleCloseModal} className="modal">
        <Modal.Header>
          <Modal.Title>
            {editUserData ? "Izmeni informacije" : "Upozorenje"}
          </Modal.Title>
        </Modal.Header>
        {editUserData ? (
          <Modal.Body className="modal-form">
            <form onSubmit={(e) => handleEditUserData(e)}>
              <label>
                Korisnik:
                <input
                  type="text"
                  value={editUserData.imeKorisnika}
                  onChange={(e) =>
                    setEditUserData({
                      ...editUserData,
                      imeKorisnika: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Telefon:
                <input
                  type="text"
                  value={editUserData.brojKorisnika}
                  onChange={(e) =>
                    setEditUserData({
                      ...editUserData,
                      brojKorisnika: e.target.value,
                    })
                  }
                />
              </label>
              <label>
                Tablice:
                <input
                  type="text"
                  value={editUserData.registarskaTablica}
                  onChange={(e) =>
                    setEditUserData({
                      ...editUserData,
                      registarskaTablica: e.target.value,
                    })
                  }
                />
              </label>
              <button type="submit" className="sacuvajdugme">
                Sačuvaj
              </button>
            </form>
          </Modal.Body>
        ) : (
          <Modal.Body className="modal-question">
            Da li ste sigurni da želite da obrišete zakazan termin?
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={handleCloseModal}
            className="modal-button modal-button-cancel"
          >
            Otkaži
          </Button>
          {!editUserData && (
            <Button
              variant="primary"
              onClick={handleDeleting}
              className="modal-button modal-button-delete"
            >
              Obriši
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Custom Modal for Event Details */}
      {prikaziModal && selectedEvent && (
        <EventDetailsModal event={selectedEvent} onClose={handleCloseModal} />
      )}
    </div>
  );
};

export default Registrovanikorisnik;
