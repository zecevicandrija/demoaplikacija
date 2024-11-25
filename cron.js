const cron = require('node-cron');
const fetch = require('node-fetch');
const db = require('./db');

// Cron job koji proverava bazu svakog minuta
cron.schedule('* * * * *', () => {
    console.log('Proveravam zakazane SMS poruke...');

    const query = `SELECT * FROM scheduled_sms WHERE sendAt <= NOW() AND status = 'pending'`;

    db.query(query, async (err, results) => {
        if (err) {
            console.error('Greška prilikom čitanja iz baze:', err.message);
            return;
        }

        for (const sms of results) {
            try {
                // Slanje SMS-a koristeći API
                const response = await fetch('https://api.smsagent.rs/v1/sms/bulk', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'EIVtX3IXREwa5NDcJ9NAZrnlEgnF3e5bsCSQvPWR8kyTJVCXKZFTbSEqAlv9O2Qj6xIkUROST3Bfz4juYtXHhUTH2Qk8fa67rQ65BugmOfwU9M113lSMSGBp5lfZBhwK',
                    },
                    body: JSON.stringify({
                        to: [sms.to],
                        message: sms.message,
                        from: sms.from,
                        type: sms.type,
                    }),
                });

                if (response.ok) {
                    console.log(`SMS poslat: ${sms.to}`);

                    // Ažuriraj status poruke na 'sent'
                    db.query(
                        `UPDATE scheduled_sms SET status = 'sent' WHERE id = ?`,
                        [sms.id],
                        (updateErr) => {
                            if (updateErr) {
                                console.error('Greška prilikom ažuriranja statusa:', updateErr.message);
                            }
                        }
                    );
                } else {
                    console.error('Greška prilikom slanja SMS-a:', await response.json());
                }
            } catch (error) {
                console.error('Greška prilikom komunikacije sa API-jem:', error.message);
            }
        }
    });
});

console.log('Cron job za slanje SMS-a je pokrenut.');
