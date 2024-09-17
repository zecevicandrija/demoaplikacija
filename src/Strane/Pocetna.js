import React from "react";
import { Link } from "react-router-dom";
import classes from "./Pocetna.module.css";
import instaicon from "../images/instaicon.png";
import grb324 from "../images/grb324.jpg";
import amsslogo from "../images/amsslogo.png";

const Pocetna = () => {
  

  return (
    <>
      {/* <video
        autoPlay
        playsInline
        loop
        muted
        disablePictureInPicture
        controls={false}
        className={classes["video-bg"]}
      >
        <source src={video} type="video/mp4" />
      </video> */}
      <img src={grb324} className={classes["video-bg"]} alt="grb"></img>
      <div className={classes.container}>
        <img src={amsslogo} alt="LOGO" className={classes.firstImage}/>
        <div className={classes.info}>
          <h1>Dobro došli na softver</h1>
          <h2>Auto-Moto Savez Srbije</h2>
          <Link to={"/loginovan"} className={classes.button}>
            ZAKAŽI TERMIN
          </Link>
          <div className={classes.instagram}>
            <a
              href="https://www.instagram.com/undovrbas"
              target="_blank"
              rel="noopener noreferrer"
            >
              <img
                src={instaicon}
                alt="Instagram"
                className={classes.instaIcon}
              />
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default Pocetna;
