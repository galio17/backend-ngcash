import { io } from "./app";
import { ITransferEmitter } from "./interfaces";

io.on("connection", (socket) => {
  socket.on("transferTransaction", (data: ITransferEmitter) => {
    socket.broadcast.emit("transferTransaction", data);
  });
});
