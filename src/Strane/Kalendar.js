import React from 'react';
import Calendar from 'react-calendar';
import moment from 'moment';
import './Kalendar.css';

function MyCalendar({ mojDatum, onPostavi }) {

  const tileDisabled = ({ date }) => {
    const currentDate = moment();
  

    // Prvo, zaključaj sve prethodne subote
    if (moment(date).isBefore(currentDate, 'day')) {
      return true;
    }

    // // Proveri da li je datum više od 14 dana u budućnosti
    // const isFutureDate = moment(date).isAfter(currentDate.add(14, 'days'), 'day');

    // // Proveri da li je datum više od 7 dana u budućnosti (narednih 2 subote)
    // const isNotNextTwoSaturdays = moment(date).isAfter(currentDate.add(7, 'days'), 'day');

    //return isFutureDate || isNotNextTwoSaturdays;
  };

  return (
    <div className="my-calendar-container">
      <Calendar value={mojDatum} tileDisabled={tileDisabled} onChange={onPostavi} className="my-calendar"/>
    </div>
  );
}

export default MyCalendar;