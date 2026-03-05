import "dotenv/config";
import http from "http";
import app from "./app.js";

// eslint-disable-next-line no-undef
const PORT = process.env.PORT || 3001;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`[HolyMove] API listening on :${PORT}`);
});
