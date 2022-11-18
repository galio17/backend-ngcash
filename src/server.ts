import { server } from "./app";
import "./webSocket";

const port = process.env.PORT || 3000;

server.listen(port, () => {
  console.log("server is running on port 3000");
});
