import "dotenv/config";

import http from "http";
import app from "./app.js";

const PORT = process.env.PORT || 3001;
const server = http.createServer(app);

console.log(
  "[HolyMove] ORS key present:",
  !!process.env.OPENROUTESERVICE_API_KEY,
  "len:",
  (process.env.OPENROUTESERVICE_API_KEY || "").length
);

server.listen(PORT, "0.0.0.0", () => {
  console.log(`[HolyMove] API listening on :${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || "development"}`);
});
