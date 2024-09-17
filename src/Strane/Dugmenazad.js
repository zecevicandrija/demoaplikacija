import React from 'react';
import { useHistory } from 'react-router-dom';
import './Dugmenazad.css';


function BackButton() {
    const history = useHistory();
  
    const goBack = () => {
      history.goBack();
    };
  
    return (
      <button onClick={goBack} className='dugmenazad'>Nazad</button>
    );
  }
  
  export default BackButton;
  