import express from "express";
import http from "http";

const app = express();
export const server = http.createServer(app);
