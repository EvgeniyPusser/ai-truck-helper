import http from "http";
import app from "./app.js";

const PORT = process.env.PORT || 3001;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`[HolyMove] API listening on :${PORT}`);
});
