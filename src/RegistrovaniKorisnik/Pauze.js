import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import Calendar from "react-calendar";
import styles from "./Pauza.module.css";
import { Select, MenuItem,Slider } from "@mui/material";
import  {pocetneOpcije}  from "../Strane/Pocetneopcije";
import { db } from "../firebase/firebaseconfig";
import { collection, getDocs,  addDoc } from "firebase/firestore";




const Pauza = (onPostavi, mojDatum) => {
  const history = useHistory()
  const [datum, setDatum] = useState([]);
  const [pocetakTermina, setpocetakTermina] = useState("");
  const [sliderValue, setSliderValue] = useState(30);
  const [pauzaCitavDan, setPauzaCitavDan] = useState(false);
  const [frizer, setFrizer] = useState(null); // Change 'false' to 'null'
  const [frizeriList, setFrizeriList] = useState([]);

  useEffect(() => {
    async function fetchFrizeri() {
      try {
        const frizeriQuerySnapshot = await getDocs(collection(db, "FRizeri"));
        const frizeriData = frizeriQuerySnapshot.docs.map((doc) => doc.data().frizer.ime);
        setFrizeriList(frizeriData);
      } catch (error) {
        console.error("Greška prilikom dohvaćanja frizera:", error);
      }
    }

    fetchFrizeri();
  }, []);
  
  const slanjePauzeBazi = async (event) => {
    try {
      const docRef = await addDoc(collection(db, "ZAkazivanje"), {
        imeKorisnika: "pauza",
        brojKorisnika: "01234567",
        izabraneUsluge: {'datum':datum,'frizer':frizer ,pocetakTermina , usluge: { 'pauza': sliderValue }},
      });
      console.log("Document written with ID: ", docRef.id);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
    history.push('/loginovan')
  };


 
  const handlePauzaCitavDan = () => {
    setPauzaCitavDan(!pauzaCitavDan)
    setSliderValue(720)
    setpocetakTermina({
      value: "08:00",
      label: "08:00",
      vreme: new Date(0, 0, 0, 8, 0),
      slobodan: true,
    })
  };

  const handleDateChange = (date) => {
    setDatum(date);
    console.log("Izabrani dan/dani:", date);
    setSliderValue(30)
    setPauzaCitavDan(false)
  };

  const handleHourChange = (event) => {
    setpocetakTermina(event.target.value);
   
  };
  const handleFrizerChange = (event) => {
    setFrizer(event.target.value);
  };
console.log(frizer)
  const handleSliderChange = (event, value) => {
    setSliderValue(value);
  };
  const renderSelectedDates = () => {
    if (datum.length === 0) {
      return <p>Nije izabran nijedan datum.</p>;
    }

    return (
      <p>
        Izabrani datumi:
        {datum.toLocaleDateString()}
      </p>
    );
  };

  return (
    <>
    <p>Izaberite Opštinu.</p>
    <Select
  labelId="frizer-label"
  id="frizer-select"
  value={frizer}
  options={frizeriList}
  label="Frizer"
  onChange={handleFrizerChange}
  className="novi-frizer-input"
> 
  {frizeriList.map((frizerItem) => (
    <MenuItem key={frizerItem} value={frizerItem}>
      {frizerItem}
    </MenuItem>
  ))}
</Select>

    
    
    <div className={styles["pauza-container"]}>
     
        <div>
          <Calendar
            selectRange={false}
            value={datum[0]}
            onChange={handleDateChange}
          />
        </div>
      

      {renderSelectedDates()}

      
        <div className={styles["slider-container"]}>
          <Slider
            aria-label="Temperature"
            defaultValue={sliderValue}
            value={sliderValue}
            onChange={handleSliderChange}
            step={10}
            marks
            min={10}
            max={720}
          />
          <p className={styles["slider-value"]}>{sliderValue}</p>
        </div>
        <div className={styles["pauza-checkboxes"]}>
        <div>
          <label>
            <input
              type="checkbox"
              checked={pauzaCitavDan}
              onChange={handlePauzaCitavDan}
            />
            Pauza ceo dan
          </label>
        </div>
      </div>
     

      <div className={styles["pauza-time-inputs"]}>
        <div>
          <label htmlFor="hour">Hour:</label>
          <div id="hour" onChange={handleHourChange} value={pocetakTermina} type="number">
            <ReactSelect
              value={pocetakTermina}
              onChange={setpocetakTermina}
              options={pocetneOpcije}
              className={styles["Select__control"]} // Dodavanje klase za stilizaciju Select komponente
              classNamePrefix="Select"
            />
          </div>
        </div>
      </div>

      <button className={styles["button"]} onClick={slanjePauzeBazi}>
        Zakaži pauzu
      </button>
    </div>
    </>
  );
};

export default Pauza;