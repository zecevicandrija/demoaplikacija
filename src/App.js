import React, { useState } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import NavBar from './Navigacija/NavBar';
import Pocetna from './Strane/Pocetna';
import Termini from './Strane/Termini';
import VrsteUsluga from './Strane/VrsteUsluga';
import Podacikorisnika from './Strane/Podacikorisnika';
import Login from './RegistrovaniKorisnik/Login';
import Registrovanikorisnik from './RegistrovaniKorisnik/Registrovanikorisnik';
import Pauza from './RegistrovaniKorisnik/Pauze';
import Detaljitermina from './Strane/Detaljitermina';
import  Novausluga from './Strane/Novausluga';
import Editusluga from './Strane/Editusluge';
import OdabriFrizera from './Strane/OdabirFrizera';
import Editfrizera from './Strane/Editfrizera'
import Novifrizer from './Strane/NoviFrizer';
import Statistika from './RegistrovaniKorisnik/Statistika';
import RadnoVreme from './RegistrovaniKorisnik/Radnovreme';
import Kategorijausluge from './RegistrovaniKorisnik/Kategorijausluge';
import Usluga from './RegistrovaniKorisnik/Usluge';
import Klijenti from './RegistrovaniKorisnik/Klijenti';

import { getAuth, onAuthStateChanged } from '@firebase/auth'





function App() {
  const [user, setUser] = useState()
  const [error, setError] = useState()
  
  console.log("APP ", user)
  onAuthStateChanged(getAuth(), (user) => {
    if (user) {
//        console.log(user)
      setUser(user)
      
    } else {
      setUser(null)
      // User is signed out
      // ...
    }
  }, setError)
 

  

  return (
    <>
      <div>
        {user && <NavBar/>}
        
        <Switch>
          {!user && (
            <Route path="/login" exact> 
              <Login/>
            </Route>
          )}
     <Route path="/loginovan">
  {user && <Registrovanikorisnik/>}
</Route>
<Route path="/usluge">
  {user && <Usluga/>}
</Route>
<Route path='/pauza'>
  {user &&<Pauza/>}
</Route>
<Route path='/Novausluga'>
  {user && < Novausluga/>}
</Route>
<Route path="/Editusluge">
  {user && <Editusluga/>}
</Route>
<Route path='/Novifrizer'>
  {user && <Novifrizer/>}
</Route>
 <Route path="/Editfrizera">
  {user && <Editfrizera/>}
          </Route> 
          <Route path="/Radnovreme">
            {user && <RadnoVreme/>}
          </Route>
          <Route path="/Kategorija">
            {user && <Kategorijausluge/>}
          </Route>
     
          <Route path="/Statistika">
            {user && <Statistika/>}
          </Route>
          
          <Route path="/PocetnaStrana">
          {user && <Pocetna/>}
          </Route>
          <Route path='/Odabrirfrizera' >
            <OdabriFrizera isLoggedIn={user}/>
          </Route>
          <Route path="/VrsteUsluga">
            <VrsteUsluga isLoggedIn={user} />
          </Route>
          <Route path="/Zakazitermin" exact>
          {user && <Termini/>}
          </Route>
          <Route path="/Podacikorisnika">
          {user && <Podacikorisnika/>}
          </Route>
          <Route path='/Detaljitermina'>
          {user && <Detaljitermina/>}
          </Route>
          <Route path='/Klijenti'>
                {user && <Klijenti/>}
          </Route>
          <Route path="/">
            <Redirect to="/login" />
          </Route>
          
          
          
        </Switch>
        
        
      </div>
      </>
  );
}

export default App;