import React, { useState, useEffect } from "react";
import { Button, TextField, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper } from "@mui/material";
import { collection, addDoc, getDocs, deleteDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseconfig";
import "./Klijenti.css";

const Klijenti = () => {
  const [ime, setIme] = useState("");
  const [broj, setBroj] = useState("");
  const [brojVozila, setBrojVozila] = useState("");
  const [klijenti, setKlijenti] = useState([]);
  const [selectedClientId, setSelectedClientId] = useState(null);

  useEffect(() => {
    const fetchKlijenti = async () => {
      const klijentiCollection = collection(db, "KLijenti");
      const klijentiSnapshot = await getDocs(klijentiCollection);
      const klijentiData = klijentiSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data().Klijent }));
      setKlijenti(klijentiData);
    };

    fetchKlijenti();
  }, []); // Fetch clients on component mount

  const slanjeFrizeraBazi = async () => {
    if (selectedClientId) {
      // Update existing client
      await updateDoc(doc(db, "KLijenti", selectedClientId), {
        Klijent: {
          ime: ime,
          brojTelefona: broj,
          brojVozila: brojVozila,
        },
      });
    } else {
      // Add new client
      const docRef = await addDoc(collection(db, "KLijenti"), {
        Klijent: {
          ime: ime,
          brojTelefona: broj,
          brojVozila: brojVozila,
        },
      });
      console.log(docRef)
    }
  
    // Clear the form and reset selectedClientId
    setIme("");
    setBroj("");
    setBrojVozila("");
    setSelectedClientId(null);
    // Fetch updated data from Firestore and refresh the table
    const klijentiCollection = collection(db, "KLijenti");
    const klijentiSnapshot = await getDocs(klijentiCollection);
    const klijentiData = klijentiSnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data().Klijent }));
    setKlijenti(klijentiData);
  };
  

  const deleteKlijent = async (id) => {
    // Delete client from Firestore
    await deleteDoc(doc(db, "KLijenti", id));

    // Update the local state by removing the deleted client
    setKlijenti(klijenti.filter((client) => client.id !== id));
  };

  const editKlijent = (client) => {
    // Populate the form with the selected client data
    setIme(client.ime);
    setBroj(client.brojTelefona);
    setBrojVozila(client.brojVozila);

    // Set the selectedClientId for editing
    setSelectedClientId(client.id);
  };

  const cancelEdit = () => {
    // Clear the form and reset selectedClientId
    setIme("");
    setBroj("");
    setBrojVozila("");
    setSelectedClientId(null);
  };

  return (
    <>
      <h1 className="custom-heading">Klijenti</h1>
      <div className="form-container">
        <TextField
          value={ime}
          onChange={(e) => setIme(e.target.value)}
          label="Ime"
          variant="outlined"
          className="input-field"
        />
        <TextField
          value={broj}
          onChange={(e) => setBroj(e.target.value)}
          label="Broj telefona"
          variant="outlined"
          className="input-field"
        />
        {/* <TextField
          value={brojVozila}
          onChange={(e) => setBrojVozila(e.target.value)}
          label="Broj vozila"
          variant="outlined"
          className="input-field"
        /> */}
        
        <Button variant="contained" onClick={slanjeFrizeraBazi} style={{ marginBottom: selectedClientId ? '10px' : '0' }}>
          {selectedClientId ? "Sacuvaj Izmene" : "Dodaj"}
        </Button>
        {selectedClientId && (
          <Button variant="contained" color="secondary" onClick={cancelEdit}>
            Otkaži
          </Button>
        )}
      </div>

      {/* Centered table container */}
      <div className="table-container">
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Ime</TableCell>
                <TableCell>Broj telefona</TableCell>
                {/* <TableCell>Broj vozila</TableCell> */}
                <TableCell>Akcije</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {klijenti.map((client) => (
                <TableRow key={client.id}>
                  <TableCell>{client.ime}</TableCell>
                  <TableCell>{client.brojTelefona}</TableCell>
                  {/* <TableCell>{client.brojVozila}</TableCell> */}
                  <TableCell>
                    <Button onClick={() => editKlijent(client)}>Izmeni</Button>
                    <Button onClick={() => deleteKlijent(client.id)}>Obrisi</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </>
  );
};

export default Klijenti;