import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import smsRouter from "./routes/sms.js";
import printRouter from "./routes/printRouter.js"; 
import cron from "node-cron";
import sendReminders from "./reminderScheduler.js";

// Scheduler koji se pokreće svakog dana u ponoć
cron.schedule("0 0 * * *", async () => {
  console.log("Pokrećem podsetnik za zakazane termine...");
  await sendReminders();
});


const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/api/send-sms", smsRouter);
app.use("/api/print-receipt", printRouter);

const PORT = 5000;
app.listen(PORT, () => console.log(`Server radi na http://localhost:${PORT}`));
