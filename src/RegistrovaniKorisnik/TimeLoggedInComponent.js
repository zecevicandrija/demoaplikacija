import React, { useEffect, useState } from 'react';

const TimeLoggedInComponent = ({ ip, time }) => {
  return (
    <div>
      <p>
        IP Address: {ip} | Time Logged In: {new Date(time).toLocaleString()}
      </p>
    </div>
  );
};

/* 
<tr>
    <td>GPS</td>
    <td>Lat: {ipData.latitude} | Long: {ipData.longitude}</td>
</tr>
 */

export default TimeLoggedInComponent;
