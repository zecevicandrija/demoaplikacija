import React, { useState, useEffect } from 'react';
import { NavLink, Link } from 'react-router-dom';
import './NavBar.css';
import { getAuth, onAuthStateChanged, signOut } from '@firebase/auth';
import amsslogo from "../images/amsslogo.png";

const Navbar = () => {
  const [user, setUser] = useState();
  const [error, setError] = useState();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setUser(user);
      } else {
        setUser(null);
      }
    }, setError);
    return () => unsubscribe();
  }, []);

  const handleLogoutClick = () => {
    signOut(getAuth());
  };

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = (e) => {
    e.stopPropagation();
    setMenuOpen(!menuOpen);
  };

  useEffect(() => {
    const closeMenu = () => {
      setMenuOpen(false);
    };
    document.body.addEventListener('click', closeMenu);

    return () => {
      document.body.removeEventListener('click', closeMenu);
    };
  }, []);

  const handleNavbarClick = (e) => {
    e.stopPropagation();
  };

  return (
    <nav className="navbar">
      <div className="navbar-logo">
        <Link to={'/loginovan'}>
          <img src={amsslogo} alt='(logo)' className='logo' />
        </Link>
      </div>
      <div className={`navbar-menu ${menuOpen ? 'active' : ''}`} onClick={handleNavbarClick}>
        {user && (
          <NavLink to={'/loginovan'} className="navbar-link" activeClassName='active-link'>Termini</NavLink>
        )}
        {user && (
          <NavLink to={'/Klijenti'} className="navbar-link" activeClassName='active-link'>Klijenti</NavLink>
        )}
        {user && (
          <NavLink to={'/Kategorija'} className="navbar-link" activeClassName='active-link'>Kategorija</NavLink>
        )}
        {user && (
          <NavLink to={'/pauza'} className="navbar-link" activeClassName='active-link'>Pauza</NavLink>
        )}
        {user && (
          <NavLink to={'/Statistika'} className="navbar-link" activeClassName='active-link'>Statistika</NavLink>
        )}
        {user && (
          <NavLink to={'/usluge'} className="navbar-link" activeClassName='active-link'>Tabela Usluge</NavLink>
        )}
        {user && (
          <NavLink to={'/Radnovreme'} className="navbar-link" activeClassName='active-link'>Radno vreme</NavLink>
        )}
        {user && (
          <Link to={'/Odjava'} className="navbar-link" onClick={handleLogoutClick}>
            Izloguj se
          </Link>
        )}
      </div>
      <div className="navbar-toggle" onClick={toggleMenu}>
        <span className="bar"></span>
        <span className="bar"></span>
        <span className="bar"></span>
      </div>
    </nav>
  );
};

export default Navbar;
