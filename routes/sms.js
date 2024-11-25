import express from 'express';
import fetch from 'node-fetch'; // Za pravljenje HTTP zahteva

const router = express.Router();

// Endpoint za slanje SMS-a
router.post('/', async (req, res) => {
  const { to, message, from, type } = req.body;

  // Provera obaveznih polja
  if (!to || !message || !from || !type) {
    return res.status(400).json({ error: 'Sva polja (to, message, from, type) su obavezna' });
  }

  try {
    // Poziv prema SMS API-ju
    const response = await fetch('https://api.smsagent.rs/v1/sms/bulk', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'EIVtX3IXREwa5NDcJ9NAZrnlEgnF3e5bsCSQvPWR8kyTJVCXKZFTbSEqAlv9O2Qj6xIkUROST3Bfz4juYtXHhUTH2Qk8fa67rQ65BugmOfwU9M113lSMSGBp5lfZBhwK',
      },
      body: JSON.stringify({ to, message, from, type }),
    });

    const data = await response.json();

    if (response.ok) {
      // Uspešan odgovor
      return res.status(200).json({ message: 'SMS poslat uspešno', data });
    } else {
      // Greška na API-ju
      return res.status(response.status).json({ error: 'Greška prilikom slanja SMS-a', details: data });
    }
  } catch (error) {
    // Greška na serveru
    return res.status(500).json({ error: 'Greška na serveru', details: error.message });
  }
});

export default router;
