import express from "express";
import { printReceipt } from "../usbPrinter.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const receiptDetails = req.body;

  console.log("Podaci za štampanje primljeni na serveru:", receiptDetails);

  // Validacija podataka
  if (!receiptDetails.uslugeString || !receiptDetails.frizer || !receiptDetails.start || !receiptDetails.minuti) {
    return res.status(400).json({
      error: "Sva polja (uslugeString, frizer, start, minuti) su obavezna",
    });
  }

  try {
    await printReceipt(receiptDetails);
    return res.status(200).json({ message: "Račun je uspešno odštampan" });
  } catch (error) {
    console.error("Greška prilikom štampanja:", error.message);
    return res.status(500).json({
      error: "Došlo je do greške prilikom štampanja",
      details: error.message,
    });
  }
});

export default router;
