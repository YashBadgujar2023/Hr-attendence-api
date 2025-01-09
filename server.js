const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cron = require('node-cron');
const markMissedCheckIns = require('./utlis/markMissedCheckIns'); 

process.on("uncaughtException", (err) => {
  console.log("UncaughtException 😒😒 Shutting down");
  console.log(err.name, err.message);
  process.exit(1);
});

cron.schedule('0 0 * * *', async () => {
  console.log('Running daily check for missed check-ins...');
  await markMissedCheckIns();
});

dotenv.config({ path: "./config.env" });
const app = require("./app");

const DB = process.env.DATABASE.replace(
  "<db_password>",
  process.env.DATABASE_PASSWORD
);

mongoose
  .connect(DB, {})
  .then(() => console.log("Database connected successfully"));

const port = process.env.PORT || 1000;
const server = app.listen(port, () => {
  console.log("App runing on the ", port);
});

process.on("unhandledRejection", (err) => {
  console.log("UNHANDLED REJECTION! 💥 Shutting down...");
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
