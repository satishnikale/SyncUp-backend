import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import "dotenv/config";
import { Server } from "socket.io";
import cors from "cors";
import { connectToSocket } from "./controllers/socketManager.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 3000);

app.use(cors());
app.use(express.json());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.get("/", (req, res) => {
  res.json({
    message: "App is running",
  });
});

async function main() {
  server.listen(app.get("port"));
  await mongoose.connect(process.env.MONGODB_URL);
  console.log("DB Connected");
  console.log(`App is running on ${process.env.PORT}`);
}
main();
