export const pocetneOpcije = [
  // Ponedeljak - Petak (od 9 do 19)
  ...Array.from({ length: 48 }, (_, i) => {
    const hour = 8 + Math.floor(i / 4);
    const minute = i % 4 === 0 ? '00' : (i % 4) * 15;
    return {
      value: `${hour.toString().padStart(2, '0')}:${minute}`,
      label: `${hour.toString().padStart(2, '0')}:${minute}`,
      vreme: new Date(0, 0, 0, hour, minute),
      slobodan: true,
    };
  })
];


export const generisiOpcijePon = (pocetak, kraj, korak) => {
  const pocetneOpcije = [];
  for (let hour = pocetak; hour <= kraj-1; hour++) {
    for (let minute = 0; minute < 60; minute += korak) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      const value = `${formattedHour}:${formattedMinute}`;
      pocetneOpcije.push({
        value,
        label: value,
        vreme: new Date(0, 0, 0, hour, minute),
        slobodan: true,
      });
    }
  }
  return pocetneOpcije;
};
export const generisiOpcijeUto = (pocetak, kraj, korak) => {
  const pocetneOpcije = [];
  for (let hour = pocetak; hour <= kraj-1; hour++) {
    for (let minute = 0; minute < 60; minute += korak) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      const value = `${formattedHour}:${formattedMinute}`;
      pocetneOpcije.push({
        value,
        label: value,
        vreme: new Date(0, 0, 0, hour, minute),
        slobodan: true,
      });
    }
  }
  return pocetneOpcije;
};
export const generisiOpcijeSre = (pocetak, kraj, korak) => {
  const pocetneOpcije = [];
  for (let hour = pocetak; hour <= kraj-1; hour++) {
    for (let minute = 0; minute < 60; minute += korak) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      const value = `${formattedHour}:${formattedMinute}`;
      pocetneOpcije.push({
        value,
        label: value,
        vreme: new Date(0, 0, 0, hour, minute),
        slobodan: true,
      });
    }
  }
  return pocetneOpcije;
};
export const generisiOpcijeCet = (pocetak, kraj, korak) => {
  const pocetneOpcije = [];
  for (let hour = pocetak; hour <= kraj-1; hour++) {
    for (let minute = 0; minute < 60; minute += korak) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      const value = `${formattedHour}:${formattedMinute}`;
      pocetneOpcije.push({
        value,
        label: value,
        vreme: new Date(0, 0, 0, hour, minute),
        slobodan: true,
      });
    }
  }
  return pocetneOpcije;
};
export const generisiOpcijePet = (pocetak, kraj, korak) => {
  const pocetneOpcije = [];
  for (let hour = pocetak; hour <= kraj-1; hour++) {
    for (let minute = 0; minute < 60; minute += korak) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      const value = `${formattedHour}:${formattedMinute}`;
      pocetneOpcije.push({
        value,
        label: value,
        vreme: new Date(0, 0, 0, hour, minute),
        slobodan: true,
      });
    }
  }
  return pocetneOpcije;
};
export const generisiOpcijeSub = (pocetak, kraj, korak) => {
  const pocetneOpcije = [];
  for (let hour = pocetak; hour <= kraj-1; hour++) {
    for (let minute = 0; minute < 60; minute += korak) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      const value = `${formattedHour}:${formattedMinute}`;
      pocetneOpcije.push({
        value,
        label: value,
        vreme: new Date(0, 0, 0, hour, minute),
        slobodan: true,
      });
    }
  }
  return pocetneOpcije;
};
export const generisiOpcijeNed = (pocetak, kraj, korak) => {
  const pocetneOpcije = [];
  for (let hour = pocetak; hour <= kraj-1; hour++) {
    for (let minute = 0; minute < 60; minute += korak) {
      const formattedHour = hour.toString().padStart(2, '0');
      const formattedMinute = minute.toString().padStart(2, '0');
      const value = `${formattedHour}:${formattedMinute}`;
      pocetneOpcije.push({
        value,
        label: value,
        vreme: new Date(0, 0, 0, hour, minute),
        slobodan: true,
      });
    }
  }
  return pocetneOpcije;
};
