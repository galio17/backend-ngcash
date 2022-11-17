import "dotenv/config";
import "express-async-errors";

import cors from "cors";
import express from "express";
import http from "http";

import router from "./routes";

const app = express();
export const server = http.createServer(app);

app.use(cors());
app.use(express.json());
app.use(router);
