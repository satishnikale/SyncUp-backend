import express from "express";
import { createServer } from "node:http";
import mongoose from "mongoose";
import "dotenv/config";
import { Server } from "socket.io";
import cors from "cors";
import { connectToSocket } from "./controllers/socketManager.js";
import { MONGODB_URL, PORT } from "./config.js";
import userRoutes from "./routes/userRoutes.js";

const app = express();
const server = createServer(app);
const io = connectToSocket(server);

app.set("port", process.env.PORT || 3000);
const MONGO_URI = process.env.MONGODB_URL || process.env.MONGO_URL || process.env.DATABASE_URL;


app.use(cors());
app.use(express.json());
app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: true }));

app.use("/api/v1/users", userRoutes);

async function main() {
  server.listen(app.get("port"));
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  });
  console.log("DB Connected");
  console.log(`App is running on ${PORT}`);
}
main();
