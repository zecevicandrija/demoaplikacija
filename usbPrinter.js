import { printer as ThermalPrinter, types as PrinterTypes } from "node-thermal-printer";

export const printReceipt = async (details) => {
  const { uslugeString, frizer, start, minuti } = details;

  const printer = new ThermalPrinter({
    type: PrinterTypes.EPSON, // ESC/POS kompatibilan
    interface: "usb", // Koristi USB vezu
    width: 48, // Širina papira
    removeSpecialCharacters: false, // Ukloni nepodržane karaktere
    lineCharacter: "-", // Karakter za crtanje linija
  });

  try {
    console.log("Proveravam da li je štampač povezan...");

    const isConnected = await printer.isPrinterConnected();
    console.log("Štampač povezan:", isConnected);

    if (!isConnected) {
      throw new Error("Štampač nije povezan! Proverite USB vezu.");
    }

    console.log("Štampanje počinje...");

    // Početak štampanja
    printer.alignCenter();
    printer.println("--- Fiskalni Račun ---");
    printer.println(`Usluge: ${uslugeString}`);
    printer.println(`Frizer: ${frizer}`);
    printer.println(`Datum: ${new Date(start).toLocaleDateString("sr-Latn-RS")}`);
    printer.println(`Vreme: ${new Date(start).toLocaleTimeString("sr-Latn-RS")}`);
    printer.println(`Trajanje: ${minuti} minuta`);
    printer.drawLine();
    printer.cut();

    // Izvrši štampanje
    await printer.execute();
    console.log("Račun uspešno odštampan!");
  } catch (error) {
    console.error("Greška prilikom štampanja:", error.message);
    throw new Error("Štampanje nije uspelo: " + error.message);
  }
};
