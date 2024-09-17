import React, { useState, useEffect } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";
import { Link } from "react-router-dom";
import "./Statistika.css";
import { Select, TextField } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";

const Statistika = () => {
  const [myEvents, setMyEvents] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 15;
  const [frizeriList, setFrizeriList] = useState([]);
  const [odabraniFrizer, setOdabraniFrizer] = useState("");
  const [ukupnaZarada, setUkupnaZarada] = useState(0);
  const [filterIme, setFilterIme] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [currentLetter, setCurrentLetter] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        let q = collection(db, "Zakazivanje");

        if (odabraniFrizer) {
          q = query(q, where("izabraneUsluge.frizer", "==", odabraniFrizer));
        }

        if (currentLetter) {
          q = query(
            q,
            where("imeKorisnika", ">=", currentLetter),
            where("imeKorisnika", "<", currentLetter + "\uf8ff")
          );
        }

        // Handle date filters
        if (startDate && endDate) {
          const timeDifference = endDate.getTime() - startDate.getTime();

          if (timeDifference < 86400000) {
            // Less than 24 hours
            q = query(
              q,
              where("izabraneUsluge.datum", ">=", startDate),
              where(
                "izabraneUsluge.datum",
                "<=",
                new Date(endDate.getTime() + 86400000)
              )
            );
          } else {
            q = query(
              q,
              where("izabraneUsluge.datum", ">=", startDate),
              where("izabraneUsluge.datum", "<=", endDate)
            );
          }
        } else if (startDate) {
          q = query(q, where("izabraneUsluge.datum", ">=", startDate));
        } else if (endDate) {
          q = query(q, where("izabraneUsluge.datum", "<=", endDate));
        }

        const querySnapshot = await getDocs(q);

        const noviNiz = querySnapshot.docs.map((doc) => {
          let pom = doc.data().izabraneUsluge.usluge;
          let uslugeString = "";
          let ukupnoMinuta = 0;
          Object.keys(pom).forEach((usluga) => {
            if (pom[usluga] !== false) {
              uslugeString = uslugeString + " " + usluga;
              ukupnoMinuta = ukupnoMinuta + Number(pom[usluga]);
            }
          });

          const datumTimestamp = doc.data().izabraneUsluge.datum;
          const seconds = datumTimestamp.seconds;
          const milliseconds = seconds * 1000;
          const pocetniDatum = new Date(milliseconds);
          let vreme = doc.data().izabraneUsluge.pocetakTermina.value.split(":");
          let sat = Number(vreme[0]);
          let min = Number(vreme[1]);
          pocetniDatum.setHours(sat, min);
          const krajnjiDatum = new Date(pocetniDatum);
          krajnjiDatum.setMinutes(pocetniDatum.getMinutes() + ukupnoMinuta);

          return {
            title: `Korisnik: ${doc.data().imeKorisnika}, telefon: ${doc.data().brojKorisnika}, narucene usluge ${uslugeString}, frizer ${doc.data().izabraneUsluge.frizer} `,
            start: pocetniDatum,
            end: krajnjiDatum,
            minuti: ukupnoMinuta,
            id: doc.id,
            imeKorisnika: doc.data().imeKorisnika,
            brojKorisnika: doc.data().brojKorisnika,
            frizer: doc.data().izabraneUsluge.frizer,
            usluge: uslugeString,
            cena: doc.data().izabraneUsluge.cena,
          };
        });

        // Filter the data based on start and end dates
        let filteredData = noviNiz.filter((item) => {
          return (
            (!startDate || item.start.getTime() >= startDate.getTime()) &&
            (!endDate || item.start.getTime() <= endDate.getTime())
          );
        });

        // Calculate total earnings from filtered data
        const novaUkupnaZarada = filteredData.reduce(
          (total, item) => +total + +item.cena,
          0
        );

        setMyEvents(filteredData);
        setUkupnaZarada(novaUkupnaZarada);
      } catch (error) {
        console.error("Error fetching data:", error);
      }

      const frizeriQuerySnapshot = await getDocs(collection(db, "Frizeri"));
      const frizeriData = frizeriQuerySnapshot.docs.map(
        (doc) => doc.data().frizer.ime
      );
      setFrizeriList(frizeriData);
    }

    fetchData();
  }, [currentLetter, odabraniFrizer, filterIme, startDate, endDate]);

  const filterHandler = (event) => {
    const input = event.target.value;
    setFilterIme(input);

    if (input === currentLetter) {
      // If the same letter is selected, reset dates
      setStartDate(null);
      setEndDate(null);
      setCurrentLetter("");
    } else {
      setCurrentLetter(input);
    }
  };

  const handleStartDateChange = (date) => {
    setStartDate(new Date(date)); // Convert string to Date object
  };

  const handleEndDateChange = (date) => {
    setEndDate(new Date(date)); // Convert string to Date object
  };

  const totalItems = myEvents.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = myEvents.slice(indexOfFirstItem, indexOfLastItem);

  const renderPaginationButtons = () => {
    const pageButtons = [];

    for (let i = 1; i <= totalPages; i++) {
      pageButtons.push(
        <li
          key={i}
          className={`page-item ${currentPage === i ? "active" : ""}`}
        >
          <button className="page-link" onClick={() => setCurrentPage(i)}>
            {i}
          </button>
        </li>
      );
    }

    return pageButtons;
  };

  return (
    <div className="container">
      <Select
        labelId="frizer-select-label"
        id="frizer-select"
        value={odabraniFrizer}
        label="Frizer"
        onChange={(event) => setOdabraniFrizer(event.target.value)}
        className="frizer-select"
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
      <div className="filter-container">
        <TextField
          value={filterIme}
          onChange={filterHandler}
          label="Filtriraj po imenu klijenta"
          variant="outlined"
          className="filter-input"
        />
      </div>
      <div className="date-filter-container">
        <TextField
          label="Početni datum"
          type="date"
          onChange={(event) => handleStartDateChange(event.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          className="date-input"
        />
        <TextField
          label="Krajnji datum"
          type="date"
          onChange={(event) => handleEndDateChange(event.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          className="date-input"
        />
      </div>
      <div className="calendar">
        <table className="event-table">
          <thead>
            <tr>
              <th>Ime korisnika</th>
              <th>Broj korisnika</th>
              <th>Naručene usluge</th>
              <th>Datum</th>
              <th>Sati</th>
              <th>Centar</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map((item, index) => (
              <tr key={index}>
                <td data-label="Ime korisnika">{item.imeKorisnika}</td>
                <td data-label="Broj korisnika">{item.brojKorisnika}</td>
                <td data-label="Naručene usluge">{item.usluge}</td>
                <td data-label="Datum">{item.start.toLocaleDateString()}</td>
                <td data-label="Sati">{item.start.toLocaleTimeString()}</td>
                <td data-label="Centar">{item.frizer}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <nav>
          <ul className="pagination">{renderPaginationButtons()}</ul>
        </nav>

        <div className="ukupna-zarada">
          <b>Ukupna zarada: {ukupnaZarada}</b>
        </div>

        <Link to={"/"} className="calendar-link">
          Nazad
        </Link>
      </div>
    </div>
  );
};

export default Statistika;
