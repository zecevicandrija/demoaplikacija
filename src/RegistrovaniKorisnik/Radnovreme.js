import React, { useState, useEffect } from "react";
import { Select, MenuItem, Button, Slider } from "@mui/material";
import { db } from "../firebase/firebaseconfig";
import "./Radnovreme.css";
import {
  getDocs,
  collection,
  query,
  where,
  doc,
  updateDoc,
} from "firebase/firestore";

const RadnoVreme = () => {
  const [frizer, setFrizer] = useState("");
  const [workHours, setWorkHours] = useState({});
  const [sliderValue, setSliderValue] = useState(15);
  const [frizeriList, setFrizeriList] = useState([]);

  const daysOfWeek = [
    "ponedeljak",
    "utorak",
    "sreda",
    "cetvrtak",
    "petak",
    "subota",
    "nedelja",
  ];

  useEffect(() => {
    async function fetchData() {
      const frizeriQuerySnapshot = await getDocs(collection(db, "FRizeri"));

      let frizeriData = [];
      frizeriQuerySnapshot.forEach((doc) => {
        let obj = { ...doc.data(), id: doc.id };
        frizeriData.push(obj);
      });

      setFrizeriList(frizeriData);
    }
    fetchData();
  }, []);

  useEffect(() => {
    const odabraniFrizer = frizeriList.find(
      (frizerItem) => frizerItem.frizer.ime === frizer
    );

    if (odabraniFrizer) {
      setWorkHours(odabraniFrizer.frizer.radnoVreme || {});
      setSliderValue(odabraniFrizer.frizer.korak || 15);
    } else {
      const initialWorkHours = {};
      daysOfWeek.forEach((day) => {
        initialWorkHours[day] = { pocetak: "", kraj: "", neradan: false };
      });
      setWorkHours(initialWorkHours);
      setSliderValue(15);
    }
  }, [frizer, frizeriList]);

  const generateTimeOptions = (startHour, endHour) => {
    const options = [];
    for (let hour = startHour; hour <= endHour; hour++) {
      const formattedHour = hour.toString().padStart(2, "0");
      options.push(formattedHour);
    }
    return options;
  };

  const timeOptionsPocetak = generateTimeOptions(7, 20);
  const timeOptionsKraj = generateTimeOptions(7, 20);

  const handleNeradanChange = (event, day) => {
    const newWorkHours = { ...workHours };
    newWorkHours[day] = newWorkHours[day] || { pocetak: "", kraj: "", neradan: false };
    newWorkHours[day].neradan = event.target.checked;
    setWorkHours(newWorkHours);
  };

  const handleTimeChange = (event, day, type) => {
    const newWorkHours = { ...workHours };
    newWorkHours[day] = newWorkHours[day] || { pocetak: "", kraj: "", neradan: false };
    newWorkHours[day][type] = event.target.value;
    setWorkHours(newWorkHours);
  };

  const handleSpremiRadnoVreme = async () => {
    try {
      const frizerQuerySnapshot = await getDocs(
        query(collection(db, "FRizeri"), where("frizer.ime", "==", frizer))
      );
      if (frizerQuerySnapshot.docs.length === 0) {
        return;
      }

      const frizerDoc = frizerQuerySnapshot.docs[0];
      const frizerId = frizerDoc.id;

      const updatedWorkHours = {};
      daysOfWeek.forEach((day) => {
        updatedWorkHours[day] = {
          pocetak: workHours[day].pocetak ? parseInt(workHours[day].pocetak) : "",
          kraj: workHours[day].kraj ? parseInt(workHours[day].kraj) : "",
          neradan: workHours[day].neradan || false,
        };
      });

      await updateDoc(doc(db, "FRizeri", frizerId), {
        "frizer.radnoVreme": updatedWorkHours,
        "frizer.korak": sliderValue,
      });

      setFrizer("");
      setSliderValue(15);
    } catch (error) {
      console.error("Greška prilikom ažuriranja radnog vremena:", error);
    }
  };

  const handleFrizerChange = (event) => {
    setFrizer(event.target.value);
  };

  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };


  return (
    <div className="radno-vreme-container">
      <h2>Radno Vreme</h2>
      <p>Izaberite lokaciju ako želite da dodate/menjate radno vreme.</p>
      <Select
        labelId="frizer-label"
        id="frizer-select"
        value={frizer}
        label="Frizer"
        onChange={handleFrizerChange}
        className="novi-frizer-input-radno2"
      >
        {frizeriList.map((frizerItem) => (
          <MenuItem key={frizerItem.frizer.id} value={frizerItem.frizer.ime}>
            {frizerItem.frizer.ime}
          </MenuItem>
        ))}
      </Select>

      {frizer ? (
        <div>
          {daysOfWeek.map((day) => (
            <div key={day} className="day-container">
              <div className="day-label">
                {day.charAt(0).toUpperCase() + day.slice(1)}
              </div>
              <input
                type="checkbox"
                checked={workHours[day]?.neradan || false}
                onChange={(event) => handleNeradanChange(event, day)}
                className="neradan-checkbox"
              />
              <label className="neradan-checkbox-label">
                (označite za neradan dan)
              </label>
              <Select
                value={workHours[day]?.pocetak || ""}
                onChange={(event) => handleTimeChange(event, day, "pocetak")}
                label="Početak radnog vremena"
                variant="outlined"
                className="time-selector"
              >
                {timeOptionsPocetak.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
              <Select
                value={workHours[day]?.kraj || ""}
                onChange={(event) => handleTimeChange(event, day, "kraj")}
                label="Kraj radnog vremena"
                variant="outlined"
                className="time-selector"
              >
                {timeOptionsKraj.map((time) => (
                  <MenuItem key={time} value={time}>
                    {time}
                  </MenuItem>
                ))}
              </Select>
            </div>
          ))}

          <Slider
            aria-label="Korak"
            defaultValue={sliderValue}
            value={sliderValue}
            onChange={handleSliderChange}
            step={5}
            marks
            min={5}
            max={60}
            className="slider-container"
          />
          <div>Trenutna vrednost slajdera: {sliderValue}</div>
          <p className="slajderp">
            Slajder predstavlja korak između termina. Npr ako je 15 termini će biti raspoređeni 8:00, 8:15, 8:30, 8:45 itd...
          </p>
          <Button variant="contained" onClick={handleSpremiRadnoVreme}>
            Spremi radno vreme
          </Button>
        </div>
      ) : (
        <div className="radnovremebutton">
          <Button variant="contained">Napravi radno vreme</Button>
        </div>
      )}

      <div className="table-responsive">
        {/* Desktop tabela */}
        <div className="desktop-table">
          <table className="radno-vreme-table">
            <thead>
              <tr>
                <th>Lokacija</th>
                {frizeriList.map((frizerItem) => (
                  <React.Fragment key={frizerItem.frizer.id}>
                    <th colSpan="2">{frizerItem.frizer.ime}</th>
                  </React.Fragment>
                ))}
              </tr>
              <tr>
                <th></th>
                {frizeriList.map((frizerItem) => (
                  <React.Fragment key={frizerItem.frizer.id}>
                    <th>Početak</th>
                    <th>Kraj</th>
                  </React.Fragment>
                ))}
              </tr>
            </thead>
            <tbody>
              {daysOfWeek.map((day, index) => (
                <tr key={index}>
                  <td>{day.charAt(0).toUpperCase() + day.slice(1)}</td>
                  {frizeriList.map((frizerItem) => (
                    <React.Fragment key={frizerItem.frizer.id}>
                      <td>
                        {frizerItem.frizer.radnoVreme &&
                        frizerItem.frizer.radnoVreme[day] &&
                        frizerItem.frizer.radnoVreme[day].pocetak !== undefined
                          ? frizerItem.frizer.radnoVreme[day].pocetak
                          : "Nije postavljeno"}
                      </td>
                      <td>
                        {frizerItem.frizer.radnoVreme &&
                        frizerItem.frizer.radnoVreme[day] &&
                        frizerItem.frizer.radnoVreme[day].kraj !== undefined
                          ? frizerItem.frizer.radnoVreme[day].kraj
                          : "Nije postavljeno"}
                      </td>
                    </React.Fragment>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobilni prikaz */}
        <div className="mobile-view">
          {frizeriList.map((frizerItem) => (
            <div key={frizerItem.frizer.id} className="frizer-mobile-card">
              <h3 className="frizer-name-mobile">{frizerItem.frizer.ime}</h3>
              {daysOfWeek.map((day, index) => (
                <div key={index} className="day-mobile-card">
                  <h4 className="day-name-mobile">
                    {day.charAt(0).toUpperCase() + day.slice(1)}
                  </h4>
                  <p className="frizer-time-mobile">
                    Početak:{" "}
                    {frizerItem.frizer.radnoVreme &&
                    frizerItem.frizer.radnoVreme[day] &&
                    frizerItem.frizer.radnoVreme[day].pocetak !== undefined
                      ? frizerItem.frizer.radnoVreme[day].pocetak
                      : "Nije postavljeno"}
                  </p>
                  <p className="frizer-time-mobile">
                    Kraj:{" "}
                    {frizerItem.frizer.radnoVreme &&
                    frizerItem.frizer.radnoVreme[day] &&
                    frizerItem.frizer.radnoVreme[day].kraj !== undefined
                      ? frizerItem.frizer.radnoVreme[day].kraj
                      : "Nije postavljeno"}
                  </p>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RadnoVreme;
