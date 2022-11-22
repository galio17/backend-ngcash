import "dotenv/config";
import "express-async-errors";

import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";

import router from "./routes";

const app = express();
export const server = http.createServer(app);
export const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());
app.use(router);
