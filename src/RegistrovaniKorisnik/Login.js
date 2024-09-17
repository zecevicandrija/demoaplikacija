import React, { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import classes from './Login.module.css';
import { useHistory } from "react-router-dom";


const firebaseConfig = {
  apiKey: "AIzaSyBbT71IAPmqiM6xUvC3b97uFZY3zgSeaUs",
  authDomain: "novi-248ee.firebaseapp.com",
  projectId: "novi-248ee",
  storageBucket: "novi-248ee.appspot.com",
  messagingSenderId: "442685719725",
  appId: "1:442685719725:web:2c987078115e30ba3cb224",
  measurementId: "G-FQPEJZDESH"
};
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const Login = () => {
  const history = useHistory();

 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null); // Dodali smo promenljivu za praćenje greške
  const [loginAttempts, setLoginAttempts] = useState(0); // Track login attempts

   const onLogin = (e) => {
    e.preventDefault();
    setError(null); // Resetujemo prethodnu grešku prilikom novog pokušaja prijave
   
  

     signInWithEmailAndPassword(auth, email, password)
       .then((userCredential) => {
         const user = userCredential.user;
      //   console.log('Ulogovan korisnik:', user);
         history.push("/loginovan");
          //Čuvanje informacija o prijavljenom korisniku u lokalno skladište
         //localStorage.setItem('user', JSON.stringify(user)); //ovo je problem!!
       })
       .catch((error) => {
         const errorCode = error.code;
         const errorMessage = error.message;
         console.log('Greška pri prijavi:', errorCode, errorMessage);
         setError(errorMessage);  //Postavljamo grešku za prikaz u ErrorModal-u

         // Increment login attempts
        setLoginAttempts(loginAttempts + 1);

        if (loginAttempts === 1) {
          // If this is the second failed attempt, disable the button
          document.getElementById('loginBtn').disabled = true;
          setError('Two consecutive failed login attempts. Please refresh the page.');
        }
       });
  }; 

  return (
    <>
      <main>
        <section className={classes.login}>
          <div>
            <p>Uloguj se</p>
            <form>
              <div>
                <label htmlFor="email-address">Email adresa</label>
                <input
                  id="email-address"
                  name="email"
                  type="email"
                  required
                  placeholder="Email adresa"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div>
                <label htmlFor="password">Lozinka</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  placeholder="Lozinka"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <div>
                <button onClick={onLogin} disabled={loginAttempts === 2}>Prijavi se</button>
              </div>
            </form>
          </div>
        </section>
      </main>

      {/* Prikaz ErrorModal-a ako postoji greška */}
      {error && (
        <div className="modal">
          <div className="modal-content">
            <p className="modal-question">
              {error.includes('password')
                ? 'Greška u šifri.'
                : 'Pogrešna email adresa ili šifra.'}
            </p>
            <button className="modal-button modal-button-delete" onClick={() => setError(null)}>
              Zatvori
            </button>
          </div>
        </div>
      )}
    </>
  );
};
export default Login